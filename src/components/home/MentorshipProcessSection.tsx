import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BookOpenCheck, CloudUpload, GraduationCap, MessageSquareText } from 'lucide-react';
import { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';

const processSteps: Array<{ title: string; text: string; icon?: LucideIcon; logo?: boolean }> = [
  {
    title: 'Apply',
    text: 'Tell us about yourself and your goals.',
    logo: true,
  },
  {
    title: 'Get Reviewed',
    text: 'We review your application and match you.',
    icon: MessageSquareText,
  },
  {
    title: 'Get Access',
    text: 'Access your dashboard, resources & mentor.',
    icon: CloudUpload,
  },
  {
    title: 'Learn',
    text: 'Engage in sessions, projects and practical labs.',
    icon: GraduationCap,
  },
  {
    title: 'Grow',
    text: 'Build skills, earn certificates and advance your career.',
    icon: BookOpenCheck,
  },
];

export default function MentorshipProcessSection() {
  return (
    <div className="mt-6 w-full">
      <h2 className="mb-3 text-center text-[18px] font-black uppercase tracking-wide text-[#061C36]">
        Our Mentorship Process
      </h2>
      <div className="grid gap-3 md:grid-cols-5 md:gap-4">
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative">
              <div className="min-h-[118px] rounded-lg border border-[#061C36]/12 bg-white p-4 shadow-[0_10px_22px_rgba(6,28,54,0.035)]">
                <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#F95738] text-xs font-black text-white">
                  {index + 1}
                </span>
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#EEF1F5] text-[#061C36]">
                  {step.logo ? (
                    <CyberNurdinLogoMark className="h-7 w-7" />
                  ) : Icon ? (
                    <Icon size={21} strokeWidth={2.1} />
                  ) : null}
                </div>
                <h3 className="text-sm font-black text-[#061C36]">{step.title}</h3>
                <p className="mt-1 text-xs font-semibold leading-4 text-[#061C36]/72">{step.text}</p>
              </div>
              {index < processSteps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#061C36]/40 md:block" size={18} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
