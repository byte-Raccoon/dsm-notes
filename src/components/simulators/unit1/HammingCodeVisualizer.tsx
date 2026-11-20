import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Wrench, RefreshCw } from 'lucide-react';

export const HammingCodeVisualizer: React.FC = () => {
  // 4 data bits: D3, D5, D6, D7 (default: 1, 0, 1, 1)
  const [dataBits, setDataBits] = useState<{ d3: number; d5: number; d6: number; d7: number }>({
    d3: 1,
    d5: 0,
    d6: 1,
    d7: 1,
  });

  // Calculate Parity bits (Even Parity)
  // P1 checks 1, 3, 5, 7
  const p1 = dataBits.d3 ^ dataBits.d5 ^ dataBits.d7;
  // P2 checks 2, 3, 6, 7
  const p2 = dataBits.d3 ^ dataBits.d6 ^ dataBits.d7;
  // P4 checks 4, 5, 6, 7
  const p4 = dataBits.d5 ^ dataBits.d6 ^ dataBits.d7;

  // The 7-bit transmitted codeword: [P1, P2, D3, P4, D5, D6, D7]
  const transmitted = [p1, p2, dataBits.d3, p4, dataBits.d5, dataBits.d6, dataBits.d7];

  // Error injection state (index 0 to 6, or -1 for no error)
  const [errorIndex, setErrorIndex] = useState<number>(-1);

  // Received bits
  const received = transmitted.map((b, idx) => (idx === errorIndex ? (b ^ 1) : b));

  // Receiver calculates syndrome:
  // S1 = r1 ^ r3 ^ r5 ^ r7
  const s1 = received[0] ^ received[2] ^ received[4] ^ received[6];
  // S2 = r2 ^ r3 ^ r6 ^ r7
  const s2 = received[1] ^ received[2] ^ received[5] ^ received[6];
  // S4 = r4 ^ r5 ^ r6 ^ r7
  const s4 = received[3] ^ received[4] ^ received[5] ^ received[6];

  // Error position determined by syndrome (S4 S2 S1) in decimal
  const syndromeDecimal = (s4 << 2) | (s2 << 1) | s1;

  // Corrected bits
  const corrected = received.map((b, idx) => (idx + 1 === syndromeDecimal ? (b ^ 1) : b));

  const toggleDataBit = (key: 'd3' | 'd5' | 'd6' | 'd7') => {
    setDataBits(prev => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
    setErrorIndex(-1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            Hamming (7, 4) Single-Error Detection & Self-Correction Simulator
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive demonstration of syndrome generation, bit-flipping error, and automated hardware correction.
          </p>
        </div>
        <button
          onClick={() => setErrorIndex(-1)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Errors
        </button>
      </div>

      {/* Step 1: Input 4 Data Bits */}
      <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          <span>1. Transmitter Data Bits (Click bit to toggle):</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">Word = {dataBits.d3}{dataBits.d5}{dataBits.d6}{dataBits.d7}</span>
        </div>
        <div className="flex justify-center gap-4">
          {[
            { label: 'D3', key: 'd3' as const, val: dataBits.d3 },
            { label: 'D5', key: 'd5' as const, val: dataBits.d5 },
            { label: 'D6', key: 'd6' as const, val: dataBits.d6 },
            { label: 'D7', key: 'd7' as const, val: dataBits.d7 },
          ].map(d => (
            <button
              key={d.key}
              onClick={() => toggleDataBit(d.key)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 text-white font-mono font-bold text-lg flex items-center justify-center shadow transition-all">
                {d.val}
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                {d.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Generated Codeword with Parities */}
      <div className="mb-5 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/40">
        <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
          2. Generated 7-Bit Codeword (Even Parity Rule):
        </div>
        <div className="flex justify-center gap-2 overflow-x-auto py-2">
          {[
            { pos: 1, name: 'P1', val: p1, isParity: true, rule: 'D3 ⊕ D5 ⊕ D7' },
            { pos: 2, name: 'P2', val: p2, isParity: true, rule: 'D3 ⊕ D6 ⊕ D7' },
            { pos: 3, name: 'D3', val: dataBits.d3, isParity: false },
            { pos: 4, name: 'P4', val: p4, isParity: true, rule: 'D5 ⊕ D6 ⊕ D7' },
            { pos: 5, name: 'D5', val: dataBits.d5, isParity: false },
            { pos: 6, name: 'D6', val: dataBits.d6, isParity: false },
            { pos: 7, name: 'D7', val: dataBits.d7, isParity: false },
          ].map(cell => (
            <div key={cell.pos} className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-mono mb-0.5">Bit {cell.pos}</span>
              <div
                className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm text-white ${
                  cell.isParity ? 'bg-amber-500 shadow-sm' : 'bg-indigo-600'
                }`}
              >
                {cell.val}
              </div>
              <span className="text-[10px] font-semibold mt-1 text-slate-600 dark:text-slate-300">
                {cell.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Noise Channel / Error Injection */}
      <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span>3. Channel Transmission (Click ANY bit below to inject a 1-bit noise error):</span>
          <span className="text-xs text-rose-500 font-mono">
            {errorIndex >= 0 ? `Noise Injected at Position ${errorIndex + 1}` : 'No Error Injected'}
          </span>
        </div>
        <div className="flex justify-center gap-2 overflow-x-auto py-2">
          {received.map((bit, idx) => {
            const hasError = idx === errorIndex;
            return (
              <button
                key={idx}
                onClick={() => setErrorIndex(errorIndex === idx ? -1 : idx)}
                className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${
                  hasError
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 animate-pulse'
                    : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-sm text-white ${
                    hasError ? 'bg-red-500' : 'bg-slate-700 dark:bg-slate-600'
                  }`}
                >
                  {bit}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  {hasError ? 'CORRUPT' : `Pos ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Receiver Syndrome Analysis & Auto-Correction */}
      <div className={`p-4 rounded-xl border transition-all ${
        syndromeDecimal === 0
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {syndromeDecimal === 0 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
            <span className="font-semibold text-xs text-slate-900 dark:text-white">
              Receiver Syndrome: S = (S4, S2, S1) = ({s4}, {s2}, {s1})₂ = {syndromeDecimal}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            syndromeDecimal === 0
              ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
              : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
          }`}>
            {syndromeDecimal === 0 ? 'Codeword Valid (No Error)' : `Error Detected at Bit Position ${syndromeDecimal}!`}
          </span>
        </div>

        {syndromeDecimal > 0 && (
          <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60 text-xs">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800 dark:text-slate-200">
              <Wrench className="w-4 h-4 text-indigo-500" />
              <span>Automated Hardware Self-Correction:</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">Receiver flips bit at position {syndromeDecimal}:</span>
              <span className="line-through text-red-500">{received[syndromeDecimal - 1]}</span>
              <span className="text-emerald-600 font-bold">→ {corrected[syndromeDecimal - 1]}</span>
            </div>
            <div className="mt-2 text-slate-600 dark:text-slate-400">
              Corrected Transmitted Codeword: <strong className="font-mono text-slate-900 dark:text-slate-100">{corrected.join('')}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
