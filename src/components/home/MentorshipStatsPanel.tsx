import { CalendarDays, Check, Lock, Star, TrendingUp, UserRound } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Active Mentees', icon: UserRound },
  { value: '50+', label: 'Expert Mentors', icon: UserRound },
  { value: '95%', label: 'Career Progression', icon: TrendingUp },
  { value: '4.9/5', label: 'Mentor Rating', icon: Star, rating: true },
];

const journeyItems = [
  { label: 'Foundations', done: true },
  { label: 'SIEM & Log Analysis', done: true },
  { label: 'Incident Response', active: true },
  { label: 'Threat Hunting', locked: true },
];

export default function MentorshipStatsPanel() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-lg bg-[#061C36] px-6 py-8 text-white shadow-[0_20px_42px_rgba(6,28,54,0.18)] md:px-10">
      <div className="absolute right-0 top-0 h-full w-[38%] opacity-30 [background-image:radial-gradient(#0B6ABE_1.1px,transparent_1.1px)] [background-size:9px_9px]" />
      <div className="relative grid h-full gap-7 lg:grid-cols-[0.95fr_1.05fr_1fr] lg:items-center">
        <div className="space-y-4 lg:border-r lg:border-white/24 lg:pr-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="grid grid-cols-[34px_auto] items-center gap-4">
                <Icon size={27} className="text-[#F5D35E]" strokeWidth={2.1} />
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[28px] font-black leading-none">{stat.value}</span>
                  <span className="text-sm font-medium text-white/84">{stat.label}</span>
                  {stat.rating && (
                    <span className="flex gap-0.5 text-[#F5D35E]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill="currentColor" />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-md border border-white/20 bg-[#08284D]/82 p-5 lg:mx-0">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black">Your Journey</h2>
            <span className="rounded-full bg-[#F5D35E] px-3 py-1 text-[10px] font-black text-[#061C36]">
              In Progress
            </span>
          </div>
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-base font-bold">SOC Analyst Path</p>
              <p className="text-xs font-semibold text-white/70">62% Completed</p>
            </div>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/18">
            <div className="h-full w-[62%] rounded-full bg-[#F5D35E]" />
          </div>
          <div className="space-y-2">
            {journeyItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white/88">
                  {item.locked ? (
                    <Lock size={14} className="text-white/62" />
                  ) : item.active ? (
                    <span className="grid h-4 w-4 place-items-center rounded-full border border-[#F5D35E] text-[9px] text-[#F5D35E]">&bull;</span>
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded-full border border-[#F5D35E] text-[#F5D35E]">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                  {item.label}
                </span>
                {item.done && <Check size={16} className="text-[#F5D35E]" />}
                {item.active && <span className="h-4 w-4 rounded-full border border-[#F5D35E]/75" />}
                {item.locked && <Lock size={15} className="text-white/62" />}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:border-l lg:border-white/24 lg:pl-10">
          <h2 className="text-lg font-black">Next Session</h2>
          <p className="mt-5 text-base font-semibold">Log Analysis Deep Dive</p>
          <p className="mt-5 flex items-center gap-3 text-sm font-medium text-white/88">
            <CalendarDays size={18} />
            Sat, May 24 &middot; 3:00 PM (WAT)
          </p>
        </div>
      </div>
    </div>
  );
}
