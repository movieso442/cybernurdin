import '@/app/globals.css';
import { AppProvider } from '@/context/AppContext';
import ToastContainer from '@/components/ToastContainer';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cybernurdin.com'),
  title: {
    default: 'CyberNurdin — Cybersecurity Mentorship Platform',
    template: '%s | CyberNurdin',
  },
  description:
    'CyberNurdin is a premium cybersecurity mentorship platform that helps beginners build cybersecurity foundations through structured lessons, clean slides, practical tasks, curated resources, and mentor-guided progression.',
  keywords: [
    'cybersecurity mentorship',
    'cybersecurity training for beginners',
    'Introduction to Cybersecurity course',
    'cybersecurity learning path',
    'cybersecurity mentorship in Cameroon',
    'practical cybersecurity learning',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CyberNurdin',
    title: 'CyberNurdin — Cybersecurity Mentorship Platform',
    description:
      'Structured, mentor-guided cybersecurity learning for beginners — slides, practical tasks, curated resources, and reviewed progress.',
    images: ['/cybernurdin-logo-mark-transparent.png'],
  },
  twitter: {
    card: 'summary',
    title: 'CyberNurdin — Cybersecurity Mentorship Platform',
    description:
      'Structured, mentor-guided cybersecurity learning for beginners — slides, practical tasks, curated resources, and reviewed progress.',
    images: ['/cybernurdin-logo-mark-transparent.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
