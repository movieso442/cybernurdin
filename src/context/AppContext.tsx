'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ApplicationPayload,
  Booking,
  MenteeUser,
  PathAssignment,
  ProgressRecord,
  mentorshipPaths,
} from '@/lib/cybernurdin-data';
import {
  clearStoredUser,
  createBooking as createBookingRecord,
  ensureLocalSeed,
  getBookings,
  getProgress,
  getStoredUser,
  loginWithCoupon,
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
  toast: Toast;
  triggerToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  applyForMentorship: (payload: ApplicationPayload) => Promise<void>;
  login: (identifier: string, password: string, couponCode: string) => Promise<MenteeUser>;
  logout: () => void;
  refreshProgress: () => void;
  updateProgress: (lessonId: string, update: Parameters<typeof updateLessonProgress>[3]) => Promise<void>;
  gradeQuiz: (lessonId: string, quizId: string, score: number, passed: boolean, answers: Record<string, number>) => Promise<void>;
  bookSession: (payload: { topic: string; date: string; time: string; mentorName: string }) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MenteeUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignments, setAssignments] = useState<PathAssignment[]>([]);
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
    }
    setIsLoadingUser(false);
  }, []);

  const refreshProgress = () => {
    if (!user) return;
    setProgress(getProgress(user.id, user.activePathId));
    setBookings(getBookings(user.id));
  };

  const applyForMentorship = async (payload: ApplicationPayload) => {
    await submitApplication(payload);
    triggerToast('Application submitted. Your coupon is sent after approval.', 'success');
  };

  const login = async (identifier: string, password: string, couponCode: string) => {
    const result = await loginWithCoupon(identifier, password, couponCode);
    setUser(result.user);
    setProgress(result.progress);
    setAssignments(result.assignments);
    setBookings(getBookings(result.user.id));
    triggerToast('Access verified. Welcome to your mentorship dashboard.', 'success');
    return result.user;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
    setProgress(null);
    setAssignments([]);
    setBookings([]);
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
    await saveQuizAttempt({
      userId: user.id,
      pathId: user.activePathId,
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

  const value = useMemo<AppContextType>(
    () => ({
      user,
      isLoadingUser,
      paths: mentorshipPaths,
      progress,
      bookings,
      assignments,
      toast,
      triggerToast,
      applyForMentorship,
      login,
      logout,
      refreshProgress,
      updateProgress,
      gradeQuiz,
      bookSession,
    }),
    [user, isLoadingUser, progress, bookings, assignments, toast],
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
