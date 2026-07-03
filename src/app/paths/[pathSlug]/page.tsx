import { PublicShell } from '@/components/public/PublicChrome';
import { PathPreviewPageView } from '@/components/public/PublicPages';
import { mentorshipPaths } from '@/lib/cybernurdin-data';

export async function generateMetadata({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  const path = mentorshipPaths.find((item) => item.slug === pathSlug);
  if (!path) return { title: 'Mentorship Path' };
  return {
    title: path.title,
    description: path.description,
  };
}

export default async function PathPreviewPage({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  return (
    <PublicShell>
      <PathPreviewPageView slug={pathSlug} />
    </PublicShell>
  );
}
