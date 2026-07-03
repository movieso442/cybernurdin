import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../drizzle/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. This module must only be imported on the server.');
}

// Supabase's transaction pool mode (port 6543) does not support prepared
// statements, so `prepare: false` is required here.
const client = postgres(process.env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
export { schema };
