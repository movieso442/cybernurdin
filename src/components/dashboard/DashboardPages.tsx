'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Play,
  Shield,
  User,
} from 'lucide-react';
import { Badge, Button, Card, ProgressBar } from '@/components/UI';
import { calculatePathProgress, getAllLessons, getPathById, mentorshipPaths } from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';

function useActivePath() {
  const { user, progress } = useApp();
  const path = getPathById(user?.activePathId || '') || mentorshipPaths[0];
  const lessons = getAllLessons(path);
  const percent = calculatePathProgress(path, progress);
  const currentLesson = lessons.find((item) => item.id === progress?.currentLessonId) || lessons[0];
  return { path, lessons, percent, currentLesson };
}

function PageTitle({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-[#061C36]/60">{body}</p>
      </div>
    </div>
  );
}

export function DashboardOverviewPage() {
  const { user, progress, bookings } = useApp();
  const { path, lessons, percent, currentLesson } = useActivePath();
  const completeCount = lessons.filter((lesson) => progress?.lessons?.[lesson.id]?.state === 'completed').length;

  return (
    <div>
      <PageTitle title={`Hello, ${user?.fullName?.split(' ')[0] || 'Nurdin'}`} body="Ready to level up your cybersecurity skills?" />
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ['Current Path', path.title, Shield],
          ['Progress', `${percent}%`, BarChart3],
          ['Completed', `${completeCount}/${lessons.length}`, CheckCircle2],
          ['Next Session', bookings[0]?.date || 'Book one', Calendar],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon as typeof Shield;
          return (
            <Card key={label as string} className="p-5">
              <StatIcon className="text-[#F95738]" size={22} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">{label as string}</p>
              <p className="mt-1 text-lg font-black">{value as string}</p>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.42fr]">
        <Card className="overflow-hidden">
          <div className="bg-[#061C36] p-6 text-white">
            <Badge className="border-white/15 bg-white/10 text-white">Assigned active path</Badge>
            <h2 className="mt-4 text-2xl font-black">{path.title}</h2>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/62">{path.description}</p>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-black uppercase text-white/54">
                <span>Path progress</span>
                <span>{percent}%</span>
              </div>
              <ProgressBar value={percent} dark />
            </div>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">Next lesson</p>
              <h3 className="mt-1 font-black">{currentLesson?.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[#061C36]/60">{currentLesson?.description}</p>
            </div>
            <Link href={`/learn/${path.slug}/lessons/${currentLesson?.id}`}>
              <Button>Continue Learning <ArrowRight size={15} /></Button>
            </Link>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-black">Upcoming Tasks</h2>
          <div className="mt-4 space-y-3 text-sm font-bold text-[#061C36]/66">
            <div className="rounded-xl bg-[#FAF7F0] p-4">Watch current YouTube lesson</div>
            <div className="rounded-xl bg-[#FAF7F0] p-4">Review slides</div>
            <div className="rounded-xl bg-[#FAF7F0] p-4">Pass checkpoint quiz</div>
          </div>
        </Card>
      </div>
      <LearningRoadmap />
    </div>
  );
}

function LearningRoadmap() {
  const { progress } = useApp();
  const { path } = useActivePath();
  return (
    <Card className="mt-6 p-6">
      <h2 className="text-xl font-black">Learning Roadmap</h2>
      <div className="mt-5 space-y-4">
        {path.modules.map((module) => (
          <div key={module.id} className="rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-4">
            <h3 className="font-black">{module.title}</h3>
            <div className="mt-3 grid gap-2">
              {module.lessons.map((lesson) => {
                const state = progress?.lessons?.[lesson.id]?.state || 'locked';
                return (
                  <Link key={lesson.id} href={`/learn/${path.slug}/lessons/${lesson.id}`} className="flex items-center justify-between rounded-xl bg-white p-3 text-sm font-bold">
                    <span className="flex items-center gap-2">
                      {state === 'completed' ? <CheckCircle2 size={16} className="text-emerald-600" /> : state === 'locked' ? <Lock size={16} className="text-[#061C36]/28" /> : <Play size={16} className="text-[#F95738]" />}
                      {lesson.title}
                    </span>
                    <span className="text-xs uppercase text-[#061C36]/42">{state}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MyPathPageView() {
  const { path, percent } = useActivePath();
  return (
    <div>
      <PageTitle title="My Path" body="You can access only your current active assigned mentorship path." />
      <Card className="overflow-hidden">
        <div className="bg-[#061C36] p-6 text-white">
          <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">Active Path</Badge>
          <h1 className="mt-4 text-2xl font-black">{path.title}</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/62">{path.description}</p>
          <div className="mt-5"><ProgressBar value={percent} dark /></div>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.38fr]">
          <LearningRoadmap />
          <div className="space-y-5">
            <Card className="p-5">
              <User className="text-[#F95738]" />
              <h2 className="mt-3 font-black">Mentor</h2>
              <p className="mt-1 text-sm font-bold text-[#061C36]/64">{path.mentorName}</p>
              <p className="text-xs font-semibold text-[#061C36]/48">{path.mentorTitle}</p>
            </Card>
            <Card className="p-5">
              <h2 className="font-black">Current Milestone</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">Complete the current lesson video, slides, and quiz before moving forward.</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ProgressPageView() {
  const { path, lessons, percent } = useActivePath();
  const { progress } = useApp();
  return (
    <div>
      <PageTitle title="Progress" body="Track your assigned path, module completion, videos, slides, and quizzes." />
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">{path.title}</h2>
            <p className="mt-1 text-sm font-semibold text-[#061C36]/60">{percent}% complete</p>
          </div>
          <div className="text-3xl font-black text-[#F95738]">{percent}%</div>
        </div>
        <div className="mt-5"><ProgressBar value={percent} /></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {lessons.map((lesson) => {
            const item = progress?.lessons?.[lesson.id];
            return (
              <div key={lesson.id} className="rounded-2xl border border-[#061C36]/8 bg-[#FAF7F0] p-4">
                <h3 className="font-black">{lesson.title}</h3>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-black text-[#061C36]/54">
                  <span>Video: {item?.videoCompleted ? 'Done' : 'Open'}</span>
                  <span>Slides: {item?.slidesCompleted ? 'Done' : 'Open'}</span>
                  <span>Quiz: {item?.quizPassed ? 'Passed' : 'Open'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function LibraryPageView({ type }: { type: 'videos' | 'slides' | 'quizzes' | 'resources' }) {
  const { path, lessons } = useActivePath();
  const config = {
    videos: ['Videos', 'Watch YouTube lessons mapped to your assigned path.', Play],
    slides: ['Slides', 'Review structured HTML slides for each lesson.', FileText],
    quizzes: ['Quizzes', 'Open checkpoint quizzes and save attempts.', BookOpen],
    resources: ['Resources', 'Access notes, templates, and mentor review prompts.', Shield],
  } as const;
  const [title, body, Icon] = config[type];
  return (
    <div>
      <PageTitle title={title} body={body} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col justify-between p-5">
            <div>
              <Icon className="text-[#F95738]" size={24} />
              <h2 className="mt-4 font-black">{lesson.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">{lesson.description}</p>
              {type === 'resources' && (
                <ul className="mt-3 space-y-2 text-xs font-bold text-[#061C36]/55">
                  {lesson.resources.map((resource) => <li key={resource}>{resource}</li>)}
                </ul>
              )}
            </div>
            <Link href={`/learn/${path.slug}/lessons/${lesson.id}${type === 'videos' ? '/video' : type === 'slides' ? '/slides' : type === 'quizzes' ? '/quiz' : ''}`} className="mt-5">
              <Button className="w-full">Open</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SessionsPageView() {
  const { bookSession, bookings } = useApp();
  const { path } = useActivePath();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM WAT');
  const [topic, setTopic] = useState('Lesson review');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await bookSession({ date, time, topic, mentorName: path.mentorName });
    setDate('');
  };

  return (
    <div>
      <PageTitle title="Sessions" body="Book and track mentor support sessions for your active path." />
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr]">
        <Card className="p-6">
          <h2 className="text-xl font-black">Book a session</h2>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input className="cn-input" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            <select className="cn-input" value={time} onChange={(event) => setTime(event.target.value)}>
              <option>10:00 AM WAT</option>
              <option>2:00 PM WAT</option>
              <option>5:00 PM WAT</option>
            </select>
            <input className="cn-input" value={topic} onChange={(event) => setTopic(event.target.value)} />
            <Button>Book Session</Button>
          </form>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-black">Upcoming sessions</h2>
          <div className="mt-5 space-y-3">
            {bookings.length ? bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-[#FAF7F0] p-4 text-sm font-bold">
                {booking.topic} with {booking.mentorName} on {booking.date} at {booking.time}
              </div>
            )) : <p className="text-sm font-semibold text-[#061C36]/58">No sessions booked yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProfileSettingsPageView({ settings = false }: { settings?: boolean }) {
  const { user } = useApp();
  return (
    <div>
      <PageTitle title={settings ? 'Settings' : 'Profile'} body="Manage learner profile details. Account rules stay aligned with approval and coupon access." />
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Full name</span><input className="cn-input" defaultValue={user?.fullName} /></label>
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Email</span><input className="cn-input" defaultValue={user?.email} disabled /></label>
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Username</span><input className="cn-input" defaultValue={user?.username} /></label>
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Coupon</span><input className="cn-input" defaultValue={user?.couponCode} disabled /></label>
        </div>
        <div className="mt-5 rounded-2xl bg-[#FAF7F0] p-4 text-sm font-semibold text-[#061C36]/62">
          Protected access checks authenticated user, approved status, valid coupon session, and active path assignment.
        </div>
      </Card>
    </div>
  );
}
