import { ArrowRight, BookOpenCheck, CloudUpload, GraduationCap, MessageSquareText, ShieldCheck } from 'lucide-react';

const processSteps = [
  {
    title: 'Apply',
    text: 'Tell us about yourself and your goals.',
    icon: ShieldCheck,
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
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 py-2 sm:px-8 lg:px-16 2xl:px-20">
        <h2 className="mb-3 text-center text-[21px] font-black uppercase tracking-wide text-[#061C36]">
          Our Mentorship Process
        </h2>
        <div className="grid gap-4 md:grid-cols-5 md:gap-5">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div className="min-h-[132px] rounded-lg border border-[#061C36]/12 bg-white p-5 shadow-[0_12px_28px_rgba(6,28,54,0.04)]">
                  <span className="absolute left-4 top-3 grid h-7 w-7 place-items-center rounded-full bg-[#F95738] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#EEF1F5] text-[#061C36]">
                    <Icon size={28} strokeWidth={2.1} />
                  </div>
                  <h3 className="text-base font-black text-[#061C36]">{step.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-5 text-[#061C36]/72">{step.text}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-[#061C36]/45 md:block" size={22} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
