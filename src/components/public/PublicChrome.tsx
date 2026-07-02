'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/UI';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';
import CyberNurdinFooter from '@/components/home/CyberNurdinFooter';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '/plans' },
  { label: 'Courses', href: '/courses' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Login', href: '/login' },
];

export function BrandLockup({ dark = true }: { dark?: boolean }) {
  return (
    <Link href="/" aria-label="CyberNurdin home">
      <CyberNurdinLogo size="sm" variant={dark ? 'light' : 'dark'} />
    </Link>
  );
}

export function CyberNurdinNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#061C36] text-white shadow-[0_12px_36px_rgba(6,28,54,0.18)]">
      <div className="cn-container flex h-16 items-center justify-between gap-6">
        <BrandLockup />
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs font-black uppercase tracking-wide transition ${active ? 'text-white' : 'text-white/62 hover:text-white'}`}
              >
                {link.label}
                {active && <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#F95738]" />}
              </Link>
            );
          })}
        </nav>
        <Link href="/apply" className="hidden lg:block">
          <Button className="min-h-9 px-4 py-2 text-xs">
            Apply for Mentorship
            <ArrowRight size={14} />
          </Button>
        </Link>
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/8 bg-[#061C36] p-4 lg:hidden">
          <nav className="cn-container flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-black text-white/75 hover:bg-white/6 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/apply" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full">Apply for Mentorship</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return <CyberNurdinFooter />;
}

export function PublicShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen bg-[#FAF7F0] text-[#061C36] md:bg-[#FAF7F0] ${className}`}>
      <CyberNurdinNavbar />
      {children}
      <Footer />
    </div>
  );
}
