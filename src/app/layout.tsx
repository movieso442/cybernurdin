import '@/app/globals.css';
import { AppProvider } from '@/context/AppContext';
import ToastContainer from '@/components/ToastContainer';

export const metadata = {
  title: 'CyberNurdin - Cybersecurity Guided Mentorship Platform',
  description: 'A selective cybersecurity-only mentorship ecosystem for serious defenders. Learn threats, networking, defensive engineering, and incident containment.',
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
