export type UnitId = 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';

export interface SolvedProblem {
  difficulty: 'easy' | 'intermediate' | 'university';
  question: string;
  marks?: number;
  given?: string;
  steps: {
    title: string;
    explanation: string;
    math?: string;
  }[];
  finalAnswer: string;
  tip?: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'numerical' | 'dtu-exam';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  distractorExplanations?: Record<number, string>;
  marks?: number;
  hint?: string;
}

export interface LessonContent {
  id: string;
  unitId: UnitId;
  unitNumber: number;
  unitTitle: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  order: number;
  prerequisites?: string[];
  
  // 10-Point Pedagogical Framework
  whatIsIt: {
    simpleSummary: string;
    coreDefinition: string;
    keyAnalogy?: string;
  };
  whyDoWeNeedIt: {
    realWorldProblem: string;
    historicalContext?: string;
    engineeringBenefit: string;
  };
  howItWorks: {
    stepByStepFlow: {
      step: number;
      title: string;
      description: string;
      codeOrFormula?: string;
    }[];
    deepDiveNotes?: string[];
  };
  interactiveSimulatorKey?: string;
  practicalExample: {
    scenario: string;
    walkthrough: string;
    result: string;
  };
  solvedProblems: SolvedProblem[];
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    correctWay: string;
  }[];
  examPerspective: {
    expectedMarks: '2 Marks' | '3 Marks' | '5 Marks' | '10 Marks' | '2-5 Marks' | '5-10 Marks';
    frequency: 'Very High' | 'High' | 'Medium';
    typicalDtuQuestions: string[];
    scoringKeyAdvice: string;
  };
  quickRevision: {
    bulletPoints: string[];
    importantFormulas: { name: string; formula: string; note?: string }[];
  };
  practiceQuestions: PracticeQuestion[];
}

export interface UnitInfo {
  id: UnitId;
  number: number;
  title: string;
  description: string;
  hours: number;
  accentColor: string;
  topicsCount: number;
  lessons: LessonContent[];
  simulators: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface UserProgress {
  completedLessons: string[];
  bookmarkedLessons: string[];
  quizScores: Record<string, { score: number; total: number; timestamp: number }>;
  activeTab: 'lessons' | 'lab' | 'solved' | 'quiz' | 'revision';
}
