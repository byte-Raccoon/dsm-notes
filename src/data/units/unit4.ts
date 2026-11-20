import { LessonContent } from '../../types';

export const unit4Lessons: LessonContent[] = [
  {
    id: 'u4-l1-arm-architecture-and-modes',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'ARM Microcontrollers',
    title: 'ARM Architecture Overview & Processor Operating Modes',
    subtitle: 'ARMv7-M profile, Harvard multi-layer bus matrix, Thread vs Handler mode, and Privileged vs Unprivileged levels',
    estimatedMinutes: 30,
    order: 1,
    prerequisites: ['Basic microprocessor concepts', 'Buses and memory'],
    whatIsIt: {
      simpleSummary: 'ARM (Advanced RISC Machines) is the world\'s most widely adopted 32-bit microprocessor architecture, powering over 95% of smart devices and automotive electronics. The ARM Cortex-M family (M0, M3, M4, M7) is specifically engineered for deterministic, high-efficiency, cost-sensitive microcontroller and real-time embedded systems.',
      coreDefinition: 'ARM Cortex-M3/M4 is a 32-bit Harvard architecture processor executing the Thumb-2 Instruction Set Architecture (ISA). It has two operating modes (Thread Mode and Handler Mode) and two privilege levels (Privileged and Unprivileged).',
      keyAnalogy: 'Think of an airplane operating system: The passengers (user tasks) sit in standard seats with limited unprivileged access (Thread Mode, Unprivileged). The pilot and flight controller (OS kernel and Interrupts) operate in the cockpit with full master privileges (Handler Mode, Privileged) so a passenger cannot accidentally disconnect the engine!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Legacy 8-bit/16-bit microcontrollers (like 8051 or PIC) lack hardware memory isolation, hardware divide, and deterministic interrupt response. A single crash in an unprivileged user task could corrupt the entire operating system stack.',
      engineeringBenefit: 'ARM Cortex-M provides hardware-enforced protection boundaries between user code and OS kernel, 12-cycle zero-jitter interrupt handling, and 35% higher code density using Thumb-2 technology.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Thumb-2 Technology (16-bit + 32-bit Blend)',
          description: 'Traditional 32-bit ARM instructions consumed large Flash memory. Traditional 16-bit Thumb lacked performance. Thumb-2 dynamically mixes 16-bit and 32-bit instructions in the same stream, achieving 32-bit ARM performance with 16-bit code density!',
          codeOrFormula: 'High code density + 32-bit RISC execution speed'
        },
        {
          step: 2,
          title: 'Processor Operating Modes',
          description: '1. Thread Mode: Used for normal user execution (can be Privileged or Unprivileged).\n2. Handler Mode: Entered automatically when an exception or interrupt occurs. Always Privileged, always uses Main Stack Pointer (MSP)!',
          codeOrFormula: 'Thread Mode (User/RTOS task) <-> Exception Entry/Return <-> Handler Mode (ISR)'
        },
        {
          step: 3,
          title: 'Privilege Levels (CONTROL Register Bit 0)',
          description: 'Privileged execution has unrestricted access to all memory regions, special registers (PRIMASK, BASEPRI, CONTROL), and system peripherals. Unprivileged execution restricts MSR/MRS access and protects critical memory via the MPU.',
          codeOrFormula: 'CONTROL[0] = 0 (Privileged), CONTROL[0] = 1 (Unprivileged)'
        },
        {
          step: 4,
          title: 'Harvard Multi-Layer Bus Architecture',
          description: 'Three parallel 32-bit AHB-Lite buses connect core to memory:\n- I-Code Bus: Fetches instructions from Flash (0x00000000 - 0x1FFFFFFF)\n- D-Code Bus: Fetches data literals from Flash\n- System Bus: Connects to SRAM, peripherals, and external memory.',
          codeOrFormula: 'I-Code (Instructions) || D-Code (Data) || System Bus'
        }
      ],
      deepDiveNotes: [
        'States vs Modes in ARM Cortex-M:',
        'Cortex-M supports only ONE execution state: Thumb State (Bit 0 of address is always 1 during branches to indicate Thumb state).',
        'It has TWO operating modes: Thread Mode (execution) and Handler Mode (interrupts).'
      ]
    },
    interactiveSimulatorKey: 'arm-architecture',
    practicalExample: {
      scenario: 'How FreeRTOS operates on ARM Cortex-M3.',
      walkthrough: 'At boot, the OS kernel starts in Privileged Thread Mode on MSP. When creating user tasks, the OS configures each task to run in Unprivileged Thread Mode on its own isolated PSP (Process Stack Pointer). If a user task attempts an unauthorized write, the hardware triggers a MemManage Fault into Handler Mode without crashing the OS!',
      result: 'Hardware-enforced secure multi-tasking.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Explain the operating modes and privilege levels of ARM Cortex-M3/M4 processors with a state transition diagram.',
        marks: 5,
        steps: [
          {
            title: 'Define Operating Modes',
            explanation: '1. Thread Mode: Default execution mode for user applications and background software. Entered on reset.\n2. Handler Mode: Dedicated mode for handling exceptions, interrupts, and system faults. The processor switches to Handler mode upon any interrupt entry and returns to Thread mode on exception completion.',
            math: '\\text{Modes: Thread Mode and Handler Mode}'
          },
          {
            title: 'Define Privilege Levels',
            explanation: '1. Privileged Level: Unrestricted access to all core resources, control registers, and memory.\n2. Unprivileged Level: Access to system control space (NVIC, SysTick) and certain special registers is blocked. Controlled by CONTROL[0] bit.',
            math: '\\text{Privilege: Privileged and Unprivileged}'
          },
          {
            title: 'State Transition Mechanism',
            explanation: '- Privileged Thread -> Unprivileged Thread: By writing 1 to CONTROL[0] in software.\n- Unprivileged Thread -> Privileged: CANNOT be done directly in software (prevents malicious escalation)! Must trigger an exception (e.g. SVC - Supervisor Call), entering Privileged Handler Mode, which can modify CONTROL register.',
            math: '\\text{Escalation requires hardware exception entry (SVC)}'
          }
        ],
        finalAnswer: 'Thread Mode (Privileged/Unprivileged) and Handler Mode (Always Privileged)',
        tip: 'Draw the 3-state transition diagram showing Thread (Privileged), Thread (Unprivileged), and Handler Mode (Privileged) with SVC and exception transitions.'
      },
      {
        difficulty: 'university',
        question: 'Explain how an unprivileged user application in Thread mode requests a privileged service from the OS kernel using the SVC (Supervisor Call) mechanism.',
        marks: 5,
        steps: [
          {
            title: 'SVC Instruction Execution',
            explanation: 'The user application code executes the instruction: `SVC #number` (e.g. `SVC #0x02`). This generates an SVC synchronous exception.',
            math: '\\text{User code executes: } \\text{SVC } \\#imm'
          },
          {
            title: 'Hardware Mode Transition & Stacking',
            explanation: 'The processor automatically pushes context registers (R0-R3, R12, LR, PC, xPSR) to the user PSP stack, switches mode from Thread to Handler Mode (which is Privileged), and fetches the SVCall Handler address from Vector 11 (0x0000002C).',
            math: '\\text{Mode: Thread (Unprivileged) } \\to \\text{ Handler (Privileged)}'
          },
          {
            title: 'Service Execution & Safe Return',
            explanation: 'The privileged SVCall ISR inspects the stacked PC to read the immediate value (`#0x02`), executes the requested hardware operation (e.g. writing to peripheral registers), puts the return value into stacked R0, and returns using EXC_RETURN to resume unprivileged user thread mode.',
            math: '\\text{Safe privilege barrier maintained}'
          }
        ],
        finalAnswer: 'SVC triggers hardware exception into Privileged Handler mode, executing privileged service safely',
        tip: 'Explain that unprivileged code cannot directly write to the CONTROL register to make itself privileged; hardware exception is mandatory.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Handler Mode can be Unprivileged.',
        whyItHappens: 'Thinking privilege is completely independent of mode.',
        correctWay: 'Handler Mode is ALWAYS PRIVILEGED by hardware architecture. Only Thread Mode can be configured as Privileged or Unprivileged.'
      },
      {
        mistake: 'Confusing Thumb state with Thread mode.',
        whyItHappens: 'Both start with "Th".',
        correctWay: 'Thumb State is the instruction execution state (16/32-bit decoding). Thread Mode is the execution role (application vs interrupt handler).'
      }
    ],
    examPerspective: {
      expectedMarks: '5 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Explain the architectural features of ARM Cortex-M3/M4 processor with a neat block diagram.',
        'Differentiate between Thread mode and Handler mode. How does privilege level transition occur?',
        'Describe the Harvard bus matrix of ARM Cortex-M: explain I-Code, D-Code, and System buses.'
      ],
      scoringKeyAdvice: 'Draw the Cortex-M block diagram showing Core CPU, NVIC, Bus Matrix, Flash, SRAM, and Peripherals. Explicitly mention Harvard architecture.'
    },
    quickRevision: {
      bulletPoints: [
        'ARM Cortex-M: 32-bit RISC Harvard architecture with Thumb-2 ISA.',
        'Two modes: Thread Mode (user code) and Handler Mode (interrupts).',
        'Two privilege levels: Privileged (unrestricted) and Unprivileged (restricted).',
        'Handler mode is always privileged and always uses MSP.',
        'Thumb-2 combines 16-bit and 32-bit instructions for high density and speed.'
      ],
      importantFormulas: [
        { name: 'Control Register Priv bit', formula: 'CONTROL[0] = 0 (Privileged), 1 (Unprivileged)' },
        { name: 'Control Register SP bit', formula: 'CONTROL[1] = 0 (MSP), 1 (PSP)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u4-p1-1',
        type: 'mcq',
        question: 'Which of the following statements regarding ARM Cortex-M operating modes is correct?',
        options: [
          'Handler mode is always privileged and always uses the Main Stack Pointer (MSP).',
          'Handler mode can be unprivileged if configured by the CONTROL register.',
          'Thread mode must always use the Process Stack Pointer (PSP).',
          'The processor boots up in Handler mode.'
        ],
        correctAnswer: 0,
        explanation: 'By ARMv7-M architectural specification, Handler mode is strictly privileged and is hardwired to use MSP exclusively.',
        marks: 2
      }
    ]
  },
  {
    id: 'u4-l2-arm-registers-and-psr',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'ARM Microcontrollers',
    title: 'Register Organization & Special Control Registers',
    subtitle: 'R0–R15, dual stack pointers (MSP vs PSP), Link Register (LR), Program Counter (PC), and xPSR flags',
    estimatedMinutes: 35,
    order: 2,
    prerequisites: ['ARM Architecture overview', 'Stack memory operation'],
    whatIsIt: {
      simpleSummary: 'ARM Cortex-M processors possess sixteen 32-bit core registers (R0 to R15) accessible to programmer assembly code, alongside a collection of special-purpose status and masking registers. Understanding how the Stack Pointer (R13), Link Register (R14), Program Counter (R15), and Program Status Register (xPSR) work is essential for embedded programming.',
      coreDefinition: 'Registers R0–R12 are general-purpose. R13 is the Stack Pointer (banked as MSP and PSP). R14 is the Link Register (LR). R15 is the Program Counter (PC). Special registers include xPSR (APSR, IPSR, EPSR), PRIMASK, FAULTMASK, BASEPRI, and CONTROL.',
      keyAnalogy: 'Think of R0–R12 as workbenches where a carpenter keeps active tools. R13 (SP) is the clipboard bookmarking stack depth. R14 (LR) is the GPS tracking how to get back home after a trip. R15 (PC) is the teleprompter showing the line currently being spoken!'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In a single-stack processor, an accidental stack overflow in a buggy user application can overwrite the OS kernel stack frames, causing catastrophic silent corruption.',
      engineeringBenefit: 'Cortex-M physically banks R13 into TWO separate stack pointers: MSP (Main Stack Pointer for OS and ISRs) and PSP (Process Stack Pointer for user tasks). User code can corrupt its own PSP stack, but CANNOT touch the kernel MSP stack!'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'General-Purpose Registers (R0 - R12)',
          description: 'R0–R7 are Low Registers (accessible by all 16-bit Thumb instructions). R8–R12 are High Registers (accessible by 32-bit instructions).',
          codeOrFormula: 'R0-R3: Function arguments & return values; R4-R11: Local variables'
        },
        {
          step: 2,
          title: 'R13: Dual Banked Stack Pointer (MSP vs PSP)',
          description: 'Only one stack pointer is visible at any given time. Main Stack Pointer (MSP) is used by OS kernel and ALL exception handlers. Process Stack Pointer (PSP) is used by user application tasks. Selected by CONTROL[1] bit.',
          codeOrFormula: 'CONTROL[1] = 0 -> SP is MSP; CONTROL[1] = 1 -> SP is PSP'
        },
        {
          step: 3,
          title: 'R14: Link Register (LR)',
          description: 'Holds the return address when calling a subroutine using BL (Branch with Link). When an interrupt occurs, LR is automatically loaded with a special EXC_RETURN code (e.g. 0xFFFFFFF9 or 0xFFFFFFFD) that guides unstacking.',
          codeOrFormula: 'BL subroutine -> LR = Return Address; ISR Entry -> LR = EXC_RETURN'
        },
        {
          step: 4,
          title: 'R15: Program Counter (PC)',
          description: 'Points to the address of the instruction being fetched. Because Cortex-M uses a 3-stage pipeline, reading PC returns (Current Instruction Address + 4). Bit 0 is always 0 (instructions 16/32-bit aligned).',
          codeOrFormula: 'PC = Current_Address + 4'
        },
        {
          step: 5,
          title: 'Combined Program Status Register (xPSR)',
          description: 'Combines 3 sub-registers: 1. APSR (Application PSR: bits 31-27 store N, Z, C, V, Q flags). 2. IPSR (Interrupt PSR: bits 8-0 store active ISR number). 3. EPSR (Execution PSR: bit 24 holds Thumb bit T; must always be 1).',
          codeOrFormula: 'xPSR = APSR (Flags) | IPSR (Exception #) | EPSR (Thumb T-bit)'
        }
      ],
      deepDiveNotes: [
        'Interrupt Masking Special Registers:',
        'PRIMASK: 1-bit register. When set to 1, masks all configurable interrupts (leaves only NMI and HardFault active).',
        'FAULTMASK: 1-bit register. Masks all exceptions except NMI.',
        'BASEPRI: Multi-bit register. Masks all interrupts with priority lower than or equal to the specified value (enables fine-grained RTOS priority thresholds).'
      ]
    },
    interactiveSimulatorKey: 'register-bank',
    practicalExample: {
      scenario: 'Calling a C function `int add(int a, int b)` in ARM assembly.',
      walkthrough: 'According to ARM AAPCS calling convention: Argument a is placed in R0, argument b is placed in R1. Caller executes `BL add` (hardware puts return address into LR). The function executes `ADDS R0, R0, R1` (result stored in R0). Function returns using `BX LR` (branches back to address in LR).',
      result: 'Return value returned in R0, LR restores program counter.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Explain the register organization of ARM Cortex-M3/M4 processors. Describe the special functions of R13 (MSP/PSP), R14 (LR), R15 (PC), and the structure of the xPSR register.',
        marks: 10,
        steps: [
          {
            title: 'Describe R0 to R12',
            explanation: '13 general-purpose 32-bit registers. R0-R7 (low registers) used for general data processing and parameter passing. R8-R12 (high registers) used for 32-bit Thumb-2 instructions.',
            math: 'R0 \\dots R12 \\text{ (32-bit wide)}'
          },
          {
            title: 'Describe R13 (SP), R14 (LR), R15 (PC)',
            explanation: '- R13 (SP): Dual-banked. MSP (Main Stack Pointer) used by OS and interrupts; PSP (Process Stack Pointer) used by application tasks. Bit 1 of CONTROL register chooses between them.\n- R14 (LR): Holds subroutine return address during function calls (`BL`), and stores `EXC_RETURN` code during exception handling.\n- R15 (PC): Program counter. Points to the instruction address in Flash memory. Bit 0 is always 0.',
            math: 'R13 = \\text{SP (MSP/PSP)}, R14 = \\text{LR}, R15 = \\text{PC}'
          },
          {
            title: 'Analyze xPSR Structure',
            explanation: 'The 32-bit xPSR unites three status registers:\n- APSR [31:27]: N (Negative), Z (Zero), C (Carry), V (Overflow), Q (Saturation).\n- IPSR [8:0]: Exception Number of currently executing ISR (0 = Thread mode).\n- EPSR [24]: T-bit (Thumb bit; must be 1. If 0, causes HardFault!).',
            math: 'xPSR = APSR \\cup IPSR \\cup EPSR'
          }
        ],
        finalAnswer: 'Complete register model with dual SP, LR, PC, and composite xPSR',
        tip: 'Draw the 32-bit xPSR register bit layout diagram showing bit 31 to bit 0 with APSR, IPSR, and EPSR labels.'
      },
      {
        difficulty: 'university',
        question: 'Determine the values of the APSR condition flags (N, Z, C, V) after the execution of the instruction `SUBS R0, R1, R2` where R1 = 0x00000010 and R2 = 0x00000025.',
        marks: 5,
        steps: [
          {
            title: 'Perform 32-bit Subtraction R1 - R2',
            explanation: 'R1 = 16₁₀, R2 = 37₁₀. In 32-bit arithmetic, 16 - 37 = -21₁₀.\n-21 in 32-bit 2\'s complement:\n+21 = 0x00000015\n1s comp = 0xFFFFFFEA\n2s comp = 0xFFFFFFEB\nSo R0 = 0xFFFFFFEB.',
            math: 'R0 = 0xFFFFFFEB'
          },
          {
            title: 'Evaluate N (Negative) and Z (Zero) Flags',
            explanation: '- Bit 31 of result is 1 -> N = 1 (Result is Negative).\n- Result is non-zero (0xFFFFFFEB ≠ 0) -> Z = 0.',
            math: 'N = 1, \\quad Z = 0'
          },
          {
            title: 'Evaluate C (Carry) and V (Overflow) Flags',
            explanation: '- In ARM subtraction, Carry (C) represents NOT Borrow! Since 16 < 37, a borrow occurred, meaning C = 0 (Carry = 0 indicates borrow in ARM).\n- Both operands were positive numbers within 32-bit signed range and produced a valid negative result (-21). No signed overflow occurred -> V = 0.',
            math: 'C = 0, \\quad V = 0'
          }
        ],
        finalAnswer: 'N = 1, Z = 0, C = 0 (Borrow occurred), V = 0 (No overflow)',
        tip: 'CRITICAL ARM EXAM POINT: In ARM architecture, subtraction sets Carry C=1 if NO borrow was needed, and C=0 if a borrow WAS needed (opposite of some legacy 8-bit processors).'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Attempting to execute code with T-bit = 0 in EPSR.',
        whyItHappens: 'In traditional ARM7TDMI, T=0 meant 32-bit ARM state. But Cortex-M does NOT support ARM state!',
        correctWay: 'In Cortex-M, T-bit MUST ALWAYS BE 1. Clearing it triggers an immediate UsageFault / HardFault exception.'
      }
    ],
    examPerspective: {
      expectedMarks: '10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Explain the register organization of ARM Cortex-M3. Why are there two stack pointers (MSP and PSP)?',
        'Describe the bit fields of the Program Status Register (xPSR). What is the significance of the T-bit?',
        'Explain the role of special registers: PRIMASK, FAULTMASK, BASEPRI, and CONTROL.'
      ],
      scoringKeyAdvice: 'Draw the complete register map. Explain the AAPCS calling convention (R0-R3 parameter passing). Highlight the distinction between MSP and PSP.'
    },
    quickRevision: {
      bulletPoints: [
        'R0-R7: Low registers; R8-R12: High registers.',
        'R13: Dual banked SP (MSP for kernel/ISRs, PSP for user tasks).',
        'R14: Link Register (LR) holding return address or EXC_RETURN.',
        'R15: Program Counter (PC).',
        'xPSR = APSR (flags N, Z, C, V, Q) + IPSR (ISR number) + EPSR (Thumb T-bit).',
        'PRIMASK masks configurable interrupts; BASEPRI masks interrupts by priority threshold.'
      ],
      importantFormulas: [
        { name: 'APSR Condition Flags', formula: '[31:N, 30:Z, 29:C, 28:V, 27:Q]' },
        { name: 'IPSR Exception Range', formula: '[8:0] = 0 \\text{ (Thread)}, 15 \\text{ (SysTick)}, 16+ \\text{ (IRQs)}' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u4-p2-1',
        type: 'mcq',
        question: 'What is the purpose of the Process Stack Pointer (PSP) in ARM Cortex-M microcontrollers?',
        options: [
          'To isolate application task stacks from the OS kernel and interrupt stack (MSP).',
          'To speed up instruction fetching from Flash memory.',
          'To hold floating-point coprocessor registers.',
          'To replace the Program Counter during function calls.'
        ],
        correctAnswer: 0,
        explanation: 'PSP allows user application tasks to run on their own separate stack space, protecting the OS kernel and exception handler stack (MSP) from user stack overflow.',
        marks: 2
      }
    ]
  },
  {
    id: 'u4-l3-cortex-m3-vs-m4-and-fpu',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'ARM Microcontrollers',
    title: 'ARM Cortex-M3 vs Cortex-M4 & Floating-Point Unit (FPU)',
    subtitle: 'DSP extensions, SIMD instructions, single-precision FPv4-SP, lazy stacking, and architectural comparison',
    estimatedMinutes: 30,
    order: 3,
    prerequisites: ['ARM register bank', 'IEEE 754 floating-point format'],
    whatIsIt: {
      simpleSummary: 'While the ARM Cortex-M3 is an ultra-efficient general-purpose 32-bit microcontroller core, the ARM Cortex-M4 builds on top of it by introducing hardware Digital Signal Processing (DSP) instructions and an optional hardware Floating-Point Unit (FPU). It bridges the gap between traditional microcontrollers and dedicated DSP chips.',
      coreDefinition: 'The Cortex-M4 implements the ARMv7E-M architecture, adding single-cycle 16/32-bit SIMD arithmetic, saturating instructions, and the FPv4-SP floating-point coprocessor with thirty-two 32-bit registers (s0–s31).',
      keyAnalogy: 'Cortex-M3 is like a reliable four-wheel passenger car (efficient, agile, ideal for daily computing). Cortex-M4 is the same car equipped with a turbocharger (DSP) and high-speed all-wheel drive (FPU) designed for heavy mathematical lifting like digital audio, motor physics, and drone stabilization.'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'Executing floating-point math (e.g. `float c = a * b + sin(angle)`) on a Cortex-M3 requires hundreds of software library instructions, consuming massive clock cycles and battery power. Audio filters, FFTs, and motor vector controls require single-cycle math.',
      engineeringBenefit: 'The hardware FPU in Cortex-M4 calculates 32-bit floating-point addition, subtraction, and multiplication in a SINGLE clock cycle! It also computes hardware square root (`VSQRT.F32`) in 14 cycles instead of ~150 cycles in software.'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'FPU Register Organization (s0 - s31)',
          description: 'Thirty-two 32-bit single-precision registers (s0 to s31). They can also be accessed as sixteen 64-bit double-word registers (d0 to d15).',
          codeOrFormula: '32 x 32-bit (s0-s31) or 16 x 64-bit (d0-d15)'
        },
        {
          step: 2,
          title: 'FPSCR (Floating-Point Status and Control Register)',
          description: 'Holds floating-point condition flags (N, Z, C, V), rounding mode (round to nearest, round toward zero), and exception trap bits (divide-by-zero, overflow, underflow, inexact).',
          codeOrFormula: 'FPSCR: Flags (N, Z, C, V) + Rounding Control'
        },
        {
          step: 3,
          title: 'Hardware Lazy Stacking (Crucial Optimization)',
          description: 'Normally, pushing 32 FPU registers during an interrupt would add 32 clock cycles of latency! Lazy Stacking reserves stack space but delays actual FPU register pushing until the ISR actually executes a floating-point instruction. If the ISR does not use floats, ZERO cycles are wasted, keeping interrupt latency at 12 cycles!',
          codeOrFormula: 'Preserves deterministic 12-cycle interrupt entry'
        },
        {
          step: 4,
          title: 'DSP SIMD Instructions',
          description: 'Performs parallel mathematical operations on dual 16-bit or quad 8-bit operands packed into a single 32-bit register (e.g. SADD16, SSUB16, QADD, QSUB). Single-cycle Multiply-Accumulate (MAC) computes A = A + (B × C).',
          codeOrFormula: 'SIMD: One instruction processes multiple data points simultaneously'
        }
      ],
      deepDiveNotes: [
        'Summary Comparison Table for DTU 5-Mark Questions:',
        '- Architecture: Cortex-M3 is ARMv7-M; Cortex-M4 is ARMv7E-M.',
        '- FPU: None in M3 (software emulation); Hardware FPv4-SP optional in M4.',
        '- DSP Instructions: None in M3; Full SIMD and saturating arithmetic in M4.',
        '- Hardware Divide: Both feature 2 to 12 cycle hardware divide (SDIV/UDIV).',
        '- Pipeline: Both feature a 3-stage in-order pipeline (Fetch, Decode, Execute).'
      ]
    },
    interactiveSimulatorKey: 'cortex-comparison',
    practicalExample: {
      scenario: 'Calculating a Fast Fourier Transform (FFT) for audio noise cancellation.',
      walkthrough: 'On Cortex-M3: Uses 32-bit integer fixed-point math with extensive software scaling to prevent overflows, requiring ~12,000 clock cycles. On Cortex-M4: Uses hardware single-precision floats and single-cycle SIMD instructions with saturating arithmetic, completing in ~1,200 clock cycles (10x faster execution with lower energy)!',
      result: '10x throughput speedup on Cortex-M4.'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Compare the architecture and capabilities of ARM Cortex-M3 and Cortex-M4 processors. Explain the features of the Cortex-M4 Floating-Point Unit (FPU) and the concept of Lazy Stacking.',
        marks: 10,
        steps: [
          {
            title: 'Architectural Comparison (Table format)',
            explanation: 'Highlight core differences:\n1. Instruction Set: M3 implements Thumb-2; M4 adds DSP SIMD instructions.\n2. FPU: M3 has no hardware FPU; M4 includes optional single-precision IEEE 754 FPv4-SP coprocessor.\n3. Target: M3 for control systems; M4 for digital signal processing, sensor fusion, and audio.',
            math: '\\text{M4} = \\text{M3 Core} + \\text{DSP Instructions} + \\text{Hardware FPU}'
          },
          {
            title: 'Describe FPU Register Architecture',
            explanation: 'Thirty-two 32-bit registers (s0–s31), accessible as 16 double-word registers (d0–d15). Status governed by FPSCR (Floating Point Status & Control Register). Executes single-cycle add, sub, mul, and 14-cycle hardware sqrt.',
            math: 's0 \\dots s31, \\quad d0 \\dots d15, \\quad \\text{FPSCR}'
          },
          {
            title: 'Explain Lazy Stacking Mechanism',
            explanation: 'Pushing 16-32 floating point registers onto stack on every interrupt would increase latency from 12 to 28+ cycles. With lazy stacking enabled (FPCCR.LSPEN=1), the hardware reserves memory space on the stack, but defers the actual register copying until an FPU instruction is executed inside the ISR. If the ISR contains no float math, the registers are never pushed!',
            math: '\\text{Latency remains deterministic 12 cycles}'
          }
        ],
        finalAnswer: 'Cortex-M4 adds DSP, FPv4-SP FPU with 32 registers, and Lazy Stacking to Cortex-M3 baseline',
        tip: 'In DTU examinations, drawing the side-by-side comparison table is guaranteed to earn full marks. Be sure to mention Lazy Stacking.'
      },
      {
        difficulty: 'university',
        question: 'Explain how SIMD (Single Instruction Multiple Data) and saturating arithmetic instructions operate in the ARM Cortex-M4 DSP engine.',
        marks: 5,
        steps: [
          {
            title: 'SIMD Dual-16 Bit Operation (SADD16)',
            explanation: 'A 32-bit register holds two 16-bit signed audio samples: Top half [31:16] and Bottom half [15:0].\nThe instruction `SADD16 R0, R1, R2` adds the top half of R1 to the top half of R2, AND simultaneously adds the bottom half of R1 to the bottom half of R2 in a SINGLE clock cycle!\nThis doubles DSP filter throughput.',
            math: 'R0[31:16] = R1[31:16] + R2[31:16], \\quad R0[15:0] = R1[15:0] + R2[15:0]'
          },
          {
            title: 'Saturating Arithmetic (QADD / QSUB)',
            explanation: 'In standard arithmetic, when an overflow occurs, a positive value wraps around to a large negative number (causing screeching audio pop/clipping errors). Saturating instructions clamp the result at maximum positive (+32767 for 16-bit) or minimum negative (-32768), setting the Q flag in APSR.',
            math: '\\text{Result clamped at } [Max, Min] \\text{ instead of wrap-around}'
          }
        ],
        finalAnswer: 'SIMD doubles data throughput per cycle; saturating math prevents audio wrap-around distortion',
        tip: 'Mention the Q flag in APSR which is set whenever saturation occurs.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Assuming Cortex-M4 supports Double Precision (64-bit) floating-point hardware.',
        whyItHappens: 'Seeing 64-bit register names (d0-d15).',
        correctWay: 'Standard Cortex-M4 FPU (FPv4-SP) supports ONLY Single Precision (32-bit) in hardware. 64-bit double precision is handled via software emulation (hardware double precision is found in Cortex-M7/FPv5-DP).'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Differentiate between ARM Cortex-M3 and Cortex-M4 microcontrollers in terms of architecture, instructions, and applications.',
        'Explain the floating-point register organization (s0-s31) and status register (FPSCR) in Cortex-M4.',
        'What is Lazy Stacking in Cortex-M4 FPU? How does it preserve low interrupt latency?'
      ],
      scoringKeyAdvice: 'Tabulate at least 5 distinct comparison points. Explain Lazy Stacking with timing numbers (12 cycles preserved).'
    },
    quickRevision: {
      bulletPoints: [
        'Cortex-M3: ARMv7-M (control oriented).',
        'Cortex-M4: ARMv7E-M (M3 + DSP extensions + optional single-precision FPU).',
        'FPU has thirty-two 32-bit registers (s0-s31) and FPSCR.',
        'Lazy Stacking preserves 12-cycle interrupt latency by postponing FPU register save until needed.',
        'DSP SIMD instructions process dual 16-bit or quad 8-bit operands in parallel in 1 cycle.'
      ],
      importantFormulas: [
        { name: 'Cortex-M4 ISA', formula: '\\text{ARMv7E-M} = \\text{Thumb-2} + \\text{DSP SIMD} + \\text{FPv4-SP}' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u4-p3-1',
        type: 'mcq',
        question: 'What is the primary benefit of the Lazy Stacking feature in the ARM Cortex-M4 FPU?',
        options: [
          'It preserves deterministic 12-cycle interrupt latency by skipping FPU register saves if the ISR does not execute floating-point instructions.',
          'It allows double-precision floating-point numbers to be calculated in 1 cycle.',
          'It automatically rounds floating-point numbers to the nearest integer.',
          'It compresses the FPU registers to save RAM space.'
        ],
        correctAnswer: 0,
        explanation: 'Lazy stacking avoids the overhead of pushing floating-point registers unless the interrupt service routine actually executes a floating-point operation.',
        marks: 2
      }
    ]
  },
  {
    id: 'u4-l4-arm-memory-map-and-exceptions',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'ARM Microcontrollers',
    title: 'Cortex-M 4GB Memory Map, Vector Table & NVIC Exception Architecture',
    subtitle: 'Linear address space partitions, bit-band aliasing, boot exception vector table, and NVIC tail-chaining/late-arrival',
    estimatedMinutes: 35,
    order: 4,
    prerequisites: ['ARM registers and modes', 'Interrupt handling basics'],
    whatIsIt: {
      simpleSummary: 'ARM Cortex-M employs a uniform 32-bit linear address space spanning 4 Gigabytes (0x00000000 to 0xFFFFFFFF). This memory space is partitioned into architecturally defined regions: Code (Flash), SRAM, Peripherals, External RAM, and System Space (housing the NVIC). At address 0x00000000 resides the Exception Vector Table, which holds the initial stack pointer and entry addresses for all interrupt service routines.',
      coreDefinition: 'The 4GB Cortex-M address map is divided into six 512MB/1GB segments:\n1. Code Space (0x00000000 - 0x1FFFFFFF)\n2. SRAM Space (0x20000000 - 0x3FFFFFFF)\n3. Peripheral Space (0x40000000 - 0x5FFFFFFF)\n4. External RAM (0x60000000 - 0x9FFFFFFF)\n5. External Device (0xA0000000 - 0xDFFFFFFF)\n6. System Control Space / PPB (0xE0000000 - 0xFFFFFFFF).',
      keyAnalogy: 'Think of the 4GB address space like a city master plan with pre-designated zones: Zone 1 is residential libraries (Code), Zone 2 is work desks (SRAM), Zone 3 is telephone switchboards (Peripherals), and Zone 6 is City Hall and Police Headquarters (NVIC/System Space).'
    },
    whyDoWeNeedIt: {
      realWorldProblem: 'In legacy microprocessors with fragmented memory architectures (like 8051 with separate CODE, DATA, and XDATA banks), code was clumsy and required different assembler instructions (`MOV`, `MOVX`, `MOVC`).',
      engineeringBenefit: 'Cortex-M uses a single unified memory map where standard load/store instructions (`LDR`, `STR`) operate identically across Flash, RAM, peripheral control registers, and system control registers!'
    },
    howItWorks: {
      stepByStepFlow: [
        {
          step: 1,
          title: 'Boot Sequence & Vector Table Mapping',
          description: 'Upon hardware reset, the processor automatically performs two memory reads from address 0x00000000:\n1. Address 0x00000000: Fetches the top-of-stack address and loads it into Main Stack Pointer (MSP).\n2. Address 0x00000004: Fetches the initial Reset Handler address and loads it into the Program Counter (PC). Execution starts immediately!',
          codeOrFormula: 'MSP = *0x00000000; PC = *0x00000004'
        },
        {
          step: 2,
          title: 'Bit-Band Memory Mapping (Atomic Bit Operations)',
          description: 'Enables atomic single-bit set and clear operations without using read-modify-write loops. 1MB of SRAM bit-band region (0x20000000 - 0x200FFFFF) maps to a 32MB alias region (0x22000000 - 0x23FFFFFF). Writing a 1 to an alias word sets that individual bit in SRAM atomically!',
          codeOrFormula: 'Alias_Addr = 0x22000000 + (Byte_Offset × 32) + (Bit_Number × 4)'
        },
        {
          step: 3,
          title: 'NVIC (Nested Vectored Interrupt Controller)',
          description: 'Tightly coupled to the CPU core. Features up to 240 external interrupt lines with 8 to 256 programmable priority levels. Preempts lower-priority interrupts dynamically in hardware.',
          codeOrFormula: 'Hardware preemption: Higher priority IRQ immediately interrupts lower priority ISR'
        },
        {
          step: 4,
          title: 'Tail-Chaining Optimization (6 Clock Cycles)',
          description: 'When completing an ISR, if another interrupt is pending, the processor SKIPS unstacking and restacking! It switches execution directly to the new ISR in only 6 clock cycles instead of 24 cycles.',
          codeOrFormula: 'Saves 18 clock cycles on back-to-back interrupts'
        },
        {
          step: 5,
          title: 'Late-Arrival Optimization',
          description: 'If a higher-priority interrupt arrives while the processor is in the middle of 12-cycle hardware stacking for a lower-priority interrupt, the processor finishes the stacking and branches directly to the higher-priority ISR without starting over!',
          codeOrFormula: 'Zero penalty for late arriving high-priority interrupts'
        }
      ],
      deepDiveNotes: [
        'Vector Table Relocation (VTOR Register at 0xE000ED08):',
        'While the vector table starts at 0x00000000 at boot, microcontrollers with bootloaders can relocate the vector table into SRAM or application Flash by writing the new base address into the VTOR register!'
      ]
    },
    interactiveSimulatorKey: 'arm-memory-map',
    practicalExample: {
      scenario: 'Calculating the exact Bit-Band Alias Address to toggle Bit 3 of SRAM address 0x20000014.',
      walkthrough: 'Byte Address = 0x20000014. Byte Offset = 0x20000014 - 0x20000000 = 0x14 = 20 decimal. Bit Number = 3.\nFormula: Alias = 0x22000000 + (Byte Offset × 32) + (Bit Number × 4)\n= 0x22000000 + (20 × 32) + (3 × 4) = 0x22000000 + 640 + 12 = 0x22000000 + 652₁₀.\n652 in hex = 0x28C.\nAlias Address = 0x2200028C.',
      result: 'Writing 1 to address 0x2200028C atomically sets Bit 3 of SRAM byte 0x20000014 without race conditions!'
    },
    solvedProblems: [
      {
        difficulty: 'university',
        question: 'Describe the 4GB memory map of ARM Cortex-M microcontrollers. Explain the Bit-Band feature and calculate the alias address for Bit 2 of SRAM address 0x20000300.',
        marks: 10,
        steps: [
          {
            title: 'Describe Memory Segments',
            explanation: 'Partitioned into 6 major regions:\n1. Code Space (0x00000000 - 0x1FFFFFFF, 512MB): Flash memory & Vector Table.\n2. SRAM Space (0x20000000 - 0x3FFFFFFF, 512MB): On-chip SRAM, stack, and heap.\n3. Peripheral Space (0x40000000 - 0x5FFFFFFF, 512MB): Memory-mapped I/O registers.\n4. External RAM (0x60000000 - 0x9FFFFFFF, 1GB).\n5. External Device (0xA0000000 - 0xDFFFFFFF, 1GB).\n6. System Control Space (0xE0000000 - 0xFFFFFFFF, 512MB): NVIC, SysTick, MPU.',
            math: '4\\text{GB Linear Address Space}'
          },
          {
            title: 'Explain Bit-Band Concept',
            explanation: 'Bit-banding maps each individual bit in a 1MB region to a full 32-bit word in a 32MB alias region. Writing to the alias address sets/clears the target bit in a single atomic bus transaction, eliminating read-modify-write race conditions in multi-threaded RTOS.',
            math: '\\text{Alias Address} = \\text{Base}_{alias} + (\\text{Byte Offset} \\times 32) + (\\text{Bit} \\times 4)'
          },
          {
            title: 'Calculate Target Alias Address',
            explanation: 'Target: Bit 2 at address 0x20000300.\nByte Offset = 0x20000300 - 0x20000000 = 0x300 = 768₁₀.\nBit Number = 2.\nAlias Address = 0x22000000 + (768 × 32) + (2 × 4) = 0x22000000 + 24576 + 8 = 0x22000000 + 24584₁₀.\n24584 in hex = 0x6008.\nAlias Address = 0x22006008.',
            math: '\\text{Alias} = \\text{0x22006008}'
          }
        ],
        finalAnswer: 'Alias Address = 0x22006008',
        tip: 'Show the calculation in both decimal and hexadecimal to ensure full marks in DTU evaluation.'
      },
      {
        difficulty: 'university',
        question: 'Explain the NVIC (Nested Vectored Interrupt Controller) architecture in ARM Cortex-M. Describe the concepts of Tail-Chaining, Late-Arrival, and Hardware Auto-Stacking.',
        marks: 5,
        steps: [
          {
            title: 'NVIC Overview',
            explanation: 'Integrated on-chip interrupt controller tightly coupled to the processor core. Features up to 240 interrupt request lines with programmable priorities and direct 32-bit vector address fetches.',
            math: '\\text{Deterministic 12-cycle interrupt latency}'
          },
          {
            title: 'Hardware Auto-Stacking (12 Cycles)',
            explanation: 'When an exception occurs, hardware pushes 8 registers (xPSR, PC, LR, R12, R3, R2, R1, R0) to the stack automatically without software instructions, enabling C functions to serve directly as ISRs without assembly wrappers.',
            math: '\\text{Context Frame: 8 registers pushed in 12 cycles}'
          },
          {
            title: 'Tail-Chaining and Late-Arrival Optimization',
            explanation: '- Tail-Chaining: When exiting an ISR, if another interrupt is pending, unstacking and restacking are skipped! The processor branches to the next ISR in only 6 clock cycles.\n- Late-Arrival: If a higher-priority interrupt arrives during stacking for a lower-priority interrupt, the processor finishes stacking and services the higher-priority interrupt first with zero latency penalty.',
            math: '\\text{Tail-Chaining} = 6 \\text{ cycles; Late-Arrival} = 0 \\text{ penalty}'
          }
        ],
        finalAnswer: 'NVIC delivers ultra-fast deterministic interrupt response via auto-stacking, tail-chaining (6 cycles), and late-arrival',
        tip: 'Contrast this with traditional architectures that require 30-50 cycles of software wrapper code to push registers.'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Multiplying by 8 instead of 32 in the bit-band formula.',
        whyItHappens: 'Thinking 1 byte = 8 bits.',
        correctWay: 'Each byte contains 8 bits, and each bit maps to a 4-byte (32-bit) word in the alias space! Therefore, 1 byte in SRAM expands to 8 × 4 = 32 bytes in alias space.'
      }
    ],
    examPerspective: {
      expectedMarks: '5-10 Marks',
      frequency: 'Very High',
      typicalDtuQuestions: [
        'Explain the memory map of ARM Cortex-M3. What is bit-banding and how is it used?',
        'Describe the boot sequence of an ARM Cortex-M processor with reference to the vector table.',
        'Explain the role and features of NVIC: interrupt latency, priority grouping, tail-chaining, and late-arrival.'
      ],
      scoringKeyAdvice: 'Draw the memory map diagram from 0x00000000 to 0xFFFFFFFF with size annotations. State the bit-band formula clearly.'
    },
    quickRevision: {
      bulletPoints: [
        '4GB linear address space divided into Code, SRAM, Peripherals, and System Space.',
        'Vector 0 holds initial MSP; Vector 1 holds Reset Handler address.',
        'Bit-band maps 1 bit to a 32-bit word for atomic operations.',
        'NVIC auto-stacks 8 registers in 12 clock cycles.',
        'Tail-chaining switches back-to-back interrupts in 6 clock cycles.'
      ],
      importantFormulas: [
        { name: 'Bit-Band SRAM Formula', formula: '\\text{Alias} = 0x22000000 + (\\text{Offset} \\times 32) + (\\text{Bit} \\times 4)' },
        { name: 'Bit-Band Peripheral Formula', formula: '\\text{Alias} = 0x42000000 + (\\text{Offset} \\times 32) + (\\text{Bit} \\times 4)' }
      ]
    },
    practiceQuestions: [
      {
        id: 'u4-p4-1',
        type: 'mcq',
        question: 'In an ARM Cortex-M processor, what is stored at memory address 0x00000000?',
        options: [
          'The initial value of the Main Stack Pointer (MSP).',
          'The address of the Reset Handler.',
          'The first assembly instruction of the program.',
          'The NVIC interrupt priority register.'
        ],
        correctAnswer: 0,
        explanation: 'Address 0x00000000 holds the initial top-of-stack address loaded into the Main Stack Pointer (MSP) at reset. Address 0x00000004 holds the Reset Handler address.',
        marks: 2
      }
    ]
  }
];
