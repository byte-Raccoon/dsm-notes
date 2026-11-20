import { UnitInfo } from '../types';
import { unit1Lessons } from './units/unit1';
import { unit2Lessons } from './units/unit2';
import { unit3Lessons } from './units/unit3';
import { unit4Lessons } from './units/unit4';

export const allUnits: UnitInfo[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Number Systems and Codes',
    description: 'Positional number systems, radix conversions, signed magnitude, 1s & 2s complement arithmetic, IEEE 754 floating point, and computer codes (BCD, Gray, Excess-3, Parity, Hamming single-error correction).',
    hours: 12,
    accentColor: 'from-blue-600 to-indigo-600',
    topicsCount: unit1Lessons.length,
    lessons: unit1Lessons,
    simulators: [
      { id: 'base-converter', name: 'Base Radix Converter', description: 'Step-by-step division & multiplication radix converter' },
      { id: 'twos-complement', name: '2\'s Complement Visualizer', description: '3-stage inversion, wheel range, and overflow detector' },
      { id: 'floating-point', name: 'IEEE 754 32-Bit Float', description: 'Bit-by-bit exponent, mantissa, and denormal decoder' },
      { id: 'hamming-code', name: 'Hamming (7,4) Code', description: 'Syndrome error locator and auto-corrector' },
      { id: 'gray-code', name: 'Gray Code XOR Ladder', description: 'Unit-distance code generator & optical encoder demo' },
      { id: 'binary-arithmetic', name: 'Hardware Binary ALU', description: 'Bitwise carry generation and 2s comp subtraction' },
      { id: 'booth-multiplier', name: 'Booth\'s Multiplier Stepper', description: 'Signed 2s comp Booth algorithm with A, Q, Q-1 registers & ASR' }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Combinational Logic Design',
    description: 'Logic gates, Boolean algebra, 2 to 5-variable K-maps, minterms/maxterms, don\'t cares, Quine-McCluskey, Multiplexers, Decoders, Adders/Subtractors, Comparators, and 7-Segment Displays.',
    hours: 12,
    accentColor: 'from-cyan-600 to-blue-600',
    topicsCount: unit2Lessons.length,
    lessons: unit2Lessons,
    simulators: [
      { id: 'logic-gates', name: 'Logic Gate Playground', description: 'Live voltage propagation and dynamic truth table' },
      { id: 'kmap-solver', name: 'K-Map Solver (2 to 5 Vars)', description: 'Cell grouping algorithms and minimal SOP/POS generator' },
      { id: 'mux-demux', name: '4:1 MUX & Function Generator', description: 'Data routing and universal logic function synthesis' },
      { id: 'seven-segment', name: '7-Segment LED Decoder', description: 'Interactive BCD to 7-segment display with CC/CA modes' },
      { id: 'quine-mccluskey', name: 'Quine-McCluskey Tabular Solver', description: 'Step 1 grouping, Step 2 pair matching, and EPI coverage chart' },
      { id: 'priority-comparator', name: 'Comparator & Priority Encoder', description: '4-bit 7485 cascade comparator and 8-to-3 74148 priority encoder' }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Synchronous and Asynchronous Sequential Circuits',
    description: 'Flip-flops (SR, JK, D, T), master-slave edge triggering, FSM models (Moore & Mealy), synchronous synthesis, state reduction, fundamental mode asynchronous circuits, races, and hazards.',
    hours: 10,
    accentColor: 'from-purple-600 to-pink-600',
    topicsCount: unit3Lessons.length,
    lessons: unit3Lessons,
    simulators: [
      { id: 'flip-flop', name: 'Universal Flip-Flop Simulator', description: 'SR, JK, D, T latches with dynamic timing diagrams' },
      { id: 'fsm-animator', name: 'FSM Sequence Detector (1011)', description: 'Animated state transition graph with live input stream' }
    ]
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'ARM Microcontrollers',
    description: 'ARM Cortex-M3 and Cortex-M4 architecture, Harvard bus matrix, Thread vs Handler modes, R0–R15 registers, dual stack pointers (MSP/PSP), xPSR flags, FPU, and DSP SIMD extensions.',
    hours: 8,
    accentColor: 'from-emerald-600 to-teal-600',
    topicsCount: unit4Lessons.length,
    lessons: unit4Lessons,
    simulators: [
      { id: 'arm-architecture', name: 'ARM Cortex Architecture Explorer', description: 'Clickable core, ALU, NVIC, bus matrix, and MPU blocks' },
      { id: 'register-bank', name: 'Register Bank & Assembly Stepper', description: 'R0–R15 register states and APSR condition flags' },
      { id: 'interrupt-animator', name: 'NVIC Interrupt Sequence', description: '12-cycle hardware auto-stacking and mode transition' },
      { id: 'cortex-comparison', name: 'Cortex-M3 vs Cortex-M4 Matrix', description: 'Deep architectural comparison table and FPU specs' },
      { id: 'arm-memory-map', name: 'ARM 4GB Memory Map & Vectors', description: 'Code, SRAM, Peripheral bit-banding, and PPB vector table' }
    ]
  }
];

export const getUnitById = (id: string): UnitInfo | undefined => {
  return allUnits.find(u => u.id === id);
};

export const getLessonById = (lessonId: string): { lesson?: any; unit?: UnitInfo } => {
  for (const u of allUnits) {
    const found = u.lessons.find(l => l.id === lessonId);
    if (found) return { lesson: found, unit: u };
  }
  return {};
};
