import React, { useState } from 'react';
import { allUnits } from '../../data/syllabus';
import { useProgress } from '../../context/ProgressContext';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  Cpu,
  FlaskConical,
  Award,
  BookOpen,
  LayoutDashboard,
  HelpCircle,
  Bookmark
} from 'lucide-react';

interface SidebarProps {
  currentUnitId: string;
  currentLessonId: string;
  currentView: 'home' | 'lesson' | 'unit-overview' | 'lab' | 'quiz' | 'revision';
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (unitId: string, lessonId: string) => void;
  onSelectUnitOverview: (unitId: string) => void;
  onSelectLab: (unitId?: string) => void;
  onSelectQuiz: (unitId: string) => void;
  onSelectRevision: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUnitId,
  currentLessonId,
  currentView,
  isOpen,
  onClose,
  onSelectLesson,
  onSelectUnitOverview,
  onSelectLab,
  onSelectQuiz,
  onSelectRevision
}) => {
  const { isLessonCompleted, isLessonBookmarked, progress } = useProgress();
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': true,
    'unit-3': true,
    'unit-4': true,
  });

  const toggleExpand = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 space-y-4">
          {/* Dashboard Hub Buttons */}
          <div className="space-y-1">
            <button
              onClick={() => { onSelectRevision(); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'revision'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Syllabus Progress & Revision</span>
            </button>

            <button
              onClick={() => { onSelectLab(); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'lab'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>All Interactive Simulators (Lab)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
              Course Units
            </span>

            {/* Units Accordion */}
            <div className="space-y-2">
              {allUnits.map(unit => {
                const isExpanded = !!expandedUnits[unit.id];
                const unitCompletedCount = unit.lessons.filter(l => isLessonCompleted(l.id)).length;
                const unitProgressPct = Math.round((unitCompletedCount / unit.lessons.length) * 100);

                return (
                  <div
                    key={unit.id}
                    className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/30 overflow-hidden"
                  >
                    {/* Unit Header */}
                    <div
                      onClick={() => toggleExpand(unit.id)}
                      className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {unit.number}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                            Unit {unit.number}: {unit.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {unitCompletedCount}/{unit.lessons.length} lessons • {unit.hours} hrs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-[10px] font-mono text-slate-400">
                          {unitProgressPct}%
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible Unit Sub-Navigation */}
                    {isExpanded && (
                      <div className="px-2 pb-2 pt-1 space-y-0.5 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                        {/* Chapter Overview Link */}
                        <button
                          onClick={() => {
                            onSelectUnitOverview(unit.id);
                            onClose();
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                            currentView === 'unit-overview' && currentUnitId === unit.id
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Chapter Overview</span>
                        </button>

                        {/* Individual Lessons */}
                        {unit.lessons.map(lesson => {
                          const isCompleted = isLessonCompleted(lesson.id);
                          const isBookmarked = isLessonBookmarked(lesson.id);
                          const isActive = currentView === 'lesson' && currentLessonId === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                onSelectLesson(unit.id, lesson.id);
                                onClose();
                              }}
                              className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                                isActive
                                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isCompleted ? (
                                  <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
                                )}
                                <span className="truncate text-[11px] leading-tight">
                                  {lesson.title}
                                </span>
                              </div>
                              {isBookmarked && (
                                <Bookmark className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                              )}
                            </button>
                          );
                        })}

                        {/* Unit Assessment / Quiz */}
                        <button
                          onClick={() => {
                            onSelectQuiz(unit.id);
                            onClose();
                          }}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                            currentView === 'quiz' && currentUnitId === unit.id
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <span className="truncate">Unit {unit.number} Assessment</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
