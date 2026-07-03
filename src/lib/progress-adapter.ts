import type {
  EvidenceSubmission,
  EvidenceType,
  LessonProgressState,
  MentorshipPath,
  ProgressRecord,
  SubmissionStatus,
} from '@/lib/cybernurdin-data';

// Shapes exactly as returned by `supabase.from(...).select()` (snake_case
// Postgres column names) — kept separate from the Drizzle schema types so
// this module has no server-only imports and can run in the browser.
export type CourseProgressRow = {
  path_id: string;
  module_id: string;
  status: string;
  completed_at: string | null;
  approved_at: string | null;
};

export type EnrollmentRow = {
  id: string;
  user_id: string;
  path_id: string;
  status: string;
  progress: number;
  current_module_id: string | null;
};

export type SubmissionRow = {
  id: string;
  user_id: string;
  path_id: string;
  module_id: string;
  type: string;
  text_response: string | null;
  file_url: string | null;
  status: string;
  mentor_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

function mapStatus(status: string): LessonProgressState {
  if (status === 'completed') return 'completed';
  if (status === 'in-progress') return 'in-progress';
  if (status === 'unlocked') return 'unlocked';
  return 'locked';
}

/**
 * Builds the old ProgressRecord shape (per-lesson map) from the new
 * module-level course_progress rows, so the existing dashboard/lesson UI —
 * built around per-lesson progress — keeps working unchanged. Since
 * Introduction to Cybersecurity has exactly one module and one lesson per
 * unit, each unit's status maps onto that single lesson directly.
 */
export function buildProgressRecord(
  path: MentorshipPath,
  enrollment: EnrollmentRow | null,
  rows: CourseProgressRow[],
): ProgressRecord | null {
  if (!enrollment) return null;

  const rowByUnit = new Map(rows.map((row) => [row.module_id, row]));
  const lessons: ProgressRecord['lessons'] = {};
  const units: ProgressRecord['units'] = {};
  const modules: ProgressRecord['modules'] = {};

  for (const unit of path.units) {
    const row = rowByUnit.get(unit.id);
    const state = row ? mapStatus(row.status) : 'locked';
    const completed = state === 'completed';

    units[unit.id] = { unitId: unit.id, state, progressPercent: completed ? 100 : 0, completed };

    for (const moduleItem of unit.modules) {
      modules[moduleItem.id] = { moduleId: moduleItem.id, unitId: unit.id, state, progressPercent: completed ? 100 : 0, completed };

      for (const lesson of moduleItem.lessons) {
        lessons[lesson.id] = {
          state,
          pathId: path.id,
          unitId: unit.id,
          moduleId: moduleItem.id,
          lessonId: lesson.id,
          videoCompleted: completed,
          slidesCompleted: completed,
          quizPassed: completed,
          lessonCompleted: completed,
          moduleCompleted: completed,
          unitCompleted: completed,
          pathCompleted: enrollment.status === 'completed',
          progressPercent: completed ? 100 : 0,
          updatedAt: row?.approved_at || row?.completed_at || new Date().toISOString(),
        };
      }
    }
  }

  return {
    id: enrollment.id,
    userId: enrollment.user_id,
    pathId: path.id,
    currentUnitId: enrollment.current_module_id || path.units[0]?.id || '',
    currentModuleId: enrollment.current_module_id || path.units[0]?.modules[0]?.id || '',
    currentLessonId: '',
    completedPathIds: enrollment.status === 'completed' ? [path.id] : [],
    lessons,
    modules,
    units,
    progressPercent: enrollment.progress,
    pathCompleted: enrollment.status === 'completed',
    updatedAt: new Date().toISOString(),
  };
}

/** Adapts new `submissions` rows to the old EvidenceSubmission shape the UI expects. */
export function adaptSubmissions(path: MentorshipPath, rows: SubmissionRow[]): EvidenceSubmission[] {
  const lessonIdByUnitId = new Map(path.units.map((unit) => [unit.id, unit.modules[0]?.lessons[0]?.id]));

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    pathId: row.path_id,
    unitId: row.module_id,
    moduleId: row.module_id,
    lessonId: lessonIdByUnitId.get(row.module_id) || row.module_id,
    evidenceUrl: row.file_url || '',
    evidenceType: (row.type as EvidenceType) || 'reflection',
    notes: row.text_response || '',
    status: row.status as SubmissionStatus,
    mentorFeedback: row.mentor_feedback || undefined,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at || undefined,
    reviewedBy: row.reviewed_by || undefined,
  }));
}
