# CyberNurdin

CyberNurdin is a premium cybersecurity mentorship platform. Learners follow guided, mentor-reviewed paths — starting with **Introduction to Cybersecurity** — built from original CyberNurdin slides and guides, curated official resources (CISA, NIST, OWASP, Google, Fortinet, Cisco NetAcad), practical checklists, and evidence-backed report submissions reviewed by a mentor before the next module unlocks.

## Tech stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- **Auth & data:** Supabase Auth (real, cookie-based sessions via `@supabase/ssr`) + Supabase Postgres, accessed server-side through Drizzle ORM. Row Level Security is enabled on every table (see "Data & auth model" below). No auth/access state is ever stored in `localStorage`.
- **Icons/animation:** lucide-react, framer-motion

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (also type-checks the app) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run db:generate` | Generate a Drizzle migration from `drizzle/schema.ts` |
| `npm run db:push` | Push the current schema straight to the database (no migration files) |
| `npm run db:studio` | Open Drizzle Studio against your database |
| `npm run db:rls` | Apply `drizzle/rls.sql` (Row Level Security policies) — no `psql` required |
| `npm run seed` | Create the seed admin + test student accounts (see below) |
| `npm run verify:live` | Check the live Supabase seed profiles, row counts, and RLS status without printing secrets |
| `npm run generate-coupon -- <email> [path-slug]` | Manually issue a coupon outside the admin UI |

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — Supabase Postgres connection string (server-only, never exposed to the browser). Use the **transaction pooler** URL (port 6543) — the app connects with `prepare: false` to match.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — safe to expose to the browser; used by the Supabase client for auth and RLS-protected reads.
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, bypasses Row Level Security. Only imported from `src/lib/supabase/admin.ts`, used in Server Actions and scripts. Never import it from a Client Component.
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_FULL_NAME` and `SEED_STUDENT_*` — used by `npm run seed`. Leave passwords blank to have strong ones generated and printed once. Quote passwords that contain `#`, otherwise env parsers treat the rest of the line as a comment.
- `EMAIL_PROVIDER_API_KEY` / `FROM_EMAIL` — optional. Without these, approving an application still generates a coupon; the admin UI shows it once so it can be copied manually.
- `NEXT_PUBLIC_SITE_URL` — the production URL (e.g. `https://cybernurdin.com`), used to resolve SEO metadata, sitemap, and Open Graph image URLs. **Set this explicitly before deploying** — do not rely on the local-dev fallback in production.
- `BBB_SERVER_URL` / `BBB_SECRET` — optional, future-only. BigBlueButton live sessions are not part of this deployment; the Sessions pages use a plain external meeting link instead.

`.env.local` is gitignored and must never be committed. No secrets are bundled into client code beyond `NEXT_PUBLIC_*` variables, which is the Next.js convention for values safe to expose to the browser.

## Data & auth model

Real Supabase Auth (cookie-based sessions via `@supabase/ssr`, refreshed in `middleware.ts`). Application data lives in Supabase Postgres, defined in `drizzle/schema.ts` and accessed server-side through Drizzle (`src/lib/db.ts`).

- **Route protection is server-side**, not client-side: `src/app/dashboard/layout.tsx` and `src/app/admin/layout.tsx` are Server Components that check the real session and the caller's `profiles.role`/`access_status` (via `src/lib/auth/session.ts`) before rendering anything. There is no client-only auth gate anywhere in the app.
- **Row Level Security is enabled on every table** (`drizzle/rls.sql`) as a second, independent layer of protection for any data read directly by the browser (e.g. a mentee's own profile/progress/submissions). Server Actions use Drizzle directly (a privileged Postgres connection) and enforce authorization in code — see the `requireAdminProfile()` checks in `src/lib/actions/*`.
- **Coupons** are never stored in plain text — only a SHA-256 hash (`src/lib/coupon.ts`). Activation (`src/lib/actions/activate.ts`) validates the coupon server-side, creates the Supabase Auth user via the service-role admin API, and only then creates the `profiles`/`enrollments` rows and marks the coupon redeemed.
- **No `localStorage` is used for auth, roles, coupon access, admin access, dashboard protection, or mentorship unlocking.** Session/booking scheduling (a non-auth feature) is intentionally kept as ephemeral in-memory UI state for this deployment rather than persisted anywhere.
- Apply `drizzle/rls.sql` once against your Supabase project after running `npm run db:push` — either paste it into the Supabase SQL editor, run `psql "$DATABASE_URL" -f drizzle/rls.sql`, or run `npm run db:rls` (uses the same `postgres` driver already installed, no `psql` required).

## Deployment (Hostinger Node.js)

This is a standard Next.js app — no static export, no custom server required.

- **Root directory:** repository root (`package.json` lives here)
- **Node version:** 22.x (pinned via `engines` in `package.json`)
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Start command:** `npm run start`

Set the environment variables above in the Hostinger panel before building. No BigBlueButton, Docker, or WebRTC server setup is required — none of that is part of this deployment.

## Scope of this deployment

Only **Introduction to Cybersecurity** is fully available end-to-end (slides, quiz, checklist, evidence submission, mentor review). Other mentorship paths are visible on `/courses` and `/paths/[slug]` as upcoming tracks, including three "Guided Certification Pathways" (Google Cybersecurity, Fortinet FCF/FCA, Cisco NetAcad) where CyberNurdin guides learners to official third-party platforms and reviews their returned evidence — CyberNurdin is not officially affiliated with those providers.
