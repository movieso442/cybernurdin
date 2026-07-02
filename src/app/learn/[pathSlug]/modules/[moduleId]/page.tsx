import { redirect } from 'next/navigation';
import { getAllModules, getPathBySlug } from '@/lib/cybernurdin-data';

export default async function LearnModuleRoute({ params }: { params: Promise<{ pathSlug: string; moduleId: string }> }) {
  const { pathSlug, moduleId } = await params;
  const path = getPathBySlug(pathSlug);
  const moduleItem = path ? getAllModules(path).find((item) => item.id === moduleId) : null;
  const firstLesson = moduleItem?.lessons[0];
  redirect(path && firstLesson ? `/learn/${path.slug}/lessons/${firstLesson.id}` : '/dashboard/my-path');
}
