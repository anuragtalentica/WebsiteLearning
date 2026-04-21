export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  expiration: string;
}

// ── Certifications ──
export interface Certification {
  id: number;
  vendor: string;
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  difficulty?: string;
}

export interface CertificationDetail extends Certification {
  topics: Topic[];
}

export interface Topic {
  id: number;
  name: string;
  orderIndex: number;
  questionCount: number;
}

// ── Questions ──
export interface Question {
  id: number;
  questionText: string;
  difficultyLevel: number;
  options: Option[];
}

export interface Option {
  id: number;
  optionText: string;
  orderIndex: number;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctOptionId: number;
  explanation?: string;
}

// ── Modules & Lessons ──
export interface Module {
  id: number;
  certificationId: number;
  title: string;
  orderIndex: number;
  lessonCount: number;
}

export interface ModuleDetail extends Module {
  lessons: LessonSummary[];
}

export interface LessonSummary {
  id: number;
  moduleId: number;
  title: string;
  orderIndex: number;
}

export interface LessonDetail extends LessonSummary {
  content: string;
  codeExample?: string;
  codeLanguage?: string;
  externalLinks?: string; // JSON string
  questionCount: number;
}

export interface ExternalLink {
  title: string;
  url: string;
}

// ── Mock Tests & Exams ──
export interface MockTest {
  id: number;
  title: string;
  description?: string;
  type: 'mock' | 'exam';
  certificationId?: number;
  certificationName?: string;
  durationMinutes: number;
  negativeMarking: boolean;
  passingScore: number;
  questionCount: number;
}

export interface MockTestDetail extends MockTest {
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: number;
  questionId: number;
  orderIndex: number;
  questionText: string;
  options: Option[];
}

export interface SubmitTest {
  mockTestId: number;
  timeTakenSeconds: number;
  answers: Record<number, number>; // questionId -> selectedOptionId
}

export interface TestResult {
  attemptId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTakenSeconds: number;
  passed: boolean;
  passingScore: number;
}

export interface TestAttempt {
  id: number;
  mockTestId: number;
  testTitle?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTakenSeconds: number;
  passed: boolean;
  createdAt: string;
}

// ── Certification Paths ──
export interface CertPath {
  id: number;
  title: string;
  description?: string;
  goal?: string;
  badgeColor?: string;
  estimatedWeeks: number;
  courseCount: number;
  testCount: number;
}

export interface CertPathDetail extends CertPath {
  courses: CertPathCourse[];
  tests: CertPathTest[];
}

export interface CertPathCourse {
  id: number;
  certificationId: number;
  certificationName: string;
  certificationCode?: string;
  orderIndex: number;
  description?: string;
}

export interface CertPathTest {
  id: number;
  mockTestId: number;
  mockTestTitle: string;
}

// ── News ──
export interface NewsItem {
  id: number;
  title: string;
  category: string;
  url?: string;
  publishedAt: string;
}

// ── Dashboard ──
export interface Dashboard {
  totalQuestionsAttempted: number;
  totalCorrect: number;
  accuracyPercentage: number;
  testsTaken: number;
  testsPassed: number;
  recentAttempts: RecentAttempt[];
  categoryStats: CategoryStats[];
}

export interface RecentAttempt {
  type: string;
  title: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface CategoryStats {
  category: string;
  attempted: number;
  correct: number;
}

// ── Auth ──
export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}
