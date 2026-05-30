import {
  ApplicationPayload,
  ApplicationRecord,
  Booking,
  MenteeUser,
  PathAssignment,
  ProgressRecord,
  QuizAttempt,
  defaultCoupons,
  getInitialLessonId,
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

function now() {
  return new Date().toISOString();
}

function key(name: string) {
  return `${storagePrefix}${name}`;
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
  writeLocal('notifications', []);
  window.localStorage.setItem(key('seeded'), 'true');
}

export async function submitApplication(payload: ApplicationPayload): Promise<ApplicationRecord> {
  const { password: _password, ...safePayload } = payload;
  const record: ApplicationRecord = {
    ...safePayload,
    id: `application-${Date.now()}`,
    status: 'pending',
    createdAt: now(),
  };

  const applications = readLocal<ApplicationRecord[]>('applications', []);
  writeLocal('applications', [record, ...applications]);

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'applications', record.id), {
      ...record,
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
  }

  return record;
}

async function resolveCoupon(couponCode: string) {
  if (isFirebaseConfigured && db) {
    const snap = await getDoc(doc(db, 'coupons', couponCode));
    if (snap.exists()) {
      const coupon = snap.data() as { code?: string; pathId?: string; status?: string; redeemedBy?: string };
      return { code: coupon.code || couponCode, ...coupon };
    }
  }

  const coupons = readLocal<Array<{ code: string; pathId: string; status: string; redeemedBy?: string }>>('coupons', defaultCoupons);
  return coupons.find((coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()) || null;
}

function saveRedeemedCoupon(couponCode: string, email: string) {
  const coupons = readLocal<Array<{ code: string; pathId: string; status: string; redeemedBy?: string }>>('coupons', defaultCoupons);
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

function defaultProgress(userId: string, pathId: string): ProgressRecord {
  const path = getPathById(pathId) || mentorshipPaths[0];
  const currentLessonId = getInitialLessonId(path);
  return {
    id: `${userId}_${pathId}`,
    userId,
    pathId,
    currentLessonId,
    completedPathIds: [],
    lessons: currentLessonId
      ? {
          [currentLessonId]: {
            state: 'unlocked',
            videoCompleted: false,
            slidesCompleted: false,
            quizPassed: false,
            updatedAt: now(),
          },
        }
      : {},
    updatedAt: now(),
  };
}

export async function loginWithCoupon(identifier: string, password: string, couponCode: string): Promise<{
  user: MenteeUser;
  progress: ProgressRecord;
  assignments: PathAssignment[];
}> {
  if (!identifier.trim()) throw new Error('Email or username is required.');
  if (!password.trim()) throw new Error('Password is required.');
  if (!couponCode.trim()) throw new Error('Coupon code is required.');

  const coupon = await resolveCoupon(couponCode.trim());
  if (!coupon || coupon.status !== 'active') {
    throw new Error('Invalid or inactive coupon. Use the coupon sent after approval.');
  }

  const pathId = coupon.pathId || mentorshipPaths[0].id;
  const userId = makeUserId(identifier.includes('@') ? identifier : `${identifier}@local`);
  const email = identifier.includes('@') ? identifier.trim().toLowerCase() : `${identifier.trim().toLowerCase()}@cybernurdin.local`;

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

  const assignments = readLocal<PathAssignment[]>('pathAssignments', []);
  const withoutActiveForUser = assignments.map((assignment) =>
    assignment.userId === user?.id && assignment.status === 'active'
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
  writeLocal('pathAssignments', nextAssignments);

  const progressMap = readLocal<Record<string, ProgressRecord>>('progress', {});
  const progress = progressMap[`${user.id}_${pathId}`] || defaultProgress(user.id, pathId);
  progressMap[progress.id] = progress;
  writeLocal('progress', progressMap);
  window.localStorage.setItem(key('activeUser'), JSON.stringify(user));

  if (isFirebaseConfigured && db) {
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
  }

  return { user, progress, assignments: nextAssignments };
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
  const current = progress.lessons[lessonId] || {
    state: 'unlocked' as const,
    videoCompleted: false,
    slidesCompleted: false,
    quizPassed: false,
    updatedAt: now(),
  };

  const nextProgress: ProgressRecord = {
    ...progress,
    currentLessonId: update.currentLessonId || progress.currentLessonId || lessonId,
    lessons: {
      ...progress.lessons,
      [lessonId]: {
        ...current,
        ...update,
        updatedAt: now(),
      },
    },
    updatedAt: now(),
  };

  if (update.state === 'completed') {
    const path = getPathById(pathId);
    const allLessons = path?.modules.flatMap((module) => module.lessons) || [];
    const index = allLessons.findIndex((lessonItem) => lessonItem.id === lessonId);
    const nextLesson = allLessons[index + 1];
    if (nextLesson && !nextProgress.lessons[nextLesson.id]) {
      nextProgress.lessons[nextLesson.id] = {
        state: 'unlocked',
        videoCompleted: false,
        slidesCompleted: false,
        quizPassed: false,
        updatedAt: now(),
      };
      nextProgress.currentLessonId = nextLesson.id;
    }
  }

  progressMap[nextProgress.id] = nextProgress;
  writeLocal('progress', progressMap);

  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'progress', nextProgress.id), nextProgress);
  }

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

  if (isFirebaseConfigured && db) {
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
  }

  return record;
}

export async function createBooking(payload: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
  const record: Booking = {
    ...payload,
    id: `booking-${Date.now()}`,
    status: 'scheduled',
    createdAt: now(),
  };

  const bookings = readLocal<Booking[]>('bookings', []);
  writeLocal('bookings', [record, ...bookings]);

  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, 'bookings'), record);
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
  }

  return record;
}

export function getBookings(userId: string) {
  return readLocal<Booking[]>('bookings', []).filter((booking) => booking.userId === userId);
}
