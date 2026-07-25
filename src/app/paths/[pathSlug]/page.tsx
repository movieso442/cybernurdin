import { PublicShell } from '@/components/public/PublicChrome';
import { PathPreviewPageView } from '@/components/public/PublicPages';
import { BreadcrumbStructuredData, CourseStructuredData } from '@/components/seo/StructuredData';
import { mentorshipPaths } from '@/lib/cybernurdin-data';

export async function generateMetadata({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  const path = mentorshipPaths.find((item) => item.slug === pathSlug);
  if (!path) return { title: 'Mentorship Path' };
  return {
    title: path.title,
    description: path.description,
    alternates: { canonical: `/paths/${path.slug}` },
  };
}

export default async function PathPreviewPage({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  const path = mentorshipPaths.find((item) => item.slug === pathSlug) || mentorshipPaths[0];

  return (
    <PublicShell>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Courses', url: '/courses' },
          { name: path.title, url: `/paths/${path.slug}` },
        ]}
      />
      <CourseStructuredData
        name={path.title}
        description={path.description}
        url={`/paths/${path.slug}`}
        level={path.level}
      />
      <PathPreviewPageView slug={pathSlug} />
    </PublicShell>
  );
}
