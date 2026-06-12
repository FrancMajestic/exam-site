export interface Subject {
  id: number;
  name: string;
  examType: string;
  taskCount: number;
  color: string;
  icon: string;
  description?: string | null;
}

export interface Topic {
  id: number;
  subjectId: number;
  name: string;
  taskCount: number;
  taskNumbers?: number[];
}

export interface Task {
  id: number;
  subjectId: number;
  topicId: number;
  taskNumber: number;
  examType: string;
  difficulty: string;
  question: string;
  imageUrl?: string | null;
  answerType: string;
  options?: string[] | null;
  year?: number | null;
  source?: string | null;
}

export interface TaskDetail extends Task {
  correctAnswer?: string;
  solution?: string;
  lifehack?: string | null;
  relatedTaskIds?: number[];
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  coinsEarned: number;
  explanation: string;
  lifehack?: string | null;
  streakBonus?: number;
}

export interface Test {
  id: number;
  title: string;
  subjectId: number;
  examType: string;
  taskCount: number;
  duration: number;
  difficulty: string;
  year?: number | null;
  completionCount?: number;
  averageScore?: number | null;
}

export interface ProgressSummary {
  totalTasksSolved: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  maxStreak: number;
  totalCoins: number;
  level: number;
  levelProgress: number;
  subjectStats: SubjectStat[];
}

export interface SubjectStat {
  subjectId: number;
  subjectName: string;
  tasksSolved: number;
  accuracy: number;
}

export interface TopicProgress {
  topicId: number;
  topicName: string;
  subjectId: number;
  tasksSolved: number;
  totalTasks: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  score: number;
  accuracy: number;
  tasksSolved: number;
  coinsBalance: number;
  subjectName?: string | null;
}

export type Difficulty = "easy" | "medium" | "hard";
export type ExamType = "ege" | "oge";
