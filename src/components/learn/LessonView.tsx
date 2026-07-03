'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  Play,
  Send,
  Shield,
  Trophy,
  Upload,
} from 'lucide-react';
import { Badge, Button, Card, ProgressBar } from '@/components/UI';
import { EvidenceSubmission, EvidenceType, getLesson } from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';

type LessonTab = 'slides' | 'notes' | 'quiz' | 'submit';

export function YouTubeLessonPlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-[#061C36]/10 bg-black shadow-[0_24px_64px_rgba(6,28,54,0.22)]">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&color=white`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function statusBadgeStyle(status: EvidenceSubmission['status'] | 'not-submitted') {
  switch (status) {
    case 'approved': return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'rejected': return 'border-red-200 bg-red-50 text-red-700';
    case 'under-review': return 'border-[#F5D35E]/50 bg-[#F5D35E]/15 text-[#7a6000]';
    case 'pending': return 'border-[#0B3D77]/20 bg-[#0B3D77]/8 text-[#0B3D77]';
    default: return 'border-[#061C36]/12 bg-[#FAF7F0] text-[#061C36]/54';
  }
}

function statusLabel(status: EvidenceSubmission['status'] | 'not-submitted') {
  switch (status) {
    case 'approved': return 'Approved';
    case 'rejected': return 'Needs Revision';
    case 'under-review': return 'Under Review';
    case 'pending': return 'Submitted — Pending';
    default: return 'Not Submitted';
  }
}

function SlidesView({ lessonId, tabComplete }: { lessonId: string; tabComplete: () => void }) {
  const params = useParams();
  const data = getLesson(params.pathSlug as string, lessonId);
  const [index, setIndex] = useState(0);
  if (!data) return null;
  const slide = data.lesson.slides[index];

  return (
    <Card hoverEffect={false} className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-[#061C36]/8 px-5 py-4">
        <h2 className="font-black">Slides</h2>
        <span className="text-xs font-black uppercase tracking-wide text-[#061C36]/42">{index + 1} / {data.lesson.slides.length}</span>
      </div>
      <div className="grid min-h-64 place-items-center bg-[#061C36] px-6 py-12 text-center text-white">
        <div className="max-w-xl">
          <BookOpen className="mx-auto mb-5 text-[#F95738]" size={32} />
          <h3 className="text-2xl font-black leading-tight">{slide.title}</h3>
          <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-7 text-white/70">{slide.body}</p>
          <p className="mx-auto mt-5 inline-flex rounded-full border border-[#F5D35E]/30 bg-[#F5D35E]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#F5D35E]">{slide.takeaway}</p>
        </div>
      </div>
      <div className="flex justify-between gap-3 border-t border-[#061C36]/8 p-5">
        <Button type="button" variant="secondary" disabled={index === 0} onClick={() => setIndex((v) => v - 1)}>Previous</Button>
        {index === data.lesson.slides.length - 1 ? (
          <Button type="button" onClick={tabComplete}>Mark Slides Done <CheckCircle2 size={15} /></Button>
        ) : (
          <Button type="button" onClick={() => setIndex((v) => v + 1)}>Next Slide <ArrowRight size={15} /></Button>
        )}
      </div>
    </Card>
  );
}

function QuizView({ lessonId }: { lessonId: string }) {
  const params = useParams();
  const { gradeQuiz, updateProgress } = useApp();
  const data = getLesson(params.pathSlug as string, lessonId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number | null>(null);
  if (!data) return null;
  const { lesson } = data;

  const submit = async () => {
    const correct = lesson.quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const nextScore = Math.round((correct / lesson.quiz.questions.length) * 100);
    const passed = nextScore >= lesson.quiz.passingScore;
    setScore(nextScore);
    await gradeQuiz(lesson.id, lesson.quiz.id, nextScore, passed, answers);
    if (passed) await updateProgress(lesson.id, { quizPassed: true, state: 'in-progress', score: nextScore });
  };

  const answered = Object.keys(answers).length;

  return (
    <Card hoverEffect={false} className="overflow-hidden p-0">
      <div className="border-b border-[#061C36]/8 px-5 py-4">
        <h2 className="font-black">Checkpoint Quiz</h2>
        <p className="mt-1 text-xs font-bold text-[#061C36]/48">Passing score: {lesson.quiz.passingScore}% · {lesson.quiz.questions.length} questions</p>
      </div>
      <div className="divide-y divide-[#061C36]/6 p-5">
        {lesson.quiz.questions.map((q, i) => (
          <div key={q.id} className="py-5 first:pt-0 last:pb-0">
            <p className="text-sm font-black">{i + 1}. {q.prompt}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers((cur) => ({ ...cur, [q.id]: oi }))}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-bold transition ${answers[q.id] === oi ? 'border-[#F95738] bg-[#F95738]/8 text-[#F95738]' : 'border-[#061C36]/10 bg-[#FAF7F0] text-[#061C36]/68 hover:border-[#061C36]/22 hover:bg-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {score !== null && (
        <div className={`mx-5 mb-4 rounded-lg p-4 text-sm font-black ${score >= lesson.quiz.passingScore ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {score >= lesson.quiz.passingScore ? <CheckCircle2 className="mb-1" size={16} /> : <AlertCircle className="mb-1" size={16} />}
          Score: {score}% — {score >= lesson.quiz.passingScore ? 'Passed! Now submit your evidence below.' : `Retake allowed. Need ${lesson.quiz.passingScore}% to pass.`}
        </div>
      )}
      <div className="border-t border-[#061C36]/8 p-5">
        <Button
          type="button"
          onClick={submit}
          disabled={answered < lesson.quiz.questions.length}
        >
          Submit Quiz ({answered}/{lesson.quiz.questions.length} answered)
        </Button>
      </div>
    </Card>
  );
}

function SubmitEvidenceView({
  lessonId,
  unitId,
  moduleId,
  existing,
}: {
  lessonId: string;
  unitId: string;
  moduleId: string;
  existing?: EvidenceSubmission;
}) {
  const { submitEvidence } = useApp();
  const [evidenceUrl, setEvidenceUrl] = useState(existing?.evidenceUrl || '');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>(existing?.evidenceType || 'screenshot');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existing);

  const currentStatus = existing?.status || 'not-submitted';
  const isApproved = currentStatus === 'approved';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!evidenceUrl.trim()) return;
    setSubmitting(true);
    try {
      await submitEvidence({ lessonId, unitId, moduleId, evidenceUrl, evidenceType, notes });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card hoverEffect={false} className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-[#061C36]/8 px-5 py-4">
        <div>
          <h2 className="font-black">Evidence Submission</h2>
          <p className="mt-0.5 text-xs font-bold text-[#061C36]/48">Submit proof of completion for mentor review</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${statusBadgeStyle(currentStatus as EvidenceSubmission['status'] | 'not-submitted')}`}>
          {statusLabel(currentStatus as EvidenceSubmission['status'] | 'not-submitted')}
        </span>
      </div>

      {existing?.mentorFeedback && (
        <div className={`mx-5 mt-5 rounded-lg border p-4 ${isApproved ? 'border-emerald-200 bg-emerald-50' : 'border-[#F95738]/20 bg-[#F95738]/5'}`}>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">Mentor Feedback</p>
          <p className={`mt-2 text-sm font-semibold leading-6 ${isApproved ? 'text-emerald-800' : 'text-[#061C36]/70'}`}>{existing.mentorFeedback}</p>
          {existing.reviewedAt && (
            <p className="mt-2 text-[10px] font-black text-[#061C36]/36">Reviewed {existing.reviewedAt.slice(0, 10)}</p>
          )}
        </div>
      )}

      {isApproved ? (
        <div className="flex items-center gap-3 p-5">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
          <p className="text-sm font-bold text-[#061C36]/72">This evidence has been approved by your mentor. You may proceed to the next module.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-[#061C36]/42">What can you submit?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {([
                ['screenshot', 'Screenshot'],
                ['pdf', 'PDF Report'],
                ['certificate', 'Certificate'],
                ['lab-notes', 'Lab Notes'],
                ['reflection', 'Reflection'],
              ] as [EvidenceType, string][]).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEvidenceType(val)}
                  className={`rounded-lg border px-3 py-2 text-xs font-black transition ${evidenceType === val ? 'border-[#F95738] bg-[#F95738]/8 text-[#F95738]' : 'border-[#061C36]/10 bg-[#FAF7F0] text-[#061C36]/58 hover:border-[#061C36]/22'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/52">
              Evidence URL <span className="text-[#F95738]">*</span>
            </label>
            <div className="relative">
              <ExternalLink size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#061C36]/36" />
              <input
                className="cn-input pl-9"
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://imgur.com/..."
                required
              />
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-[#061C36]/44">
              Upload your file to Google Drive, Dropbox, or Imgur, then paste the shareable link here.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/52">Written Reflection</label>
            <textarea
              className="cn-input min-h-[100px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what you learned, what you did, any challenges faced, and what you'd do differently..."
            />
          </div>

          {submitted && currentStatus === 'pending' && (
            <div className="rounded-lg border border-[#0B3D77]/20 bg-[#0B3D77]/6 p-3 text-xs font-bold text-[#0B3D77]">
              Submitted. Your mentor will review and respond shortly.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={submitting || !evidenceUrl.trim()}>
              {submitting ? 'Submitting...' : submitted ? 'Resubmit Evidence' : 'Submit Evidence'}
              <Send size={14} />
            </Button>
            {existing?.evidenceUrl && (
              <a href={existing.evidenceUrl} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="secondary">View Submitted <ExternalLink size={14} /></Button>
              </a>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}

export function LessonView({ initialTab = 'slides' }: { initialTab?: LessonTab | 'video' }) {
  const router = useRouter();
  const params = useParams();
  const { user, progress, submissions, updateProgress, isLoadingUser } = useApp();
  const [tab, setTab] = useState<LessonTab>(initialTab === 'video' ? 'slides' : (initialTab as LessonTab));
  const pathSlug = params.pathSlug as string;
  const lessonId = params.lessonId as string;
  const data = useMemo(() => getLesson(pathSlug, lessonId), [lessonId, pathSlug]);

  if (isLoadingUser) return null;
  if (!user) { router.push('/login'); return null; }
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#061C36] text-white">
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-4 text-[#F95738]" />
          <p className="text-lg font-black">Lesson not found</p>
          <Link href="/dashboard/lessons" className="mt-4 inline-block text-sm font-bold text-white/54 underline">Back to lessons</Link>
        </div>
      </div>
    );
  }
  if (user.activePathId !== data.path.id) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#061C36] p-6 text-center text-white">
        <div>
          <Lock size={32} className="mx-auto mb-4 text-[#F95738]" />
          <p className="text-lg font-black">Path Locked</p>
          <p className="mt-2 max-w-sm text-sm font-semibold text-white/58">This path is not your active assigned mentorship path.</p>
          <Link href="/dashboard/my-path" className="mt-5 inline-block text-sm font-bold text-[#F95738] underline">Go to my path</Link>
        </div>
      </div>
    );
  }

  const { path, lesson, lessons, unit, module: lessonModule } = data;
  const lessonIndex = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessons[lessonIndex + 1];
  const prevLesson = lessons[lessonIndex - 1];
  const complete = progress?.lessons?.[lesson.id];
  const lessonSubmission = submissions.find((s) => s.lessonId === lesson.id);
  const submissionStatus = lessonSubmission?.status;

  const videoWatched = complete?.videoCompleted;
  const slidesDone = complete?.slidesCompleted;
  const quizPassed = complete?.quizPassed;
  const lessonComplete = complete?.state === 'completed' || complete?.lessonCompleted;

  const percent = Math.round(
    [videoWatched, slidesDone, quizPassed, lessonSubmission ? true : false].filter(Boolean).length / 4 * 100,
  );

  const tabs: { key: LessonTab; label: string; done: boolean }[] = [
    { key: 'slides', label: 'Slides', done: !!slidesDone },
    { key: 'notes', label: 'Mentor Notes', done: false },
    { key: 'quiz', label: 'Quiz', done: !!quizPassed },
    { key: 'submit', label: 'Submit Evidence', done: !!lessonSubmission },
  ];

  const markComplete = async () => {
    await updateProgress(lesson.id, { videoCompleted: true, slidesCompleted: true, quizPassed: true, state: 'completed' });
  };

  return (
    <main className="min-h-screen bg-[#F6F2E9] text-[#061C36]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061C36] px-4 py-3 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/dashboard/lessons" className="flex items-center gap-2 text-sm font-black text-white/64 hover:text-white transition">
            <ArrowLeft size={16} />
            Lessons
          </Link>
          <div className="flex items-center gap-3">
            {lessonSubmission && (
              <span className={`hidden rounded-full border px-3 py-1 text-[10px] font-black uppercase sm:inline-flex ${statusBadgeStyle(submissionStatus!)}`}>
                Evidence: {statusLabel(submissionStatus!)}
              </span>
            )}
            <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase ${
              lessonComplete
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                : 'border-white/15 bg-white/8 text-white/62'
            }`}>
              {lessonComplete ? 'Complete' : complete?.state || 'In Progress'}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        <section className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#F95738]">
            <Shield size={11} />
            <span>{path.title}</span>
            <span className="text-[#061C36]/28">/</span>
            <span>{unit.title}</span>
            <span className="text-[#061C36]/28">/</span>
            <span className="text-[#061C36]/42">{lessonModule.title}</span>
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">{lesson.title}</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#061C36]/58">{lesson.description}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase text-[#061C36]/42">
                <span>Lesson Progress</span>
                <span>{percent}%</span>
              </div>
              <ProgressBar value={percent} />
            </div>
            <div className="flex items-center gap-3 text-xs font-black text-[#061C36]/42">
              <span className="flex items-center gap-1"><Clock size={12} />{lesson.duration}</span>
              {lesson.isRequired && <span className="rounded-full border border-[#F95738]/30 bg-[#F95738]/8 px-2 py-0.5 text-[10px] font-black text-[#F95738]">Required</span>}
            </div>
          </div>
        </section>

        <YouTubeLessonPlayer videoId={lesson.youtubeVideoId} title={lesson.title} />
        <a
          href={lesson.youtube.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-[#061C36]/48 hover:text-[#F95738]"
        >
          Watch on YouTube <ExternalLink size={12} />
        </a>

        <div className="mt-4 flex items-center gap-3">
          {videoWatched ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700">
              <CheckCircle2 size={15} /> Video watched
            </span>
          ) : (
            <Button type="button" onClick={() => updateProgress(lesson.id, { videoCompleted: true, state: 'in-progress' })}>
              <Play size={14} /> Mark Video Watched
            </Button>
          )}
          {lesson.resources.length > 0 && (
            <span className="text-xs font-bold text-[#061C36]/42">{lesson.resources.length} external resources below</span>
          )}
        </div>

        {lesson.resources.length > 0 && (
          <div className="mt-5 rounded-xl border border-[#0B3D77]/14 bg-[#0B3D77]/4 p-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wide text-[#0B3D77]">Official External Resources</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {lesson.resources.map((resource) => (
                <a
                  key={resource}
                  href={resource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[#0B3D77]/16 bg-white px-4 py-3 text-sm font-bold text-[#0B3D77] hover:border-[#0B3D77]/30 hover:bg-[#0B3D77]/4 transition"
                >
                  <ExternalLink size={14} className="shrink-0" />
                  <span className="truncate">{resource}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          {tabs.map(({ key, label, done }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wide transition ${
                tab === key
                  ? 'bg-[#F95738] text-white'
                  : 'bg-white text-[#061C36]/58 hover:bg-[#061C36]/5 hover:text-[#061C36]'
              } ${key === 'submit' ? 'border-2 border-[#F95738]/40' : ''}`}
            >
              {done && <CheckCircle2 size={13} className={tab === key ? 'text-white' : 'text-emerald-500'} />}
              {key === 'submit' && !done && <Upload size={13} />}
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'slides' && (
            <SlidesView
              lessonId={lesson.id}
              tabComplete={() => updateProgress(lesson.id, { slidesCompleted: true, state: 'in-progress' })}
            />
          )}
          {tab === 'notes' && (
            <Card hoverEffect={false} className="overflow-hidden p-0">
              <div className="border-b border-[#061C36]/8 px-5 py-4">
                <h2 className="font-black">Mentor Notes</h2>
              </div>
              <ul className="divide-y divide-[#061C36]/6 p-5">
                {lesson.notes.length ? lesson.notes.map((note) => (
                  <li key={note} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <FileText size={15} className="mt-0.5 shrink-0 text-[#F95738]" />
                    <span className="text-sm font-semibold leading-6 text-[#061C36]/68">{note}</span>
                  </li>
                )) : (
                  <li className="py-4 text-sm font-semibold text-[#061C36]/44">No mentor notes for this lesson yet.</li>
                )}
              </ul>
            </Card>
          )}
          {tab === 'quiz' && <QuizView lessonId={lesson.id} />}
          {tab === 'submit' && (
            <SubmitEvidenceView
              lessonId={lesson.id}
              unitId={unit.id}
              moduleId={lessonModule.id}
              existing={lessonSubmission}
            />
          )}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#061C36]/8 pt-6 sm:flex-row sm:items-center">
          <div className="flex gap-3">
            {prevLesson && (
              <Link href={`/learn/${path.slug}/lessons/${prevLesson.id}`}>
                <Button variant="secondary"><ArrowLeft size={14} /> Previous</Button>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/learn/${path.slug}/lessons/${nextLesson.id}`}>
                <Button variant="secondary">Next Lesson <ArrowRight size={14} /></Button>
              </Link>
            )}
          </div>
          {lessonComplete ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
              <CheckCircle2 size={17} /> Lesson Complete
            </span>
          ) : (
            <Button onClick={markComplete}>
              Mark Lesson Complete <Trophy size={14} />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
