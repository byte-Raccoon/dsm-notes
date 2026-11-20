import React from 'react';
import { allUnits } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';
import {
  BookOpen,
  FlaskConical,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Bookmark,
  TrendingUp
} from 'lucide-react';

interface DashboardHomeProps {
  onSelectUnit: (unitId: string) => void;
  onSelectLesson: (unitId: string, lessonId: string) => void;
  onSelectLab: () => void;
  onSelectRevision: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onSelectUnit,
  onSelectLesson,
  onSelectLab,
  onSelectRevision
}) => {
  const { progress, isLessonCompleted } = useProgress();

  const totalLessons = allUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalLessons || 1)) * 100));

  // Determine next uncompleted lesson to recommend
  let nextLesson = allUnits[0].lessons[0];
  let nextUnit = allUnits[0];
  for (const u of allUnits) {
    const uncompleted = u.lessons.find(l => !isLessonCompleted(l.id));
    if (uncompleted) {
      nextLesson = uncompleted;
      nextUnit = u;
      break;
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Delhi Technological University (DTU) • IT201</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Master Digital Systems & Microcontrollers Through Interactive Simulation
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Stop struggling with abstract theory and static YouTube videos. Learn binary arithmetic, K-maps, sequential state machines, and ARM Cortex-M microcontrollers by seeing the electrons move.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectLesson(nextUnit.id, nextLesson.id)}
              className="px-5 py-3 rounded-xl bg-white text-blue-800 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
            >
              <span>{completedCount > 0 ? 'Resume Learning' : 'Start Unit 1'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSelectLab}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <FlaskConical className="w-4 h-4 text-cyan-300" />
              <span>Explore Virtual Laboratory</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Progress & Stat Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Syllabus Covered</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Completed Lessons</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {completedCount} / {totalLessons}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Course Credit</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              42 Hours (4 Credits)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Simulators Ready</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              12+ Live Tools
            </span>
          </div>
        </div>
      </div>

      {/* Course Units Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              DTU IT201 Official Syllabus Units
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete beginner-to-examination modules strictly aligned with Delhi Technological University curriculum.
            </p>
          </div>
          <button
            onClick={onSelectRevision}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Revision Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allUnits.map(unit => {
            const unitDoneCount = unit.lessons.filter(l => isLessonCompleted(l.id)).length;
            const pct = Math.round((unitDoneCount / unit.lessons.length) * 100);

            return (
              <div
                key={unit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      UNIT {unit.number} • {unit.hours} HOURS
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">
                      {pct}% Completed
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {unit.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {unit.description}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 font-medium">
                    {unit.lessons.length} Detailed Lessons • {unit.simulators.length} Simulators
                  </span>

                  <button
                    onClick={() => onSelectUnit(unit.id)}
                    className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
