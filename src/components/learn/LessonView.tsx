'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText, Maximize2, Play, Shield, Trophy } from 'lucide-react';
import { Badge, Button, Card, ProgressBar } from '@/components/UI';
import { getLesson } from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';

type LessonTab = 'video' | 'slides' | 'notes' | 'resources' | 'quiz';

export function YouTubeLessonPlayer({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function SlidesView({ lessonId, tabComplete }: { lessonId: string; tabComplete: () => void }) {
  const params = useParams();
  const data = getLesson(params.pathSlug as string, lessonId);
  const [index, setIndex] = useState(0);
  if (!data) return null;
  const slide = data.lesson.slides[index];
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-black">Slide {index + 1} of {data.lesson.slides.length}</div>
        <button type="button" className="rounded-xl border border-[#061C36]/10 p-2 text-[#061C36]/50">
          <Maximize2 size={16} />
        </button>
      </div>
      <div className="grid min-h-64 place-items-center rounded-2xl bg-[#061C36] p-8 text-center text-white">
        <div>
          <BookOpen className="mx-auto mb-4 text-[#F95738]" size={34} />
          <h2 className="text-2xl font-black">{slide.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-6 text-white/70">{slide.body}</p>
          <p className="mx-auto mt-4 max-w-lg text-xs font-black uppercase tracking-wide text-[#F5D35E]">{slide.takeaway}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-3">
        <Button type="button" variant="secondary" disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>Previous</Button>
        {index === data.lesson.slides.length - 1 ? (
          <Button type="button" onClick={tabComplete}>Mark Slides Complete</Button>
        ) : (
          <Button type="button" onClick={() => setIndex((value) => value + 1)}>Next Slide</Button>
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
    const correct = lesson.quiz.questions.filter((question) => answers[question.id] === question.correctIndex).length;
    const nextScore = Math.round((correct / lesson.quiz.questions.length) * 100);
    const passed = nextScore >= lesson.quiz.passingScore;
    setScore(nextScore);
    await gradeQuiz(lesson.id, lesson.quiz.id, nextScore, passed, answers);
    if (passed) {
      await updateProgress(lesson.id, { quizPassed: true, state: 'in-progress' });
    }
  };

  return (
    <Card className="p-5">
      <h2 className="text-xl font-black">Checkpoint Quiz</h2>
      <div className="mt-5 space-y-5">
        {lesson.quiz.questions.map((question, index) => (
          <div key={question.id}>
            <p className="text-sm font-black">{index + 1}. {question.prompt}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                  className={`rounded-xl border p-3 text-left text-sm font-bold ${answers[question.id] === optionIndex ? 'border-[#F95738] bg-[#F95738]/10 text-[#F95738]' : 'border-[#061C36]/10 bg-[#FAF7F0] text-[#061C36]/68'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {score !== null && (
        <div className={`mt-5 rounded-2xl p-4 text-sm font-black ${score >= lesson.quiz.passingScore ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          Score: {score}%. {score >= lesson.quiz.passingScore ? 'Passed' : 'Retake allowed'}.
        </div>
      )}
      <Button className="mt-5" type="button" onClick={submit} disabled={Object.keys(answers).length < lesson.quiz.questions.length}>Submit Quiz</Button>
    </Card>
  );
}

export function LessonView({ initialTab = 'video' }: { initialTab?: LessonTab }) {
  const router = useRouter();
  const params = useParams();
  const { user, progress, updateProgress, isLoadingUser } = useApp();
  const [tab, setTab] = useState<LessonTab>(initialTab);
  const pathSlug = params.pathSlug as string;
  const lessonId = params.lessonId as string;
  const data = useMemo(() => getLesson(pathSlug, lessonId), [lessonId, pathSlug]);

  if (isLoadingUser) return null;
  if (!user) {
    router.push('/login');
    return null;
  }
  if (!data) {
    return <div className="grid min-h-screen place-items-center bg-[#061C36] text-white">Lesson not found.</div>;
  }
  if (user.activePathId !== data.path.id) {
    return <div className="grid min-h-screen place-items-center bg-[#061C36] p-6 text-center text-white">This path is locked. You can only access your active assigned mentorship path.</div>;
  }

  const { path, lesson, lessons } = data;
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = lessons[lessonIndex + 1];
  const prevLesson = lessons[lessonIndex - 1];
  const complete = progress?.lessons?.[lesson.id];
  const percent = Math.round(((complete?.videoCompleted ? 1 : 0) + (complete?.slidesCompleted ? 1 : 0) + (complete?.quizPassed ? 1 : 0)) / 3 * 100);

  const markComplete = async () => {
    await updateProgress(lesson.id, { videoCompleted: true, slidesCompleted: true, quizPassed: true, state: 'completed' });
  };

  return (
    <main className="min-h-screen bg-[#F6F2E9] text-[#061C36]">
      <header className="sticky top-0 z-40 border-b border-[#061C36]/8 bg-[#061C36] px-4 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/dashboard/overview" className="flex items-center gap-2 text-sm font-black text-white/72">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <Badge className="border-white/15 bg-white/10 text-white">{complete?.state || 'unlocked'}</Badge>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:p-6 lg:grid-cols-[1fr_320px] lg:p-8">
        <section className="min-w-0">
          <div className="mb-5 rounded-3xl bg-[#061C36] p-5 text-white">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F95738]">{path.title} / {data.lesson.module.title}</p>
                <h1 className="mt-2 text-2xl font-black md:text-3xl">{lesson.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-white/42">Lesson progress</p>
                <p className="text-2xl font-black text-[#F5D35E]">{percent}%</p>
              </div>
            </div>
            <ProgressBar value={percent} dark />
          </div>

          <YouTubeLessonPlayer videoId={lesson.youtubeVideoId} title={lesson.title} />
          <div className="mt-4 flex flex-wrap gap-2">
            {(['video', 'slides', 'notes', 'resources', 'quiz'] as LessonTab[]).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${tab === item ? 'bg-[#F95738] text-white' : 'bg-white text-[#061C36]/58'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5">
            {tab === 'video' && (
              <Card className="p-5">
                <h2 className="font-black">Lesson Video</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#061C36]/62">Video is embedded from YouTube so watch activity remains on the CyberNurdin channel.</p>
                <Button className="mt-4" type="button" onClick={() => updateProgress(lesson.id, { videoCompleted: true, state: 'in-progress' })}>Mark Video Complete</Button>
              </Card>
            )}
            {tab === 'slides' && <SlidesView lessonId={lesson.id} tabComplete={() => updateProgress(lesson.id, { slidesCompleted: true, state: 'in-progress' })} />}
            {tab === 'notes' && (
              <Card className="p-5">
                <h2 className="font-black">Lesson Notes</h2>
                <ul className="mt-4 space-y-3 text-sm font-bold text-[#061C36]/66">
                  {lesson.notes.map((note) => <li key={note} className="flex gap-2"><FileText size={16} className="mt-0.5 text-[#F95738]" />{note}</li>)}
                </ul>
              </Card>
            )}
            {tab === 'resources' && (
              <Card className="p-5">
                <h2 className="font-black">Resources</h2>
                <ul className="mt-4 space-y-3 text-sm font-bold text-[#061C36]/66">
                  {lesson.resources.map((resource) => <li key={resource} className="flex gap-2"><Shield size={16} className="mt-0.5 text-[#F95738]" />{resource}</li>)}
                </ul>
              </Card>
            )}
            {tab === 'quiz' && <QuizView lessonId={lesson.id} />}
          </div>
          <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#061C36]/10 pt-5 sm:flex-row">
            <div className="flex gap-3">
              {prevLesson && <Link href={`/learn/${path.slug}/lessons/${prevLesson.id}`}><Button variant="secondary">Previous</Button></Link>}
              {nextLesson && <Link href={`/learn/${path.slug}/lessons/${nextLesson.id}`}><Button variant="secondary">Next Lesson</Button></Link>}
            </div>
            {complete?.state === 'completed' ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-black text-emerald-700"><CheckCircle2 size={17} />Complete</span>
            ) : (
              <Button onClick={markComplete}>Mark Complete <Trophy size={15} /></Button>
            )}
          </div>
        </section>
        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="font-black">Course Outline</h2>
            <div className="mt-4 space-y-2">
              {lessons.map((item, index) => (
                <Link key={item.id} href={`/learn/${path.slug}/lessons/${item.id}`} className={`flex items-center gap-2 rounded-xl p-3 text-sm font-bold ${item.id === lesson.id ? 'bg-[#F95738]/10 text-[#F95738]' : 'bg-[#FAF7F0] text-[#061C36]/62'}`}>
                  <span>{index + 1}</span>
                  <span className="line-clamp-2">{item.title}</span>
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
