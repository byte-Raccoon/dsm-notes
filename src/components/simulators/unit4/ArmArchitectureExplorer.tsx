import React, { useState } from 'react';
import { Cpu, Shield, Zap, Database, ArrowRight, Layers, HelpCircle, CheckCircle } from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  category: 'Core' | 'Bus' | 'Interrupt' | 'Memory' | 'FPU';
  summary: string;
  specifications: string[];
  dtuExamSignificance: string;
}

export const ArmArchitectureExplorer: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<string>('core');

  const componentsData: Record<string, ComponentDetail> = {
    core: {
      id: 'core',
      name: 'ARM Cortex Core & ALU (Arithmetic Logic Unit)',
      category: 'Core',
      summary: 'High-performance 32-bit RISC processing core executing the Thumb-2 instruction set with a 3-stage pipeline (Fetch, Decode, Execute).',
      specifications: [
        'Architecture: ARMv7-M profile (Harvard architecture)',
        'Pipeline: 3-stage in-order pipeline with branch speculation',
        'Hardware Divide: 2 to 12 cycles for 32-bit signed/unsigned division',
        'Single-cycle Multiply: 32x32 multiply & MAC (Multiply-Accumulate)',
        'Thumb-2 Technology: Blends 16-bit and 32-bit instructions for 35% higher code density'
      ],
      dtuExamSignificance: 'Frequently asked in 5-mark questions: Explain ARM Cortex-M Harvard architecture vs Von Neumann and advantages of Thumb-2 ISA.'
    },
    registers: {
      id: 'registers',
      name: 'Register Bank (R0 - R15 & Special Registers)',
      category: 'Core',
      summary: 'Sixteen 32-bit registers available to programmer along with Program Status Register (xPSR) and special mask registers.',
      specifications: [
        'R0 - R7: Low registers accessible by all 16-bit and 32-bit instructions',
        'R8 - R12: High registers accessible by all 32-bit instructions',
        'R13 (SP): Dual banked Stack Pointer (MSP: Main Stack Pointer, PSP: Process Stack Pointer)',
        'R14 (LR): Link Register holding subroutine return address or EXC_RETURN code',
        'R15 (PC): Program Counter pointing to fetch address (Bit 0 always 0; Thumb bit in EPSR)',
        'xPSR: Program Status Register uniting APSR (flags), IPSR (ISR index), EPSR (Thumb mode bit)'
      ],
      dtuExamSignificance: 'Guaranteed 5-mark question in DTU: Explain the register organization of Cortex-M3/M4 with special emphasis on dual stack pointers (MSP vs PSP).'
    },
    nvic: {
      id: 'nvic',
      name: 'NVIC (Nested Vectored Interrupt Controller)',
      category: 'Interrupt',
      summary: 'Tightly coupled on-chip interrupt controller delivering deterministic, low-latency interrupt processing with hardware preemption.',
      specifications: [
        'Ultra-low Latency: Only 12 clock cycles interrupt entry latency',
        'Hardware Auto-Stacking: Automatically pushes R0-R3, R12, LR, PC, xPSR onto stack',
        'Tail-Chaining: Back-to-back interrupts switch in only 6 cycles without unstacking',
        'Late-Arrival: Higher priority interrupt arriving during stacking preempts instantly',
        'Vector Table: Direct 32-bit branch address lookups eliminating software dispatch tables'
      ],
      dtuExamSignificance: 'Crucial 5 or 10-mark question: Describe NVIC features, interrupt latency, tail-chaining, and automatic hardware stacking sequence.'
    },
    bus: {
      id: 'bus',
      name: 'Internal Harvard Bus Matrix',
      category: 'Bus',
      summary: 'Multi-layer advanced high-performance AHB-Lite bus matrix enabling parallel instruction fetches and data transfers without bus contention.',
      specifications: [
        'I-Code Bus: 32-bit AHB-Lite bus dedicated to instruction fetches from Code memory (0x00000000 - 0x1FFFFFFF)',
        'D-Code Bus: 32-bit AHB-Lite bus for literal loads and debug access to Code space',
        'System Bus: Connects core to SRAM, internal peripherals, and external memory spaces',
        'Private Peripheral Bus (PPB): 32-bit APB bus dedicated to internal core peripherals (NVIC, MPU, SysTick at 0xE0000000)'
      ],
      dtuExamSignificance: 'Questions often ask: Compare I-Code and D-Code bus roles and explain how Harvard architecture prevents bottlenecks in Cortex-M.'
    },
    fpu: {
      id: 'fpu',
      name: 'Floating-Point Unit (FPU - Cortex-M4 Only)',
      category: 'FPU',
      summary: 'Hardware single-precision FPv4-SP floating-point coprocessor compliant with IEEE 754 standard, executing floating point math in 1 cycle.',
      specifications: [
        'FP Registers: Thirty-two 32-bit single-precision registers (s0 - s31), or sixteen 64-bit double words (d0 - d15)',
        'FPSCR: Floating-Point Status and Control Register',
        'Lazy Stacking: Automatic hardware optimization skipping FPU register push if ISR uses no floats (saving 16 cycles)',
        'Performance: Single-cycle ADD, SUB, MUL; Hardware SQRT and DIV'
      ],
      dtuExamSignificance: 'Standard comparison question: Compare ARM Cortex-M3 vs Cortex-M4 and describe the role of FPU and DSP instructions in Cortex-M4.'
    },
    mpu: {
      id: 'mpu',
      name: 'MPU (Memory Protection Unit)',
      category: 'Memory',
      summary: 'Optional hardware block that divides memory map into up to 8 or 16 protected regions with configurable access permissions.',
      specifications: [
        'Enforces memory isolation between OS kernel and user tasks',
        'Prevents rogue tasks from corrupting OS kernel data structures or stack overflows',
        'Generates MemManage fault exception upon unauthorized access violation'
      ],
      dtuExamSignificance: 'Asked in short 2-mark notes on how RTOS security and unprivileged execution are enforced in Cortex-M.'
    }
  };

  const active = componentsData[selectedComp] || componentsData.core;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            Interactive ARM Cortex-M3 / M4 Architectural Block Explorer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click on any internal subsystem (Core, Registers, NVIC, Bus Matrix, FPU) to inspect its hardware blueprint.
          </p>
        </div>
      </div>

      {/* Main Interactive Circuit Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Visual Schematic (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
          <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
            <span>ARMv7-M Cortex Core Interconnect</span>
            <span className="text-blue-400 font-bold">Click any block below:</span>
          </div>

          <div className="space-y-3">
            {/* Top Row: Core CPU and FPU */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedComp('core')}
                className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                  selectedComp === 'core'
                    ? 'border-blue-500 bg-blue-950/60 text-white shadow-lg shadow-blue-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    32-bit RISC CPU & ALU
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Thumb-2</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  3-stage pipeline, hardware divide, single-cycle multiply.
                </p>
              </button>

              <button
                onClick={() => setSelectedComp('fpu')}
                className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                  selectedComp === 'fpu'
                    ? 'border-purple-500 bg-purple-950/60 text-white shadow-lg shadow-purple-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Single-Precision FPU
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Cortex-M4</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  FPv4-SP, 32 registers (s0-s31), hardware sqrt/div, lazy stacking.
                </p>
              </button>
            </div>

            {/* Middle Row: Register Bank & NVIC */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedComp('registers')}
                className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                  selectedComp === 'registers'
                    ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-lg shadow-emerald-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Register Bank
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">R0 - R15</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Dual stack pointers (MSP/PSP), Link Register, PC, xPSR.
                </p>
              </button>

              <button
                onClick={() => setSelectedComp('nvic')}
                className={`p-3.5 rounded-xl text-left border-2 transition-all ${
                  selectedComp === 'nvic'
                    ? 'border-amber-500 bg-amber-950/60 text-white shadow-lg shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    NVIC Interrupt Controller
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">12 Cycles</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Hardware stacking, tail-chaining, late arrival, 240 interrupts.
                </p>
              </button>
            </div>

            {/* Bus Matrix */}
            <button
              onClick={() => setSelectedComp('bus')}
              className={`w-full p-3.5 rounded-xl text-left border-2 transition-all ${
                selectedComp === 'bus'
                  ? 'border-cyan-500 bg-cyan-950/60 text-white shadow-lg shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Multi-Layer AHB-Lite Harvard Bus Matrix
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Parallel I/D</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>[I-Code: Flash Inst]</span>
                <span>[D-Code: Literal Data]</span>
                <span>[System Bus: SRAM/IO]</span>
              </div>
            </button>
          </div>
        </div>

        {/* Detailed Explanation Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {active.category} Subsystem
            </span>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-mono">
              ID: {active.id}
            </span>
          </div>

          <h5 className="font-bold text-base text-slate-900 dark:text-white mb-2">
            {active.name}
          </h5>

          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {active.summary}
          </p>

          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Key Technical Specifications:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {active.specifications.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DTU Exam note */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>DTU Examination Angle:</span>
            </div>
            <p className="leading-relaxed">{active.dtuExamSignificance}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
