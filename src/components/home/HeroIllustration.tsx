import { Building2, Lock, Network, Users } from 'lucide-react';

function ShieldEmblem({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 260" fill="none" aria-hidden="true">
      <path d="M120 14 214 50v80c0 60-38 101-94 120-56-19-94-60-94-120V50l94-36Z" fill="#061C36" />
      <path d="M120 14 214 50v80c0 60-38 101-94 120-56-19-94-60-94-120V50l94-36Z" stroke="#F95738" strokeWidth="16" />
      <path d="m70 82 50 27 50-27" stroke="#F95738" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m70 122 50 27 50-27" stroke="#F95738" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m82 162 38 21 38-21" stroke="#F95738" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const orbitItems = [
  { icon: Lock, className: 'left-[12%] top-[8%]' },
  { icon: Users, className: 'right-[8%] top-[12%]' },
  { icon: Building2, className: 'left-[12%] bottom-[12%]' },
  { icon: Network, className: 'right-[8%] bottom-[12%]' },
];

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[310px] w-full max-w-[520px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,87,56,0.1),transparent_62%)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 530 360" fill="none" aria-hidden="true">
        <circle cx="265" cy="155" r="58" stroke="#F95738" strokeOpacity="0.18" />
        <circle cx="265" cy="155" r="92" stroke="#F95738" strokeOpacity="0.18" />
        <circle cx="265" cy="155" r="127" stroke="#F95738" strokeOpacity="0.18" />
        <path d="M196 98C166 86 135 76 101 62" stroke="#F95738" strokeOpacity="0.45" />
        <path d="M333 98c32-16 64-27 99-39" stroke="#F95738" strokeOpacity="0.45" />
        <path d="M195 210c-31 16-62 27-96 42" stroke="#F95738" strokeOpacity="0.45" />
        <path d="M335 210c33 17 63 28 98 42" stroke="#F95738" strokeOpacity="0.45" />
        {[265, 162, 368].map((x, index) => (
          <circle key={`${x}-${index}`} cx={x} cy={index === 0 ? 36 : 155} r="6" fill="#FFF8EE" stroke="#F95738" strokeWidth="3" />
        ))}
        <circle cx="265" cy="274" r="6" fill="#FFF8EE" stroke="#F95738" strokeWidth="3" />
      </svg>

      <div className="absolute left-1/2 top-1/2 grid h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30px] bg-[#FFF7EB] shadow-[0_24px_50px_rgba(6,28,54,0.13)]">
        <ShieldEmblem className="h-[148px] w-[138px] drop-shadow-[0_14px_22px_rgba(249,87,56,0.24)]" />
      </div>

      {orbitItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.className}
            className={`absolute ${item.className} grid h-[76px] w-[76px] place-items-center rounded-full border border-[#F95738]/38 bg-[#FFF8EF] text-[#061C36] shadow-[0_18px_30px_rgba(6,28,54,0.08)]`}
          >
            <Icon size={30} strokeWidth={2.3} />
          </div>
        );
      })}
    </div>
  );
}
