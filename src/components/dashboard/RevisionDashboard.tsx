import React, { useState } from 'react';
import { allUnits } from '../../data/syllabus';
import { dtuExamQuestionBank } from '../../data/quizzes/allQuizzes';
import { useProgress } from '../../context/ProgressContext';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RevisionDashboardProps {
  onSelectLesson: (unitId: string, lessonId: string) => void;
}

export const RevisionDashboard: React.FC<RevisionDashboardProps> = ({ onSelectLesson }) => {
  const { progress, isLessonCompleted, resetProgress } = useProgress();
  const [selectedMarkFilter, setSelectedMarkFilter] = useState<number | 'all'>('all');
  const [expandedExamQ, setExpandedExamQ] = useState<Record<string, boolean>>({});

  const toggleExpandExamQ = (id: string) => {
    setExpandedExamQ(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allLessons = allUnits.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
  const completedLessons = allLessons.filter(l => isLessonCompleted(l.id));
  const uncompletedLessons = allLessons.filter(l => !isLessonCompleted(l.id));

  const totalLessons = allLessons.length;
  const progressPercent = Math.min(100, Math.round((completedLessons.length / (totalLessons || 1)) * 100));

  const filteredExamQuestions = selectedMarkFilter === 'all'
    ? dtuExamQuestionBank
    : dtuExamQuestionBank.filter(q => q.marks === selectedMarkFilter);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Revision & Exam Preparation Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            DTU IT201 Examination Readiness
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Monitor completed lessons, identify syllabus gaps, and practice verified DTU examination questions categorized by 2, 3, 5, and 10 marks.
          </p>
        </div>
      </div>

      {/* Analytics Card Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Progress</span>
            <span className="font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {completedLessons.length} of {totalLessons} lessons finished
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 block">Topics Not Yet Studied</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {uncompletedLessons.length}
          </div>
          <span className="text-[11px] text-slate-400 block">
            {uncompletedLessons.length === 0 ? 'Full syllabus completed!' : 'Modules pending review'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-xs text-slate-500 block">Learning Data Persistence</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> LocalStorage Active
            </span>
            <button
              onClick={resetProgress}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Uncompleted Lessons (Actionable To-Do) */}
      {uncompletedLessons.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Syllabus Topics Pending Study ({uncompletedLessons.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uncompletedLessons.map(l => (
              <button
                key={l.id}
                onClick={() => onSelectLesson(l.unit.id, l.id)}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-left transition-all flex items-start justify-between gap-3 group"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block mb-1">
                    Unit {l.unit.number} • {l.estimatedMinutes} mins
                  </span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block group-hover:text-blue-600">
                    {l.title}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {l.subtitle}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DTU Exam Question Bank by Marks */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              DTU Examination Question Bank & Model Solutions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam questions with official mark breakdown schemes and examiner scoring advice.
            </p>
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 2, 3, 5, 10] as const).map(m => (
              <button
                key={String(m)}
                onClick={() => setSelectedMarkFilter(m)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedMarkFilter === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {m === 'all' ? 'All Marks' : `${m} Marks`}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredExamQuestions.map(q => {
            const isExpanded = !!expandedExamQ[q.id];
            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div
                  onClick={() => toggleExpandExamQ(q.id)}
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {q.marks} Marks
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {q.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h4>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  )}
                </div>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                    {/* Marking Scheme */}
                    <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        Official DTU Marking Scheme Distribution:
                      </span>
                      <div className="space-y-1 font-mono">
                        {q.markingScheme.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>• {item.step}</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">[{item.marks} M]</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-1 text-slate-800 dark:text-slate-200">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                        Model Examination Solution:
                      </span>
                      <p className="leading-relaxed whitespace-pre-line font-mono text-[11px]">
                        {q.modelAnswer}
                      </p>
                    </div>

                    {/* Examiner Tips */}
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
                      <strong>Examiner Scoring Tip:</strong> {q.examinerTips}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
