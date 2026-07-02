import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Check, Cloud, Code2, Globe2, Target } from 'lucide-react';
import { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';

const paths: Array<{
  title: string;
  description: string;
  learn: string[];
  icon?: LucideIcon;
  logoTone?: 'full' | 'light';
  iconClass: string;
}> = [
  {
    title: 'Introduction to Cybersecurity',
    description: 'Start your journey and build a strong cybersecurity foundation.',
    learn: ['Cybersecurity basics', 'Common threats', 'Safe digital habits'],
    logoTone: 'light',
    iconClass: 'bg-[#0B3D77] text-white',
  },
  {
    title: 'SOC Analyst',
    description: 'Master monitoring, detection and response in modern SOCs.',
    learn: ['Log analysis', 'Alert triage', 'Incident response'],
    icon: Target,
    iconClass: 'bg-[#F95738] text-white',
  },
  {
    title: 'Network Security',
    description: 'Secure networks and defend infrastructure at scale.',
    learn: ['Network defense', 'Firewalls & VPNs', 'Traffic monitoring'],
    icon: Globe2,
    iconClass: 'bg-[#F5B82E] text-white',
  },
  {
    title: 'Web Security',
    description: 'Find and fix vulnerabilities in web applications.',
    learn: ['OWASP basics', 'Secure coding', 'Vulnerability testing'],
    icon: Code2,
    iconClass: 'bg-[#F95738] text-white',
  },
  {
    title: 'Cloud Security',
    description: 'Secure cloud environments and apply best practices.',
    learn: ['Cloud risks', 'IAM basics', 'Secure deployment'],
    icon: Cloud,
    iconClass: 'bg-[#0B3D77] text-white',
  },
];

export default function FeaturedMentorshipPathsSection() {
  return (
    <section className="w-full bg-[#FFF8EF] py-14 md:py-16">
      <div className="w-full px-6 sm:px-8 lg:px-16 2xl:px-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[22px] font-black uppercase tracking-wide text-[#061C36]">
            Featured Mentorship Paths
          </h2>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#F95738]">
            View All Paths
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.title}
                className="flex h-full min-h-[340px] flex-col rounded-2xl border border-[#061C36]/12 bg-white p-6 shadow-[0_12px_28px_rgba(6,28,54,0.04)] transition hover:-translate-y-1 hover:border-[#F95738]/30 hover:shadow-[0_18px_34px_rgba(6,28,54,0.08)]"
              >
                <div className={`mb-5 grid h-14 w-14 place-items-center rounded-full ${path.iconClass}`}>
                  {path.logoTone ? (
                    <CyberNurdinLogoMark tone={path.logoTone} className="h-9 w-9" />
                  ) : Icon ? (
                    <Icon size={30} strokeWidth={2.1} />
                  ) : null}
                </div>
                <h3 className="text-base font-black leading-tight text-[#061C36]">{path.title}</h3>
                <p className="mt-2 text-sm font-medium leading-5 text-[#061C36]/78">{path.description}</p>
                <div className="mt-5 border-t border-[#061C36]/10 pt-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#061C36]">What you will learn</p>
                  <ul className="mt-3 space-y-2">
                    {path.learn.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#061C36]/76">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F95738]/10 text-[#F95738]">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/courses" className="mt-auto flex items-center gap-2 pt-5 text-sm font-extrabold text-[#F95738]">
                  Explore Path
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
