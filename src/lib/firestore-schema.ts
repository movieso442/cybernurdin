export type FirestoreCollectionDefinition = {
  name: string;
  purpose: string;
  ownerFlow: 'public' | 'application' | 'mentee' | 'learning' | 'system';
};

export const firestoreSchemaVersion = '2026-05-30-cybernurdin-userflow-v1';

export const expectedFirestoreCollections: FirestoreCollectionDefinition[] = [
  {
    name: 'systemConfig',
    purpose: 'Project-level settings, schema version, YouTube channel source, and content indexing rules.',
    ownerFlow: 'system',
  },
  {
    name: 'users',
    purpose: 'Approved mentee profiles, status, active path, coupon code, and completed path history.',
    ownerFlow: 'mentee',
  },
  {
    name: 'applications',
    purpose: 'Public mentorship applications submitted for admin review.',
    ownerFlow: 'application',
  },
  {
    name: 'coupons',
    purpose: 'Coupon codes required for dashboard login and initial path assignment.',
    ownerFlow: 'mentee',
  },
  {
    name: 'mentorshipPaths',
    purpose: 'Cybersecurity mentorship path summaries and their YouTube playlist mapping.',
    ownerFlow: 'learning',
  },
  {
    name: 'pathAssignments',
    purpose: 'One active assigned path per approved mentee, plus completed or paused history.',
    ownerFlow: 'mentee',
  },
  {
    name: 'modules',
    purpose: 'Ordered modules belonging to a mentorship path.',
    ownerFlow: 'learning',
  },
  {
    name: 'lessons',
    purpose: 'Ordered lessons belonging to modules, including YouTube episode index references.',
    ownerFlow: 'learning',
  },
  {
    name: 'videos',
    purpose: 'YouTube-only video records mapped to lessons and path playlists.',
    ownerFlow: 'learning',
  },
  {
    name: 'slides',
    purpose: 'Structured slide content attached to lessons.',
    ownerFlow: 'learning',
  },
  {
    name: 'quizzes',
    purpose: 'Quiz definitions, passing score, and question ordering for each lesson.',
    ownerFlow: 'learning',
  },
  {
    name: 'questions',
    purpose: 'Multiple-choice quiz questions and answer keys.',
    ownerFlow: 'learning',
  },
  {
    name: 'quizAttempts',
    purpose: 'Saved mentee quiz submissions, scores, pass/fail state, and selected answers.',
    ownerFlow: 'mentee',
  },
  {
    name: 'progress',
    purpose: 'Mentee lesson progress, video completion, slides completion, quiz pass state, and current lesson.',
    ownerFlow: 'mentee',
  },
  {
    name: 'bookings',
    purpose: 'Mentor session bookings connected to a mentee and active path.',
    ownerFlow: 'mentee',
  },
  {
    name: 'notifications',
    purpose: 'Application, access, learning, and session notifications for mentees.',
    ownerFlow: 'mentee',
  },
];
