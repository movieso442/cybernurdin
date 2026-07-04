import { LessonView } from '@/components/learn/LessonView';

// Kept for backward-compatible links; this path no longer has a distinct
// video tab (see components/learn/LessonView.tsx), so it opens on slides.
export default function LessonVideoRoute() {
  return <LessonView initialTab="slides" />;
}
