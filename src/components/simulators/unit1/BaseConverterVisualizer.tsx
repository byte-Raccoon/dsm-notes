import React, { useState } from 'react';
import { RefreshCw, CheckCircle, ArrowRight, Info } from 'lucide-react';

export const BaseConverterVisualizer: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('42.625');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);

  // Conversion logic with detailed step tracking
  const parseNumber = (val: string, base: number) => {
    const parts = val.trim().split('.');
    const intPart = parts[0] || '0';
    const fracPart = parts[1] || '';

    // Convert integer part to decimal
    let decInt = 0;
    try {
      decInt = parseInt(intPart, base);
      if (isNaN(decInt)) decInt = 0;
    } catch {
      decInt = 0;
    }

    // Convert fractional part to decimal
    let decFrac = 0;
    for (let i = 0; i < fracPart.length; i++) {
      const digitVal = parseInt(fracPart[i], base);
      if (!isNaN(digitVal)) {
        decFrac += digitVal / Math.pow(base, i + 1);
      }
    }

    return { decInt, decFrac, fullDec: decInt + decFrac };
  };

  const { decInt, decFrac, fullDec } = parseNumber(inputValue, fromBase);

  // Generate integer division steps (converting decimal integer to target base)
  const getIntDivisionSteps = (n: number, base: number) => {
    if (n === 0) return [{ dividend: 0, quotient: 0, remainder: 0, symbol: '0' }];
    const steps = [];
    let curr = n;
    const digits = '0123456789ABCDEF';
    while (curr > 0) {
      const nextQuotient = Math.floor(curr / base);
      const rem = curr % base;
      steps.push({
        dividend: curr,
        quotient: nextQuotient,
        remainder: rem,
        symbol: digits[rem]
      });
      curr = nextQuotient;
    }
    return steps;
  };

  // Generate fractional multiplication steps (converting decimal fraction to target base)
  const getFracMultiplicationSteps = (frac: number, base: number, maxSteps = 5) => {
    if (frac === 0) return [];
    const steps = [];
    let curr = frac;
    const digits = '0123456789ABCDEF';
    for (let i = 0; i < maxSteps && curr > 0.000001; i++) {
      const product = curr * base;
      const intDigit = Math.floor(product);
      const nextFrac = product - intDigit;
      steps.push({
        multiplicand: curr.toFixed(4),
        product: product.toFixed(4),
        integerPart: intDigit,
        symbol: digits[intDigit],
        remainingFraction: nextFrac.toFixed(4)
      });
      curr = nextFrac;
    }
    return steps;
  };

  const intSteps = getIntDivisionSteps(decInt, toBase);
  const fracSteps = getFracMultiplicationSteps(decFrac, toBase);

  // Final converted strings
  const targetIntStr = intSteps.map(s => s.symbol).reverse().join('') || '0';
  const targetFracStr = fracSteps.length > 0 ? '.' + fracSteps.map(s => s.symbol).join('') : '';
  const finalConverted = `${targetIntStr}${targetFracStr}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            Interactive Base Conversion & Step Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See the exact division and multiplication algorithm used in DTU exam questions.
          </p>
        </div>
      </div>

      {/* Control row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Input Number
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 42.625"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            From Radix (Base)
          </label>
          <select
            value={fromBase}
            onChange={e => setFromBase(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={2}>Base 2 (Binary)</option>
            <option value={8}>Base 8 (Octal)</option>
            <option value={10}>Base 10 (Decimal)</option>
            <option value={16}>Base 16 (Hexadecimal)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            To Radix (Base)
          </label>
          <select
            value={toBase}
            onChange={e => setToBase(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={2}>Base 2 (Binary)</option>
            <option value={8}>Base 8 (Octal)</option>
            <option value={10}>Base 10 (Decimal)</option>
            <option value={16}>Base 16 (Hexadecimal)</option>
          </select>
        </div>
      </div>

      {/* Result Display Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Conversion Result
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-base text-slate-700 dark:text-slate-300">
              ({inputValue})_{fromBase}
            </span>
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span className="font-mono text-xl font-bold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800 shadow-sm">
              ({finalConverted})_{toBase}
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Intermediate Decimal Value: {fullDec}
        </div>
      </div>

      {/* Step by step breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Integer Part: Successive Division */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
            <span>Integer Part ({decInt}) → Successive Division by {toBase}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">Read Bottom-Up ↑</span>
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1">Division</th>
                  <th className="py-1">Quotient</th>
                  <th className="py-1">Remainder</th>
                  <th className="py-1">Digit</th>
                </tr>
              </thead>
              <tbody>
                {intSteps.map((step, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
                    <td className="py-1.5">{step.dividend} ÷ {toBase}</td>
                    <td className="py-1.5 font-bold text-slate-700 dark:text-slate-300">{step.quotient}</td>
                    <td className="py-1.5 text-blue-600 dark:text-blue-400">{step.remainder}</td>
                    <td className="py-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 rounded">
                      {step.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-slate-500 text-[11px] leading-relaxed">
            Digits collected in reverse (LSB at top, MSB at bottom): <strong className="font-mono text-slate-800 dark:text-slate-200">{targetIntStr}</strong>
          </p>
        </div>

        {/* Fractional Part: Successive Multiplication */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h5 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
            <span>Fractional Part ({decFrac.toFixed(4)}) → Successive Multiplication by {toBase}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">Read Top-Down ↓</span>
          </h5>
          {fracSteps.length === 0 ? (
            <p className="text-slate-400 italic py-4">No fractional component present.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="py-1">Multiplication</th>
                    <th className="py-1">Product</th>
                    <th className="py-1">Integer Part</th>
                    <th className="py-1">Next Frac</th>
                  </tr>
                </thead>
                <tbody>
                  {fracSteps.map((step, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20">
                      <td className="py-1.5">{step.multiplicand} × {toBase}</td>
                      <td className="py-1.5 font-bold text-slate-700 dark:text-slate-300">{step.product}</td>
                      <td className="py-1.5 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 rounded">
                        {step.symbol}
                      </td>
                      <td className="py-1.5 text-slate-500">{step.remainingFraction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-slate-500 text-[11px] leading-relaxed">
                Digits collected top-down (first digit immediately after radix point): <strong className="font-mono text-slate-800 dark:text-slate-200">{targetFracStr}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
