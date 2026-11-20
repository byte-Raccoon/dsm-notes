import { PracticeQuestion } from '../../types';

export interface ExamQuestion {
  id: string;
  unitId: string;
  marks: 2 | 3 | 5 | 10;
  category: '2-Mark Short Concept' | '3-Mark Conversion/Derivation' | '5-Mark Standard Question' | '10-Mark Comprehensive Design';
  title: string;
  question: string;
  markingScheme: { step: string; marks: number }[];
  modelAnswer: string;
  examinerTips: string;
}

export const dtuExamQuestionBank: ExamQuestion[] = [
  // Unit 1 Questions
  {
    id: 'dtu-u1-1',
    unitId: 'unit-1',
    marks: 2,
    category: '2-Mark Short Concept',
    title: 'Why is Gray code called a unit-distance code?',
    question: 'Define Gray code. Why is it referred to as a unit-distance code, and where is it used in physical engineering systems?',
    markingScheme: [
      { step: 'Definition and property (only 1 bit changes between consecutive numbers)', marks: 1 },
      { step: 'Application (optical shaft encoders and K-map adjacent cells to prevent glitches)', marks: 1 }
    ],
    modelAnswer: 'A Gray code (or reflected binary code) is an unweighted code in which any two consecutive numbers differ by exactly one binary digit (Hamming distance = 1). In physical shaft angle encoders, multiple bits changing simultaneously in standard binary can cause spurious intermediate readings due to mechanical tolerances. Gray code guarantees only one sensor switches at any instant, eliminating false transient readings.',
    examinerTips: 'Do not just give the binary values; state the Hamming distance equals 1 and mention optical shaft encoders.'
  },
  {
    id: 'dtu-u1-2',
    unitId: 'unit-1',
    marks: 5,
    category: '5-Mark Standard Question',
    title: '2\'s Complement Subtraction & Overflow',
    question: 'Subtract (54)₁₀ from (37)₁₀ using 8-bit 2\'s complement arithmetic. Explain the role of the carry flag and state the mathematical condition for hardware overflow.',
    markingScheme: [
      { step: 'Binary conversion of +37 and +54', marks: 1 },
      { step: 'Correct 2s complement of 54', marks: 1 },
      { step: 'Addition operation and result verification', marks: 2 },
      { step: 'Explanation of carry flag and overflow formula V = C_in ⊕ C_out', marks: 1 }
    ],
    modelAnswer: '+37 = 00100101₂. +54 = 00110110₂.\n1s comp of 54 = 11001001. 2s comp of 54 = 11001010₂.\nAdd: 00100101 + 11001010 = 11101111₂.\nEnd carry = 0, indicating a negative result. Magnitude = -(2s comp of 11101111) = -(00010001₂) = -17₁₀.\nHardware overflow V = C7 ⊕ C8 = 0 ⊕ 0 = 0 (No overflow occurred).',
    examinerTips: 'Mention both the carry flag (unsigned) and overflow flag V (signed).'
  },

  // Unit 2 Questions
  {
    id: 'dtu-u2-1',
    unitId: 'unit-2',
    marks: 10,
    category: '10-Mark Comprehensive Design',
    title: 'Full Adder Design & Universal MUX Implementation',
    question: '(a) Design a Full Adder circuit using minimum number of 2-input NAND gates. (b) Implement the Full Adder sum and carry outputs using two 8:1 Multiplexers.',
    markingScheme: [
      { step: 'Full Adder truth table & equations S = A⊕B⊕Cin, Cout = AB + Cin(A⊕B)', marks: 2 },
      { step: 'Derivation and logic diagram using exactly 9 NAND gates', marks: 3 },
      { step: '8:1 MUX implementation table for Sum', marks: 2.5 },
      { step: '8:1 MUX implementation table for Carry', marks: 2.5 }
    ],
    modelAnswer: 'Part (a): Full Adder requires 9 NAND gates: 5 NAND gates implement the two cascaded XOR operations (A ⊕ B ⊕ Cin) for Sum, and 4 NAND gates generate the Carry Cout.\nPart (b): For 8:1 MUX implementation, connect select lines S2=A, S1=B, S0=Cin. For Sum S: Apply 1 to inputs I1, I2, I4, I7; apply 0 to I0, I3, I5, I6. For Carry Cout: Apply 1 to inputs I3, I5, I6, I7; apply 0 to I0, I1, I2, I4.',
    examinerTips: 'Drawing the exact 9-NAND gate layout is a classic DTU mid-term question that awards full 5 marks for part a.'
  },

  // Unit 3 Questions
  {
    id: 'dtu-u3-1',
    unitId: 'unit-3',
    marks: 5,
    category: '5-Mark Standard Question',
    title: 'Race-Around Condition in JK Flip-Flop',
    question: 'What is the race-around condition in a JK flip-flop? State the condition under which it occurs and explain how Master-Slave JK flip-flop overcomes this problem.',
    markingScheme: [
      { step: 'Explanation of race-around condition with timing conditions t_p > t_pd', marks: 2 },
      { step: 'Master-Slave circuit diagram with inverted clock connection', marks: 2 },
      { step: 'Operation during Clock=1 and Clock=0', marks: 1 }
    ],
    modelAnswer: 'In a level-triggered JK flip-flop, when J=1, K=1, and Clock=1, the output toggles every propagation delay tpd. If the clock pulse width tp is greater than tpd, the output oscillates uncontrollably between 0 and 1 before the clock goes low, resulting in an unpredictable final state.\nMaster-Slave JK flip-flop overcomes this by splitting storage into two latches: Master latch operates on Clock=1 while Slave is disabled. When Clock drops to 0, Master is disabled and Slave transfers the state to output Q. Since Master and Slave are never enabled simultaneously, output feedback cannot loop back within the same clock period.',
    examinerTips: 'Draw the waveform showing tp, tpd, and multiple toggles during Clock=1.'
  },
  {
    id: 'dtu-u3-2',
    unitId: 'unit-3',
    marks: 10,
    category: '10-Mark Comprehensive Design',
    title: 'Synchronous Sequence Detector Design',
    question: 'Design a synchronous Mealy sequence detector to detect the sequence "1101" from a continuous serial input stream. Allow overlapping. Use JK flip-flops.',
    markingScheme: [
      { step: 'State diagram with 4 states and transitions', marks: 3 },
      { step: 'State table with excitation columns for JA, KA, JB, KB', marks: 3 },
      { step: 'K-map simplification for JK inputs and output Y', marks: 2 },
      { step: 'Final logic schematic with interconnected JK flip-flops', marks: 2 }
    ],
    modelAnswer: 'States: S0 (No match), S1 ("1"), S2 ("11"), S3 ("110"). 4 states require 2 flip-flops (A, B). Overlapping transition from S3 on input 1: sequence 1101 detected (Y=1) and transitions to S1 because the last "1" starts a new sequence. Synthesized using JK excitation tables.',
    examinerTips: 'Specify whether overlapping is allowed in the introductory sentence of your solution.'
  },

  // Unit 4 Questions
  {
    id: 'dtu-u4-1',
    unitId: 'unit-4',
    marks: 5,
    category: '5-Mark Standard Question',
    title: 'ARM Cortex-M Operating Modes and Stack Pointers',
    question: 'Explain the two operating modes (Thread and Handler) and the dual stack pointers (MSP and PSP) of the ARM Cortex-M processor. How are they controlled?',
    markingScheme: [
      { step: 'Definition of Thread mode and Handler mode', marks: 2 },
      { step: 'Explanation of MSP and PSP roles in RTOS/OS', marks: 2 },
      { step: 'Role of CONTROL register bits', marks: 1 }
    ],
    modelAnswer: 'ARM Cortex-M operates in two modes:\n1. Thread Mode: Default execution mode for user applications and background software. Can run in Privileged or Unprivileged level.\n2. Handler Mode: Entered whenever an exception or interrupt occurs. Always runs in Privileged level and always uses the Main Stack Pointer (MSP).\nDual Stack Pointers:\n- MSP (Main Stack Pointer): Used by OS kernel and all interrupt service routines.\n- PSP (Process Stack Pointer): Used by application tasks in multi-tasking RTOS systems.\nControlled by the CONTROL register: Bit 0 selects privilege level, and Bit 1 selects active stack pointer (0=MSP, 1=PSP).',
    examinerTips: 'Explicitly state that Handler mode CANNOT use PSP; it is hardwired to use MSP.'
  },
  {
    id: 'dtu-u4-2',
    unitId: 'unit-4',
    marks: 5,
    category: '5-Mark Standard Question',
    title: 'Cortex-M3 vs Cortex-M4 and FPU Features',
    question: 'Compare the ARM Cortex-M3 and Cortex-M4 microcontrollers. Explain the role of the FPU, FPU registers, and the Lazy Stacking feature.',
    markingScheme: [
      { step: 'Comparison of architecture, instructions (DSP SIMD), and FPU', marks: 2 },
      { step: 'FPU registers s0-s31 and d0-d15 description', marks: 1.5 },
      { step: 'Lazy Stacking mechanism and interrupt latency preservation', marks: 1.5 }
    ],
    modelAnswer: 'Cortex-M3 implements ARMv7-M with Thumb-2. Cortex-M4 implements ARMv7E-M, adding hardware DSP SIMD instructions and an optional single-precision IEEE 754 Floating-Point Unit (FPv4-SP).\nThe FPU features 32 single-precision registers (s0–s31), also addressable as 16 double-word registers (d0–d15), and the FPSCR status register.\nLazy Stacking is an architectural hardware feature that preserves 12-cycle deterministic interrupt latency: when an exception occurs, the processor reserves space on the stack for FPU registers, but defers actually writing them until the ISR executes a floating-point instruction. If the ISR does not use floating-point operations, no FPU registers are saved, eliminating unnecessary clock cycle overhead.',
    examinerTips: 'Include a clean 4-column comparison table (Feature, Cortex-M3, Cortex-M4, Significance).'
  }
];

export const allMockQuizzes: Record<string, { title: string; questions: PracticeQuestion[] }> = {
  'unit-1': {
    title: 'Unit 1: Number Systems and Computer Codes Comprehensive Assessment',
    questions: [
      {
        id: 'q-u1-1',
        type: 'mcq',
        question: 'What is the 8-bit 2\'s complement representation of decimal -18?',
        options: ['11101110', '11101101', '10010010', '00010010'],
        correctAnswer: 0,
        explanation: '+18 in 8 bits = 00010010. 1s complement = 11101101. Add 1 = 11101110.',
        distractorExplanations: {
          1: 'This is the 1s complement (forgot to add 1).',
          2: 'This is signed-magnitude format (10010010).',
          3: 'This is positive +18.'
        },
        marks: 2
      },
      {
        id: 'q-u1-2',
        type: 'mcq',
        question: 'Under IEEE 754 single-precision format, what is the biased exponent value stored for the number (0.5)₁₀?',
        options: ['126', '127', '128', '125'],
        correctAnswer: 0,
        explanation: '0.5 = 1.0 × 2⁻¹. True exponent e = -1. Biased exponent E = e + 127 = -1 + 127 = 126.',
        distractorExplanations: {
          1: '127 corresponds to 2^0 (1.0).',
          2: '128 corresponds to 2^+1 (2.0).',
          3: '125 corresponds to 2^-2 (0.25).'
        },
        marks: 2
      },
      {
        id: 'q-u1-3',
        type: 'numerical',
        question: 'Convert decimal (75)₁₀ into its BCD (8421) representation in binary without spaces.',
        correctAnswer: '01110101',
        explanation: '7 = 0111, 5 = 0101. Concatenating gives 01110101.',
        marks: 2
      },
      {
        id: 'q-u1-4',
        type: 'mcq',
        question: 'If a 7-bit Hamming code with even parity receives 1100110, and syndrome (S4 S2 S1) evaluates to (1 0 1)₂, which bit is erroneous?',
        options: ['Bit 5', 'Bit 3', 'Bit 6', 'No error'],
        correctAnswer: 0,
        explanation: 'The syndrome value in binary is (1 0 1)₂ = 5 in decimal, meaning Bit 5 is corrupted and must be inverted.',
        marks: 2
      }
    ]
  },
  'unit-2': {
    title: 'Unit 2: Combinational Logic Circuits Assessment',
    questions: [
      {
        id: 'q-u2-1',
        type: 'mcq',
        question: 'In a 4-variable K-map, an isolated group containing 4 corner cells m(0, 2, 8, 10) simplifies to which minimal term?',
        options: ['B̅ · D̅', 'A̅ · C̅', 'B · D', 'A̅ · D̅'],
        correctAnswer: 0,
        explanation: 'm0=0000, m2=0010, m8=1000, m10=1010. Across all four cells, B=0 and D=0 remain constant, while A and C toggle. Term is B̅D̅.',
        marks: 2
      },
      {
        id: 'q-u2-2',
        type: 'mcq',
        question: 'How many select lines are required for a 32:1 Multiplexer?',
        options: ['5 select lines', '4 select lines', '6 select lines', '32 select lines'],
        correctAnswer: 0,
        explanation: '2^n = 32 -> n = log2(32) = 5 select lines.',
        marks: 2
      },
      {
        id: 'q-u2-3',
        type: 'mcq',
        question: 'In a 4-bit parallel Adder/Subtractor with mode control line M, what is the role of M?',
        options: [
          'When M=0, it adds (Cin=0, B is unchanged); When M=1, it subtracts (Cin=1, B is inverted via XOR).',
          'When M=1, it adds; When M=0, it subtracts.',
          'M selects between signed and unsigned representation.',
          'M disables the circuit when high.'
        ],
        correctAnswer: 0,
        explanation: 'M controls XOR gates: B ⊕ 0 = B (Add). B ⊕ 1 = B̅ with Cin=1 produces A + B̅ + 1 = A - B (2s complement subtract).',
        marks: 2
      }
    ]
  },
  'unit-3': {
    title: 'Unit 3: Sequential Circuits & FSM Assessment',
    questions: [
      {
        id: 'q-u3-1',
        type: 'mcq',
        question: 'What is the characteristic equation of a JK flip-flop?',
        options: [
          'Q(t+1) = J·Q̅ + K̅·Q',
          'Q(t+1) = J·Q + K·Q̅',
          'Q(t+1) = J ⊕ K',
          'Q(t+1) = J + K̅·Q'
        ],
        correctAnswer: 0,
        explanation: 'By the truth table of a JK flip-flop: Q(t+1) = J·Q̅ + K̅·Q.',
        marks: 2
      },
      {
        id: 'q-u3-2',
        type: 'mcq',
        question: 'Which statement correctly distinguishes a Moore FSM from a Mealy FSM?',
        options: [
          'In a Moore machine, output depends strictly on the current state; in a Mealy machine, output depends on both current state and present input.',
          'A Moore machine has no clock signal.',
          'A Mealy machine always requires more states than a Moore machine for the same problem.',
          'In a Moore machine, outputs are asynchronous to the clock.'
        ],
        correctAnswer: 0,
        explanation: 'Moore outputs depend only on state: Y = g(S). Mealy outputs depend on state and input: Y = g(S, X).',
        marks: 2
      }
    ]
  },
  'unit-4': {
    title: 'Unit 4: ARM Cortex-M Architecture Assessment',
    questions: [
      {
        id: 'q-u4-1',
        type: 'mcq',
        question: 'Which register in ARM Cortex-M holds the return address during subroutine branch calls (`BL`)?',
        options: ['R14 (Link Register / LR)', 'R15 (Program Counter / PC)', 'R13 (Stack Pointer / SP)', 'R12 (Intra-Procedure Call IP)'],
        correctAnswer: 0,
        explanation: 'R14 is the Link Register (LR), which holds the return address when calling a subroutine with BL and holds EXC_RETURN during interrupts.',
        marks: 2
      },
      {
        id: 'q-u4-2',
        type: 'mcq',
        question: 'What is the purpose of the Thumb bit (T) in the EPSR register of an ARM Cortex-M processor?',
        options: [
          'It must always be 1 to indicate Thumb state; clearing it triggers a HardFault.',
          'It indicates whether the processor is in Handler or Thread mode.',
          'It enables the Floating-Point Unit.',
          'It toggles between 16-bit and 64-bit execution modes.'
        ],
        correctAnswer: 0,
        explanation: 'Cortex-M supports only Thumb state. Bit 24 of EPSR (T-bit) must always be 1; if an instruction attempts to clear it, an immediate fault occurs.',
        marks: 2
      }
    ]
  }
};
