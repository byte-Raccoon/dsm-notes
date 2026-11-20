import React, { useState } from 'react';
import { Layers, ArrowDown, HelpCircle, Check, AlertTriangle } from 'lucide-react';

export const TwosComplementVisualizer: React.FC = () => {
  const [numBits, setNumBits] = useState<number>(8);
  const [inputValue, setInputValue] = useState<number>(-29);

  const minVal = -Math.pow(2, numBits - 1);
  const maxVal = Math.pow(2, numBits - 1) - 1;

  // Clamp input or check validity
  const isOutOfRange = inputValue < minVal || inputValue > maxVal;

  // Compute 2's complement representation
  const getTwosComplementBits = (val: number, bits: number): string[] => {
    if (val >= 0) {
      return val.toString(2).padStart(bits, '0').split('');
    } else {
      // 2's complement of -x is 2^bits + val
      const positiveEquivalent = Math.pow(2, bits) + val;
      return positiveEquivalent.toString(2).padStart(bits, '0').split('');
    }
  };

  const currentBits = getTwosComplementBits(inputValue, numBits);
  const absValue = Math.abs(inputValue);
  const magnitudeBits = absValue.toString(2).padStart(numBits, '0').split('');
  const onesCompBits = magnitudeBits.map(b => (b === '0' ? '1' : '0'));

  // Shortcut method: scan from right to left, keep first '1', invert the rest
  let firstOneFound = false;
  const shortcutAnnotations = [...magnitudeBits].reverse().map(b => {
    if (!firstOneFound) {
      if (b === '1') {
        firstOneFound = true;
        return { bit: b, label: 'First 1: Keep' };
      }
      return { bit: b, label: 'Trailing 0: Keep' };
    }
    return { bit: b === '0' ? '1' : '0', label: 'Inverted' };
  }).reverse();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            2's Complement Transformation & Arithmetic Range Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Understand how modern computer hardware represents negative numbers and eliminates the negative zero.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Bit Width:</span>
          {[4, 8, 16].map(b => (
            <button
              key={b}
              onClick={() => {
                setNumBits(b);
                if (inputValue < -Math.pow(2, b - 1)) setInputValue(-Math.pow(2, b - 1));
                if (inputValue > Math.pow(2, b - 1) - 1) setInputValue(Math.pow(2, b - 1) - 1);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                numBits === b
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {b}-bit
            </button>
          ))}
        </div>
      </div>

      {/* Input control and range alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Decimal Value (Range: {minVal} to {maxVal})
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              min={minVal}
              max={maxVal}
              onChange={e => setInputValue(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setInputValue(prev => Math.max(minVal, prev - 1))}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold hover:bg-slate-200"
              >
                -1
              </button>
              <button
                onClick={() => setInputValue(prev => Math.min(maxVal, prev + 1))}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold hover:bg-slate-200"
              >
                +1
              </button>
              <button
                onClick={() => setInputValue(-inputValue)}
                className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 rounded text-xs font-bold hover:bg-emerald-100"
              >
                ± Invert Sign
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Sign Bit (MSB):</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              currentBits[0] === '1'
                ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
            }`}>
              Bit [{numBits - 1}] = {currentBits[0]} ({currentBits[0] === '1' ? 'Negative' : 'Positive'})
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Weight of MSB in {numBits}-bit 2's Complement is <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">-{Math.pow(2, numBits - 1)}</span>
          </div>
        </div>
      </div>

      {/* 3-Stage Visual Pipeline */}
      {inputValue < 0 ? (
        <div className="space-y-4 mb-6">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>3-Step Hardware Derivation for {inputValue}:</span>
          </div>

          {/* Step 1: Magnitude in Binary */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              <span>Step 1: Write True Magnitude of |{inputValue}| = {absValue}</span>
              <span className="font-mono text-slate-400">{numBits} bits</span>
            </div>
            <div className="flex justify-center gap-1.5 overflow-x-auto py-1">
              {magnitudeBits.map((b, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono font-bold text-sm">
                    {b}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-mono">2^{numBits - 1 - idx}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce" />
          </div>

          {/* Step 2: 1's Complement */}
          <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/40">
            <div className="flex items-center justify-between text-xs font-medium text-amber-800 dark:text-amber-400 mb-2">
              <span>Step 2: 1's Complement (Bitwise NOT / Invert all bits)</span>
              <span className="text-[11px] font-mono text-amber-600">NOT(b)</span>
            </div>
            <div className="flex justify-center gap-1.5 overflow-x-auto py-1">
              {onesCompBits.map((b, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center font-mono font-bold text-sm text-amber-900 dark:text-amber-200">
                    {b}
                  </div>
                  <span className="text-[10px] text-amber-500 mt-0.5 font-mono">~{magnitudeBits[idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce" />
          </div>

          {/* Step 3: Add 1 */}
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-lg border border-emerald-300 dark:border-emerald-800/60">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-800 dark:text-emerald-400 mb-2">
              <span>Step 3: Add 1 to LSB to form 2's Complement</span>
              <span className="text-[11px] font-mono text-emerald-600 font-bold">+ 1</span>
            </div>
            <div className="flex justify-center gap-1.5 overflow-x-auto py-1">
              {currentBits.map((b, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm shadow-sm ${
                    idx === 0
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    {b}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {idx === 0 ? 'MSB (Sign)' : idx === numBits - 1 ? 'LSB' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg mb-6">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
            Positive Number Representation
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
            For positive numbers ({inputValue} ≥ 0), the 2's complement representation is identical to its normal binary representation with MSB = 0:
          </p>
          <div className="flex justify-center gap-1.5 overflow-x-auto py-1">
            {currentBits.map((b, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  {b}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {idx === 0 ? 'Sign=0' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DTU Exam Fast Shortcut */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800 dark:text-slate-200">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span>DTU Examination Speed Trick: Right-to-Left Inspection Rule</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
          Start scanning the original binary number from the Least Significant Bit (rightmost) moving left:
          Copy all 0s and the very first 1 unchanged. After that first 1, invert every remaining bit to its left!
        </p>
        <div className="flex justify-center gap-1 overflow-x-auto py-2">
          {shortcutAnnotations.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-1">
              <span className="w-7 h-7 rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                {item.bit}
              </span>
              <span className="text-[9px] text-slate-500 mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
