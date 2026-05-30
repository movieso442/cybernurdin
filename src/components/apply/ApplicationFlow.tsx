'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, Lock, Mail, Phone, Send, Shield, User } from 'lucide-react';
import { Button, Card, Input, Stepper } from '@/components/UI';
import { ApplicationPayload, mentorshipPaths } from '@/lib/cybernurdin-data';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/public/PublicChrome';

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
  preferredPathId: mentorshipPaths[0].id,
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
            <Shield size={62} />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-black text-white/58">
          <div>Apply</div>
          <div>Get reviewed</div>
          <div>Receive coupon</div>
        </div>
      </div>
      <p className="text-xs font-semibold leading-6 text-white/56">
        Coupon-based dashboard access is issued only after approval. You will study one assigned cybersecurity path at a time.
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
          <Input label="Username" value={data.username} onChange={(event) => update({ username: event.target.value })} icon={<span className="text-xs font-black">@</span>} required />
          <Input label="Email" type="email" value={data.email} onChange={(event) => update({ email: event.target.value })} icon={<Mail size={15} />} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Phone" value={data.phone} onChange={(event) => update({ phone: event.target.value })} icon={<Phone size={15} />} required />
          <Input label="Country" value={data.country} onChange={(event) => update({ country: event.target.value })} icon={<Globe size={15} />} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Password" type="password" value={data.password} onChange={(event) => update({ password: event.target.value })} icon={<Lock size={15} />} required />
          <Input label="Confirm password" type="password" icon={<Lock size={15} />} required />
        </div>
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
              {mentorshipPaths.map((path) => <option key={path.id} value={path.id}>{path.title}</option>)}
            </select>
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
          Your application is under review. If approved, your coupon code will be sent externally and will be required to log in.
        </p>
        <Link href="/login" className="mt-6 block">
          <Button>Go to Login</Button>
        </Link>
      </Card>
    </div>
  );
}

export function ApplicationFlow({ initialStep = 0, successOnly = false }: { initialStep?: number; successOnly?: boolean }) {
  const router = useRouter();
  const { applyForMentorship, triggerToast } = useApp();
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<ApplicationPayload>(emptyApplication);
  const [submitted, setSubmitted] = useState(successOnly);
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
    await applyForMentorship(data);
    setSubmitted(true);
    router.replace('/apply/success');
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#061C36] lg:flex">
      <ApplySidePanel />
      <section className="flex-1 p-5 md:p-8 lg:p-10">
        {submitted ? (
          <SuccessPanel />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#061C36]/54">
                <ArrowLeft size={14} />
                Home
              </Link>
              <span className="text-xs font-black uppercase tracking-wide text-[#F95738]">Step {step + 1} of 4</span>
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
                <Button type="submit">
                  {step === 3 ? 'Submit Application' : 'Save & Continue'}
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
