import { ActivateAccessView } from '@/components/auth/ActivateAccessView';

export const metadata = {
  title: 'Activate Access',
  description: 'Activate your CyberNurdin mentorship access with your approved activation code.',
  robots: { index: false, follow: true },
};

export default function ActivateAccessPage() {
  return <ActivateAccessView />;
}
