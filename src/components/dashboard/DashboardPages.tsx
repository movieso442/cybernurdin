'use client';

import type React from 'react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  Play,
  Radio,
  Send,
  Shield,
  Trophy,
  Upload,
  Video,
} from 'lucide-react';
import { Badge, Button, Card, ProgressBar } from '@/components/UI';
import {
  Booking,
  EvidenceSubmission,
  calculatePathProgress,
  calculateUnitProgress,
  getAllLessons,
  getCurrentLesson,
  getPathById,
  getUnitState,
  mentorshipPaths,
} from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';

function useActivePath() {
  const { user, progress } = useApp();
  const path = getPathById(user?.activePathId || '') || mentorshipPaths[0];
  const lessons = getAllLessons(path);
  const percent = calculatePathProgress(path, progress);
  const currentLesson = getCurrentLesson(path, progress);
  const currentUnit = currentLesson?.unit || path.units[0];
  return { path, lessons, percent, currentLesson, currentUnit };
}

function PageTitle({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm font-semibold leading-6 text-[#061C36]/58">{body}</p>
      </div>
      {action}
    </div>
  );
}

function ContinueButton({ href, label = 'Continue Learning' }: { href: string; label?: string }) {
  return (
    <Link href={href}>
      <Button className="w-full sm:w-auto">{label} <ArrowRight size={15} /></Button>
    </Link>
  );
}

function sessionLabel(session?: Booking) {
  if (!session) return 'No session scheduled';
  const day = session.date || session.scheduledAt?.slice(0, 10) || 'Date pending';
  const time = session.time || 'Time pending';
  return `${day} at ${time}`;
}

function getSessionStatus(session?: Booking) {
  if (!session) return 'Scheduled';
  if (session.status === 'live') return 'Live';
  if (session.status === 'completed') return 'Completed';
  if (session.status === 'cancelled') return 'Cancelled';
  return 'Scheduled';
}

function upcomingSession(bookings: Booking[]) {
  return (
    bookings.find((b) => b.status === 'live') ||
    bookings.find((b) => b.status === 'scheduled') ||
    bookings[0]
  );
}

function StateIcon({ state }: { state: string }) {
  if (state === 'completed') return <CheckCircle2 size={16} className="text-emerald-600" />;
  if (state === 'locked') return <Lock size={16} className="text-[#061C36]/28" />;
  return <Play size={16} className="text-[#F95738]" />;
}

function submissionBadge(status: EvidenceSubmission['status']) {
  switch (status) {
    case 'approved': return { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'rejected': return { label: 'Needs Revision', cls: 'bg-red-50 text-red-700 border-red-200' };
    case 'under-review': return { label: 'Under Review', cls: 'bg-[#F5D35E]/15 text-[#7a6000] border-[#F5D35E]/40' };
    default: return { label: 'Pending Review', cls: 'bg-[#0B3D77]/8 text-[#0B3D77] border-[#0B3D77]/20' };
  }
}

export function DashboardOverviewPage() {
  const { user, bookings, submissions } = useApp();
  const { path, percent, currentLesson, currentUnit } = useActivePath();
  const nextSession = upcomingSession(bookings);
  const lessonHref = `/learn/${path.slug}/lessons/${currentLesson?.id}`;

  const pending = submissions.filter((s) => s.status === 'pending' || s.status === 'under-review').length;
  const approved = submissions.filter((s) => s.status === 'approved').length;
  const rejected = submissions.filter((s) => s.status === 'rejected').length;
  const recentFeedback = submissions.find((s) => s.mentorFeedback);

  const stats = [
    { label: 'Path Progress', value: `${percent}%`, icon: BarChart3, color: 'text-[#F95738]' },
    { label: 'Approved', value: approved, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Under Review', value: pending, icon: Clock, color: 'text-[#F5D35E]' },
    { label: 'Needs Revision', value: rejected, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active Mentee
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Mentee'}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm font-semibold leading-6 text-[#061C36]/56">
            Your cybersecurity mentorship command center. One clear next step.
          </p>
        </div>
        <ContinueButton href={lessonHref} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} hoverEffect={false} className="p-4">
            <Icon size={18} className={color} />
            <p className="mt-3 text-2xl font-black">{value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-[#061C36]/44">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card hoverEffect={false} className="overflow-hidden">
          <div className="bg-[#061C36] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#F95738]" />
                  <span className="text-[10px] font-black uppercase tracking-wide text-white/48">Active Path</span>
                </div>
                <h2 className="mt-2 text-xl font-black leading-tight">{path.title}</h2>
                <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/56">{path.description}</p>
              </div>
              <Badge className="shrink-0 border-white/15 bg-white/10 text-white">{path.level}</Badge>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase text-white/48">
                <span>Overall Progress</span>
                <span>{percent}%</span>
              </div>
              <ProgressBar value={percent} dark />
            </div>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">Current Unit</p>
              <h3 className="mt-1 font-black">{currentUnit?.title}</h3>
              <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">Next Required Lesson</p>
              <h3 className="mt-1 text-xl font-black">{currentLesson?.title}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/56">{currentLesson?.description}</p>
            </div>
            <ContinueButton href={lessonHref} label="Open Lesson" />
          </div>
        </Card>

        <div className="grid gap-5">
          <Card hoverEffect={false} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">Next Session</p>
                <h2 className="mt-2 font-black">{nextSession?.topic || nextSession?.title || 'No session booked'}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${getSessionStatus(nextSession) === 'Live' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#EBEBD3] text-[#061C36]/52'}`}>
                {getSessionStatus(nextSession)}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#061C36]/54">{sessionLabel(nextSession)}</p>
            {nextSession?.bbbMeetingId ? (
              <a href={`/api/bbb/join?meetingId=${encodeURIComponent(nextSession.bbbMeetingId)}&fullName=${encodeURIComponent(user?.fullName || 'CyberNurdin Mentee')}&role=attendee&userId=${encodeURIComponent(user?.id || 'mentee')}`}>
                <Button className="mt-4 w-full">Join Session <Radio size={15} /></Button>
              </a>
            ) : (
              <Link href="/dashboard/sessions">
                <Button className="mt-4 w-full" variant="secondary">View Sessions <Calendar size={14} /></Button>
              </Link>
            )}
          </Card>

          {recentFeedback ? (
            <Card hoverEffect={false} className="p-5">
              <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">Latest Mentor Feedback</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/68">{recentFeedback.mentorFeedback}</p>
              <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase ${submissionBadge(recentFeedback.status).cls}`}>
                {submissionBadge(recentFeedback.status).label}
              </span>
            </Card>
          ) : (
            <Card hoverEffect={false} className="p-5">
              <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">Mentor Feedback</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/48">
                Submit evidence for your lessons. Your mentor will review and respond here.
              </p>
              <Link href="/dashboard/submissions">
                <Button className="mt-4 w-full" variant="secondary">View Submissions <Upload size={14} /></Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {submissions.length > 0 && (
        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-black">Recent Submissions</h2>
            <Link href="/dashboard/submissions" className="text-xs font-black text-[#F95738] hover:underline">View all</Link>
          </div>
          <div className="grid gap-3">
            {submissions.slice(0, 3).map((sub) => {
              const badge = submissionBadge(sub.status);
              return (
                <Card key={sub.id} hoverEffect={false} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">Lesson: {sub.lessonId}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-[#061C36]/48">
                        {sub.notes ? sub.notes.slice(0, 80) + (sub.notes.length > 80 ? '…' : '') : 'No reflection note'}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function UnitsRoadmap() {
  const { progress } = useApp();
  const { path, currentLesson } = useActivePath();

  return (
    <div className="space-y-4">
      {path.units.map((unit) => {
        const state = getUnitState(path, unit, progress);
        const unitProgress = calculateUnitProgress(unit, progress);
        const firstLesson = unit.modules.flatMap((m) => m.lessons)[0];
        const continueLessonId = currentLesson?.unitId === unit.id ? currentLesson.id : firstLesson?.id;
        const open = state !== 'locked';

        return (
          <Card key={unit.id} hoverEffect={open} className="overflow-hidden p-0">
            <div className="grid gap-4 p-5 md:grid-cols-[1fr_190px_130px] md:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#F95738]/10 text-xs font-black text-[#F95738]">{unit.order}</span>
                  <p className="text-[10px] font-black uppercase tracking-wide text-[#F95738]">Unit {unit.order}</p>
                </div>
                <h2 className="mt-2 font-black">{unit.title}</h2>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/54">{unit.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs font-black text-[#061C36]/40">
                  <StateIcon state={state} />
                  <span className="capitalize">{state}</span>
                  <span>·</span>
                  <span>{unit.modules.length} modules</span>
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-[10px] font-black uppercase text-[#061C36]/40">
                  <span>Progress</span>
                  <span>{unitProgress}%</span>
                </div>
                <ProgressBar value={unitProgress} />
              </div>
              {open ? (
                <Link href={`/learn/${path.slug}/lessons/${continueLessonId}`}>
                  <Button variant={state === 'in-progress' ? 'primary' : 'secondary'} className="w-full">
                    {state === 'completed' ? 'Review' : 'Continue'}
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="w-full">
                  <Lock size={14} /> Locked
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function MyPathPageView() {
  const { path, percent, currentLesson, currentUnit } = useActivePath();

  return (
    <div>
      <PageTitle
        title="My Path"
        body="Your active mentorship path with modules that unlock as you progress and submit evidence."
        action={<ContinueButton href={`/learn/${path.slug}/lessons/${currentLesson?.id}`} label="Open Current Lesson" />}
      />
      <Card hoverEffect={false} className="mb-5 overflow-hidden p-0">
        <div className="bg-[#061C36] p-6 text-white">
          <Badge className="border-white/15 bg-white/10 text-white">Active Assigned Path</Badge>
          <h1 className="mt-4 text-2xl font-black">{path.title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-white/56">{path.description}</p>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[10px] font-black uppercase text-white/46">
              <span>Path progress</span>
              <span>{percent}%</span>
            </div>
            <ProgressBar value={percent} dark />
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <p className="text-sm font-black text-[#F95738]">Current unit:</p>
          <p className="text-sm font-bold text-[#061C36]/68">{currentUnit?.title}</p>
        </div>
      </Card>
      <UnitsRoadmap />
    </div>
  );
}

export function LessonsPageView() {
  const { progress } = useApp();
  const { path, lessons, currentLesson } = useActivePath();

  return (
    <div>
      <PageTitle
        title="Lessons"
        body="Complete video, slides, and quiz for each lesson. Submit evidence to unlock the next module."
        action={<ContinueButton href={`/learn/${path.slug}/lessons/${currentLesson?.id}`} label="Continue" />}
      />
      <div className="grid gap-3">
        {lessons.map((lesson, index) => {
          const lessonProgress = progress?.lessons?.[lesson.id];
          const state = lessonProgress?.state || (index === 0 ? 'unlocked' : getUnitState(path, lesson.unit, progress) === 'locked' ? 'locked' : 'unlocked');
          const open = state !== 'locked';
          const isCurrent = lesson.id === currentLesson?.id;

          return (
            <Card key={lesson.id} hoverEffect={open} className={`p-5 ${isCurrent ? 'ring-2 ring-[#F95738]/30' : ''}`}>
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex gap-4">
                  <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-black ${
                    state === 'completed' ? 'bg-emerald-50 text-emerald-600' : state === 'locked' ? 'bg-[#061C36]/6 text-[#061C36]/28' : 'bg-[#F95738]/10 text-[#F95738]'
                  }`}>
                    {state === 'completed' ? <CheckCircle2 size={16} /> : state === 'locked' ? <Lock size={14} /> : index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black">{lesson.title}</h2>
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        state === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                        state === 'in-progress' ? 'border-[#F95738]/30 bg-[#F95738]/8 text-[#F95738]' :
                        state === 'locked' ? 'border-[#061C36]/10 bg-[#061C36]/5 text-[#061C36]/36' :
                        'border-[#061C36]/12 bg-[#FAF7F0] text-[#061C36]/48'
                      }`}>
                        {state}
                      </span>
                      {isCurrent && <span className="inline-flex rounded-full border border-[#F95738]/30 bg-[#F95738]/8 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#F95738]">Current</span>}
                    </div>
                    <p className="mt-1 text-[10px] font-black uppercase text-[#061C36]/38">{lesson.unit.title} / {lesson.module.title}</p>
                    <p className="mt-1.5 text-sm font-semibold leading-6 text-[#061C36]/56">{lesson.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-black text-[#061C36]/40">
                      <span className="flex items-center gap-1.5"><Video size={12} /> Video</span>
                      <span className="flex items-center gap-1.5"><FileText size={12} /> Slides</span>
                      <span className="flex items-center gap-1.5"><BookOpen size={12} /> Quiz</span>
                      <span className="flex items-center gap-1.5"><Upload size={12} /> Evidence</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {lesson.duration}</span>
                    </div>
                  </div>
                </div>
                {open ? (
                  <Link href={`/learn/${path.slug}/lessons/${lesson.id}`}>
                    <Button variant={isCurrent ? 'primary' : 'secondary'} className="w-full sm:w-auto">
                      {state === 'completed' ? 'Review' : 'Open'} <ArrowRight size={14} />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" disabled className="w-full sm:w-auto">
                    <Lock size={14} /> Locked
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ProgressPageView() {
  const { progress } = useApp();
  const { path, lessons, percent, currentLesson } = useActivePath();
  const completed = lessons.filter((l) => progress?.lessons?.[l.id]?.lessonCompleted || progress?.lessons?.[l.id]?.state === 'completed').length;

  return (
    <div>
      <PageTitle
        title="Progress"
        body="Unit-by-unit breakdown of your mentorship path completion."
        action={<ContinueButton href={`/learn/${path.slug}/lessons/${currentLesson?.id}`} label="Continue" />}
      />
      <Card hoverEffect={false} className="overflow-hidden p-0">
        <div className="bg-[#061C36] p-6 text-white">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-black">{path.title}</h2>
              <p className="mt-1 text-sm font-semibold text-white/54">{completed} of {lessons.length} lessons complete</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-4xl font-black text-[#F95738]">{percent}%</p>
              <p className="text-[10px] font-black uppercase text-white/44">Complete</p>
            </div>
          </div>
          <div className="mt-5"><ProgressBar value={percent} dark /></div>
        </div>
        <div className="grid gap-3 p-5">
          {path.units.map((unit) => {
            const unitProgress = calculateUnitProgress(unit, progress);
            const state = getUnitState(path, unit, progress);
            return (
              <div key={unit.id} className="grid gap-3 rounded-lg border border-[#061C36]/8 bg-[#FAF7F0] p-4 md:grid-cols-[1fr_200px_100px] md:items-center">
                <div>
                  <h3 className="font-black">{unit.title}</h3>
                  <p className="mt-1 text-xs font-bold text-[#061C36]/48">{unit.modules.length} modules · {unit.estimatedDuration}</p>
                </div>
                <ProgressBar value={unitProgress} />
                <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase ${
                  state === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                  state === 'in-progress' ? 'border-[#F95738]/30 bg-[#F95738]/8 text-[#F95738]' :
                  state === 'locked' ? 'border-[#061C36]/10 bg-[#061C36]/5 text-[#061C36]/36' :
                  'border-[#061C36]/12 bg-white text-[#061C36]/48'
                }`}>
                  {state}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function SubmissionsPageView() {
  const { submissions } = useApp();
  const { path } = useActivePath();
  const [filter, setFilter] = useState<'all' | EvidenceSubmission['status']>('all');

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    'under-review': submissions.filter((s) => s.status === 'under-review').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const filters: { key: 'all' | EvidenceSubmission['status']; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'under-review', label: 'Under Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Needs Revision' },
  ];

  function submissionStatusStyle(status: EvidenceSubmission['status']) {
    switch (status) {
      case 'approved': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'rejected': return 'border-red-200 bg-red-50 text-red-700';
      case 'under-review': return 'border-[#F5D35E]/40 bg-[#F5D35E]/12 text-[#7a6000]';
      default: return 'border-[#0B3D77]/20 bg-[#0B3D77]/6 text-[#0B3D77]';
    }
  }

  function statusDisplayLabel(status: EvidenceSubmission['status']) {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Needs Revision';
      case 'under-review': return 'Under Review';
      default: return 'Pending Review';
    }
  }

  return (
    <div>
      <PageTitle
        title="My Submissions"
        body="Evidence you submitted for each lesson. Mentor feedback appears here when reviewed."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-black uppercase transition ${filter === key ? 'bg-[#F95738] text-white' : 'bg-white text-[#061C36]/56 hover:bg-[#061C36]/5'}`}
          >
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === key ? 'bg-white/20 text-white' : 'bg-[#061C36]/8 text-[#061C36]/48'}`}>
              {counts[key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card hoverEffect={false} className="p-12 text-center">
          <Upload size={28} className="mx-auto mb-4 text-[#061C36]/24" />
          <p className="font-black">No submissions {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/48">
            Open a lesson and submit your evidence from the "Submit Evidence" tab.
          </p>
          {filter !== 'all' && (
            <button type="button" onClick={() => setFilter('all')} className="mt-4 text-sm font-black text-[#F95738] underline">
              Show all submissions
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((sub) => (
            <Card key={sub.id} hoverEffect={false} className="overflow-hidden p-0">
              <div className="border-b border-[#061C36]/6 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/40">
                      {sub.evidenceType.replace('-', ' ')} · Submitted {sub.submittedAt.slice(0, 10)}
                    </p>
                    <p className="mt-1 truncate font-black">Lesson: {sub.lessonId}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase ${submissionStatusStyle(sub.status)}`}>
                    {statusDisplayLabel(sub.status)}
                  </span>
                </div>
              </div>

              {sub.notes && (
                <div className="px-5 py-4">
                  <p className="text-[10px] font-black uppercase text-[#061C36]/40">Your Reflection</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">{sub.notes}</p>
                </div>
              )}

              {sub.mentorFeedback && (
                <div className={`mx-5 mb-5 rounded-lg border p-4 ${sub.status === 'approved' ? 'border-emerald-200 bg-emerald-50' : 'border-[#F95738]/20 bg-[#F95738]/5'}`}>
                  <p className="text-[10px] font-black uppercase text-[#061C36]/40">Mentor Feedback</p>
                  <p className={`mt-2 text-sm font-semibold leading-6 ${sub.status === 'approved' ? 'text-emerald-800' : 'text-[#061C36]/68'}`}>
                    {sub.mentorFeedback}
                  </p>
                  {sub.reviewedAt && (
                    <p className="mt-2 text-[10px] font-black text-[#061C36]/36">Reviewed {sub.reviewedAt.slice(0, 10)}</p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 border-t border-[#061C36]/6 px-5 py-4">
                {sub.evidenceUrl && (
                  <a href={sub.evidenceUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="text-xs">
                      View Evidence <ExternalLink size={13} />
                    </Button>
                  </a>
                )}
                <Link href={`/learn/${path.slug}/lessons/${sub.lessonId}`}>
                  <Button variant="ghost" className="text-xs">
                    Open Lesson <ArrowRight size={13} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function SessionsPageView() {
  const { bookSession, bookings, user } = useApp();
  const { path } = useActivePath();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM WAT');
  const [topic, setTopic] = useState('Mentorship review');
  const nextSession = upcomingSession(bookings);
  const recordings = bookings.filter((b) => b.status === 'completed' && (b.recordingUrl || b.recordingPlaybackUrl));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await bookSession({ date, time, topic, mentorName: path.mentorName });
    setDate('');
  };

  return (
    <div>
      <PageTitle title="Sessions" body="Live mentorship, office hours, screen sharing, and recordings through BigBlueButton." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card hoverEffect={false} className="overflow-hidden p-0">
          <div className="bg-[#061C36] p-6 text-white">
            <Badge className="border-white/15 bg-white/10 text-white">Next Live Session</Badge>
            <h2 className="mt-4 text-xl font-black">{nextSession?.topic || nextSession?.title || 'No session scheduled yet'}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/56">{nextSession?.description || 'Book a mentor session when you are ready for review or guidance.'}</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-black">{sessionLabel(nextSession)}</p>
              <p className="mt-1 text-xs font-black uppercase text-[#061C36]/40">Status: {getSessionStatus(nextSession)}</p>
            </div>
            {nextSession?.bbbMeetingId ? (
              <a href={`/api/bbb/join?meetingId=${encodeURIComponent(nextSession.bbbMeetingId)}&fullName=${encodeURIComponent(user?.fullName || 'CyberNurdin Mentee')}&role=attendee&userId=${encodeURIComponent(user?.id || 'mentee')}`}>
                <Button className="w-full sm:w-auto">Join Session <Radio size={15} /></Button>
              </a>
            ) : (
              <Button variant="secondary" disabled>BBB room pending</Button>
            )}
          </div>
        </Card>

        <Card hoverEffect={false} className="p-5">
          <h2 className="font-black">Request a Session</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/54">Submit a request and your mentor will attach a BigBlueButton room.</p>
          <form onSubmit={submit} className="mt-5 grid gap-3">
            <input className="cn-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <select className="cn-input" value={time} onChange={(e) => setTime(e.target.value)}>
              <option>10:00 AM WAT</option>
              <option>2:00 PM WAT</option>
              <option>5:00 PM WAT</option>
            </select>
            <input className="cn-input" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <Button>Request Session <Send size={14} /></Button>
          </form>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card hoverEffect={false} className="p-5">
          <h2 className="font-black">All Sessions</h2>
          <div className="mt-4 space-y-2">
            {bookings.length ? bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg bg-[#FAF7F0] px-4 py-3 text-sm font-bold">
                <span>{booking.topic || booking.title}</span>
                <span className="text-xs font-black uppercase text-[#061C36]/40">{getSessionStatus(booking)}</span>
              </div>
            )) : <p className="py-4 text-sm font-semibold text-[#061C36]/48">No sessions booked yet.</p>}
          </div>
        </Card>
        <Card hoverEffect={false} className="p-5">
          <h2 className="font-black">Recordings</h2>
          <div className="mt-4 space-y-2">
            {recordings.length ? recordings.map((rec) => (
              <a key={rec.id} href={rec.recordingUrl || rec.recordingPlaybackUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-[#FAF7F0] px-4 py-3 text-sm font-bold hover:bg-[#EBEBD3] transition">
                <span>{rec.topic || rec.title}</span>
                <ArrowRight size={14} />
              </a>
            )) : <p className="py-4 text-sm font-semibold text-[#061C36]/48">Recordings will appear after completed BBB sessions.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProfileSettingsPageView(_props?: { settings?: boolean }) {
  const { user } = useApp();
  return (
    <div>
      <PageTitle title="Profile" body="Your mentorship identity and access credentials." />
      <Card hoverEffect={false} className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/58">Full name</span>
            <input className="cn-input" defaultValue={user?.fullName} />
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/58">Email</span>
            <input className="cn-input" defaultValue={user?.email} disabled />
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/58">Username</span>
            <input className="cn-input" defaultValue={user?.username} />
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/58">Access Coupon</span>
            <input className="cn-input font-mono" defaultValue={user?.couponCode || 'Approved'} disabled />
          </label>
        </div>
        <div className="mt-5 rounded-lg border border-[#061C36]/8 bg-[#FAF7F0] p-4">
          <p className="text-[10px] font-black uppercase text-[#061C36]/40">Account Status</p>
          <p className="mt-2 text-sm font-semibold text-[#061C36]/62">
            Status: <span className="font-black text-emerald-600 capitalize">{user?.status || 'approved'}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

export function LibraryPageView(_props?: { type?: 'videos' | 'slides' | 'quizzes' | 'resources' }) {
  return <LessonsPageView />;
}
