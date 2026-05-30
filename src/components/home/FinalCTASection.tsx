import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 py-3 sm:px-8 lg:px-16 2xl:px-20">
        <div className="relative overflow-hidden rounded-lg bg-[#061C36] px-8 py-5 text-white shadow-[0_18px_36px_rgba(6,28,54,0.16)] md:px-20">
          <div className="absolute inset-y-0 right-[18%] w-[38%] opacity-25 [background-image:radial-gradient(#0B6ABE_1.1px,transparent_1.1px)] [background-size:9px_9px]" />
          <div className="relative flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <Shield size={70} className="text-[#F95738]" strokeWidth={2.4} />
            <div className="text-center md:flex-1 md:text-left">
              <h2 className="max-w-[560px] text-3xl font-black leading-tight tracking-[-0.02em] md:text-[34px]">
                Ready to accelerate your cybersecurity career?
              </h2>
              <p className="mt-1 text-base font-semibold text-white/85">
                Apply now and join a community of future defenders.
              </p>
            </div>
            <Link
              href="/apply"
              className="inline-flex min-h-[54px] min-w-[178px] items-center justify-center gap-3 rounded-lg bg-[#F95738] px-7 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#e94b2f]"
            >
              Apply Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
