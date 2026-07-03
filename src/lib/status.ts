import type {
  LessonProgressState,
  MentorshipPath,
  Module,
  PathUnit,
  ProgressRecord,
  SubmissionStatus,
} from '@/lib/cybernurdin-data';
import { calculateModuleProgress, getUnitState } from '@/lib/cybernurdin-data';

export type DisplayStatus = 'Locked' | 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export function getModuleState(
  path: MentorshipPath,
  unit: PathUnit,
  moduleItem: Module,
  progress?: ProgressRecord | null,
): LessonProgressState {
  const moduleProgress = calculateModuleProgress(moduleItem, progress);
  if (moduleProgress === 100) return 'completed';

  const unitState = getUnitState(path, unit, progress);
  if (unitState === 'locked') return 'locked';

  const moduleIndex = unit.modules.findIndex((item) => item.id === moduleItem.id);
  if (moduleIndex <= 0) return moduleProgress > 0 ? 'in-progress' : 'unlocked';

  const previousModule = unit.modules[moduleIndex - 1];
  if (previousModule && calculateModuleProgress(previousModule, progress) === 100) {
    return moduleProgress > 0 ? 'in-progress' : 'unlocked';
  }
  return 'locked';
}

export function getDisplayStatus(state: LessonProgressState, submissionStatus?: SubmissionStatus): DisplayStatus {
  if (state === 'locked') return 'Locked';
  if (submissionStatus === 'approved') return 'Approved';
  if (submissionStatus === 'rejected') return 'Rejected';
  if (submissionStatus === 'under-review') return 'Under Review';
  if (submissionStatus === 'pending') return 'Submitted';
  if (state === 'unlocked') return 'Not Started';
  return 'In Progress';
}

export function displayStatusClasses(status: DisplayStatus): string {
  switch (status) {
    case 'Approved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'Rejected':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'Under Review':
      return 'border-[#F5D35E]/50 bg-[#F5D35E]/15 text-[#7a6000]';
    case 'Submitted':
      return 'border-[#0B3D77]/20 bg-[#0B3D77]/8 text-[#0B3D77]';
    case 'In Progress':
      return 'border-[#F95738]/30 bg-[#F95738]/8 text-[#F95738]';
    case 'Locked':
      return 'border-[#061C36]/12 bg-[#061C36]/5 text-[#061C36]/40';
    default:
      return 'border-[#061C36]/12 bg-[#FAF7F0] text-[#061C36]/54';
  }
}
