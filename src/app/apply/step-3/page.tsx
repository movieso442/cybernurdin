import { ApplicationFlow } from '@/components/apply/ApplicationFlow';

// Mid-funnel step, not a landing page — keep it out of the index.
export const metadata = {
  robots: { index: false, follow: true },
};

export default function ApplyStepThreePage() {
  return <ApplicationFlow initialStep={2} />;
}
