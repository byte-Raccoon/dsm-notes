import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  markLessonComplete: (lessonId: string) => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  recordQuizScore: (quizId: string, score: number, total: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonBookmarked: (lessonId: string) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = 'it201-user-progress-v1';

const defaultProgress: UserProgress = {
  completedLessons: [],
  bookmarkedLessons: [],
  quizScores: {},
  activeTab: 'lessons'
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user progress', e);
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress', e);
    }
  }, [progress]);

  const markLessonComplete = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  const toggleLessonComplete = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter(id => id !== lessonId)
          : [...prev.completedLessons, lessonId]
      };
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: { score, total, timestamp: Date.now() }
      }
    }));
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);
  const isLessonBookmarked = (lessonId: string) => progress.bookmarkedLessons.includes(lessonId);

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your learning progress?')) {
      setProgress(defaultProgress);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markLessonComplete,
        toggleLessonComplete,
        toggleBookmark,
        recordQuizScore,
        isLessonCompleted,
        isLessonBookmarked,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
