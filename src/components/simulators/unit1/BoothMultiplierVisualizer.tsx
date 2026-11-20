import React, { useState } from 'react';
import { Play, RotateCcw, Calculator, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface BoothStep {
  cycle: number;
  operation: string;
  a: string;
  q: string;
  qMinus1: string;
  desc: string;
}

export const BoothMultiplierVisualizer: React.FC = () => {
  const [valM, setValM] = useState<number>(7); // Multiplicand
  const [valQ, setValQ] = useState<number>(-3); // Multiplier
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Generate Booth's Algorithm step-by-step trace for 4-bit signed numbers
  const generateBoothSteps = (mVal: number, qVal: number): BoothStep[] => {
    // 4-bit representation
    const to4Bit = (val: number): string => {
      if (val >= 0) return (val & 0xf).toString(2).padStart(4, '0');
      return ((16 + val) & 0xf).toString(2).padStart(4, '0');
    };

    const binM = to4Bit(mVal);
    const binMinusM = to4Bit(-mVal);
    const binQ = to4Bit(qVal);

    // Initial state
    let a = 0;
    let q = (qVal < 0 ? 16 + qVal : qVal) & 0xf;
    let qMinus1 = 0;
    const m = (mVal < 0 ? 16 + mVal : mVal) & 0xf;
    const minusM = (-mVal < 0 ? 16 - mVal : -mVal) & 0xf;

    const steps: BoothStep[] = [];

    steps.push({
      cycle: 0,
      operation: 'Initial State',
      a: to4Bit(a),
      q: to4Bit(q),
      qMinus1: qMinus1.toString(),
      desc: `Load M = ${mVal} (${binM}₂), -M = ${-mVal} (${binMinusM}₂), Q = ${qVal} (${binQ}₂), A = 0000, Q₋₁ = 0`
    });

    for (let c = 1; c <= 4; c++) {
      const q0 = q & 1;
      const pair = `${q0}${qMinus1}`;

      if (pair === '10') {
        // A = A - M (i.e. A + (-M))
        a = (a + minusM) & 0xf;
        steps.push({
          cycle: c,
          operation: 'A = A - M',
          a: to4Bit(a),
          q: to4Bit(q),
          qMinus1: qMinus1.toString(),
          desc: `Q₀Q₋₁ = 10 -> Subtract Multiplicand M: A = A + (-M) = ${to4Bit(a)}₂`
        });
      } else if (pair === '01') {
        // A = A + M
        a = (a + m) & 0xf;
        steps.push({
          cycle: c,
          operation: 'A = A + M',
          a: to4Bit(a),
          q: to4Bit(q),
          qMinus1: qMinus1.toString(),
          desc: `Q₀Q₋₁ = 01 -> Add Multiplicand M: A = A + M = ${to4Bit(a)}₂`
        });
      }

      // Arithmetic Shift Right (ASR) of [A, Q, Q-1]
      const combined = (a << 5) | (q << 1) | qMinus1;
      const signBit = (a & 8) ? 1 : 0;
      // Shift right by 1, preserving MSB sign bit
      const shifted = (combined >> 1) | (signBit << 9);

      qMinus1 = shifted & 1;
      q = (shifted >> 1) & 0xf;
      a = (shifted >> 5) & 0xf;

      steps.push({
        cycle: c,
        operation: 'ASR (Shift Right)',
        a: to4Bit(a),
        q: to4Bit(q),
        qMinus1: qMinus1.toString(),
        desc: `Perform Arithmetic Shift Right (ASR) on [A, Q, Q₋₁]. Preserve sign bit A[3] = ${signBit}.`
      });
    }

    return steps;
  };

  const steps = generateBoothSteps(valM, valQ);
  const currentStep = steps[currentStepIdx] || steps[0];

  const finalProductBinary = `${steps[steps.length - 1].a}${steps[steps.length - 1].q}`;
  const finalDecimalProduct = valM * valQ;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-500" />
            Booth's 2's Complement Hardware Multiplication Algorithm
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High-speed signed binary multiplication algorithm used in modern microprocessor ALUs. Guaranteed DTU 5-mark question!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIdx >= steps.length - 1}
            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded font-bold shadow"
          >
            <Play className="w-3.5 h-3.5" /> Next Cycle Step
          </button>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Multiplicand M (Range: -8 to +7)
          </label>
          <input
            type="number"
            min={-8}
            max={7}
            value={valM}
            onChange={e => {
              setValM(Math.max(-8, Math.min(7, Number(e.target.value))));
              setCurrentStepIdx(0);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Multiplier Q (Range: -8 to +7)
          </label>
          <input
            type="number"
            min={-8}
            max={7}
            value={valQ}
            onChange={e => {
              setValQ(Math.max(-8, Math.min(7, Number(e.target.value))));
              setCurrentStepIdx(0);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold outline-none"
          />
        </div>
      </div>

      {/* Active Registers Status Display */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-white mb-5 shadow-inner">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-3">
          <span className="text-emerald-400 font-bold">
            Step {currentStepIdx + 1} of {steps.length}: {currentStep.operation}
          </span>
          <span>Cycle: {currentStep.cycle} / 4</span>
        </div>

        <p className="text-xs text-slate-300 mb-4 font-sans leading-relaxed">
          {currentStep.desc}
        </p>

        {/* Registers Row */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">Accumulator A (4-bit)</span>
            <span className="text-lg font-bold text-emerald-400 tracking-widest">{currentStep.a}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">Multiplier Q (4-bit)</span>
            <span className="text-lg font-bold text-cyan-400 tracking-widest">{currentStep.q}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">History Bit Q₋₁ (1-bit)</span>
            <span className="text-lg font-bold text-amber-400">{currentStep.qMinus1}</span>
          </div>
        </div>
      </div>

      {/* Full Trace Table for DTU Exam Solution */}
      <div className="overflow-x-auto text-xs font-mono mb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="py-2 px-3 font-sans">Cycle</th>
              <th className="py-2 px-3 font-sans">Operation</th>
              <th className="py-2 px-3 text-emerald-600">A</th>
              <th className="py-2 px-3 text-cyan-600">Q</th>
              <th className="py-2 px-3 text-amber-600">Q₋₁</th>
              <th className="py-2 px-3 font-sans">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {steps.map((st, idx) => (
              <tr
                key={idx}
                onClick={() => setCurrentStepIdx(idx)}
                className={`cursor-pointer transition-colors ${
                  idx === currentStepIdx
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <td className="py-1.5 px-3">{st.cycle}</td>
                <td className="py-1.5 px-3 font-sans">{st.operation}</td>
                <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400">{st.a}</td>
                <td className="py-1.5 px-3 text-cyan-600 dark:text-cyan-400">{st.q}</td>
                <td className="py-1.5 px-3 text-amber-600 dark:text-amber-400">{st.qMinus1}</td>
                <td className="py-1.5 px-3 text-slate-500 font-sans text-[11px] truncate max-w-xs">{st.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final Verification Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
            Final 8-Bit Product [A, Q]:
          </span>
          <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
            ({finalProductBinary})₂ = {finalDecimalProduct} Decimal
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verification: {valM} × {valQ} = {finalDecimalProduct} ✓</span>
        </div>
      </div>
    </div>
  );
};
