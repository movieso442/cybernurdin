import { randomBytes } from 'crypto';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { applications, coupons, courseProgress, enrollments, profiles } from '../drizzle/schema';
import { createAdminClient } from '../src/lib/supabase/admin';
import { generateCouponCode, hashCoupon } from '../src/lib/coupon';
import { enrollUserInPath } from '../src/lib/mentorship-data';

function randomPassword() {
  return randomBytes(18).toString('base64url');
}

async function upsertAuthUser(email: string, password: string, fullName: string) {
  const admin = createAdminClient();

  const { data: existing, error: listError } = await admin.auth.admin.listUsers();
  if (listError) throw new Error(`Failed to list existing users: ${listError.message}`);
  const found = existing.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (found) {
    const { data, error } = await admin.auth.admin.updateUserById(found.id, {
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error || !data.user) throw new Error(`Failed to update auth user ${email}: ${error?.message}`);
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) throw new Error(`Failed to create auth user ${email}: ${error?.message}`);
  return data.user;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cybernurdin.com';
  const fullName = process.env.SEED_ADMIN_FULL_NAME || 'CyberNurdin Admin';
  const providedPassword = process.env.SEED_ADMIN_PASSWORD;
  const password = providedPassword || randomPassword();

  const authUser = await upsertAuthUser(email, password, fullName);

  await db
    .insert(profiles)
    .values({
      id: authUser.id,
      fullName,
      email,
      role: 'admin',
      accessStatus: 'active',
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { role: 'admin', accessStatus: 'active', fullName, email },
    });

  return { email, password: providedPassword ? null : password };
}

async function upsertSeedApplication(email: string, fullName: string, pathId: string, pathAliases: string[]) {
  const existingApplications = await db
    .select()
    .from(applications)
    .where(and(eq(applications.email, email), inArray(applications.selectedPath, pathAliases)))
    .orderBy(desc(applications.createdAt))
    .limit(10);

  const [existingApplication, ...duplicateApplications] = existingApplications;
  if (existingApplication) {
    const [application] = await db
      .update(applications)
      .set({
        fullName,
        selectedPath: pathId,
        status: 'approved',
        reviewedAt: existingApplication.reviewedAt ?? new Date(),
      })
      .where(eq(applications.id, existingApplication.id))
      .returning();

    for (const duplicate of duplicateApplications) {
      await db.delete(coupons).where(eq(coupons.applicationId, duplicate.id));
      await db.delete(applications).where(eq(applications.id, duplicate.id));
    }

    return application;
  }

  const [application] = await db
    .insert(applications)
    .values({
      fullName,
      email,
      selectedPath: pathId,
      motivation: 'Seed data for local development and testing.',
      status: 'approved',
      reviewedAt: new Date(),
    })
    .returning();

  return application;
}

async function ensureRedeemedSeedCoupon(email: string, applicationId: string, pathId: string, userId: string, pathAliases: string[]) {
  const existingCoupons = await db
    .select({ id: coupons.id })
    .from(coupons)
    .where(
      and(
        eq(coupons.email, email),
        inArray(coupons.allowedPath, pathAliases),
        eq(coupons.status, 'redeemed'),
        eq(coupons.redeemedBy, userId),
      ),
    )
    .limit(10);

  const [existingCoupon, ...duplicateCoupons] = existingCoupons;
  if (existingCoupon) {
    await db
      .update(coupons)
      .set({ applicationId, allowedPath: pathId })
      .where(eq(coupons.id, existingCoupon.id));

    for (const duplicate of duplicateCoupons) {
      await db.delete(coupons).where(eq(coupons.id, duplicate.id));
    }

    return;
  }

  const plainCoupon = generateCouponCode();
  await db.insert(coupons).values({
    codeHash: hashCoupon(plainCoupon),
    email,
    applicationId,
    status: 'redeemed',
    role: 'mentee',
    allowedPath: pathId,
    redeemedAt: new Date(),
    redeemedBy: userId,
  });
}

async function removeLegacySeedEnrollments(userId: string, legacyPathIds: string[]) {
  if (!legacyPathIds.length) return;

  await db.delete(courseProgress).where(and(eq(courseProgress.userId, userId), inArray(courseProgress.pathId, legacyPathIds)));
  await db.delete(enrollments).where(and(eq(enrollments.userId, userId), inArray(enrollments.pathId, legacyPathIds)));
}

async function seedStudent() {
  const email = process.env.SEED_STUDENT_EMAIL || 'student@cybernurdin.com';
  const fullName = process.env.SEED_STUDENT_FULL_NAME || 'CyberNurdin Test Student';
  const providedPassword = process.env.SEED_STUDENT_PASSWORD;
  const password = providedPassword || randomPassword();
  const pathId = 'path-intro';
  const pathAliases = [pathId, 'introduction-to-cybersecurity'];
  const legacyPathIds = pathAliases.filter((alias) => alias !== pathId);

  const authUser = await upsertAuthUser(email, password, fullName);
  const application = await upsertSeedApplication(email, fullName, pathId, pathAliases);

  await db
    .insert(profiles)
    .values({
      id: authUser.id,
      fullName,
      email,
      role: 'mentee',
      accessStatus: 'active',
      selectedPath: pathId,
      applicationId: application.id,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { role: 'mentee', accessStatus: 'active', selectedPath: pathId, applicationId: application.id, fullName, email },
    });

  await enrollUserInPath(authUser.id, pathId);
  await ensureRedeemedSeedCoupon(email, application.id, pathId, authUser.id, pathAliases);
  await removeLegacySeedEnrollments(authUser.id, legacyPathIds);

  return { email, password: providedPassword ? null : password };
}

async function main() {
  console.log('Seeding CyberNurdin admin and test student accounts...\n');

  const admin = await seedAdmin();
  const student = await seedStudent();

  console.log('=================================================');
  console.log(' CyberNurdin seed complete');
  console.log('=================================================');
  console.log(' Admin login:');
  console.log(`   email:    ${admin.email}`);
  console.log(`   password: ${admin.password ?? '(from SEED_ADMIN_PASSWORD env var)'}`);
  console.log('');
  console.log(' Test student login:');
  console.log(`   email:    ${student.email}`);
  console.log(`   password: ${student.password ?? '(from SEED_STUDENT_PASSWORD env var)'}`);
  console.log('=================================================');
  if (admin.password || student.password) {
    console.log(' Generated passwords are shown ONCE above and were not saved anywhere.');
    console.log(' Set SEED_ADMIN_PASSWORD / SEED_STUDENT_PASSWORD in .env.local to pin them next time.');
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
