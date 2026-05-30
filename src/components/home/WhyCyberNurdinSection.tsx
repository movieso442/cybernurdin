import { BriefcaseBusiness, Clock3, Target, UserRound, Users } from 'lucide-react';

const benefits = [
  {
    title: '1:1 Expert Mentorship',
    text: 'Learn directly from industry professionals.',
    icon: UserRound,
  },
  {
    title: 'Real-world Projects',
    text: 'Work on practical projects that build your portfolio.',
    icon: Target,
  },
  {
    title: 'Career Advancement',
    text: 'Get guidance, resume reviews and interview prep.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Flexible Learning',
    text: 'Learn at your pace with structured roadmaps.',
    icon: Clock3,
  },
  {
    title: 'Community Access',
    text: 'Join a community of learners and security professionals.',
    icon: Users,
  },
];

export default function WhyCyberNurdinSection() {
  return (
    <section className="w-full bg-[#FFF8EF]">
      <div className="w-full px-6 py-3 sm:px-8 lg:px-16 2xl:px-20">
        <h2 className="mb-3 text-center text-[21px] font-black uppercase tracking-wide text-[#061C36]">
          Why Learn With CyberNurdin?
        </h2>
        <div className="grid overflow-hidden rounded-lg border border-[#061C36]/12 bg-white shadow-[0_12px_28px_rgba(6,28,54,0.04)] md:grid-cols-5">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={`flex min-h-[112px] flex-col items-center justify-center px-5 py-4 text-center ${
                  index > 0 ? 'border-t border-[#061C36]/8 md:border-l md:border-t-0' : ''
                }`}
              >
                <div className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-[#FFF3E4] text-[#F95738]">
                  <Icon size={24} />
                </div>
                <h3 className="text-sm font-black text-[#061C36]">{benefit.title}</h3>
                <p className="mt-1 max-w-[170px] text-xs font-semibold leading-4 text-[#061C36]/72">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
