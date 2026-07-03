'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Booking,
  EvidenceSubmission,
  EvidenceType,
  ProgressRecord,
  getPathBySlug,
} from '@/lib/cybernurdin-data';
import { createClient } from '@/lib/supabase/client';
import { adaptSubmissions, buildProgressRecord, CourseProgressRow, EnrollmentRow, SubmissionRow } from '@/lib/progress-adapter';
import { createSubmission as createSubmissionAction } from '@/lib/actions/submissions';

const DEFAULT_PATH_SLUG = 'introduction-to-cybersecurity';

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accessStatus: string;
  selectedPath: string | null;
  /** Convenience alias for selectedPath, kept for existing call sites. */
  activePathId: string;
};

type Toast = { message: string; type: 'success' | 'danger' | 'info' } | null;

type AppContextType = {
  user: SessionUser | null;
  isLoadingUser: boolean;
  progress: ProgressRecord | null;
  submissions: EvidenceSubmission[];
  bookings: Booking[];
  toast: Toast;
  triggerToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  updateProgress: (lessonId: string, update: Partial<{ videoCompleted: boolean; slidesCompleted: boolean; quizPassed: boolean; state: string; score: number }>) => Promise<void>;
  gradeQuiz: (lessonId: string, quizId: string, score: number, passed: boolean, answers: Record<string, number>) => Promise<void>;
  bookSession: (payload: { topic: string; date: string; time: string; mentorName: string }) => Promise<void>;
  submitEvidence: (payload: { lessonId: string; unitId: string; moduleId: string; evidenceUrl: string; evidenceType: EvidenceType; notes: string }) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const [toast, setToast] = useState<Toast>(null);

  const triggerToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3600);
  };

  const loadSessionData = useCallback(async (authUserId: string) => {
    const supabase = createClient();

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUserId).single();
    if (!profile) {
      setUser(null);
      setProgress(null);
      setSubmissions([]);
      return;
    }

    const selectedPath = profile.selected_path || DEFAULT_PATH_SLUG;
    setUser({
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      role: profile.role,
      accessStatus: profile.access_status,
      selectedPath: profile.selected_path,
      activePathId: selectedPath,
    });

    const path = getPathBySlug(selectedPath);
    if (!path) return;

    const [{ data: enrollment }, { data: progressRows }, { data: submissionRows }] = await Promise.all([
      supabase.from('enrollments').select('*').eq('user_id', authUserId).eq('path_id', selectedPath).maybeSingle(),
      supabase.from('course_progress').select('*').eq('user_id', authUserId).eq('path_id', selectedPath),
      supabase.from('submissions').select('*').eq('user_id', authUserId).eq('path_id', selectedPath),
    ]);

    setProgress(buildProgressRecord(path, (enrollment as EnrollmentRow) || null, (progressRows as CourseProgressRow[]) || []));
    setSubmissions(adaptSubmissions(path, (submissionRows as SubmissionRow[]) || []));
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        loadSessionData(authUser.id).finally(() => setIsLoadingUser(false));
      } else {
        setIsLoadingUser(false);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadSessionData(session.user.id);
      } else {
        setUser(null);
        setProgress(null);
        setSubmissions([]);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [loadSessionData]);

  const refreshProgress = async () => {
    if (!user) return;
    await loadSessionData(user.id);
  };

  const login = async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      throw new Error(error?.message === 'Invalid login credentials' ? 'Incorrect email or password.' : 'Could not sign in. Please try again.');
    }
    await loadSessionData(data.user.id);
    triggerToast('Welcome back to your mentorship dashboard.', 'success');
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProgress(null);
    setSubmissions([]);
    triggerToast('You have been signed out.', 'info');
  };

  // Video/slides/quiz completion is in-session UI state only — it is not
  // persisted. Only evidence submissions and mentor approval are saved
  // (see submitEvidence below and the reviewSubmission Server Action).
  const updateProgress = async (
    lessonId: string,
    update: Partial<{ videoCompleted: boolean; slidesCompleted: boolean; quizPassed: boolean; state: string; score: number }>,
  ) => {
    setProgress((current) => {
      if (!current) return current;
      const existing = current.lessons[lessonId];
      if (!existing) return current;
      return {
        ...current,
        lessons: {
          ...current.lessons,
          [lessonId]: {
            ...existing,
            ...update,
            state: (update.state as typeof existing.state) || existing.state,
          },
        },
      };
    });
  };

  // Quiz attempts are not persisted (no quiz_attempts table in this schema);
  // passing a quiz only affects in-session UI state via updateProgress.
  const gradeQuiz = async () => {};

  // Sessions/booking is a non-auth, non-access feature and intentionally
  // stays as ephemeral UI state for this deployment (not persisted).
  const bookSession = async (_payload: { topic: string; date: string; time: string; mentorName: string }) => {
    triggerToast('Session requests are coming soon — your mentor will reach out directly for now.', 'info');
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
    await createSubmissionAction({
      pathId: user.activePathId,
      moduleId: payload.unitId,
      type: payload.evidenceType,
      textResponse: payload.notes,
      fileUrl: payload.evidenceUrl,
    });
    await loadSessionData(user.id);
    triggerToast('Evidence submitted. Your mentor will review it shortly.', 'success');
  };

  const value = useMemo<AppContextType>(
    () => ({
      user,
      isLoadingUser,
      progress,
      submissions,
      bookings: [],
      toast,
      triggerToast,
      login,
      logout,
      refreshProgress,
      updateProgress,
      gradeQuiz,
      bookSession,
      submitEvidence,
    }),
    [user, isLoadingUser, progress, submissions, toast],
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
