'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { Button, Card, Input } from '@/components/UI';
import { BrandLockup } from '@/components/public/PublicChrome';
import CyberNurdinLogo from '@/components/shared/CyberNurdinLogo';
import { activateAccess } from '@/lib/actions/activate';

export function ActivateAccessView() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await activateAccess({ email, couponCode, password, fullName });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#061C36] lg:flex">
      <aside className="cn-dark-grid-bg flex min-h-[320px] flex-col justify-between bg-[#061C36] p-7 text-white lg:min-h-screen lg:w-[42%] lg:p-10">
        <BrandLockup />
        <div className="my-12 max-w-lg">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">Activate access</span>
          <h1 className="mt-4 text-4xl font-black leading-tight">One last step to <span className="text-[#F95738]">begin.</span></h1>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/62">
            Enter the activation code your mentor sent after approving your application, then set your password.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="grid h-28 w-28 place-items-center rounded-full border border-[#F95738]/24 bg-[#F95738]/12 text-[#F95738]">
              <CyberNurdinLogo size="lg" variant="light" showText={false} />
            </div>
          </div>
        </div>
        <p className="text-xs font-semibold leading-6 text-white/56">
          Applied but haven&apos;t received a code yet? Applications are reviewed by a mentor — check back soon.
        </p>
      </aside>
      <section className="flex flex-1 items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-lg">
          {done ? (
            <Card hoverEffect={false} className="p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <Check size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-black">Access Activated</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#061C36]/64">
                Your account is ready. Sign in with your email and the password you just set.
              </p>
              <Link href="/login" className="mt-6 block">
                <Button className="w-full">Go to Login <ArrowRight size={15} /></Button>
              </Link>
            </Card>
          ) : (
            <>
              <h2 className="text-2xl font-black">Activate Your Access</h2>
              <p className="mt-2 text-sm font-semibold text-[#061C36]/60">
                Use the activation code from your mentor to unlock your mentorship dashboard.
              </p>
              <Card hoverEffect={false} className="mt-7 p-6 md:p-7">
                <form onSubmit={submit} className="space-y-5">
                  <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} icon={<User size={15} />} placeholder="Your full name" required />
                  <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} icon={<Mail size={15} />} placeholder="you@example.com" required />
                  <div className="rounded-lg border border-dashed border-[#F95738]/42 bg-[#F95738]/6 p-4">
                    <Input
                      label="Activation Code"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value)}
                      icon={<KeyRound size={15} />}
                      placeholder="CYBER-XXXX-XXXX-XXXX"
                      required
                    />
                    <p className="mt-2 text-xs font-bold leading-5 text-[#F95738]">Sent by email after your application is approved.</p>
                  </div>
                  <Input
                    label="Create a password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    icon={<Lock size={15} />}
                    placeholder="At least 8 characters"
                    required
                    rightElement={
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[#061C36]/44 transition hover:bg-[#061C36]/6 hover:text-[#061C36]">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                  {error && (
                    <p className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
                      <ShieldCheck size={15} /> {error}
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Activating...' : 'Activate Access'}
                    <ArrowRight size={15} />
                  </Button>
                </form>
              </Card>
              <p className="mt-6 rounded-lg border border-[#061C36]/8 bg-white/60 p-4 text-xs font-semibold leading-5 text-[#061C36]/58">
                Already activated? <Link href="/login" className="font-black text-[#F95738]">Log in instead</Link>.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
