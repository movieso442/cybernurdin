import { redirect } from 'next/navigation';
import { getPathBySlug } from '@/lib/cybernurdin-data';

export default async function LearnModuleRoute({ params }: { params: Promise<{ pathSlug: string; moduleId: string }> }) {
  const { pathSlug, moduleId } = await params;
  const path = getPathBySlug(pathSlug);
  const module = path?.modules.find((item) => item.id === moduleId);
  const firstLesson = module?.lessons[0];
  redirect(path && firstLesson ? `/learn/${path.slug}/lessons/${firstLesson.id}` : '/dashboard/my-path');
}
