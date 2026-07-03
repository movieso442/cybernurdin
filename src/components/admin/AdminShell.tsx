'use client';

import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Upload,
  Users,
} from 'lucide-react';
import { BrandLockup } from '@/components/public/PublicChrome';
import { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';
import { createClient } from '@/lib/supabase/client';

const adminNav: Array<{ href: string; label: string; icon?: LucideIcon; logo?: boolean }> = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/mentees', label: 'Mentees', icon: Users },
  { href: '/admin/submissions', label: 'Submissions', icon: Upload },
  { href: '/admin/paths', label: 'Paths', logo: true },
  { href: '/admin/content', label: 'Content', icon: BookOpen },
  { href: '/admin/sessions', label: 'Sessions', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Access to everything rendered here is already guaranteed by
// src/app/admin/layout.tsx (a Server Component that checks the real
// Supabase session + profiles.role === 'admin' before this ever renders).
// This component only handles navigation chrome and sign-out.
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F6F2E9] text-[#061C36] lg:flex">
      <aside className="flex flex-col border-r border-[#061C36]/8 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72">
        <div className="border-b border-[#061C36]/8 p-5">
          <BrandLockup dark={false} />
          <div className="mt-4 rounded-lg bg-[#061C36] p-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#F95738]">Admin</p>
            <p className="mt-1 text-sm font-bold text-white/72">Mentorship operations</p>
          </div>
        </div>
        <nav className="grid flex-1 gap-1 p-3">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold ${
                  active ? 'bg-[#F95738]/10 text-[#F95738]' : 'text-[#061C36]/58 hover:bg-[#061C36]/5 hover:text-[#061C36]'
                }`}
              >
                {item.logo ? (
                  <CyberNurdinLogoMark className="h-[17px] w-[17px]" />
                ) : Icon ? (
                  <Icon size={17} />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#061C36]/8 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-[#061C36]/58 hover:bg-[#061C36]/5 hover:text-[#061C36]"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="border-b border-[#061C36]/8 bg-white/80 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <BrandLockup dark={false} />
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#061C36] px-3 py-2 text-xs font-black text-white">
              <FileText size={14} />
              Admin
            </span>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded-lg border border-[#061C36]/10 bg-white px-3 py-2 text-xs font-black">
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
