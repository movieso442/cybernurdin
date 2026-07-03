import postgres from 'postgres';

const tables = [
  'profiles',
  'applications',
  'coupons',
  'enrollments',
  'submissions',
  'mentor_feedback',
  'course_progress',
];

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '(invalid email)';
  return `${name.slice(0, 2)}***@${domain}`;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set.');
  if (!process.env.SEED_ADMIN_EMAIL) throw new Error('SEED_ADMIN_EMAIL is not set.');
  if (!process.env.SEED_STUDENT_EMAIL) throw new Error('SEED_STUDENT_EMAIL is not set.');

  const sql = postgres(process.env.DATABASE_URL, { prepare: false });
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const studentEmail = process.env.SEED_STUDENT_EMAIL;

  const profiles = await sql.unsafe(
    'select email, role, access_status, selected_path from profiles where email in ($1,$2) order by role',
    [adminEmail, studentEmail],
  );

  const [seedCounts] = await sql.unsafe(
    `
      select
        (select count(*)::int from applications where email = $1) as applications,
        (select count(*)::int from coupons where email = $1) as coupons,
        (
          select count(*)::int
          from enrollments e
          join profiles p on p.id = e.user_id
          where p.email = $1
        ) as enrollments
    `,
    [studentEmail],
  );

  const rls = await sql.unsafe(
    `
      select
        c.relname as table_name,
        c.relrowsecurity as rls_enabled,
        count(p.policyname)::int as policy_count
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      left join pg_policies p
        on p.schemaname = n.nspname
       and p.tablename = c.relname
      where n.nspname = 'public'
        and c.relname = any($1::text[])
      group by c.relname, c.relrowsecurity
      order by c.relname
    `,
    [tables],
  );

  console.log('Live database verification');
  console.table(
    profiles.map((profile) => ({
      email: maskEmail(profile.email),
      role: profile.role,
      access_status: profile.access_status,
      selected_path: profile.selected_path || '',
    })),
  );
  console.log('Seed student row counts:', seedCounts);
  console.table(rls);

  await sql.end();
}

main().catch((error) => {
  console.error('Live verification failed:', error);
  process.exit(1);
});
