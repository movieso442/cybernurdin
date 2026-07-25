import { ApplicationFlow } from '@/components/apply/ApplicationFlow';

// Same content as /apply (default step) — canonicalize there.
export const metadata = {
  alternates: { canonical: '/apply' },
};

export default function ApplyStepOnePage() {
  return <ApplicationFlow initialStep={0} />;
}
