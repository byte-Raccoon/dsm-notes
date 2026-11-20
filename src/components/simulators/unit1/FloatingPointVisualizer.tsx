import React, { useState } from 'react';
import { Cpu, RotateCcw, Zap, Info } from 'lucide-react';

export const FloatingPointVisualizer: React.FC = () => {
  const [decimalInput, setDecimalInput] = useState<string>('-13.625');

  // Convert float to IEEE 754 32-bit binary representation using JavaScript DataView
  const floatToBinary = (val: number): string => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, val);
    let binary = '';
    for (let i = 0; i < 4; i++) {
      binary += view.getUint8(i).toString(2).padStart(8, '0');
    }
    return binary;
  };

  const binaryToFloat = (binStr: string): number => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    let uintVal = 0;
    for (let i = 0; i < 32; i++) {
      if (binStr[i] === '1') {
        uintVal |= (1 << (31 - i));
      }
    }
    view.setUint32(0, uintVal >>> 0);
    return view.getFloat32(0);
  };

  const numVal = parseFloat(decimalInput) || 0;
  const bitString = floatToBinary(numVal);

  const signBit = bitString[0];
  const exponentBits = bitString.slice(1, 9);
  const mantissaBits = bitString.slice(9, 32);

  const biasedExp = parseInt(exponentBits, 2);
  const actualExp = biasedExp - 127;

  // Calculate fractional value from mantissa bits
  let mantissaFraction = 0;
  for (let i = 0; i < mantissaBits.length; i++) {
    if (mantissaBits[i] === '1') {
      mantissaFraction += 1 / Math.pow(2, i + 1);
    }
  }

  // Classification
  let classification = 'Normalized Number';
  if (biasedExp === 255) {
    classification = mantissaFraction === 0 ? 'Infinity (±∞)' : 'Not a Number (NaN)';
  } else if (biasedExp === 0) {
    classification = mantissaFraction === 0 ? 'Zero (±0.0)' : 'Subnormal / Denormalized Number';
  }

  const presets = [
    { label: '-13.625 (Classic Exam)', val: '-13.625' },
    { label: '+0.15625 (Fraction)', val: '0.15625' },
    { label: '+1.0 (Unit)', val: '1.0' },
    { label: '-0.0 (Signed Zero)', val: '-0.0' },
    { label: '3.14159 (Pi)', val: '3.14159' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            IEEE 754 Single-Precision 32-Bit Floating-Point Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            1 Sign bit + 8 Biased Exponent bits (Bias = 127) + 23 Mantissa/Fraction bits.
          </p>
        </div>
      </div>

      {/* Input controls & presets */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
          Decimal Floating-Point Number
        </label>
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <input
            type="text"
            value={decimalInput}
            onChange={e => setDecimalInput(e.target.value)}
            className="w-48 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="-13.625"
          />
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => setDecimalInput(p.val)}
                className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 32-Bit Binary Stream Visualizer with color coding */}
      <div className="mb-6 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Bit 31 (MSB)</span>
          <span>Single-Precision 32-bit Memory Register</span>
          <span>Bit 0 (LSB)</span>
        </div>

        {/* The Bit Boxes */}
        <div className="flex flex-wrap gap-1 justify-center py-2 font-mono">
          {/* Sign Bit */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-red-500 font-bold mb-1">S (1)</span>
            <div className="w-8 h-8 rounded bg-red-500 text-white font-bold flex items-center justify-center text-sm shadow">
              {signBit}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">b31</span>
          </div>

          <div className="w-1.5" />

          {/* Exponent (8 bits) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-amber-500 font-bold mb-1">Exponent (8 bits)</span>
            <div className="flex gap-0.5">
              {exponentBits.split('').map((b, idx) => (
                <div
                  key={idx}
                  className="w-7 h-8 rounded bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-sm"
                >
                  {b}
                </div>
              ))}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">b30...b23</span>
          </div>

          <div className="w-1.5" />

          {/* Mantissa (23 bits - grouped in blocks for readability) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-blue-500 font-bold mb-1">Mantissa / Fraction (23 bits)</span>
            <div className="flex gap-0.5 max-w-full overflow-x-auto pb-1">
              {mantissaBits.split('').map((b, idx) => (
                <div
                  key={idx}
                  className={`w-5 h-8 rounded text-white font-mono text-[11px] flex items-center justify-center ${
                    b === '1' ? 'bg-blue-600 font-bold' : 'bg-blue-400/80'
                  }`}
                >
                  {b}
                </div>
              ))}
            </div>
            <span className="text-[9px] text-slate-400 mt-1">b22...b0</span>
          </div>
        </div>

        <div className="flex justify-between text-xs mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-500">
          <span className="text-red-500 font-semibold">■ Sign (1 bit): {signBit === '1' ? 'Negative (-)' : 'Positive (+)'}</span>
          <span className="text-amber-500 font-semibold">■ Biased Exp: {biasedExp} (2^{biasedExp} - 127 = {actualExp})</span>
          <span className="text-blue-500 font-semibold">■ Status: {classification}</span>
        </div>
      </div>

      {/* Step by step mathematical decoding breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 font-sans text-xs">
            1. Value Components Breakdown
          </div>
          <div>
            <span className="text-slate-500">Sign Multiplier: </span>
            <span className="font-bold text-red-600">(-1)^{signBit} = {signBit === '1' ? '-1' : '+1'}</span>
          </div>
          <div>
            <span className="text-slate-500">Stored Exponent (E): </span>
            <span className="font-bold text-amber-600">({exponentBits})₂ = {biasedExp}</span>
          </div>
          <div>
            <span className="text-slate-500">Unbiased True Exponent: </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{biasedExp} - 127 = {actualExp}</span>
          </div>
          <div>
            <span className="text-slate-500">Implicit Leading Bit: </span>
            <span className="font-bold text-blue-600">{biasedExp === 0 ? '0 (Subnormal)' : '1 (Hidden Bit)'}</span>
          </div>
          <div>
            <span className="text-slate-500">Mantissa Fraction Value: </span>
            <span className="font-bold text-blue-600">{mantissaFraction.toFixed(7)}</span>
          </div>
        </div>

        <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900/40 space-y-2">
          <div className="font-bold text-purple-900 dark:text-purple-300 font-sans text-xs flex items-center justify-between">
            <span>2. Reconstruction Formula</span>
            <Zap className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="p-2 bg-white dark:bg-slate-900 rounded border border-purple-100 dark:border-purple-800 text-slate-800 dark:text-slate-200 font-bold">
            Value = (-1)ˢ × (1 + M) × 2^(E - 127)
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            = ({signBit === '1' ? '-1' : '+1'}) × (1 + {mantissaFraction.toFixed(5)}) × 2^{actualExp}
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            = ({signBit === '1' ? '-' : '+'}{(1 + mantissaFraction).toFixed(6)}) × {Math.pow(2, actualExp)}
          </div>
          <div className="pt-1 text-sm font-bold text-purple-700 dark:text-purple-300">
            = {numVal}
          </div>
        </div>
      </div>
    </div>
  );
};
