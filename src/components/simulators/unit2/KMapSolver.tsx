import React, { useState } from 'react';
import { Grid, Sparkles, RefreshCw, CheckCircle, Info } from 'lucide-react';

export const KMapSolver: React.FC = () => {
  const [numVars, setNumVars] = useState<2 | 3 | 4 | 5>(4);

  // Cell state mapping: index -> '0' | '1' | 'X'
  const maxCells = numVars === 2 ? 4 : numVars === 3 ? 8 : numVars === 4 ? 16 : 32;
  const [cells, setCells] = useState<Record<number, '0' | '1' | 'X'>>(() => {
    // Default preset: classic 4-corner quad m(0, 2, 8, 10) + m(5, 7, 13, 15)
    return {
      0: '1', 2: '1', 8: '1', 10: '1',
      5: '1', 7: '1', 13: '1', 15: '1',
    };
  });

  const toggleCell = (idx: number) => {
    setCells(prev => {
      const curr = prev[idx] || '0';
      const next = curr === '0' ? '1' : curr === '1' ? 'X' : '0';
      return { ...prev, [idx]: next };
    });
  };

  const clearAll = () => setCells({});

  // Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'corners') {
      setNumVars(4);
      setCells({ 0: '1', 2: '1', 8: '1', 10: '1' });
    } else if (presetName === 'octet') {
      setNumVars(4);
      setCells({ 1: '1', 3: '1', 5: '1', 7: '1', 9: '1', 11: '1', 13: '1', 15: '1' });
    } else if (presetName === 'dontCare') {
      setNumVars(4);
      setCells({ 1: '1', 3: '1', 7: '1', 11: '1', 15: '1', 0: 'X', 2: 'X', 5: 'X' });
    } else if (presetName === 'xor') {
      setNumVars(3);
      setCells({ 1: '1', 2: '1', 4: '1', 7: '1' });
    }
  };

  // 4-Variable K-Map coordinate mapping
  // Rows: AB (00, 01, 11, 10) -> [0, 1, 3, 2]
  // Cols: CD (00, 01, 11, 10) -> [0, 1, 3, 2]
  const rowGray = [0, 1, 3, 2];
  const colGray = [0, 1, 3, 2];
  const rowLabels = ['00 (A̅B̅)', '01 (A̅B)', '11 (AB)', '10 (AB̅)'];
  const colLabels = ['00 (C̅D̅)', '01 (C̅D)', '11 (CD)', '10 (CD̅)'];

  const getMintermIndex4 = (rIdx: number, cIdx: number) => {
    const ab = rowGray[rIdx];
    const cd = colGray[cIdx];
    return (ab << 2) | cd;
  };

  // Simplified Expression Heuristic Analyzer
  const analyzeExpression = () => {
    const ones: number[] = [];
    const dontCares: number[] = [];
    for (let i = 0; i < maxCells; i++) {
      if (cells[i] === '1') ones.push(i);
      if (cells[i] === 'X') dontCares.push(i);
    }

    if (ones.length === 0) return { expr: '0 (Constant False)', groups: [] };
    if (ones.length + dontCares.length === maxCells) return { expr: '1 (Constant True)', groups: [] };

    const detectedGroups: { name: string; term: string; cells: number[]; color: string }[] = [];

    // Check classic 4-corners group in 4-variable map: m(0, 2, 8, 10)
    if (numVars === 4) {
      const cornerMinterms = [0, 2, 8, 10];
      const allActive = cornerMinterms.every(m => cells[m] === '1' || cells[m] === 'X');
      const hasRealOne = cornerMinterms.some(m => cells[m] === '1');
      if (allActive && hasRealOne) {
        detectedGroups.push({
          name: '4-Corners Quad (Wrap-around)',
          term: "B̅ · D̅",
          cells: cornerMinterms,
          color: 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-400'
        });
      }

      // Check Column 1 & 3 (D=1): m(1,3,5,7,9,11,13,15)
      const oddOctet = [1, 3, 5, 7, 9, 11, 13, 15];
      if (oddOctet.every(m => cells[m] === '1' || cells[m] === 'X') && oddOctet.some(m => cells[m] === '1')) {
        detectedGroups.push({
          name: 'Right 8-Cell Octet',
          term: "D",
          cells: oddOctet,
          color: 'border-blue-500 bg-blue-500/20 text-blue-600 dark:text-blue-400'
        });
      }

      // Center Quad m(5, 7, 13, 15)
      const centerQuad = [5, 7, 13, 15];
      if (centerQuad.every(m => cells[m] === '1' || cells[m] === 'X') && centerQuad.some(m => cells[m] === '1')) {
        if (!detectedGroups.some(g => g.name === 'Right 8-Cell Octet')) {
          detectedGroups.push({
            name: 'Center Quad',
            term: "B · D",
            cells: centerQuad,
            color: 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          });
        }
      }
    }

    if (detectedGroups.length > 0) {
      const expr = detectedGroups.map(g => g.term).join(' + ');
      return { expr, groups: detectedGroups };
    }

    // Default general display
    const activeTerms = ones.map(m => `m(${m})`).join(', ');
    return { expr: `F = Σm(${ones.join(', ')})` + (dontCares.length ? ` + d(${dontCares.join(', ')})` : ''), groups: [] };
  };

  const { expr, groups } = analyzeExpression();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-4 h-4 text-blue-500" />
            Interactive Karnaugh Map (K-Map) Solver & Minimizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click cells to cycle between 0, 1, and X (Don't Care). Visualizes Gray code adjacency and boundary wraps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Variable selection */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {([2, 3, 4, 5] as const).map(v => (
              <button
                key={v}
                onClick={() => { setNumVars(v); setCells({}); }}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  numVars === v ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {v}-Var
              </button>
            ))}
          </div>

          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            <RefreshCw className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-xs font-medium text-slate-500">DTU Exam Patterns:</span>
        <button
          onClick={() => applyPreset('corners')}
          className="px-2.5 py-1 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded font-medium hover:bg-rose-100"
        >
          4-Corners Wrap Quad (B̅D̅)
        </button>
        <button
          onClick={() => applyPreset('octet')}
          className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded font-medium hover:bg-blue-100"
        >
          8-Cell Octet (D)
        </button>
        <button
          onClick={() => applyPreset('dontCare')}
          className="px-2.5 py-1 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded font-medium hover:bg-amber-100"
        >
          Don't Care Optimization
        </button>
        <button
          onClick={() => applyPreset('xor')}
          className="px-2.5 py-1 text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded font-medium hover:bg-purple-100"
        >
          3-Var XOR Pattern
        </button>
      </div>

      {/* 4-Variable K-Map Grid */}
      {numVars === 4 && (
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full font-mono text-center">
            {/* Top axis label */}
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              Variables: AB (Rows) \ CD (Columns)
            </div>

            <table className="mx-auto border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-xs text-slate-400 font-sans border-b border-r border-slate-300 dark:border-slate-700">
                    AB \ CD
                  </th>
                  {colLabels.map((cLabel, cIdx) => (
                    <th
                      key={cIdx}
                      className="p-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    >
                      {cLabel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((rLabel, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                      {rLabel}
                    </td>
                    {colLabels.map((_, cIdx) => {
                      const minterm = getMintermIndex4(rIdx, cIdx);
                      const val = cells[minterm] || '0';
                      return (
                        <td
                          key={cIdx}
                          onClick={() => toggleCell(minterm)}
                          className="border border-slate-300 dark:border-slate-700 p-1 relative cursor-pointer select-none hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                        >
                          <div
                            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-between p-1.5 transition-all ${
                              val === '1'
                                ? 'bg-blue-600 text-white font-bold shadow'
                                : val === 'X'
                                ? 'bg-amber-500 text-white font-bold shadow'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="text-[10px] self-start opacity-75 font-mono">
                              m{minterm}
                            </span>
                            <span className="text-xl font-bold font-mono">{val}</span>
                            <span className="text-[9px] opacity-60">
                              {rLabel.split(' ')[0]}{colLabels[cIdx].split(' ')[0]}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2-Variable and 3-Variable Grid Fallbacks */}
      {numVars === 2 && (
        <div className="flex justify-center py-6 font-mono">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs text-slate-400">A \ B</th>
                <th className="p-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 border">0 (B̅)</th>
                <th className="p-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 border">1 (B)</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1].map(a => (
                <tr key={a}>
                  <td className="p-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 border">{a} ({a === 0 ? 'A̅' : 'A'})</td>
                  {[0, 1].map(b => {
                    const m = (a << 1) | b;
                    const val = cells[m] || '0';
                    return (
                      <td key={b} onClick={() => toggleCell(m)} className="border p-2 cursor-pointer">
                        <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center font-bold ${
                          val === '1' ? 'bg-blue-600 text-white' : val === 'X' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <span className="text-[10px] opacity-70">m{m}</span>
                          <span className="text-lg">{val}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {numVars === 3 && (
        <div className="flex justify-center py-6 font-mono overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs text-slate-400">A \ BC</th>
                {['00 (B̅C̅)', '01 (B̅C)', '11 (BC)', '10 (BC̅)'].map((l, i) => (
                  <th key={i} className="p-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 border">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1].map(a => (
                <tr key={a}>
                  <td className="p-3 text-xs font-bold bg-slate-100 dark:bg-slate-800 border">{a} ({a === 0 ? 'A̅' : 'A'})</td>
                  {[0, 1, 3, 2].map(bc => {
                    const m = (a << 2) | bc;
                    const val = cells[m] || '0';
                    return (
                      <td key={bc} onClick={() => toggleCell(m)} className="border p-2 cursor-pointer">
                        <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center font-bold ${
                          val === '1' ? 'bg-blue-600 text-white' : val === 'X' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          <span className="text-[10px] opacity-70">m{m}</span>
                          <span className="text-lg">{val}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {numVars === 5 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-2">
            5-Variable K-Map Structure (32 Cells = Two 4×4 Sub-cubes: Subcube A=0 and Subcube A=1)
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            In DTU examinations, 5-variable maps are solved by superimposing Subcube 1 (A=0, m0-m15) directly over Subcube 2 (A=1, m16-m31). Any group that occupies the identical cell position in BOTH sub-cubes eliminates variable A!
          </p>
          <div className="grid grid-cols-2 gap-4 text-center font-mono font-bold">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg">
              Subcube A = 0 (m0 to m15)
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-lg">
              Subcube A = 1 (m16 to m31)
            </div>
          </div>
        </div>
      )}

      {/* Output simplified equation banner */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Minimized Sum-of-Products (SOP) Result
            </span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              F = {expr}
            </div>
          </div>
          {groups.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {groups.map((g, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-md font-mono font-semibold border ${g.color}`}
                >
                  {g.name}: {g.term}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
