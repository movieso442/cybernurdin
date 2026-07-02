import type { CSSProperties, ReactNode } from 'react';
import { Building2, Lock, Users } from 'lucide-react';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';

type HeroSize = 'sm' | 'md' | 'lg';

type HeroRootStyle = CSSProperties & {
  '--cybernurdin-hero-size': string;
};

type OrbitBadgeStyle = CSSProperties & {
  '--orbit-start': string;
  '--orbit-end': string;
  '--counter-start': string;
  '--counter-end': string;
  '--orbit-duration': string;
  '--orbit-delay': string;
};

const sizeMap: Record<HeroSize, string> = {
  sm: '360px',
  md: '420px',
  lg: '480px',
};

function OrbitBadge({
  start,
  end,
  counterStart,
  counterEnd,
  duration,
  delay,
  label,
  children,
}: {
  start: string;
  end: string;
  counterStart: string;
  counterEnd: string;
  duration: string;
  delay: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className="cybernurdin-orbit-runner"
      style={
        {
          '--orbit-start': start,
          '--orbit-end': end,
          '--counter-start': counterStart,
          '--counter-end': counterEnd,
          '--orbit-duration': duration,
          '--orbit-delay': delay,
        } as OrbitBadgeStyle
      }
      aria-label={label}
    >
      <div className="cybernurdin-orbit-badge">
        <span className="cybernurdin-orbit-badge-inner">{children}</span>
      </div>
    </div>
  );
}

export default function CyberNurdinHeroIllustration({
  size = 'lg',
  className = '',
}: {
  size?: HeroSize;
  className?: string;
}) {
  return (
    <div
      className={['cybernurdin-hero-visual relative mx-auto overflow-visible', className].filter(Boolean).join(' ')}
      style={{ '--cybernurdin-hero-size': sizeMap[size] } as HeroRootStyle}
    >
      <style>
        {`
          .cybernurdin-hero-visual {
            --cyber-navy: #061C36;
            --cyber-blue: #0B3D77;
            --cyber-orange: #F95738;
            --cyber-cream: #EBEBD3;
            --cyber-white: #FFFFFF;
            width: min(100%, var(--cybernurdin-hero-size));
            aspect-ratio: 1;
          }

          .cybernurdin-orbit-layer,
          .cybernurdin-dot-layer {
            pointer-events: none;
          }

          .cybernurdin-orbit-layer {
            position: absolute;
            inset: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          .cybernurdin-orbit-arc {
            transform-origin: 240px 240px;
          }

          .cybernurdin-dot {
            position: absolute;
            border-radius: 9999px;
            opacity: 0.16;
            transform: translate(-50%, -50%) scale(0.76);
            animation: cybernurdin-dot-pulse 6.8s ease-in-out infinite;
          }

          .cybernurdin-dot:nth-child(2n) {
            animation-duration: 7.8s;
            animation-delay: -1.3s;
          }

          .cybernurdin-dot:nth-child(3n) {
            animation-duration: 8.4s;
            animation-delay: -2.6s;
          }

          .cybernurdin-hero-logo {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 2;
            width: clamp(160px, 42%, 205px);
            height: clamp(160px, 42%, 205px);
            transform: translate(-50%, -50%);
            display: grid;
            place-items: center;
            filter: drop-shadow(0 18px 24px rgba(6, 28, 54, 0.14));
          }

          .cybernurdin-hero-logo img {
            width: 88%;
            height: 88%;
          }

          .cybernurdin-orbit-runner {
            position: absolute;
            inset: 15%;
            z-index: 3;
            border-radius: 9999px;
            transform-origin: center;
            pointer-events: none;
            animation: cybernurdin-arc-orbit var(--orbit-duration) cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
            animation-delay: var(--orbit-delay);
          }

          .cybernurdin-orbit-badge {
            position: absolute;
            left: 50%;
            top: 0;
            width: clamp(48px, 12%, 58px);
            height: clamp(48px, 12%, 58px);
            animation: cybernurdin-badge-counter var(--orbit-duration) cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
            animation-delay: var(--orbit-delay);
          }

          .cybernurdin-orbit-badge-inner {
            display: grid;
            width: 100%;
            height: 100%;
            place-items: center;
            border: 1.4px solid rgba(249, 87, 56, 0.92);
            border-radius: 9999px;
            background:
              radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.94) 0 40%, rgba(255, 248, 239, 0.98) 41% 100%);
            box-shadow: 0 14px 22px rgba(6, 28, 54, 0.14);
          }

          .cybernurdin-orbit-badge svg {
            width: 45%;
            height: 45%;
          }

          @keyframes cybernurdin-arc-orbit {
            from {
              transform: rotate(var(--orbit-start));
            }
            to {
              transform: rotate(var(--orbit-end));
            }
          }

          @keyframes cybernurdin-badge-counter {
            from {
              transform: translate(-50%, -50%) rotate(var(--counter-start));
            }
            to {
              transform: translate(-50%, -50%) rotate(var(--counter-end));
            }
          }

          @keyframes cybernurdin-dot-pulse {
            0%, 100% {
              opacity: 0.1;
              transform: translate(-50%, -50%) scale(0.7);
            }
            45% {
              opacity: 0.28;
              transform: translate(-50%, -50%) scale(1);
            }
            70% {
              opacity: 0.15;
              transform: translate(-50%, -50%) scale(0.84);
            }
          }
        `}
      </style>

      <svg className="cybernurdin-orbit-layer" viewBox="0 0 480 480" aria-hidden="true">
        <circle
          className="cybernurdin-orbit-arc"
          cx="240"
          cy="240"
          r="168"
          fill="none"
          stroke="#061C36"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="210 846"
          strokeDashoffset="-600"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          className="cybernurdin-orbit-arc"
          cx="240"
          cy="240"
          r="168"
          fill="none"
          stroke="#061C36"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="205 851"
          strokeDashoffset="-938"
          opacity="0.78"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          className="cybernurdin-orbit-arc"
          cx="240"
          cy="240"
          r="168"
          fill="none"
          stroke="#F95738"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="250 806"
          strokeDashoffset="-162"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="cybernurdin-dot-layer absolute inset-0 z-0">
        <span className="cybernurdin-dot" style={{ left: '45%', top: '21%', width: '5px', height: '5px', backgroundColor: '#F95738' }} />
        <span className="cybernurdin-dot" style={{ left: '58%', top: '19%', width: '4px', height: '4px', backgroundColor: '#0B3D77' }} />
        <span className="cybernurdin-dot" style={{ left: '70%', top: '35%', width: '5px', height: '5px', backgroundColor: '#F95738' }} />
        <span className="cybernurdin-dot" style={{ left: '33%', top: '39%', width: '4px', height: '4px', backgroundColor: '#061C36' }} />
        <span className="cybernurdin-dot" style={{ left: '75%', top: '55%', width: '4px', height: '4px', backgroundColor: '#F95738' }} />
        <span className="cybernurdin-dot" style={{ left: '43%', top: '73%', width: '5px', height: '5px', backgroundColor: '#061C36' }} />
        <span className="cybernurdin-dot" style={{ left: '59%', top: '76%', width: '4px', height: '4px', backgroundColor: '#0B3D77' }} />
        <span className="cybernurdin-dot" style={{ left: '28%', top: '56%', width: '4px', height: '4px', backgroundColor: '#F95738' }} />
        <span className="cybernurdin-dot" style={{ left: '82%', top: '45%', width: '3.5px', height: '3.5px', backgroundColor: '#061C36' }} />
      </div>

      <CyberNurdinLogo className="cybernurdin-hero-logo" size="xl" variant="iconOnly" />

      <OrbitBadge start="-58deg" end="-16deg" counterStart="58deg" counterEnd="16deg" duration="8s" delay="-0.4s" label="Lock orbit">
        <Lock color="#061C36" strokeWidth={2.5} />
      </OrbitBadge>
      <OrbitBadge start="50deg" end="104deg" counterStart="-50deg" counterEnd="-104deg" duration="10s" delay="-1.7s" label="People orbit">
        <Users color="#0B3D77" strokeWidth={2.4} />
      </OrbitBadge>
      <OrbitBadge start="146deg" end="214deg" counterStart="-146deg" counterEnd="-214deg" duration="12s" delay="-3.1s" label="Organisation orbit">
        <Building2 color="#061C36" strokeWidth={2.4} />
      </OrbitBadge>
    </div>
  );
}
