import { PublicShell } from '@/components/public/PublicChrome';
import { ContactPageView } from '@/components/public/PublicPages';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with CyberNurdin about cybersecurity mentorship paths, applications, coupon activation, or dashboard support. Based in Cameroon, mentoring learners everywhere.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PublicShell>
      <ContactPageView />
    </PublicShell>
  );
}
