'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Shield, Tag, User } from 'lucide-react';
import { Button, Input } from '@/components/UI';
import { useApp } from '@/context/AppContext';
import { BrandLockup } from '@/components/public/PublicChrome';

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
              <Shield size={82} />
            </div>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-semibold text-white/68">
            <span className="flex items-center gap-2"><KeyRound size={15} className="text-[#F95738]" />Coupon-based access after approval</span>
            <span className="flex items-center gap-2"><Lock size={15} className="text-[#F95738]" />One active assigned path at a time</span>
            <span className="flex items-center gap-2"><Shield size={15} className="text-[#F95738]" />Your data is protected with secure authentication.</span>
          </div>
        </div>
      </aside>
      <section className="flex flex-1 items-center justify-center p-5 md:p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-black">Sign in to CyberNurdin</h2>
          <p className="mt-2 text-sm font-semibold text-[#061C36]/60">Access your assigned path and continue your learning journey.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <Input label="Email or Username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} icon={<User size={15} />} placeholder="you@example.com" required />
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} icon={<Lock size={15} />} placeholder="Enter password" required />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-8 grid h-8 w-8 place-items-center rounded-lg text-[#061C36]/44 hover:bg-[#061C36]/6">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="rounded-2xl border border-dashed border-[#F95738]/42 bg-[#F95738]/6 p-4">
              <Input label="Coupon Code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} icon={<Tag size={15} />} placeholder="Use the coupon sent after approval" required />
              <p className="mt-2 text-xs font-bold leading-5 text-[#F95738]">Use the coupon sent after approval. Coupon is required.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Log In'}
              <ArrowRight size={15} />
            </Button>
          </form>
          <div className="mt-6 rounded-2xl border border-[#061C36]/8 bg-white/70 p-4 text-xs font-semibold leading-5 text-[#061C36]/58">
            Need access? <Link className="font-black text-[#F95738]" href="/apply">Apply first</Link>. Approved users receive coupon codes externally.
          </div>
        </div>
      </section>
    </main>
  );
}
