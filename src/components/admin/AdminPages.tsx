'use client';

import type React from 'react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Check, CheckCircle2, ClipboardList, Copy, ExternalLink, Plus, Radio, Upload, Users, X } from 'lucide-react';
import { Booking, calculatePathProgress, getAllLessons, getPathBySlug, mentorshipPaths } from '@/lib/cybernurdin-data';
import { approveApplication, rejectApplication } from '@/lib/actions/applications';
import { reviewSubmission } from '@/lib/actions/submissions';
import { createClient } from '@/lib/supabase/client';
import { Badge, Button, Card, ProgressBar } from '@/components/UI';

const storagePrefix = 'cybernurdin_userflow_';

function readLocal<T>(name: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(`${storagePrefix}${name}`);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(name: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${storagePrefix}${name}`, JSON.stringify(value));
}

type AdminDraftUnit = {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: string;
  moduleCount: number;
  lessonCount: number;
};

// Real rows as returned by `supabase.from(...).select()` — snake_case,
// admin-only reads protected by the "is_admin()" RLS policies.
export type ApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  selected_path: string;
  motivation: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  access_status: string;
  selected_path: string | null;
  created_at: string;
};

export type SubmissionRow = {
  id: string;
  user_id: string;
  path_id: string;
  module_id: string;
  type: string;
  text_response: string | null;
  file_url: string | null;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  mentor_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

function useAdminApplications() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    setApplications((data as ApplicationRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  return { applications, loading, reload };
}

function useAdminSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('submissions').select('*').order('submitted_at', { ascending: false });
    setSubmissions((data as SubmissionRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  return { submissions, loading, reload };
}

function useAdminMentees() {
  const [mentees, setMentees] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('profiles').select('*').eq('role', 'mentee').order('created_at', { ascending: false });
      setMentees((data as ProfileRow[]) || []);
      setLoading(false);
    })();
  }, []);

  return { mentees, loading };
}

function useAdminSessions() {
  const [sessions, setSessions] = useState<Booking[]>([]);

  useEffect(() => {
    setSessions(readLocal<Booking[]>('sessions', readLocal<Booking[]>('bookings', [])));
  }, []);

  return { sessions, setSessions };
}

function PageTitle({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm font-semibold leading-6 text-[#061C36]/60">{body}</p>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#061C36]/16 bg-[#FAF7F0] p-6 text-center">
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/56">{body}</p>
    </div>
  );
}

export function AdminOverviewPage() {
  const { applications, loading: loadingApplications } = useAdminApplications();
  const { submissions, loading: loadingSubmissions } = useAdminSubmissions();
  const { sessions } = useAdminSessions();

  const pendingApplications = applications.filter((item) => item.status === 'pending').length;
  const pendingSubmissions = submissions.filter((item) => item.status === 'pending' || item.status === 'under-review').length;
  const upcomingSessions = sessions.filter((item) => item.status === 'scheduled' || item.status === 'live').length;
  const recentApplications = applications.filter((item) => item.status === 'pending').slice(0, 3);

  return (
    <div>
      <PageTitle
        title="Admin Overview"
        body="Only the mentorship operations that need attention."
        action={<Link href="/admin/applications"><Button>Review Applications <ArrowRight size={15} /></Button></Link>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {([
          ['Pending applications', loadingApplications ? '—' : pendingApplications, ClipboardList],
          ['Submissions to review', loadingSubmissions ? '—' : pendingSubmissions, Upload],
          ['Upcoming sessions', upcomingSessions, Calendar],
        ] as [string, string | number, typeof ClipboardList][]).map(([label, value, StatIcon]) => {
          return (
            <Card key={label} hoverEffect={false} className="p-5">
              <StatIcon className="text-[#F95738]" size={22} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Applications Needing Review</h2>
          <div className="mt-4 space-y-3">
            {recentApplications.length ? recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between rounded-lg bg-[#FAF7F0] p-4 text-sm font-bold">
                <span>{application.full_name}</span>
                <Badge>Pending</Badge>
              </div>
            )) : <EmptyState title="Nothing urgent" body="No applications are waiting for review." />}
          </div>
        </Card>
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/applications"><Button className="w-full justify-between">Review Applications <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/submissions"><Button className="w-full justify-between" variant="secondary">Review Submissions <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/sessions"><Button className="w-full justify-between" variant="secondary">Create Session <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/content"><Button className="w-full justify-between" variant="secondary">Add Lesson <ArrowRight size={15} /></Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminApplicationsPage() {
  const { applications, loading, reload } = useAdminApplications();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [revealedCoupon, setRevealedCoupon] = useState<{ applicationId: string; code: string; emailSent: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const selected = applications.find((item) => item.id === selectedId) || applications.find((item) => item.status === 'pending') || applications[0];

  const handleApprove = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      const result = await approveApplication(selected.id);
      setRevealedCoupon({ applicationId: selected.id, code: result.couponCode, emailSent: result.emailSent });
      await reload();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    setProcessing(true);
    try {
      await rejectApplication(selected.id, adminNote);
      setAdminNote('');
      await reload();
    } finally {
      setProcessing(false);
    }
  };

  const copyCoupon = async () => {
    if (!revealedCoupon) return;
    await navigator.clipboard.writeText(revealedCoupon.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageTitle title="Applications" body="Review applicants and generate mentorship access on approval." />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Applicants</h2>
          <div className="mt-4 divide-y divide-[#061C36]/8">
            {loading ? (
              <p className="py-6 text-sm font-semibold text-[#061C36]/48">Loading applications...</p>
            ) : applications.length ? applications.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => { setSelectedId(application.id); setRevealedCoupon(null); }}
                className={`grid w-full gap-2 py-4 text-left md:grid-cols-[1fr_160px_100px] md:items-center ${selected?.id === application.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
              >
                <div>
                  <p className="font-black">{application.full_name}</p>
                  <p className="text-sm font-semibold text-[#061C36]/54">{application.email}</p>
                </div>
                <p className="text-sm font-bold text-[#061C36]/60">{getPathBySlug(application.selected_path)?.title || application.selected_path}</p>
                <Badge>{application.status}</Badge>
              </button>
            )) : <EmptyState title="No applications yet" body="New mentorship applications will appear here." />}
          </div>
        </Card>

        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Review</h2>
          {selected ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-black">{selected.full_name}</p>
                <p className="text-sm font-semibold text-[#061C36]/58">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
              </div>
              <div className="rounded-lg bg-[#FAF7F0] p-4">
                <p className="text-[10px] font-black uppercase text-[#061C36]/42">Preferred path</p>
                <p className="mt-1 text-sm font-bold">{getPathBySlug(selected.selected_path)?.title || selected.selected_path}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/42">Motivation</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/66">{selected.motivation || 'No motivation text provided.'}</p>
              </div>

              {revealedCoupon?.applicationId === selected.id ? (
                <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Coupon generated — shown once, copy it now
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="break-all text-lg font-black tracking-wide text-[#061C36]">{revealedCoupon.code}</p>
                    <button type="button" onClick={copyCoupon} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-5 text-emerald-800">
                    {revealedCoupon.emailSent
                      ? `Emailed to ${selected.email}.`
                      : 'No email provider configured — copy this code and share it with the applicant manually.'}
                  </p>
                </div>
              ) : selected.status === 'pending' ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button disabled={processing} onClick={handleApprove}>{processing ? 'Working...' : 'Approve & Generate Coupon'}</Button>
                    <Button variant="secondary" disabled={processing} onClick={handleReject}>Reject</Button>
                  </div>
                  <textarea
                    className="cn-input min-h-[70px]"
                    placeholder="Optional note if rejecting..."
                    value={adminNote}
                    onChange={(event) => setAdminNote(event.target.value)}
                  />
                </>
              ) : (
                <div className={`rounded-lg p-3 text-sm font-bold ${selected.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  Already {selected.status}{selected.admin_note ? ` — ${selected.admin_note}` : ''}
                </div>
              )}
            </div>
          ) : <EmptyState title="Select an applicant" body="Choose an application to review details." />}
        </Card>
      </div>
    </div>
  );
}

export function AdminMenteesPage() {
  const { mentees, loading } = useAdminMentees();

  return (
    <div>
      <PageTitle title="Mentees" body="Active learner accounts and their assigned mentorship path." />
      <Card hoverEffect={false} className="p-6">
        {loading ? (
          <p className="py-6 text-sm font-semibold text-[#061C36]/48">Loading mentees...</p>
        ) : (
        <div className="divide-y divide-[#061C36]/8">
          {mentees.length ? mentees.map((mentee) => {
            const path = getPathBySlug(mentee.selected_path || '') || mentorshipPaths[0];
            return (
              <div key={mentee.id} className="grid gap-3 py-4 md:grid-cols-[1fr_220px_160px_120px] md:items-center">
                <div>
                  <p className="font-black">{mentee.full_name}</p>
                  <p className="text-sm font-semibold text-[#061C36]/54">{mentee.email}</p>
                </div>
                <p className="text-sm font-bold">{path.title}</p>
                <div><ProgressBar value={calculatePathProgress(path, null)} /></div>
                <Badge>{mentee.access_status}</Badge>
              </div>
            );
          }) : <EmptyState title="No mentees yet" body="Activated mentees will appear here." />}
        </div>
        )}
      </Card>
    </div>
  );
}

export function AdminPathsPage() {
  const [selectedPathId, setSelectedPathId] = useState(mentorshipPaths[0].id);
  const [draftUnits, setDraftUnits] = useState<Record<string, AdminDraftUnit[]>>({});
  const [unitTitle, setUnitTitle] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const selectedPath = mentorshipPaths.find((path) => path.id === selectedPathId) || mentorshipPaths[0];
  const selectedDrafts = draftUnits[selectedPath.id] || [];
  const visibleUnits = [
    ...selectedPath.units.map((unit) => ({
      id: unit.id,
      pathId: unit.pathId,
      title: unit.title,
      description: unit.description,
      order: unit.order,
      estimatedDuration: unit.estimatedDuration,
      moduleCount: unit.modules.length,
      lessonCount: getAllLessons(selectedPath).filter((lesson) => lesson.unitId === unit.id).length,
    })),
    ...selectedDrafts,
  ].sort((a, b) => a.order - b.order);

  useEffect(() => {
    setDraftUnits(readLocal<Record<string, AdminDraftUnit[]>>('adminDraftPathUnits', {}));
  }, []);

  const addUnit = (event: FormEvent) => {
    event.preventDefault();
    if (!unitTitle.trim()) return;
    const nextUnit: AdminDraftUnit = {
      id: `draft-unit-${selectedPath.id}-${Date.now()}`,
      pathId: selectedPath.id,
      title: unitTitle.trim(),
      description: unitDescription.trim() || 'Draft path unit awaiting modules and lessons.',
      order: selectedPath.units.length + selectedDrafts.length + 1,
      estimatedDuration: '1 week',
      moduleCount: 0,
      lessonCount: 0,
    };
    const nextDrafts = {
      ...draftUnits,
      [selectedPath.id]: [...selectedDrafts, nextUnit],
    };
    setDraftUnits(nextDrafts);
    writeLocal('adminDraftPathUnits', nextDrafts);
    setUnitTitle('');
    setUnitDescription('');
  };

  return (
    <div>
      <PageTitle title="Paths" body="Cybersecurity paths only, kept in a simple mentor-guided structure." action={<Button><Plus size={15} />Add Path</Button>} />
      <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <Card hoverEffect={false} className="p-5">
          <h2 className="text-xl font-black">Mentorship Paths</h2>
          <div className="mt-4 space-y-3">
            {mentorshipPaths.map((path) => (
              <button
                key={path.id}
                type="button"
                onClick={() => setSelectedPathId(path.id)}
                className={`w-full rounded-lg border p-4 text-left ${selectedPath.id === path.id ? 'border-[#F95738] bg-[#F95738]/10' : 'border-[#061C36]/8 bg-[#FAF7F0]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black">{path.title}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/58">{path.description}</p>
                  </div>
                  <Badge>{path.level}</Badge>
                </div>
                <div className="mt-3 flex gap-3 text-xs font-black uppercase text-[#061C36]/42">
                  <span>{path.units.length + (draftUnits[path.id]?.length || 0)} units</span>
                  <span>{getAllLessons(path).length} lessons</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card hoverEffect={false} className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge>Path Units</Badge>
              <h2 className="mt-3 text-xl font-black">{selectedPath.title}</h2>
              <p className="mt-1 text-sm font-semibold text-[#061C36]/58">{visibleUnits.length} units in order</p>
            </div>
            <Button variant="secondary">Manage Modules <ArrowRight size={15} /></Button>
          </div>

          <form onSubmit={addUnit} className="mt-5 grid gap-3 rounded-lg bg-[#FAF7F0] p-4 md:grid-cols-[1fr_1.2fr_auto]">
            <input className="cn-input" value={unitTitle} onChange={(event) => setUnitTitle(event.target.value)} placeholder="Unit title" />
            <input className="cn-input" value={unitDescription} onChange={(event) => setUnitDescription(event.target.value)} placeholder="Short description" />
            <Button type="submit"><Plus size={15} />Add Unit</Button>
          </form>

          <div className="mt-5 divide-y divide-[#061C36]/8">
            {visibleUnits.map((unit) => (
              <div key={unit.id} className="grid gap-3 py-4 md:grid-cols-[44px_1fr_160px] md:items-center">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#061C36] text-sm font-black text-white">{unit.order}</span>
                <div>
                  <h3 className="font-black">{unit.title}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[#061C36]/58">{unit.description}</p>
                </div>
                <div className="text-sm font-black text-[#061C36]/52">
                  <p>{unit.moduleCount} modules</p>
                  <p>{unit.lessonCount} lessons</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminContentPage() {
  const [tab, setTab] = useState<'videos' | 'slides' | 'quizzes'>('videos');
  const lessons = useMemo(() => mentorshipPaths.flatMap((path) => getAllLessons(path).map((lesson) => ({ ...lesson, path }))), []);

  return (
    <div>
      <PageTitle title="Content" body="Simple authoring for videos, slides, and quizzes." action={<Button><Plus size={15} />Add Lesson</Button>} />
      <Card hoverEffect={false} className="p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {(['videos', 'slides', 'quizzes'] as const).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-xs font-black uppercase ${tab === item ? 'bg-[#F95738] text-white' : 'bg-[#FAF7F0] text-[#061C36]/58'}`}>{item}</button>
          ))}
        </div>
        <div className="divide-y divide-[#061C36]/8">
          {lessons.slice(0, 8).map((lesson) => (
            <div key={lesson.id} className="grid gap-2 py-4 md:grid-cols-[1fr_220px_120px] md:items-center">
              <div>
                <p className="font-black">{lesson.title}</p>
                <p className="text-sm font-semibold text-[#061C36]/54">{lesson.path.title} / {lesson.unit.title}</p>
              </div>
              <p className="text-sm font-bold text-[#061C36]/58">{tab === 'videos' ? lesson.youtubeVideoId : tab === 'slides' ? `${lesson.slides.length} slides` : `${lesson.quiz.questions.length} questions`}</p>
              <Button variant="secondary">Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminSessionsPage() {
  const { sessions, setSessions } = useAdminSessions();
  const [title, setTitle] = useState('CyberNurdin Office Hours');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [message, setMessage] = useState('');

  const createSession = (event: FormEvent) => {
    event.preventDefault();
    const created: Booking = {
      id: `session-${Date.now()}`,
      userId: '',
      pathId: '',
      mentorName: 'CyberNurdin Mentor',
      topic: title,
      title,
      date: '',
      time: '',
      status: 'scheduled',
      attendeeJoinUrl: meetingUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [created, ...sessions];
    setSessions(next);
    writeLocal('sessions', next);
    setMessage('Session saved. Share this from the mentee\'s Sessions page.');
    setTitle('CyberNurdin Office Hours');
    setMeetingUrl('');
  };

  return (
    <div>
      <PageTitle title="Sessions" body="Create mentorship sessions and attach an external meeting link (Zoom, Google Meet, etc.)." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Create Session</h2>
          <form onSubmit={createSession} className="mt-5 grid gap-3">
            <input className="cn-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Session title" required />
            <input className="cn-input" value={meetingUrl} onChange={(event) => setMeetingUrl(event.target.value)} placeholder="External meeting link (optional)" type="url" />
            <Button><Radio size={15} /> Save Session</Button>
          </form>
          {message && <p className="mt-4 rounded-lg bg-[#FAF7F0] p-3 text-sm font-bold text-[#061C36]/62">{message}</p>}
        </Card>
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Upcoming and Live</h2>
          <div className="mt-4 divide-y divide-[#061C36]/8">
            {sessions.length ? sessions.map((session) => (
              <div key={session.id} className="grid gap-3 py-4 md:grid-cols-[1fr_130px_220px] md:items-center">
                <div>
                  <p className="font-black">{session.title || session.topic}</p>
                  <p className="text-sm font-semibold text-[#061C36]/54">{session.scheduledAt || `${session.date} ${session.time}`}</p>
                </div>
                <Badge>{session.status}</Badge>
                <div className="flex gap-2">
                  {session.attendeeJoinUrl ? <a href={session.attendeeJoinUrl} target="_blank" rel="noopener noreferrer"><Button variant="secondary">Open Link</Button></a> : <Button variant="secondary" disabled>No link yet</Button>}
                  <Button variant="ghost">End</Button>
                </div>
              </div>
            )) : <EmptyState title="No sessions yet" body="Create a session or wait for mentee requests." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

type SubmissionFilter = 'all' | SubmissionRow['status'];

export function AdminSubmissionsPage() {
  const { submissions: allSubmissions, loading: loadingList, reload } = useAdminSubmissions();
  const [filter, setFilter] = useState<SubmissionFilter>('all');
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const filtered = filter === 'all' ? allSubmissions : allSubmissions.filter((s) => s.status === filter);

  const counts = {
    all: allSubmissions.length,
    pending: allSubmissions.filter((s) => s.status === 'pending').length,
    'under-review': allSubmissions.filter((s) => s.status === 'under-review').length,
    approved: allSubmissions.filter((s) => s.status === 'approved').length,
    rejected: allSubmissions.filter((s) => s.status === 'rejected').length,
  };

  const filters: { key: SubmissionFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'under-review', label: 'Under Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  function statusStyle(status: SubmissionRow['status']) {
    switch (status) {
      case 'approved': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'rejected': return 'border-red-200 bg-red-50 text-red-700';
      case 'under-review': return 'border-[#F5D35E]/40 bg-[#F5D35E]/12 text-[#7a6000]';
      default: return 'border-[#0B3D77]/20 bg-[#0B3D77]/6 text-[#0B3D77]';
    }
  }

  async function handleReview(status: 'approved' | 'rejected' | 'under-review') {
    if (!selected) return;
    setLoading(true);
    setMessage('');
    try {
      await reviewSubmission(selected.id, status, feedback);
      await reload();
      setSelected((current) => (current ? { ...current, status, mentor_feedback: feedback || null } : current));
      setMessage(status === 'approved' ? 'Submission approved — next module unlocked.' : status === 'rejected' ? 'Submission rejected with feedback.' : 'Marked under review.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle
        title="Submissions"
        body="Review mentee evidence submissions, approve or reject with feedback, and track completion."
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

      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card hoverEffect={false} className="p-5">
          {loadingList ? (
            <p className="py-6 text-sm font-semibold text-[#061C36]/48">Loading submissions...</p>
          ) : filtered.length === 0 ? (
            <EmptyState title="No submissions" body={filter === 'all' ? 'No evidence submissions yet.' : `No submissions with status "${filter}".`} />
          ) : (
            <div className="divide-y divide-[#061C36]/8">
              {filtered.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => { setSelected(sub); setFeedback(sub.mentor_feedback || ''); setMessage(''); }}
                  className={`grid w-full gap-2 py-4 text-left md:grid-cols-[1fr_140px_100px] md:items-center ${selected?.id === sub.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  <div>
                    <p className="font-black">{sub.user_id.slice(0, 8)}…</p>
                    <p className="text-sm font-semibold text-[#061C36]/54">Module: {getPathBySlug(sub.path_id)?.units.find((u) => u.id === sub.module_id)?.title || sub.module_id}</p>
                    <p className="mt-1 text-xs font-bold text-[#061C36]/40">
                      {sub.type.replace('-', ' ')} · {sub.submitted_at.slice(0, 10)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#061C36]/52 truncate">{sub.file_url ? 'Evidence uploaded' : 'No URL'}</p>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase ${statusStyle(sub.status)}`}>
                    {sub.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card hoverEffect={false} className="p-5">
          <h2 className="font-black">Review Submission</h2>
          {selected ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-[#061C36]/8 bg-[#FAF7F0] p-4">
                <p className="text-[10px] font-black uppercase text-[#061C36]/40">Student ID</p>
                <p className="mt-1 font-black">{selected.user_id}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Module</p>
                <p className="mt-1 text-sm font-bold">{getPathBySlug(selected.path_id)?.units.find((u) => u.id === selected.module_id)?.title || selected.module_id}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Type</p>
                <p className="mt-1 text-sm font-bold capitalize">{selected.type.replace('-', ' ')}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Submitted</p>
                <p className="mt-1 text-sm font-bold">{selected.submitted_at.slice(0, 10)}</p>
              </div>

              {selected.text_response && (
                <div>
                  <p className="text-[10px] font-black uppercase text-[#061C36]/40">Student Reflection</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">{selected.text_response}</p>
                </div>
              )}

              {selected.file_url && (
                <a href={selected.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full">
                    View Evidence <ExternalLink size={14} />
                  </Button>
                </a>
              )}

              <div>
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/52">
                  Mentor Feedback
                </label>
                <textarea
                  className="cn-input min-h-[100px] resize-y"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback for the student. This appears on their submission page and dashboard."
                />
              </div>

              {message && (
                <div className={`rounded-lg p-3 text-sm font-bold ${message.includes('approved') ? 'bg-emerald-50 text-emerald-700' : 'bg-[#FAF7F0] text-[#061C36]/62'}`}>
                  {message}
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  disabled={loading}
                  onClick={() => handleReview('approved')}
                  className="w-full"
                >
                  <CheckCircle2 size={14} />
                  {loading ? 'Saving...' : 'Approve'}
                </Button>
                <Button
                  variant="secondary"
                  disabled={loading || !feedback.trim()}
                  onClick={() => handleReview('rejected')}
                  className="w-full"
                >
                  <X size={14} />
                  Reject
                </Button>
              </div>
              <Button
                variant="ghost"
                disabled={loading}
                onClick={() => handleReview('under-review')}
                className="w-full"
              >
                Mark Under Review
              </Button>
            </div>
          ) : (
            <EmptyState title="Select a submission" body="Click a submission on the left to review it." />
          )}
        </Card>
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  return (
    <div>
      <PageTitle title="Settings" body="Keep platform settings minimal and focused." />
      <Card hoverEffect={false} className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">BBB Server URL</span><input className="cn-input" value="Configured in BBB_SERVER_URL" disabled /></label>
          <label><span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Coupon Delivery</span><input className="cn-input" value="Email provider env configured" disabled /></label>
        </div>
        <div className="mt-5 rounded-lg bg-[#FAF7F0] p-4 text-sm font-semibold leading-6 text-[#061C36]/62">
          CyberNurdin keeps learning paths simple and uses BigBlueButton only for live mentorship sessions.
        </div>
      </Card>
    </div>
  );
}
