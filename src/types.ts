export type LearnerLevel = 'beginner' | 'intermediate' | 'advanced';
export type DurationOption = 2 | 5 | 10 | 15 | 20 | 60 | 10080; // 2min (Sprint), 5min (Core), 10min, 15min
export type TeachingStyle = 'analogies' | 'socratic' | 'practical' | 'exam';
export type SubjectCategory = 'physics' | 'programming' | 'math' | 'biology' | 'history' | 'general';
export type LessonFormat = 'video' | 'audio';

export interface TeacherAvatar {
  id: string;
  name: string;
  role: string;
  specialty: string;
  imageUrl: string;
  description: string;
  tenure: string;
  voicePitch: number;
  voiceRate: number;
  voiceGender: 'male' | 'female';
}

export interface VisualContent {
  title: string;
  description: string;
  details?: string[];
  codeSnippet?: string;
  equations?: string[];
  steps?: string[];
  circuitParams?: {
    voltage: number;
    resistance: number;
  };
}

export interface CheckpointQuestion {
  questionText: string;
  options: string[];
  correctIndex: number;
  commonMisconception: string;
  explanation: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  type: 'explain' | 'demonstrate' | 'question' | 'adapt';
  speechScript: string;
  keyTakeaway: string;
  visualType: 'equation' | 'code' | 'diagram' | 'timeline' | 'concept_map' | 'interactive_sim';
  visualContent: VisualContent;
  checkpointQuestion?: CheckpointQuestion;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  conceptTested: string;
  hint: string;
}

export interface LessonPlan {
  title: string;
  summary: string;
  subjectCategory: SubjectCategory;
  estimatedTimeMinutes: number;
  curriculumModules: CurriculumModule[];
  learningObjectives: string[];
  finalAssessment: AssessmentQuestion[];
  recommendedNextTopics: string[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  confidenceScore: number;
  feedback: string;
  misconceptionDetected: string | null;
  underlyingReason: string;
  intuitiveAnalogy: string;
  reExplanation: string;
  adaptedFollowupQuestion?: {
    questionText: string;
    hint: string;
  };
  suggestedDifficultyAdjustment: 'maintain' | 'simplify' | 'advance';
}

export interface LearnerProfile {
  name: string;
  level: LearnerLevel;
  durationMinutes: DurationOption;
  language: string;
  style: TeachingStyle;
  completedLessonsCount: number;
  topicsStudied: string[];
  strongConcepts: string[];
  weakConcepts: string[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: LearnerLevel;
  primarySubject: string;
  preferredLanguage: string;
  preferredTeacherId: string;
  isGuest?: boolean;
  createdAt: string;
}

export type PageRoute = 'home' | 'classroom' | 'curriculum' | 'practice' | 'library' | 'profile' | 'auth';

export interface SavedLessonRecord {
  id: string;
  topic: string;
  title: string;
  teacherName: string;
  teacherAvatarUrl: string;
  language: string;
  level: LearnerLevel;
  date: string;
  lesson: LessonPlan;
  score?: number;
  completed: boolean;
}
