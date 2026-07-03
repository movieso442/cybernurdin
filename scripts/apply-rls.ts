import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');

  const sql = postgres(process.env.DATABASE_URL, { prepare: false });
  const rlsSql = readFileSync(join(process.cwd(), 'drizzle/rls.sql'), 'utf-8');

  console.log('Applying drizzle/rls.sql ...');
  await sql.unsafe(rlsSql);
  console.log('RLS policies applied successfully.');

  await sql.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to apply RLS policies:', error);
  process.exit(1);
});
