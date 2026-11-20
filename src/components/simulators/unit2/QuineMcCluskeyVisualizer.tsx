import React, { useState } from 'react';
import { Table, ArrowRight, CheckCircle2, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

interface Term {
  minterms: number[];
  binary: string;
  combined: boolean;
}

export const QuineMcCluskeyVisualizer: React.FC = () => {
  const [mintermInput, setMintermInput] = useState<string>('0, 2, 8, 10, 14, 15');
  const [dontCareInput, setDontCareInput] = useState<string>('5, 7');
  const [numVars, setNumVars] = useState<number>(4);

  // Parse input
  const parseList = (str: string) => {
    return str
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n < Math.pow(2, numVars));
  };

  const minterms = Array.from(new Set(parseList(mintermInput))).sort((a, b) => a - b);
  const dontCares = Array.from(new Set(parseList(dontCareInput))).sort((a, b) => a - b);
  const allTerms = Array.from(new Set([...minterms, ...dontCares])).sort((a, b) => a - b);

  // Convert number to binary string of length numVars
  const toBin = (n: number) => n.toString(2).padStart(numVars, '0');
  const countOnes = (bin: string) => bin.split('').filter(c => c === '1').length;

  // Grouping Stage 1: Group by count of 1s
  const groupsStage1: Record<number, Term[]> = {};
  allTerms.forEach(m => {
    const bin = toBin(m);
    const ones = countOnes(bin);
    if (!groupsStage1[ones]) groupsStage1[ones] = [];
    groupsStage1[ones].push({ minterms: [m], binary: bin, combined: false });
  });

  // Stage 2: Pair terms differing by 1 bit
  const canCombine = (bin1: string, bin2: string): string | null => {
    let diffCount = 0;
    let result = '';
    for (let i = 0; i < bin1.length; i++) {
      if (bin1[i] !== bin2[i]) {
        diffCount++;
        result += '-';
      } else {
        result += bin1[i];
      }
    }
    return diffCount === 1 ? result : null;
  };

  // Perform combinations
  const combineGroups = (currentGroups: Record<number, Term[]>) => {
    const nextGroups: Record<number, Term[]> = {};
    const primeImplicants: Term[] = [];
    const keys = Object.keys(currentGroups).map(Number).sort((a, b) => a - b);

    keys.forEach(k => {
      const g1 = currentGroups[k] || [];
      const g2 = currentGroups[k + 1] || [];

      g1.forEach(t1 => {
        g2.forEach(t2 => {
          const combinedBin = canCombine(t1.binary, t2.binary);
          if (combinedBin) {
            t1.combined = true;
            t2.combined = true;
            const combinedMinterms = Array.from(new Set([...t1.minterms, ...t2.minterms])).sort((a, b) => a - b);
            const ones = countOnes(combinedBin.replace(/-/g, ''));
            if (!nextGroups[ones]) nextGroups[ones] = [];
            // Avoid duplicate binary terms
            if (!nextGroups[ones].some(item => item.binary === combinedBin)) {
              nextGroups[ones].push({ minterms: combinedMinterms, binary: combinedBin, combined: false });
            }
          }
        });
      });
    });

    // Any term not combined is a prime implicant
    Object.values(currentGroups).forEach(group => {
      group.forEach(t => {
        if (!t.combined && !primeImplicants.some(pi => pi.binary === t.binary)) {
          primeImplicants.push(t);
        }
      });
    });

    return { nextGroups, primeImplicants };
  };

  const stage1Result = combineGroups(groupsStage1);
  const stage2Result = combineGroups(stage1Result.nextGroups);

  // Combine all prime implicants
  const allPrimeImplicants = [
    ...stage1Result.primeImplicants,
    ...stage2Result.primeImplicants,
    ...Object.values(stage2Result.nextGroups).flat()
  ].filter((t, idx, self) => idx === self.findIndex(o => o.binary === t.binary));

  // Binary to algebraic term (e.g. "0-10" -> "A̅CD̅")
  const varNames = ['A', 'B', 'C', 'D', 'E', 'F'];
  const binaryToAlgebra = (bin: string) => {
    let expr = '';
    for (let i = 0; i < bin.length; i++) {
      if (bin[i] === '1') expr += varNames[i];
      else if (bin[i] === '0') expr += varNames[i] + '̅';
    }
    return expr || '1';
  };

  // Find Essential Prime Implicants (EPIs): covers at least one minterm exclusively
  const essentialPis: Term[] = [];
  minterms.forEach(m => {
    const coveringPis = allPrimeImplicants.filter(pi => pi.minterms.includes(m));
    if (coveringPis.length === 1) {
      if (!essentialPis.some(epi => epi.binary === coveringPis[0].binary)) {
        essentialPis.push(coveringPis[0]);
      }
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-500" />
            Interactive Quine-McCluskey (Tabular) Minimizer & Prime Implicant Table
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Algorithmic method for Boolean minimization used when variable count exceeds K-map capacity. Standard DTU 10-mark exam question!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setMintermInput('0, 2, 8, 10, 14, 15');
              setDontCareInput('5, 7');
              setNumVars(4);
            }}
            className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            Load DTU Exam Preset
          </button>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Minterms Σm (Comma-separated)
          </label>
          <input
            type="text"
            value={mintermInput}
            onChange={e => setMintermInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold outline-none"
            placeholder="0, 2, 8, 10, 14, 15"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Don't Cares d (Optional)
          </label>
          <input
            type="text"
            value={dontCareInput}
            onChange={e => setDontCareInput(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold outline-none"
            placeholder="5, 7"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Variable Count (n)
          </label>
          <select
            value={numVars}
            onChange={e => setNumVars(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium outline-none"
          >
            <option value={3}>3 Variables (A, B, C)</option>
            <option value={4}>4 Variables (A, B, C, D)</option>
            <option value={5}>5 Variables (A, B, C, D, E)</option>
          </select>
        </div>
      </div>

      {/* Step 1 & 2 Tabular Groupings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs font-mono">
        {/* Table 1: Initial Grouping */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans flex items-center justify-between">
            <span>Step 1: Group by Number of 1s</span>
            <span className="text-[10px] text-slate-400">Column 1</span>
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1">Group</th>
                  <th className="py-1">Minterm</th>
                  <th className="py-1">Binary</th>
                  <th className="py-1">Merged?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Object.keys(groupsStage1).map(Number).sort((a, b) => a - b).map(k => (
                  <React.Fragment key={k}>
                    {groupsStage1[k].map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                        {idx === 0 && (
                          <td rowSpan={groupsStage1[k].length} className="py-1 font-bold text-blue-600 align-top">
                            {k}
                          </td>
                        )}
                        <td className="py-1">m{t.minterms[0]}</td>
                        <td className="py-1 text-slate-700 dark:text-slate-300 font-bold">{t.binary}</td>
                        <td className="py-1">
                          {t.combined ? (
                            <span className="text-emerald-600 font-bold">✓ (Pair)</span>
                          ) : (
                            <span className="text-amber-500 font-bold">★ (PI)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Combined Pairs / Quads */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans flex items-center justify-between">
            <span>Step 2: Combined Implicants</span>
            <span className="text-[10px] text-slate-400">Column 2 / 3</span>
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1">Minterms</th>
                  <th className="py-1">Binary</th>
                  <th className="py-1">Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allPrimeImplicants.map((pi, idx) => (
                  <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    <td className="py-1.5 text-blue-600">m({pi.minterms.join(',')})</td>
                    <td className="py-1.5 font-bold text-slate-800 dark:text-slate-200">{pi.binary}</td>
                    <td className="py-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {binaryToAlgebra(pi.binary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Step 3: Prime Implicant Coverage Table */}
      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
          <span>Step 3: Prime Implicant Coverage Table (Finding Essential Prime Implicants)</span>
          <span className="text-[10px] text-amber-600 font-mono">★ = Essential Prime Implicant (EPI)</span>
        </h5>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                <th className="py-1.5 px-2 text-left font-sans">Prime Implicant</th>
                <th className="py-1.5 px-2 text-left font-sans">Term</th>
                {minterms.map(m => (
                  <th key={m} className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800">
                    m{m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allPrimeImplicants.map((pi, idx) => {
                const isEpi = essentialPis.some(epi => epi.binary === pi.binary);
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isEpi ? 'bg-amber-50/60 dark:bg-amber-950/20 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <td className="py-2 px-2 text-left text-slate-700 dark:text-slate-300">
                      {isEpi && <span className="text-amber-500 mr-1">★</span>}
                      m({pi.minterms.join(',')})
                    </td>
                    <td className="py-2 px-2 text-left text-blue-600 dark:text-blue-400">
                      {binaryToAlgebra(pi.binary)}
                    </td>
                    {minterms.map(m => {
                      const covers = pi.minterms.includes(m);
                      return (
                        <td key={m} className="py-2 px-2">
                          {covers ? (
                            <span className="inline-block w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold leading-5">
                              X
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minimized Result Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Final Minimized Boolean Expression (Minimal SOP)
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              F = {allPrimeImplicants.map(pi => binaryToAlgebra(pi.binary)).join(' + ') || '0'}
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {essentialPis.length} Essential Prime Implicants Found
          </div>
        </div>
      </div>
    </div>
  );
};
