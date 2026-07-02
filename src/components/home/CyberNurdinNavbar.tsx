'use client';

import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '/plans' },
  { label: 'Courses', href: '/courses' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Login', href: '/login' },
];

export default function CyberNurdinNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#061C36] text-white shadow-[0_10px_28px_rgba(6,28,54,0.16)]">
      <div className="flex h-[66px] w-full items-center justify-between px-6 sm:px-8 lg:px-16 2xl:px-20">
        <Link href="/" aria-label="CyberNurdin home">
          <CyberNurdinLogo size="sm" variant="light" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-sm font-semibold transition hover:text-white ${
                link.href === '/' ? 'text-white' : 'text-white/78'
              }`}
            >
              {link.label}
              {link.href === '/' && (
                <span className="absolute inset-x-0 -bottom-2 mx-auto h-[3px] w-full rounded-full bg-[#F95738]" />
              )}
            </Link>
          ))}
        </nav>

        <Link
          href="/apply"
          className="hidden items-center gap-2 rounded-lg bg-[#F95738] px-5 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(249,87,56,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e94b2f] lg:flex"
        >
          Apply for Mentorship
          <ArrowRight size={16} />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#061C36] px-5 py-4 lg:hidden">
          <nav className="flex w-full flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-bold text-white/80 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-[#F95738] px-5 py-3 text-sm font-extrabold text-white"
            >
              Apply for Mentorship
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
