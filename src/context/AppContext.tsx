'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ApplicationPayload,
  Booking,
  EvidenceSubmission,
  EvidenceType,
  MenteeUser,
  PathAssignment,
  ProgressRecord,
  getLessonContext,
  getPathById,
  mentorshipPaths,
} from '@/lib/cybernurdin-data';
import {
  ApplicationSubmissionResult,
  clearStoredUser,
  createBooking as createBookingRecord,
  createSubmission,
  ensureLocalSeed,
  getBookings,
  getProgress,
  getStoredUser,
  getSubmissions,
  loginWithAccess,
  saveQuizAttempt,
  submitApplication,
  updateLessonProgress,
} from '@/lib/cybernurdin-service';

type Toast = { message: string; type: 'success' | 'danger' | 'info' } | null;

type AppContextType = {
  user: MenteeUser | null;
  isLoadingUser: boolean;
  paths: typeof mentorshipPaths;
  progress: ProgressRecord | null;
  bookings: Booking[];
  assignments: PathAssignment[];
  submissions: EvidenceSubmission[];
  toast: Toast;
  triggerToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  applyForMentorship: (payload: ApplicationPayload) => Promise<ApplicationSubmissionResult>;
  login: (identifier: string, password: string, couponCode: string) => Promise<MenteeUser>;
  logout: () => void;
  refreshProgress: () => void;
  updateProgress: (lessonId: string, update: Parameters<typeof updateLessonProgress>[3]) => Promise<void>;
  gradeQuiz: (lessonId: string, quizId: string, score: number, passed: boolean, answers: Record<string, number>) => Promise<void>;
  bookSession: (payload: { topic: string; date: string; time: string; mentorName: string }) => Promise<void>;
  submitEvidence: (payload: { lessonId: string; unitId: string; moduleId: string; evidenceUrl: string; evidenceType: EvidenceType; notes: string }) => Promise<EvidenceSubmission>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MenteeUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<PathAssignment[]>([]);
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const [toast, setToast] = useState<Toast>(null);

  const triggerToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3600);
  };

  useEffect(() => {
    ensureLocalSeed();
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setProgress(getProgress(storedUser.id, storedUser.activePathId));
      setBookings(getBookings(storedUser.id));
      setSubmissions(getSubmissions(storedUser.id));
    }
    setIsLoadingUser(false);
  }, []);

  const refreshProgress = () => {
    if (!user) return;
    setProgress(getProgress(user.id, user.activePathId));
    setBookings(getBookings(user.id));
    setSubmissions(getSubmissions(user.id));
  };

  const applyForMentorship = async (payload: ApplicationPayload) => {
    const result = await submitApplication(payload);
    triggerToast(
      result.emailSent
        ? 'Account created. Coupon email queued through Firebase.'
        : 'Account created. Coupon code is shown on the success screen.',
      result.emailSent ? 'success' : 'info',
    );
    return result;
  };

  const login = async (identifier: string, password: string, couponCode: string) => {
    const result = await loginWithAccess(identifier, password, couponCode);
    setUser(result.user);
    setProgress(result.progress);
    setAssignments(result.assignments);
    setBookings(getBookings(result.user.id));
    setSubmissions(getSubmissions(result.user.id));
    triggerToast('Access verified. Welcome to your mentorship dashboard.', 'success');
    return result.user;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
    setProgress(null);
    setAssignments([]);
    setBookings([]);
    setSubmissions([]);
    triggerToast('Secure session ended.', 'info');
  };

  const updateProgress = async (lessonId: string, update: Parameters<typeof updateLessonProgress>[3]) => {
    if (!user) return;
    const next = await updateLessonProgress(user.id, user.activePathId, lessonId, update);
    setProgress(next);
  };

  const gradeQuiz = async (
    lessonId: string,
    quizId: string,
    score: number,
    passed: boolean,
    answers: Record<string, number>,
  ) => {
    if (!user) return;
    const path = getPathById(user.activePathId);
    const lessonContext = path ? getLessonContext(path, lessonId) : null;
    await saveQuizAttempt({
      userId: user.id,
      pathId: user.activePathId,
      unitId: lessonContext?.unitId,
      moduleId: lessonContext?.moduleId,
      lessonId,
      quizId,
      score,
      passed,
      answers,
    });
  };

  const bookSession = async (payload: { topic: string; date: string; time: string; mentorName: string }) => {
    if (!user) return;
    const created = await createBookingRecord({
      userId: user.id,
      pathId: user.activePathId,
      mentorName: payload.mentorName,
      topic: payload.topic,
      date: payload.date,
      time: payload.time,
    });
    setBookings((items) => [created, ...items]);
    triggerToast('Mentor session booked.', 'success');
  };

  const submitEvidence = async (payload: {
    lessonId: string;
    unitId: string;
    moduleId: string;
    evidenceUrl: string;
    evidenceType: EvidenceType;
    notes: string;
  }) => {
    if (!user) throw new Error('Not authenticated');
    const record = await createSubmission({
      userId: user.id,
      pathId: user.activePathId,
      ...payload,
    });
    setSubmissions((prev) => {
      const without = prev.filter((sub) => sub.id !== record.id);
      return [record, ...without];
    });
    triggerToast('Evidence submitted. Your mentor will review it shortly.', 'success');
    return record;
  };

  const value = useMemo<AppContextType>(
    () => ({
      user,
      isLoadingUser,
      paths: mentorshipPaths,
      progress,
      bookings,
      assignments,
      submissions,
      toast,
      triggerToast,
      applyForMentorship,
      login,
      logout,
      refreshProgress,
      updateProgress,
      gradeQuiz,
      bookSession,
      submitEvidence,
    }),
    [user, isLoadingUser, progress, bookings, assignments, submissions, toast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
