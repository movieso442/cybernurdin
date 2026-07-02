'use client';

import type React from 'react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, BookOpen, Calendar, CheckCircle2, ClipboardList, ExternalLink, Plus, Radio, Upload, Users, X } from 'lucide-react';
import { ApplicationRecord, Booking, EvidenceSubmission, MenteeUser, PathAssignment, SubmissionStatus, calculatePathProgress, getAllLessons, mentorshipPaths } from '@/lib/cybernurdin-data';
import { getAllSubmissions, reviewSubmission } from '@/lib/cybernurdin-service';
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

function useAdminData() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [mentees, setMentees] = useState<MenteeUser[]>([]);
  const [sessions, setSessions] = useState<Booking[]>([]);

  useEffect(() => {
    setApplications(readLocal<ApplicationRecord[]>('applications', []));
    setMentees(readLocal<MenteeUser[]>('users', []));
    setSessions(readLocal<Booking[]>('sessions', readLocal<Booking[]>('bookings', [])));
  }, []);

  return { applications, mentees, sessions, setMentees, setSessions };
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
  const { applications, mentees, sessions } = useAdminData();
  const pendingApplications = applications.filter((item) => item.status === 'pending').length;
  const activeMentees = mentees.filter((item) => item.status === 'approved').length;
  const upcomingSessions = sessions.filter((item) => item.status === 'scheduled' || item.status === 'live').length;
  const needsAttention = mentees.filter((item) => !item.activePathId).slice(0, 3);

  return (
    <div>
      <PageTitle
        title="Admin Overview"
        body="Only the mentorship operations that need attention."
        action={<Link href="/admin/applications"><Button>Review Applications <ArrowRight size={15} /></Button></Link>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Pending applications', pendingApplications, ClipboardList],
          ['Active mentees', activeMentees, Users],
          ['Upcoming sessions', upcomingSessions, Calendar],
        ].map(([label, value, Icon]) => {
          const StatIcon = Icon as typeof ClipboardList;
          return (
            <Card key={label as string} hoverEffect={false} className="p-5">
              <StatIcon className="text-[#F95738]" size={22} />
              <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">{label as string}</p>
              <p className="mt-1 text-3xl font-black">{value as number}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Mentees Needing Attention</h2>
          <div className="mt-4 space-y-3">
            {needsAttention.length ? needsAttention.map((mentee) => (
              <div key={mentee.id} className="flex items-center justify-between rounded-lg bg-[#FAF7F0] p-4 text-sm font-bold">
                <span>{mentee.fullName}</span>
                <Badge>Assign path</Badge>
              </div>
            )) : <EmptyState title="Nothing urgent" body="No mentee needs an immediate path or access action." />}
          </div>
        </Card>
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/applications"><Button className="w-full justify-between">Review Applications <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/mentees"><Button className="w-full justify-between" variant="secondary">Assign Path <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/sessions"><Button className="w-full justify-between" variant="secondary">Create Session <ArrowRight size={15} /></Button></Link>
            <Link href="/admin/content"><Button className="w-full justify-between" variant="secondary">Add Lesson <ArrowRight size={15} /></Button></Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminApplicationsPage() {
  const { applications } = useAdminData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = applications.find((item) => item.id === selectedId) || applications[0];

  return (
    <div>
      <PageTitle title="Applications" body="Review applicants, assign one cybersecurity path, and generate access." />
      <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Applicants</h2>
          <div className="mt-4 divide-y divide-[#061C36]/8">
            {applications.length ? applications.map((application) => (
              <button
                key={application.id}
                type="button"
                onClick={() => setSelectedId(application.id)}
                className="grid w-full gap-2 py-4 text-left md:grid-cols-[1fr_160px_100px] md:items-center"
              >
                <div>
                  <p className="font-black">{application.firstName} {application.lastName}</p>
                  <p className="text-sm font-semibold text-[#061C36]/54">{application.email}</p>
                </div>
                <p className="text-sm font-bold text-[#061C36]/60">{mentorshipPaths.find((path) => path.id === application.preferredPathId)?.title || 'Path pending'}</p>
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
                <p className="font-black">{selected.firstName} {selected.lastName}</p>
                <p className="text-sm font-semibold text-[#061C36]/58">{selected.country} · {selected.experienceLevel}</p>
              </div>
              <div className="rounded-lg bg-[#FAF7F0] p-4">
                <p className="text-[10px] font-black uppercase text-[#061C36]/42">Motivation</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/66">{selected.motivation || 'No motivation text provided.'}</p>
              </div>
              <select className="cn-input" defaultValue={selected.preferredPathId}>
                {mentorshipPaths.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button>Approve</Button>
                <Button variant="secondary">Reject</Button>
              </div>
              <Button className="w-full" variant="secondary">Generate Coupon</Button>
              <Button className="w-full" variant="secondary">Create Intro BBB Session</Button>
            </div>
          ) : <EmptyState title="Select an applicant" body="Choose an application to review details." />}
        </Card>
      </div>
    </div>
  );
}

export function AdminMenteesPage() {
  const { mentees, setMentees } = useAdminData();
  const [selectedPaths, setSelectedPaths] = useState<Record<string, string>>({});

  const assignPath = (mentee: MenteeUser, pathId: string) => {
    const users = readLocal<MenteeUser[]>('users', []);
    const nextUsers = users.map((item) =>
      item.id === mentee.id ? { ...item, activePathId: pathId, status: 'approved' as const } : item,
    );
    const assignments = readLocal<PathAssignment[]>('pathAssignments', []);
    const pausedAssignments = assignments.map((assignment) =>
      assignment.userId === mentee.id && assignment.status === 'active'
        ? { ...assignment, status: 'paused' as const }
        : assignment,
    );
    const activeAssignment: PathAssignment = {
      id: `assignment-${mentee.id}-${pathId}`,
      userId: mentee.id,
      pathId,
      status: 'active',
      assignedBy: 'admin',
      assignedAt: new Date().toISOString(),
      progressPercent: 0,
    };

    writeLocal('users', nextUsers);
    writeLocal('pathAssignments', [
      activeAssignment,
      ...pausedAssignments.filter((assignment) => assignment.id !== activeAssignment.id),
    ]);
    setMentees(nextUsers);
  };

  return (
    <div>
      <PageTitle title="Mentees" body="Minimal status view for active learners." action={<Button><Plus size={15} />Assign Path</Button>} />
      <Card hoverEffect={false} className="p-6">
        <div className="divide-y divide-[#061C36]/8">
          {mentees.length ? mentees.map((mentee) => {
            const path = mentorshipPaths.find((item) => item.id === mentee.activePathId) || mentorshipPaths[0];
            return (
              <div key={mentee.id} className="grid gap-3 py-4 md:grid-cols-[1fr_220px_160px_240px] md:items-center">
                <div>
                  <p className="font-black">{mentee.fullName}</p>
                  <p className="text-sm font-semibold text-[#061C36]/54">{mentee.email}</p>
                </div>
                <p className="text-sm font-bold">{path.title}</p>
                <div><ProgressBar value={calculatePathProgress(path, null)} /></div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <select
                    className="cn-input min-h-10 py-2 text-sm"
                    value={selectedPaths[mentee.id] || path.id}
                    onChange={(event) => setSelectedPaths((current) => ({ ...current, [mentee.id]: event.target.value }))}
                  >
                    {mentorshipPaths.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </select>
                  <Button variant="secondary" onClick={() => assignPath(mentee, selectedPaths[mentee.id] || path.id)}>Assign</Button>
                </div>
              </div>
            );
          }) : <EmptyState title="No mentees yet" body="Approved applicants will become mentees here." />}
        </div>
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
  const { sessions } = useAdminData();
  const [title, setTitle] = useState('CyberNurdin Office Hours');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createSession = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/bbb/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: 'Live CyberNurdin mentorship session',
          duration: 60,
          status: 'scheduled',
        }),
      });
      const data = await response.json();
      setMessage(data.ok ? 'BBB session created and saved.' : data.error || 'Could not create BBB session.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create BBB session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle title="Sessions" body="Create and manage BigBlueButton mentorship sessions." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <Card hoverEffect={false} className="p-6">
          <h2 className="text-xl font-black">Create BBB Session</h2>
          <form onSubmit={createSession} className="mt-5 grid gap-3">
            <input className="cn-input" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <Button disabled={loading}>{loading ? 'Creating...' : 'Create BBB Session'} <Radio size={15} /></Button>
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
                  {session.bbbMeetingId ? <a href={`/api/bbb/join?meetingId=${session.bbbMeetingId}&fullName=CyberNurdin%20Mentor&role=moderator`}><Button variant="secondary">Moderator</Button></a> : <Button variant="secondary" disabled>No BBB</Button>}
                  <Button variant="ghost">End</Button>
                </div>
              </div>
            )) : <EmptyState title="No sessions yet" body="Create a BBB session or wait for mentee requests." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminSubmissionsPage() {
  const [allSubmissions, setAllSubmissions] = useState<EvidenceSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all');
  const [selected, setSelected] = useState<EvidenceSubmission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setAllSubmissions(getAllSubmissions());
  }, []);

  const filtered = filter === 'all' ? allSubmissions : allSubmissions.filter((s) => s.status === filter);

  const counts = {
    all: allSubmissions.length,
    pending: allSubmissions.filter((s) => s.status === 'pending').length,
    'under-review': allSubmissions.filter((s) => s.status === 'under-review').length,
    approved: allSubmissions.filter((s) => s.status === 'approved').length,
    rejected: allSubmissions.filter((s) => s.status === 'rejected').length,
  };

  const filters: { key: 'all' | SubmissionStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'under-review', label: 'Under Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  function statusStyle(status: SubmissionStatus) {
    switch (status) {
      case 'approved': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'rejected': return 'border-red-200 bg-red-50 text-red-700';
      case 'under-review': return 'border-[#F5D35E]/40 bg-[#F5D35E]/12 text-[#7a6000]';
      default: return 'border-[#0B3D77]/20 bg-[#0B3D77]/6 text-[#0B3D77]';
    }
  }

  async function handleReview(status: SubmissionStatus) {
    if (!selected) return;
    setLoading(true);
    setMessage('');
    try {
      const updated = await reviewSubmission(selected.id, status, feedback, 'admin');
      if (updated) {
        setAllSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setSelected(updated);
        setMessage(status === 'approved' ? 'Submission approved and student notified.' : 'Submission rejected with feedback.');
      }
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
          {filtered.length === 0 ? (
            <EmptyState title="No submissions" body={filter === 'all' ? 'No evidence submissions yet.' : `No submissions with status "${filter}".`} />
          ) : (
            <div className="divide-y divide-[#061C36]/8">
              {filtered.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => { setSelected(sub); setFeedback(sub.mentorFeedback || ''); setMessage(''); }}
                  className={`grid w-full gap-2 py-4 text-left md:grid-cols-[1fr_140px_100px] md:items-center ${selected?.id === sub.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  <div>
                    <p className="font-black">{sub.userId}</p>
                    <p className="text-sm font-semibold text-[#061C36]/54">Lesson: {sub.lessonId}</p>
                    <p className="mt-1 text-xs font-bold text-[#061C36]/40">
                      {sub.evidenceType.replace('-', ' ')} · {sub.submittedAt.slice(0, 10)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#061C36]/52 truncate">{sub.evidenceUrl ? 'Evidence uploaded' : 'No URL'}</p>
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
                <p className="text-[10px] font-black uppercase text-[#061C36]/40">Student</p>
                <p className="mt-1 font-black">{selected.userId}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Lesson</p>
                <p className="mt-1 text-sm font-bold">{selected.lessonId}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Type</p>
                <p className="mt-1 text-sm font-bold capitalize">{selected.evidenceType.replace('-', ' ')}</p>
                <p className="mt-3 text-[10px] font-black uppercase text-[#061C36]/40">Submitted</p>
                <p className="mt-1 text-sm font-bold">{selected.submittedAt.slice(0, 10)}</p>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] font-black uppercase text-[#061C36]/40">Student Reflection</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/64">{selected.notes}</p>
                </div>
              )}

              {selected.evidenceUrl && (
                <a href={selected.evidenceUrl} target="_blank" rel="noopener noreferrer">
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
