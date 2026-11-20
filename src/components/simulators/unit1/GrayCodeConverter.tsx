import React, { useState } from 'react';
import { GitCompare, ArrowRight, RotateCw, Check } from 'lucide-react';

export const GrayCodeConverter: React.FC = () => {
  const [decimalVal, setDecimalVal] = useState<number>(9);

  const binBits = decimalVal.toString(2).padStart(4, '0').split('').map(Number);

  // Binary to Gray conversion: G3 = B3, G2 = B3 ^ B2, G1 = B2 ^ B1, G0 = B1 ^ B0
  const grayBits = [
    binBits[0],
    binBits[0] ^ binBits[1],
    binBits[1] ^ binBits[2],
    binBits[2] ^ binBits[3],
  ];

  // Consecutive comparison table (0 to 15) to demonstrate single-bit transition property
  const allCodes = Array.from({ length: 16 }, (_, i) => {
    const b = i.toString(2).padStart(4, '0').split('').map(Number);
    const g = [b[0], b[0] ^ b[1], b[1] ^ b[2], b[2] ^ b[3]].join('');
    return { dec: i, bin: b.join(''), gray: g };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-emerald-500" />
            Gray Code (Reflected Binary) & XOR Ladder Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unit-distance code where only a single bit changes between adjacent values, preventing mechanical encoder glitches.
          </p>
        </div>
      </div>

      {/* Interactive slider / selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
          <span>Selected Value: Decimal {decimalVal}</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">
            Binary: {binBits.join('')} ➔ Gray: {grayBits.join('')}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={15}
          value={decimalVal}
          onChange={e => setDecimalVal(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0 (0000)</span>
          <span>4 (0100)</span>
          <span>8 (1000)</span>
          <span>12 (1100)</span>
          <span>15 (1111)</span>
        </div>
      </div>

      {/* XOR Hardware Conversion Circuit Visualization */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
        <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
          <span>Hardware XOR Gate Circuit (Binary ➔ Gray Conversion):</span>
        </h5>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          {/* Bit 3 (MSB) */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block mb-1">MSB Direct</span>
            <div className="text-xs text-slate-500 mb-1">B3 = {binBits[0]}</div>
            <div className="w-8 h-8 mx-auto rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-300 dark:border-emerald-700">
              {grayBits[0]}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">G3 = B3</span>
          </div>

          {/* Bit 2 */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block mb-1">XOR Gate 1</span>
            <div className="text-xs text-slate-500 mb-1">{binBits[0]} ⊕ {binBits[1]}</div>
            <div className="w-8 h-8 mx-auto rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-300 dark:border-emerald-700">
              {grayBits[1]}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">G2 = B3 ⊕ B2</span>
          </div>

          {/* Bit 1 */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block mb-1">XOR Gate 2</span>
            <div className="text-xs text-slate-500 mb-1">{binBits[1]} ⊕ {binBits[2]}</div>
            <div className="w-8 h-8 mx-auto rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-300 dark:border-emerald-700">
              {grayBits[2]}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">G1 = B2 ⊕ B1</span>
          </div>

          {/* Bit 0 */}
          <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block mb-1">XOR Gate 3</span>
            <div className="text-xs text-slate-500 mb-1">{binBits[2]} ⊕ {binBits[3]}</div>
            <div className="w-8 h-8 mx-auto rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm border border-emerald-300 dark:border-emerald-700">
              {grayBits[3]}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">G0 = B1 ⊕ B0</span>
          </div>
        </div>
      </div>

      {/* Unit-Distance Adjacency Demonstration Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="py-1.5 px-2">Decimal</th>
              <th className="py-1.5 px-2">Natural Binary</th>
              <th className="py-1.5 px-2">Gray Code</th>
              <th className="py-1.5 px-2">Bits Changing from Prev</th>
            </tr>
          </thead>
          <tbody>
            {allCodes.slice(0, 8).map((row, idx) => {
              const isSelected = row.dec === decimalVal;
              return (
                <tr
                  key={idx}
                  onClick={() => setDecimalVal(row.dec)}
                  className={`cursor-pointer border-b border-slate-100 dark:border-slate-800 transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <td className="py-1.5 px-2">{row.dec}</td>
                  <td className="py-1.5 px-2">{row.bin}</td>
                  <td className="py-1.5 px-2 text-emerald-600 dark:text-emerald-400">{row.gray}</td>
                  <td className="py-1.5 px-2 text-slate-400">
                    {idx === 0 ? 'Initial' : 'Exactly 1 bit (Hamming distance = 1)'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
