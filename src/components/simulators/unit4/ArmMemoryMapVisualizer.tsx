import React, { useState } from 'react';
import { Database, Shield, Zap, Search, ArrowRight, Layers, HelpCircle } from 'lucide-react';

interface MemoryRegion {
  name: string;
  range: string;
  size: string;
  type: string;
  bus: string;
  description: string;
  dtuExamNote: string;
}

export const ArmMemoryMapVisualizer: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('code');
  const [showVectorTable, setShowVectorTable] = useState<boolean>(true);

  const memoryRegions: Record<string, MemoryRegion> = {
    code: {
      name: 'Code Memory Space (Flash ROM)',
      range: '0x00000000 – 0x1FFFFFFF',
      size: '512 MB',
      type: 'Executable Flash / ROM',
      bus: 'I-Code Bus & D-Code Bus',
      description: 'Houses bootloader, firmware code, constant literals, and the critical Exception Vector Table starting at 0x00000000.',
      dtuExamNote: 'Crucial DTU question: Vector 0 holds initial MSP address, Vector 1 holds Reset Handler address with Bit 0 set to 1 for Thumb state.'
    },
    sram: {
      name: 'SRAM Memory Space (Internal RAM)',
      range: '0x20000000 – 0x3FFFFFFF',
      size: '512 MB',
      type: 'On-chip Static RAM',
      bus: 'System Bus',
      description: 'Stores application data variables, dynamic memory heap, and execution stacks (MSP and PSP). Features optional Bit-Band region.',
      dtuExamNote: 'Bit-band feature maps 1 MB of SRAM to a 32 MB alias region where every individual bit can be written with atomic read-modify-write.'
    },
    peripherals: {
      name: 'On-chip Peripheral Space',
      range: '0x40000000 – 0x5FFFFFFF',
      size: '512 MB',
      type: 'Memory-Mapped I/O Registers',
      bus: 'System Bus (AHB / APB)',
      description: 'Contains hardware registers controlling micro-controller peripherals: GPIO ports, Timers, UART serial communications, ADC converters, and SPI.',
      dtuExamNote: 'All peripherals are Memory-Mapped; software talks to hardware pins by reading/writing standard memory addresses.'
    },
    system: {
      name: 'System Control Space (SCS / PPB)',
      range: '0xE0000000 – 0xFFFFFFFF',
      size: '512 MB',
      type: 'Core Internal Peripherals',
      bus: 'Private Peripheral Bus (PPB)',
      description: 'Houses ARM internal core control blocks: NVIC (0xE000E100), SysTick Timer (0xE000E010), MPU (0xE000ED90), and Debug Core components.',
      dtuExamNote: 'Can ONLY be accessed in Privileged Mode. User tasks attempting unprivileged access trigger a BusFault exception.'
    }
  };

  const vectorTableEntries = [
    { offset: '0x00000000', exception: 'Vector 0', handler: 'Initial Main Stack Pointer (MSP) Value', desc: 'Loaded into SP at reset' },
    { offset: '0x00000004', exception: 'Vector 1', handler: 'Reset Handler Address', desc: 'First instruction executed upon power-on' },
    { offset: '0x00000008', exception: 'Vector 2', handler: 'NMI (Non-Maskable Interrupt)', desc: 'Highest priority hardware emergency' },
    { offset: '0x0000000C', exception: 'Vector 3', handler: 'HardFault Handler', desc: 'Triggered by bus errors or illegal instructions' },
    { offset: '0x0000002C', exception: 'Vector 11', handler: 'SVCall Handler', desc: 'Supervisor Call for OS system calls' },
    { offset: '0x00000038', exception: 'Vector 14', handler: 'PendSV Handler', desc: 'Context-switching handler used by RTOS' },
    { offset: '0x0000003C', exception: 'Vector 15', handler: 'SysTick Timer Handler', desc: 'OS periodic system tick' },
    { offset: '0x00000040', exception: 'Vector 16+', handler: 'External Interrupts (IRQ0, IRQ1...)', desc: 'Peripheral hardware interrupts' },
  ];

  const current = memoryRegions[selectedRegion];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            ARM Cortex-M 4GB Memory Map & Exception Vector Table Explorer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Linear 32-bit address space partition and boot vector table mapping. Standard DTU 5-mark examination topic!
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setShowVectorTable(!showVectorTable)}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              showVectorTable ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {showVectorTable ? 'Hide Vector Table' : 'Show Vector Table'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Memory Bar Segments (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white space-y-2">
          <span className="text-[10px] text-slate-400 font-mono block text-center">High Memory: 0xFFFFFFFF</span>

          {/* System Space */}
          <button
            onClick={() => setSelectedRegion('system')}
            className={`w-full p-3 rounded-xl border text-left transition-all ${
              selectedRegion === 'system'
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>System Space (PPB)</span>
              <span className="text-[10px] text-purple-400">512 MB</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">0xE0000000 – 0xFFFFFFFF (NVIC, SysTick)</div>
          </button>

          {/* Peripherals */}
          <button
            onClick={() => setSelectedRegion('peripherals')}
            className={`w-full p-3 rounded-xl border text-left transition-all ${
              selectedRegion === 'peripherals'
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>On-Chip Peripherals</span>
              <span className="text-[10px] text-cyan-400">512 MB</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">0x40000000 – 0x5FFFFFFF (GPIO, Timers, UART)</div>
          </button>

          {/* SRAM */}
          <button
            onClick={() => setSelectedRegion('sram')}
            className={`w-full p-3 rounded-xl border text-left transition-all ${
              selectedRegion === 'sram'
                ? 'bg-blue-950/70 border-blue-500 text-blue-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>SRAM (Static RAM)</span>
              <span className="text-[10px] text-blue-400">512 MB</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">0x20000000 – 0x3FFFFFFF (Stacks & Heap)</div>
          </button>

          {/* Code Flash */}
          <button
            onClick={() => setSelectedRegion('code')}
            className={`w-full p-3 rounded-xl border text-left transition-all ${
              selectedRegion === 'code'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span>Code Space (Flash ROM)</span>
              <span className="text-[10px] text-emerald-400">512 MB</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">0x00000000 – 0x1FFFFFFF (Vector Table)</div>
          </button>

          <span className="text-[10px] text-slate-400 font-mono block text-center">Low Memory: 0x00000000</span>
        </div>

        {/* Selected Region Detailed Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active Memory Partition
              </span>
              <span className="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded">
                Size: {current.size}
              </span>
            </div>

            <h5 className="text-base font-bold text-slate-900 dark:text-white">
              {current.name}
            </h5>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 bg-white dark:bg-slate-900 rounded border">
                <span className="text-[10px] text-slate-400 block">Address Range</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{current.range}</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border">
                <span className="text-[10px] text-slate-400 block">Bus Interface</span>
                <span className="font-bold text-blue-600">{current.bus}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.description}
            </p>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>DTU Exam Angle:</strong> {current.dtuExamNote}
            </div>
          </div>

          {/* Exception Vector Table */}
          {showVectorTable && (
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Boot Exception Vector Table (Located at Flash Address 0x00000000):
              </span>
              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <th className="py-1">Address</th>
                      <th className="py-1">Vector</th>
                      <th className="py-1">Handler Function</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {vectorTableEntries.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                        <td className="py-1 text-emerald-600 dark:text-emerald-400 font-bold">{v.offset}</td>
                        <td className="py-1 text-slate-500">{v.exception}</td>
                        <td className="py-1 text-slate-800 dark:text-slate-200 font-bold">{v.handler}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
