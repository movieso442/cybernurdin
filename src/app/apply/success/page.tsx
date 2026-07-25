import { ApplicationFlow } from '@/components/apply/ApplicationFlow';

// Post-submission confirmation, not a landing page — keep it out of the index.
export const metadata = {
  robots: { index: false, follow: true },
};

export default function ApplySuccessPage() {
  return <ApplicationFlow successOnly />;
}
