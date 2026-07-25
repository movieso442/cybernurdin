'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Lock,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Target,
  User,
  Users,
} from 'lucide-react';
import { Badge, Button, Card, Input } from '@/components/UI';
import CyberNurdinHeroIllustration from '@/components/shared/CyberNurdinHeroIllustration';
import { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';
import { YOUTUBE_CHANNEL_URL, iconRegistry, mentorshipPaths, mentorshipPlans } from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <section className={`cn-container grid gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:items-center ${compact ? 'md:py-14' : 'md:py-20'}`}>
      <div className="text-left">
        <span className="rounded-full border border-[#F95738]/18 bg-[#F95738]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">
          {eyebrow}
        </span>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#061C36] sm:text-5xl lg:text-6xl">
          {title} <span className="text-[#F95738]">{accent}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[#061C36]/68">{description}</p>
      </div>
      <div className="hidden md:block">
        <CyberNurdinHeroIllustration />
      </div>
    </section>
  );
}

export function PlansPageView() {
  return (
    <main className="cn-grid-bg">
      <PageHero
        eyebrow="Mentorship plans built for your journey"
        title="Choose the Plan."
        accent="Become the Defender."
        description="Plan access is configured after application review, so pricing and cadence can match your path, mentor support level, and weekly commitment."
      />
      <section className="cn-container pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {mentorshipPlans.map((plan) => (
            <Card key={plan.id} className="flex min-h-[360px] flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">{plan.name}</h2>
                  <CyberNurdinLogoMark className="h-8 w-8" />
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/62">{plan.audience}</p>
                <div className="mt-6 rounded-2xl bg-[#FAF7F0] p-4">
                  <div className="text-[11px] font-black uppercase tracking-wide text-[#061C36]/44">Price</div>
                  <div className="mt-1 text-xl font-black text-[#061C36]">{plan.price}</div>
                </div>
                <ul className="mt-6 space-y-3 text-sm font-bold text-[#061C36]/72">
                  {[plan.sessions, plan.projectSupport, plan.support, 'Coupon-based dashboard access'].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-[#F95738]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/apply" className="mt-6">
                <Button className="w-full">Apply for {plan.name}</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
      <section className="cn-container pb-20">
        <Card hoverEffect={false} className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-xl font-black">Compare plan fit</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">No false pricing is hardcoded. Final access details stay configurable for the later operations tooling.</p>
            </div>
            <div className="grid gap-3 text-sm font-bold text-[#061C36]/70 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAF7F0] p-4">Starter: foundation and direction</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">Pro: projects and accountability</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">Premium: capstone and career support</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">All: one active path at a time</div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}

export function CoursesPageView() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [duration, setDuration] = useState('All');

  const categories = ['All', ...Array.from(new Set(mentorshipPaths.map((path) => path.category)))];
  const filtered = useMemo(
    () =>
      mentorshipPaths.filter((path) => {
        const search = `${path.title} ${path.description} ${path.category}`.toLowerCase().includes(query.toLowerCase());
        const levelMatch = level === 'All' || path.level === level;
        const categoryMatch = category === 'All' || path.category === category;
        const durationMatch = duration === 'All' || path.duration.includes(duration);
        return search && levelMatch && categoryMatch && durationMatch;
      }),
    [category, duration, level, query],
  );

  return (
    <main className="cn-grid-bg">
      <PageHero
        eyebrow="Cybersecurity mentorship paths"
        title="Learn Cybersecurity."
        accent="Build Real-World Impact."
        description="Explore cybersecurity-only paths. Public visitors can preview options; actual lessons unlock only after approval, coupon login, and assignment."
      />
      <section className="cn-container pb-10">
        <Card hoverEffect={false} className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <label className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#061C36]/35" size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="cn-input pl-10" placeholder="Search path, skill, or role..." />
            </label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="cn-input">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={level} onChange={(event) => setLevel(event.target.value)} className="cn-input">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={duration} onChange={(event) => setDuration(event.target.value)} className="cn-input">
              {['All', '4', '6', '7', '8'].map((item) => <option key={item} value={item}>{item === 'All' ? 'All durations' : `${item} weeks`}</option>)}
            </select>
          </div>
        </Card>
      </section>
      <section className="cn-container pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((path) => {
            const Icon = iconRegistry[path.iconName as keyof typeof iconRegistry];
            const useLogo = path.iconName === 'shield';
            const comingSoon = path.availability === 'coming-soon';
            return (
              <Card key={path.id} className={`flex min-h-[360px] flex-col justify-between p-6 ${comingSoon ? 'opacity-90' : ''}`}>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#F95738]/16 bg-[#F95738]/10 text-[#F95738]">
                      {useLogo ? <CyberNurdinLogoMark className="h-8 w-8" /> : <Icon size={24} />}
                    </span>
                    {comingSoon ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#061C36]/12 bg-[#FAF7F0] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#061C36]/50">
                        <Lock size={11} /> Coming Soon
                      </span>
                    ) : (
                      <Badge>{path.level}</Badge>
                    )}
                  </div>
                  <h2 className="mt-5 text-xl font-black">{path.title}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">{path.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-black text-[#061C36]/52">
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#F95738]" />{comingSoon ? 'Coming soon' : path.duration}</span>
                    <span className="flex items-center gap-1.5"><User size={14} className="text-[#F95738]" />{path.mentorName}</span>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm font-bold text-[#061C36]/70">
                    {path.outcomes.slice(0, 3).map((outcome) => (
                      <li key={outcome} className="flex gap-2"><Check size={15} className="mt-0.5 text-[#F95738]" />{outcome}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#061C36]/8 pt-4">
                  <Link href={`/paths/${path.slug}`} className="text-xs font-black uppercase tracking-wide text-[#F95738]">View Path</Link>
                  {comingSoon ? (
                    <Button variant="secondary" disabled className="min-h-9 px-4 py-2 text-xs">
                      <Lock size={13} /> Coming Soon
                    </Button>
                  ) : (
                    <Link href="/apply">
                      <Button className="min-h-9 px-4 py-2 text-xs">Apply</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export function PathPreviewPageView({ slug }: { slug: string }) {
  const path = mentorshipPaths.find((item) => item.slug === slug) || mentorshipPaths[0];
  const Icon = iconRegistry[path.iconName as keyof typeof iconRegistry];
  const useLogo = path.iconName === 'shield';
  const comingSoon = path.availability === 'coming-soon';

  return (
    <main className="cn-grid-bg">
      <section className="cn-container py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            {comingSoon ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#061C36]/12 bg-[#FAF7F0] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#061C36]/54">
                <Lock size={12} /> Coming Soon
              </span>
            ) : (
              <Badge>{path.level}</Badge>
            )}
            <h1 className="mt-4 text-4xl font-black tracking-tight">{path.title}</h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#061C36]/66">{path.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {comingSoon ? (
                <Link href="/apply"><Button variant="secondary">Apply to Join Waitlist</Button></Link>
              ) : (
                <Link href="/apply"><Button>Apply for Mentorship</Button></Link>
              )}
              <Link href="/courses"><Button variant="secondary">Back to Paths</Button></Link>
            </div>
          </div>
          <Card className="p-6">
            {useLogo ? <CyberNurdinLogoMark className="h-12 w-12" /> : <Icon size={38} className="text-[#F95738]" />}
            <div className="mt-5 grid gap-3 text-sm font-bold text-[#061C36]/68">
              <div className="rounded-xl bg-[#FAF7F0] p-4">Duration: {comingSoon ? 'Announced closer to launch' : path.duration}</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">Mentor: {path.mentorName}</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">
                {comingSoon ? 'Status: Future mentorship track — not yet open for enrollment' : 'Access: assigned after approval and coupon login'}
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="cn-container pb-20">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.6fr]">
          <Card className="p-6">
            <h2 className="text-xl font-black">{comingSoon ? 'Roadmap outline' : 'Path units preview'}</h2>
            {comingSoon ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[#061C36]/14 bg-[#FAF7F0] p-6 text-center">
                <Lock size={22} className="mx-auto mb-3 text-[#061C36]/28" />
                <p className="font-black">Full curriculum coming soon</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/56">
                  This mentorship track is in development. Apply now to join the waitlist and be notified when it opens.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {path.units.map((unit) => (
                  <div key={unit.id} className="rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-4">
                    <h3 className="font-black">{unit.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#061C36]/60">{unit.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>{unit.modules.length} modules</Badge>
                      <Badge>{unit.estimatedDuration}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-black">What you will learn</h2>
            <ul className="mt-5 space-y-3 text-sm font-bold text-[#061C36]/70">
              {path.outcomes.map((outcome) => <li key={outcome} className="flex gap-2"><Check className="mt-0.5 text-[#F95738]" size={16} />{outcome}</li>)}
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}

export function AboutPageView() {
  const missionVision = [
    {
      label: 'Mission',
      title: 'Turn scattered cybersecurity learning into guided skill growth.',
      body: 'CyberNurdin helps serious learners build practical cybersecurity ability through focused mentorship, structured paths, reviewed work, and clear accountability.',
      points: ['Focused cybersecurity paths', 'Mentor-reviewed practice', 'Accountability from application to progress'],
    },
    {
      label: 'Vision',
      title: 'Shape confident defenders who can think, build, and respond.',
      body: 'We are building a mentorship platform where learners move beyond random tutorials into real security thinking, professional habits, and career-ready proof of work.',
      points: ['Confident technical reasoning', 'Portfolio-ready learning evidence', 'A stronger pipeline of future defenders'],
    },
  ];

  const whyItems = [
    {
      title: 'Structured Learning Paths',
      body: 'Every learner follows a focused cybersecurity path, so progress is intentional instead of scattered.',
      icon: BookOpenCheck,
    },
    {
      title: 'Mentor Accountability',
      body: 'Work is guided, reviewed, and improved with feedback from a mentor who keeps the journey practical.',
      icon: ShieldCheck,
    },
    {
      title: 'Hands-on Practice',
      body: 'Lessons, quizzes, projects, and review checkpoints help learners turn concepts into usable skill.',
      icon: GraduationCap,
    },
    {
      title: 'Career Direction',
      body: 'CyberNurdin helps learners connect skills to portfolios, interview confidence, and next-step readiness.',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Selective Community',
      body: 'Application-based access keeps the learning environment serious, focused, and growth-minded.',
      icon: Users,
    },
    {
      title: 'Dashboard Progress',
      body: 'Learners can track lessons, sessions, slides, quizzes, and active path progress from one place.',
      icon: Target,
    },
  ];

  const founderHighlights = [
    'Co-Founder of Bauhaven',
    'Backend developer and mentor',
    'Tutor, public speaker, and community advocate',
    'Focused on practical cybersecurity education',
  ];

  return (
    <main className="cn-grid-bg overflow-hidden">
      <PageHero
        eyebrow="Our story, mission, and commitment"
        title="CyberNurdin is built to turn serious learners into"
        accent="real defenders."
        description="CyberNurdin is a cybersecurity mentorship platform for learners who want structure, practical work, mentor review, and a clear path toward career-ready confidence — proudly serving learners in Cameroon and beyond."
      />

      <section className="cn-container pb-16 md:pb-20">
        <div className="mb-8 max-w-2xl">
          <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">Mission & Vision</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#061C36] md:text-4xl">
            Built for learners who need a real roadmap, not just more content.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {missionVision.map((item) => (
            <article key={item.label} className="rounded-lg border border-[#061C36]/10 bg-white p-6 shadow-[0_16px_34px_rgba(6,28,54,0.055)] md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#F95738]/10 text-[#F95738]">
                  <CheckCircle2 size={22} />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#F95738]">{item.label}</span>
              </div>
              <h3 className="mt-5 text-2xl font-black leading-tight text-[#061C36]">{item.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#061C36]/66">{item.body}</p>
              <ul className="mt-6 grid gap-3">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm font-bold text-[#061C36]/74">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#F95738]" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#061C36] py-16 text-white md:py-20">
        <div className="cn-container">
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">Why CyberNurdin</span>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              CyberNurdin is designed to keep learners moving.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/68 md:text-base">
              Many learners start cybersecurity with energy but lose direction between tools, videos, and disconnected advice. CyberNurdin gives them one guided path, practical assignments, mentor feedback, and a dashboard that makes progress visible.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/courses">
                <Button className="w-full sm:w-auto">
                  Explore Courses
                  <ArrowRight size={15} />
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="secondary" className="w-full border-white/20 bg-white/8 text-white hover:bg-white hover:text-[#061C36] sm:w-auto">
                  Apply for Mentorship
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.065] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.16)] transition duration-200 hover:-translate-y-1 hover:border-[#F95738]/45 hover:bg-white/[0.09]">
                  <span className="absolute inset-x-0 top-0 h-1 bg-[#F95738] opacity-80" />
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#F95738]/12 text-[#F95738] transition duration-200 group-hover:bg-[#F95738] group-hover:text-white">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-5 text-base font-black">{item.title}</h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-white/64">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cn-container py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-[#061C36]/10 bg-[#061C36] px-5 pt-7 shadow-[0_24px_52px_rgba(6,28,54,0.18)] md:min-h-[600px] md:px-8">
            <div className="absolute inset-0 cn-dark-grid-bg opacity-55" />
            <div className="absolute inset-x-0 top-0 h-1 bg-[#F95738]" />
            <div className="absolute -left-10 top-14 h-28 w-[115%] -rotate-6 bg-[#F95738]/12" />
            <div className="absolute inset-x-8 top-24 h-px bg-white/12" />
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#061C36] via-[#061C36]/74 to-transparent" />
            <div className="absolute right-6 top-7 text-[82px] font-black leading-none text-white/[0.035] md:text-[118px]">CN</div>

            <div className="relative z-20 flex items-center justify-between gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">Founder & Mentor</span>
              <span className="hidden rounded-lg border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/72 sm:inline-flex">
                CyberNurdin
              </span>
            </div>

            <Image
              src="/kewangang-founder-cutout.png"
              alt="Kewangang Muhammed Nurdin, founder of CyberNurdin"
              width={1254}
              height={1254}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[92%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_26px_34px_rgba(0,0,0,0.36)]"
              priority
            />

            <div className="absolute inset-x-5 bottom-5 z-20 rounded-lg border border-white/10 bg-[#031224]/82 p-4 text-white shadow-[0_16px_36px_rgba(0,0,0,0.28)] backdrop-blur md:inset-x-8">
              <p className="text-xl font-black leading-tight">Kewangang Muhammed Nurdin</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-white/64">
                Tech mentor, backend developer, and cybersecurity learning builder.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <CyberNurdinLogoMark className="h-10 w-10" />
              <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">About the founder</span>
            </div>
            <h2 className="text-3xl font-black text-[#061C36] md:text-4xl">
              Led by a builder who understands mentorship, community, and practical tech learning.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#061C36]/68">
              CyberNurdin is led by Kewangang Muhammed Nurdin, a tech mentor and platform builder focused on helping learners move from curiosity to usable cybersecurity skill. His work combines backend development, tutoring, community support, and hands-on learning systems for students who want direction and accountability.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {founderHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-[#061C36]/8 bg-white p-4 text-sm font-black text-[#061C36]/76">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#F95738]" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://bauhaven.com/about"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#061C36]/12 bg-white px-5 text-sm font-black text-[#061C36] transition hover:border-[#F95738]/40 hover:text-[#F95738]"
              >
                Portfolio / Work
                <ExternalLink size={15} />
              </a>
              <a
                href="https://cm.linkedin.com/in/kewangang-muhammed-nurdin-29b53636b"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0B3D77] px-5 text-sm font-black text-white transition hover:bg-[#061C36]"
              >
                LinkedIn
                <span className="grid h-4 min-w-4 place-items-center rounded bg-white/16 text-[10px] font-black">in</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F95738] px-5 text-sm font-black text-white transition hover:bg-[#e94b2f]"
              >
                Contact
                <Mail size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ContactPageView() {
  const { triggerToast } = useApp();
  return (
    <main className="cn-grid-bg">
      <PageHero
        eyebrow="Contact us"
        title="We are here to help you build"
        accent="Real-World Cyber Defenders."
        description="Ask about mentorship paths, applications, coupons, dashboard access, sessions, or practical cybersecurity learning."
        compact
      />
      <section className="cn-container grid gap-6 pb-20 lg:grid-cols-[1fr_0.72fr]">
        <Card className="p-6">
          <h2 className="text-xl font-black">Send Us a Message</h2>
          <form
            className="mt-5 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              triggerToast('Message received. We will respond through the contact channel you provided.', 'success');
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" required icon={<User size={15} />} />
              <Input label="Email" type="email" required icon={<Mail size={15} />} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Mentorship area of interest</span>
                <select className="cn-input" required>
                  <option value="">Select area</option>
                  {mentorshipPaths.map((path) => <option key={path.id}>{path.title}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Current level</span>
                <select className="cn-input" required>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>
            <Input label="Subject" required icon={<Target size={15} />} />
            <label>
              <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Message</span>
              <textarea className="cn-input min-h-32 resize-y" required placeholder="How can we help?" />
            </label>
            <Button className="w-full sm:w-fit">Send Message <ArrowRight size={15} /></Button>
          </form>
        </Card>
        <div className="space-y-5">
          <Card className="p-6">
            <Mail className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">Email Support</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Quick mentorship inquiries and application support.</p>
            <a href="mailto:hello@cybernurdin.com" className="mt-4 block">
              <Button className="w-full">Email Us</Button>
            </a>
          </Card>
          <Card className="p-6">
            <Clock className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">Office Hours</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Mon - Sat, 9:00 AM - 7:00 PM WAT (Cameroon time). Messages outside office hours are reviewed on the next support cycle.</p>
          </Card>
          <Card className="p-6">
            <MessageSquare className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">Other Ways to Reach Us</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Email: hello@cybernurdin.com</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Channel content: <a className="text-[#F95738]" href={YOUTUBE_CHANNEL_URL}>CyberNurdin YouTube</a></p>
          </Card>
        </div>
      </section>
    </main>
  );
}
