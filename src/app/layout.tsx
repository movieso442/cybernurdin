import '@/app/globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cybernurdin.com'),
  applicationName: 'CyberNurdin',
  manifest: '/site.webmanifest',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
