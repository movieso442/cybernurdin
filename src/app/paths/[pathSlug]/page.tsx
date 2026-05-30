import { PublicShell } from '@/components/public/PublicChrome';
import { PathPreviewPageView } from '@/components/public/PublicPages';

export default async function PathPreviewPage({ params }: { params: Promise<{ pathSlug: string }> }) {
  const { pathSlug } = await params;
  return (
    <PublicShell>
      <PathPreviewPageView slug={pathSlug} />
    </PublicShell>
  );
}
