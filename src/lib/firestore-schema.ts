export type FirestoreCollectionDefinition = {
  name: string;
  purpose: string;
  ownerFlow: 'application' | 'mentee' | 'learning' | 'sessions' | 'system';
};

export const firestoreSchemaVersion = '2026-06-05-cybernurdin-path-units-bbb-v1';

export const expectedFirestoreCollections: FirestoreCollectionDefinition[] = [
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
    purpose: 'Cybersecurity mentorship path summaries and ordered path unit references.',
    ownerFlow: 'learning',
  },
  {
    name: 'pathUnits',
    purpose: 'Sub-courses inside a mentorship path, with unlock rules and module ordering.',
    ownerFlow: 'learning',
  },
  {
    name: 'pathAssignments',
    purpose: 'One active assigned path per approved mentee, plus completed or paused history.',
    ownerFlow: 'mentee',
  },
  {
    name: 'modules',
    purpose: 'Ordered modules belonging to a path unit inside one mentorship path.',
    ownerFlow: 'learning',
  },
  {
    name: 'lessons',
    purpose: 'Ordered lessons belonging to modules, including unit, YouTube video, slide, notes, and quiz references.',
    ownerFlow: 'learning',
  },
  {
    name: 'videos',
    purpose: 'YouTube video metadata and indexing status attached to lessons.',
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
    purpose: 'Mentee path, unit, module, lesson, video, slides, quiz, and current next-step progress.',
    ownerFlow: 'mentee',
  },
  {
    name: 'sessions',
    purpose: 'BigBlueButton mentorship sessions, office hours, join metadata, status, and schedule details.',
    ownerFlow: 'sessions',
  },
  {
    name: 'recordings',
    purpose: 'BigBlueButton recording metadata and playback URLs surfaced inside CyberNurdin.',
    ownerFlow: 'sessions',
  },
  {
    name: 'notifications',
    purpose: 'Application, access, learning, and session notifications for mentees.',
    ownerFlow: 'mentee',
  },
  {
    name: 'submissions',
    purpose: 'Mentee evidence submissions per lesson: screenshots, PDFs, certificates, reflections. Includes mentor review status and feedback.',
    ownerFlow: 'mentee',
  },
];
