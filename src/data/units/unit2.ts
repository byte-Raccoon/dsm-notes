import { LessonContent } from '../../types';

export const unit2Lessons: LessonContent[] = [
  {
    id: 'u2-l1-kmap-minimization',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Combinational Logic Design',
    title: "Karnaugh Map (K-Map) Minimization & Don't Care Conditions",
    subtitle: 'Minterms, maxterms, 2 to 5-variable maps, Gray code adjacency, wrap-around loops, and prime implicants',
    estimatedMinutes: 35,
    order: 1,
    prerequisites: ['Boolean algebra postulates', "De Morgan's theorems"],
    whatIsIt: {
      simpleSummary: 'A Karnaugh map (K-map) is a graphical method for simplifying complex Boolean expressions into their minimal two-level Sum-of-Products (SOP) or Product-of-Sums (POS) form. It arranges the truth table into a multi-dimensional grid where adjacent cells differ by exactly ONE binary variable (Gray code ordering).',
      coreDefinition: 'A K-map contains $2^n$ cells for $n$ variables. Adjacent cells with 1s are grouped in powers of two ($1, 2, 4, 8, 16$) using the Boolean theorem: $$AB + A\\bar{B} = A(B + \\bar{B}) = A$$ Grouping eliminates the variable that changes state between the cells.',
      keyAnalogy: 'Imagine wrapping a flat sheet of graph paper into a cylinder or a donut (torus). The left edge touches the right edge, and the top edge touches the bottom edge! That is why the four corners of a 4-variable K-map form a valid single group.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Algebraic minimization using Boolean theorems is error-prone and depends on trial-and-error intuition. In digital hardware design, un-minimized equations require dozens of extra logic gates, increasing silicon area, propagation delay, and power consumption.',
      engineeringBenefit: 'K-maps provide a deterministic visual guarantee of finding the absolute Minimal Sum of Products (MSOP), directly minimizing gate count in combinational logic.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Map Layout using Gray Code',
          description: 'Label rows and columns with Gray code sequence: 00, 01, 11, 10. (Notice 11 comes before 10 so adjacent cells differ by only 1 bit).',
          codeOrFormula: 'Axis sequence: 00 (A̅B̅), 01 (A̅B), 11 (AB), 10 (AB̅)'
        },
        {
          step: 2,
          title: "Fill 1s, 0s, and Xs (Don't Cares)",
          description: "Place 1 in minterm cells specified by F = Σm(...). Place X in cells where input combinations cannot physically occur or outputs are irrelevant.",
          codeOrFormula: "m(i) = 1, d(j) = X"
        },
        {
          step: 3,
          title: 'Form Largest Valid Rectangular Groups',
          description: "Groups must contain 2^k cells (1, 2, 4, 8, 16). Groups may wrap around boundaries. Include an X in a group ONLY if it helps form a larger group of 1s!",
          codeOrFormula: '16-cell = 0 vars (Constant 1), 8-cell (Octet) = 1 var, 4-cell (Quad) = 2 vars, 2-cell (Pair) = 3 vars'
        },
        {
          step: 4,
          title: 'Extract Essential Prime Implicants (EPIs)',
          description: "Identify groups that contain at least one '1' not covered by any other group. Determine which variables remain constant across the group and write their product term.",
          codeOrFormula: "If A stays 1 and D stays 0 across all 4 cells in a quad, the term is A·D̅"
        }
      ],
      deepDiveNotes: [
        '5-Variable K-Maps (A, B, C, D, E):',
        'Consists of two 4×4 sub-cubes: Sub-cube 1 for A=0 (m0 to m15) and Sub-cube 2 for A=1 (m16 to m31).',
        'Superposition Rule: Any group occupying the IDENTICAL position in both sub-cubes eliminates variable A!'
      ]
    },
    interactiveSimulatorKey: 'kmap-solver',
    practicalExample: {
      scenario: 'Simplifying F(A, B, C, D) = Σm(0, 2, 8, 10) + d(5, 7, 13, 15).',
      walkthrough: "The 4 corners m(0, 2, 8, 10) form a 4-cell wrap-around quad. Across these 4 cells: Variable B is 0 (B̅), Variable D is 0 (D̅). Variables A and C toggle and drop out. The term is B̅D̅. The don't cares at (5, 7, 13, 15) do not help m(0, 2, 8, 10), so they are treated as 0 and ignored.",
      result: 'Minimized Expression: F = B̅ · D̅'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: "Minimize the Boolean function using a 4-variable K-map: F(A, B, C, D) = Σm(1, 3, 7, 11, 15) + d(0, 2, 5). Draw the resulting NAND-NAND logic diagram.",
        marks: 5,
        steps: [
          {
            title: 'Plot 1s and Xs on the 4x4 K-map',
            explanation: '1s at cells 1, 3, 7, 11, 15. Xs at cells 0, 2, 5.',
            math: 'm(1, 3, 7, 11, 15), d(0, 2, 5)'
          },
          {
            title: 'Group 1: 4-Cell Column Quad m(3, 7, 11, 15)',
            explanation: 'Column CD = 11 has 1s at all rows. Both C and D remain 1, while A and B toggle.',
            math: 'Term 1 = C · D'
          },
          {
            title: "Group 2: 4-Cell Quad using Don't Cares m(1, 3, 5) + d(0, 2)",
            explanation: 'Combining m(1, 3) with d(0, 2) forms row 0 (A̅B̅) quad: m(0, 1, 2, 3). Across this quad, A=0 and B=0 remain constant.',
            math: 'Term 2 = A̅ · B̅'
          },
          {
            title: 'Synthesize Minimal SOP and NAND Circuit',
            explanation: "F = C·D + A̅·B̅. By Involution and De Morgan: F = ((C·D)̅ · (A̅·B̅)̅)̅, which requires two 2-input NAND gates feeding a third 2-input NAND gate.",
            math: 'F = C·D + A̅·B̅'
          }
        ],
        finalAnswer: 'F = C·D + A̅·B̅',
        tip: "In DTU exams, if asked for NAND logic implementation, apply double complement and De Morgan's theorem to convert SOP directly to NAND-NAND form."
      },
      {
        difficulty: 'university',
        question: 'Simplify the 5-variable function using a 5-variable K-map: F(A, B, C, D, E) = Σm(0, 2, 4, 6, 9, 11, 13, 15, 17, 21, 25, 27, 29, 31).',
        marks: 10,
        steps: [
          {
            title: 'Partition into Subcube A=0 and Subcube A=1',
            explanation: 'Subcube 0 (A=0): m(0, 2, 4, 6, 9, 11, 13, 15). Subcube 1 (A=1): m(17, 21, 25, 27, 29, 31).',
            math: 'A=0 \\text{ (m0-m15)}, \\quad A=1 \\text{ (m16-m31)}'
          },
          {
            title: 'Identify Superimposed 8-Cell Octet across Both Subcubes',
            explanation: 'Look for terms at identical positions in both subcubes: m(9, 11, 13, 15) in Subcube 0 corresponds to m(25, 27, 29, 31) in Subcube 1! This forms an 8-cell octet. Variable A toggles (0 and 1) -> eliminated. Across cells (9,11,13,15): B=1, E=1 remain constant.',
            math: 'Term 1 = B · E'
          },
          {
            title: 'Identify Groups Confined to Individual Subcubes',
            explanation: 'In Subcube 0 (A=0): cells m(0, 2, 4, 6) form a 4-cell quad in row B̅. Constant variables: A=0 (A̅), B=0 (B̅), E=0 (E̅). Term = A̅ B̅ E̅.\nIn Subcube 1 (A=1): cells m(17, 21, 25, 29) form a column quad. Constant variables: A=1 (A), D=0 (D̅), E=1 (E). Term = A D̅ E.',
            math: 'Term 2 = A̅ B̅ E̅, \\quad Term 3 = A D̅ E'
          },
          {
            title: 'Assemble Minimized Expression',
            explanation: 'Combine all essential prime implicants:',
            math: 'F = B E + A̅ B̅ E̅ + A D̅ E'
          }
        ],
        finalAnswer: 'F = B·E + A̅·B̅·E̅ + A·D̅·E',
        tip: 'Always look for 3D superpositions first before grouping inside a single subcube!'
      }
    ],
    commonMistakes: [
      {
        mistake: "Grouping don't cares (Xs) together when they do not cover any 1s.",
        whyItHappens: 'Thinking every X must be covered.',
        correctWay: 'Xs only exist to expand groups of 1s. A group consisting purely of Xs is completely redundant and must NEVER be formed.'
      },
      {
        mistake: 'Making groups of 3 or 6 cells.',
        whyItHappens: 'Forgetting that Boolean simplification requires powers of two (2^k: 1, 2, 4, 8, 16).',
        correctWay: 'Groups must always have size 1, 2, 4, 8, or 16. Groups of 3, 5, or 6 cells are mathematically invalid.'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Minimize F(w, x, y, z) = Σm(0, 1, 4, 8, 9, 12) + d(2, 3, 11, 15) using K-map and realize using NOR gates only.',
        'Explain 5-variable K-map with a suitable example: F(A, B, C, D, E) = Σm(0, 2, 4, 6, 9, 11, 13, 15, 17, 21, 25, 27, 29, 31).',
        'Differentiate between Prime Implicants and Essential Prime Implicants.'
      ],
      scoringKeyAdvice: 'Draw the K-map grid neatly with Gray code labels (00, 01, 11, 10). Ring each group with different line styles or colors and write the corresponding term next to each ring.'
    },
    quickRevision: {
      bulletPoints: [
        'Gray code ordering ensures Hamming distance of 1 between adjacent cells.',
        'Groups must be powers of two (1, 2, 4, 8, 16).',
        'Wrap-around: opposite edges and 4 corners are adjacent.',
        "Don't cares (X) are set to 1 if they enlarge a group, else treated as 0.",
        'Essential Prime Implicant (EPI): contains at least one 1 not in any other group.'
      ],
      importantFormulas: [
        { name: 'Elimination Rule', formula: 'A group of 2^k cells in an n-variable map eliminates k variables and leaves (n - k) literals.' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u2-p1-1',
        type: 'mcq',
        question: 'How many literals are present in the product term resulting from an 8-cell octet in a 4-variable K-map?',
        options: ['1 literal', '2 literals', '3 literals', '4 literals'],
        correctAnswer: 0,
        explanation: 'In an n=4 variable map, an octet (2^3 = 8 cells) eliminates 3 variables, leaving 4 - 3 = 1 literal.',
        marks: 2
      }
    ]
  },
  {
    id: 'u2-l2-multiplexers-and-decoders',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Combinational Logic Design',
    title: 'Multiplexers, Demultiplexers & Decoders',
    subtitle: 'Data selectors, tree expansion, universal logic synthesis, and 3-to-8 decoder applications',
    estimatedMinutes: 30,
    order: 2,
    prerequisites: ['Basic logic gates', 'Truth tables'],
    whatIsIt: {
      simpleSummary: 'A Multiplexer (MUX) is a digital rotary switch that selects one data input out of 2^n inputs and forwards it to a single output line based on n select lines. A Demultiplexer (DEMUX) does the exact reverse: it takes one input line and routes it to one of 2^n outputs based on select lines. A Decoder converts an n-bit code into 2^n unique active output lines.',
      coreDefinition: 'A $2^n:1$ MUX has $2^n$ data inputs, $n$ select lines, and 1 output. Its Boolean function is: $$Y = \\sum_{k=0}^{2^n - 1} m_k \\cdot I_k$$ where $m_k$ is the minterm formed by the select lines.',
      keyAnalogy: 'Think of a railroad track switch: multiple inbound train tracks converge into a single departure track. The position of the control lever (select lines) determines which track is connected.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In microprocessors (like ARM Cortex-M), thousands of data bytes need to travel to the ALU over shared buses. Running dedicated wires between every single peripheral would require millions of copper traces. Multiplexers time-share the bus.',
      engineeringBenefit: 'A Multiplexer can implement ANY arbitrary Boolean logic function of (n+1) variables WITHOUT ANY LOGIC GATES whatsoever! This is why modern FPGAs (Field Programmable Gate Arrays) use MUX-based Look-Up Tables (LUTs) as their fundamental logic cell.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: '4:1 Mux Architecture & Equation',
          description: '4 data inputs (I0, I1, I2, I3), 2 select lines (S1, S0), 1 output Y.',
          codeOrFormula: "Y = S1'S0'I0 + S1'S0I1 + S1S0'I2 + S1S0I3"
        },
        {
          step: 2,
          title: 'Universal Logic Function Implementation (Methodology)',
          description: 'To implement an (n+1) variable function f(A, B, C, D) using a 2^n:1 MUX: Connect n variables to select lines. The inputs I_k are derived as 0, 1, the remaining variable, or its complement.',
          codeOrFormula: "Example for f(A, B, C): Connect A, B to S1, S0. Inputs I0, I1, I2, I3 receive C, C', 0, or 1."
        },
        {
          step: 3,
          title: 'Decoder (3-to-8 / IC 74138)',
          description: 'Takes 3 binary inputs (A, B, C) and activates exactly ONE of 8 output lines (Y0 to Y7). Each output line represents a distinct minterm: Y_k = m_k. Adding an OR gate to selected decoder outputs realizes any combinational circuit!',
          codeOrFormula: "Y0 = A'B'C', Y1 = A'B'C, ... Y7 = ABC"
        }
      ],
      deepDiveNotes: [
        'Tree Expansion:',
        'An 8:1 MUX can be constructed using two 4:1 MUXes and one 2:1 MUX.',
        'A 16:1 MUX can be built using five 4:1 MUXes (4 in first stage, 1 in second stage).'
      ]
    },
    interactiveSimulatorKey: 'mux-demux',
    practicalExample: {
      scenario: 'Implementing Full Adder Sum and Carry functions using a 3-to-8 Decoder.',
      walkthrough: 'Full Adder truth table: Sum S(A, B, Cin) = Σm(1, 2, 4, 7). Carry Cout(A, B, Cin) = Σm(3, 5, 6, 7). Connect A, B, Cin to decoder inputs. Connect active-low decoder outputs 1, 2, 4, 7 to a 4-input NAND gate to obtain Sum S! Connect outputs 3, 5, 6, 7 to a second NAND gate to obtain Cout.',
      result: 'Complete Full Adder synthesized with 1 decoder chip and 2 NAND gates!'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Implement the following Boolean function using an 8:1 Multiplexer: F(A, B, C, D) = Σm(1, 3, 4, 11, 12, 13, 14, 15).',
        marks: 5,
        steps: [
          {
            title: 'Assign Select Variables',
            explanation: 'Connect variables A, B, C to select lines S2, S1, S0 respectively. Variable D will be applied to data inputs I0 through I7.',
            math: 'S2 = A, S1 = B, S0 = C'
          },
          {
            title: 'Construct Implementation Table (Minterm pairs)',
            explanation: 'Each input I_k pairs minterms m(2k) and m(2k+1) where D=0 and D=1:\nI0: m0, m1 (m1=1) -> I0 = D\nI1: m2, m3 (m3=1) -> I1 = D\nI2: m4, m5 (m4=1) -> I2 = D̅\nI3: m6, m7 (neither) -> I3 = 0\nI4: m8, m9 (neither) -> I4 = 0\nI5: m10, m11 (m11=1) -> I5 = D\nI6: m12, m13 (both 1) -> I6 = 1\nI7: m14, m15 (both 1) -> I7 = 1',
            math: 'Inputs: [I0=D, I1=D, I2=D̅, I3=0, I4=0, I5=D, I6=1, I7=1]'
          },
          {
            title: 'Draw Final Multiplexer Circuit',
            explanation: 'Connect D, D̅ (via inverter), VCC (logic 1), and GND (logic 0) to designated data inputs I0-I7. Connect A, B, C to select inputs.',
            math: 'F = Output of 8:1 MUX'
          }
        ],
        finalAnswer: 'I0=D, I1=D, I2=D̅, I3=0, I4=0, I5=D, I6=1, I7=1 with S2=A, S1=B, S0=C',
        tip: 'Show the implementation table with two rows (D̅ and D) and circle the minterms. If both minterms are circled -> 1. If only D circled -> D. If only D̅ circled -> D̅. If none circled -> 0.'
      },
      {
        difficulty: 'university',
        question: 'Implement the function F(A, B, C) = Σm(1, 2, 6, 7) using a 4:1 Multiplexer and an external inverter.',
        marks: 5,
        steps: [
          {
            title: 'Connect Select Lines',
            explanation: 'Assign variables A and B to select lines S1 and S0. Input variable C will be fed into data lines I0, I1, I2, I3.',
            math: 'S1 = A, \\quad S0 = B'
          },
          {
            title: 'Derive Data Inputs from Implementation Table',
            explanation: 'I0 (m0, m1): m0=0, m1=1 -> I0 = C\nI1 (m2, m3): m2=1, m3=0 -> I1 = C̅\nI2 (m4, m5): m4=0, m5=0 -> I2 = 0\nI3 (m6, m7): m6=1, m7=1 -> I3 = 1',
            math: 'I0 = C, \\quad I1 = \\bar{C}, \\quad I2 = 0, \\quad I3 = 1'
          },
          {
            title: 'Verify Output Expression',
            explanation: "Y = A̅B̅(C) + A̅B(C̅) + AB̅(0) + AB(1) = A̅B̅C + A̅BC̅ + AB = m1 + m2 + m6 + m7. Exactly matches specification!",
            math: 'Y = \\Sigma m(1, 2, 6, 7)'
          }
        ],
        finalAnswer: 'I0=C, I1=C̅, I2=0, I3=1 with S1=A, S0=B',
        tip: 'Always verify the resulting equation by multiplying out minterms to ensure complete mathematical accuracy.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Reversing select line weights (connecting MSB to S0 instead of S2).',
        whyItHappens: 'S0 is sometimes thought of as the first input.',
        correctWay: 'S0 is always LSB (weight 2^0 = 1). S2 or highest index is MSB.'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Implement F(A, B, C, D) = Σm(0, 1, 5, 6, 7, 9, 12, 15) using (i) 8:1 MUX (ii) 4:1 MUX with external gates.',
        'Design a 16:1 MUX using 4:1 multiplexers only. Explain the interconnection.',
        'Design a 2-bit digital comparator using a 3-to-8 decoder and basic gates.'
      ],
      scoringKeyAdvice: 'Always draw the implementation table clearly showing how inputs are derived. Label all MUX pins (Enable, S0, S1, I0..In, Y).'
    },
    quickRevision: {
      bulletPoints: [
        'MUX: 2^n data inputs -> 1 output using n select lines.',
        'DEMUX: 1 data input -> 2^n outputs using n select lines.',
        'Decoder: n inputs -> 2^n outputs; each output is a minterm.',
        'An n-variable function can be realized using a 2^(n-1):1 MUX with one variable at data inputs.'
      ],
      importantFormulas: [
        { name: 'MUX Equation', formula: 'Y = \\sum m_k I_k' },
        { name: 'Tree MUX Expansion', formula: 'N_{4:1 \\text{ required for } 16:1} = 4 + 1 = 5' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u2-p2-1',
        type: 'mcq',
        question: 'How many 4:1 multiplexers are needed to construct a 64:1 multiplexer?',
        options: ['21', '16', '20', '17'],
        correctAnswer: 0,
        explanation: 'Stage 1: 64/4 = 16 MUXes. Stage 2: 16/4 = 4 MUXes. Stage 3: 4/4 = 1 MUX. Total = 16 + 4 + 1 = 21.',
        marks: 2
      }
    ]
  },
  {
    id: 'u2-l3-adders-and-arithmetic-circuits',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Combinational Logic Design',
    title: 'Adders, Subtractors & Carry-Lookahead Circuits',
    subtitle: 'Half & full adders/subtractors, ripple carry propagation delay, lookahead carry generator, and 2s complement adder-subtractor',
    estimatedMinutes: 30,
    order: 3,
    prerequisites: ['Binary arithmetic', 'XOR gate characteristics'],
    whatIsIt: {
      simpleSummary: 'Adders are the fundamental computational engine of every computer processor. A Half Adder adds two 1-bit inputs (producing Sum and Carry). A Full Adder adds three 1-bit inputs (A, B, and Carry-in Cin). By chaining full adders, we build multi-bit adders. By inserting XOR gates on the B input and feeding Cin=1, a single circuit serves as both an adder and subtractor!',
      coreDefinition: 'Full Adder equations: $$\\text{Sum } S = A \\oplus B \\oplus C_{in}, \\quad C_{out} = AB + BC_{in} + AC_{in} = AB + C_{in}(A \\oplus B)$$',
      keyAnalogy: 'Think of doing column addition with pencil and paper: when the sum of a column exceeds 1, you write down the units digit (Sum) and carry 1 to the next column to the left (Carry).'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In a standard 32-bit Ripple Carry Adder, bit 31 cannot produce its sum until the carry from bit 0 has rippled sequentially through 31 prior stages. At 2 gate delays per full adder, this creates 64 gate delays! This severely throttles CPU clock frequency.',
      engineeringBenefit: 'Carry Lookahead Adders (CLA) calculate carries for ALL stages in parallel simultaneously in just 2 gate delays using Generate (G = AB) and Propagate (P = A ⊕ B) logic!'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Half Adder (2 Inputs: A, B)',
          description: 'Sum is XOR of inputs; Carry is AND of inputs.',
          codeOrFormula: 'Sum = A ⊕ B, Carry = A · B'
        },
        {
          step: 2,
          title: 'Full Adder from Two Half Adders',
          description: 'HA1 adds A and B to generate intermediate sum S1 = A ⊕ B and carry C1 = AB. HA2 adds S1 and Cin to generate final Sum = S1 ⊕ Cin and carry C2. Final Cout = C1 + C2.',
          codeOrFormula: 'S = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B)'
        },
        {
          step: 3,
          title: '4-Bit Adder / Subtractor Circuit (Mode Control M)',
          description: 'Inputs B0..B3 pass through XOR gates with Mode line M. When M=0: B ⊕ 0 = B and Cin=0 -> Adds A + B. When M=1: B ⊕ 1 = B̅ and Cin=1 -> Adds A + B̅ + 1 = A - B (2s complement subtraction)!',
          codeOrFormula: 'Mode M = 0 (Addition), Mode M = 1 (Subtraction)'
        },
        {
          step: 4,
          title: 'Carry Lookahead Principle (CLA)',
          description: 'Define Carry Generate Gi = Ai·Bi and Carry Propagate Pi = Ai ⊕ Bi. Express carries in terms of inputs and C0 directly without waiting for prior stages.',
          codeOrFormula: 'C1 = G0 + P0·C0, C2 = G1 + P1·G0 + P1·P0·C0, C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0'
        }
      ],
      deepDiveNotes: [
        'Propagation Delay Comparison:',
        'n-bit Ripple Carry Adder delay: T_ripple = 2n gate delays. For 32 bits: 64 delays.',
        'n-bit Carry Lookahead Adder delay: T_CLA = 4 gate delays, completely independent of bit width n!'
      ]
    },
    interactiveSimulatorKey: 'binary-arithmetic',
    practicalExample: {
      scenario: 'Building a Full Subtractor using two Half Subtractors.',
      walkthrough: 'Half Subtractor equations: Difference D = A ⊕ B, Borrow Bout = A̅B. Full Subtractor equations: D = A ⊕ B ⊕ Bin, Bout = A̅B + Bin(A ⊕ B)̅. Can be implemented with two Half Subtractors and one OR gate.',
      result: 'Verified equivalent to Full Adder with inverter on input A.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Design a Carry Lookahead Adder (CLA). Derive the expressions for carry bits C1, C2, C3, and C4 and explain how it achieves high-speed addition.',
        marks: 5,
        steps: [
          {
            title: 'Define Carry Generate and Propagate',
            explanation: 'G_i = A_i · B_i (carry generated internally)\nP_i = A_i ⊕ B_i (carry propagated through)',
            math: 'G_i = A_i B_i, P_i = A_i \\oplus B_i'
          },
          {
            title: 'Express Carry Equations Unfolded in C0',
            explanation: 'C1 = G0 + P0·C0\nC2 = G1 + P1·C1 = G1 + P1·G0 + P1·P0·C0\nC3 = G2 + P2·C2 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0\nC4 = G3 + P3·C3 = G3 + P3·G2 + P3·P2·G1 + P3·P2·P1·G0 + P3·P2·P1·P0·C0',
            math: 'C_i = \\text{Two-level AND-OR function of } G, P, C_0'
          },
          {
            title: 'Explain Speed Advantage',
            explanation: 'All carries C1 to C4 are generated simultaneously within 2 gate delays (one AND level, one OR level) directly from initial inputs and C0, eliminating ripple cascade.',
            math: '\\text{Total Delay} = \\text{Generate } P_i, G_i (1 \\text{ delay}) + \\text{AND-OR Carry Logic} (2 \\text{ delays}) = 3 \\text{ delays}'
          }
        ],
        finalAnswer: 'All carries C1-C4 evaluated in parallel in 2 gate delays',
        tip: 'Highlight the trade-off: CLA achieves ultra-high speed at the expense of higher fan-in on AND/OR gates for higher bits.'
      },
      {
        difficulty: 'intermediate',
        question: 'Design a 4-bit Binary Adder-Subtractor circuit. Show how a single Mode control pin M switches between addition and subtraction.',
        marks: 5,
        steps: [
          {
            title: 'Analyze XOR Inversion Mechanism',
            explanation: 'Connect each bit B_i to one input of an XOR gate, and connect control line M to the second input of all XOR gates.\nWhen M = 0: B_i ⊕ 0 = B_i (True values passed).\nWhen M = 1: B_i ⊕ 1 = B_i̅ (Bitwise 1s complement produced).',
            math: 'B_i^* = B_i \\oplus M'
          },
          {
            title: 'Analyze Carry-In Injection',
            explanation: 'Connect Mode line M directly to the Carry-In (C0) of the first full adder (FA0).\nWhen M = 0: C0 = 0 -> Sum = A + B + 0 = A + B.\nWhen M = 1: C0 = 1 -> Sum = A + B̅ + 1 = A - B (2s complement subtraction)!',
            math: 'C_0 = M'
          },
          {
            title: 'Evaluate Hardware Operation',
            explanation: 'The circuit performs two operations with zero extra adders: when M=0 it adds, when M=1 it subtracts A - B.',
            math: '\\text{Operation} = A + (-1)^M B'
          }
        ],
        finalAnswer: 'Mode line M controls both XOR inversion and initial carry-in C0',
        tip: 'Clearly draw the 4 Full Adder blocks with XOR gates above each B input.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using OR instead of XOR for Half Adder Sum.',
        whyItHappens: 'Confusing logic OR with arithmetic addition (1 + 1 = 0 with carry 1, whereas 1 OR 1 = 1).',
        correctWay: 'Sum must be XOR: 1 ⊕ 1 = 0.'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Design a 4-bit parallel adder/subtractor circuit using Full Adders and XOR gates. Explain operation for M=0 and M=1.',
        'Derive Carry Lookahead logic equations and show why it is faster than a Ripple Carry Adder.',
        'Implement a Full Adder using (i) two Half Adders and an OR gate (ii) minimum number of NAND gates (9 NANDs).'
      ],
      scoringKeyAdvice: 'Draw the circuit schematic with signal labels (A0-A3, B0-B3, C0-C4). Clearly explain the two modes M=0 (add) and M=1 (subtract).'
    },
    quickRevision: {
      bulletPoints: [
        'Half Adder: S = A ⊕ B, C = AB.',
        'Full Adder: S = A ⊕ B ⊕ Cin, Cout = AB + Cin(A ⊕ B).',
        'Adder-Subtractor uses XOR on B lines controlled by Mode M.',
        'Ripple delay = 2n gate delays; Carry Lookahead delay = 4 gate delays constant.'
      ],
      importantFormulas: [
        { name: 'Full Adder Sum', formula: 'S = A \\oplus B \\oplus C_{in}' },
        { name: 'Full Adder Carry', formula: 'C_{out} = AB + C_{in}(A \\oplus B)' },
        { name: 'Carry Lookahead', formula: 'C_{i+1} = G_i + P_i C_i' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u2-p3-1',
        type: 'mcq',
        question: 'What is the minimum number of 2-input NAND gates required to implement a Full Adder?',
        options: ['9', '8', '10', '12'],
        correctAnswer: 0,
        explanation: 'A Full Adder can be realized with exactly 9 two-input NAND gates (5 for the two XORs and 4 for the carry logic).',
        marks: 2
      }
    ]
  },
  {
    id: 'u2-l4-quine-mccluskey-and-mev',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Combinational Logic Design',
    title: 'Quine-McCluskey (Tabular) Minimization & MEV Method',
    subtitle: 'Tabular prime implicant determination, Petrick\'s method, essential prime implicant coverage table, and Map-Entered Variables',
    estimatedMinutes: 40,
    order: 4,
    prerequisites: ['Karnaugh map minimization', 'Minterms and Prime Implicants'],
    whatIsIt: {
      simpleSummary: 'When a Boolean function has 5, 6, or more variables, graphical K-maps become extremely difficult and error-prone for humans to visualize. The Quine-McCluskey (Tabular) Method provides a systematic, deterministic, algorithmic method for finding all Prime Implicants and extracting the minimal cover. The Map-Entered Variable (MEV) method allows an n-variable function to be simplified on a smaller (n-1 or n-2) variable K-map by entering literal variables directly into the cells.',
      coreDefinition: 'Quine-McCluskey operates in two phases:\n1. Phase 1 (Grouping & Elimination): Successive grouping by count of 1s and merging adjacent terms differing by 1 bit to find all Prime Implicants (PIs).\n2. Phase 2 (Prime Implicant Table): Constructing a coverage table to select the minimum set of Essential Prime Implicants (EPIs) that covers all minterms.',
      keyAnalogy: 'Think of K-maps like solving a jigsaw puzzle visually, whereas Quine-McCluskey is like a computer sorting and matching barcode strings automatically.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Modern Electronic Design Automation (EDA) synthesis software (like Cadence or Synopsys) cannot rely on human eyesight to look at 10-variable maps. Algorithms require tabular matrices.',
      engineeringBenefit: 'Guarantees the absolute mathematically minimal solution and can be fully automated in computer software.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Group by Number of 1s',
          description: 'Convert minterms and don\'t cares to binary. Partition them into groups according to the number of 1s in their binary representation (Group 0, Group 1, Group 2...).',
          codeOrFormula: 'Index by count of 1s: countOnes(binary)'
        },
        {
          step: 2,
          title: 'Pair Matching (Differ by 1 Bit)',
          description: 'Compare terms in Group k with Group k+1. If two terms differ in exactly ONE bit position, combine them and replace the differing bit with a dash (-). Check off both terms.',
          codeOrFormula: 'Example: 0000 and 0010 differ at bit 1 -> 00-0'
        },
        {
          step: 3,
          title: 'Identify Prime Implicants (PIs)',
          description: 'Repeat step 2 for 2-cell terms, 4-cell terms, etc., until no further combinations can be made. Any term that could NOT be combined is a Prime Implicant!',
          codeOrFormula: 'Unchecked terms = Prime Implicants'
        },
        {
          step: 4,
          title: 'Prime Implicant Table & Essential PIs',
          description: 'Create a table where columns are the original minterms (do NOT include don\'t cares in columns!) and rows are the Prime Implicants. Place an X if a PI covers a minterm. If a column has only ONE X, that PI is an Essential Prime Implicant (EPI)!',
          codeOrFormula: 'EPI = unique row covering a solitary minterm column'
        },
        {
          step: 5,
          title: 'Map-Entered Variable (MEV) Method',
          description: 'Compress a large K-map by designating one variable (e.g. E) as an entered variable. Cells contain 0, 1, E, or E̅. Solve first for terms with 1 (treating E as 0), then solve for terms with E (treating 1s as don\'t cares).',
          codeOrFormula: 'F = F(cells=1) + E · F(cells=E)'
        }
      ],
      deepDiveNotes: [
        'Petrick\'s Method:',
        'Used when the Prime Implicant Table has no essential prime implicants (cyclic table).',
        'Formulates a product-of-sums Boolean expression where each sum represents a column requirement, and expands into minimal SOP to pick the fewest PIs!'
      ]
    },
    interactiveSimulatorKey: 'quine-mccluskey',
    practicalExample: {
      scenario: 'Minimizing F(A, B, C, D) = Σm(0, 1, 2, 8, 10, 11, 14, 15) using Quine-McCluskey.',
      walkthrough: 'Binary grouping: Group 0: m0(0000). Group 1: m1(0001), m2(0010), m8(1000). Group 2: m10(1010). Group 3: m11(1011), m14(1110). Group 4: m15(1111).\nPairs: (0,1)->000-, (0,2)->00-0, (0,8)->-000, (2,10)->-010, (8,10)->10-0, (10,11)->101-, (10,14)->1-10, (11,15)->1-11, (14,15)->111-.\nQuads: (0,2,8,10) combined from (0,2)+(8,10) -> -0-0 = B̅D̅. (10,11,14,15) combined from (10,11)+(14,15) -> 1-1- = AC.\nRemaining single pair: (0,1) -> 000- = A̅B̅C̅.\nPI table reveals B̅D̅, AC, and A̅B̅C̅ cover all minterms.',
      result: 'Minimized Expression: F = B̅D̅ + AC + A̅B̅C̅'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Minimize the following Boolean function using the Quine-McCluskey tabular method: F(A, B, C, D) = Σm(0, 2, 8, 10, 14, 15) + d(5, 7). Show all tables and derive the minimal SOP expression.',
        marks: 10,
        steps: [
          {
            title: 'Table 1: Initial Grouping by Number of 1s',
            explanation: 'Group 0: m0 (0000)\nGroup 1: m2 (0010), m8 (1000)\nGroup 2: m10 (1010), d5 (0101)\nGroup 3: m14 (1110), d7 (0111)\nGroup 4: m15 (1111)',
            math: '\\text{All minterms and don\'t cares partitioned into 5 groups}'
          },
          {
            title: 'Table 2: Form 2-Minterm Pairs',
            explanation: '(0,2) -> 00-0 ✓\n(0,8) -> -000 ✓\n(2,10) -> -010 ✓\n(8,10) -> 10-0 ✓\n(10,14) -> 1-10 ✓\n(5,7) -> 01-1 ✓\n(14,15) -> 111- ✓\n(7,15) -> -111 ✓',
            math: '\\text{8 pairs formed}'
          },
          {
            title: 'Table 3: Form 4-Minterm Quads & List Prime Implicants',
            explanation: 'Combining (0,2)+(8,10) and (0,8)+(2,10) yields:\n- m(0,2,8,10) -> -0-0 = B̅D̅ (Prime Implicant 1)\n- m(10,14) -> 1-10 = ACD̅ (Prime Implicant 2)\n- m(5,7) -> 01-1 = A̅BD (Prime Implicant 3)\n- m(14,15) -> 111- = ABC (Prime Implicant 4)\n- m(7,15) -> -111 = BCD (Prime Implicant 5)',
            math: 'PI_1 = \\bar{B}\\bar{D}, \\quad PI_2 = A C \\bar{D}, \\quad PI_3 = \\bar{A} B D, \\quad PI_4 = A B C, \\quad PI_5 = B C D'
          },
          {
            title: 'Construct Prime Implicant Table for Minterms (0, 2, 8, 10, 14, 15)',
            explanation: 'Minterms 0 and 8 are covered ONLY by B̅D̅ -> B̅D̅ is Essential!\nMinterm 15 is covered by ABC and BCD.\nSelecting B̅D̅ + ABC covers all minterms.',
            math: 'F = \\bar{B}\\bar{D} + A B C + A C \\bar{D}'
          }
        ],
        finalAnswer: 'F = B̅D̅ + ABC + ACD̅ (or B̅D̅ + ABC + BCD)',
        tip: 'Never include don\'t cares (d5, d7) as column headers in the Prime Implicant Table! Only original minterms get columns.'
      },
      {
        difficulty: 'university',
        question: 'Explain the Map-Entered Variable (MEV) method. Simplify the 4-variable function F(A, B, C, D) using a 3-variable K-map with D as the entered variable.',
        marks: 5,
        steps: [
          {
            title: 'MEV Concept & 3-Variable Map Layout',
            explanation: 'Map-Entered Variable method uses a 3-variable K-map (variables A, B, C) where each cell can contain: 0, 1, D, or D̅.\nFor each cell, if output is 1 for D=0 and D=1 -> cell value is 1.\nIf output is 1 only for D=1 -> cell value is D.\nIf output is 1 only for D=0 -> cell value is D̅.',
            math: '\\text{Map Size reduced by } 50\\%'
          },
          {
            title: 'Two-Pass Minimization Rule',
            explanation: 'Pass 1 (Constant 1s): Group cells containing 1. Treat all D and D̅ as 0. Derive term F1.\nPass 2 (Variable D): Group cells containing D. Treat all cells with 1 as Don\'t Care (X) because they are already covered! Multiply group by D to get F2.',
            math: 'F = F_1 + D \\cdot F_2'
          },
          {
            title: 'Final Expression Synthesis',
            explanation: 'Combining Pass 1 and Pass 2 terms yields the exact simplified Boolean function with 50% fewer K-map cells.',
            math: 'F = F_1 + D \\cdot F_2'
          }
        ],
        finalAnswer: 'F = F1 + D·F2 with cells containing 1, 0, D, D̅',
        tip: 'In Pass 2, remember the crucial rule: cells containing 1 become Don\'t Cares (X) to allow larger groups for variable D!'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Putting don\'t care minterms as column headers in the Prime Implicant Table.',
        whyItHappens: 'Students include all input numbers in both tables.',
        correctWay: 'Don\'t cares are used in Table 1 and 2 to find PIs, but MUST BE EXCLUDED from the PI Table columns because don\'t cares do not need to be covered!'
      }
    ],
    examPerspective: {
      expectedMarks: '10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Minimize F(A, B, C, D) = Σm(1, 3, 4, 5, 10, 11, 12, 13, 14, 15) using the Quine-McCluskey method. Show the PI table and select essential prime implicants.',
        'Explain the Map-Entered Variable (MEV) method for simplifying high-variable Boolean functions.',
        'What is Petrick\'s method? When is it used in tabular minimization?'
      ],
      scoringKeyAdvice: 'Clearly present Column 1 (groups of 1s), Column 2 (paired terms), and the Prime Implicant Table with tick marks.'
    },
    quickRevision: {
      bulletPoints: [
        'Quine-McCluskey is an algorithmic method ideal for >= 5 variables.',
        'Terms differing by 1 bit are merged with a dash (-).',
        'Unchecked terms are Prime Implicants (PIs).',
        'PI table columns hold minterms only (no don\'t cares).',
        'MEV compresses an n-variable map into (n-1) variables by entering literals (D, D\') in cells.'
      ],
      importantFormulas: [
        { name: 'Can Combine Rule', formula: '0010 \\text{ and } 0011 \\implies 001-' },
        { name: 'MEV Rule', formula: 'F = F(cells=1) + D \\cdot F(cells=D, cells=1 \\to X)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u2-p4-1',
        type: 'mcq',
        question: 'In the Quine-McCluskey method, what does a column with a single "X" in the Prime Implicant Table signify?',
        options: [
          'The row containing that X is an Essential Prime Implicant (EPI).',
          'The minterm is redundant and can be deleted.',
          'There is a critical race condition.',
          'The function is invalid.'
        ],
        correctAnswer: 0,
        explanation: 'A solitary X in a minterm column means that only ONE prime implicant covers that minterm; therefore, that prime implicant is Essential and MUST be included in the final solution.',
        marks: 2
      }
    ]
  },
  {
    id: 'u2-l5-comparators-encoders-and-code-converters',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'Combinational Logic Design',
    title: 'Digital Comparators, Priority Encoders & Code Converters',
    subtitle: '4-bit magnitude comparator (IC 7485), 8-to-3 priority encoder (IC 74148), parity generators/checkers, and code conversion',
    estimatedMinutes: 35,
    order: 5,
    prerequisites: ['Binary numbers', 'Logic gate implementations'],
    whatIsIt: {
      simpleSummary: 'Combinational logic extends beyond basic addition into comparison, arbitration, and translation. A Magnitude Comparator compares two multi-bit binary numbers ($A$ and $B$) to determine whether $A > B$, $A = B$, or $A < B$. A Priority Encoder arbitrates among multiple active input requests and outputs the binary address of the highest-priority request. Code Converters translate between different binary numbering systems (e.g. Binary to Gray, BCD to Excess-3).',
      coreDefinition: 'A 4-bit Magnitude Comparator uses bitwise XNOR equivalence gates x_i = A_i B_i + A_i\' B_i\'. Equality condition: (A = B) = x_3 x_2 x_1 x_0. Greater-than condition: (A > B) = A_3 B_3\' + x_3 A_2 B_2\' + x_3 x_2 A_1 B_1\' + x_3 x_2 x_1 A_0 B_0\'.',
      keyAnalogy: 'A Priority Encoder is like an emergency triage room: even if patients with mild headaches are waiting, the patient with chest pain (highest priority) is admitted first!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In microprocessors (like the NVIC interrupt controller in ARM Cortex-M), several hardware peripherals may raise interrupt requests simultaneously. The CPU needs hardware priority encoders to instantly decide which interrupt gets serviced first without executing software loops.',
      engineeringBenefit: 'Dedicated comparator and encoder MSI chips (IC 7485, IC 74148) perform evaluation in under 15 nanoseconds.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Magnitude Comparator Logic',
          description: 'Compare bits starting from the Most Significant Bit (MSB). If A3 > B3 (A3=1, B3=0), then A > B immediately, regardless of lower bits! Only if A3 = B3 (x3=1) does the circuit inspect bit 2, and so forth.',
          codeOrFormula: 'x_i = A_i B_i + A_i\'B_i\''
        },
        {
          step: 2,
          title: 'Priority Encoder Operation (8-to-3)',
          description: 'Inputs D0 to D7. If D7=1, output Y2 Y1 Y0 = 111 (7) regardless of D0..D6. Valid bit V = 1 if ANY input is active; V = 0 if all inputs are 0.',
          codeOrFormula: 'Y_2 = D_4 + D_5 + D_6 + D_7; V = D_0 + D_1 + ... + D_7'
        },
        {
          step: 3,
          title: 'BCD to Excess-3 Code Converter',
          description: 'Translates 4-bit BCD (A, B, C, D) to Excess-3 (W, X, Y, Z) by adding 3 (0011₂). Minimized using K-maps: W = A + BC + BD, X = B\'C + B\'D + BC\'D\', Y = CD + C\'D\', Z = D\'.',
          codeOrFormula: 'W = A + B(C + D), Z = D\''
        },
        {
          step: 4,
          title: 'Parity Generator & Checker (IC 74180)',
          description: 'Uses XOR tree. Even Parity bit P = A ⊕ B ⊕ C ⊕ D. The checker re-evaluates parity at the receiver: if PEC = P ⊕ A ⊕ B ⊕ C ⊕ D = 1, a single-bit transmission error occurred!',
          codeOrFormula: 'P = A ⊕ B ⊕ C ⊕ D'
        }
      ],
      deepDiveNotes: [
        'Cascading Comparators:',
        'Two 4-bit comparators (IC 7485) can be cascaded to compare 8-bit numbers.',
        'Connect the lower comparator\'s outputs (A>B, A=B, A<B) into the cascading inputs of the higher comparator!'
      ]
    },
    interactiveSimulatorKey: 'priority-comparator',
    practicalExample: {
      scenario: 'Comparing A = 1011 (11) and B = 1001 (9) using a 4-bit comparator.',
      walkthrough: 'Bit 3: A3=1, B3=1 -> x3 = 1 (Equal).\nBit 2: A2=0, B2=0 -> x2 = 1 (Equal).\nBit 1: A1=1, B1=0 -> A1·B1\' = 1. Since x3=1 and x2=1, the term x3·x2·A1·B1\' becomes 1! Output (A > B) goes HIGH immediately.',
      result: 'Output: (A > B) = 1, (A = B) = 0, (A < B) = 0.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Design a 4-bit Magnitude Comparator. Derive the Boolean expressions for (A = B), (A > B), and (A < B) and draw the logic gate schematic.',
        marks: 10,
        steps: [
          {
            title: 'Define Bitwise Equality (XNOR gates)',
            explanation: 'Let A = (A3 A2 A1 A0) and B = (B3 B2 B1 B0). Two bits are equal if x_i = A_i B_i + A_i\' B_i\' = (A_i ⊕ B_i)\'.',
            math: 'x_i = A_i B_i + \\bar{A}_i \\bar{B}_i'
          },
          {
            title: 'Derive (A = B) Equation',
            explanation: 'A equals B only if ALL four bit pairs are equal simultaneously:',
            math: '(A = B) = x_3 \\cdot x_2 \\cdot x_1 \\cdot x_0'
          },
          {
            title: 'Derive (A > B) Equation',
            explanation: 'A is greater than B if MSB A3 > B3, OR if A3=B3 and A2 > B2, OR if A3=B3, A2=B2 and A1 > B1, OR if higher 3 bits equal and A0 > B0:',
            math: '(A > B) = A_3 \\bar{B}_3 + x_3 A_2 \\bar{B}_2 + x_3 x_2 A_1 \\bar{B}_1 + x_3 x_2 x_1 A_0 \\bar{B}_0'
          },
          {
            title: 'Derive (A < B) Equation',
            explanation: 'Similarly, A is less than B if:',
            math: '(A < B) = \\bar{A}_3 B_3 + x_3 \\bar{A}_2 B_2 + x_3 x_2 \\bar{A}_1 B_1 + x_3 x_2 x_1 \\bar{A}_0 B_0'
          }
        ],
        finalAnswer: '(A=B) = x3·x2·x1·x0, (A>B) = A3B3\' + x3A2B2\' + x3x2A1B1\' + x3x2x1A0B0\'',
        tip: 'Show the hierarchical decision tree: MSB dominates, lower bits only matter when higher bits are equal.'
      },
      {
        difficulty: 'university',
        question: 'Design a BCD-to-Excess-3 code converter using minimum number of logic gates. Show the truth table, K-maps for outputs W, X, Y, Z, and circuit diagram.',
        marks: 5,
        steps: [
          {
            title: 'Truth Table (Inputs A, B, C, D; Outputs W, X, Y, Z)',
            explanation: 'Input BCD (0 to 9); Outputs XS-3 = BCD + 3 (0011₂). Don\'t cares for inputs 10 to 15 (1010 to 1111).',
            math: 'W X Y Z = (A B C D)_{BCD} + 0011_2'
          },
          {
            title: 'K-Map Simplification for Outputs',
            explanation: 'W(A,B,C,D) = Σm(5,6,7,8,9) + d(10-15) -> W = A + BC + BD = A + B(C + D)\nX(A,B,C,D) = Σm(1,2,3,4,9) + d(10-15) -> X = B\'C + B\'D + BC\'D\' = B\'(C + D) + B(C + D)\'\nY(A,B,C,D) = Σm(0,3,4,7,8) + d(10-15) -> Y = CD + C\'D\' = (C ⊕ D)\'\nZ(A,B,C,D) = Σm(0,2,4,6,8) + d(10-15) -> Z = D\'',
            math: 'W = A + B(C + D), \\quad X = B \\oplus (C + D), \\quad Y = (C \\oplus D)\', \\quad Z = \\bar{D}'
          },
          {
            title: 'Hardware Optimization',
            explanation: 'Notice that (C + D) is shared between W and X, and (C ⊕ D) is used in Y. The entire converter requires only 4 gates!',
            math: '\\text{Common sub-expression: } (C + D)'
          }
        ],
        finalAnswer: 'W = A + B(C + D), X = B ⊕ (C + D), Y = (C ⊕ D)\', Z = D\'',
        tip: 'State that inputs 10-15 are don\'t cares (d) in BCD; using them dramatically shrinks the gate count.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the cascading inputs when drawing an expandable comparator.',
        whyItHappens: 'Designing only for a single isolated 4-bit chip.',
        correctWay: 'In IC 7485, cascading inputs (I_{A>B}, I_{A=B}, I_{A<B}) allow chaining multiple chips for 8-bit or 16-bit comparisons.'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'High',
      typicalDtuQuestions: [
        'Design a 4-bit magnitude comparator. How can two 4-bit comparators be cascaded to compare two 8-bit numbers?',
        'Design a 4-to-2 Priority Encoder with an active-high Valid output bit.',
        'Design a BCD to Excess-3 code converter using NAND gates only.'
      ],
      scoringKeyAdvice: 'Define the equivalence variable x_i clearly before writing the (A>B) and (A<B) equations.'
    },
    quickRevision: {
      bulletPoints: [
        'Comparator equality: (A = B) = x3·x2·x1·x0 where x_i = (A_i ⊕ B_i)\'.',
        'Comparator greater: checks from MSB down, gated by equality bits.',
        'Priority encoder outputs binary code of highest active line; has Valid bit V.',
        'BCD to Excess-3 adds 3 (0011₂) with inputs 10-15 treated as don\'t cares.',
        'Parity generator uses XOR tree; checker evaluates overall parity.'
      ],
      importantFormulas: [
        { name: 'Bit Equality', formula: 'x_i = A_i B_i + \\bar{A}_i \\bar{B}_i = \\overline{A_i \\oplus B_i}' },
        { name: '4-Bit Equality', formula: '(A = B) = x_3 x_2 x_1 x_0' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u2-p5-1',
        type: 'mcq',
        question: 'In a 4-bit digital magnitude comparator, under what condition is the term x3·x2·A1·B1\' activated to make (A > B) = 1?',
        options: [
          'When bit 3 and bit 2 of both numbers are equal (A3=B3 and A2=B2), and A1=1 while B1=0.',
          'When A3 > B3 regardless of lower bits.',
          'When all four bits are equal.',
          'When A1 < B1.'
        ],
        correctAnswer: 0,
        explanation: 'x3=1 indicates A3=B3, x2=1 indicates A2=B2. With the two most significant bits equal, A1=1 and B1=0 definitively makes A > B.',
        marks: 2
      }
    ]
  }
];
