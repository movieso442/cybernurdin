'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coupons, profiles } from '../../../drizzle/schema';
import { createAdminClient } from '@/lib/supabase/admin';
import { hashCoupon } from '@/lib/coupon';
import { enrollUserInPath } from '@/lib/mentorship-data';

export type ActivateAccessInput = {
  email: string;
  couponCode: string;
  password: string;
  fullName: string;
};

const GENERIC_ERROR = 'That email and activation code combination is not valid. Double-check both and try again.';

export async function activateAccess(input: ActivateAccessInput) {
  const email = input.email.trim().toLowerCase();
  const couponCode = input.couponCode.trim();
  const fullName = input.fullName.trim();

  if (!email || !couponCode || !input.password || !fullName) {
    return { ok: false as const, error: 'All fields are required.' };
  }
  if (input.password.length < 8) {
    return { ok: false as const, error: 'Password must be at least 8 characters.' };
  }

  const codeHash = hashCoupon(couponCode);
  const [coupon] = await db.select().from(coupons).where(eq(coupons.codeHash, codeHash)).limit(1);

  if (!coupon) return { ok: false as const, error: GENERIC_ERROR };
  if (coupon.status !== 'active') return { ok: false as const, error: GENERIC_ERROR };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) return { ok: false as const, error: GENERIC_ERROR };
  if (coupon.email.toLowerCase() !== email) return { ok: false as const, error: GENERIC_ERROR };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    const alreadyRegistered = error?.message?.toLowerCase().includes('already');
    return {
      ok: false as const,
      error: alreadyRegistered
        ? 'An account with this email already exists. Try logging in instead.'
        : 'Could not create your account. Please try again.',
    };
  }

  try {
    await db.insert(profiles).values({
      id: data.user.id,
      fullName,
      email,
      role: coupon.role,
      accessStatus: 'active',
      selectedPath: coupon.allowedPath,
      applicationId: coupon.applicationId,
    });

    await enrollUserInPath(data.user.id, coupon.allowedPath);

    await db
      .update(coupons)
      .set({ status: 'redeemed', redeemedAt: new Date(), redeemedBy: data.user.id })
      .where(eq(coupons.id, coupon.id));
  } catch (dbError) {
    // Roll back the auth user so we don't leave an orphaned account with no profile.
    await admin.auth.admin.deleteUser(data.user.id).catch(() => {});
    console.error('[activateAccess] rolled back after DB error', dbError);
    return { ok: false as const, error: 'Something went wrong activating your account. Please try again.' };
  }

  return { ok: true as const };
}
