import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BinaryArithmeticCalculator: React.FC = () => {
  const [op, setOp] = useState<'add' | 'sub' | 'mul'>('add');
  const [valA, setValA] = useState<number>(27);
  const [valB, setValB] = useState<number>(14);

  const binA = valA.toString(2).padStart(8, '0');
  const binB = valB.toString(2).padStart(8, '0');

  // Addition logic with bitwise carries
  const calculateAddition = (a: string, b: string) => {
    const carries = new Array(9).fill(0);
    const sumBits = new Array(8).fill(0);

    for (let i = 7; i >= 0; i--) {
      const bitA = parseInt(a[i], 10);
      const bitB = parseInt(b[i], 10);
      const cIn = carries[i + 1];
      const sum = bitA ^ bitB ^ cIn;
      const cOut = (bitA & bitB) | (bitA & cIn) | (bitB & cIn);
      sumBits[i] = sum;
      carries[i] = cOut;
    }
    return { carries, sumBits, resultStr: sumBits.join(''), finalCarry: carries[0] };
  };

  const addResult = calculateAddition(binA, binB);

  // Subtraction using 2's complement: A - B = A + (~B + 1)
  const bTwosComp = ((~valB + 1) >>> 0) & 0xff;
  const binBTwosComp = bTwosComp.toString(2).padStart(8, '0');
  const subResult = calculateAddition(binA, binBTwosComp);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-500" />
            Hardware Binary Arithmetic & Carry Propagation Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See the exact bitwise carry generation, sum bits, and 2's complement subtraction hardware logic.
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setOp('add')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg ${
              op === 'add'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Addition (+)
          </button>
          <button
            onClick={() => setOp('sub')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg ${
              op === 'sub'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Subtraction (-) [2's Comp]
          </button>
        </div>
      </div>

      {/* Input Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Operand A (Decimal: 0 to 127)
          </label>
          <input
            type="number"
            min={0}
            max={127}
            value={valA}
            onChange={e => setValA(Math.max(0, Math.min(127, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Operand B (Decimal: 0 to 127)
          </label>
          <input
            type="number"
            min={0}
            max={127}
            value={valB}
            onChange={e => setValB(Math.max(0, Math.min(127, Number(e.target.value))))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold outline-none"
          />
        </div>
      </div>

      {/* Visual Alignment Board */}
      <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto font-mono text-sm">
        {op === 'add' ? (
          <div>
            {/* Carry Row */}
            <div className="flex justify-end gap-2 text-amber-500 font-bold mb-1 pr-6">
              <span className="text-xs text-slate-400 font-normal self-center mr-auto">Carry Bits:</span>
              {addResult.carries.slice(0, 8).map((c, idx) => (
                <span
                  key={idx}
                  className={`w-6 text-center text-xs py-0.5 rounded ${
                    c === 1 ? 'bg-amber-100 dark:bg-amber-950/60 font-bold' : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Operand A */}
            <div className="flex justify-end gap-2 items-center py-1">
              <span className="text-xs text-slate-400 font-normal mr-auto">A ({valA}):</span>
              {binA.split('').map((b, idx) => (
                <span key={idx} className="w-6 text-center font-bold text-slate-800 dark:text-slate-200">
                  {b}
                </span>
              ))}
            </div>

            {/* Operand B */}
            <div className="flex justify-end gap-2 items-center py-1 border-b-2 border-slate-400 dark:border-slate-600">
              <span className="text-xs text-slate-400 font-normal mr-auto">+ B ({valB}):</span>
              {binB.split('').map((b, idx) => (
                <span key={idx} className="w-6 text-center font-bold text-slate-800 dark:text-slate-200">
                  {b}
                </span>
              ))}
            </div>

            {/* Result Sum */}
            <div className="flex justify-end gap-2 items-center py-2 text-blue-600 dark:text-blue-400 text-base font-bold">
              <span className="text-xs text-slate-500 font-normal mr-auto">
                Sum ({valA + valB}):
              </span>
              {addResult.sumBits.map((b, idx) => (
                <span key={idx} className="w-6 text-center bg-blue-100 dark:bg-blue-950/50 rounded py-0.5">
                  {b}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs text-slate-500 mb-3 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <strong>Hardware Subtraction Rule:</strong> A - B is computed by adding A to the 2's complement of B:
              <br />
              <span className="text-emerald-600 font-bold">2's Comp of B ({valB}) = ({binBTwosComp})₂</span>
            </div>

            {/* Operand A */}
            <div className="flex justify-end gap-2 items-center py-1">
              <span className="text-xs text-slate-400 font-normal mr-auto">A ({valA}):</span>
              {binA.split('').map((b, idx) => (
                <span key={idx} className="w-6 text-center font-bold text-slate-800 dark:text-slate-200">
                  {b}
                </span>
              ))}
            </div>

            {/* 2's complement of B */}
            <div className="flex justify-end gap-2 items-center py-1 border-b-2 border-slate-400 dark:border-slate-600">
              <span className="text-xs text-emerald-600 font-normal mr-auto">+ (-B 2's comp):</span>
              {binBTwosComp.split('').map((b, idx) => (
                <span key={idx} className="w-6 text-center font-bold text-emerald-600 dark:text-emerald-400">
                  {b}
                </span>
              ))}
            </div>

            {/* Result */}
            <div className="flex justify-end gap-2 items-center py-2 text-emerald-600 dark:text-emerald-400 text-base font-bold">
              <span className="text-xs text-slate-500 font-normal mr-auto">
                Difference ({valA - valB}):
              </span>
              {subResult.sumBits.map((b, idx) => (
                <span key={idx} className="w-6 text-center bg-emerald-100 dark:bg-emerald-950/50 rounded py-0.5">
                  {b}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              End-around carry {subResult.finalCarry === 1 ? 'is generated and discarded (indicating positive result)' : 'is 0 (indicating negative result in 2s comp format)'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
