import { PublicShell } from '@/components/public/PublicChrome';
import { PlansPageView } from '@/components/public/PublicPages';

export const metadata = {
  title: 'Mentorship Plans',
  description:
    'Explore CyberNurdin cybersecurity mentorship plans — guided learning paths, mentor review, and structured progress tracking for beginners building real skills.',
  alternates: { canonical: '/plans' },
};

export default function PlansPage() {
  return (
    <PublicShell>
      <PlansPageView />
    </PublicShell>
  );
}
