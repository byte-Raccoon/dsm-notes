import React, { useState } from 'react';
import { ShieldAlert, Play, ArrowRight, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

export const InterruptSequenceAnimator: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<number>(0);

  const stages = [
    {
      step: 1,
      title: 'Normal Thread Execution',
      mode: 'Thread Mode (Unprivileged)',
      stack: 'PSP (Process Stack Pointer)',
      cycles: 0,
      description: 'The user application code or RTOS task runs normally in Thread mode using the Process Stack Pointer (PSP).',
      highlight: 'thread'
    },
    {
      step: 2,
      title: 'Interrupt Arrival (IRQ Triggered)',
      mode: 'Interrupt Arrival Signal',
      stack: 'PSP',
      cycles: 1,
      description: 'A hardware peripheral (e.g., Timer or UART) asserts an interrupt request to the NVIC. The CPU completes or pauses the current atomic instruction.',
      highlight: 'nvic'
    },
    {
      step: 3,
      title: 'Hardware Auto-Stacking (12 Clock Cycles)',
      mode: 'Hardware Context Save',
      stack: 'PSP (Pushing 8 Registers)',
      cycles: 12,
      description: 'In 12 clock cycles, the hardware automatically pushes 8 critical registers to stack: xPSR, PC, LR, R12, R3, R2, R1, R0. No software instructions are required!',
      highlight: 'stack'
    },
    {
      step: 4,
      title: 'Vector Fetch & Mode Switch to Handler Mode',
      mode: 'Handler Mode (Privileged)',
      stack: 'MSP (Main Stack Pointer)',
      cycles: 12,
      description: 'CPU reads the 32-bit ISR start address from the Vector Table in Flash memory. Mode switches to Handler mode (always privileged, always uses MSP). Link Register (LR) is loaded with special EXC_RETURN code (e.g. 0xFFFFFFFD).',
      highlight: 'vector'
    },
    {
      step: 5,
      title: 'ISR Execution (Interrupt Service Routine)',
      mode: 'Handler Mode (Privileged)',
      stack: 'MSP',
      cycles: 'Variable',
      description: 'The C-language ISR function runs. It services the peripheral, clears the interrupt flag, and returns normally using standard "BX LR" instruction.',
      highlight: 'isr'
    },
    {
      step: 6,
      title: 'Exception Return & Hardware Auto-Unstacking',
      mode: 'Restoring Context & Mode Return',
      stack: 'PSP (Popping 8 Registers)',
      cycles: 12,
      description: 'Loading EXC_RETURN into PC notifies the hardware to automatically pop the 8 saved registers off the PSP stack, restoring original flags and resuming thread execution seamlessly!',
      highlight: 'return'
    }
  ];

  const current = stages[currentStage];

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const stackedRegisters = ['xPSR (Status Flags)', 'PC (Return Address)', 'LR (Link Register)', 'R12', 'R3', 'R2', 'R1', 'R0'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            NVIC Exception Handling & Hardware Auto-Stacking Sequence
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Follow the 12-cycle hardware context stacking, Thread to Handler mode transition, and EXC_RETURN unstacking.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStage(0)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart Sequence
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStage === 0}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 rounded font-medium"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStage === stages.length - 1}
            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded font-bold shadow"
          >
            Next Stage <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress timeline steps */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {stages.map((stg, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStage(idx)}
            className={`p-2 rounded-lg text-left border transition-all ${
              currentStage === idx
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold'
                : currentStage > idx
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono">Stage {stg.step}</div>
            <div className="text-[11px] truncate font-sans">{stg.title}</div>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Animated Status Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-amber-400 font-bold">Step {current.step} of 6</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Clock className="w-3.5 h-3.5" /> Latency: {current.cycles} clock cycles
              </span>
            </div>

            <h5 className="text-lg font-bold mb-2 text-white">
              {current.title}
            </h5>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {current.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 font-mono text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 block">CPU Operating Mode</span>
                <span className="font-bold text-emerald-400">{current.mode}</span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Active Stack Pointer</span>
                <span className="font-bold text-purple-400">{current.stack}</span>
              </div>
            </div>
          </div>

          {/* DTU Concept alert: Tail chaining */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
            <strong>DTU Exam Highlight (Tail-Chaining):</strong> If another equal or lower priority interrupt is pending when an ISR finishes, the processor skips unstacking and restacking! It transitions directly to the next ISR in only <strong>6 clock cycles</strong>, boosting real-time throughput by up to 50%!
          </div>
        </div>

        {/* Right: Stack Memory Frame Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Hardware Stack Frame (SP)
            </span>
            <span className="text-[10px] text-slate-400">High Memory Top</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {stackedRegisters.map((reg, idx) => {
              const isStacked = currentStage >= 2 && currentStage <= 5;
              return (
                <div
                  key={reg}
                  className={`p-2 rounded border text-center transition-all ${
                    isStacked
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] text-slate-400">SP + {32 - (idx * 4)}</span>
                    <span>{reg}</span>
                    <span className="text-[10px] text-amber-600">
                      {isStacked ? 'Pushed' : 'Idle'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 text-center mt-2 font-mono">
            Low Memory (SP Points Here) ↓
          </div>
        </div>
      </div>
    </div>
  );
};
