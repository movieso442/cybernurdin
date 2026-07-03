import type React from 'react';
import { redirect } from 'next/navigation';
import { getAuthedProfile } from '@/lib/auth/session';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Mentorship Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAuthedProfile();

  if (!profile) redirect('/login');
  if (profile.role === 'admin') redirect('/admin/overview');
  if (profile.accessStatus !== 'active') redirect('/activate-access');
  if (profile.role !== 'mentee') redirect('/login');

  return <DashboardShell>{children}</DashboardShell>;
}
