import React, { useState } from 'react';
import { Eye, Check, AlertTriangle } from 'lucide-react';

export const SevenSegmentDisplaySimulator: React.FC = () => {
  const [bcdInput, setBcdInput] = useState<number>(5);
  const [mode, setMode] = useState<'cathode' | 'anode'>('cathode');

  // Convert decimal to 4-bit binary [B3, B2, B1, B0]
  const bits = bcdInput.toString(2).padStart(4, '0').split('').map(Number);
  const [b3, b2, b1, b0] = bits;

  // Segment activation table for numbers 0-9 (1 = ON, 0 = OFF)
  // Segments: a, b, c, d, e, f, g
  const segmentTable: Record<number, { a: number; b: number; c: number; d: number; e: number; f: number; g: number }> = {
    0: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
    1: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
    2: { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
    3: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
    4: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
    5: { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
    6: { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
    7: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
    8: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
    9: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
  };

  const isInvalidBcd = bcdInput > 9;
  const activeSegments = isInvalidBcd
    ? { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 1 } // Show dash for invalid BCD
    : segmentTable[bcdInput];

  // Helper to determine LED glowing color
  const getSegColor = (active: number) => {
    const isLit = mode === 'cathode' ? active === 1 : active === 0;
    return isLit ? '#ef4444' : '#1e293b'; // glowing red vs dim dark
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-rose-500" />
            BCD to 7-Segment Decoder & LED Display Simulator
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive IC 7447 / 7448 decoder with Common Cathode and Common Anode driving modes.
          </p>
        </div>

        {/* Common cathode / anode toggle */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('cathode')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              mode === 'cathode' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Common Cathode (Active HIGH)
          </button>
          <button
            onClick={() => setMode('anode')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              mode === 'anode' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Common Anode (Active LOW)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Interactive BCD Input Selector */}
        <div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
              Select Decimal Digit (0 to 15):
            </label>
            <div className="grid grid-cols-8 gap-1 mb-2">
              {Array.from({ length: 16 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setBcdInput(i)}
                  className={`py-2 text-xs font-bold font-mono rounded-lg transition-colors ${
                    bcdInput === i
                      ? 'bg-rose-600 text-white shadow-md'
                      : i > 9
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            {isInvalidBcd && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Values 10–15 are invalid BCD states (treated as Don't Cares 'X' in IC 7447).</span>
              </div>
            )}
          </div>

          {/* 4-Bit Input Line Indicators */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              4-Bit BCD Lines (8421 Code):
            </span>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {[
                { name: 'D (8)', bit: b3 },
                { name: 'C (4)', bit: b2 },
                { name: 'B (2)', bit: b1 },
                { name: 'A (1)', bit: b0 },
              ].map((line, idx) => (
                <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 mb-0.5">{line.name}</div>
                  <div className={`text-base font-bold ${line.bit === 1 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {line.bit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SVG 7-Segment LED Display */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="text-slate-400 text-xs font-mono mb-4">
            Digit: <span className="text-rose-500 font-bold text-lg">{isInvalidBcd ? 'ERROR' : bcdInput}</span>
          </div>

          <svg viewBox="0 0 160 220" className="w-40 h-56 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            {/* Segment a */}
            <polygon
              points="38,20 122,20 110,32 50,32"
              fill={getSegColor(activeSegments.a)}
              filter={activeSegments.a ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment b */}
            <polygon
              points="124,24 136,36 136,104 124,108 114,98 114,34"
              fill={getSegColor(activeSegments.b)}
              filter={activeSegments.b ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment c */}
            <polygon
              points="124,112 136,116 136,184 124,196 114,186 114,122"
              fill={getSegColor(activeSegments.c)}
              filter={activeSegments.c ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment d */}
            <polygon
              points="38,200 122,200 110,188 50,188"
              fill={getSegColor(activeSegments.d)}
              filter={activeSegments.d ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment e */}
            <polygon
              points="36,112 46,122 46,186 36,196 24,184 24,116"
              fill={getSegColor(activeSegments.e)}
              filter={activeSegments.e ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment f */}
            <polygon
              points="36,24 46,34 46,98 36,108 24,104 24,36"
              fill={getSegColor(activeSegments.f)}
              filter={activeSegments.f ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Segment g */}
            <polygon
              points="40,110 50,104 110,104 120,110 110,116 50,116"
              fill={getSegColor(activeSegments.g)}
              filter={activeSegments.g ? 'drop-shadow(0px 0px 4px #ef4444)' : 'none'}
            />
            {/* Decimal Point dp */}
            <circle cx="146" cy="195" r="6" fill="#1e293b" />
          </svg>

          {/* Segment status labels */}
          <div className="flex gap-2 text-xs font-mono mt-4 text-slate-400">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(s => {
              const isActive = (activeSegments as any)[s] === 1;
              return (
                <span
                  key={s}
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'text-slate-600'
                  }`}
                >
                  {s}:{isActive ? '1' : '0'}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
