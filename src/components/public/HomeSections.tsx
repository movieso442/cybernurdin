'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  Calendar,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Eye,
  KeyRound,
  Lock,
  MessageCircle,
  Network,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button, Card, ProgressBar } from '@/components/UI';
import { iconRegistry, mentorshipPaths } from '@/lib/cybernurdin-data';

export function HomeHeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-6 text-left"
    >
      <span className="w-fit rounded-full border border-[#F95738]/18 bg-[#F95738]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">
        1:1 Mentorship. Real Skills. Real Impact.
      </span>
      <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-[#061C36] sm:text-5xl lg:text-6xl">
        Cybersecurity Mentorship That Builds <span className="text-[#F95738]">Real Defenders.</span>
      </h1>
      <p className="max-w-2xl text-base font-semibold leading-7 text-white/72 md:text-[#061C36]/72">
        Get guided by industry professionals, follow proven paths, and build in-demand cybersecurity skills through hands-on mentorship and real-world projects.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/apply">
          <Button className="w-full sm:w-auto">
            Start Your Mentorship Journey
            <ArrowRight size={16} />
          </Button>
        </Link>
        <Link href="/courses">
          <Button variant="secondary" className="w-full sm:w-auto">
            Explore Paths
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export function HeroTrustStrip() {
  const items = [
    { label: 'Expert Mentors', icon: ShieldCheck },
    { label: 'Hands-on Projects', icon: BookOpenCheck },
    { label: 'Career Support', icon: BriefcaseBusiness },
    { label: 'Community Access', icon: Users },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/9 p-3 md:grid-cols-4 md:border-[#061C36]/8 md:bg-white/70">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-2 rounded-xl bg-white/8 p-3 text-xs font-black text-white md:bg-[#061C36]/4 md:text-[#061C36]/72">
            <Icon size={16} className="text-[#F95738]" />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export function HeroVisualPanel() {
  const stats = [
    ['500+', 'active learners'],
    ['50+', 'mentor sessions'],
    ['95%', 'guided progress'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="cn-dark-card cn-dark-grid-bg relative overflow-hidden rounded-[28px] p-6 text-white"
    >
      <div className="absolute inset-x-10 top-10 h-48 rounded-full bg-[#F95738]/16 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/6 p-4">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-[10px] font-black uppercase tracking-wide text-white/42">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/8 bg-[#020C18]/40 p-6">
          <div className="relative grid h-44 w-44 place-items-center rounded-full border border-[#0B3D77]/60">
            <span className="absolute inset-5 rounded-full border border-dashed border-[#F95738]/35" />
            <Shield size={96} className="fill-[#F95738]/12 text-[#F95738] drop-shadow-[0_0_24px_rgba(249,87,56,0.38)]" />
            <span className="absolute left-4 top-6 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#061C36] text-[#F5D35E]">
              <Lock size={13} />
            </span>
            <span className="absolute bottom-7 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#061C36] text-[#F95738]">
              <KeyRound size={13} />
            </span>
          </div>
          <div className="mt-5 w-full rounded-2xl border border-white/8 bg-[#061C36]/72 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-black">
              <span>SOC Analyst Journey</span>
              <span className="text-[#F5D35E]">62%</span>
            </div>
            <ProgressBar value={62} dark />
            <div className="mt-4 rounded-xl border border-white/8 bg-white/5 p-3 text-xs text-white/68">
              <div className="flex items-center gap-2 font-black text-white">
                <Calendar size={14} className="text-[#F95738]" />
                Next session
              </div>
              <div className="mt-1">Log Analysis Review, Saturday 3:00 PM WAT</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MentorshipProcessSection() {
  const steps = [
    ['Apply', 'Tell us your background and preferred path.'],
    ['Get Reviewed', 'Your application is assessed before access.'],
    ['Get Access', 'Receive your coupon after approval.'],
    ['Learn', 'Follow one assigned cybersecurity path.'],
    ['Grow', 'Complete lessons, quizzes, and mentor reviews.'],
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="cn-container">
        <Card hoverEffect={false} className="p-5 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_2.8fr] lg:items-center">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">Selective access</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight">Our Mentorship Process</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">A structured review flow keeps the platform focused on serious cybersecurity learners.</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
              {steps.map(([title, description], index) => (
                <div key={title} className="min-w-44 rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F95738] text-sm font-black text-white">{index + 1}</span>
                    {index < steps.length - 1 && <ChevronRight size={15} className="text-[#061C36]/24" />}
                  </div>
                  <h3 className="text-sm font-black">{title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#061C36]/62">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function FeaturedPathsSection() {
  return (
    <section className="py-12 md:py-18">
      <div className="cn-container">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">Cybersecurity only</span>
            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Featured Mentorship Paths</h2>
          </div>
          <Link href="/courses" className="hidden items-center gap-1 text-xs font-black uppercase tracking-wide text-[#F95738] sm:flex">
            View All Paths
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {mentorshipPaths.slice(0, 5).map((path) => {
            const Icon = iconRegistry[path.iconName as keyof typeof iconRegistry] || Shield;
            return (
              <Card key={path.id} className="flex min-h-56 flex-col justify-between p-5">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#F95738]/16 bg-[#F95738]/10 text-[#F95738]">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-4 text-sm font-black leading-5">{path.title}</h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#061C36]/62">{path.description}</p>
                </div>
                <Link href={`/paths/${path.slug}`} className="mt-5 flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-[#F95738]">
                  Explore Path
                  <ArrowRight size={13} />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyCyberNurdinSection() {
  const reasons = [
    [ShieldCheck, '1:1 Expert Mentorship', 'Get reviewed by cybersecurity mentors who focus on practical defender growth.'],
    [BookOpenCheck, 'Real-world Projects', 'Build evidence through guided notes, labs, slides, quizzes, and review checkpoints.'],
    [BriefcaseBusiness, 'Career Advancement', 'Translate learning into portfolios, interview stories, and focused next steps.'],
    [Calendar, 'Flexible Learning', 'Use YouTube lessons and structured progress around your weekly commitment.'],
    [MessageCircle, 'Community Access', 'Learn with a focused group of serious cybersecurity mentees.'],
  ];

  return (
    <section className="bg-white/45 py-16 md:py-20">
      <div className="cn-container">
        <div className="max-w-xl">
          <span className="text-[11px] font-black uppercase tracking-wide text-[#F95738]">Why learners choose CyberNurdin</span>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Guided, selective, and built for defenders.</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {reasons.map(([Icon, title, description]) => {
            const ReasonIcon = Icon as typeof ShieldCheck;
            return (
              <div key={title as string} className="rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-5">
                <ReasonIcon size={22} className="text-[#F95738]" />
                <h3 className="mt-4 text-sm font-black">{title as string}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#061C36]/62">{description as string}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="cn-container">
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="p-6">
              <div className="flex gap-1 text-[#F5D35E]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Award key={star} size={14} className="fill-[#F5D35E]/20" />
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#061C36]/70">
                Mentee feedback placeholder: structured mentorship, clear weekly targets, and guided cybersecurity practice.
              </p>
              <div className="mt-5 text-xs font-black uppercase tracking-wide text-[#061C36]/48">Mentee feedback placeholder</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="cn-container">
        <div className="rounded-[28px] bg-[#061C36] p-8 text-white md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black md:text-3xl">Ready to accelerate your cybersecurity career?</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/62">Apply, get reviewed, receive your coupon, and begin one guided cybersecurity path at a time.</p>
            </div>
            <Link href="/apply">
              <Button className="w-full md:w-auto">
                Apply Now
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePageView() {
  return (
    <main className="cn-grid-bg bg-[#061C36] md:bg-[#FAF7F0]">
      <section className="cn-container grid min-h-[calc(100vh-64px)] items-center gap-10 py-12 md:min-h-[720px] lg:grid-cols-[1.06fr_0.94fr]">
        <div>
          <HomeHeroSection />
          <HeroTrustStrip />
        </div>
        <HeroVisualPanel />
      </section>
      <div className="bg-[#FAF7F0]">
        <MentorshipProcessSection />
        <FeaturedPathsSection />
        <WhyCyberNurdinSection />
        <TestimonialsSection />
        <FinalCTASection />
      </div>
    </main>
  );
}
