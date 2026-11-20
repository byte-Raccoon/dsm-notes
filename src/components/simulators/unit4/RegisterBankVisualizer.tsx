import React, { useState } from 'react';
import { Database, Play, RotateCcw, ArrowRight, Check } from 'lucide-react';

interface InstructionStep {
  asm: string;
  explanation: string;
  modifiedRegs: string[];
  updates: Record<string, number | string>;
  flags: { N: number; Z: number; C: number; V: number };
}

export const RegisterBankVisualizer: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [activeSp, setActiveSp] = useState<'MSP' | 'PSP'>('MSP');

  // Interactive sample program sequence
  const programSteps: InstructionStep[] = [
    {
      asm: '; Initial State at Reset',
      explanation: 'System boots: PC loaded from Vector 1 (Reset Handler), SP loaded from Vector 0.',
      modifiedRegs: ['PC', 'SP'],
      updates: { R0: 0, R1: 0, R2: 0, R3: 0, SP: '0x20008000', LR: '0xFFFFFFFF', PC: '0x08000150' },
      flags: { N: 0, Z: 0, C: 0, V: 0 }
    },
    {
      asm: 'MOV R0, #25',
      explanation: 'Loads immediate 32-bit constant decimal 25 (0x19) into register R0.',
      modifiedRegs: ['R0', 'PC'],
      updates: { R0: 25, PC: '0x08000154' },
      flags: { N: 0, Z: 0, C: 0, V: 0 }
    },
    {
      asm: 'MOV R1, #15',
      explanation: 'Loads immediate decimal 15 (0x0F) into register R1.',
      modifiedRegs: ['R1', 'PC'],
      updates: { R1: 15, PC: '0x08000158' },
      flags: { N: 0, Z: 0, C: 0, V: 0 }
    },
    {
      asm: 'ADDS R2, R0, R1',
      explanation: 'Adds R0 + R1 (25 + 15 = 40) into R2. "S" suffix instructs ALU to update APSR flags.',
      modifiedRegs: ['R2', 'PC'],
      updates: { R2: 40, PC: '0x0800015C' },
      flags: { N: 0, Z: 0, C: 0, V: 0 }
    },
    {
      asm: 'SUBS R3, R1, #15',
      explanation: 'Subtracts 15 from R1 (15 - 15 = 0) into R3. Result is 0, so ZERO flag (Z) is set to 1!',
      modifiedRegs: ['R3', 'PC'],
      updates: { R3: 0, PC: '0x08000160' },
      flags: { N: 0, Z: 1, C: 1, V: 0 } // C=1 indicates no borrow in ARM subtraction
    },
    {
      asm: 'BL compute_sqrt',
      explanation: 'Branch with Link: Saves return address (0x08000168) into Link Register (LR / R14) and branches PC.',
      modifiedRegs: ['LR', 'PC'],
      updates: { LR: '0x08000168', PC: '0x08000300' },
      flags: { N: 0, Z: 1, C: 1, V: 0 }
    }
  ];

  // Accumulate register states up to current step
  const getRegisterState = () => {
    let state: Record<string, any> = {
      R0: 0, R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0,
      R8: 0, R9: 0, R10: 0, R11: 0, R12: 0,
      SP: '0x20008000', LR: '0xFFFFFFFF', PC: '0x08000150'
    };
    for (let i = 0; i <= currentStepIdx; i++) {
      state = { ...state, ...programSteps[i].updates };
    }
    return state;
  };

  const regState = getRegisterState();
  const currentStep = programSteps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < programSteps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            ARM Cortex-M Register Bank & Assembly Execution Simulator
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Step through Thumb-2 instructions and witness live updates to R0–R15 and APSR condition flags (N, Z, C, V).
          </p>
        </div>

        {/* Stepper buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Program
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIdx >= programSteps.length - 1}
            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded font-bold shadow"
          >
            <Play className="w-3.5 h-3.5" /> Step Instruction (F10)
          </button>
        </div>
      </div>

      {/* Code execution bar */}
      <div className="mb-5 p-4 bg-slate-950 text-emerald-400 font-mono rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Currently Executing Instruction:</span>
          <span className="text-base font-bold text-white">{currentStep.asm}</span>
          <p className="text-xs text-slate-400 mt-1 font-sans">{currentStep.explanation}</p>
        </div>
        <div className="text-xs text-slate-400">
          Step {currentStepIdx + 1} of {programSteps.length}
        </div>
      </div>

      {/* Register Banks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
        {/* Low Registers R0 - R7 */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
              Low Registers (R0 - R7)
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-mono">
              All 16/32-bit Inst
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'].map(r => {
              const isModified = currentStep.modifiedRegs.includes(r);
              return (
                <div
                  key={r}
                  className={`p-2 rounded border transition-all ${
                    isModified
                      ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 block">{r}</span>
                  <span>{regState[r]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Registers R8 - R12 */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
              High Registers (R8 - R12)
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 font-mono">
              32-bit Inst
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {['R8', 'R9', 'R10', 'R11', 'R12'].map(r => (
              <div
                key={r}
                className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              >
                <span className="text-[10px] text-slate-400 block">{r}</span>
                <span>{regState[r]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Registers R13, R14, R15 & PSR */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
            Special Control Registers (R13, R14, R15)
          </span>

          <div className="space-y-2 font-mono text-xs">
            {/* SP (R13) */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-blue-500 font-bold block">R13 (SP - {activeSp})</span>
                <span className="font-bold">{regState.SP}</span>
              </div>
              <button
                onClick={() => setActiveSp(activeSp === 'MSP' ? 'PSP' : 'MSP')}
                className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
              >
                Toggle {activeSp === 'MSP' ? 'PSP' : 'MSP'}
              </button>
            </div>

            {/* LR (R14) */}
            <div className={`p-2 rounded border flex justify-between items-center ${
              currentStep.modifiedRegs.includes('LR')
                ? 'bg-purple-100 dark:bg-purple-950 border-purple-400 text-purple-900 dark:text-purple-200 font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <div>
                <span className="text-[10px] text-purple-500 font-bold block">R14 (LR - Link Register)</span>
                <span>{regState.LR}</span>
              </div>
            </div>

            {/* PC (R15) */}
            <div className={`p-2 rounded border flex justify-between items-center ${
              currentStep.modifiedRegs.includes('PC')
                ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <div>
                <span className="text-[10px] text-amber-500 font-bold block">R15 (PC - Program Counter)</span>
                <span>{regState.PC}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APSR Status Flags Bar */}
      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block font-mono">
            Application Program Status Register (APSR Condition Flags):
          </span>
          <span className="text-[11px] text-slate-500">Updated by instructions with 'S' suffix (e.g. ADDS, SUBS, CMP)</span>
        </div>

        <div className="flex gap-2 font-mono">
          {[
            { name: 'N (Negative)', val: currentStep.flags.N, desc: 'MSB is 1' },
            { name: 'Z (Zero)', val: currentStep.flags.Z, desc: 'Result is 0' },
            { name: 'C (Carry)', val: currentStep.flags.C, desc: 'Carry / No borrow' },
            { name: 'V (Overflow)', val: currentStep.flags.V, desc: 'Signed overflow' },
          ].map(flag => (
            <div
              key={flag.name}
              className={`px-3 py-1.5 rounded-lg text-center border transition-all ${
                flag.val === 1
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold shadow'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
            >
              <div className="text-[10px]">{flag.name.split(' ')[0]}</div>
              <div className="text-base">{flag.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
