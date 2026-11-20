import { LessonContent } from '../../types';

export const unit3Lessons: LessonContent[] = [
  {
    id: 'u3-l1-sequential-circuits-and-flipflops',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Synchronous & Asynchronous Sequential Circuits',
    title: 'Sequential Circuit Models & Flip-Flop Conversion',
    subtitle: 'SR, JK, D, T flip-flops, characteristic tables, excitation tables, race-around condition, master-slave latching, and conversion between flip-flops',
    estimatedMinutes: 35,
    order: 1,
    prerequisites: ['Combinational logic gates', 'Feedback paths'],
    whatIsIt: {
      simpleSummary: 'Unlike combinational circuits whose outputs depend solely on present inputs, sequential circuits contain memory elements. Their present output depends on both the present inputs AND past history (stored internal state). The fundamental 1-bit memory building block is the Flip-Flop.',
      coreDefinition: 'A sequential circuit consists of a combinational logic network with a feedback loop containing memory elements (latches or flip-flops) synchronized to a periodic Clock signal.',
      keyAnalogy: 'A combinational circuit is like a simple calculator (2 + 3 always equals 5). A sequential circuit is like a combination lock: entering the number 4 opens the safe ONLY IF you entered 1, 2, and 3 previously in the correct historical sequence!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Without memory, a computer could not count, store variables, execute loops, or maintain program counter state. Flip-flops provide the static RAM (SRAM) registers and cache inside microcontrollers like the ARM Cortex-M.',
      engineeringBenefit: 'Edge-triggered flip-flops sample inputs at the exact transition edge of the clock (0 -> 1), completely preventing output changes from looping back and corrupting the input during the same clock cycle.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'SR Latch to SR Flip-Flop',
          description: 'Cross-coupled NAND or NOR gates. S=1 sets Q=1; R=1 resets Q=0; S=R=0 holds state. S=R=1 is FORBIDDEN because it causes indeterminate output and race condition upon release.',
          codeOrFormula: 'Q(t+1) = S + R̅·Q with constraint S·R = 0'
        },
        {
          step: 2,
          title: 'JK Flip-Flop (Eliminating Forbidden State)',
          description: 'Feed back Q̅ to J-gate and Q to K-gate. When J=K=1, the flip-flop TOGGLES (Q becomes Q̅), completely resolving the SR undefined state!',
          codeOrFormula: 'Q(t+1) = J·Q̅ + K̅·Q'
        },
        {
          step: 3,
          title: 'Race-Around Condition in JK Flip-Flop',
          description: 'If J=K=1 and the clock pulse width tp is greater than propagation delay tpd, the output toggles repeatedly within a single clock pulse, leaving an unpredictable state at the falling edge.',
          codeOrFormula: 'Occurs when: t_p > t_{pd} while J = K = 1 and Clock = 1'
        },
        {
          step: 4,
          title: 'Master-Slave / Edge Triggering Solution',
          description: 'Master latch catches input on Clock=1; Slave latch transfers to output on Clock=0. Output only changes on the clock edge, completely curing race-around!',
          codeOrFormula: 'Master enabled on CLK=1; Slave enabled on CLK=0'
        },
        {
          step: 5,
          title: 'Flip-Flop Conversion Algorithm (Universal Method)',
          description: 'To convert given Flip-Flop A into desired Flip-Flop B:\n1. Write Characteristic Table of desired Flip-Flop B.\n2. Add columns for given Flip-Flop A inputs using its Excitation Table.\n3. Solve K-maps for given inputs in terms of desired inputs and Present Q.',
          codeOrFormula: 'Given Inputs = f(Desired Inputs, Present State Q)'
        }
      ],
      deepDiveNotes: [
        'Complete Excitation Functions Summary for DTU Exams:',
        'D Flip-Flop: D = Q_{next}',
        'T Flip-Flop: T = Q ⊕ Q_{next}',
        'JK Flip-Flop: J = Q̅·Q_{next}, K = Q·Q̅_{next}',
        'SR Flip-Flop: S = Q̅·Q_{next}, R = Q·Q̅_{next}'
      ]
    },
    interactiveSimulatorKey: 'flip-flop',
    practicalExample: {
      scenario: 'Designing a Modulo-4 Up Counter using T Flip-Flops.',
      walkthrough: 'State sequence: 00 -> 01 -> 10 -> 11 -> 00. Q0 toggles on every clock pulse: T0 = 1. Q1 toggles only when Q0 was 1: T1 = Q0. Connect T0 to VCC (1) and T1 to Q0 output.',
      result: 'Synchronous Mod-4 binary counter running on unified clock.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'What is the race-around condition in a JK flip-flop? How is it prevented using a Master-Slave JK flip-flop? Explain with a neat logic diagram and timing waveforms.',
        marks: 5,
        steps: [
          {
            title: 'Define Race-Around Condition',
            explanation: 'In a level-triggered JK flip-flop, when J=1, K=1, and Clock=1, the output toggles every propagation delay tpd. If clock pulse duration tp > tpd, the output toggles multiple times uncontrollably within one clock cycle.',
            math: 't_p > t_{pd} \\implies \\text{Uncontrollable oscillations}'
          },
          {
            title: 'Master-Slave Working Principle',
            explanation: 'A Master-Slave JK flip-flop consists of two series latches:\n1. Master is enabled when Clock = 1 (Slave disabled via inverter).\n2. Slave is enabled when Clock = 0 (Master disabled).\nSince Master and Slave are NEVER active at the same time, feedback cannot loop back within the same clock period.',
            math: '\\text{Clock}=1 \\implies \\text{Master stores input}; \\text{Clock}=0 \\implies \\text{Slave outputs data}'
          },
          {
            title: 'State the Conditions to Avoid Race-Around',
            explanation: '(i) Use edge-triggered flip-flops where tp << tpd\n(ii) Use Master-Slave JK configuration\n(iii) Ensure clock period satisfies T >= 2*tpd.',
            math: 't_p < t_{pd} \\quad \\text{or Master-Slave architecture}'
          }
        ],
        finalAnswer: 'Prevented by Master-Slave isolation or Edge-Triggering (tp << tpd)',
        tip: 'Draw two cross-coupled SR latches in series with an inverter on the clock line between master and slave.'
      },
      {
        difficulty: 'university',
        question: 'Convert an available SR flip-flop into a JK flip-flop. Show the conversion table, K-maps for S and R inputs, and the final logic gate diagram.',
        marks: 5,
        steps: [
          {
            title: 'Construct Conversion Truth Table',
            explanation: 'Columns: Inputs (J, K), Present State Q, Next State Q(t+1), and Required SR Inputs (from SR Excitation Table):\nJ K Q | Q(t+1) | S  R\n0 0 0 |   0    | 0  X\n0 0 1 |   1    | X  0\n0 1 0 |   0    | 0  X\n0 1 1 |   0    | 0  1\n1 0 0 |   1    | 1  0\n1 0 1 |   1    | X  0\n1 1 0 |   1    | 1  0\n1 1 1 |   0    | 0  1',
            math: '\\text{Conversion Table populated using SR Excitation: } (0\\to0: 0X, 0\\to1: 10, 1\\to0: 01, 1\\to1: X0)'
          },
          {
            title: 'K-Map Simplification for S and R Inputs',
            explanation: 'Plot S(J, K, Q) on 3-variable K-map: 1s at m4, m6; Xs at m1, m5. Group m4, m6 with Xs -> S = J · Q̅.\nPlot R(J, K, Q) on 3-variable K-map: 1s at m3, m7; Xs at m0, m2. Group m3, m7 with Xs -> R = K · Q.',
            math: 'S = J \\cdot \\bar{Q}, \\quad R = K \\cdot Q'
          },
          {
            title: 'Synthesize Hardware Schematic',
            explanation: 'Connect an AND gate between input J and feedback Q̅ into pin S. Connect an AND gate between input K and feedback Q into pin R.',
            math: 'S = J \\bar{Q}, \\quad R = K Q'
          }
        ],
        finalAnswer: 'S = J·Q̅, R = K·Q (Two 2-input AND gates driving the SR flip-flop inputs)',
        tip: 'This universal 3-step method applies to any flip-flop conversion (e.g. D to T, JK to D, T to D).'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Confusing Characteristic Table with Excitation Table.',
        whyItHappens: 'Both describe flip-flop behavior.',
        correctWay: 'Characteristic Table gives Next State Q(t+1) from Present State and Inputs. Excitation Table gives required INPUTS from Present State and desired Next State (used for circuit synthesis)!'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Explain the race-around condition in JK flip-flops and how it is overcome in Master-Slave JK flip-flop.',
        'Convert a JK flip-flop into a D flip-flop and T flip-flop. Show logic diagrams and conversion equations.',
        'Differentiate between combinational and sequential circuits with examples.'
      ],
      scoringKeyAdvice: 'Always write down the 4 excitation rows (0->0, 0->1, 1->0, 1->1) with Don\'t Cares (X) for JK and SR flip-flops.'
    },
    quickRevision: {
      bulletPoints: [
        'Sequential circuits have memory elements (flip-flops) and feedback.',
        'SR flip-flop has forbidden state S=R=1.',
        'JK flip-flop toggles when J=K=1.',
        'D flip-flop: Q(t+1) = D (data buffer).',
        'T flip-flop: Q(t+1) = T ⊕ Q (toggle).',
        'Race-around condition occurs when tp > tpd in level-triggered JK flip-flops.',
        'Master-Slave isolates input and output to eliminate race-around.',
        'Flip-flop conversion: Excitation of given FF plotted on K-map of desired FF.'
      ],
      importantFormulas: [
        { name: 'JK Characteristic', formula: 'Q(t+1) = J\\bar{Q} + \\bar{K}Q' },
        { name: 'T Characteristic', formula: 'Q(t+1) = T \\oplus Q' },
        { name: 'D Characteristic', formula: 'Q(t+1) = D' },
        { name: 'SR to JK Conversion', formula: 'S = J\\bar{Q}, \\quad R = KQ' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u3-p1-1',
        type: 'mcq',
        question: 'To cause a transition from Q=1 to Q=0 in a JK flip-flop, what inputs must be applied?',
        options: ['J = X, K = 1', 'J = 0, K = 1', 'J = 1, K = X', 'J = 0, K = X'],
        correctAnswer: 0,
        explanation: 'From the JK excitation table, for 1 -> 0 transition: K must be 1 (to reset or toggle), while J can be 0 or 1 (Don\'t Care X). Hence J=X, K=1.',
        marks: 2
      }
    ]
  },
  {
    id: 'u3-l2-fsm-and-synchronous-synthesis',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Synchronous & Asynchronous Sequential Circuits',
    title: 'FSM Models & Synchronous Sequential Circuit Synthesis',
    subtitle: 'Mealy vs Moore machines, state diagram, state reduction (implication table), state assignment, and sequence detector design',
    estimatedMinutes: 40,
    order: 2,
    prerequisites: ['Flip-flop excitation tables', 'K-map minimization'],
    whatIsIt: {
      simpleSummary: 'A Finite State Machine (FSM) is a mathematical abstraction of a system that transitions between a finite number of internal states based on external inputs and clock edges. There are two fundamental models:\n1. Moore Machine: Output depends ONLY on the current state.\n2. Mealy Machine: Output depends on BOTH the current state AND the current input.',
      coreDefinition: 'A synchronous sequential circuit synthesis follows a rigorous 6-step pipeline:\n1. Word specification -> 2. State Diagram -> 3. State Table -> 4. State Reduction (Implication Table) -> 5. State Assignment -> 6. K-map Minimization for Flip-Flop Inputs and Output Logic.',
      keyAnalogy: 'A vending machine is an FSM: States are {0 cents, 25 cents, 50 cents, 75 cents}. Inserting a coin triggers state transitions. Once state reaches 75 cents, output dispenses soda.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Modern microprocessors (like the instruction decoder in ARM Cortex-M) are complex state machines that fetch instructions, decode opcodes, coordinate buses, and handle interrupts over multiple clock cycles.',
      engineeringBenefit: 'State reduction eliminates redundant states, directly reducing the number of physical flip-flops and logic gates required on silicon chips.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Mealy vs Moore Comparison',
          description: 'Mealy outputs can change asynchronously whenever input changes, reacting 1 clock cycle faster than Moore. Moore outputs change ONLY on the clock edge, making Moore machines immune to glitching and timing hazards.',
          codeOrFormula: 'Moore: Y(t) = g(S(t)); Mealy: Y(t) = g(S(t), X(t))'
        },
        {
          step: 2,
          title: 'State Reduction (Row Equivalence / Implication Table)',
          description: 'Two states S_i and S_j are equivalent if for every possible input combination, they produce identical outputs and transition to identical (or equivalent) next states. Redundant states are merged.',
          codeOrFormula: 'S_i \\equiv S_j \\iff \\text{Outputs identical and Next States equivalent}'
        },
        {
          step: 3,
          title: 'State Assignment',
          description: 'Assign binary codes (00, 01, 10, 11) to states. If a machine has N states, the minimum number of flip-flops required is m = ceil(log2 N). Adjacent states are assigned Gray-code binary values to minimize switching.',
          codeOrFormula: '2^m \\ge N'
        },
        {
          step: 4,
          title: 'Derive Flip-Flop Input Equations via K-Maps',
          description: 'Substitute state transitions into flip-flop excitation tables (D, T, or JK). Minimize using K-maps to obtain final gate-level logic expressions.',
          codeOrFormula: 'D_A = f(A, B, X), D_B = g(A, B, X), Y = h(A, B, X)'
        }
      ],
      deepDiveNotes: [
        'Capabilities & Limitations of Finite State Machines (DTU Exam Topic):',
        '1. Finite Memory Bound: An FSM has a strictly finite number of states N. It can recognize regular languages, but CANNOT recognize context-free languages requiring infinite memory (e.g. recognizing {0^n 1^n for arbitrary n}).',
        '2. Periodic Behavior: For any infinite input sequence, an FSM must eventually repeat a state (Pigeonhole Principle).'
      ]
    },
    interactiveSimulatorKey: 'fsm-animator',
    practicalExample: {
      scenario: 'Designing a sequence detector for pattern "1011" with overlapping allowed using D Flip-Flops.',
      walkthrough: 'Mealy model requires 4 states: S0 (initial), S1 (matched "1"), S2 (matched "10"), S3 (matched "101"). When in S3 and next bit is 1, output Y = 1 and next state is S1 (because last bit 1 forms prefix of next sequence). We assign S0=00, S1=01, S2=10, S3=11 (2 flip-flops A and B).',
      result: 'State equations derived via K-maps: DA = B·X\', DB = X, Y = A·B·X'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Design a Mealy sequence detector to detect the sequence "101" using D flip-flops with overlapping permitted. Show state diagram, state table, excitation K-maps, and logic circuit.',
        marks: 10,
        steps: [
          {
            title: 'Construct State Diagram',
            explanation: 'States:\nS0: No bits matched (reset)\nS1: Matched "1"\nS2: Matched "10"\nTransitions:\nFrom S0: on 0 -> S0/0; on 1 -> S1/0\nFrom S1: on 0 -> S2/0; on 1 -> S1/0\nFrom S2: on 0 -> S0/0; on 1 -> S1/1 (Sequence 101 detected!)',
            math: '3 \\text{ States} \\implies m = \\lceil\\log_2 3\\rceil = 2 \\text{ D Flip-Flops (A, B)}'
          },
          {
            title: 'State Assignment',
            explanation: 'Assign S0 = 00, S1 = 01, S2 = 10. State 11 is an unused Don\'t Care state.',
            math: 'S0=00, S1=01, S2=10, 11=X'
          },
          {
            title: 'Synthesize D Flip-Flop Inputs',
            explanation: 'Next state A_next = DA, B_next = DB.\nPlotting on K-maps:\nDA(A, B, X) = B · X̅\nDB(A, B, X) = X\nOutput Y(A, B, X) = A · X',
            math: 'D_A = B\\bar{X}, \\quad D_B = X, \\quad Y = A X'
          },
          {
            title: 'Draw Circuit Schematic',
            explanation: 'Two D flip-flops clocked together. DA fed by AND gate with inputs B and X̅. DB connected directly to input line X. Output Y generated by AND gate with inputs A and X.',
            math: '\\text{Complete synchronous sequential circuit realized with 2 D-FFs and 2 AND gates!}'
          }
        ],
        finalAnswer: 'DA = B·X̅, DB = X, Y = A·X with 2 D flip-flops',
        tip: 'In DTU examinations, state detection questions carry 10 marks. Always clearly distinguish whether overlapping is permitted or not.'
      },
      {
        difficulty: 'university',
        question: 'Design a 3-bit Synchronous Up-Counter using T flip-flops. Derive the excitation logic equations for T0, T1, and T2.',
        marks: 5,
        steps: [
          {
            title: 'State Sequence & Excitation Analysis',
            explanation: 'Count sequence: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000.\nFor a T flip-flop: T = 1 when Q must toggle, T = 0 when Q holds.\n- Bit Q0 toggles on EVERY clock edge -> T0 = 1.\n- Bit Q1 toggles whenever Q0 = 1 -> T1 = Q0.\n- Bit Q2 toggles only when BOTH Q0 = 1 and Q1 = 1 -> T2 = Q0 · Q1.',
            math: 'T_0 = 1, \\quad T_1 = Q_0, \\quad T_2 = Q_0 Q_1'
          },
          {
            title: 'Verify Synchronous Operation',
            explanation: 'All 3 flip-flops receive the identical external clock signal simultaneously. Unlike a ripple counter where carry ripples sequentially, state changes occur in parallel with a single flip-flop propagation delay!',
            math: '\\text{Max Delay} = t_{pd} \\text{ (Constant for any bit width!)}'
          }
        ],
        finalAnswer: 'T0 = 1, T1 = Q0, T2 = Q0·Q1',
        tip: 'Contrast this with ripple counters where delay accumulates as n × tpd.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using (n+1) states for a Mealy sequence detector.',
        whyItHappens: 'Confusing Mealy with Moore.',
        correctWay: 'Mealy requires n states for sequence of length n. Moore requires (n+1) states.'
      },
      {
        mistake: 'Resetting to initial state S0 on match in overlapping mode.',
        whyItHappens: 'Forgetting that the ending bits of the sequence can serve as the starting prefix of the next sequence.',
        correctWay: 'In overlapping mode, check the longest matched suffix. For "1011", the trailing "1" means transitioning to S1, not S0.'
      }
    ],
    examPerspective: {
      expectedMarks: '10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Differentiate between Mealy and Moore models with suitable examples and timing diagrams.',
        'Design a synchronous counter that counts in the sequence: 0 -> 2 -> 3 -> 6 -> 7 -> 0 using JK flip-flops.',
        'Explain the Implication Table method for state minimization with a suitable example.',
        'Discuss the capabilities and limitations of Finite State Machines (FSM).'
      ],
      scoringKeyAdvice: 'Draw the state diagram clearly with circle nodes and labeled arrows (X / Y). Label present state, next state, and flip-flop inputs in the state table.'
    },
    quickRevision: {
      bulletPoints: [
        'Moore: Output depends only on state. (n+1) states for n-bit sequence.',
        'Mealy: Output depends on state and input. n states for n-bit sequence. Reacts faster.',
        'Number of flip-flops: 2^m >= N states.',
        'State reduction merges equivalent states to reduce flip-flop count.',
        'Excitation K-maps yield minimal input logic for flip-flops.',
        'FSMs have finite memory and cannot recognize infinite context-free strings.'
      ],
      importantFormulas: [
        { name: 'Minimum Flip-Flops', formula: 'm = \\lceil\\log_2 N\\rceil' },
        { name: 'Moore Output', formula: 'Y = \\lambda(S)' },
        { name: 'Mealy Output', formula: 'Y = \\lambda(S, X)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u3-p2-1',
        type: 'mcq',
        question: 'How many flip-flops are required to design a synchronous sequential circuit with 14 states?',
        options: ['4 flip-flops', '3 flip-flops', '5 flip-flops', '7 flip-flops'],
        correctAnswer: 0,
        explanation: '2^3 = 8 < 14, while 2^4 = 16 >= 14. Therefore, minimum 4 flip-flops are required.',
        marks: 2
      }
    ]
  },
  {
    id: 'u3-l3-asynchronous-circuits-and-hazards',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Synchronous & Asynchronous Sequential Circuits',
    title: 'Asynchronous Sequential Circuits, Races & Hazards',
    subtitle: 'Fundamental mode vs pulse mode, flow tables, transition tables, critical races, static/dynamic hazards, and essential hazards',
    estimatedMinutes: 35,
    order: 3,
    prerequisites: ['Synchronous FSMs', 'Logic gate propagation delays'],
    whatIsIt: {
      simpleSummary: 'Asynchronous sequential circuits do NOT use a central clock signal. Instead, state transitions are driven directly by changes in external input signals. Because signals propagate through gates at different physical speeds (nanosecond variations), asynchronous circuits are vulnerable to race conditions and hazards that do not exist in synchronous systems.',
      coreDefinition: 'In Fundamental Mode asynchronous circuits, input signals are assumed to change only one at a time, and only after the circuit has reached a stable internal state (input change rate << internal circuit settling time).',
      keyAnalogy: 'Imagine a relay race where runners hand over the baton without a referee\'s whistle. If one runner arrives slightly earlier than expected due to unequal shoe grip, the handover can fail unless carefully paced!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Synchronous clock distribution networks consume up to 40% of the entire power budget in ultra-low power microcontrollers. Furthermore, clock jitter and clock skew limit performance. Critical real-time interrupt pins (like NMI or External IRQ in ARM Cortex-M) must react asynchronously to instant voltage spikes.',
      engineeringBenefit: 'Asynchronous circuits consume zero static clock power and operate at the maximum physical speed of the transistors.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Flow Table & Transition Table',
          description: 'A flow table represents asynchronous states. A state is STABLE if the next state equals the present state (indicated by a circled state). If next state differs, it is UNSTABLE and transitioning.',
          codeOrFormula: 'Stable State: Y = y (Circled entry)'
        },
        {
          step: 2,
          title: 'Races: Non-Critical vs Critical Races',
          description: 'A race occurs when two or more internal secondary state variables attempt to change simultaneously (e.g. 00 -> 11). If the final stable state is the same regardless of which bit changes first (00 -> 01 -> 11 or 00 -> 10 -> 11), it is a NON-CRITICAL race. If different bits changing first lead to DIFFERENT destination stable states, it is a CRITICAL RACE (fatal hardware failure)!',
          codeOrFormula: 'Non-Critical: Both paths reach same destination; Critical: Different destinations reached!'
        },
        {
          step: 3,
          title: 'Eliminating Critical Races via State Assignment',
          description: 'Assign state codes so that transitions between adjacent states require only ONE bit change (Hamming distance = 1). If adjacent assignment is impossible, route through an unused intermediate state (Cycle).',
          codeOrFormula: 'Hamming Distance between transitioning states must equal 1'
        },
        {
          step: 4,
          title: 'Static and Dynamic Hazards',
          description: 'A Static-1 Hazard occurs when an output is supposed to remain 1 during an input change, but momentarily dips to 0 due to unequal path delays. Solved by adding redundant consensus terms in K-maps to bridge adjacent groups!',
          codeOrFormula: 'Static-1 Hazard: F = AB + A̅C. Add redundant consensus term BC: F = AB + A̅C + BC'
        },
        {
          step: 5,
          title: 'Pulse Mode Circuits',
          description: 'Inputs are narrow pulses rather than steady voltage levels. Pulses must be long enough to trigger flip-flops, but short enough to disappear before feedback returns (pulse width tp: tpd(FF) < tp < t_cycle).',
          codeOrFormula: 'Pulse width constraint: t_{pd} < t_p < t_{cycle}'
        }
      ],
      deepDiveNotes: [
        'Essential Hazards:',
        'An essential hazard is caused by unequal delays in feedback paths versus input lines in asynchronous circuits.',
        'It cannot be eliminated by logic gate manipulation; it can only be cured by physically inserting delay elements into the internal feedback paths!'
      ]
    },
    practicalExample: {
      scenario: 'Detecting and removing a Static-1 Hazard in F = A·B + A̅·C.',
      walkthrough: 'When B=1, C=1, and input A changes from 1 to 0: Ideally F should stay 1 (1·1 -> 0·1 = 1). But due to inverter delay on A, for a fraction of a nanosecond both A and A̅ may appear as 0! Both AND gates momentarily output 0, producing a glitch (0) on the OR output. Adding the consensus term B·C ensures that when B=C=1, the output is held at 1 independent of A.',
      result: 'Hazard-free circuit: F = A·B + A̅·C + B·C'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Explain Critical and Non-Critical races in asynchronous sequential circuits with transition table examples. How can races be avoided using state assignment?',
        marks: 5,
        steps: [
          {
            title: 'Define Race Condition',
            explanation: 'When two or more secondary variables must change during an unstable transition (e.g. y1 y2 changes from 00 to 11), a race condition occurs because circuit delays are never identical.',
            math: 'y_1 y_2: 00 \\to 11'
          },
          {
            title: 'Differentiate Non-Critical vs Critical Race',
            explanation: '1. Non-Critical Race: If bit 1 changes first (00 -> 10 -> 11) OR bit 2 changes first (00 -> 01 -> 11), the circuit ultimately ends up in the correct intended stable state. The transient order does not affect functionality.\n2. Critical Race: If bit 1 changing first lands the circuit in Stable State S2, while bit 2 changing first lands it in Stable State S3, the final outcome depends on physical temperature and wire delay. This is an invalid, erratic condition.',
            math: '\\text{Critical Race} \\implies \\text{Erratic, non-deterministic final state}'
          },
          {
            title: 'Avoidance Strategies',
            explanation: '(i) Shared Gray-code state assignment (ensure transitions change only 1 bit at a time).\n(ii) Directed Cycles (transitioning through an intermediate dummy state).\n(iii) One-hot state assignment.',
            math: '\\text{Hamming Distance} = 1 \\implies \\text{Zero Race Condition}'
          }
        ],
        finalAnswer: 'Prevented by single-bit transitions (Hamming dist = 1) or deliberate cycles',
        tip: 'Draw a 2x2 state transition grid and show the two split paths leading to the same vs different destinations.'
      },
      {
        difficulty: 'university',
        question: 'Analyze the Boolean function F = A B + A̅ C for hazards. Draw the K-map, identify the hazard condition, and derive the hazard-free realization.',
        marks: 5,
        steps: [
          {
            title: 'Identify Hazard on K-Map',
            explanation: 'Plot F on K-map: Group 1 is AB (cells 6, 7). Group 2 is A̅C (cells 1, 3). Cells 3 (011) and 7 (111) are adjacent, but belong to two separate groups with no overlap! When inputs transition between cell 7 (A=1, B=1, C=1) and cell 3 (A=0, B=1, C=1), input A flips.',
            math: '\\text{Transition: } ABC = 111 \\to 011'
          },
          {
            title: 'Evaluate Glitch Mechanism',
            explanation: 'Because of the delay in the inverter generating A̅, there is a momentary window where A=0 and A̅=0. Term AB becomes 0 before term A̅C becomes 1. The output F drops to 0 momentarily before recovering to 1. This is a Static-1 Hazard.',
            math: '1 \\to 0 \\to 1 \\text{ (Momentary Glitch Dip)}'
          },
          {
            title: 'Eliminate Hazard by Adding Consensus Term',
            explanation: 'Add a redundant consensus loop covering cells 3 and 7: across these two cells, B=1 and C=1. Redundant term = BC. New hazard-free expression: F = AB + A̅C + BC.',
            math: 'F_{hazard\\text{-}free} = A B + \\bar{A} C + B C'
          }
        ],
        finalAnswer: 'F = AB + A̅C + BC (Adding consensus term BC completely eliminates the static-1 hazard)',
        tip: 'In K-maps, a hazard exists wherever two adjacent 1s are not enclosed within a common grouping loop!'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming K-map minimization automatically eliminates hazards.',
        whyItHappens: 'Minimization removes redundant terms, but hazards require redundant terms to be KEPT!',
        correctWay: 'Minimal SOP has hazards. To make a circuit hazard-free, you must add redundant prime implicants (consensus terms) that overlap adjacent groups.'
      }
    ],
    examPerspective: {
      expectedMarks: '5 Marks',
      frequency: 'High',
      typicalDtuQuestions: [
        'What are hazards? Explain static-0, static-1, and dynamic hazards with diagrams. How are they eliminated?',
        'Differentiate between fundamental mode and pulse mode asynchronous circuits.',
        'Explain critical race and cycle in asynchronous circuits with an example flow table.'
      ],
      scoringKeyAdvice: 'Draw the timing waveform showing the glitch dip (1 -> 0 -> 1) for Static-1 hazard. Show the K-map with the bridging consensus loop.'
    },
    quickRevision: {
      bulletPoints: [
        'Asynchronous circuits have no clock; inputs drive state directly.',
        'Fundamental mode: inputs change one at a time only when circuit is stable.',
        'Critical race leads to wrong final state; non-critical race leads to correct state.',
        'Static-1 hazard: momentary 0 glitch when output should stay 1.',
        'Hazards are eliminated by adding redundant consensus terms in K-maps.'
      ],
      importantFormulas: [
        { name: 'Consensus Theorem', formula: 'AB + \\bar{A}C + BC = AB + \\bar{A}C' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u3-p3-1',
        type: 'mcq',
        question: 'To eliminate a static-1 hazard from the expression F = A·B + A̅·C, which redundant consensus term must be added?',
        options: ['B · C', 'A · C', 'B̅ · C', 'A · B̅'],
        correctAnswer: 0,
        explanation: 'By the consensus theorem, the consensus of A·B and A̅·C is B·C. Adding B·C bridges the two adjacent groups on the K-map.',
        marks: 2
      }
    ]
  },
  {
    id: 'u3-l4-state-equivalence-and-incompletely-specified-machines',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'Synchronous & Asynchronous Sequential Circuits',
    title: 'State Equivalence, Implication Table & Incompletely Specified FSMs',
    subtitle: 'Partitioning algorithm, implication table minimization, compatible states, maximal compatibles, and merger graphs',
    estimatedMinutes: 40,
    order: 4,
    prerequisites: ['FSM models', 'State transition tables'],
    whatIsIt: {
      simpleSummary: 'When specifying a state machine from human requirements, engineers often define redundant or duplicate states. In completely specified machines, state reduction is performed using the Implication Table or Partitioning method. In incompletely specified machines (where certain next states or outputs are Don\'t Cares \'-\'), two states can be COMPATIBLE even if they are not strictly equivalent! Finding the minimal cover requires finding Maximal Compatibles using Merger Graphs.',
      coreDefinition: 'State Equivalence: Two states $S_i$ and $S_j$ are equivalent ($S_i \\equiv S_j$) if and only if for every input sequence of arbitrary length, the machine produces identical output sequences when started in $S_i$ or $S_j$: $$S_i \\equiv S_j \\iff \\forall x, \\; \\lambda(S_i, x) = \\lambda(S_j, x) \\;\\land\\; \\delta(S_i, x) \\equiv \\delta(S_j, x)$$ Compatibility: $S_i$ and $S_j$ are compatible ($S_i \\sim S_j$) if their outputs and next states agree wherever both are specified.',
      keyAnalogy: 'Two people who agree on every single subject are equivalent. Two people where Person A has strong opinions on music and no opinion on movies, while Person B has no opinion on music and strong opinions on movies, are compatible (they can live together in the same room without conflict)!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Each additional state can double the number of flip-flops required in hardware (e.g. going from 8 states to 9 states jumps flip-flops from 3 to 4, increasing logic gates by 30%).',
      engineeringBenefit: 'State minimization systematically strips away redundant flip-flops, lowering silicon chip cost, clock loading, and power consumption.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Implication Table Construction (Completely Specified)',
          description: 'Construct a triangular grid where rows are states S2..Sn and columns are S1..Sn-1. For each cell (Si, Sj):\n- If outputs differ for ANY input: Si and Sj can NEVER be equivalent -> place an \'X\' in the cell!\n- If outputs match: write down the pairs of next states implied by that transition (e.g. Sk-Sm).',
          codeOrFormula: 'Outputs differ -> X; Outputs equal -> list implied next-state pairs'
        },
        {
          step: 2,
          title: 'Iterative Elimination Passes',
          description: 'Scan through the table: If a cell contains an implied pair (Sk-Sm) that has ALREADY been crossed out with an X elsewhere in the table, cross out this cell too! Repeat until no new Xs are added.',
          codeOrFormula: 'Propagate Xs transitively until steady state'
        },
        {
          step: 3,
          title: 'Extract Equivalent State Partitions',
          description: 'Any cells remaining uncrossed represent truly EQUIVALENT states (e.g. S1 ~ S3). Merge them into a single state in the reduced state table.',
          codeOrFormula: 'Merge {S1, S3} into new State A'
        },
        {
          step: 4,
          title: 'Incompletely Specified Machines & Merger Graph',
          description: 'In an incompletely specified machine with Don\'t Care outputs/transitions, compatibility is NOT transitive (S1 compatible with S2, and S2 with S3, does NOT imply S1 is compatible with S3). Draw a Merger Graph: nodes are states, lines connect compatible pairs. Form polygons to find Maximal Compatibles!',
          codeOrFormula: 'Merger Graph: complete subgraphs (cliques) = Maximal Compatibles'
        },
        {
          step: 5,
          title: 'Closed Covering Condition',
          description: 'Select a subset of maximal compatibles that:\n1. Covers all original states (Completeness).\n2. Has closure: all implied next states must belong to the selected compatibles.',
          codeOrFormula: 'Completeness + Closure = Valid Minimal Machine'
        }
      ],
      deepDiveNotes: [
        'Partitioning Algorithm (Alternative to Implication Table):',
        'P0 = (All states in one group)',
        'P1 = (Partition by 1-step output equivalence)',
        'P2 = (Partition by 2-step next-state equivalence)',
        'Stop when P_{k+1} = P_k (no further splitting occurs).'
      ]
    },
    practicalExample: {
      scenario: 'Minimizing a 6-state FSM using the Partitioning Algorithm.',
      walkthrough: 'States {A, B, C, D, E, F}. Outputs: A, B, D have output 0; C, E, F have output 1.\nP1 = (A, B, D)(C, E, F).\nCheck next states for input 0 and 1:\nStates A and B transition to equivalent groups for all inputs -> stay together.\nState D transitions to C on input 1, whereas A transitions to B -> D splits off!\nAfter checking all: P2 = (A, B)(D)(C, F)(E).\nP3 = P2. Machine reduces from 6 states to 4 states!',
      result: 'Reduced machine requires only 2 flip-flops (ceil(log2 4)) instead of 3 flip-flops!'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Using the Implication Table method, minimize the completely specified state table below. Show the initial implication table, elimination passes, and final reduced state table.',
        marks: 10,
        steps: [
          {
            title: 'Analyze Initial State Table',
            explanation: 'States A, B, C, D, E, F, G.\nOutputs on x=0 and x=1:\nA: (B, C, 0/0), B: (D, E, 0/0), C: (F, G, 0/1), D: (B, C, 0/0), E: (D, E, 0/0), F: (B, C, 0/0), G: (D, E, 0/1).',
            math: '\\text{Compare outputs: A, B, D, E, F have outputs 0/0; C, G have outputs 0/1}'
          },
          {
            title: 'Initial Implication Table Setup',
            explanation: 'Any pair with differing outputs receives an immediate X:\nPairs between {A, B, D, E, F} and {C, G} are crossed out immediately.\nFor matching output pairs, record implied next states:\nPair (A, D): on x=0 implies (B,B)=same; on x=1 implies (C,C)=same -> A and D are EQUIVALENT immediately!\nPair (B, E): implies (D,D) and (E,E) -> B and E are EQUIVALENT immediately!\nPair (A, F): implies (B,B) and (C,C) -> A and F are EQUIVALENT!',
            math: 'A \\equiv D \\equiv F, \\quad B \\equiv E'
          },
          {
            title: 'Check Remaining Pairs & Derive Equivalence Classes',
            explanation: 'Equivalence classes: [A, D, F], [B, E], [C], [G].\nThe original 7-state machine reduces to a 4-state machine!',
            math: '\\text{Reduced States: } S_0 = (A, D, F), \\; S_1 = (B, E), \\; S_2 = (C), \\; S_3 = (G)'
          },
          {
            title: 'Construct Final Reduced State Table',
            explanation: 'The 4-state machine requires only 2 flip-flops (2^2 = 4) instead of 3 flip-flops (2^3 = 8), saving 33% silicon area!',
            math: '\\text{Flip-flop savings: } 3 \\to 2 \\text{ FFs}'
          }
        ],
        finalAnswer: 'Equivalent states: (A, D, F) and (B, E). Reduced machine has 4 states: [A,D,F], [B,E], [C], [G]',
        tip: 'Draw the triangular implication table with diagonal lines. Show the X marks clearly.'
      },
      {
        difficulty: 'university',
        question: 'Explain why two states in an incompletely specified machine can be compatible without being equivalent. Define Maximal Compatibles and Closed Covering.',
        marks: 5,
        steps: [
          {
            title: 'Distinguish Equivalence vs Compatibility',
            explanation: '1. Equivalence is an equivalence relation: reflexive, symmetric, and TRANSITIVE (if A ~ B and B ~ C, then A ~ C).\n2. Compatibility is reflexive and symmetric, but NOT TRANSITIVE! (Because Don\'t Cares allow A to agree with B, and B to agree with C, while A conflicts with C on that same bit).',
            math: 'A \\sim B \\land B \\sim C \\not\\implies A \\sim C'
          },
          {
            title: 'Define Maximal Compatibles',
            explanation: 'A compatible set of states that is NOT a subset of any larger compatible set. In a Merger Graph, maximal compatibles correspond to maximum complete polygons (cliques).',
            math: '\\text{Maximal Compatible } = \\text{Maximal Clique in Merger Graph}'
          },
          {
            title: 'Explain Closed Covering',
            explanation: 'A set of compatibles forms a valid reduced machine if:\n1. Coverage: Every original state appears in at least one chosen compatible.\n2. Closure: For every chosen compatible, all implied next states must be contained within the chosen set.',
            math: '\\text{Condition: } \\bigcup C_i = S \\quad \\land \\quad \\text{Implied States } \\subseteq \\bigcup C_i'
          }
        ],
        finalAnswer: 'Compatibility lacks transitivity; closed covering requires both completeness and transition closure',
        tip: 'In DTU exams, always emphasize that non-transitivity is the root reason why incompletely specified machines are harder to minimize than completely specified ones.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming compatibility is transitive in incompletely specified machines.',
        whyItHappens: 'Treating compatible states like equivalent states.',
        correctWay: 'In incompletely specified machines, if A is compatible with B, and B is compatible with C, A is NOT necessarily compatible with C because Don\'t Cares can conflict!'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'High',
      typicalDtuQuestions: [
        'Explain the Implication Table method for state minimization with a suitable state table example.',
        'What is an incompletely specified machine? Explain compatibility relation, maximal compatibles, and closed covering.',
        'Minimize an FSM using the Partitioning method: P0, P1, P2...'
      ],
      scoringKeyAdvice: 'Draw the complete implication table or step-by-step partitions P1, P2. Show the final reduced state table.'
    },
    quickRevision: {
      bulletPoints: [
        'Completely specified: States equivalent if outputs and next states match for all inputs.',
        'Implication table crosses out differing outputs, then propagates Xs transitively.',
        'Incompletely specified: States are compatible if outputs do not conflict (agree on specified bits).',
        'Compatibility is not transitive.',
        'Merger graph cliques identify Maximal Compatibles.',
        'Closed covering requires completeness and transition closure.'
      ],
      importantFormulas: [
        { name: 'State Equivalence', formula: 'S_i \\equiv S_j \\iff \\forall x, \\; \\lambda(S_i, x) = \\lambda(S_j, x) \\;\\land\\; \\delta(S_i, x) \\equiv \\delta(S_j, x)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u3-p4-1',
        type: 'mcq',
        question: 'Why is the compatibility relation in an incompletely specified sequential machine not transitive?',
        options: [
          'Because Don\'t Care outputs and transitions allow two states to agree with a third state without agreeing with each other.',
          'Because the clock signal causes asynchronous delays.',
          'Because the machine has more than 16 states.',
          'Because flip-flops cannot store Don\'t Cares.'
        ],
        correctAnswer: 0,
        explanation: 'In incompletely specified machines, Don\'t Care entries (\'-\') do not conflict with 0 or 1. Thus state A can be compatible with B, and B with C, while A and C have conflicting specified outputs (0 and 1).',
        marks: 2
      }
    ]
  }
];
