'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { applications, coupons, courseProgress, enrollments, profiles } from '../../../drizzle/schema';
import { generateCouponCode, hashCoupon } from '@/lib/coupon';
import { sendCouponEmail } from '@/lib/email';
import { requireAdminProfile } from '@/lib/auth/session';
import { getPathBySlug } from '@/lib/cybernurdin-data';

const DEFAULT_PATH_ID = 'path-intro';

export type IssueAccessCouponInput = {
  email: string;
  fullName?: string;
  pathId?: string;
};

export async function issueAccessCoupon(input: IssueAccessCouponInput) {
  const admin = await requireAdminProfile();
  const email = input.email.trim().toLowerCase();
  const pathId = input.pathId || DEFAULT_PATH_ID;
  const path = getPathBySlug(pathId);

  if (!email || !email.includes('@')) throw new Error('Enter a valid mentee email.');
  if (!path) throw new Error('Select a valid mentorship path.');

  const fullName = input.fullName?.trim() || email.split('@')[0] || 'CyberNurdin Mentee';
  const [application] = await db
    .insert(applications)
    .values({
      fullName,
      email,
      selectedPath: path.id,
      motivation: 'Manual access coupon issued by an admin.',
      status: 'approved',
      reviewedBy: admin.id,
      reviewedAt: new Date(),
    })
    .returning();

  const plainCoupon = generateCouponCode();
  await db.insert(coupons).values({
    codeHash: hashCoupon(plainCoupon),
    email,
    applicationId: application.id,
    status: 'active',
    role: 'mentee',
    allowedPath: path.id,
  });

  const emailResult = await sendCouponEmail(email, plainCoupon);
  return { ok: true as const, couponCode: plainCoupon, emailSent: emailResult.sent, email, pathTitle: path.title };
}

export async function assignMenteePath(userId: string, pathId: string) {
  await requireAdminProfile();
  const path = getPathBySlug(pathId);
  if (!path) throw new Error('Select a valid mentorship path.');

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  if (!profile || profile.role !== 'mentee') throw new Error('Mentee profile not found.');

  const now = new Date();

  await db
    .update(profiles)
    .set({
      selectedPath: path.id,
      accessStatus: 'active',
      updatedAt: now,
    })
    .where(eq(profiles.id, userId));

  await db
    .update(enrollments)
    .set({ status: 'paused', updatedAt: now })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.status, 'active')));

  await db
    .insert(enrollments)
    .values({
      userId,
      pathId: path.id,
      status: 'active',
      progress: 0,
      currentModuleId: path.units[0]?.id,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [enrollments.userId, enrollments.pathId],
      set: {
        status: 'active',
        currentModuleId: path.units[0]?.id,
        updatedAt: now,
      },
    });

  for (const [index, unit] of path.units.entries()) {
    await db
      .insert(courseProgress)
      .values({
        userId,
        pathId: path.id,
        moduleId: unit.id,
        status: index === 0 ? 'unlocked' : 'locked',
        updatedAt: now,
      })
      .onConflictDoNothing();
  }

  return { ok: true as const, pathTitle: path.title };
}
