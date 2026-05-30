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

export type UserStatus = 'pending' | 'approved' | 'suspended';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type AssignmentStatus = 'active' | 'completed' | 'paused';
export type LessonProgressState = 'locked' | 'unlocked' | 'in-progress' | 'completed';

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
  title: string;
  body: string;
  takeaway: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  youtubeVideoId: string;
  videoUrl: string;
  youtube: YouTubeLessonSource;
  notes: string[];
  resources: string[];
  slides: Slide[];
  quiz: Quiz;
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type MentorshipPath = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  mentorName: string;
  mentorTitle: string;
  iconName: string;
  youtubeChannelId: string;
  youtubeChannelUrl: string;
  youtubePlaylistId: string | null;
  youtubePlaylistUrl: string | null;
  youtubePlaylistStatus: 'pending' | 'active';
  youtubeIndexingMode: 'manual-episode-index';
  outcomes: string[];
  modules: Module[];
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

export type ApplicationRecord = ApplicationPayload & {
  id: string;
  status: ApplicationStatus;
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
  assignedAt: string;
  completedAt?: string;
};

export type LessonProgress = {
  state: LessonProgressState;
  videoCompleted: boolean;
  slidesCompleted: boolean;
  quizPassed: boolean;
  score?: number;
  updatedAt: string;
};

export type ProgressRecord = {
  id: string;
  userId: string;
  pathId: string;
  currentLessonId: string;
  completedPathIds: string[];
  lessons: Record<string, LessonProgress>;
  updatedAt: string;
};

export type Booking = {
  id: string;
  userId: string;
  pathId: string;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
};

export type QuizAttempt = {
  id: string;
  userId: string;
  pathId: string;
  lessonId: string;
  quizId: string;
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  createdAt: string;
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

const quiz = (id: string, prompt: string): Quiz => ({
  id,
  passingScore: 70,
  questions: [
    {
      id: `${id}-q1`,
      prompt,
      options: ['Confidentiality, integrity, availability', 'Capture, inject, automate', 'Compute, index, archive', 'Containment, isolation, attribution'],
      correctIndex: 0,
    },
    {
      id: `${id}-q2`,
      prompt: 'Why does CyberNurdin lock mentees to one active path at a time?',
      options: ['To keep learning guided and reviewed', 'To hide public pages', 'To remove quizzes', 'To self-unlock advanced paths'],
      correctIndex: 0,
    },
    {
      id: `${id}-q3`,
      prompt: 'Where should lesson videos be watched in this platform?',
      options: ['A self-hosted file server', 'YouTube embeds mapped to lesson records', 'Downloaded ZIP files', 'Offline-only storage'],
      correctIndex: 1,
    },
  ],
});

const slides = (prefix: string, focus: string): Slide[] => [
  {
    id: `${prefix}-s1`,
    title: 'Threat Context',
    body: `Understand the real-world risk behind ${focus} before touching tools or dashboards.`,
    takeaway: 'Defenders start with context, not random commands.',
  },
  {
    id: `${prefix}-s2`,
    title: 'Guided Workflow',
    body: 'Break the work into observe, investigate, validate, document, and improve.',
    takeaway: 'A repeatable workflow makes investigations faster and calmer.',
  },
  {
    id: `${prefix}-s3`,
    title: 'Mentor Review',
    body: 'Capture notes, screenshots, and decisions so a mentor can review your thinking.',
    takeaway: 'Progress is measured through evidence and clear reasoning.',
  },
];

const lesson = (
  id: string,
  slug: string,
  title: string,
  description: string,
  duration: string,
  youtubeVideoId: string,
  episodeIndex: number,
  focus: string,
): Lesson => ({
  id,
  slug,
  title,
  description,
  duration,
  youtubeVideoId,
  videoUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
  youtube: {
    provider: 'youtube',
    channelId: YOUTUBE_CHANNEL_ID,
    channelUrl: YOUTUBE_CHANNEL_URL,
    playlistId: null,
    playlistUrl: null,
    episodeIndex,
    videoId: youtubeVideoId,
    watchUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
    embedUrl: `https://www.youtube.com/embed/${youtubeVideoId}?modestbranding=1&rel=0`,
    indexingStatus: youtubeVideoId ? 'indexed' : 'needs-video',
  },
  notes: [
    `Map ${focus} to a realistic defender workflow.`,
    'Write down what you observed, what you verified, and what still needs mentor review.',
    'Do not skip slides or quizzes; they are part of your completion evidence.',
  ],
  resources: [
    'Mentor review checklist',
    'Incident notes template',
    'Lab reflection prompts',
  ],
  slides: slides(id, focus),
  quiz: quiz(`${id}-quiz`, `Which principle is foundational when assessing ${focus}?`),
});

const youtubePlaylistPlaceholder = () => ({
  youtubeChannelId: YOUTUBE_CHANNEL_ID,
  youtubeChannelUrl: YOUTUBE_CHANNEL_URL,
  youtubePlaylistId: null,
  youtubePlaylistUrl: null,
  youtubePlaylistStatus: 'pending' as const,
  youtubeIndexingMode: 'manual-episode-index' as const,
});

export const mentorshipPaths: MentorshipPath[] = [
  {
    id: 'path-intro',
    slug: 'introduction-to-cybersecurity',
    title: 'Introduction to Cybersecurity',
    description: 'Build a practical defender foundation across threats, systems, networks, risk, and responsible learning habits.',
    category: 'Foundation',
    level: 'Beginner',
    duration: '4 weeks',
    mentorName: 'Assigned Mentor',
    mentorTitle: 'Cybersecurity Foundation Coach',
    iconName: 'shield',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Explain core security principles', 'Read basic network and system signals', 'Prepare for a guided SOC or network path'],
    modules: [
      {
        id: 'intro-module-1',
        title: 'Security Foundations',
        summary: 'Core defender language, threat models, and safe learning habits.',
        lessons: [
          lesson('intro-lesson-1', 'what-is-cybersecurity', 'What is Cybersecurity?', 'Understand cybersecurity as the discipline of protecting people, systems, and data from real threats.', '18 min', channelVideoIds[0], 1, 'cybersecurity fundamentals'),
          lesson('intro-lesson-2', 'security-principles', 'Security Principles and Threat Landscape', 'Learn CIA, risk, attacker motivations, and the defender mindset used across every CyberNurdin path.', '22 min', channelVideoIds[1], 2, 'security principles'),
        ],
      },
      {
        id: 'intro-module-2',
        title: 'Defender Workflow',
        summary: 'How to observe, document, and communicate security findings.',
        lessons: [
          lesson('intro-lesson-3', 'defender-notes', 'Evidence, Notes, and Mentor Review', 'Turn scattered findings into clear notes a mentor can review and improve.', '16 min', channelVideoIds[2], 3, 'defender documentation'),
        ],
      },
    ],
  },
  {
    id: 'path-soc',
    slug: 'soc-analyst',
    title: 'SOC Analyst',
    description: 'Learn alert triage, log review, escalation, and practical incident handling inside a guided defensive workflow.',
    category: 'Blue Team',
    level: 'Intermediate',
    duration: '8 weeks',
    mentorName: 'Assigned SOC Mentor',
    mentorTitle: 'Detection and Response Mentor',
    iconName: 'eye',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Triage alerts with context', 'Interpret SIEM-style telemetry', 'Escalate incidents with clean evidence'],
    modules: [
      {
        id: 'soc-module-1',
        title: 'SOC Operations',
        summary: 'Daily workflows used by analysts to investigate alerts.',
        lessons: [
          lesson('soc-lesson-1', 'alert-triage', 'Alert Triage and Signal Quality', 'Separate noise from meaningful security signals using a repeatable analyst checklist.', '24 min', channelVideoIds[3], 1, 'alert triage'),
          lesson('soc-lesson-2', 'incident-escalation', 'Incident Escalation Notes', 'Write concise escalation notes that help senior responders move quickly.', '20 min', channelVideoIds[4], 2, 'incident escalation'),
        ],
      },
    ],
  },
  {
    id: 'path-network',
    slug: 'network-security',
    title: 'Network Security',
    description: 'Secure infrastructure through segmentation, packet awareness, firewall rules, and practical network hardening.',
    category: 'Infrastructure',
    level: 'Intermediate',
    duration: '7 weeks',
    mentorName: 'Assigned Network Mentor',
    mentorTitle: 'Network Defense Mentor',
    iconName: 'network',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Map common ports and services', 'Reason about segmentation', 'Review network exposure safely'],
    modules: [
      {
        id: 'network-module-1',
        title: 'Network Defense Basics',
        summary: 'Core concepts for understanding and reducing network attack surface.',
        lessons: [
          lesson('network-lesson-1', 'network-exposure', 'Network Exposure and Service Review', 'Learn how defenders reason about exposed services and safe network review.', '21 min', channelVideoIds[5], 1, 'network exposure'),
        ],
      },
    ],
  },
  {
    id: 'path-web',
    slug: 'web-security',
    title: 'Web Security',
    description: 'Study web application risk, OWASP-style issues, authentication mistakes, and secure review habits.',
    category: 'Application Security',
    level: 'Intermediate',
    duration: '6 weeks',
    mentorName: 'Assigned AppSec Mentor',
    mentorTitle: 'Web Security Mentor',
    iconName: 'code',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Identify common web risks', 'Review authentication flows', 'Write practical remediation notes'],
    modules: [
      {
        id: 'web-module-1',
        title: 'Application Risk Review',
        summary: 'How defenders identify, explain, and prioritize web risks.',
        lessons: [
          lesson('web-lesson-1', 'web-risk', 'Web Risk and Responsible Testing', 'Understand how to evaluate web risks without turning learning into unsafe behavior.', '19 min', channelVideoIds[0], 1, 'web application risk'),
        ],
      },
    ],
  },
  {
    id: 'path-cloud',
    slug: 'cloud-security',
    title: 'Cloud Security',
    description: 'Learn IAM, storage exposure, logging, and practical cloud guardrails with mentor-guided review.',
    category: 'Cloud Defense',
    level: 'Intermediate',
    duration: '6 weeks',
    mentorName: 'Assigned Cloud Mentor',
    mentorTitle: 'Cloud Security Mentor',
    iconName: 'cloud',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Explain IAM least privilege', 'Review common cloud exposure', 'Create cloud hardening notes'],
    modules: [
      {
        id: 'cloud-module-1',
        title: 'Cloud Guardrails',
        summary: 'IAM, logging, and configuration basics for practical cloud defense.',
        lessons: [
          lesson('cloud-lesson-1', 'cloud-guardrails', 'Cloud IAM and Guardrails', 'Learn how cloud defenders reason about identity, access, and evidence.', '23 min', channelVideoIds[1], 1, 'cloud guardrails'),
        ],
      },
    ],
  },
  {
    id: 'path-ir',
    slug: 'incident-response',
    title: 'Incident Response',
    description: 'Prepare, investigate, contain, and communicate during incidents with structured mentor review.',
    category: 'Response',
    level: 'Advanced',
    duration: '6 weeks',
    mentorName: 'Assigned IR Mentor',
    mentorTitle: 'Incident Response Mentor',
    iconName: 'siren',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Draft incident timelines', 'Choose containment actions', 'Communicate risk clearly'],
    modules: [
      {
        id: 'ir-module-1',
        title: 'Response Workflow',
        summary: 'Practical incident response from first signal to containment notes.',
        lessons: [
          lesson('ir-lesson-1', 'response-workflow', 'Incident Response Workflow', 'Learn the sequence of preparation, identification, containment, eradication, recovery, and review.', '25 min', channelVideoIds[2], 1, 'incident response workflow'),
        ],
      },
    ],
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

export function getAllLessons(path: MentorshipPath) {
  return path.modules.flatMap((module) => module.lessons.map((lessonItem) => ({ ...lessonItem, module })));
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
  return lessonItem ? { path, lesson: lessonItem, lessons } : null;
}

export function getInitialLessonId(path: MentorshipPath) {
  return getAllLessons(path)[0]?.id ?? '';
}

export function calculatePathProgress(path: MentorshipPath, progress?: ProgressRecord | null) {
  const lessons = getAllLessons(path);
  if (!lessons.length) return 0;
  const completed = lessons.filter(({ id }) => progress?.lessons?.[id]?.state === 'completed').length;
  return Math.round((completed / lessons.length) * 100);
}
