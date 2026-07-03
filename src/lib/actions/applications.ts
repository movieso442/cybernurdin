'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { applications, coupons } from '../../../drizzle/schema';
import { requireAdminProfile } from '@/lib/auth/session';
import { generateCouponCode, hashCoupon } from '@/lib/coupon';
import { sendCouponEmail } from '@/lib/email';

export type SubmitApplicationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredPathId: string;
  motivation: string;
};

export async function submitApplication(input: SubmitApplicationInput) {
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  if (!fullName || !input.email.trim()) {
    return { ok: false as const, error: 'Name and email are required.' };
  }

  await db.insert(applications).values({
    fullName,
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    selectedPath: input.preferredPathId || 'introduction-to-cybersecurity',
    motivation: input.motivation?.trim() || null,
    status: 'pending',
  });

  return { ok: true as const };
}

export async function approveApplication(applicationId: string) {
  const admin = await requireAdminProfile();

  const [application] = await db.select().from(applications).where(eq(applications.id, applicationId)).limit(1);
  if (!application) throw new Error('Application not found.');

  const plainCoupon = generateCouponCode();

  await db.insert(coupons).values({
    codeHash: hashCoupon(plainCoupon),
    email: application.email,
    applicationId: application.id,
    status: 'active',
    role: 'mentee',
    allowedPath: application.selectedPath,
  });

  await db
    .update(applications)
    .set({ status: 'approved', reviewedBy: admin.id, reviewedAt: new Date() })
    .where(eq(applications.id, applicationId));

  const emailResult = await sendCouponEmail(application.email, plainCoupon);

  return { ok: true as const, couponCode: plainCoupon, emailSent: emailResult.sent };
}

export async function rejectApplication(applicationId: string, adminNote?: string) {
  const admin = await requireAdminProfile();

  await db
    .update(applications)
    .set({ status: 'rejected', reviewedBy: admin.id, reviewedAt: new Date(), adminNote: adminNote || null })
    .where(eq(applications.id, applicationId));

  return { ok: true as const };
}

export async function listApplications() {
  await requireAdminProfile();
  return db.select().from(applications).orderBy(applications.createdAt);
}
