import { redirect } from 'next/navigation';
import { getAllLessons, getPathBySlug } from '@/lib/cybernurdin-data';

export default async function LearnPathRoute({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  const path = getPathBySlug(pathSlug);
  if (!path) redirect('/dashboard/my-path');
  const firstLesson = getAllLessons(path)[0];
  redirect(firstLesson ? `/learn/${path.slug}/lessons/${firstLesson.id}` : '/dashboard/my-path');
}
