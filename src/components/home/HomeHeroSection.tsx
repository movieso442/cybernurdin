import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CyberNurdinHeroIllustration from '@/components/shared/CyberNurdinHeroIllustration';

export default function HomeHeroSection() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="grid w-full grid-cols-1 items-center gap-8 px-6 pb-2 pt-9 sm:px-8 lg:grid-cols-[0.93fr_1.07fr] lg:px-16 2xl:px-20">
        <div className="max-w-[560px] text-left">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-tight text-[#F95738]">
            1:1 MENTORSHIP. REAL SKILLS. REAL IMPACT.
          </p>
          <h1 className="text-[38px] font-black leading-[1.08] tracking-[-0.03em] text-[#061C36] sm:text-[47px]">
            Cybersecurity Mentorship That Builds <span className="text-[#F95738]">Real Defenders.</span>
          </h1>
          <p className="mt-4 max-w-[500px] text-[15px] font-medium leading-7 text-[#061C36]/78">
            Get guided by industry professionals, follow proven paths, and build in-demand cybersecurity skills through hands-on mentorship and real-world projects.
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/apply"
              className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-lg bg-[#F95738] px-7 text-sm font-extrabold text-white shadow-[0_14px_26px_rgba(249,87,56,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e94b2f]"
            >
              Start Your Mentorship Journey
              <ArrowRight className="transition group-hover:translate-x-0.5" size={16} />
            </Link>
            <Link
              href="/courses"
              className="group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-lg border border-[#0B3D77]/24 bg-white px-7 text-sm font-extrabold text-[#061C36] transition hover:border-[#F95738]/50 hover:text-[#F95738]"
            >
              Explore Paths
              <ArrowRight className="transition group-hover:translate-x-0.5" size={16} />
            </Link>
          </div>
        </div>

        <CyberNurdinHeroIllustration />
      </div>
    </section>
  );
}
