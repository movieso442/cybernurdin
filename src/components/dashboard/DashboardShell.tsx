'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  Upload,
  User,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/public/PublicChrome';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';

const dashboardNav = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/my-path', label: 'My Path', icon: Route },
  { href: '/dashboard/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/dashboard/submissions', label: 'Submissions', icon: Upload },
  { href: '/dashboard/sessions', label: 'Sessions', icon: Calendar },
  { href: '/dashboard/progress', label: 'Progress', icon: BarChart3 },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

function Sidebar({ close }: { close?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useApp();

  return (
    <aside className="flex h-full flex-col justify-between bg-[#061C36] text-white">
      <div>
        <div className="border-b border-white/8 p-5">
          <BrandLockup />
        </div>
        <div className="border-b border-white/8 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F95738]/14 text-sm font-black text-[#F95738]">
              {user?.fullName?.slice(0, 2).toUpperCase() || 'CN'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{user?.fullName || 'Mentee'}</p>
              <p className="truncate text-xs font-semibold text-white/46">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="grid gap-1 p-3">
          {dashboardNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  active ? 'bg-[#F95738]/14 text-[#F95738]' : 'text-white/62 hover:bg-white/6 hover:text-white'
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/8 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-white/62 hover:bg-white/6 hover:text-white"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoadingUser } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingUser && !user) router.push('/login');
  }, [isLoadingUser, router, user]);

  if (isLoadingUser || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#061C36] text-white">
        <div className="text-center">
          <CyberNurdinLogo className="mx-auto mb-3" size="lg" variant="light" showText={false} />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/54">Checking secure access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#061C36] lg:flex">
      <div className="hidden h-screen w-72 shrink-0 lg:sticky lg:top-0 lg:block">
        <Sidebar />
      </div>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#061C36]/8 bg-[#F6F2E9]/92 px-4 backdrop-blur lg:hidden">
        <BrandLockup dark={false} />
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-[#061C36]/10 bg-white" onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar close={() => setOpen(false)} />
            <button className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      <main className="min-w-0 flex-1 pb-20 lg:pb-0">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-[#061C36]/10 bg-white/94 p-2 backdrop-blur lg:hidden">
        {dashboardNav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-black ${active ? 'text-[#F95738]' : 'text-[#061C36]/56'}`}>
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
