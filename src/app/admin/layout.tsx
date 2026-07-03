import type React from 'react';
import { redirect } from 'next/navigation';
import { getAuthedProfile } from '@/lib/auth/session';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getAuthedProfile();

  if (!profile) redirect('/login');
  if (profile.role !== 'admin') redirect('/dashboard');

  return <AdminShell>{children}</AdminShell>;
}
