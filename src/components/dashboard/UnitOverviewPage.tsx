import React from 'react';
import { UnitInfo } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import {
  BookOpen,
  Clock,
  Award,
  FlaskConical,
  CheckCircle2,
  Circle,
  ArrowRight,
  Bookmark,
  Sparkles
} from 'lucide-react';

interface UnitOverviewPageProps {
  unit: UnitInfo;
  onSelectLesson: (lessonId: string) => void;
  onOpenQuiz: () => void;
  onOpenLab: (simKey?: string) => void;
}

export const UnitOverviewPage: React.FC<UnitOverviewPageProps> = ({
  unit,
  onSelectLesson,
  onOpenQuiz,
  onOpenLab
}) => {
  const { isLessonCompleted, isLessonBookmarked } = useProgress();

  const completedCount = unit.lessons.filter(l => isLessonCompleted(l.id)).length;
  const progressPercent = Math.round((completedCount / unit.lessons.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Unit Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-200">
              Unit {unit.number} • {unit.hours} Hours Coursework
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {progressPercent}% Completed
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {unit.title}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {unit.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onSelectLesson(unit.lessons[0].id)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <span>Start First Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Unit Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Simulators in this Unit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-500" />
            Unit {unit.number} Interactive Simulators
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {unit.simulators.length} Simulators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unit.simulators.map(sim => (
            <button
              key={sim.id}
              onClick={() => onOpenLab(sim.id)}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-all flex items-start justify-between gap-3 group shadow-sm"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {sim.name}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {sim.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Lessons List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Curriculum Lessons & Modules
          </h2>
          <span className="text-xs text-slate-400">
            {completedCount} of {unit.lessons.length} Finished
          </span>
        </div>

        <div className="space-y-3">
          {unit.lessons.map(lesson => {
            const isCompleted = isLessonCompleted(lesson.id);
            const isBookmarked = isLessonBookmarked(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-1 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {lesson.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span>⏱ {lesson.estimatedMinutes} mins</span>
                      <span>🎯 DTU: {lesson.examPerspective.expectedMarks}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isBookmarked && (
                    <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
