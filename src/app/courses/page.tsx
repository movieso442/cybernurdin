import { PublicShell } from '@/components/public/PublicChrome';
import { CoursesPageView } from '@/components/public/PublicPages';

export const metadata = {
  title: 'Cybersecurity Learning Paths',
  description:
    'Explore CyberNurdin cybersecurity mentorship paths, starting with Introduction to Cybersecurity — plus guided certification pathways and upcoming tracks. Mentoring learners in Cameroon and beyond.',
  alternates: { canonical: '/courses' },
};

export default function CoursesPage() {
  return (
    <PublicShell>
      <CoursesPageView />
    </PublicShell>
  );
}
