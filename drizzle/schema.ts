import {
  integer,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// Supabase manages the `auth.users` table. We only need a pointer to it so
// Drizzle can express the foreign key from `profiles.id` — we never create
// or migrate this table ourselves.
const authSchema = pgSchema('auth');
export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('mentee'),
  accessStatus: text('access_status').notNull().default('pending'),
  selectedPath: text('selected_path'),
  applicationId: uuid('application_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  selectedPath: text('selected_path').notNull().default('introduction-to-cybersecurity'),
  motivation: text('motivation'),
  status: text('status').notNull().default('pending'),
  reviewedBy: uuid('reviewed_by'),
  adminNote: text('admin_note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
});

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  codeHash: text('code_hash').notNull().unique(),
  email: text('email').notNull(),
  applicationId: uuid('application_id'),
  status: text('status').notNull().default('active'),
  role: text('role').notNull().default('mentee'),
  allowedPath: text('allowed_path').notNull().default('introduction-to-cybersecurity'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  redeemedAt: timestamp('redeemed_at', { withTimezone: true }),
  redeemedBy: uuid('redeemed_by'),
});

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    pathId: text('path_id').notNull(),
    status: text('status').notNull().default('active'),
    progress: integer('progress').notNull().default(0),
    currentModuleId: text('current_module_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('enrollments_user_path_idx').on(table.userId, table.pathId)],
);

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  pathId: text('path_id').notNull(),
  moduleId: text('module_id').notNull(),
  type: text('type').notNull(),
  textResponse: text('text_response'),
  fileUrl: text('file_url'),
  status: text('status').notNull().default('pending'),
  mentorFeedback: text('mentor_feedback'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewedBy: uuid('reviewed_by'),
});

export const mentorFeedback = pgTable('mentor_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'set null' }),
  message: text('message').notNull(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courseProgress = pgTable(
  'course_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    pathId: text('path_id').notNull(),
    moduleId: text('module_id').notNull(),
    status: text('status').notNull().default('locked'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('course_progress_user_path_module_idx').on(table.userId, table.pathId, table.moduleId)],
);
