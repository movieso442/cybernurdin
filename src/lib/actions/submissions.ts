'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courseProgress, enrollments, mentorFeedback, submissions } from '../../../drizzle/schema';
import { getAuthedProfile, requireAdminProfile } from '@/lib/auth/session';
import { getPathBySlug } from '@/lib/cybernurdin-data';

export type CreateSubmissionInput = {
  pathId: string;
  moduleId: string;
  type: string;
  textResponse?: string;
  fileUrl?: string;
};

export async function createSubmission(input: CreateSubmissionInput) {
  const profile = await getAuthedProfile();
  if (!profile) throw new Error('Not authenticated.');

  await db.insert(submissions).values({
    userId: profile.id,
    pathId: input.pathId,
    moduleId: input.moduleId,
    type: input.type,
    textResponse: input.textResponse || null,
    fileUrl: input.fileUrl || null,
    status: 'pending',
  });

  await db
    .update(courseProgress)
    .set({ status: 'in-progress', updatedAt: new Date() })
    .where(
      and(
        eq(courseProgress.userId, profile.id),
        eq(courseProgress.pathId, input.pathId),
        eq(courseProgress.moduleId, input.moduleId),
        eq(courseProgress.status, 'unlocked'),
      ),
    );

  return { ok: true as const };
}

export async function reviewSubmission(submissionId: string, decision: 'approved' | 'rejected' | 'under-review', feedback?: string) {
  const admin = await requireAdminProfile();

  const [submission] = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1);
  if (!submission) throw new Error('Submission not found.');

  await db
    .update(submissions)
    .set({
      status: decision,
      mentorFeedback: feedback || null,
      reviewedAt: new Date(),
      reviewedBy: admin.id,
    })
    .where(eq(submissions.id, submissionId));

  if (feedback) {
    await db.insert(mentorFeedback).values({
      userId: submission.userId,
      submissionId: submission.id,
      message: feedback,
      createdBy: admin.id,
    });
  }

  if (decision === 'approved') {
    await unlockNextModule(submission.userId, submission.pathId, submission.moduleId, admin.id);
  }

  return { ok: true as const };
}

/** Marks the given module approved/completed and unlocks the next module in the path. */
async function unlockNextModule(userId: string, pathId: string, moduleId: string, approvedBy: string) {
  const now = new Date();

  await db
    .update(courseProgress)
    .set({ status: 'completed', completedAt: now, approvedAt: now, updatedAt: now })
    .where(and(eq(courseProgress.userId, userId), eq(courseProgress.pathId, pathId), eq(courseProgress.moduleId, moduleId)));

  const path = getPathBySlug(pathId);
  if (!path) return;

  const currentIndex = path.units.findIndex((unit) => unit.id === moduleId);
  const nextUnit = currentIndex >= 0 ? path.units[currentIndex + 1] : undefined;

  if (nextUnit) {
    await db
      .update(courseProgress)
      .set({ status: 'unlocked', updatedAt: now })
      .where(and(eq(courseProgress.userId, userId), eq(courseProgress.pathId, pathId), eq(courseProgress.moduleId, nextUnit.id)));
  }

  const completedCount = currentIndex + 1;
  const progressPercent = Math.round((completedCount / path.units.length) * 100);

  await db
    .update(enrollments)
    .set({
      progress: progressPercent,
      currentModuleId: nextUnit?.id ?? moduleId,
      status: progressPercent === 100 ? 'completed' : 'active',
      updatedAt: now,
    })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.pathId, pathId)));

  void approvedBy; // reserved for an audit log later
}

/** Manual override: an admin can unlock a module directly without an approval. */
export async function manuallyUnlockModule(userId: string, pathId: string, moduleId: string) {
  await requireAdminProfile();

  await db
    .update(courseProgress)
    .set({ status: 'unlocked', updatedAt: new Date() })
    .where(and(eq(courseProgress.userId, userId), eq(courseProgress.pathId, pathId), eq(courseProgress.moduleId, moduleId)));

  return { ok: true as const };
}

export async function listSubmissionsForReview() {
  await requireAdminProfile();
  return db.select().from(submissions).orderBy(submissions.submittedAt);
}
