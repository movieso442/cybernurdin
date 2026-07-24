import { ApplicationFlow } from '@/components/apply/ApplicationFlow';

export const metadata = {
  title: 'Apply for Mentorship',
  description: 'Apply for a CyberNurdin cybersecurity mentorship path and get your access coupon after review.',
  alternates: { canonical: '/apply' },
};

export default function ApplyPage() {
  return <ApplicationFlow />;
}
