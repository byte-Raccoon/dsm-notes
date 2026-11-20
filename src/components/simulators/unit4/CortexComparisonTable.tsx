import React, { useState } from 'react';
import { Cpu, Check, X, Zap, Sparkles } from 'lucide-react';

export const CortexComparisonTable: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'differences'>('all');

  const rows = [
    {
      feature: 'Core Architecture',
      m3: 'ARMv7-M (32-bit Harvard)',
      m4: 'ARMv7E-M (32-bit Harvard with DSP extensions)',
      isDifferent: true,
      examTip: 'M4 adds "E" (Extended DSP instructions).'
    },
    {
      feature: 'Instruction Set (ISA)',
      m3: 'Thumb-2 (16-bit & 32-bit)',
      m4: 'Thumb-2 + DSP SIMD instructions',
      isDifferent: true,
      examTip: 'Cortex-M4 includes saturating arithmetic & SIMD instructions.'
    },
    {
      feature: 'Floating-Point Unit (FPU)',
      m3: 'No Hardware FPU (Software Emulation via libraries)',
      m4: 'Hardware Single-Precision FPU (FPv4-SP, IEEE 754 compliant)',
      isDifferent: true,
      examTip: 'Direct 5-mark question: Role and registers (s0-s31) of FPU in Cortex-M4.'
    },
    {
      feature: 'DSP Instructions & SIMD',
      m3: 'Not Supported',
      m4: 'Supported (Single-cycle 16/32-bit MAC, dual 16-bit math)',
      isDifferent: true,
      examTip: 'Enables high-speed audio, FFT, and filter processing without external DSP.'
    },
    {
      feature: 'Pipeline Depth',
      m3: '3-stage (Fetch, Decode, Execute)',
      m4: '3-stage (Fetch, Decode, Execute) + branch speculation',
      isDifferent: false,
      examTip: 'Both use 3-stage in-order pipeline.'
    },
    {
      feature: 'Hardware Divide',
      m3: 'Yes (2 to 12 clock cycles, SDIV / UDIV)',
      m4: 'Yes (2 to 12 clock cycles, SDIV / UDIV)',
      isDifferent: false,
      examTip: 'Both feature fast division units.'
    },
    {
      feature: 'Interrupt Controller (NVIC)',
      m3: 'Nested Vectored (up to 240 IRQs, 12-cycle latency)',
      m4: 'Nested Vectored (up to 240 IRQs, 12-cycle latency, lazy stacking)',
      isDifferent: true,
      examTip: 'M4 adds lazy stacking for FPU registers to preserve 12-cycle latency.'
    },
    {
      feature: 'Typical Target Applications',
      m3: 'Smart meters, industrial controllers, automotive body electronics',
      m4: 'Motor control, digital audio, biometric sensors, drone stabilization, IoT DSP',
      isDifferent: true,
      examTip: 'M4 bridges microcontroller and digital signal processor.'
    }
  ];

  const displayedRows = filter === 'differences' ? rows.filter(r => r.isDifferent) : rows;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            ARM Cortex-M3 vs Cortex-M4 Deep Architectural Comparison
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Standard DTU 5-mark examination topic comparing core features, FPU, DSP capabilities, and memory operations.
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Show All Specs
          </button>
          <button
            onClick={() => setFilter('differences')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              filter === 'differences' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Highlight Key Differences Only
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="py-2.5 px-3 font-semibold">Architectural Feature</th>
              <th className="py-2.5 px-3 font-semibold text-blue-600 dark:text-blue-400">ARM Cortex-M3</th>
              <th className="py-2.5 px-3 font-semibold text-purple-600 dark:text-purple-400">ARM Cortex-M4</th>
              <th className="py-2.5 px-3 font-semibold">DTU Exam Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedRows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  row.isDifferent
                    ? 'hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                  {row.feature}
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                  {row.m3}
                </td>
                <td className="py-3 px-3 text-purple-700 dark:text-purple-300 font-medium">
                  {row.m4}
                </td>
                <td className="py-3 px-3 text-slate-500 italic text-[11px]">
                  {row.examTip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
