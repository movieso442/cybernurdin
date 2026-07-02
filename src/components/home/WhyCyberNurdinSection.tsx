import { BriefcaseBusiness, Clock3, Target, UserRound, Users } from 'lucide-react';

const benefits = [
  {
    title: '1:1 Expert Mentorship',
    text: 'Learn directly from industry professionals.',
    expandedText: 'Get guidance from mentors who understand real cybersecurity work, not just theory.',
    icon: UserRound,
  },
  {
    title: 'Real-world Projects',
    text: 'Work on practical projects that build your portfolio.',
    expandedText: 'Practice with hands-on tasks, case studies, and security scenarios that help you apply what you learn.',
    icon: Target,
  },
  {
    title: 'Career Advancement',
    text: 'Get guidance, resume reviews and interview prep.',
    expandedText: 'Build career confidence with structured support, direction, and professional preparation.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Flexible Learning',
    text: 'Learn at your pace with structured roadmaps.',
    expandedText: 'Follow a clear path without feeling lost, while still learning in a way that fits your schedule.',
    icon: Clock3,
  },
  {
    title: 'Community Access',
    text: 'Join a community of learners and security professionals.',
    expandedText: 'Grow around people who are also building skills, asking questions, and moving toward cybersecurity careers.',
    icon: Users,
  },
];

const summaryItems = ['Guided mentorship', 'Practical cybersecurity', 'Clear growth path'];

export default function WhyCyberNurdinSection() {
  return (
    <section className="w-full bg-[#FFF8EF] py-20">
      <div className="w-full px-6 sm:px-8 lg:px-16 2xl:px-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-[24px] font-black uppercase tracking-wide text-[#061C36] md:text-[30px]">
            Why Learn With CyberNurdin?
          </h2>
          <p className="mt-5 text-base font-semibold leading-7 text-[#061C36]/72 md:text-lg">
            CyberNurdin is built for learners who want more than random tutorials. You get structure,
            guidance, accountability, and real cybersecurity practice designed to move you forward with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className={`flex min-h-[260px] flex-col rounded-2xl border border-[#061C36]/12 bg-white p-7 shadow-[0_14px_32px_rgba(6,28,54,0.045)] transition hover:-translate-y-1 hover:border-[#F95738]/30 hover:shadow-[0_18px_38px_rgba(6,28,54,0.08)] ${
                  index === benefits.length - 1 ? 'lg:col-start-2' : ''
                }`}
              >
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#FFF3E4] text-[#F95738]">
                  <Icon size={26} strokeWidth={2.1} />
                </div>
                <h3 className="text-lg font-black text-[#061C36]">{benefit.title}</h3>
                <p className="mt-3 text-sm font-extrabold leading-5 text-[#061C36]/78">{benefit.text}</p>
                <p className="mt-4 text-sm font-medium leading-6 text-[#061C36]/66">{benefit.expandedText}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#061C36]/12 bg-white shadow-[0_12px_28px_rgba(6,28,54,0.04)] md:grid-cols-3">
          {summaryItems.map((item, index) => (
            <div
              key={item}
              className={`px-6 py-5 text-center text-sm font-black uppercase tracking-wide text-[#061C36] ${
                index > 0 ? 'border-t border-[#061C36]/8 md:border-l md:border-t-0' : ''
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
