import {
  ApplicationPayload,
  ApplicationRecord,
  Booking,
  CouponEmailStatus,
  EvidenceSubmission,
  EvidenceType,
  MenteeUser,
  PathAssignment,
  ProgressRecord,
  QuizAttempt,
  SubmissionStatus,
  calculateModuleProgress,
  calculatePathProgress,
  calculateUnitProgress,
  defaultCoupons,
  getAllLessons,
  getCurrentLesson,
  getInitialLessonId,
  getLessonContext,
  getPathById,
  mentorshipPaths,
} from './cybernurdin-data';
import { db, isFirebaseConfigured } from './firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const storagePrefix = 'cybernurdin_userflow_';
let firebaseSyncWarningShown = false;

type LocalTestAccount = {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  couponCode: string;
  pathId: string;
  createdAt: string;
};

export type ApplicationSubmissionResult = {
  applicationId: string;
  email: string;
  couponCode: string;
  pathTitle: string;
  emailStatus: CouponEmailStatus;
  emailSent: boolean;
  emailMessage: string;
};

type CouponRecord = {
  code: string;
  pathId: string;
  status: string;
  assignedTo?: string;
  applicationId?: string;
  createdAt?: string;
  redeemedBy?: string;
};

function now() {
  return new Date().toISOString();
}

function key(name: string) {
  return `${storagePrefix}${name}`;
}

function cleanIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function makeCouponCode(pathId: string) {
  const pathPrefix = pathId.replace(/^path-/, '').slice(0, 4).toUpperCase() || 'CN';
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CN-${pathPrefix}-${timePart}-${randomPart}`;
}

function readLocal<T>(name: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key(name));
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(name: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key(name), JSON.stringify(value));
}

function isFirebasePermissionError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'permission-denied'
  ) || String(error).toLowerCase().includes('missing or insufficient permissions');
}

async function syncFirebase<T>(label: string, operation: () => Promise<T>): Promise<T | undefined> {
  if (!isFirebaseConfigured || !db) return undefined;

  try {
    return await operation();
  } catch (error) {
    if (!firebaseSyncWarningShown) {
      const reason = isFirebasePermissionError(error)
        ? 'Firebase security rules denied this browser sync.'
        : `Firebase sync failed while trying to ${label}.`;
      console.warn(`${reason} Continuing with local browser state until Firestore rules or a server API are configured.`, error);
      firebaseSyncWarningShown = true;
    }
    return undefined;
  }
}

export function ensureLocalSeed() {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(key('seeded'))) return;

  writeLocal('mentorshipPaths', mentorshipPaths);
  writeLocal('coupons', defaultCoupons);
  writeLocal('applications', []);
  writeLocal('users', []);
  writeLocal('pathAssignments', []);
  writeLocal('progress', {});
  writeLocal('quizAttempts', []);
  writeLocal('bookings', []);
  writeLocal('sessions', []);
  writeLocal('recordings', []);
  writeLocal('notifications', []);
  writeLocal('testAccounts', []);
  writeLocal('submissions', []);
  window.localStorage.setItem(key('seeded'), 'true');
}

function saveGeneratedCoupon(coupon: CouponRecord) {
  const coupons = readLocal<CouponRecord[]>('coupons', defaultCoupons);
  writeLocal('coupons', [
    coupon,
    ...coupons.filter((item) => item.code.toLowerCase() !== coupon.code.toLowerCase()),
  ]);
}

function saveLatestRegistrationResult(result: ApplicationSubmissionResult) {
  writeLocal('latestRegistrationResult', result);
}

export function getLatestRegistrationResult() {
  return readLocal<ApplicationSubmissionResult | null>('latestRegistrationResult', null);
}

async function sendCouponEmail(payload: {
  email: string;
  firstName: string;
  couponCode: string;
  pathTitle: string;
}): Promise<Pick<ApplicationSubmissionResult, 'emailSent' | 'emailStatus' | 'emailMessage'>> {
  if (typeof window === 'undefined') {
    return {
      emailSent: false,
      emailStatus: 'failed',
      emailMessage: 'Coupon email can only be requested from the browser registration flow.',
    };
  }

  try {
    const response = await fetch('/api/coupons/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({})) as {
      sent?: boolean;
      status?: CouponEmailStatus;
      message?: string;
    };

    if (!response.ok) {
      return {
        emailSent: false,
        emailStatus: 'failed',
        emailMessage: result.message || 'Coupon email delivery failed.',
      };
    }

    return {
      emailSent: Boolean(result.sent),
      emailStatus: result.status || (result.sent ? 'sent' : 'not-configured'),
      emailMessage: result.message || (result.sent ? 'Coupon email sent.' : 'Email delivery is not configured yet.'),
    };
  } catch {
    return {
      emailSent: false,
      emailStatus: 'failed',
      emailMessage: 'Could not reach the coupon email service.',
    };
  }
}

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationSubmissionResult> {
  const { password: _password, ...safePayload } = payload;
  const path = getPathById(payload.preferredPathId) || mentorshipPaths[0];
  const couponCode = makeCouponCode(path.id);
  const record: ApplicationRecord = {
    ...safePayload,
    id: `application-${Date.now()}`,
    status: 'pending',
    couponCode,
    createdAt: now(),
  };

  const applications = readLocal<ApplicationRecord[]>('applications', []);
  writeLocal('applications', [record, ...applications]);
  saveGeneratedCoupon({
    code: couponCode,
    pathId: path.id,
    status: 'active',
    assignedTo: cleanIdentifier(payload.email),
    applicationId: record.id,
    createdAt: record.createdAt,
  });
  saveLocalTestAccount(payload, couponCode);

  await syncFirebase('submit application', async () => {
    await setDoc(doc(db, 'applications', record.id), {
      ...record,
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'coupons', couponCode), {
      code: couponCode,
      pathId: path.id,
      assignedPathId: path.id,
      status: 'active',
      assignedTo: cleanIdentifier(payload.email),
      applicationId: record.id,
      couponType: 'mentorship-access',
      createdAt: serverTimestamp(),
    });
    await setDoc(doc(db, 'notifications', `application-${record.id}`), {
      type: 'application_submitted',
      status: 'unread',
      applicationId: record.id,
      email: record.email,
      title: 'New mentorship application',
      body: `${record.firstName} ${record.lastName} applied for CyberNurdin mentorship.`,
      createdAt: serverTimestamp(),
    });
  });

  const emailResult = await sendCouponEmail({
    email: payload.email,
    firstName: payload.firstName,
    couponCode,
    pathTitle: path.title,
  });

  const updatedRecord: ApplicationRecord = {
    ...record,
    couponEmailStatus: emailResult.emailStatus,
    couponEmailMessage: emailResult.emailMessage,
  };
  writeLocal('applications', [
    updatedRecord,
    ...applications.filter((item) => item.id !== record.id),
  ]);

  const result: ApplicationSubmissionResult = {
    applicationId: record.id,
    email: cleanIdentifier(payload.email),
    couponCode,
    pathTitle: path.title,
    ...emailResult,
  };
  saveLatestRegistrationResult(result);

  await syncFirebase('update application email status', async () => {
    await updateDoc(doc(db, 'applications', record.id), {
      couponEmailStatus: emailResult.emailStatus,
      couponEmailMessage: emailResult.emailMessage,
    });
  });

  return result;
}

async function resolveCoupon(couponCode: string) {
  const remoteCoupon = await syncFirebase('resolve coupon', async () => {
    const snap = await getDoc(doc(db, 'coupons', couponCode));
    if (snap.exists()) {
      const coupon = snap.data() as { code?: string; pathId?: string; status?: string; redeemedBy?: string };
      return { code: coupon.code || couponCode, ...coupon };
    }
    return null;
  });

  if (remoteCoupon) return remoteCoupon;

  const coupons = readLocal<CouponRecord[]>('coupons', defaultCoupons);
  return coupons.find((coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()) || null;
}

function saveRedeemedCoupon(couponCode: string, email: string) {
  const coupons = readLocal<CouponRecord[]>('coupons', defaultCoupons);
  const updated = coupons.map((coupon) =>
    coupon.code.toLowerCase() === couponCode.toLowerCase()
      ? { ...coupon, status: 'redeemed', redeemedBy: email }
      : coupon,
  );
  writeLocal('coupons', updated);
}

function makeUserId(identifier: string) {
  return identifier.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `user-${Date.now()}`;
}

function makeEmail(identifier: string) {
  return identifier.includes('@') ? cleanIdentifier(identifier) : `${cleanIdentifier(identifier)}@cybernurdin.local`;
}

function findLocalTestAccount(identifier: string) {
  const normalized = cleanIdentifier(identifier);
  const accounts = readLocal<LocalTestAccount[]>('testAccounts', []);
  return accounts.find((account) =>
    account.email === normalized ||
    account.username.toLowerCase() === normalized
  ) || null;
}

function makeLessonProgress(
  lessonContext: NonNullable<ReturnType<typeof getLessonContext>>,
  state: 'locked' | 'unlocked' | 'in-progress' | 'completed' = 'unlocked',
  update: Partial<ProgressRecord['lessons'][string]> = {},
) {
  const lessonCompleted = update.lessonCompleted ?? (update.state === 'completed' || state === 'completed');
  return {
    state: update.state || state,
    pathId: lessonContext.pathId,
    unitId: lessonContext.unitId,
    moduleId: lessonContext.moduleId,
    lessonId: lessonContext.id,
    videoCompleted: update.videoCompleted || lessonCompleted || false,
    slidesCompleted: update.slidesCompleted || lessonCompleted || false,
    quizPassed: update.quizPassed || lessonCompleted || false,
    lessonCompleted,
    moduleCompleted: update.moduleCompleted || false,
    unitCompleted: update.unitCompleted || false,
    pathCompleted: update.pathCompleted || false,
    progressPercent: update.progressPercent ?? (lessonCompleted ? 100 : 0),
    score: update.score,
    updatedAt: now(),
  };
}

function defaultProgress(userId: string, pathId: string): ProgressRecord {
  const path = getPathById(pathId) || mentorshipPaths[0];
  const currentLesson = getCurrentLesson(path);
  const currentLessonId = currentLesson?.id || getInitialLessonId(path);
  return {
    id: `${userId}_${pathId}`,
    userId,
    pathId,
    currentUnitId: currentLesson?.unitId || path.units[0]?.id || '',
    currentModuleId: currentLesson?.moduleId || path.units[0]?.modules[0]?.id || '',
    currentLessonId,
    completedPathIds: [],
    lessons: currentLesson && currentLessonId
      ? {
          [currentLessonId]: makeLessonProgress(currentLesson, 'unlocked'),
        }
      : {},
    modules: {},
    units: {},
    progressPercent: 0,
    pathCompleted: false,
    updatedAt: now(),
  };
}

function activateLocalUser(user: MenteeUser, pathId: string, startSession = true) {
  const users = readLocal<MenteeUser[]>('users', []);
  writeLocal('users', [
    user,
    ...users.filter((item) => item.id !== user.id),
  ]);

  const assignments = readLocal<PathAssignment[]>('pathAssignments', []);
  const withoutActiveForUser = assignments.map((assignment) =>
    assignment.userId === user.id && assignment.status === 'active'
      ? { ...assignment, status: 'paused' as const }
      : assignment,
  );
  const activeAssignment: PathAssignment = {
    id: `assignment-${user.id}-${pathId}`,
    userId: user.id,
    pathId,
    status: 'active',
    assignedAt: now(),
  };
  const nextAssignments = [
    activeAssignment,
    ...withoutActiveForUser.filter((assignment) => assignment.id !== activeAssignment.id),
  ];

  const progressMap = readLocal<Record<string, ProgressRecord>>('progress', {});
  const progress = progressMap[`${user.id}_${pathId}`] || defaultProgress(user.id, pathId);
  activeAssignment.currentUnitId = progress.currentUnitId;
  activeAssignment.currentModuleId = progress.currentModuleId;
  activeAssignment.currentLessonId = progress.currentLessonId;
  activeAssignment.progressPercent = progress.progressPercent || 0;
  writeLocal('pathAssignments', nextAssignments);
  progressMap[progress.id] = progress;
  writeLocal('progress', progressMap);
  if (startSession) {
    window.localStorage.setItem(key('activeUser'), JSON.stringify(user));
  }

  return { progress, assignments: nextAssignments, activeAssignment };
}

function saveLocalTestAccount(payload: ApplicationPayload, couponCode: string) {
  if (!payload.password?.trim()) return;

  const email = cleanIdentifier(payload.email);
  const username = cleanIdentifier(payload.username);
  const pathId = payload.preferredPathId || mentorshipPaths[0].id;
  const userId = makeUserId(email || username);
  const fullName = `${payload.firstName} ${payload.lastName}`.trim() || username || email;
  const user: MenteeUser = {
    id: userId,
    fullName,
    username,
    email,
    status: 'approved',
    activePathId: pathId,
    couponCode,
    completedPathIds: [],
    createdAt: now(),
  };
  const accounts = readLocal<LocalTestAccount[]>('testAccounts', []);
  const account: LocalTestAccount = {
    userId,
    fullName,
    username,
    email,
    password: payload.password,
    couponCode,
    pathId,
    createdAt: now(),
  };

  writeLocal('testAccounts', [
    account,
    ...accounts.filter((item) => item.email !== email && item.username !== username),
  ]);
  activateLocalUser(user, pathId, false);
}

export async function loginWithAccess(identifier: string, password: string, couponCode: string): Promise<{
  user: MenteeUser;
  progress: ProgressRecord;
  assignments: PathAssignment[];
}> {
  if (!identifier.trim()) throw new Error('Email or username is required.');
  if (!password.trim()) throw new Error('Password is required.');

  const localAccount = findLocalTestAccount(identifier);
  if (localAccount) {
    if (localAccount.password !== password) {
      throw new Error('Incorrect password for this test account.');
    }
    if (!couponCode.trim()) {
      throw new Error('Enter the coupon code sent to your email.');
    }
    if (localAccount.couponCode.toLowerCase() !== couponCode.trim().toLowerCase()) {
      throw new Error('Coupon code does not match this account.');
    }

    const user: MenteeUser = {
      id: localAccount.userId,
      fullName: localAccount.fullName,
      username: localAccount.username,
      email: localAccount.email,
      status: 'approved',
      activePathId: localAccount.pathId,
      couponCode: localAccount.couponCode,
      completedPathIds: [],
      createdAt: localAccount.createdAt,
    };
    const { progress, assignments, activeAssignment } = activateLocalUser(user, localAccount.pathId);

    await syncFirebase('verify test login', async () => {
      await setDoc(doc(db, 'users', user.id), user);
      await setDoc(doc(db, 'pathAssignments', activeAssignment.id), activeAssignment);
      await setDoc(doc(db, 'progress', progress.id), progress);
    });

    return { user, progress, assignments };
  }

  if (!couponCode.trim()) throw new Error('Apply first to create a test account, or enter a coupon code.');

  const coupon = await resolveCoupon(couponCode.trim());
  if (!coupon || coupon.status !== 'active') {
    throw new Error('Invalid or inactive coupon. Use the coupon sent after approval.');
  }

  const pathId = coupon.pathId || mentorshipPaths[0].id;
  const userId = makeUserId(identifier.includes('@') ? identifier : `${identifier}@local`);
  const email = makeEmail(identifier);

  const users = readLocal<MenteeUser[]>('users', []);
  let user = users.find((item) => item.email === email || item.username.toLowerCase() === identifier.trim().toLowerCase());

  if (!user) {
    user = {
      id: userId,
      fullName: identifier.includes('@') ? identifier.split('@')[0] : identifier.trim(),
      username: identifier.includes('@') ? identifier.split('@')[0] : identifier.trim(),
      email,
      status: 'approved',
      activePathId: pathId,
      couponCode: couponCode.trim(),
      completedPathIds: [],
      createdAt: now(),
    };
    writeLocal('users', [user, ...users]);
  } else {
    user = { ...user, status: 'approved', activePathId: pathId, couponCode: couponCode.trim() };
    writeLocal(
      'users',
      users.map((item) => (item.id === user?.id ? user as MenteeUser : item)),
    );
  }

  saveRedeemedCoupon(couponCode.trim(), email);

  const { progress, assignments, activeAssignment } = activateLocalUser(user, pathId);

  await syncFirebase('verify coupon login', async () => {
    await setDoc(doc(db, 'users', user.id), user);
    await setDoc(doc(db, 'pathAssignments', activeAssignment.id), activeAssignment);
    await setDoc(doc(db, 'progress', progress.id), progress);
    await updateDoc(doc(db, 'coupons', couponCode.trim()), {
      status: 'redeemed',
      redeemedBy: email,
      redeemedAt: serverTimestamp(),
    }).catch(() => undefined);
    await setDoc(doc(db, 'notifications', `access-${user.id}-${Date.now()}`), {
      type: 'access_verified',
      status: 'unread',
      userId: user.id,
      pathId,
      title: 'Mentorship access verified',
      body: 'Your CyberNurdin dashboard access is active.',
      createdAt: serverTimestamp(),
    });
  });

  return { user, progress, assignments };
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key('activeUser'));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MenteeUser;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key('activeUser'));
}

export function getProgress(userId: string, pathId: string) {
  const progressMap = readLocal<Record<string, ProgressRecord>>('progress', {});
  return progressMap[`${userId}_${pathId}`] || defaultProgress(userId, pathId);
}

export async function updateLessonProgress(
  userId: string,
  pathId: string,
  lessonId: string,
  update: Partial<ProgressRecord['lessons'][string]> & { currentLessonId?: string },
) {
  const progressMap = readLocal<Record<string, ProgressRecord>>('progress', {});
  const progress = progressMap[`${userId}_${pathId}`] || defaultProgress(userId, pathId);
  const path = getPathById(pathId) || mentorshipPaths[0];
  const lessonContext = getLessonContext(path, lessonId);
  if (!lessonContext) return progress;
  const current = progress.lessons[lessonId] || makeLessonProgress(lessonContext, 'unlocked');
  const lessonCompleted = update.lessonCompleted ?? (
    update.state === 'completed' ||
    Boolean(update.videoCompleted && update.slidesCompleted && update.quizPassed) ||
    Boolean(current.videoCompleted && current.slidesCompleted && current.quizPassed && update.quizPassed !== false)
  );

  const nextProgress: ProgressRecord = {
    ...progress,
    currentUnitId: lessonContext.unitId,
    currentModuleId: lessonContext.moduleId,
    currentLessonId: update.currentLessonId || progress.currentLessonId || lessonId,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        ...current,
        ...update,
        pathId,
        unitId: lessonContext.unitId,
        moduleId: lessonContext.moduleId,
        lessonId,
        lessonCompleted,
        progressPercent: lessonCompleted ? 100 : Math.round([
          update.videoCompleted ?? current.videoCompleted,
          update.slidesCompleted ?? current.slidesCompleted,
          update.quizPassed ?? current.quizPassed,
        ].filter(Boolean).length / 3 * 100),
        updatedAt: now(),
      },
    },
    modules: { ...progress.modules },
    units: { ...progress.units },
    updatedAt: now(),
  };

  const modulePercent = calculateModuleProgress(lessonContext.module, nextProgress);
  const unitPercent = calculateUnitProgress(lessonContext.unit, nextProgress);
  const pathPercent = calculatePathProgress(path, nextProgress);
  const moduleCompleted = modulePercent === 100;
  const unitCompleted = unitPercent === 100;
  const pathCompleted = pathPercent === 100;

  nextProgress.lessons[lessonId] = {
    ...nextProgress.lessons[lessonId],
    moduleCompleted,
    unitCompleted,
    pathCompleted,
  };
  nextProgress.modules[lessonContext.moduleId] = {
    moduleId: lessonContext.moduleId,
    unitId: lessonContext.unitId,
    state: moduleCompleted ? 'completed' : modulePercent > 0 ? 'in-progress' : 'unlocked',
    progressPercent: modulePercent,
    completed: moduleCompleted,
  };
  nextProgress.units[lessonContext.unitId] = {
    unitId: lessonContext.unitId,
    state: unitCompleted ? 'completed' : unitPercent > 0 ? 'in-progress' : 'unlocked',
    progressPercent: unitPercent,
    completed: unitCompleted,
  };
  nextProgress.progressPercent = pathPercent;
  nextProgress.pathCompleted = pathCompleted;

  if (lessonCompleted || update.state === 'completed') {
    const allLessons = getAllLessons(path);
    const index = allLessons.findIndex((lessonItem) => lessonItem.id === lessonId);
    const nextLesson = allLessons[index + 1];
    if (nextLesson) {
      if (!nextProgress.lessons[nextLesson.id]) {
        nextProgress.lessons[nextLesson.id] = makeLessonProgress(nextLesson, 'unlocked');
      }
      nextProgress.currentUnitId = nextLesson.unitId;
      nextProgress.currentModuleId = nextLesson.moduleId;
      nextProgress.currentLessonId = nextLesson.id;
    } else {
      nextProgress.completedPathIds = Array.from(new Set([...nextProgress.completedPathIds, pathId]));
    }
  }

  progressMap[nextProgress.id] = nextProgress;
  writeLocal('progress', progressMap);

  await syncFirebase('update lesson progress', async () => {
    await setDoc(doc(db, 'progress', nextProgress.id), nextProgress);
  });

  return nextProgress;
}

export async function saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'createdAt'>) {
  const record: QuizAttempt = {
    ...attempt,
    id: `attempt-${Date.now()}`,
    createdAt: now(),
  };

  const attempts = readLocal<QuizAttempt[]>('quizAttempts', []);
  writeLocal('quizAttempts', [record, ...attempts]);

  await syncFirebase('save quiz attempt', async () => {
    await addDoc(collection(db, 'quizAttempts'), record);
    await setDoc(doc(db, 'notifications', `quiz-${record.id}`), {
      type: 'quiz_attempt_saved',
      status: 'unread',
      userId: record.userId,
      pathId: record.pathId,
      lessonId: record.lessonId,
      quizId: record.quizId,
      score: record.score,
      passed: record.passed,
      title: record.passed ? 'Quiz passed' : 'Quiz attempt saved',
      body: `Score: ${record.score}%.`,
      createdAt: serverTimestamp(),
    });
  });

  return record;
}

export async function createBooking(payload: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
  const scheduledAt = payload.scheduledAt || `${payload.date} ${payload.time}`;
  const record: Booking = {
    ...payload,
    id: `booking-${Date.now()}`,
    title: payload.title || payload.topic,
    description: payload.description || `CyberNurdin mentorship session for ${payload.topic}.`,
    menteeId: payload.menteeId || payload.userId,
    scheduledAt,
    duration: payload.duration || 60,
    status: 'scheduled',
    createdAt: now(),
    updatedAt: now(),
  };

  const bookings = readLocal<Booking[]>('bookings', []);
  writeLocal('bookings', [record, ...bookings]);
  const sessions = readLocal<Booking[]>('sessions', []);
  writeLocal('sessions', [record, ...sessions]);

  await syncFirebase('create booking', async () => {
    await setDoc(doc(db, 'sessions', record.id), record);
    await setDoc(doc(db, 'notifications', `booking-${record.id}`), {
      type: 'mentor_session_booked',
      status: 'unread',
      userId: record.userId,
      pathId: record.pathId,
      bookingId: record.id,
      title: 'Mentor session booked',
      body: `${record.topic} with ${record.mentorName} on ${record.date} at ${record.time}.`,
      createdAt: serverTimestamp(),
    });
  });

  return record;
}

export function getBookings(userId: string) {
  return readLocal<Booking[]>('bookings', []).filter((booking) => booking.userId === userId);
}

export async function createSubmission(payload: {
  userId: string;
  pathId: string;
  unitId: string;
  moduleId: string;
  lessonId: string;
  evidenceUrl: string;
  evidenceType: EvidenceType;
  notes: string;
}): Promise<EvidenceSubmission> {
  const existing = readLocal<EvidenceSubmission[]>('submissions', []);
  const duplicate = existing.find((sub) => sub.userId === payload.userId && sub.lessonId === payload.lessonId);
  const record: EvidenceSubmission = {
    ...(duplicate || {}),
    ...payload,
    id: duplicate?.id || `submission-${Date.now()}`,
    status: 'pending',
    mentorFeedback: undefined,
    submittedAt: now(),
    reviewedAt: undefined,
    reviewedBy: undefined,
  };

  const updated = duplicate
    ? existing.map((sub) => (sub.id === record.id ? record : sub))
    : [record, ...existing];
  writeLocal('submissions', updated);

  await syncFirebase('create submission', async () => {
    await setDoc(doc(db, 'submissions', record.id), { ...record, submittedAt: serverTimestamp() });
    await setDoc(doc(db, 'notifications', `submission-${record.id}`), {
      type: 'evidence_submitted',
      status: 'unread',
      userId: record.userId,
      pathId: record.pathId,
      lessonId: record.lessonId,
      submissionId: record.id,
      title: 'Evidence submitted',
      body: `New evidence submitted for lesson review.`,
      createdAt: serverTimestamp(),
    });
  });

  return record;
}

export function getSubmissions(userId: string): EvidenceSubmission[] {
  return readLocal<EvidenceSubmission[]>('submissions', []).filter((sub) => sub.userId === userId);
}

export function getAllSubmissions(): EvidenceSubmission[] {
  return readLocal<EvidenceSubmission[]>('submissions', []);
}

export function getLessonSubmission(userId: string, lessonId: string): EvidenceSubmission | undefined {
  return readLocal<EvidenceSubmission[]>('submissions', []).find(
    (sub) => sub.userId === userId && sub.lessonId === lessonId,
  );
}

export async function reviewSubmission(
  submissionId: string,
  status: SubmissionStatus,
  mentorFeedback: string,
  reviewedBy = 'admin',
): Promise<EvidenceSubmission | undefined> {
  const all = readLocal<EvidenceSubmission[]>('submissions', []);
  const record = all.find((sub) => sub.id === submissionId);
  if (!record) return undefined;

  const updated: EvidenceSubmission = {
    ...record,
    status,
    mentorFeedback,
    reviewedAt: now(),
    reviewedBy,
  };

  writeLocal('submissions', all.map((sub) => (sub.id === submissionId ? updated : sub)));

  await syncFirebase('review submission', async () => {
    await updateDoc(doc(db, 'submissions', submissionId), {
      status,
      mentorFeedback,
      reviewedAt: serverTimestamp(),
      reviewedBy,
    });
    await setDoc(doc(db, 'notifications', `review-${submissionId}`), {
      type: 'submission_reviewed',
      status: 'unread',
      userId: record.userId,
      pathId: record.pathId,
      lessonId: record.lessonId,
      submissionId,
      reviewStatus: status,
      title: status === 'approved' ? 'Evidence approved' : 'Evidence needs revision',
      body: mentorFeedback || (status === 'approved' ? 'Your evidence has been approved.' : 'Your evidence was not accepted. Check mentor feedback.'),
      createdAt: serverTimestamp(),
    });
  });

  return updated;
}
