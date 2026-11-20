import React, { useState } from 'react';
import { LessonContent } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import {
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  Zap,
  Info
} from 'lucide-react';

// Import all simulator components to embed dynamically
import { BaseConverterVisualizer } from '../simulators/unit1/BaseConverterVisualizer';
import { TwosComplementVisualizer } from '../simulators/unit1/TwosComplementVisualizer';
import { FloatingPointVisualizer } from '../simulators/unit1/FloatingPointVisualizer';
import { HammingCodeVisualizer } from '../simulators/unit1/HammingCodeVisualizer';
import { GrayCodeConverter } from '../simulators/unit1/GrayCodeConverter';
import { BinaryArithmeticCalculator } from '../simulators/unit1/BinaryArithmeticCalculator';
import { BoothMultiplierVisualizer } from '../simulators/unit1/BoothMultiplierVisualizer';
import { LogicGatePlayground } from '../simulators/unit2/LogicGatePlayground';
import { KMapSolver } from '../simulators/unit2/KMapSolver';
import { MuxDemuxSimulator } from '../simulators/unit2/MuxDemuxSimulator';
import { SevenSegmentDisplaySimulator } from '../simulators/unit2/SevenSegmentDisplaySimulator';
import { QuineMcCluskeyVisualizer } from '../simulators/unit2/QuineMcCluskeyVisualizer';
import { PriorityEncoderComparatorVisualizer } from '../simulators/unit2/PriorityEncoderComparatorVisualizer';
import { FlipFlopSimulator } from '../simulators/unit3/FlipFlopSimulator';
import { FSMStateAnimator } from '../simulators/unit3/FSMStateAnimator';
import { ArmArchitectureExplorer } from '../simulators/unit4/ArmArchitectureExplorer';
import { RegisterBankVisualizer } from '../simulators/unit4/RegisterBankVisualizer';
import { InterruptSequenceAnimator } from '../simulators/unit4/InterruptSequenceAnimator';
import { CortexComparisonTable } from '../simulators/unit4/CortexComparisonTable';
import { ArmMemoryMapVisualizer } from '../simulators/unit4/ArmMemoryMapVisualizer';
import { FormattedMathText, MathFormula } from './MathRenderer';

interface LessonViewProps {
  lesson: LessonContent;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onNextLesson,
  onPrevLesson
}) => {
  const { isLessonCompleted, toggleLessonComplete, isLessonBookmarked, toggleBookmark } = useProgress();
  const completed = isLessonCompleted(lesson.id);
  const bookmarked = isLessonBookmarked(lesson.id);

  // Practice question states: questionId -> selectedOption / answered
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  // Dynamic Simulator Resolver
  const renderSimulator = (key?: string) => {
    switch (key) {
      case 'base-converter': return <BaseConverterVisualizer />;
      case 'twos-complement': return <TwosComplementVisualizer />;
      case 'floating-point': return <FloatingPointVisualizer />;
      case 'hamming-code': return <HammingCodeVisualizer />;
      case 'gray-code': return <GrayCodeConverter />;
      case 'binary-arithmetic': return <BinaryArithmeticCalculator />;
      case 'booth-multiplier': return <BoothMultiplierVisualizer />;
      case 'logic-gates': return <LogicGatePlayground />;
      case 'kmap-solver': return <KMapSolver />;
      case 'mux-demux': return <MuxDemuxSimulator />;
      case 'seven-segment': return <SevenSegmentDisplaySimulator />;
      case 'quine-mccluskey': return <QuineMcCluskeyVisualizer />;
      case 'priority-comparator': return <PriorityEncoderComparatorVisualizer />;
      case 'flip-flop': return <FlipFlopSimulator />;
      case 'fsm-animator': return <FSMStateAnimator />;
      case 'arm-architecture': return <ArmArchitectureExplorer />;
      case 'register-bank': return <RegisterBankVisualizer />;
      case 'interrupt-animator': return <InterruptSequenceAnimator />;
      case 'cortex-comparison': return <CortexComparisonTable />;
      case 'arm-memory-map': return <ArmMemoryMapVisualizer />;
      default: return null;
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Lesson Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 dark:from-slate-900 dark:to-slate-850 p-6 sm:p-8 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white">
              Unit {lesson.unitNumber}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {lesson.unitTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(lesson.id)}
              className={`p-2 rounded-xl border transition-colors ${
                bookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
              }`}
              title="Bookmark lesson"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => toggleLessonComplete(lesson.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                completed
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-white' : 'text-slate-400'}`} />
              <span>{completed ? 'Marked Completed' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {lesson.subtitle}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium pt-2 border-t border-blue-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-500" />
            {lesson.estimatedMinutes} min estimated study
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            DTU Weightage: {lesson.examPerspective.expectedMarks}
          </span>
        </div>
      </div>

      {/* 1. What Is It? */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            What is it?
          </h2>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {lesson.whatIsIt.simpleSummary}
        </p>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Formal Engineering Definition
          </span>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            <FormattedMathText text={lesson.whatIsIt.coreDefinition} />
          </p>
        </div>

        {lesson.whatIsIt.keyAnalogy && (
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Intuitive Mental Model:</strong>
              <p className="leading-relaxed">{lesson.whatIsIt.keyAnalogy}</p>
            </div>
          </div>
        )}
      </section>

      {/* 2. Why Do We Need It? */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Why do we need it?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
            <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
              The Real-World Engineering Problem:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              {lesson.whyDoWeNeedIt.realWorldProblem}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
              The Digital Systems Solution:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              {lesson.whyDoWeNeedIt.engineeringBenefit}
            </p>
          </div>
        </div>
      </section>

      {/* 3. How Does It Work? */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            How does it work? (Step-by-Step Mechanism)
          </h2>
        </div>

        <div className="space-y-3">
          {lesson.howItWorks.stepByStepFlow.map(flow => (
            <div
              key={flow.step}
              className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
            >
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {flow.step}
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {flow.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {flow.description}
                </p>
                {flow.codeOrFormula && (
                  <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    <FormattedMathText text={flow.codeOrFormula} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {lesson.howItWorks.deepDiveNotes && lesson.howItWorks.deepDiveNotes.length > 0 && (
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              Advanced In-Depth Technical Notes:
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
              {lesson.howItWorks.deepDiveNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 4. Interactive Visual Simulation (The Core Highlight!) */}
      {lesson.interactiveSimulatorKey && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Interactive Working Simulation
              </h2>
            </div>
            <span className="text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
              Live Hardware Model
            </span>
          </div>

          {renderSimulator(lesson.interactiveSimulatorKey)}
        </section>
      )}

      {/* 5. Practical Example */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Practical Example Walkthrough
          </h2>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Scenario: {lesson.practicalExample.scenario}
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-mono">
            {lesson.practicalExample.walkthrough}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Check className="w-4 h-4" />
            <span>Result: {lesson.practicalExample.result}</span>
          </div>
        </div>
      </section>

      {/* 6. Step-by-Step Solved Problems */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 text-xs font-bold flex items-center justify-center">
              6
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Step-by-Step Solved University Problems
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {lesson.solvedProblems.length} Problems
          </span>
        </div>

        <div className="space-y-4">
          {lesson.solvedProblems.map((prob, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  prob.difficulty === 'university'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {prob.difficulty === 'university' ? 'DTU Exam Level' : 'Standard Problem'}
                </span>
                {prob.marks && (
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    [{prob.marks} Marks]
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                Q{idx + 1}: {prob.question}
              </h4>

              {/* Steps */}
              <div className="space-y-2.5 pt-2">
                {prob.steps.map((st, sIdx) => (
                  <div key={sIdx} className="pl-3 border-l-2 border-blue-500 space-y-1 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Step {sIdx + 1}: {st.title}
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {st.explanation}
                    </p>
                    {st.math && (
                      <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-[11px] text-blue-700 dark:text-blue-300 font-semibold border border-slate-200 dark:border-slate-800 overflow-x-auto">
                        <FormattedMathText text={st.math} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Final Answer */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  Final Answer: <span className="text-emerald-600 dark:text-emerald-400">{prob.finalAnswer}</span>
                </span>
                {prob.tip && (
                  <span className="text-[11px] text-slate-500 italic">
                    💡 Tip: {prob.tip}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Common Mistakes */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
            7
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Common Pitfalls & Examination Traps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.commonMistakes.map((cm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/10 space-y-2 text-xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                <X className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Mistake: {cm.mistake}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 pl-5">
                <strong>Why students fail here:</strong> {cm.whyItHappens}
              </p>
              <div className="pl-5 pt-1 text-emerald-700 dark:text-emerald-400 font-semibold flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Correct Approach: {cm.correctWay}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Exam Perspective */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
            8
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            DTU Examination Perspective
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3 font-mono">
          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Expected Question Weightage</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {lesson.examPerspective.expectedMarks}
            </span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">Exam Frequency</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {lesson.examPerspective.frequency}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Typical DTU Examination Questions:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            {lesson.examPerspective.typicalDtuQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-blue-500 font-bold">Q{idx + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
          <strong>Examiner Scoring Advice:</strong> {lesson.examPerspective.scoringKeyAdvice}
        </div>
      </section>

      {/* 9. Quick Revision & Formulas */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300 text-xs font-bold flex items-center justify-center">
            9
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Revision & Key Formulas
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          {lesson.quickRevision.bulletPoints.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-cyan-500 font-bold shrink-0">■</span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>

        {lesson.quickRevision.importantFormulas.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Essential Equations to Memorize:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.quickRevision.importantFormulas.map((f, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{f.name}</span>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block overflow-x-auto">
                    <FormattedMathText text={f.formula} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 10. Interactive Practice Questions */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
              10
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Interactive Practice & Self-Check
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Instant Feedback & Explanations
          </span>
        </div>

        <div className="space-y-4">
          {lesson.practiceQuestions.map((q, qIdx) => {
            const userAnswer = selectedAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = isAnswered && (userAnswer === q.correctAnswer || String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase());

            return (
              <div
                key={q.id}
                className="p-5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Practice Question {qIdx + 1}</span>
                  <span className="text-xs font-mono font-bold text-blue-600">[{q.marks || 2} Marks]</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {q.question}
                </p>

                {/* Multiple choice options */}
                {q.type === 'mcq' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = userAnswer === oIdx;
                      let btnStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900';

                      if (isAnswered) {
                        if (oIdx === q.correctAnswer) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => !isAnswered && setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                          disabled={isAnswered}
                          className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold text-[10px]">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span><FormattedMathText text={opt} /></span>
                          </div>
                          {isAnswered && oIdx === q.correctAnswer && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isSelected && oIdx !== q.correctAnswer && (
                            <X className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Numerical / Input option */}
                {q.type === 'numerical' && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Enter numerical answer..."
                      disabled={isAnswered}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSelectedAnswers(prev => ({ ...prev, [q.id]: (e.target as any).value }));
                        }
                      }}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold outline-none flex-1"
                    />
                    {!isAnswered && (
                      <button
                        onClick={e => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement).value;
                          setSelectedAnswers(prev => ({ ...prev, [q.id]: input }));
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Check
                      </button>
                    )}
                  </div>
                )}

                {/* Feedback Panel */}
                {isAnswered && (
                  <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      <span>{isCorrect ? 'Correct! Outstanding work.' : 'Incorrect answer.'}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>Explanation:</strong> <FormattedMathText text={q.explanation} />
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Navigation (Prev / Next Lesson) */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
        {onPrevLesson ? (
          <button
            onClick={onPrevLesson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>
        ) : <div />}

        {onNextLesson && (
          <button
            onClick={onNextLesson}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            <span>Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
};
