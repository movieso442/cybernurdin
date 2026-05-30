import Link from 'next/link';
import { ArrowRight, Cloud, Code2, Globe2, ShieldCheck, Target } from 'lucide-react';

const paths = [
  {
    title: 'Introduction to Cybersecurity',
    description: 'Start your journey and build a strong cybersecurity foundation.',
    icon: ShieldCheck,
    iconClass: 'bg-[#0B3D77] text-white',
  },
  {
    title: 'SOC Analyst',
    description: 'Master monitoring, detection and response in modern SOCs.',
    icon: Target,
    iconClass: 'bg-[#F95738] text-white',
  },
  {
    title: 'Network Security',
    description: 'Secure networks and defend infrastructure at scale.',
    icon: Globe2,
    iconClass: 'bg-[#F5B82E] text-white',
  },
  {
    title: 'Web Security',
    description: 'Find and fix vulnerabilities in web applications.',
    icon: Code2,
    iconClass: 'bg-[#F95738] text-white',
  },
  {
    title: 'Cloud Security',
    description: 'Secure cloud environments and apply best practices.',
    icon: Cloud,
    iconClass: 'bg-[#0B3D77] text-white',
  },
];

export default function FeaturedMentorshipPathsSection() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 py-3 sm:px-8 lg:px-16 2xl:px-20">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-[21px] font-black uppercase tracking-wide text-[#061C36]">
            Featured Mentorship Paths
          </h2>
          <Link href="/courses" className="hidden items-center gap-2 text-sm font-extrabold text-[#F95738] sm:flex">
            View All Paths
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.title}
                className="flex min-h-[170px] flex-col rounded-lg border border-[#061C36]/12 bg-white p-5 shadow-[0_12px_28px_rgba(6,28,54,0.04)] transition hover:-translate-y-0.5 hover:border-[#F95738]/30"
              >
                <div className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${path.iconClass}`}>
                  <Icon size={30} strokeWidth={2.1} />
                </div>
                <h3 className="text-base font-black leading-tight text-[#061C36]">{path.title}</h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-5 text-[#061C36]/78">{path.description}</p>
                <Link href="/courses" className="mt-4 flex items-center gap-2 text-sm font-extrabold text-[#F95738]">
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
