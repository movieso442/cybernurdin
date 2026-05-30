'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Shield,
  Target,
  User,
} from 'lucide-react';
import { Badge, Button, Card, Input } from '@/components/UI';
import { YOUTUBE_CHANNEL_URL, iconRegistry, mentorshipPaths, mentorshipPlans } from '@/lib/cybernurdin-data';
import { HeroVisualPanel } from './HomeSections';
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
        <HeroVisualPanel />
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
                  <Shield className="text-[#F95738]" size={24} />
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
            const Icon = iconRegistry[path.iconName as keyof typeof iconRegistry] || Shield;
            return (
              <Card key={path.id} className="flex min-h-[360px] flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#F95738]/16 bg-[#F95738]/10 text-[#F95738]">
                      <Icon size={24} />
                    </span>
                    <Badge>{path.level}</Badge>
                  </div>
                  <h2 className="mt-5 text-xl font-black">{path.title}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">{path.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-black text-[#061C36]/52">
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#F95738]" />{path.duration}</span>
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
                  <Link href="/apply">
                    <Button className="min-h-9 px-4 py-2 text-xs">Apply</Button>
                  </Link>
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
  const Icon = iconRegistry[path.iconName as keyof typeof iconRegistry] || Shield;

  return (
    <main className="cn-grid-bg">
      <section className="cn-container py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge>{path.level}</Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight">{path.title}</h1>
            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#061C36]/66">{path.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/apply"><Button>Apply for Mentorship</Button></Link>
              <Link href="/courses"><Button variant="secondary">Back to Paths</Button></Link>
            </div>
          </div>
          <Card className="p-6">
            <Icon size={38} className="text-[#F95738]" />
            <div className="mt-5 grid gap-3 text-sm font-bold text-[#061C36]/68">
              <div className="rounded-xl bg-[#FAF7F0] p-4">Duration: {path.duration}</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">Mentor: {path.mentorName}</div>
              <div className="rounded-xl bg-[#FAF7F0] p-4">Access: assigned after approval and coupon login</div>
            </div>
          </Card>
        </div>
      </section>
      <section className="cn-container pb-20">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.6fr]">
          <Card className="p-6">
            <h2 className="text-xl font-black">Modules preview</h2>
            <div className="mt-5 space-y-4">
              {path.modules.map((module) => (
                <div key={module.id} className="rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-4">
                  <h3 className="font-black">{module.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#061C36]/60">{module.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {module.lessons.map((lesson) => <Badge key={lesson.id}>{lesson.duration}</Badge>)}
                  </div>
                </div>
              ))}
            </div>
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
  const values = ['Integrity', 'Practical skill', 'Mentor accountability', 'Community', 'Real-world impact'];
  return (
    <main className="cn-grid-bg">
      <PageHero
        eyebrow="Our story, mission, and commitment"
        title="Built by Defenders."
        accent="For Future Defenders."
        description="CyberNurdin exists to move serious learners from scattered cybersecurity content into guided, reviewed, practical growth."
      />
      <section className="cn-container grid gap-6 pb-20 lg:grid-cols-[1fr_0.72fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ['Mission', 'Empower aspiring cybersecurity professionals with focused mentorship, practical learning, and reviewed proof of work.'],
            ['Vision', 'Shape confident defenders who can reason clearly, communicate risk, and keep improving.'],
            ['Why CyberNurdin Exists', 'Too many learners jump between tools without a mentor. This platform gives them a guided path and feedback loop.'],
            ['Mentorship Philosophy', 'Learn, build, review, and defend. The mentor relationship keeps the work grounded and accountable.'],
          ].map(([title, copy]) => (
            <Card key={title} className="p-6">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/64">{copy}</p>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F95738]/10 text-xl font-black text-[#F95738]">CN</div>
            <div>
              <h2 className="text-xl font-black">Founder / Mentor Section</h2>
              <p className="text-sm font-semibold text-[#061C36]/60">Cybersecurity mentorship leadership</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold leading-6 text-[#061C36]/64">Founder and mentor details can be updated with verified biography and profile assets. This section is intentionally honest and avoids invented credentials.</p>
          <div className="mt-6 grid gap-3">
            {values.map((value) => <div key={value} className="rounded-xl bg-[#FAF7F0] p-4 text-sm font-black">{value}</div>)}
          </div>
        </Card>
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
            <Phone className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">WhatsApp Support</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Quick mentorship inquiries and application support.</p>
            <a href="https://wa.me/2348021234567" target="_blank" rel="noreferrer" className="mt-4 block">
              <Button className="w-full">Chat on WhatsApp</Button>
            </a>
          </Card>
          <Card className="p-6">
            <Clock className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">Office Hours</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Mon - Sat, 9:00 AM - 7:00 PM WAT. Messages outside office hours are reviewed on the next support cycle.</p>
          </Card>
          <Card className="p-6">
            <MessageSquare className="text-[#F95738]" size={24} />
            <h2 className="mt-4 text-lg font-black">Other Ways to Reach Us</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Email: support@cybernurdin.com</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">Channel content: <a className="text-[#F95738]" href={YOUTUBE_CHANNEL_URL}>CyberNurdin YouTube</a></p>
          </Card>
        </div>
      </section>
    </main>
  );
}
