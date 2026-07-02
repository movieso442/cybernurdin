import {
  BadgeCheck,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Eye,
  FileSearch,
  Network,
  Shield,
  ShieldAlert,
  Siren,
  Users,
} from 'lucide-react';

export const YOUTUBE_CHANNEL_ID = 'UCR_9LH8ztK2gH6u-EOvI4bA';
export const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;

export const channelVideoIds = [
  'ytQ-OPwnkrA',
  'dy8rKQhk6C8',
  'Q97IqnzDPUk',
  'yHmTX93lGdg',
  'hxTcNXuDMl8',
  '9LvfSRal6J4',
];

const seedDate = '2026-06-05T00:00:00.000Z';

export type UserStatus = 'pending' | 'approved' | 'suspended';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type AssignmentStatus = 'active' | 'completed' | 'paused' | 'revoked';
export type LessonProgressState = 'locked' | 'unlocked' | 'in-progress' | 'completed';
export type UnlockRule = 'available' | 'previous-unit-complete' | 'previous-module-complete' | 'manual';
export type YouTubeIndexingStatus = 'needs-playlist' | 'needs-video' | 'indexed';

export type YouTubeLessonSource = {
  provider: 'youtube';
  channelId: string;
  channelUrl: string;
  playlistId: string | null;
  playlistUrl: string | null;
  episodeIndex: number;
  videoId: string;
  watchUrl: string;
  embedUrl: string;
  indexingStatus: YouTubeIndexingStatus;
};

export type Slide = {
  id: string;
  pathId: string;
  unitId: string;
  moduleId: string;
  lessonId: string;
  title: string;
  body: string;
  takeaway: string;
  slideUrl?: string;
  order: number;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  pathId: string;
  unitId: string;
  moduleId: string;
  lessonId?: string;
  title: string;
  passingScore: number;
  retakeAllowed: boolean;
  order: number;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  pathId: string;
  unitId: string;
  moduleId: string;
  slug: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  videoUrl: string;
  youtube: YouTubeLessonSource;
  slideUrl: string;
  notes: string[];
  resources: string[];
  slides: Slide[];
  quiz: Quiz;
  order: number;
  duration: string;
  estimatedDuration: string;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Module = {
  id: string;
  pathId: string;
  unitId: string;
  title: string;
  description: string;
  summary: string;
  order: number;
  unlockRule: UnlockRule;
  isPublished: boolean;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
};

export type PathUnit = {
  id: string;
  pathId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  estimatedDuration: string;
  unlockRule: UnlockRule;
  isPublished: boolean;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
};

export type MentorshipPath = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  estimatedDuration: string;
  mentorName: string;
  mentorTitle: string;
  iconName: string;
  order: number;
  isPublished: boolean;
  youtubeChannelId: string;
  youtubeChannelUrl: string;
  youtubePlaylistId: string | null;
  youtubePlaylistUrl: string | null;
  youtubePlaylistStatus: 'pending' | 'active';
  youtubeIndexingMode: 'manual-episode-index';
  outcomes: string[];
  units: PathUnit[];
  createdAt: string;
  updatedAt: string;
};

export type ApplicationPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  password?: string;
  experienceLevel: string;
  educationStatus: string;
  deviceAccess: string;
  priorTraining: string;
  portfolioUrl?: string;
  preferredPathId: string;
  motivation: string;
  careerGoal: string;
  weeklyHours: string;
  commitmentAccepted: boolean;
};

export type CouponEmailStatus = 'sent' | 'not-configured' | 'failed';

export type ApplicationRecord = Omit<ApplicationPayload, 'password'> & {
  id: string;
  status: ApplicationStatus;
  couponCode?: string;
  couponEmailStatus?: CouponEmailStatus;
  couponEmailMessage?: string;
  createdAt: string;
};

export type MenteeUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  status: UserStatus;
  activePathId: string;
  couponCode: string;
  completedPathIds: string[];
  createdAt: string;
};

export type PathAssignment = {
  id: string;
  userId: string;
  pathId: string;
  status: AssignmentStatus;
  assignedBy?: string;
  assignedAt: string;
  completedAt?: string;
  currentUnitId?: string;
  currentModuleId?: string;
  currentLessonId?: string;
  progressPercent?: number;
};

export type LessonProgress = {
  state: LessonProgressState;
  pathId: string;
  unitId: string;
  moduleId: string;
  lessonId: string;
  videoCompleted: boolean;
  slidesCompleted: boolean;
  quizPassed: boolean;
  lessonCompleted: boolean;
  moduleCompleted: boolean;
  unitCompleted: boolean;
  pathCompleted: boolean;
  progressPercent: number;
  score?: number;
  updatedAt: string;
};

export type UnitProgress = {
  unitId: string;
  state: LessonProgressState;
  progressPercent: number;
  completed: boolean;
};

export type ModuleProgress = {
  moduleId: string;
  unitId: string;
  state: LessonProgressState;
  progressPercent: number;
  completed: boolean;
};

export type ProgressRecord = {
  id: string;
  userId: string;
  pathId: string;
  currentUnitId: string;
  currentModuleId: string;
  currentLessonId: string;
  completedPathIds: string[];
  lessons: Record<string, LessonProgress>;
  modules: Record<string, ModuleProgress>;
  units: Record<string, UnitProgress>;
  progressPercent: number;
  pathCompleted: boolean;
  updatedAt: string;
};

export type Booking = {
  id: string;
  userId: string;
  menteeId?: string;
  mentorId?: string;
  pathId: string;
  title?: string;
  description?: string;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
  scheduledAt?: string;
  duration?: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  bbbMeetingId?: string;
  attendeeJoinUrl?: string;
  moderatorJoinUrl?: string;
  recordingUrl?: string;
  recordingPlaybackUrl?: string;
  createdAt: string;
  updatedAt?: string;
};

export type QuizAttempt = {
  id: string;
  userId: string;
  pathId: string;
  unitId?: string;
  moduleId?: string;
  lessonId: string;
  quizId: string;
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  createdAt: string;
};

export type LessonWithContext = Lesson & {
  path: MentorshipPath;
  unit: PathUnit;
  module: Module;
};

export type SubmissionStatus = 'pending' | 'under-review' | 'approved' | 'rejected';
export type EvidenceType = 'screenshot' | 'pdf' | 'certificate' | 'lab-notes' | 'reflection';

export type EvidenceSubmission = {
  id: string;
  userId: string;
  pathId: string;
  unitId: string;
  moduleId: string;
  lessonId: string;
  evidenceUrl: string;
  evidenceType: EvidenceType;
  notes: string;
  status: SubmissionStatus;
  mentorFeedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

export const iconRegistry = {
  shield: Shield,
  eye: Eye,
  network: Network,
  code: Code2,
  cloud: Cloud,
  siren: Siren,
  alert: ShieldAlert,
  users: Users,
  badge: BadgeCheck,
  briefcase: BriefcaseBusiness,
  book: BookOpenCheck,
  brain: Brain,
  search: FileSearch,
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const youtubePlaylistPlaceholder = () => ({
  youtubeChannelId: YOUTUBE_CHANNEL_ID,
  youtubeChannelUrl: YOUTUBE_CHANNEL_URL,
  youtubePlaylistId: null,
  youtubePlaylistUrl: null,
  youtubePlaylistStatus: 'pending' as const,
  youtubeIndexingMode: 'manual-episode-index' as const,
});

function makeSlides(pathId: string, unitId: string, moduleId: string, lessonId: string, focus: string): Slide[] {
  return [
    {
      id: `${lessonId}-slide-1`,
      pathId,
      unitId,
      moduleId,
      lessonId,
      title: 'Threat Context',
      body: `Understand the real-world risk behind ${focus} before touching tools or dashboards.`,
      takeaway: 'Defenders start with context, not random commands.',
      slideUrl: `/slides/${lessonId}-intro`,
      order: 1,
    },
    {
      id: `${lessonId}-slide-2`,
      pathId,
      unitId,
      moduleId,
      lessonId,
      title: 'Guided Workflow',
      body: 'Break the work into observe, investigate, validate, document, and improve.',
      takeaway: 'A repeatable workflow makes investigations faster and calmer.',
      slideUrl: `/slides/${lessonId}-workflow`,
      order: 2,
    },
    {
      id: `${lessonId}-slide-3`,
      pathId,
      unitId,
      moduleId,
      lessonId,
      title: 'Mentor Review',
      body: 'Capture notes, screenshots, and decisions so a mentor can review your thinking.',
      takeaway: 'Progress is measured through evidence and clear reasoning.',
      slideUrl: `/slides/${lessonId}-review`,
      order: 3,
    },
  ];
}

function makeQuiz(pathId: string, unitId: string, moduleId: string, lessonId: string, title: string, focus: string, order: number): Quiz {
  return {
    id: `${lessonId}-quiz`,
    pathId,
    unitId,
    moduleId,
    lessonId,
    title: `${title} Checkpoint`,
    passingScore: 70,
    retakeAllowed: true,
    order,
    createdAt: seedDate,
    updatedAt: seedDate,
    questions: [
      {
        id: `${lessonId}-q1`,
        prompt: `Which principle is foundational when assessing ${focus}?`,
        options: ['Confidentiality, integrity, availability', 'Capture, inject, automate', 'Compute, index, archive', 'Containment, isolation, attribution'],
        correctIndex: 0,
      },
      {
        id: `${lessonId}-q2`,
        prompt: 'Why does CyberNurdin keep one active mentorship path per mentee?',
        options: ['To keep learning guided and reviewed', 'To hide public pages', 'To remove quizzes', 'To self-unlock advanced paths'],
        correctIndex: 0,
      },
      {
        id: `${lessonId}-q3`,
        prompt: 'What should you capture for mentor review?',
        options: ['Clear notes and evidence', 'Only tool names', 'Random screenshots', 'Nothing until the final path'],
        correctIndex: 0,
      },
    ],
  };
}

function makeLesson(input: {
  pathId: string;
  unitId: string;
  moduleId: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  order: number;
  focus: string;
  estimatedDuration?: string;
}): Lesson {
  const id = `${input.moduleId}-lesson-${input.order}`;
  const estimatedDuration = input.estimatedDuration || '18 min';

  return {
    id,
    pathId: input.pathId,
    unitId: input.unitId,
    moduleId: input.moduleId,
    slug: slugify(input.title),
    title: input.title,
    description: input.description,
    youtubeVideoId: input.youtubeVideoId,
    videoUrl: `https://www.youtube.com/watch?v=${input.youtubeVideoId}`,
    youtube: {
      provider: 'youtube',
      channelId: YOUTUBE_CHANNEL_ID,
      channelUrl: YOUTUBE_CHANNEL_URL,
      playlistId: null,
      playlistUrl: null,
      episodeIndex: input.order,
      videoId: input.youtubeVideoId,
      watchUrl: `https://www.youtube.com/watch?v=${input.youtubeVideoId}`,
      embedUrl: `https://www.youtube.com/embed/${input.youtubeVideoId}?modestbranding=1&rel=0`,
      indexingStatus: input.youtubeVideoId ? 'indexed' : 'needs-video',
    },
    slideUrl: `/slides/${id}`,
    notes: [
      `Map ${input.focus} to a realistic defender workflow.`,
      'Write down what you observed, what you verified, and what still needs mentor review.',
      'Complete the video, slides, and quiz before moving forward.',
    ],
    resources: [
      'Mentor review checklist',
      'Incident notes template',
      'Lab reflection prompts',
    ],
    slides: makeSlides(input.pathId, input.unitId, input.moduleId, id, input.focus),
    quiz: makeQuiz(input.pathId, input.unitId, input.moduleId, id, input.title, input.focus, input.order),
    order: input.order,
    duration: estimatedDuration,
    estimatedDuration,
    isRequired: true,
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

function makeModule(input: {
  pathId: string;
  unitId: string;
  unitSlug: string;
  order: number;
  title: string;
  description: string;
  lessonTitle: string;
  lessonDescription: string;
  focus: string;
  youtubeVideoId: string;
}): Module {
  const id = `${input.unitSlug}-module-${input.order}`;
  return {
    id,
    pathId: input.pathId,
    unitId: input.unitId,
    title: input.title,
    description: input.description,
    summary: input.description,
    order: input.order,
    unlockRule: input.order === 1 ? 'available' : 'previous-module-complete',
    isPublished: true,
    lessons: [
      makeLesson({
        pathId: input.pathId,
        unitId: input.unitId,
        moduleId: id,
        title: input.lessonTitle,
        description: input.lessonDescription,
        youtubeVideoId: input.youtubeVideoId,
        order: 1,
        focus: input.focus,
      }),
    ],
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

function makeUnit(input: {
  pathId: string;
  order: number;
  title: string;
  description: string;
  estimatedDuration?: string;
  modules: Array<{
    title: string;
    description: string;
    lessonTitle: string;
    lessonDescription: string;
    focus: string;
    youtubeVideoId: string;
  }>;
}): PathUnit {
  const slug = slugify(input.title);
  const id = `${input.pathId}-${slug}`;
  return {
    id,
    pathId: input.pathId,
    title: input.title,
    slug,
    description: input.description,
    order: input.order,
    estimatedDuration: input.estimatedDuration || '1 week',
    unlockRule: input.order === 1 ? 'available' : 'previous-unit-complete',
    isPublished: true,
    modules: input.modules.map((moduleInput, index) => makeModule({
      pathId: input.pathId,
      unitId: id,
      unitSlug: slug,
      order: index + 1,
      ...moduleInput,
    })),
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

const introUnitSeeds = [
  ['Cybersecurity Basics', 'Core security language, CIA, risk, and how defenders think.', 'What is Cybersecurity?', 'Understand cybersecurity as the discipline of protecting people, systems, and data.', 'cybersecurity fundamentals'],
  ['Threats and Attacks', 'Common attacks, attacker motivations, and defensive context.', 'Common Cyber Threats', 'Recognize common threats without turning learning into unsafe behavior.', 'common cyber threats'],
  ['Network Security', 'Network fundamentals, firewalls, VPNs, and basic monitoring.', 'Understanding Firewalls', 'Learn why firewalls matter and how defenders reason about network boundaries.', 'network firewalls'],
  ['Web Security', 'Web application basics, OWASP-style risks, and safer web practices.', 'Web Application Basics', 'Understand web security risks through calm, responsible review habits.', 'web application basics'],
  ['Application Security', 'Secure development thinking, auth mistakes, and remediation notes.', 'Application Risk Review', 'Learn how to explain application risk and prioritize simple fixes.', 'application security risk'],
  ['IAM / Access Control', 'Authentication, authorization, MFA, and access policies.', 'Authentication and Authorization', 'Separate identity, permissions, and access decisions in real systems.', 'identity and access control'],
  ['Cloud Security Basics', 'IAM, storage exposure, logging, and cloud guardrails.', 'Cloud Guardrails', 'Learn cloud security basics through identity, logging, and exposure review.', 'cloud guardrails'],
  ['Incident Response Basics', 'Preparation, investigation, containment, and communication.', 'Incident Response Workflow', 'Learn the first responder flow from signal to review.', 'incident response basics'],
  ['Security Awareness', 'Human risk, phishing, passwords, and everyday security habits.', 'Security Awareness Foundations', 'Build practical awareness habits for safer teams and communities.', 'security awareness'],
  ['Cybersecurity Career Preparation', 'Portfolio evidence, interview readiness, and learning discipline.', 'Building Your Cybersecurity Path', 'Turn guided learning into clear proof of work and next steps.', 'cybersecurity career preparation'],
] as const;

function buildIntroUnits(pathId: string) {
  return introUnitSeeds.map(([title, description, lessonTitle, lessonDescription, focus], index) => makeUnit({
    pathId,
    order: index + 1,
    title,
    description,
    modules: [
      {
        title: `Module 1: ${lessonTitle}`,
        description,
        lessonTitle,
        lessonDescription,
        focus,
        youtubeVideoId: channelVideoIds[index % channelVideoIds.length],
      },
      {
        title: `Module 2: Guided Practice`,
        description: `Apply ${focus} with notes your mentor can review.`,
        lessonTitle: `${title} Guided Practice`,
        lessonDescription: `Practice ${focus} with a simple evidence-based workflow.`,
        focus,
        youtubeVideoId: channelVideoIds[(index + 1) % channelVideoIds.length],
      },
    ],
  }));
}

function singleUnitPath(pathId: string, title: string, description: string, focus: string, videoIndex: number) {
  return [
    makeUnit({
      pathId,
      order: 1,
      title,
      description,
      modules: [
        {
          title: `Module 1: ${title}`,
          description,
          lessonTitle: title,
          lessonDescription: description,
          focus,
          youtubeVideoId: channelVideoIds[videoIndex % channelVideoIds.length],
        },
      ],
    }),
  ];
}

export const mentorshipPaths: MentorshipPath[] = [
  {
    id: 'path-intro',
    slug: 'introduction-to-cybersecurity',
    title: 'Introduction to Cybersecurity',
    description: 'A broad beginner mentorship path made of focused cybersecurity units, from basics to career preparation.',
    category: 'Foundation',
    level: 'Beginner',
    duration: '10 weeks',
    estimatedDuration: '10 weeks',
    mentorName: 'Assigned Mentor',
    mentorTitle: 'Cybersecurity Foundation Coach',
    iconName: 'shield',
    order: 1,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Explain core security principles', 'Complete guided sub-courses inside one path', 'Prepare for SOC, network, web, or cloud specialization'],
    units: buildIntroUnits('path-intro'),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: 'path-soc',
    slug: 'soc-analyst',
    title: 'SOC Analyst',
    description: 'Learn alert triage, log review, escalation, and practical incident handling inside a guided defensive workflow.',
    category: 'Blue Team',
    level: 'Intermediate',
    duration: '8 weeks',
    estimatedDuration: '8 weeks',
    mentorName: 'Assigned SOC Mentor',
    mentorTitle: 'Detection and Response Mentor',
    iconName: 'eye',
    order: 2,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Triage alerts with context', 'Interpret SIEM-style telemetry', 'Escalate incidents with clean evidence'],
    units: singleUnitPath('path-soc', 'SOC Operations', 'Daily workflows used by analysts to investigate alerts.', 'SOC alert triage', 3),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: 'path-network',
    slug: 'network-security',
    title: 'Network Security',
    description: 'Secure infrastructure through segmentation, packet awareness, firewall rules, and practical network hardening.',
    category: 'Infrastructure',
    level: 'Intermediate',
    duration: '7 weeks',
    estimatedDuration: '7 weeks',
    mentorName: 'Assigned Network Mentor',
    mentorTitle: 'Network Defense Mentor',
    iconName: 'network',
    order: 3,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Map common ports and services', 'Reason about segmentation', 'Review network exposure safely'],
    units: singleUnitPath('path-network', 'Network Defense Basics', 'Core concepts for understanding and reducing network attack surface.', 'network exposure', 5),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: 'path-web',
    slug: 'web-security',
    title: 'Web Security',
    description: 'Study web application risk, OWASP-style issues, authentication mistakes, and secure review habits.',
    category: 'Application Security',
    level: 'Intermediate',
    duration: '6 weeks',
    estimatedDuration: '6 weeks',
    mentorName: 'Assigned AppSec Mentor',
    mentorTitle: 'Web Security Mentor',
    iconName: 'code',
    order: 4,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Identify common web risks', 'Review authentication flows', 'Write practical remediation notes'],
    units: singleUnitPath('path-web', 'Application Risk Review', 'How defenders identify, explain, and prioritize web risks.', 'web application risk', 0),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: 'path-cloud',
    slug: 'cloud-security',
    title: 'Cloud Security',
    description: 'Learn IAM, storage exposure, logging, and practical cloud guardrails with mentor-guided review.',
    category: 'Cloud Defense',
    level: 'Intermediate',
    duration: '6 weeks',
    estimatedDuration: '6 weeks',
    mentorName: 'Assigned Cloud Mentor',
    mentorTitle: 'Cloud Security Mentor',
    iconName: 'cloud',
    order: 5,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Explain IAM least privilege', 'Review common cloud exposure', 'Create cloud hardening notes'],
    units: singleUnitPath('path-cloud', 'Cloud Guardrails', 'IAM, logging, and configuration basics for practical cloud defense.', 'cloud guardrails', 1),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  {
    id: 'path-ir',
    slug: 'incident-response',
    title: 'Incident Response',
    description: 'Prepare, investigate, contain, and communicate during incidents with structured mentor review.',
    category: 'Response',
    level: 'Advanced',
    duration: '6 weeks',
    estimatedDuration: '6 weeks',
    mentorName: 'Assigned IR Mentor',
    mentorTitle: 'Incident Response Mentor',
    iconName: 'siren',
    order: 6,
    isPublished: true,
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Draft incident timelines', 'Choose containment actions', 'Communicate risk clearly'],
    units: singleUnitPath('path-ir', 'Response Workflow', 'Practical incident response from first signal to containment notes.', 'incident response workflow', 2),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
];

export const mentorshipPlans = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'New learners who need structure before choosing a specialization.',
    sessions: '2 mentor sessions / month',
    support: 'Community and email support',
    projectSupport: 'Starter lab review',
    price: 'Configured after review',
  },
  {
    id: 'pro',
    name: 'Pro',
    audience: 'Committed mentees building hands-on cybersecurity proof of work.',
    sessions: '4 mentor sessions / month',
    support: 'Priority mentor feedback',
    projectSupport: 'Project and notes review',
    price: 'Configured after review',
  },
  {
    id: 'premium',
    name: 'Premium',
    audience: 'Career-focused mentees preparing for interviews, portfolios, and deeper specialization.',
    sessions: 'Custom mentor cadence',
    support: 'High-touch support',
    projectSupport: 'Capstone guidance',
    price: 'Configured after review',
  },
];

export const defaultCoupons = [
  { code: 'CYBER-APPROVED-2026', pathId: 'path-intro', status: 'active' },
  { code: 'SOC-APPROVED-2026', pathId: 'path-soc', status: 'active' },
  { code: 'NETWORK-APPROVED-2026', pathId: 'path-network', status: 'active' },
];

export function getAllUnits(path: MentorshipPath) {
  return path.units;
}

export function getAllModules(path: MentorshipPath) {
  return path.units.flatMap((unit) => unit.modules.map((moduleItem) => ({ ...moduleItem, unit })));
}

export function getAllLessons(path: MentorshipPath): LessonWithContext[] {
  return path.units.flatMap((unit) =>
    unit.modules.flatMap((moduleItem) =>
      moduleItem.lessons.map((lessonItem) => ({
        ...lessonItem,
        path,
        unit,
        module: moduleItem,
      })),
    ),
  );
}

export function getPathBySlug(slug: string) {
  return mentorshipPaths.find((path) => path.slug === slug || path.id === slug);
}

export function getPathById(pathId: string) {
  return mentorshipPaths.find((path) => path.id === pathId);
}

export function getLesson(pathSlug: string, lessonId: string) {
  const path = getPathBySlug(pathSlug);
  if (!path) return null;
  const lessons = getAllLessons(path);
  const lessonItem = lessons.find((item) => item.id === lessonId || item.slug === lessonId);
  return lessonItem ? { path, unit: lessonItem.unit, module: lessonItem.module, lesson: lessonItem, lessons } : null;
}

export function getInitialLessonId(path: MentorshipPath) {
  return getAllLessons(path)[0]?.id ?? '';
}

export function getLessonContext(path: MentorshipPath, lessonId: string) {
  return getAllLessons(path).find((lessonItem) => lessonItem.id === lessonId || lessonItem.slug === lessonId) || null;
}

export function calculateUnitProgress(unit: PathUnit, progress?: ProgressRecord | null) {
  const lessons = unit.modules.flatMap((moduleItem) => moduleItem.lessons);
  if (!lessons.length) return 0;
  const completed = lessons.filter(({ id }) => progress?.lessons?.[id]?.lessonCompleted || progress?.lessons?.[id]?.state === 'completed').length;
  return Math.round((completed / lessons.length) * 100);
}

export function calculateModuleProgress(moduleItem: Module, progress?: ProgressRecord | null) {
  if (!moduleItem.lessons.length) return 0;
  const completed = moduleItem.lessons.filter(({ id }) => progress?.lessons?.[id]?.lessonCompleted || progress?.lessons?.[id]?.state === 'completed').length;
  return Math.round((completed / moduleItem.lessons.length) * 100);
}

export function calculatePathProgress(path: MentorshipPath, progress?: ProgressRecord | null) {
  const lessons = getAllLessons(path);
  if (!lessons.length) return 0;
  const completed = lessons.filter(({ id }) => progress?.lessons?.[id]?.lessonCompleted || progress?.lessons?.[id]?.state === 'completed').length;
  return Math.round((completed / lessons.length) * 100);
}

export function getCurrentLesson(path: MentorshipPath, progress?: ProgressRecord | null) {
  const lessons = getAllLessons(path);
  return lessons.find((item) => item.id === progress?.currentLessonId) ||
    lessons.find((item) => !(progress?.lessons?.[item.id]?.lessonCompleted || progress?.lessons?.[item.id]?.state === 'completed')) ||
    lessons[0];
}

export function getUnitState(path: MentorshipPath, unit: PathUnit, progress?: ProgressRecord | null): LessonProgressState {
  const unitProgress = calculateUnitProgress(unit, progress);
  if (unitProgress === 100) return 'completed';
  const currentLesson = getCurrentLesson(path, progress);
  if (currentLesson?.unitId === unit.id || unit.order === 1) return unitProgress > 0 ? 'in-progress' : 'unlocked';
  const previousUnit = path.units.find((item) => item.order === unit.order - 1);
  if (previousUnit && calculateUnitProgress(previousUnit, progress) === 100) return 'unlocked';
  return 'locked';
}
