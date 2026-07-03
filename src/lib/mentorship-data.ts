import { db } from '@/lib/db';
import { courseProgress, enrollments } from '../../drizzle/schema';
import { getPathBySlug } from '@/lib/cybernurdin-data';

/**
 * Creates the enrollment row and one course_progress row per module (unit)
 * in the given path, unlocking only the first one — matching the existing
 * unlock rule (previous module must be approved before the next unlocks).
 * Server-only: imports the Drizzle `db` client.
 */
export async function enrollUserInPath(userId: string, pathSlug: string) {
  const path = getPathBySlug(pathSlug);
  if (!path) throw new Error(`Unknown mentorship path: ${pathSlug}`);

  await db
    .insert(enrollments)
    .values({
      userId,
      pathId: path.id,
      status: 'active',
      progress: 0,
      currentModuleId: path.units[0]?.id,
    })
    .onConflictDoNothing();

  for (const [index, unit] of path.units.entries()) {
    await db
      .insert(courseProgress)
      .values({
        userId,
        pathId: path.id,
        moduleId: unit.id,
        status: index === 0 ? 'unlocked' : 'locked',
      })
      .onConflictDoNothing();
  }
}
