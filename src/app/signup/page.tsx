import { ApplicationFlow } from '@/components/apply/ApplicationFlow';

export const metadata = {
  title: 'Apply for Mentorship',
  description: 'Apply for a CyberNurdin cybersecurity mentorship path and get your access coupon after review.',
  // Same content as /apply — canonicalize here instead of splitting ranking signal across two URLs.
  alternates: { canonical: '/apply' },
};

export default function SignupPage() {
  return <ApplicationFlow />;
}
