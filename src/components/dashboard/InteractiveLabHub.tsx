import React, { useState } from 'react';
import { allUnits } from '../../data/syllabus';
import { FlaskConical, Sparkles, Layers, Cpu, Clock, Grid, ChevronRight } from 'lucide-react';

// Import all simulator components
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

interface InteractiveLabHubProps {
  initialUnitId?: string;
  initialSimKey?: string;
}

export const InteractiveLabHub: React.FC<InteractiveLabHubProps> = ({
  initialUnitId,
  initialSimKey = 'kmap-solver'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSimKey);
  const [unitFilter, setUnitFilter] = useState<string>(initialUnitId || 'all');

  const simulatorsList = [
    { id: 'base-converter', name: 'Base Radix Converter', unit: 'Unit 1', unitId: 'unit-1', desc: 'Successive division & multiplication algorithm visualizer' },
    { id: 'twos-complement', name: '2\'s Complement Visualizer', unit: 'Unit 1', unitId: 'unit-1', desc: 'Magnitude, 1s comp, 2s comp, and hardware range wheel' },
    { id: 'floating-point', name: 'IEEE 754 Floating-Point', unit: 'Unit 1', unitId: 'unit-1', desc: 'Single-precision 32-bit sign, exponent, and mantissa decoder' },
    { id: 'hamming-code', name: 'Hamming (7,4) Code', unit: 'Unit 1', unitId: 'unit-1', desc: 'Single-error detection, syndrome calculation, and auto-correction' },
    { id: 'gray-code', name: 'Gray Code & XOR Ladder', unit: 'Unit 1', unitId: 'unit-1', desc: 'Unit-distance code generator & optical shaft encoder' },
    { id: 'binary-arithmetic', name: 'Hardware Binary ALU', unit: 'Unit 1', unitId: 'unit-1', desc: 'Bitwise carry generation and 2s comp subtraction' },
    { id: 'booth-multiplier', name: 'Booth\'s Multiplier Stepper', unit: 'Unit 1', unitId: 'unit-1', desc: 'Signed 2\'s complement multiplication with ASR trace' },

    { id: 'logic-gates', name: 'Logic Gate Playground', unit: 'Unit 2', unitId: 'unit-2', desc: 'Live voltage signals, animated SVG gates, and truth tables' },
    { id: 'kmap-solver', name: 'K-Map Minimizer (2-5 Var)', unit: 'Unit 2', unitId: 'unit-2', desc: 'Interactive grouping algorithms, wrap-around loops, and minimal SOP' },
    { id: 'mux-demux', name: '4:1 MUX & Logic Generator', unit: 'Unit 2', unitId: 'unit-2', desc: 'Data selector and universal function generator' },
    { id: 'seven-segment', name: '7-Segment LED Decoder', unit: 'Unit 2', unitId: 'unit-2', desc: 'BCD to 7-segment display with Common Cathode/Anode modes' },
    { id: 'quine-mccluskey', name: 'Quine-McCluskey Solver', unit: 'Unit 2', unitId: 'unit-2', desc: 'Tabular minimization, dash pairing, and Prime Implicant chart' },
    { id: 'priority-comparator', name: 'Comparator & Priority Enc', unit: 'Unit 2', unitId: 'unit-2', desc: '4-bit 7485 comparator and 8-to-3 74148 priority encoder' },

    { id: 'flip-flop', name: 'Universal Flip-Flop Simulator', unit: 'Unit 3', unitId: 'unit-3', desc: 'SR, JK, D, T edge-triggered latches with dynamic timing diagrams' },
    { id: 'fsm-animator', name: 'FSM Sequence Detector', unit: 'Unit 3', unitId: 'unit-3', desc: 'Animated state graph with live input stream for pattern 1011' },

    { id: 'arm-architecture', name: 'ARM Cortex Architecture', unit: 'Unit 4', unitId: 'unit-4', desc: 'Clickable RISC core, ALU, NVIC, bus matrix, and MPU' },
    { id: 'register-bank', name: 'Register Bank & Assembly', unit: 'Unit 4', unitId: 'unit-4', desc: 'R0–R15 registers and APSR condition flags stepper' },
    { id: 'interrupt-animator', name: 'NVIC Interrupt Sequence', unit: 'Unit 4', unitId: 'unit-4', desc: '12-cycle hardware auto-stacking and mode transition' },
    { id: 'cortex-comparison', name: 'Cortex-M3 vs M4 Matrix', unit: 'Unit 4', unitId: 'unit-4', desc: 'Deep architectural comparison table and FPU specs' },
    { id: 'arm-memory-map', name: 'ARM 4GB Memory & Vectors', unit: 'Unit 4', unitId: 'unit-4', desc: 'Code, SRAM, Peripheral bit-banding, and PPB vector table' }
  ];

  const filteredSims = unitFilter === 'all'
    ? simulatorsList
    : simulatorsList.filter(s => s.unitId === unitFilter);

  const renderActiveSimulator = () => {
    switch (activeTab) {
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
      default: return <KMapSolver />;
    }
  };

  const currentSimInfo = simulatorsList.find(s => s.id === activeTab) || simulatorsList[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
            <FlaskConical className="w-3.5 h-3.5 text-cyan-300" />
            <span>Virtual Hardware Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Systems & Microcontroller Simulators
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Real, fully interactive working simulations of the entire IT201 curriculum. Change inputs, observe live gate propagation, and verify exam solutions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All 16 Simulators' },
          { id: 'unit-1', label: 'Unit 1: Number Systems' },
          { id: 'unit-2', label: 'Unit 2: Combinational Logic' },
          { id: 'unit-3', label: 'Unit 3: Sequential Circuits' },
          { id: 'unit-4', label: 'Unit 4: ARM Cortex-M' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setUnitFilter(filter.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              unitFilter === filter.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Simulator Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {filteredSims.map(sim => {
          const isActive = activeTab === sim.id;
          return (
            <button
              key={sim.id}
              onClick={() => setActiveTab(sim.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${
                  isActive ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {sim.unit}
                </span>
                <span className="font-bold text-xs block leading-tight">
                  {sim.name}
                </span>
              </div>
              <span className={`text-[10px] mt-2 line-clamp-1 ${
                isActive ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {sim.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Simulator Window */}
      <div className="pt-2">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Simulator: {currentSimInfo.name} ({currentSimInfo.unit})
          </span>
        </div>
        {renderActiveSimulator()}
      </div>
    </div>
  );
};
