'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, LogIn, Mail, Phone, Send, User } from 'lucide-react';
import { Button, Card, Input, Stepper } from '@/components/UI';
import { ApplicationPayload, mentorshipPaths } from '@/lib/cybernurdin-data';
import { submitApplication } from '@/lib/actions/applications';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/public/PublicChrome';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';

const emptyApplication: ApplicationPayload = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  password: '',
  experienceLevel: 'Beginner',
  educationStatus: '',
  deviceAccess: 'Reliable laptop and internet',
  priorTraining: '',
  portfolioUrl: '',
  preferredPathId: mentorshipPaths.find((path) => path.availability === 'available')?.id || mentorshipPaths[0].id,
  motivation: '',
  careerGoal: '',
  weeklyHours: '10-15',
  commitmentAccepted: false,
};

function ApplySidePanel() {
  return (
    <aside className="cn-dark-grid-bg flex min-h-[360px] flex-col justify-between bg-[#061C36] p-7 text-white lg:min-h-screen lg:w-[42%] lg:p-10">
      <BrandLockup />
      <div className="my-12 max-w-lg">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">Apply for mentorship</span>
        <h1 className="mt-4 text-4xl font-black leading-tight">You are one step closer to becoming <span className="text-[#F95738]">a defender.</span></h1>
        <div className="mt-8 flex justify-center">
          <div className="grid h-28 w-28 place-items-center rounded-3xl border border-[#F95738]/25 bg-[#F95738]/12 text-[#F95738]">
            <CyberNurdinLogo size="xl" variant="light" showText={false} />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-black text-white/58">
          <div>Apply</div>
          <div>Create account</div>
          <div>Start learning</div>
        </div>
      </div>
      <p className="text-xs font-semibold leading-6 text-white/56">
        Your coupon code is emailed after registration when email delivery is configured.
      </p>
    </aside>
  );
}

function StepHeader({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm font-semibold leading-6 text-[#061C36]/60">{body}</p>
    </div>
  );
}

function PersonalInfoStep({
  data,
  update,
}: {
  data: ApplicationPayload;
  update: (patch: Partial<ApplicationPayload>) => void;
}) {
  return (
    <div className="space-y-5">
      <StepHeader title="Personal Information" body="Tell us who you are and where to send review updates." />
      <Card hoverEffect={false} className="grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="First name" value={data.firstName} onChange={(event) => update({ firstName: event.target.value })} icon={<User size={15} />} required />
          <Input label="Last name" value={data.lastName} onChange={(event) => update({ lastName: event.target.value })} icon={<User size={15} />} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Email" type="email" value={data.email} onChange={(event) => update({ email: event.target.value })} icon={<Mail size={15} />} required />
          <Input label="Phone" value={data.phone} onChange={(event) => update({ phone: event.target.value })} icon={<Phone size={15} />} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Country" value={data.country} onChange={(event) => update({ country: event.target.value })} icon={<Globe size={15} />} required />
        </div>
        <p className="rounded-lg border border-[#0B3D77]/16 bg-[#0B3D77]/5 p-3 text-xs font-semibold leading-5 text-[#0B3D77]">
          No password needed yet — you&apos;ll set one when you activate your access after your application is approved.
        </p>
      </Card>
    </div>
  );
}

function BackgroundStep({ data, update }: { data: ApplicationPayload; update: (patch: Partial<ApplicationPayload>) => void }) {
  return (
    <div className="space-y-5">
      <StepHeader title="Background & Experience" body="Help us understand your current skill level and readiness." />
      <Card hoverEffect={false} className="grid gap-4 p-5">
        <label>
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Cybersecurity experience level</span>
          <select className="cn-input" value={data.experienceLevel} onChange={(event) => update({ experienceLevel: event.target.value })}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Current education/status</span>
          <textarea className="cn-input min-h-24" value={data.educationStatus} onChange={(event) => update({ educationStatus: event.target.value })} required />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Device/internet availability</span>
            <select className="cn-input" value={data.deviceAccess} onChange={(event) => update({ deviceAccess: event.target.value })}>
              <option>Reliable laptop and internet</option>
              <option>Shared device, stable internet</option>
              <option>Need setup guidance</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Preferred path</span>
            <select className="cn-input" value={data.preferredPathId} onChange={(event) => update({ preferredPathId: event.target.value })}>
              {mentorshipPaths.filter((path) => path.availability === 'available').map((path) => (
                <option key={path.id} value={path.id}>{path.title}</option>
              ))}
            </select>
            <p className="mt-1.5 text-xs font-semibold text-[#061C36]/48">
              Only Introduction to Cybersecurity is open for enrollment right now. Other paths are visible on the Courses page as upcoming mentorship tracks.
            </p>
          </label>
        </div>
        <Input label="Prior training" value={data.priorTraining} onChange={(event) => update({ priorTraining: event.target.value })} />
        <Input label="GitHub / portfolio optional" value={data.portfolioUrl} onChange={(event) => update({ portfolioUrl: event.target.value })} />
      </Card>
    </div>
  );
}

function MotivationStep({ data, update }: { data: ApplicationPayload; update: (patch: Partial<ApplicationPayload>) => void }) {
  const selectedPath = mentorshipPaths.find((path) => path.id === data.preferredPathId);
  return (
    <div className="space-y-5">
      <StepHeader title="Motivation & Commitment" body="CyberNurdin is selective. Show us why you are ready for guided work." />
      <Card hoverEffect={false} className="grid gap-4 p-5">
        <label>
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Why do you want this mentorship?</span>
          <textarea className="cn-input min-h-28" value={data.motivation} onChange={(event) => update({ motivation: event.target.value })} required />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Career goal</span>
          <textarea className="cn-input min-h-24" value={data.careerGoal} onChange={(event) => update({ careerGoal: event.target.value })} required />
        </label>
        <label>
          <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wide text-[#061C36]/62">Weekly commitment hours</span>
          <select className="cn-input" value={data.weeklyHours} onChange={(event) => update({ weeklyHours: event.target.value })}>
            <option>5-10</option>
            <option>10-15</option>
            <option>15-20</option>
            <option>20+</option>
          </select>
        </label>
        <div className="rounded-2xl bg-[#FAF7F0] p-4 text-sm font-bold text-[#061C36]/70">
          Selected path review: <span className="text-[#F95738]">{selectedPath?.title}</span>
        </div>
        <label className="flex items-start gap-3 rounded-2xl border border-[#061C36]/10 bg-[#FAF7F0] p-4 text-sm font-bold text-[#061C36]/70">
          <input type="checkbox" checked={data.commitmentAccepted} onChange={(event) => update({ commitmentAccepted: event.target.checked })} className="mt-1 accent-[#F95738]" required />
          I understand this mentorship requires consistency, active participation, and mentor-reviewed work.
        </label>
      </Card>
    </div>
  );
}

function ReviewStep({ data }: { data: ApplicationPayload }) {
  const rows = [
    ['Name', `${data.firstName} ${data.lastName}`],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Country', data.country],
    ['Preferred Path', mentorshipPaths.find((path) => path.id === data.preferredPathId)?.title || ''],
    ['Experience', data.experienceLevel],
    ['Weekly Commitment', `${data.weeklyHours} hours`],
  ];

  return (
    <div className="space-y-5">
      <StepHeader title="Review & Submit" body="Confirm your application details before sending for review." />
      <Card hoverEffect={false} className="p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#FAF7F0] p-4">
              <div className="text-[10px] font-black uppercase tracking-wide text-[#061C36]/42">{label}</div>
              <div className="mt-1 text-sm font-black text-[#061C36]">{value || 'Not provided'}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SuccessPanel() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center py-16 text-center">
      <Card hoverEffect={false} className="p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F95738]/10 text-[#F95738]">
          <Check size={30} />
        </div>
        <h1 className="mt-5 text-2xl font-black">Application Submitted</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/64">
          Thank you for applying. A CyberNurdin mentor will review your application. If approved, you&apos;ll receive
          an activation code by email — use it on the Activate Access page to set your password and unlock your dashboard.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/activate-access">
            <Button variant="secondary" className="w-full">Already have a code?</Button>
          </Link>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function ApplicationFlow({ initialStep = 0, successOnly = false }: { initialStep?: number; successOnly?: boolean }) {
  const router = useRouter();
  const { triggerToast } = useApp();
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<ApplicationPayload>(emptyApplication);
  const [submitted, setSubmitted] = useState(successOnly);
  const [submitting, setSubmitting] = useState(false);
  const steps = ['Personal', 'Background', 'Commitment', 'Review'];

  const update = (patch: Partial<ApplicationPayload>) => setData((current) => ({ ...current, ...patch }));

  const stepView = useMemo(() => {
    if (step === 0) return <PersonalInfoStep data={data} update={update} />;
    if (step === 1) return <BackgroundStep data={data} update={update} />;
    if (step === 2) return <MotivationStep data={data} update={update} />;
    return <ReviewStep data={data} />;
  }, [data, step]);

  const submit = async () => {
    if (!data.commitmentAccepted) {
      triggerToast('Please accept the commitment checkbox before submitting.', 'danger');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitApplication({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        preferredPathId: data.preferredPathId,
        motivation: data.motivation,
      });
      if (!result.ok) {
        triggerToast(result.error, 'danger');
        return;
      }
      setSubmitted(true);
      router.replace('/apply/success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#061C36] lg:flex">
      <ApplySidePanel />
      <section className="flex-1 p-5 md:p-8 lg:p-10">
        {submitted ? (
          <SuccessPanel />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#061C36]/54">
                <ArrowLeft size={14} />
                Home
              </Link>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <Link
                  href="/login"
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#061C36]/10 bg-white px-3 text-xs font-black uppercase tracking-wide text-[#061C36]/68 shadow-[0_10px_22px_rgba(6,28,54,0.05)] transition hover:border-[#F95738]/35 hover:text-[#F95738]"
                >
                  <LogIn size={14} />
                  Log in
                </Link>
                <span className="text-xs font-black uppercase tracking-wide text-[#F95738]">Step {step + 1} of 4</span>
              </div>
            </div>
            <Stepper steps={steps} activeStep={step} />
            <form
              className="mt-8"
              onSubmit={(event) => {
                event.preventDefault();
                if (step < 3) setStep((value) => value + 1);
                else submit();
              }}
            >
              {stepView}
              <div className="mt-6 flex justify-between gap-3 border-t border-[#061C36]/10 pt-5">
                <Button type="button" variant="secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</Button>
                <Button type="submit" disabled={submitting}>
                  {step === 3 ? (submitting ? 'Submitting...' : 'Submit Application') : 'Save & Continue'}
                  {step === 3 ? <Send size={15} /> : <ArrowRight size={15} />}
                </Button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
