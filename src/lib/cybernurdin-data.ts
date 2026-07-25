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

export const socialLinks = [
  { label: 'f', name: 'Facebook', href: 'https://facebook.com/cybernurdin' },
  { label: 'x', name: 'X (Twitter)', href: 'https://x.com/cybernurdin' },
  { label: 'in', name: 'LinkedIn', href: 'https://linkedin.com/company/cybernurdin' },
  { label: 'yt', name: 'YouTube', href: YOUTUBE_CHANNEL_URL },
  { label: 'ig', name: 'Instagram', href: 'https://instagram.com/cybernurdin' },
];

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
  availability: 'available' | 'coming-soon';
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

export type GuidedCertificationPathway = {
  id: string;
  provider: string;
  title: string;
  description: string;
  officialUrl: string;
  officialUrlLabel: string;
  enrollSteps: string[];
  submitBackInstructions: string;
  affiliationNote: string;
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

type IntroSlideDef = { title: string; body: string; takeaway: string };
type IntroQuestionDef = { prompt: string; options: string[]; correctIndex: number };

type IntroModuleDef = {
  unitTitle: string;
  unitDescription: string;
  lessonTitle: string;
  lessonDescription: string;
  estimatedDuration: string;
  slides: IntroSlideDef[];
  notes: string[];
  resources: string[];
  questions: IntroQuestionDef[];
};

const introModuleDefs: IntroModuleDef[] = [
  {
    unitTitle: 'Module 1: What Cybersecurity Means',
    unitDescription: 'The meaning of cybersecurity, why it matters, what it protects, and the mindset defenders use every day.',
    lessonTitle: 'What Cybersecurity Means',
    lessonDescription: 'Build a working definition of cybersecurity, understand why it matters, and learn the CIA triad that underlies almost every security decision.',
    estimatedDuration: '20 min',
    slides: [
      { title: 'Welcome to Introduction to Cybersecurity', body: "This mentorship path is your foundation. You'll learn how defenders think, what they protect, and how to turn knowledge into evidence your mentor can review.", takeaway: 'Guided, mentor-reviewed learning — not a random video course.' },
      { title: 'What Cybersecurity Protects', body: 'Cybersecurity protects people, devices, accounts, networks, and the data that flows between them — at home, at school, and at work.', takeaway: 'If it can be accessed, it can be attacked — and it needs a defender.' },
      { title: 'The CIA Triad', body: 'Confidentiality keeps data private, Integrity keeps data accurate and untampered, Availability keeps systems usable when needed. Nearly every security decision balances these three.', takeaway: 'CIA is the lens defenders use to judge any security decision.' },
    ],
    notes: ['Meaning of cybersecurity', 'Why cybersecurity matters', 'What cybersecurity protects', 'The basic security mindset', 'Confidentiality, integrity, and availability (CIA)'],
    resources: ['https://www.cisa.gov/topics/cybersecurity-best-practices', 'https://www.nist.gov/cyberframework', 'https://www.enisa.europa.eu/topics/cyber-threats'],
    questions: [
      { prompt: "What does the 'C' in the CIA triad stand for?", options: ['Confidentiality', 'Cloud', 'Compliance', 'Containment'], correctIndex: 0 },
      { prompt: 'Which of these best describes cybersecurity?', options: ['Protecting people, systems, and data from unauthorized access and harm', 'Writing code faster', 'Blocking all internet access', 'Only installing antivirus software'], correctIndex: 0 },
      { prompt: 'Availability in the CIA triad means:', options: ['Systems and data are accessible to authorized users when needed', 'Data is encrypted at rest', 'Only admins can log in', 'Backups are deleted after 30 days'], correctIndex: 0 },
    ],
  },
  {
    unitTitle: 'Module 2: Common Cyber Threats',
    unitDescription: 'Malware, phishing, social engineering, ransomware, and the everyday threats beginners must learn to recognize.',
    lessonTitle: 'Common Cyber Threats',
    lessonDescription: 'Recognize malware, phishing, social engineering, ransomware, password attacks, insider threats, unsafe Wi-Fi, and data leakage.',
    estimatedDuration: '25 min',
    slides: [
      { title: 'Common Threats', body: 'Malware, phishing, ransomware, password attacks, insider threats, unsafe Wi-Fi, and data leakage are the everyday threats beginners must recognize first.', takeaway: "You don't need to be an expert to spot most common threats." },
      { title: 'Phishing and Social Engineering', body: 'Attackers often target people, not systems — using urgency, fake authority, or trust to trick you into clicking, paying, or sharing credentials.', takeaway: 'When something feels urgent or too good to be true, slow down and verify.' },
      { title: 'Malware and Ransomware', body: 'Malware is malicious software that can spy, steal, or damage. Ransomware encrypts your files and demands payment — backups and caution are your best defense.', takeaway: 'Prevention and backups matter more than any single tool.' },
    ],
    notes: ['Malware', 'Phishing', 'Social engineering', 'Ransomware', 'Password attacks', 'Insider threats', 'Unsafe Wi-Fi', 'Data leakage'],
    resources: ['https://www.cisa.gov/topics/cyber-threats-and-advisories', 'https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/phishing', 'https://owasp.org/www-community/attacks/'],
    questions: [
      { prompt: 'Which attack relies on tricking a person rather than exploiting a technical flaw?', options: ['Social engineering', 'Buffer overflow', 'SQL injection', 'DNS poisoning'], correctIndex: 0 },
      { prompt: 'Ransomware is best described as:', options: ['Malware that encrypts data and demands payment for its release', 'A type of firewall', 'A password manager', 'A network monitoring tool'], correctIndex: 0 },
      { prompt: 'Which of the following is a sign of a phishing email?', options: ['Urgent language pushing you to click a link immediately', 'A message from a known colleague with no links', 'An email with correct spelling and grammar', 'A newsletter you subscribed to'], correctIndex: 0 },
    ],
  },
  {
    unitTitle: 'Module 3: Basic Protection Principles',
    unitDescription: 'Strong passwords, MFA, updates, backups, and everyday habits that prevent most common attacks.',
    lessonTitle: 'Basic Protection Principles',
    lessonDescription: 'Apply strong passwords, MFA, software updates, backups, safe browsing, email safety, device security, and privacy basics.',
    estimatedDuration: '22 min',
    slides: [
      { title: 'Passwords and MFA', body: 'Strong, unique passwords plus multi-factor authentication (MFA) are the single most effective everyday defense against account takeover.', takeaway: 'MFA turns a stolen password into a dead end for attackers.' },
      { title: 'Safe Browsing and Email Habits', body: 'Verify links before clicking, check sender addresses carefully, and avoid entering credentials on unfamiliar sites.', takeaway: 'Pause before you click — it is the cheapest security control you have.' },
      { title: 'Backups and Updates', body: 'Regular backups and prompt software updates close known gaps before attackers can use them.', takeaway: 'Updates fix what attackers already know how to exploit.' },
    ],
    notes: ['Strong passwords', 'Multi-factor authentication (MFA)', 'Software updates', 'Backups', 'Safe browsing', 'Email safety', 'Device security', 'Privacy basics'],
    resources: ['https://www.cisa.gov/secure-our-world', 'https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/passwords', 'https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/basics'],
    questions: [
      { prompt: 'Multi-factor authentication (MFA) improves security by:', options: ['Requiring a second proof of identity beyond a password', 'Making passwords shorter', 'Removing the need for updates', 'Disabling backups'], correctIndex: 0 },
      { prompt: 'Which habit reduces risk from unsafe Wi-Fi?', options: ['Using a VPN or trusted network for sensitive tasks', 'Saving passwords in the browser', 'Turning off updates', 'Sharing your password with the network owner'], correctIndex: 0 },
      { prompt: 'Backups mainly protect against:', options: ['Data loss from ransomware, device failure, or accidental deletion', 'Weak Wi-Fi signal', 'Slow internet speed', 'Phishing emails'], correctIndex: 0 },
    ],
  },
  {
    unitTitle: 'Module 4: Cybersecurity Careers and Learning Paths',
    unitDescription: 'How SOC analyst, network, cloud, application security, ethical hacking, forensics, GRC, and awareness roles connect to this foundation.',
    lessonTitle: 'Cybersecurity Careers and Learning Paths',
    lessonDescription: 'Explore common cybersecurity career directions and how CyberNurdin guides you toward official certification pathways next.',
    estimatedDuration: '15 min',
    slides: [
      { title: 'Cybersecurity Careers', body: 'SOC analyst, network security, cloud security, application security, ethical hacking, digital forensics, GRC, and security awareness are common entry points — each builds on the same foundation you are learning now.', takeaway: 'Your next step should match your interests, not just what is popular.' },
      { title: 'Where CyberNurdin Can Take You Next', body: 'CyberNurdin guides you toward official certification platforms like Google Cybersecurity, Fortinet, and Cisco NetAcad — with mentor review connecting your external progress back to your CyberNurdin path.', takeaway: 'Official platforms plus mentor accountability beats learning alone.' },
    ],
    notes: ['SOC analyst', 'Network security', 'Cloud security', 'Application security', 'Ethical hacking', 'Digital forensics', 'GRC (Governance, Risk, and Compliance)', 'Security awareness'],
    resources: ['https://www.cisa.gov/careers', 'https://niccs.cisa.gov/workforce-development/nice-framework', 'https://grow.google/certificates/cybersecurity/'],
    questions: [
      { prompt: 'A SOC analyst primarily focuses on:', options: ['Monitoring, triaging, and escalating security alerts', 'Writing marketing content', 'Managing HR records', 'Designing product logos'], correctIndex: 0 },
      { prompt: 'GRC in cybersecurity careers stands for:', options: ['Governance, Risk, and Compliance', 'General Response Center', 'Global Router Configuration', 'Guided Recovery Cycle'], correctIndex: 0 },
      { prompt: 'Which path focuses on protecting cloud-hosted infrastructure and data?', options: ['Cloud security', 'Digital forensics', 'Application security', 'Security awareness'], correctIndex: 0 },
    ],
  },
  {
    unitTitle: 'Module 5: Practical Beginner Checklist',
    unitDescription: 'Turn what you learned into concrete, evidence-backed actions your mentor can review.',
    lessonTitle: 'Practical Beginner Checklist',
    lessonDescription: 'Enable MFA on one account, review your password hygiene, identify phishing signs, and build your own personal security checklist.',
    estimatedDuration: '20 min',
    slides: [
      { title: 'Your First Practical Checklist', body: 'Enable MFA on one real account, review your password hygiene, and learn to spot phishing signs — small, concrete actions build real security habits.', takeaway: 'Practical action beats passive reading every time.' },
      { title: 'Turning Knowledge Into Habits', body: 'Write your own personal security checklist and reflect on what you changed. This is the evidence your mentor will review before you continue.', takeaway: 'What you can show is what counts toward your progress.' },
    ],
    notes: ['Enable MFA on one account', 'Review your password hygiene', 'Identify phishing signs', 'Create a personal security checklist', 'Write a short reflection'],
    resources: ['https://www.cisa.gov/secure-our-world', 'https://www.ftc.gov/business-guidance/small-businesses/cybersecurity'],
    questions: [
      { prompt: 'Which action best demonstrates applying MFA in practice?', options: ['Enabling MFA on a real personal account and recording it as evidence', 'Reading about MFA only', 'Disabling MFA to test it', 'Sharing your MFA codes with a friend'], correctIndex: 0 },
      { prompt: 'A personal security checklist is useful because:', options: ['It turns knowledge into repeatable, practical habits', 'It replaces the need for passwords', 'It is only useful for professionals', 'It removes the need for mentor review'], correctIndex: 0 },
      { prompt: 'Identifying phishing signs helps you:', options: ['Avoid clicking malicious links or sharing sensitive data', 'Speed up your internet connection', 'Bypass MFA requirements', 'Automatically back up your files'], correctIndex: 0 },
    ],
  },
  {
    unitTitle: 'Module 6: Final Reflection and Next Step',
    unitDescription: 'Submit your reflection, choose your next path, and request mentor review to unlock what comes next.',
    lessonTitle: 'Final Reflection and Next Step',
    lessonDescription: 'Submit a short report on what you learned, choose the path you want to pursue next, and request mentor review.',
    estimatedDuration: '15 min',
    slides: [
      { title: 'Final Reflection and Next Step', body: 'Submit a short report on what you learned, choose the path you want to pursue next, and request mentor review to unlock your next step.', takeaway: 'This reflection closes the loop between learning and mentor-guided progress.' },
    ],
    notes: ['Submit a short report or reflection', 'Choose your intended future path', 'Request mentor review or next path access'],
    resources: [YOUTUBE_CHANNEL_URL, 'https://www.cisa.gov/be-cyber-smart'],
    questions: [
      { prompt: 'What should your final reflection for this path include?', options: ['What you learned, what you struggled with, and your next step', 'Only a list of tool names', "A copy of someone else's report", 'Nothing — reflections are optional'], correctIndex: 0 },
      { prompt: 'After completing Introduction to Cybersecurity, a mentee should:', options: ['Submit a reflection and request mentor review for the next path', 'Immediately unlock every advanced path automatically', 'Skip evidence submission', 'Stop learning'], correctIndex: 0 },
      { prompt: "CyberNurdin's guided certification pathways help you:", options: ['Follow official platforms like Google Cybersecurity or Cisco NetAcad with mentor-reviewed accountability', 'Copy paid course content directly', 'Avoid using official resources', 'Skip the mentorship review process'], correctIndex: 0 },
    ],
  },
];

function buildIntroUnits(pathId: string): PathUnit[] {
  return introModuleDefs.map((def, index) => {
    const unitSlug = slugify(def.unitTitle);
    const unitId = `${pathId}-${unitSlug}`;
    const moduleId = `${unitId}-module-1`;
    const lessonId = `${moduleId}-lesson-1`;
    const youtubeVideoId = channelVideoIds[index % channelVideoIds.length];

    const slides: Slide[] = def.slides.map((slide, slideIndex) => ({
      id: `${lessonId}-slide-${slideIndex + 1}`,
      pathId,
      unitId,
      moduleId,
      lessonId,
      title: slide.title,
      body: slide.body,
      takeaway: slide.takeaway,
      slideUrl: `/slides/${lessonId}-${slideIndex + 1}`,
      order: slideIndex + 1,
    }));

    const quiz: Quiz = {
      id: `${lessonId}-quiz`,
      pathId,
      unitId,
      moduleId,
      lessonId,
      title: `${def.lessonTitle} Checkpoint`,
      passingScore: 70,
      retakeAllowed: true,
      order: index + 1,
      createdAt: seedDate,
      updatedAt: seedDate,
      questions: def.questions.map((question, questionIndex) => ({
        id: `${lessonId}-q${questionIndex + 1}`,
        prompt: question.prompt,
        options: question.options,
        correctIndex: question.correctIndex,
      })),
    };

    const lesson: Lesson = {
      id: lessonId,
      pathId,
      unitId,
      moduleId,
      slug: slugify(def.lessonTitle),
      title: def.lessonTitle,
      description: def.lessonDescription,
      youtubeVideoId,
      videoUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
      youtube: {
        provider: 'youtube',
        channelId: YOUTUBE_CHANNEL_ID,
        channelUrl: YOUTUBE_CHANNEL_URL,
        playlistId: null,
        playlistUrl: null,
        episodeIndex: index + 1,
        videoId: youtubeVideoId,
        watchUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        embedUrl: `https://www.youtube.com/embed/${youtubeVideoId}?modestbranding=1&rel=0`,
        indexingStatus: 'indexed',
      },
      slideUrl: `/slides/${lessonId}`,
      notes: def.notes,
      resources: def.resources,
      slides,
      quiz,
      order: 1,
      duration: def.estimatedDuration,
      estimatedDuration: def.estimatedDuration,
      isRequired: true,
      createdAt: seedDate,
      updatedAt: seedDate,
    };

    const moduleItem: Module = {
      id: moduleId,
      pathId,
      unitId,
      title: def.unitTitle,
      description: def.lessonDescription,
      summary: def.lessonDescription,
      order: 1,
      unlockRule: index === 0 ? 'available' : 'previous-module-complete',
      isPublished: true,
      lessons: [lesson],
      createdAt: seedDate,
      updatedAt: seedDate,
    };

    const unit: PathUnit = {
      id: unitId,
      pathId,
      title: def.unitTitle,
      slug: unitSlug,
      description: def.unitDescription,
      order: index + 1,
      estimatedDuration: def.estimatedDuration,
      unlockRule: index === 0 ? 'available' : 'previous-unit-complete',
      isPublished: true,
      modules: [moduleItem],
      createdAt: seedDate,
      updatedAt: seedDate,
    };

    return unit;
  });
}

type ComingSoonPathDef = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: MentorshipPath['level'];
  iconName: string;
  outcomes: string[];
};

const comingSoonPathDefs: ComingSoonPathDef[] = [
  {
    id: 'path-soc',
    slug: 'soc-analyst-beginner',
    title: 'SOC Analyst Beginner Path',
    description: 'Learn alert triage, log review, escalation, and practical incident handling inside a guided defensive workflow.',
    category: 'Blue Team',
    level: 'Intermediate',
    iconName: 'eye',
    outcomes: ['Triage alerts with context', 'Interpret SIEM-style telemetry', 'Escalate incidents with clean evidence'],
  },
  {
    id: 'path-google-cybersecurity',
    slug: 'google-cybersecurity-guided-track',
    title: 'Google Cybersecurity Certificate Guided Track',
    description: 'A mentor-guided companion track that walks you through the official Google Cybersecurity Certificate with structured check-ins and evidence review.',
    category: 'Guided Certification',
    level: 'Beginner',
    iconName: 'badge',
    outcomes: ['Follow the official Google Cybersecurity Certificate with structure', 'Submit proof of progress for mentor review', 'Turn certificate work into portfolio evidence'],
  },
  {
    id: 'path-fortinet',
    slug: 'fortinet-fcf-fca-guided-track',
    title: 'Fortinet FCF/FCA Guided Track',
    description: 'A mentor-guided companion track for the official Fortinet Certified Fundamentals (FCF) and Associate (FCA) learning paths.',
    category: 'Guided Certification',
    level: 'Beginner',
    iconName: 'network',
    outcomes: ['Navigate the Fortinet Training Institute confidently', 'Complete official FCF/FCA modules with structure', 'Submit certificates for CyberNurdin evaluation'],
  },
  {
    id: 'path-netacad',
    slug: 'cisco-netacad-guided-track',
    title: 'Cisco NetAcad Guided Track',
    description: 'A mentor-guided companion track for Cisco Networking Academy cybersecurity courses, from enrollment to completion.',
    category: 'Guided Certification',
    level: 'Beginner',
    iconName: 'network',
    outcomes: ['Enroll in Cisco NetAcad with clear guidance', 'Complete official coursework on schedule', 'Return with evidence for mentor review'],
  },
  {
    id: 'path-web',
    slug: 'web-security-beginner',
    title: 'Web Security Beginner Path',
    description: 'Study web application risk, OWASP-style issues, authentication mistakes, and secure review habits.',
    category: 'Application Security',
    level: 'Intermediate',
    iconName: 'code',
    outcomes: ['Identify common web risks', 'Review authentication flows', 'Write practical remediation notes'],
  },
  {
    id: 'path-python',
    slug: 'python-for-cybersecurity',
    title: 'Python for Cybersecurity',
    description: 'Learn practical Python scripting for security tasks like log parsing, automation, and lightweight tooling.',
    category: 'Tooling',
    level: 'Beginner',
    iconName: 'code',
    outcomes: ['Write scripts to parse and summarize logs', 'Automate repetitive security checks', 'Build small, mentor-reviewed security tools'],
  },
  {
    id: 'path-network',
    slug: 'network-security-basics',
    title: 'Network Security Basics',
    description: 'Secure infrastructure through segmentation, packet awareness, firewall rules, and practical network hardening.',
    category: 'Infrastructure',
    level: 'Intermediate',
    iconName: 'network',
    outcomes: ['Map common ports and services', 'Reason about segmentation', 'Review network exposure safely'],
  },
  {
    id: 'path-cloud',
    slug: 'cloud-security-fundamentals',
    title: 'Cloud Security Fundamentals',
    description: 'Learn IAM, storage exposure, logging, and practical cloud guardrails with mentor-guided review.',
    category: 'Cloud Defense',
    level: 'Intermediate',
    iconName: 'cloud',
    outcomes: ['Explain IAM least privilege', 'Review common cloud exposure', 'Create cloud hardening notes'],
  },
  {
    id: 'path-iam',
    slug: 'identity-and-access-management-basics',
    title: 'Identity and Access Management Basics',
    description: 'Understand authentication, authorization, least privilege, and access review practices used by real teams.',
    category: 'Identity',
    level: 'Beginner',
    iconName: 'users',
    outcomes: ['Separate authentication from authorization', 'Apply least-privilege thinking', 'Review access requests with a security mindset'],
  },
];

function buildComingSoonPath(def: ComingSoonPathDef, order: number): MentorshipPath {
  return {
    id: def.id,
    slug: def.slug,
    title: def.title,
    description: def.description,
    category: def.category,
    level: def.level,
    duration: 'Coming soon',
    estimatedDuration: 'Coming soon',
    mentorName: 'Assigned Mentor',
    mentorTitle: 'CyberNurdin Mentor',
    iconName: def.iconName,
    order,
    isPublished: true,
    availability: 'coming-soon',
    ...youtubePlaylistPlaceholder(),
    outcomes: def.outcomes,
    units: [],
    createdAt: seedDate,
    updatedAt: seedDate,
  };
}

export const mentorshipPaths: MentorshipPath[] = [
  {
    id: 'path-intro',
    slug: 'introduction-to-cybersecurity',
    title: 'Introduction to Cybersecurity',
    description: 'A mentor-guided beginner foundation: what cybersecurity means, common threats, basic protection, career paths, a practical checklist, and a final reflection.',
    category: 'Foundation',
    level: 'Beginner',
    duration: '6 modules',
    estimatedDuration: '6 modules',
    mentorName: 'Assigned Mentor',
    mentorTitle: 'Cybersecurity Foundation Coach',
    iconName: 'shield',
    order: 1,
    isPublished: true,
    availability: 'available',
    ...youtubePlaylistPlaceholder(),
    outcomes: ['Explain core security principles using the CIA triad', 'Recognize common threats and apply basic protections', 'Complete a practical checklist and submit mentor-reviewed evidence'],
    units: buildIntroUnits('path-intro'),
    createdAt: seedDate,
    updatedAt: seedDate,
  },
  ...comingSoonPathDefs.map((def, index) => buildComingSoonPath(def, index + 2)),
];

export const guidedCertificationPathways: GuidedCertificationPathway[] = [
  {
    id: 'cert-google-cybersecurity',
    provider: 'Google',
    title: 'Google Cybersecurity Certificate Guide',
    description: 'CyberNurdin guides learners to the official Google Cybersecurity Certificate on Coursera, then reviews your progress and understanding.',
    officialUrl: 'https://grow.google/certificates/cybersecurity/',
    officialUrlLabel: 'grow.google/certificates/cybersecurity',
    enrollSteps: [
      'Visit the official Google Cybersecurity Certificate page and enroll or start a free trial.',
      'Work through the official modules at your own pace, following CyberNurdin session reminders.',
      'Return to CyberNurdin and submit your certificate or progress screenshot as evidence.',
      'Submit a short report on what you learned for mentor review.',
    ],
    submitBackInstructions: 'Upload your certificate or progress screenshot plus a short written reflection through the Submissions page.',
    affiliationNote: 'CyberNurdin is not officially affiliated with Google. This is independent mentorship guidance toward a publicly available certificate.',
  },
  {
    id: 'cert-fortinet',
    provider: 'Fortinet',
    title: 'Fortinet FCF/FCA Guide',
    description: 'CyberNurdin walks you through signing in to the Fortinet Training Institute and completing the Fortinet Certified Fundamentals (FCF) and Associate (FCA) tracks.',
    officialUrl: 'https://www.fortinet.com/training/cybersecurity-free-training',
    officialUrlLabel: 'fortinet.com/training',
    enrollSteps: [
      'Create a free account on the Fortinet Training Institute.',
      'Enroll in the FCF (Fundamentals) track first, then FCA (Associate) once ready.',
      'Complete official lessons and any included assessments.',
      'Return to CyberNurdin with your certificate for mentor evaluation.',
    ],
    submitBackInstructions: 'Upload your Fortinet certificate PDF or badge link plus a short reflection through the Submissions page.',
    affiliationNote: 'CyberNurdin is not officially affiliated with Fortinet. This is independent mentorship guidance toward publicly available training.',
  },
  {
    id: 'cert-netacad',
    provider: 'Cisco',
    title: 'Cisco NetAcad Cybersecurity Guide',
    description: 'CyberNurdin guides learners through enrolling in Cisco Networking Academy (NetAcad) cybersecurity courses and reviews your completion evidence.',
    officialUrl: 'https://www.netacad.com/courses/cybersecurity',
    officialUrlLabel: 'netacad.com/courses/cybersecurity',
    enrollSteps: [
      'Create a Cisco Networking Academy (NetAcad) account, or join through a partner institution if available.',
      'Enroll in an introductory cybersecurity course such as Introduction to Cybersecurity.',
      'Complete the official course modules and any assessments.',
      'Return to CyberNurdin and submit your NetAcad completion certificate for review.',
    ],
    submitBackInstructions: 'Upload your NetAcad certificate plus a short reflection through the Submissions page.',
    affiliationNote: 'CyberNurdin is not officially affiliated with Cisco. This is independent mentorship guidance toward publicly available NetAcad courses.',
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
  { code: 'CYBER-MENTEE-2026', pathId: 'path-intro', status: 'active' },
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
  return mentorshipPaths.find((path) => path.id === pathId || path.slug === pathId);
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
