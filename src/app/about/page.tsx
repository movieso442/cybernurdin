import { PublicShell } from '@/components/public/PublicChrome';
import { AboutPageView } from '@/components/public/PublicPages';

export const metadata = {
  title: 'About Us',
  description:
    'CyberNurdin is a cybersecurity mentorship platform helping learners in Cameroon and across Africa build real, practical cybersecurity skills through structured, mentor-guided learning.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PublicShell>
      <AboutPageView />
    </PublicShell>
  );
}
