'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[#F95738] text-white border-[#F95738] hover:bg-[#E64A2D] shadow-[0_12px_24px_rgba(249,87,56,0.22)]',
    secondary: 'bg-white text-[#061C36] border-[#061C36]/12 hover:border-[#F95738]/50 hover:text-[#F95738]',
    ghost: 'bg-transparent text-[#061C36] border-transparent hover:bg-[#061C36]/6',
    dark: 'bg-[#061C36] text-white border-white/10 hover:bg-[#0B3D77]',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverEffect?: boolean;
};

export function Card({ children, className = '', hoverEffect = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#061C36]/10 bg-white/85 shadow-[0_18px_48px_rgba(6,28,54,0.08)] ${hoverEffect ? 'transition duration-200 hover:-translate-y-1 hover:border-[#F95738]/32' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  dark?: boolean;
};

export function Input({ label, error, icon, className = '', dark = false, ...props }: InputProps) {
  return (
    <label className={`block text-left ${className}`}>
      {label && <span className={`mb-1.5 block text-[11px] font-black uppercase tracking-wide ${dark ? 'text-white/60' : 'text-[#061C36]/62'}`}>{label}</span>}
      <span className="relative block">
        {icon && <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? 'text-white/36' : 'text-[#061C36]/36'}`}>{icon}</span>}
        <input
          className={`${dark ? 'cn-input cn-dark-input' : 'cn-input'} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </span>
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-500">
          <AlertCircle size={13} />
          {error}
        </span>
      )}
    </label>
  );
}

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-[#F95738]/18 bg-[#F95738]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#F95738] ${className}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, dark = false }: { value: number; dark?: boolean }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-[#061C36]/10'}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-[#F95738] to-[#F5D35E]"
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.45 }}
      />
    </div>
  );
}

export function Stepper({ steps, activeStep }: { steps: string[]; activeStep: number }) {
  return (
    <div className="flex w-full items-center gap-2">
      {steps.map((step, index) => {
        const complete = index < activeStep;
        const active = index === activeStep;
        return (
          <React.Fragment key={step}>
            <div className="flex min-w-0 flex-col items-center gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border text-xs font-black ${
                  complete
                    ? 'border-[#F95738] bg-[#F95738] text-white'
                    : active
                      ? 'border-[#F95738] bg-white text-[#F95738]'
                      : 'border-[#061C36]/12 bg-white text-[#061C36]/38'
                }`}
              >
                {complete ? <Check size={15} /> : index + 1}
              </span>
              <span className={`hidden text-center text-[10px] font-black uppercase tracking-wide sm:block ${active ? 'text-[#F95738]' : 'text-[#061C36]/45'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className={`h-0.5 flex-1 rounded-full ${complete ? 'bg-[#F95738]' : 'bg-[#061C36]/10'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
