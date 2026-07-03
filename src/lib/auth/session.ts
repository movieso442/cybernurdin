import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { profiles } from '../../../drizzle/schema';
import { createClient } from '@/lib/supabase/server';

export type AuthedProfile = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accessStatus: string;
  selectedPath: string | null;
  applicationId: string | null;
};

/**
 * Reads the current Supabase session (server-side, cookie-based) and the
 * caller's own `profiles` row. Returns null if there is no signed-in user or
 * no matching profile — callers decide how to redirect. This is the only
 * source of truth used for route protection; nothing here trusts the client.
 */
export async function getAuthedProfile(): Promise<AuthedProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
  if (!profile) return null;

  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    role: profile.role,
    accessStatus: profile.accessStatus,
    selectedPath: profile.selectedPath,
    applicationId: profile.applicationId,
  };
}

/** Throws unless the current session belongs to an admin. Used by Server Actions. */
export async function requireAdminProfile(): Promise<AuthedProfile> {
  const profile = await getAuthedProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Not authorized.');
  }
  return profile;
}
