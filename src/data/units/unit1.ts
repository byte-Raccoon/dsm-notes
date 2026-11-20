import { LessonContent } from '../../types';

export const unit1Lessons: LessonContent[] = [
  {
    id: 'u1-l1-positional-number-systems',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Number Systems and Codes',
    title: 'Positional Number Systems & Radix Conversion',
    subtitle: 'Base-r systems, integer division, fractional multiplication, and octal-hexadecimal grouping shortcuts',
    estimatedMinutes: 25,
    order: 1,
    prerequisites: ['Basic elementary arithmetic and place values'],
    whatIsIt: {
      simpleSummary: 'A positional number system represents any quantity as an ordered sequence of digits where the actual numerical value of each digit depends strictly on its position relative to the radix point.',
      coreDefinition: 'In a base-r (radix $r$) positional numeral system, a number $N = (d_{n-1} d_{n-2} \\dots d_1 d_0 . d_{-1} d_{-2} \\dots d_{-m})_r$ evaluates to the weighted sum: $$N = \\sum_{i=-m}^{n-1} d_i \\cdot r^i \\quad \\text{where } 0 \\le d_i < r$$',
      keyAnalogy: 'Think of car mileage odometers: each wheel increments from 0 to 9, and passing 9 carries a 1 over to the column with 10 times higher weight.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Physical computer hardware operates with digital transistors that have two reliable stable states (cutoff and saturation, corresponding to 0V and 5V). Therefore, computers natively think in base 2 (binary). However, humans think in base 10 (decimal), while computer engineers use base 8 (octal) and base 16 (hexadecimal) as compact, human-readable representations of long binary words.',
      engineeringBenefit: 'Hexadecimal compacts 4 binary bits into a single character (e.g., 11111111_2 becomes FF_16), drastically reducing communication errors in memory addresses and debugging.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Decimal to Base-r Conversion (Integer Part)',
          description: 'Repeatedly divide the integer decimal number by target base r. The remainder at each step becomes the next digit, collected from bottom to top (LSB to MSB).',
          codeOrFormula: 'Quotient = floor(N / r), Remainder = N mod r'
        },
        {
          step: 2,
          title: 'Decimal to Base-r Conversion (Fractional Part)',
          description: 'Repeatedly multiply the fractional part by target base r. The integer part of each product becomes the next fractional digit, collected top-down (first digit after radix point).',
          codeOrFormula: 'Product = Fraction * r, IntegerDigit = floor(Product), NextFrac = Product - IntegerDigit'
        },
        {
          step: 3,
          title: 'Binary <-> Octal / Hexadecimal Direct Grouping',
          description: 'Because 8 = 2^3 and 16 = 2^4, group binary bits in 3s (for octal) or 4s (for hexadecimal) starting outward from the radix point, adding leading/trailing zeros as padding.',
          codeOrFormula: '(11010110.1011)_2 = (1101 0110 . 1011)_2 = (D6.B)_16'
        }
      ],
      deepDiveNotes: [
        'Radix-r conversion is mathematically exact for integers, but may yield repeating non-terminating fractions when converting decimal fractions to binary (e.g., decimal 0.1 is an infinite recurring binary fraction 0.000110011...)!'
      ]
    },
    interactiveSimulatorKey: 'base-converter',
    practicalExample: {
      scenario: 'Converting memory address 42.625 decimal to binary representation for microcontroller RAM addressing.',
      walkthrough: 'Integer 42 / 2: 42=2*21+0, 21=2*10+1, 10=2*5+0, 5=2*2+1, 2=2*1+0, 1=2*0+1. Integer bits: 101010_2. Fractional part 0.625: 0.625*2=1.25 (1), 0.25*2=0.50 (0), 0.5*2=1.00 (1). Fractional bits: .101_2.',
      result: '(42.625)_10 = (101010.101)_2 = (52.5)_8 = (2A.A)_16'
    },
    solvedProblems: [
      {
        difficulty: 'easy',
        question: 'Convert decimal (105.75)₁₀ to its binary and hexadecimal equivalents.',
        marks: 3,
        steps: [
          {
            title: 'Convert Integer Part (105)',
            explanation: '105 ÷ 2 = 52 R 1, 52 ÷ 2 = 26 R 0, 26 ÷ 2 = 13 R 0, 13 ÷ 2 = 6 R 1, 6 ÷ 2 = 3 R 0, 3 ÷ 2 = 1 R 1, 1 ÷ 2 = 0 R 1.',
            math: '(105)₁₀ = (1101001)₂'
          },
          {
            title: 'Convert Fractional Part (0.75)',
            explanation: '0.75 × 2 = 1.50 (1), 0.50 × 2 = 1.00 (1). Stop.',
            math: '(0.75)₁₀ = (0.11)₂'
          },
          {
            title: 'Convert to Hexadecimal by Grouping 4s',
            explanation: 'Group in 4s from decimal point: (0110 1001 . 1100)₂ = (69.C)₁₆',
            math: '(105.75)₁₀ = (1101001.11)₂ = (69.C)₁₆'
          }
        ],
        finalAnswer: '(1101001.11)₂ and (69.C)₁₆',
        tip: 'Always pad leading zeros on the integer side and trailing zeros on the fractional side!'
      },
      {
        difficulty: 'university',
        question: 'Find the radix r if (302 / 20)ᵣ = 12.1ᵣ.',
        marks: 5,
        steps: [
          {
            title: 'Express Equation in Polynomial Terms',
            explanation: 'Cross multiply: (302)ᵣ = (12.1)ᵣ × (20)ᵣ. Expand both sides in powers of base r:',
            math: '3r² + 0r + 2 = (1·r¹ + 2·r⁰ + 1·r⁻¹) × (2·r¹ + 0·r⁰)'
          },
          {
            title: 'Multiply RHS',
            explanation: 'RHS = (r + 2 + 1/r) × (2r) = 2r² + 4r + 2.',
            math: '3r² + 2 = 2r² + 4r + 2'
          },
          {
            title: 'Solve Quadratic for r',
            explanation: 'Subtract (2r² + 4r + 2) from both sides: r² - 4r = 0 → r(r - 4) = 0.',
            math: 'r = 4 (since r cannot be 0, and digits 0, 2, 3 require r > 3)'
          }
        ],
        finalAnswer: 'Radix r = 4',
        tip: 'In radix determination questions, always verify that the base is strictly greater than the maximum digit present in the equation (here 3, so r > 3).'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Reading fractional conversion remainders bottom-up instead of top-down.',
        whyItHappens: 'Students confuse the integer division rule with the fraction multiplication rule.',
        correctWay: 'Integer division remainders are read BOTTOM-UP (LSB to MSB). Fractional multiplication digits are read TOP-DOWN (MSB to LSB).'
      },
      {
        mistake: 'Padding zeros incorrectly when grouping 4 bits for hexadecimal.',
        whyItHappens: 'Putting padding zeros on the wrong side shifts the place value completely.',
        correctWay: 'For integers, pad zeros to the LEFT (e.g. 11010 -> 0001 1010). For fractions, pad zeros to the RIGHT (e.g. .101 -> .1010).'
      }
    ],
    examPerspective: {
      expectedMarks: '2-5 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Convert (756.603)₈ to Hexadecimal and Decimal.',
        'Find the value of base b if (24)b + (14)b = (41)b.',
        'State the advantages of octal and hexadecimal systems in microprocessor systems.'
      ],
      scoringKeyAdvice: 'Show complete step-by-step division/multiplication tables. Writing direct calculator answers without intermediate steps results in a 50% marks penalty in DTU evaluation.'
    },
    quickRevision: {
      bulletPoints: [
        'Radix r positional representation: N = Σ d_i * r^i.',
        'Binary (r=2), Octal (r=8, 3-bit groups), Decimal (r=10), Hexadecimal (r=16, 4-bit groups).',
        'Integer conversion: repeated division by target base; read remainders bottom-up.',
        'Fraction conversion: repeated multiplication by target base; read integer parts top-down.',
        'Direct conversion between base 2, 8, 16 is done by bit grouping without converting to decimal first.'
      ],
      importantFormulas: [
        { name: 'Positional Polynomial', formula: 'N_r = d_{n-1} r^{n-1} + ... + d_0 r^0 + d_{-1} r^{-1} + ...' },
        { name: 'Grouping Rule', formula: 'Octal: 2^3 = 8 (3 bits); Hex: 2^4 = 16 (4 bits)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u1-p1-1',
        type: 'mcq',
        question: 'What is the hexadecimal equivalent of the binary number (1101011110.101)₂?',
        options: ['(35E.A)₁₆', '(35E.5)₁₆', '(6BD.A)₁₆', '(1D7.5)₁₆'],
        correctAnswer: 0,
        explanation: 'Group in 4s from decimal point: (0011 0101 1110 . 1010)₂ = (3 5 E . A)₁₆.',
        distractorExplanations: {
          1: 'Incorrectly converted .101 to 5 instead of padding right zero (.1010 -> A).',
          2: 'Grouped in 3s like octal instead of 4s.',
          3: 'Misaligned the nibble boundaries.'
        },
        marks: 2
      },
      {
        id: 'u1-p1-2',
        type: 'numerical',
        question: 'If (123)₅ = (x)₈, find the value of x in octal.',
        correctAnswer: 46,
        explanation: '(123)₅ = 1·25 + 2·5 + 3·1 = 25 + 10 + 3 = (38)₁₀. 38 ÷ 8 = 4 R 6, 4 ÷ 8 = 0 R 4. Hence (46)₈.',
        marks: 3
      }
    ]
  },
  {
    id: 'u1-l2-signed-numbers-and-complements',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Number Systems and Codes',
    title: "Signed Numbers & 1's and 2's Complement Arithmetic",
    subtitle: 'Signed magnitude, 1s complement, 2s complement, range limits, end-around carry, and hardware overflow detection',
    estimatedMinutes: 30,
    order: 2,
    prerequisites: ['Positional binary numbers', 'Binary addition basics'],
    whatIsIt: {
      simpleSummary: "To represent positive and negative numbers in digital computers, the Most Significant Bit (MSB) is reserved as the sign bit (0 = positive, 1 = negative). Among the representations (Signed Magnitude, 1's Complement, and 2's Complement), modern computers universally use 2's Complement because it eliminates the awkward negative zero (+0 and -0) and allows subtraction to be performed using ordinary addition hardware.",
      coreDefinition: "In an n-bit 2's complement system, the numerical value is given by: $$\\text{Value} = -d_{n-1} 2^{n-1} + \\sum_{i=0}^{n-2} d_i 2^i$$ The MSB has a negative weight of $-2^{n-1}$, while all other bits have standard positive binary weights.",
      keyAnalogy: 'Think of an automobile odometer running in reverse: 0000 -> 9999 (-1) -> 9998 (-2). In binary, counting down from 0000 wraps around to 1111 (-1).'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Building separate physical hardware circuits for addition and subtraction doubles transistor count, area, and cost on silicon chips. Furthermore, signed magnitude and 1s complement have two distinct codes for zero (+0 and -0), which requires extra comparison logic and wastes a code combination.',
      engineeringBenefit: "In 2's complement, A - B is simply computed as A + (2's complement of B). The exact same adder circuit handles both addition and subtraction with zero modification!"
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: "Derive 1's Complement",
          description: 'Invert every bit (bitwise NOT: change 0 to 1, and 1 to 0).',
          codeOrFormula: "1's complement of N = (2^n - 1) - N"
        },
        {
          step: 2,
          title: "Derive 2's Complement",
          description: "Add 1 to the 1's complement at the Least Significant Bit (LSB).",
          codeOrFormula: "2's complement = 1's complement + 1 = 2^n - N"
        },
        {
          step: 3,
          title: 'Fast Inspection Rule (Exam Shortcut)',
          description: 'Scan the binary number from right to left (LSB toward MSB). Copy all zeros and the very first 1 unchanged. After that first 1, flip all remaining bits to its left!',
          codeOrFormula: 'Example: 00101100 -> Keep trailing ...100, invert left 00101 -> 11010100'
        },
        {
          step: 4,
          title: 'Subtraction using 2s Complement',
          description: 'To calculate A - B: Add A to the 2s complement of B. If an end-carry is generated, discard it (the result is positive). If NO carry is generated, the result is negative and in 2s complement form!',
          codeOrFormula: 'A - B = A + [B]_{2s}'
        },
        {
          step: 5,
          title: 'Overflow Detection Rule',
          description: 'Signed overflow occurs when the sum of two numbers of the same sign produces a result of the opposite sign. Hardware detects this using: V = C_{in} XOR C_{out} at the MSB!',
          codeOrFormula: 'V = C_n ⊕ C_{n-1}'
        }
      ],
      deepDiveNotes: [
        'Number range for n-bit numbers:',
        'Signed Magnitude: -(2^{n-1} - 1) to +(2^{n-1} - 1) with two zeros: +0 and -0.',
        "1's Complement: -(2^{n-1} - 1) to +(2^{n-1} - 1) with two zeros: 0000 (+0) and 1111 (-0).",
        "2's Complement: -2^{n-1} to +(2^{n-1} - 1) with exactly ONE unique zero (0000). For 8 bits: -128 to +127."
      ]
    },
    interactiveSimulatorKey: 'twos-complement',
    practicalExample: {
      scenario: 'Calculating 27 - 42 using 8-bit 2s complement arithmetic inside an ALU.',
      walkthrough: 'A = +27 = 00011011_2. B = +42 = 00101010_2. 1s complement of B = 11010101. 2s complement of B = 11010110. Now add: 00011011 + 11010110 = 11110001. No end carry was generated, meaning result is negative. Value = -(2s complement of 11110001) = -(00001111_2) = -15.',
      result: '27 - 42 = -15 (Verified: 27 - 42 = -15)'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: "Perform (29)₁₀ - (48)₁₀ using 8-bit 2's complement arithmetic. Explain end-around carry and status flags.",
        marks: 5,
        steps: [
          {
            title: 'Convert operands to 8-bit binary',
            explanation: '+29 = 00011101₂, +48 = 00110000₂.',
            math: 'A = 00011101, B = 00110000'
          },
          {
            title: "Find 2's Complement of subtrahend B (48)",
            explanation: "1's complement of 00110000 = 11001111. Add 1 = 11010000.",
            math: '[B]_{2s} = 11010000₂'
          },
          {
            title: 'Perform Addition A + [B]₂s',
            explanation: '  00011101 (+29)\n+ 11010000 (-48)\n= 11101101',
            math: 'Sum = 11101101₂'
          },
          {
            title: 'Analyze Result and Carry',
            explanation: "End Carry C_out = 0. In 2's complement subtraction, absence of end carry signifies a NEGATIVE result in 2's complement form. Take 2's complement of sum to obtain magnitude: 2's comp of 11101101 = 00010011₂ = 19₁₀.",
            math: 'Result = -19₁₀'
          }
        ],
        finalAnswer: '-19 (Representation: 11101101₂)',
        tip: 'In 2s complement subtraction, an end-carry of 1 means POSITIVE (discard carry). An end-carry of 0 means NEGATIVE (no carry to discard, take 2s comp of result).'
      },
      {
        difficulty: 'intermediate',
        question: "Evaluate (+85)₁₀ + (+65)₁₀ in an 8-bit signed 2's complement system. Detect whether hardware overflow occurs.",
        marks: 5,
        steps: [
          {
            title: 'Convert Operands to 8-bit Signed Binary',
            explanation: '+85 = 01010101₂, +65 = 01000001₂.',
            math: 'A = 01010101, B = 01000001'
          },
          {
            title: 'Perform Binary Addition and Track Carries',
            explanation: 'Carry into MSB (C7) = 1. Carry out of MSB (C8) = 0.\n  01010101 (+85)\n+ 01000001 (+65)\n= 10010110',
            math: 'Sum = 10010110₂'
          },
          {
            title: 'Evaluate Hardware Overflow Flag V',
            explanation: 'V = C7 ⊕ C8 = 1 ⊕ 0 = 1 (OVERFLOW DETECTED!). Sum of two positive numbers (MSB=0) produced a negative number (MSB=1), because +150 exceeds maximum 8-bit capacity (+127).',
            math: 'V = 1 \\implies \\text{Arithmetic Overflow}'
          }
        ],
        finalAnswer: 'Sum = 10010110₂, Overflow Flag V = 1 (Result out of range [-128, +127])',
        tip: 'Whenever adding two numbers of the SAME sign, check if the resulting MSB has flipped to the opposite sign!'
      }
    ],
    commonMistakes: [
      {
        mistake: "Discarding the end carry in 1's complement subtraction instead of adding it back.",
        whyItHappens: "Students mix up 1's complement and 2's complement subtraction rules.",
        correctWay: "In 1's complement, end carry MUST be added back to the LSB (called End-Around Carry). In 2's complement, end carry is discarded!"
      },
      {
        mistake: 'Confusing carry flag (unsigned) with overflow flag (signed).',
        whyItHappens: 'Both flags involve bits coming out of the MSB.',
        correctWay: 'Carry flag C is Cout of MSB (for unsigned arithmetic). Overflow flag V is Cin ⊕ Cout at MSB (for signed arithmetic).'
      }
    ],
    examPerspective: {
      expectedMarks: '5 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        "Perform binary subtraction using 2's complement and 1's complement: (i) 43 - 68 (ii) 85 - 32.",
        "Differentiate between 1's complement and 2's complement representations with respect to range and zero representation.",
        "Explain overflow condition in 2's complement arithmetic with an example."
      ],
      scoringKeyAdvice: 'State the bit width explicitly (usually 8 bits). Show carry bits row clearly. State whether end-carry is generated and what it indicates.'
    },
    quickRevision: {
      bulletPoints: [
        "Sign bit: 0 = positive, 1 = negative.",
        "2's complement = 1's complement + 1.",
        "8-bit range: -128 to +127. Has exactly one zero: 00000000.",
        "To subtract B from A, add 2's complement of B to A.",
        'Carry = 1 -> Positive result (discard carry); Carry = 0 -> Negative result (in 2s comp form).',
        'Overflow condition: V = C_in ⊕ C_out at MSB.'
      ],
      importantFormulas: [
        { name: "2's Complement", formula: "[N]_{2s} = 2^n - N" },
        { name: "Range (n-bit 2's Comp)", formula: "-2^{n-1} \\le X \\le +2^{n-1} - 1" },
        { name: 'Hardware Overflow', formula: 'V = C_n \\oplus C_{n-1}' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u1-p2-1',
        type: 'mcq',
        question: "What is the 8-bit 2's complement representation of decimal -42?",
        options: ['11010110', '10101010', '11010101', '00101010'],
        correctAnswer: 0,
        explanation: '+42 = 00101010₂. 1s comp = 11010101. Add 1 = 11010110₂.',
        marks: 2
      }
    ]
  },
  {
    id: 'u1-l3-floating-point-numbers',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Number Systems and Codes',
    title: 'IEEE 754 Floating-Point Representation',
    subtitle: 'Single precision 32-bit format, biased exponent, normalized mantissa, hidden bit, and special cases',
    estimatedMinutes: 25,
    order: 3,
    prerequisites: ['Positional number systems', 'Scientific notation'],
    whatIsIt: {
      simpleSummary: 'Fixed-point binary numbers cannot simultaneously represent extremely massive quantities (like the mass of the earth) and tiny fractions (like the radius of an atom) within a reasonable number of bits. Floating-point representation solves this by using binary scientific notation: a sign bit, a biased exponent, and a fractional mantissa.',
      coreDefinition: 'Under IEEE 754 Single Precision (32-bit), a real number is evaluated as: $$\\text{Value} = (-1)^S \\times (1.M) \\times 2^{E - 127}$$ where $S$ is the 1 sign bit, $E$ is the 8-bit biased exponent with $\\text{bias} = 127$, and $M$ is the 23-bit mantissa fraction.',
      keyAnalogy: 'Think of scientific notation on your calculator: -1.3625 × 10^3. Floating point does the exact same thing, but with base 2: -1.101101 × 2^3.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In microcontrollers doing digital signal processing (DSP), motor physics calculations, and sensor filters (like in ARM Cortex-M4 FPU), variables have wide dynamic ranges. Floating point provides a dynamic range from ~1.18 × 10^-38 to ~3.4 × 10^38 using just 32 bits!',
      engineeringBenefit: 'The hardware FPU in ARM Cortex-M4 computes 32-bit floating-point addition and multiplication in a single clock cycle, enabling real-time audio and flight controllers.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Determine Sign Bit (S)',
          description: 'If number is positive, S = 0. If number is negative, S = 1.',
          codeOrFormula: 'Bit 31: S = 0 (+) or 1 (-)'
        },
        {
          step: 2,
          title: 'Normalize into Binary Scientific Notation',
          description: 'Convert integer and fractional parts to binary. Shift radix point until there is exactly one non-zero digit (1) to the left of the binary point: 1.M × 2^e.',
          codeOrFormula: 'Example: (13.625)₁₀ = (1101.101)₂ = 1.101101₂ × 2^3'
        },
        {
          step: 3,
          title: 'Calculate Biased Exponent (E)',
          description: 'Add the bias constant (127 for single precision) to the true exponent e: E = e + 127. Convert E to an 8-bit unsigned binary number.',
          codeOrFormula: 'E = 3 + 127 = 130 = (10000010)₂'
        },
        {
          step: 4,
          title: 'Extract Mantissa (M) with Hidden Bit',
          description: 'Drop the leading 1 (it is hidden/implicit in hardware to save a bit!) and take the fractional digits after the point, padding trailing zeros to make 23 bits.',
          codeOrFormula: 'M = 10110100000000000000000 (23 bits)'
        }
      ],
      deepDiveNotes: [
        'Special Values in IEEE 754:',
        'Zero: E = 0, M = 0 (signed +0 and -0)',
        'Infinity (±∞): E = 255 (all 1s), M = 0',
        'Not a Number (NaN): E = 255, M ≠ 0 (e.g. 0/0 or sqrt(-1))',
        'Denormalized/Subnormal: E = 0, M ≠ 0 (gradual underflow without hidden bit: Value = (-1)^S × 0.M × 2^-126)'
      ]
    },
    interactiveSimulatorKey: 'floating-point',
    practicalExample: {
      scenario: 'Encoding -13.625 decimal into 32-bit IEEE 754 hex format.',
      walkthrough: 'Sign: Negative, so S = 1. Value 13.625 = 1101.101_2 = 1.101101_2 × 2^3. True exponent e = 3. Biased exponent E = 3 + 127 = 130 = 10000010_2. Mantissa M = 10110100000000000000000_2. Concatenating: S (1) | E (10000010) | M (10110100000000000000000). Group in 4s: 1100 0001 0101 1010 0000 0000 0000 0000_2.',
      result: 'IEEE 754 Hex: 0xC15A0000'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Represent decimal number -0.15625 in IEEE 754 single-precision floating-point format in Hexadecimal.',
        marks: 5,
        steps: [
          {
            title: 'Sign bit S',
            explanation: 'Number is negative, hence S = 1.',
            math: 'S = 1'
          },
          {
            title: 'Convert 0.15625 to Binary',
            explanation: '0.15625 × 2 = 0.3125 (0)\n0.3125 × 2 = 0.625 (0)\n0.625 × 2 = 1.25 (1)\n0.25 × 2 = 0.5 (0)\n0.5 × 2 = 1.0 (1)\nSo (0.15625)₁₀ = (0.00101)₂.',
            math: '(0.15625)₁₀ = (0.00101)₂'
          },
          {
            title: 'Normalize into 1.M × 2^e',
            explanation: 'Shift binary point 3 places right: 0.00101 = 1.01 × 2⁻³.',
            math: 'e = -3, M = 01000... (23 bits)'
          },
          {
            title: 'Calculate Biased Exponent E',
            explanation: 'E = e + Bias = -3 + 127 = 124. (124)₁₀ = (01111100)₂.',
            math: 'E = (01111100)₂'
          },
          {
            title: 'Assemble 32-Bit Word & Group in Hex',
            explanation: '1 | 01111100 | 01000000000000000000000\nGroup in 4s: 1011 1110 0010 0000 0000 0000 0000 0000',
            math: 'Hex = 0xBE200000'
          }
        ],
        finalAnswer: '0xBE200000',
        tip: 'Check that true negative exponents result in biased exponents E < 127 (here 124 < 127).'
      },
      {
        difficulty: 'university',
        question: 'Decode the IEEE 754 single-precision 32-bit floating-point Hex value 0xC2ED4000 to its exact decimal value.',
        marks: 5,
        steps: [
          {
            title: 'Convert Hex to 32-Bit Binary Stream',
            explanation: '0xC2ED4000 = 1100 0010 1110 1101 0100 0000 0000 0000₂',
            math: 'S = 1, E = 10000101₂, M = 11011010100000000000000₂'
          },
          {
            title: 'Decode Exponent',
            explanation: 'Biased exponent E = (10000101)₂ = 133₁₀. True exponent e = 133 - 127 = 6.',
            math: 'e = 6'
          },
          {
            title: 'Decode Mantissa and Compute Decimal Value',
            explanation: 'Normalized form: (-1)¹ × (1.110110101)₂ × 2⁶.\nMultiply by 2⁶ shifts binary point 6 places right:\n- (1110110.101)₂ = - (64 + 32 + 16 + 4 + 2 + 0.5 + 0.125) = -118.625₁₀.',
            math: 'Value = -118.625₁₀'
          }
        ],
        finalAnswer: '-118.625',
        tip: 'Multiplying by 2^e is identical to shifting the binary point by e positions!'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Including the leading 1 inside the 23-bit mantissa field.',
        whyItHappens: 'Forgetting that the normalized 1 is implicit ("hidden bit") and does not consume memory storage.',
        correctWay: 'Only the bits after the binary point are placed into the 23-bit mantissa field.'
      },
      {
        mistake: 'Subtracting 127 instead of adding 127 when encoding.',
        whyItHappens: 'Confusing encoding (E = e + 127) with decoding (e = E - 127).',
        correctWay: 'To store: E = e + 127. To recover decimal: e = E - 127.'
      }
    ],
    examPerspective: {
      expectedMarks: '5 Marks',
      frequency: 'High',
      typicalDtuQuestions: [
        'Explain the IEEE 754 single-precision format. Convert (-28.75)₁₀ to IEEE 754 format.',
        'What is biased exponent and why is excess-127 used in floating point numbers?',
        'How are special conditions like overflow, underflow, and NaN handled in IEEE 754 standard?'
      ],
      scoringKeyAdvice: 'Clearly partition the 32 bits into 1 sign bit, 8 exponent bits, and 23 mantissa bits with column headers. Always present final answer in Hexadecimal.'
    },
    quickRevision: {
      bulletPoints: [
        'Single precision: 32 bits (1 Sign, 8 Exponent, 23 Mantissa).',
        'Bias = 127. True exponent e = E - 127.',
        'Implicit leading 1 (hidden bit) for normalized numbers.',
        'Special cases: E=255 M=0 (±Infinity); E=255 M≠0 (NaN); E=0 M=0 (±0).'
      ],
      importantFormulas: [
        { name: 'IEEE 754 Formula', formula: 'Value = (-1)^S \\times (1.M) \\times 2^{E - 127}' },
        { name: 'Bias Calculation', formula: 'Bias = 2^{k-1} - 1 = 2^7 - 1 = 127' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u1-p3-1',
        type: 'mcq',
        question: 'What decimal value is represented by the IEEE 754 hex code 0x40000000?',
        options: ['+2.0', '+1.0', '+0.5', '+4.0'],
        correctAnswer: 0,
        explanation: '0x40000000 = 0 10000000 000...000. S=0, E=128 (128-127=1), M=0. Value = +1.0 × 2^1 = +2.0.',
        marks: 2
      }
    ]
  },
  {
    id: 'u1-l4-computer-codes-and-hamming',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Number Systems and Codes',
    title: 'Computer Codes & Error-Detecting Hamming Codes',
    subtitle: 'BCD (8421), Excess-3, Gray code, parity checking, and Hamming (7,4) single-error correction',
    estimatedMinutes: 30,
    order: 4,
    prerequisites: ['Binary arithmetic', 'XOR logic operation'],
    whatIsIt: {
      simpleSummary: 'Computer codes are specialized binary encodings designed for decimal interfacing (BCD, Excess-3), mechanical encoders (Gray code), or communication reliability (Parity and Hamming codes). Hamming codes add redundant parity bits at positions of powers-of-two (1, 2, 4, 8) to not only detect transmission errors but automatically locate and correct corrupted bits.',
      coreDefinition: 'In a Hamming $(n, k)$ code with $k$ data bits and $r$ parity bits ($n = k + r$), the parity bits must satisfy the Hamming rule: $$2^r \\ge k + r + 1$$ The receiver calculates syndrome bits $S = (S_r \\dots S_1)$ whose binary value points directly to the bit position of any single-bit transmission error.',
      keyAnalogy: 'Think of 3 security guards cross-checking overlapping teams of workers. If worker #5 makes a mistake, both guard #1 and guard #4 sound the alarm (1 + 4 = 5), immediately identifying worker #5!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In space satellites, computer memory (ECC RAM in microcontrollers), and communication channels, cosmic rays or electromagnetic noise can flip a 0 to a 1. A single flipped bit in an ARM microcontroller instruction could crash an aircraft flight computer. Hamming codes self-heal memory without software intervention.',
      engineeringBenefit: 'Single Error Correction and Double Error Detection (SECDED) guarantees mission-critical reliability in DTU aerospace and automotive microcontroller designs.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'BCD (Binary Coded Decimal / 8421)',
          description: 'Each decimal digit (0 to 9) is represented by its 4-bit binary equivalent. Combinations 1010 through 1111 (10-15) are INVALID BCD codes.',
          codeOrFormula: 'Example: (95)₁₀ = (1001 0101)_{BCD}'
        },
        {
          step: 2,
          title: 'Excess-3 Code (Unweighted, Self-Complementing)',
          description: 'Formed by adding decimal 3 (0011₂) to each BCD digit. Its 9s complement can be obtained directly by taking the 1s complement of its bits (self-complementing property)!',
          codeOrFormula: 'XS3 = BCD + 0011₂'
        },
        {
          step: 3,
          title: 'Gray Code (Reflected Binary / Unit-Distance)',
          description: 'Only 1 bit changes between consecutive codes. Binary to Gray: G_i = B_i ⊕ B_{i+1}. Gray to Binary: B_i = B_{i+1} ⊕ G_i.',
          codeOrFormula: 'G_3 = B_3, G_2 = B_3 ⊕ B_2, G_1 = B_2 ⊕ B_1, G_0 = B_1 ⊕ B_0'
        },
        {
          step: 4,
          title: 'Hamming Code Parity Bit Placement',
          description: 'Parity bits P_i are placed at powers of 2 (Positions 1, 2, 4, 8...). Data bits occupy the remaining positions (3, 5, 6, 7...).',
          codeOrFormula: 'Positions: [1:P1, 2:P2, 3:D3, 4:P4, 5:D5, 6:D6, 7:D7]'
        },
        {
          step: 5,
          title: 'Syndrome Calculation & Error Correction',
          description: 'The receiver recomputes parity checks. The syndrome word (S4 S2 S1) gives the exact bit position of error! If syndrome is 0, no error occurred.',
          codeOrFormula: 'S1 = b1 ⊕ b3 ⊕ b5 ⊕ b7, S2 = b2 ⊕ b3 ⊕ b6 ⊕ b7, S4 = b4 ⊕ b5 ⊕ b6 ⊕ b7'
        }
      ],
      deepDiveNotes: [
        'Why Excess-3 is self-complementing:',
        'The 9s complement of a decimal digit d is 9 - d. In Excess-3, d is stored as d + 3. Inverting the bits yields 15 - (d + 3) = 12 - d = (9 - d) + 3, which is precisely the Excess-3 code of (9 - d)! This simplifies BCD subtraction circuits.'
      ]
    },
    interactiveSimulatorKey: 'hamming-code',
    practicalExample: {
      scenario: 'Generating a 7-bit even-parity Hamming code for 4-bit data word D = 1011 (D3=1, D5=0, D6=1, D7=1).',
      walkthrough: 'P1 checks positions 1, 3, 5, 7: P1 ⊕ 1 ⊕ 0 ⊕ 1 = 0 -> P1 = 0. P2 checks positions 2, 3, 6, 7: P2 ⊕ 1 ⊕ 1 ⊕ 1 = 0 -> P2 = 1. P4 checks positions 4, 5, 6, 7: P4 ⊕ 0 ⊕ 1 ⊕ 1 = 0 -> P4 = 0. Assembled Codeword: P1 P2 D3 P4 D5 D6 D7 = 0 1 1 0 0 1 1.',
      result: 'Transmitted Codeword: 0110011'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'A 7-bit Hamming code (even parity) received is 1011011. Determine if there is an error, identify the error bit position, and correct the transmitted data bits.',
        marks: 5,
        steps: [
          {
            title: 'Identify Received Bits by Position',
            explanation: 'Received bits r1 through r7: r1=1, r2=0, r3=1, r4=1, r5=0, r6=1, r7=1.',
            math: 'r = [1, 0, 1, 1, 0, 1, 1]'
          },
          {
            title: 'Calculate Syndrome Bit S1 (Checks 1, 3, 5, 7)',
            explanation: 'S1 = r1 ⊕ r3 ⊕ r5 ⊕ r7 = 1 ⊕ 1 ⊕ 0 ⊕ 1 = 1.',
            math: 'S1 = 1'
          },
          {
            title: 'Calculate Syndrome Bit S2 (Checks 2, 3, 6, 7)',
            explanation: 'S2 = r2 ⊕ r3 ⊕ r6 ⊕ r7 = 0 ⊕ 1 ⊕ 1 ⊕ 1 = 1.',
            math: 'S2 = 1'
          },
          {
            title: 'Calculate Syndrome Bit S4 (Checks 4, 5, 6, 7)',
            explanation: 'S4 = r4 ⊕ r5 ⊕ r6 ⊕ r7 = 1 ⊕ 0 ⊕ 1 ⊕ 1 = 1.',
            math: 'S4 = 1'
          },
          {
            title: 'Evaluate Syndrome Word and Correct',
            explanation: 'Syndrome (S4 S2 S1)₂ = (1 1 1)₂ = 7 in decimal. This proves an error occurred at Bit Position 7! Flip bit 7 from 1 to 0: Corrected codeword = 1011010. Extract data bits D3, D5, D6, D7 = 1, 0, 1, 0.',
            math: 'Error at bit 7; Corrected data = 1010'
          }
        ],
        finalAnswer: 'Error at bit position 7; Corrected transmitted data is 1010',
        tip: 'Always state the order of syndrome bits as (S4 S2 S1) from MSB to LSB when reading decimal error position!'
      },
      {
        difficulty: 'intermediate',
        question: 'Generate the 7-bit even-parity Hamming code for data word (1100)₂.',
        marks: 5,
        steps: [
          {
            title: 'Place Data Bits into Bit Positions',
            explanation: 'Data bits D3=1, D5=1, D6=0, D7=0.',
            math: 'Bit \\, Positions: [P_1, P_2, 1, P_4, 1, 0, 0]'
          },
          {
            title: 'Calculate Parity Bits (Even Parity)',
            explanation: 'P1 = D3 ⊕ D5 ⊕ D7 = 1 ⊕ 1 ⊕ 0 = 0\nP2 = D3 ⊕ D6 ⊕ D7 = 1 ⊕ 0 ⊕ 0 = 1\nP4 = D5 ⊕ D6 ⊕ D7 = 1 ⊕ 0 ⊕ 0 = 1',
            math: 'P1 = 0, P2 = 1, P4 = 1'
          },
          {
            title: 'Assemble Transmitted Codeword',
            explanation: 'P1 P2 D3 P4 D5 D6 D7 = 0 1 1 1 1 0 0.',
            math: 'Codeword = 0111100₂'
          }
        ],
        finalAnswer: '0111100',
        tip: 'Always verify parity: P1 checks (1,3,5,7) -> 0,1,1,0 has even number of 1s (two 1s). Valid!'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Reversing the order of syndrome bits (reading S1 S2 S4 instead of S4 S2 S1).',
        whyItHappens: 'S1 is calculated first, so students write it as the MSB.',
        correctWay: 'S4 has weight 4 (MSB), S2 has weight 2, S1 has weight 1 (LSB).'
      },
      {
        mistake: 'Treating BCD and binary as identical.',
        whyItHappens: 'Both use 0s and 1s.',
        correctWay: 'In BCD, each decimal digit is independently coded in 4 bits. Decimal 12 is 0001 0010 in BCD, but 0000 1100 in pure binary!'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Explain Hamming (7,4) code with an example. Derive parity bit generator equations for even parity.',
        'Why is Excess-3 called a self-complementing code? Demonstrate with an example.',
        'Convert binary 101101 to Gray code and Gray code 110110 to binary.'
      ],
      scoringKeyAdvice: 'Draw the parity check matrix or Venn diagram. Write down the parity bit equations before substituting numerical values.'
    },
    quickRevision: {
      bulletPoints: [
        'BCD (8421): Digits 0-9; 1010-1111 are illegal.',
        'Excess-3 = BCD + 3. Self-complementing (1s comp = 9s comp).',
        'Gray Code: Unit distance code (Hamming distance = 1). Used in Karnaugh maps and optical shaft encoders.',
        'Hamming condition: 2^r >= k + r + 1.',
        'Parity bits at positions 2^0, 2^1, 2^2... (1, 2, 4, 8).'
      ],
      importantFormulas: [
        { name: 'Hamming Inequality', formula: '2^r \\ge m + r + 1' },
        { name: 'Binary to Gray', formula: 'G_i = B_i \\oplus B_{i+1}' },
        { name: 'Gray to Binary', formula: 'B_i = B_{i+1} \\oplus G_i' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u1-p4-1',
        type: 'mcq',
        question: 'Which of the following is a self-complementing code?',
        options: ['Excess-3 code', 'BCD (8421) code', 'Gray code', 'ASCII code'],
        correctAnswer: 0,
        explanation: 'Excess-3 and 2421 codes are self-complementing because inverting all bits yields the 9s complement of the decimal digit.',
        marks: 2
      }
    ]
  },
  {
    id: 'u1-l5-binary-arithmetic-algorithms',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'Number Systems and Codes',
    title: "Binary Arithmetic Algorithms & Booth's Multiplication",
    subtitle: "Signed multiplication using Booth's algorithm, Restoring & Non-Restoring division, and BCD addition with +6 correction",
    estimatedMinutes: 35,
    order: 5,
    prerequisites: ["2's complement representation", "Binary addition and shift operations"],
    whatIsIt: {
      simpleSummary: "While pencil-and-paper binary multiplication works by shifting and adding partial products, multiplying negative numbers in 2's complement directly causes wrong sign bits. Booth's Algorithm solves this by examining adjacent pairs of multiplier bits (Q0 and Q-1), treating blocks of consecutive 1s as a single subtraction at the start and addition at the end. For BCD arithmetic, adding two BCD numbers can produce an invalid code (> 9), requiring an automatic hardware correction of adding 6 (0110₂).",
      coreDefinition: "Booth's Multiplication Algorithm operates on two signed 2's complement numbers M (Multiplicand) and Q (Multiplier) using an Accumulator A and history bit Q₋₁. In each of the n cycles, it evaluates (Q₀ Q₋₁): 10 -> A = A - M; 01 -> A = A + M; 00 or 11 -> no arithmetic. It then performs an Arithmetic Shift Right (ASR) on [A, Q, Q₋₁].",
      keyAnalogy: "Multiplying by 7 (0111) is equivalent to multiplying by (8 - 1). Instead of adding 3 partial products, you subtract once at the first 1 and add once after the last 1!"
    },
    whyDoWeNeedIt: {
      realWorldProblem: "Microprocessors in digital signal processing (like the single-cycle multiplier in ARM Cortex-M) must compute signed integer multiplication at high clock frequencies. Handling signs separately slows down execution and requires extra branch logic.",
      engineeringBenefit: "Booth's algorithm directly multiplies signed positive and negative numbers without converting signs, and reduces the average number of add/subtract operations by skipping strings of 1s and 0s."
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: "Initialize Registers",
          description: "A = 0 (n bits), Q = Multiplier, Q₋₁ = 0 (1 bit), M = Multiplicand, Count = n.",
          codeOrFormula: "A = 0000, Q = Multiplier, Q₋₁ = 0"
        },
        {
          step: 2,
          title: "Inspect (Q₀, Q₋₁) Bit Pair",
          description: "- If 10: A = A - M (i.e. A = A + 2's comp of M)\n- If 01: A = A + M\n- If 00 or 11: Do nothing (only shift)",
          codeOrFormula: "10 -> Subtract M; 01 -> Add M; 00/11 -> Shift only"
        },
        {
          step: 3,
          title: "Arithmetic Shift Right (ASR)",
          description: "Shift [A, Q, Q₋₁] right by 1 bit, preserving the MSB sign bit of A (A[n-1] replicated). Decrement count by 1.",
          codeOrFormula: "ASR([A, Q, Q₋₁]); Count = Count - 1"
        },
        {
          step: 4,
          title: "BCD Addition +6 Correction Rule",
          description: "When adding two BCD digits using a 4-bit binary adder: If the 4-bit sum exceeds 9 (1001₂), or if a carry-out is generated, the result is an invalid BCD state. Add 6 (0110₂) to skip the 6 illegal states (1010-1111) and generate a valid decimal carry!",
          codeOrFormula: "If (Sum > 9 or Carry = 1) -> Add 0110₂"
        }
      ],
      deepDiveNotes: [
        'Restoring vs Non-Restoring Division:',
        'Restoring Division: Subtract divisor from remainder. If remainder is negative, RESTORE it by adding divisor back and set quotient bit to 0; else set quotient bit to 1.',
        'Non-Restoring Division: If remainder is negative, DO NOT restore; shift left and ADD divisor in the next step, cutting division cycles in half!'
      ]
    },
    interactiveSimulatorKey: 'booth-multiplier',
    practicalExample: {
      scenario: "Multiplying +7 (0111) by -3 (1101) using Booth's Algorithm.",
      walkthrough: "M = 0111 (+7), -M = 1001 (-7). Q = 1101 (-3). 4 cycles:\nCycle 1: Q0Q-1 = 10 -> A = A - M = 1001. ASR -> A = 1100, Q = 1110, Q-1 = 1.\nCycle 2: Q0Q-1 = 01 -> A = A + M = 1100 + 0111 = 0011. ASR -> A = 0001, Q = 1111, Q-1 = 0.\nCycle 3: Q0Q-1 = 10 -> A = A - M = 0001 + 1001 = 1010. ASR -> A = 1101, Q = 0111, Q-1 = 1.\nCycle 4: Q0Q-1 = 11 -> Shift only. ASR -> A = 1110, Q = 1011, Q-1 = 1.\nFinal Product [A, Q] = 1110 1011₂. 2's complement of 11101011 = -(00010101₂) = -21.",
      result: "Product = -21 (Verified: 7 × -3 = -21)"
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: "Multiply (-5)₁₀ by (-4)₁₀ using Booth's algorithm. Show the step-by-step register contents in a tabular format.",
        marks: 5,
        steps: [
          {
            title: 'Convert Operands to 4-bit 2\'s Complement',
            explanation: 'Multiplicand M = -5 = 1011₂. -M = +5 = 0101₂. Multiplier Q = -4 = 1100₂. Initial A = 0000₂, Q₋₁ = 0.',
            math: 'M = 1011_2, \\quad -M = 0101_2, \\quad Q = 1100_2, \\quad A = 0000_2, \\quad Q_{-1} = 0'
          },
          {
            title: 'Execution Trace (4 Cycles)',
            explanation: 'Cycle 1: Q0Q-1 = 00 -> Shift only. ASR -> A=0000, Q=0110, Q-1=0.\nCycle 2: Q0Q-1 = 00 -> Shift only. ASR -> A=0000, Q=0011, Q-1=0.\nCycle 3: Q0Q-1 = 10 -> A = A - M = 0000 + 0101 = 0101. ASR -> A=0010, Q=1001, Q-1=1.\nCycle 4: Q0Q-1 = 11 -> Shift only. ASR -> A=0001, Q=0100, Q-1=1.',
            math: '[A, Q] = [0001, 0100]_2'
          },
          {
            title: 'Verify Result',
            explanation: '[A, Q] = 0001 0100₂ = 16 + 4 = +20₁₀. (-5) × (-4) = +20.',
            math: '\\text{Result} = +20_{10}'
          }
        ],
        finalAnswer: 'Product = +20 (Representation: 00010100₂)',
        tip: 'Remember that Arithmetic Shift Right (ASR) preserves the MSB sign bit: if A was negative, 1 is shifted into the MSB!'
      },
      {
        difficulty: 'intermediate',
        question: 'Perform BCD addition of (68)₁₀ + (45)₁₀. Show the binary addition and where +6 (0110₂) correction is applied.',
        marks: 5,
        steps: [
          {
            title: 'Represent in BCD',
            explanation: '68 = 0110 1000_{BCD}, 45 = 0100 0101_{BCD}.',
            math: '68_{BCD} = 0110 \\; 1000, \\quad 45_{BCD} = 0100 \\; 0101'
          },
          {
            title: 'Add Lower Nibble',
            explanation: '1000 + 0101 = 1101₂ = 13₁₀. Since 13 > 9, this is an illegal BCD code! Add 0110₂:\n  1101 (13)\n+ 0110 (6)\n= 10011 -> Lower digit = 0011 (3) with Carry = 1 to upper nibble.',
            math: '1101_2 + 0110_2 = (1) \\, 0011_2'
          },
          {
            title: 'Add Upper Nibble with Carry',
            explanation: '0110 (6) + 0100 (4) + 0001 (carry 1) = 1011₂ = 11₁₀. Since 11 > 9, add 0110₂:\n  1011 (11)\n+ 0110 (6)\n= 10001 -> Middle digit = 0001 (1) with Carry = 1.',
            math: '1011_2 + 0110_2 = (1) \\, 0001_2'
          },
          {
            title: 'Assemble Result',
            explanation: 'Result = 0001 0001 0011_{BCD} = 113₁₀. Verified: 68 + 45 = 113.',
            math: '113_{BCD} = 0001 \\; 0001 \\; 0011'
          }
        ],
        finalAnswer: '0001 0001 0011 (BCD for 113)',
        tip: 'Whenever an intermediate sum is > 9 or generates a carry, ALWAYS add 0110 to that nibble!'
      }
    ],
    commonMistakes: [
      {
        mistake: "Performing logical shift right (LSR) instead of arithmetic shift right (ASR) in Booth's algorithm.",
        whyItHappens: "Shifting in 0 into the MSB instead of replicating the sign bit.",
        correctWay: "ASR must copy the MSB bit: if A[3]=1, then after shift A[3] remains 1."
      },
      {
        mistake: "Forgetting to add 6 in BCD addition when the sum is 10 to 15.",
        whyItHappens: "Assuming correction is only needed if a carry bit is produced.",
        correctWay: "Correction is mandatory if Sum > 9 EVEN IF carry out is 0!"
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        "Explain Booth's multiplication algorithm with the help of a flowchart. Multiply (-7) by (+3) using Booth's algorithm.",
        "Perform BCD addition: (i) 79 + 54 (ii) 38 + 45. Explain why +6 correction is required.",
        "Explain restoring and non-restoring division algorithms with suitable examples."
      ],
      scoringKeyAdvice: "Draw the complete register trace table showing columns: Cycle, Operation, A, Q, Q-1. Explicitly state the final 2's complement product."
    },
    quickRevision: {
      bulletPoints: [
        "Booth's algorithm multiplies signed 2's complement numbers without sign conversion.",
        "Bit pair Q0 Q-1: 10 -> subtract M; 01 -> add M; 00/11 -> shift only.",
        "Arithmetic Shift Right (ASR) preserves the sign bit.",
        "BCD valid codes are 0-9 (0000-1001). Codes 1010-1111 are illegal.",
        "BCD correction: Add 0110 (6) whenever sum > 9 or carry = 1."
      ],
      importantFormulas: [
        { name: "Booth Rule", formula: "Q_0 Q_{-1} = 10 \\implies A = A - M, \\quad 01 \\implies A = A + M" },
        { name: "BCD Correction", formula: "\\text{If } S > 9 \\lor C = 1 \\implies S = S + 0110_2" }
      ]
    },
    practiceQuestions: [
      {
        id: 'u1-p5-1',
        type: 'mcq',
        question: "In Booth's multiplication algorithm, what action is taken when the bit pair (Q₀, Q₋₁) is equal to 01?",
        options: [
          'Add Multiplicand M to Accumulator A, then perform Arithmetic Shift Right.',
          'Subtract Multiplicand M from Accumulator A, then perform Arithmetic Shift Right.',
          'Perform Arithmetic Shift Right only without arithmetic operation.',
          'Clear Accumulator A to zero.'
        ],
        correctAnswer: 0,
        explanation: "Pair 01 indicates transition from 1 to 0, which corresponds to the end of a block of 1s; hence Multiplicand M is added to A, followed by ASR.",
        marks: 2
      }
    ]
  }
];
