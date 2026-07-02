import type { LucideIcon } from 'lucide-react';
import { BriefcaseBusiness, Code2, Users } from 'lucide-react';
import { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';

const trustItems: Array<{ label: string; icon?: LucideIcon; logo?: boolean }> = [
  { label: 'Expert Mentors', logo: true },
  { label: 'Hands-on Projects', icon: Code2 },
  { label: 'Career Support', icon: BriefcaseBusiness },
  { label: 'Community Access', icon: Users },
];

export default function HeroTrustStrip() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 pb-4 sm:px-8 lg:px-16 2xl:px-20">
        <div className="grid w-full max-w-[590px] grid-cols-2 overflow-hidden rounded-lg border border-[#061C36]/12 bg-white shadow-[0_12px_30px_rgba(6,28,54,0.04)] sm:grid-cols-4">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex min-h-[70px] flex-col items-center justify-center gap-2 px-3 text-center ${
                  index > 0 ? 'border-l border-[#061C36]/10' : ''
                } ${index === 2 ? 'max-sm:border-l-0 max-sm:border-t' : ''} ${index === 3 ? 'max-sm:border-t' : ''}`}
              >
                {item.logo ? (
                  <CyberNurdinLogoMark className="h-6 w-6" />
                ) : Icon ? (
                  <Icon size={23} className="text-[#061C36]" strokeWidth={2.1} />
                ) : null}
                <span className="text-[11px] font-extrabold text-[#061C36]">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
