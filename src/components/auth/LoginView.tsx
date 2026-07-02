'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Tag, User, UserPlus } from 'lucide-react';
import { Button, Card, Input } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/public/PublicChrome';
import CyberNurdinLogo, { CyberNurdinLogoMark } from '@/components/shared/CyberNurdinLogo';

export function LoginView() {
  const router = useRouter();
  const { login, triggerToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password, couponCode);
      router.push('/dashboard/overview');
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : 'Login failed.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#061C36] lg:flex">
      <aside className="cn-dark-grid-bg flex min-h-[360px] flex-col justify-between bg-[#061C36] p-7 text-white lg:min-h-screen lg:w-[48%] lg:p-10">
        <BrandLockup />
        <div className="my-12 max-w-lg">
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F95738]">Secure learner login</span>
          <h1 className="mt-4 text-4xl font-black leading-tight">Welcome Back, <span className="text-[#F95738]">Future Defender.</span></h1>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/62">Sign in to continue your cybersecurity mentorship journey. Learn. Build. Defend.</p>
          <div className="mt-10 flex justify-center">
            <div className="grid h-36 w-36 place-items-center rounded-full border border-[#F95738]/24 bg-[#F95738]/12 text-[#F95738]">
              <CyberNurdinLogo size="xl" variant="light" showText={false} />
            </div>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-semibold text-white/68">
            <span className="flex items-center gap-2"><KeyRound size={15} className="text-[#F95738]" />Test login enabled after application</span>
            <span className="flex items-center gap-2"><Lock size={15} className="text-[#F95738]" />One active assigned path at a time</span>
            <span className="flex items-center gap-2"><CyberNurdinLogoMark tone="light" className="h-4 w-4" />Your data is protected with secure authentication.</span>
          </div>
        </div>
      </aside>
      <section className="flex flex-1 items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Sign in to CyberNurdin</h2>
              <p className="mt-2 text-sm font-semibold text-[#061C36]/60">Access your assigned path and continue your learning journey.</p>
            </div>
            <Link
              href="/signup"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#061C36]/10 bg-white px-4 text-xs font-black uppercase tracking-wide text-[#061C36] shadow-[0_10px_22px_rgba(6,28,54,0.06)] transition hover:border-[#F95738]/40 hover:text-[#F95738]"
            >
              Sign up
              <UserPlus size={14} />
            </Link>
          </div>
          <Card hoverEffect={false} className="mt-7 p-6 md:p-7">
            <form onSubmit={submit} className="space-y-5">
              <Input label="Email or Username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} icon={<User size={15} />} placeholder="you@example.com" required />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                icon={<Lock size={15} />}
                placeholder="Enter password"
                required
                rightElement={
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[#061C36]/44 transition hover:bg-[#061C36]/6 hover:text-[#061C36]">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="rounded-lg border border-dashed border-[#F95738]/42 bg-[#F95738]/6 p-4">
                <Input label="Coupon Code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} icon={<Tag size={15} />} placeholder="Enter coupon from email" required />
                <p className="mt-2 text-xs font-bold leading-5 text-[#F95738]">Use the coupon code sent to your email or shown after signup.</p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Log In'}
                <ArrowRight size={15} />
              </Button>
            </form>
          </Card>
          <div className="mt-6 grid gap-3">
            <div className="rounded-lg border border-[#061C36]/8 bg-white/80 p-4 shadow-[0_12px_28px_rgba(6,28,54,0.045)]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F95738]/10 text-[#F95738]">
                  <UserPlus size={17} />
                </span>
                <div>
                  <p className="text-sm font-black text-[#061C36]">New to CyberNurdin?</p>
                  <Link href="/signup" className="mt-1 inline-flex items-center gap-1 text-sm font-black text-[#F95738] hover:text-[#E64A2D]">
                    Create your learner account
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            <p className="rounded-lg border border-[#061C36]/8 bg-white/60 p-4 text-xs font-semibold leading-5 text-[#061C36]/58">
              Already applied? Use your email or username, password, and the coupon code from your signup email.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
