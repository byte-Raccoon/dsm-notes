import React, { useState } from 'react';
import { allMockQuizzes } from '../../data/quizzes/allQuizzes';
import { useProgress } from '../../context/ProgressContext';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { FormattedMathText } from '../common/MathRenderer';

interface MockExamViewProps {
  unitId: string;
  onFinish?: () => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({ unitId, onFinish }) => {
  const { recordQuizScore } = useProgress();
  const quizData = allMockQuizzes[unitId] || allMockQuizzes['unit-1'];

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const calculateScore = () => {
    let earned = 0;
    let total = 0;
    quizData.questions.forEach(q => {
      total += q.marks || 2;
      const userAns = answers[q.id];
      if (userAns !== undefined) {
        if (q.type === 'mcq' && userAns === q.correctAnswer) {
          earned += q.marks || 2;
        } else if (q.type === 'numerical' && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          earned += q.marks || 2;
        }
      }
    });
    return { earned, total, percentage: Math.round((earned / total) * 100) };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const { earned, total } = calculateScore();
    recordQuizScore(unitId, earned, total);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const scoreInfo = submitted ? calculateScore() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
            Unit Assessment
          </span>
          <span className="text-xs font-mono text-blue-200">
            {quizData.questions.length} Questions
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {quizData.title}
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-1">
          Test your mastery before appearing for university mid-term and end-term examinations.
        </p>
      </div>

      {/* Score Result Banner (when submitted) */}
      {submitted && scoreInfo && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 shadow-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Assessment Result
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 dark:text-white mt-0.5">
              {scoreInfo.earned} / {scoreInfo.total} Marks ({scoreInfo.percentage}%)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {scoreInfo.percentage >= 80
                ? '🌟 University Distinction Level! You have mastered this unit.'
                : scoreInfo.percentage >= 50
                ? '👍 Good understanding! Review the missed questions below to target 100%.'
                : '⚠️ Needs revision! Go back to the interactive simulators and practice problems.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </button>
            {onFinish && (
              <button
                onClick={onFinish}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {quizData.questions.map((q, idx) => {
          const userAns = answers[q.id];
          const isAnswered = userAns !== undefined;
          const isCorrect = submitted && (
            (q.type === 'mcq' && userAns === q.correctAnswer) ||
            (q.type === 'numerical' && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase())
          );

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-300 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Question {idx + 1}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  [{q.marks || 2} Marks]
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-3">
                <FormattedMathText text={q.question} />
              </h3>

              {/* MCQ Options */}
              {q.type === 'mcq' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAns === oIdx;
                    let style = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';

                    if (submitted) {
                      if (oIdx === q.correctAnswer) {
                        style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                      }
                    } else if (isSelected) {
                      style = 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold text-[10px]">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span><FormattedMathText text={opt} /></span>
                        </div>
                        {submitted && oIdx === q.correctAnswer && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isSelected && oIdx !== q.correctAnswer && (
                          <X className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Numerical */}
              {q.type === 'numerical' && (
                <div className="pt-1">
                  <input
                    type="text"
                    disabled={submitted}
                    value={userAns || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Enter numerical answer..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold outline-none"
                  />
                </div>
              )}

              {/* Detailed Feedback & Distractor Explanations */}
              {submitted && (
                <div className="mt-3 p-3.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div>
                    <strong className="text-emerald-600 dark:text-emerald-400">Correct Solution: </strong>
                    <span className="text-slate-700 dark:text-slate-300">
                      <FormattedMathText text={q.explanation} />
                    </span>
                  </div>

                  {q.distractorExplanations && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-slate-500">
                      <strong className="text-slate-700 dark:text-slate-300 block">Why other options are wrong:</strong>
                      {Object.entries(q.distractorExplanations).map(([optIdx, reason]) => (
                        <div key={optIdx}>
                          • Option {String.fromCharCode(65 + Number(optIdx))}: <FormattedMathText text={reason} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Submit Assessment & Review Answers
          </button>
        </div>
      )}
    </div>
  );
};
