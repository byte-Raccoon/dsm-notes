import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Zap, CheckCircle2 } from 'lucide-react';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export const LogicGatePlayground: React.FC = () => {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  // Output evaluation
  const evaluate = (g: GateType, a: number, b: number): number => {
    switch (g) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'NOT': return a === 1 ? 0 : 1;
      case 'NAND': return (a & b) === 1 ? 0 : 1;
      case 'NOR': return (a | b) === 1 ? 0 : 1;
      case 'XOR': return a ^ b;
      case 'XNOR': return (a ^ b) === 1 ? 0 : 1;
      default: return 0;
    }
  };

  const output = evaluate(gate, inputA, inputB);

  // Truth table definition for active gate
  const getTruthTable = (g: GateType) => {
    if (g === 'NOT') {
      return [
        { a: 0, b: '-', out: 1 },
        { a: 1, b: '-', out: 0 },
      ];
    }
    return [
      { a: 0, b: 0, out: evaluate(g, 0, 0) },
      { a: 0, b: 1, out: evaluate(g, 0, 1) },
      { a: 1, b: 0, out: evaluate(g, 1, 0) },
      { a: 1, b: 1, out: evaluate(g, 1, 1) },
    ];
  };

  const truthTable = getTruthTable(gate);

  const gateInfo: Record<GateType, { formula: string; desc: string; universal?: boolean }> = {
    AND: { formula: 'Y = A · B', desc: 'Output is HIGH only when ALL inputs are HIGH.' },
    OR: { formula: 'Y = A + B', desc: 'Output is HIGH if ANY input is HIGH.' },
    NOT: { formula: 'Y = A̅', desc: 'Inverts the single input (HIGH becomes LOW, LOW becomes HIGH).' },
    NAND: { formula: 'Y = (A · B)̅', desc: 'Universal Gate: Output is LOW only when ALL inputs are HIGH.', universal: true },
    NOR: { formula: 'Y = (A + B)̅', desc: 'Universal Gate: Output is HIGH only when ALL inputs are LOW.', universal: true },
    XOR: { formula: 'Y = A ⊕ B = A̅B + AB̅', desc: 'Odd Parity Detector: Output is HIGH when inputs are DIFFERENT.' },
    XNOR: { formula: 'Y = (A ⊕ B)̅ = AB + A̅B̅', desc: 'Equivalence Gate: Output is HIGH when inputs are EQUAL.' },
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Interactive Logic Gate Simulator & Dynamic Truth Table
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Toggle physical inputs, view live voltage propagation, and inspect truth table state.
          </p>
        </div>

        {/* Gate selector buttons */}
        <div className="flex flex-wrap gap-1">
          {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map(g => (
            <button
              key={g}
              onClick={() => setGate(g)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                gate === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
        {/* Schematic Circuit Area (Left 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 relative flex flex-col justify-between overflow-hidden shadow-inner border border-slate-800 min-h-[260px]">
          {/* Header status */}
          <div className="flex justify-between items-center text-xs text-slate-400 z-10">
            <span className="font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Logic Engine
            </span>
            <span className="font-mono bg-slate-800 px-2.5 py-0.5 rounded text-amber-300">
              {gateInfo[gate].formula}
            </span>
          </div>

          {/* SVG Schematic with animated wires */}
          <div className="my-auto py-4 flex items-center justify-center">
            <svg viewBox="0 0 400 160" className="w-full max-w-md h-auto">
              {/* Wire Input A */}
              <line
                x1="40"
                y1="50"
                x2="160"
                y2="50"
                stroke={inputA === 1 ? '#10b981' : '#475569'}
                strokeWidth="4"
                strokeDasharray={inputA === 1 ? '6 3' : 'none'}
              />
              <circle cx="40" cy="50" r="5" fill={inputA === 1 ? '#10b981' : '#475569'} />
              <text x="15" y="55" fill={inputA === 1 ? '#10b981' : '#94a3b8'} fontSize="13" fontFamily="monospace" fontWeight="bold">
                A={inputA}
              </text>

              {/* Wire Input B (hidden for NOT gate) */}
              {gate !== 'NOT' && (
                <>
                  <line
                    x1="40"
                    y1="110"
                    x2="160"
                    y2="110"
                    stroke={inputB === 1 ? '#10b981' : '#475569'}
                    strokeWidth="4"
                    strokeDasharray={inputB === 1 ? '6 3' : 'none'}
                  />
                  <circle cx="40" cy="110" r="5" fill={inputB === 1 ? '#10b981' : '#475569'} />
                  <text x="15" y="115" fill={inputB === 1 ? '#10b981' : '#94a3b8'} fontSize="13" fontFamily="monospace" fontWeight="bold">
                    B={inputB}
                  </text>
                </>
              )}

              {/* Logic Gate Body SVG */}
              {gate === 'AND' && (
                <path d="M 160,35 L 200,35 A 45,45 0 0,1 200,125 L 160,125 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              )}
              {gate === 'NAND' && (
                <>
                  <path d="M 160,35 L 200,35 A 45,45 0 0,1 200,125 L 160,125 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                  <circle cx="251" cy="80" r="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                </>
              )}
              {gate === 'OR' && (
                <path d="M 155,35 Q 185,80 155,125 Q 215,125 245,80 Q 215,35 155,35 Z" fill="#1e293b" stroke="#a855f7" strokeWidth="3" />
              )}
              {gate === 'NOR' && (
                <>
                  <path d="M 155,35 Q 185,80 155,125 Q 215,125 245,80 Q 215,35 155,35 Z" fill="#1e293b" stroke="#a855f7" strokeWidth="3" />
                  <circle cx="251" cy="80" r="6" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5" />
                </>
              )}
              {gate === 'NOT' && (
                <>
                  <path d="M 160,40 L 225,80 L 160,120 Z" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
                  <circle cx="231" cy="80" r="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2.5" />
                </>
              )}
              {gate === 'XOR' && (
                <>
                  <path d="M 145,35 Q 175,80 145,125" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <path d="M 155,35 Q 185,80 155,125 Q 215,125 245,80 Q 215,35 155,35 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                </>
              )}
              {gate === 'XNOR' && (
                <>
                  <path d="M 145,35 Q 175,80 145,125" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  <path d="M 155,35 Q 185,80 155,125 Q 215,125 245,80 Q 215,35 155,35 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="251" cy="80" r="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                </>
              )}

              {/* Wire Output Y */}
              <line
                x1={['NAND', 'NOR', 'XNOR', 'NOT'].includes(gate) ? '257' : '245'}
                y1="80"
                x2="330"
                y2="80"
                stroke={output === 1 ? '#10b981' : '#475569'}
                strokeWidth="4"
                strokeDasharray={output === 1 ? '6 3' : 'none'}
              />
              <circle cx="330" cy="80" r="6" fill={output === 1 ? '#10b981' : '#475569'} />
              <text x="345" y="85" fill={output === 1 ? '#10b981' : '#94a3b8'} fontSize="14" fontFamily="monospace" fontWeight="bold">
                Y={output}
              </text>
            </svg>
          </div>

          {/* Interactive Toggle Switch Bar */}
          <div className="flex items-center justify-around bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 z-10">
            <button
              onClick={() => setInputA(inputA === 1 ? 0 : 1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                inputA === 1
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              Switch A: {inputA === 1 ? '1 (HIGH / 5V)' : '0 (LOW / 0V)'}
            </button>

            {gate !== 'NOT' && (
              <button
                onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  inputB === 1
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                Switch B: {inputB === 1 ? '1 (HIGH / 5V)' : '0 (LOW / 0V)'}
              </button>
            )}

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Output:</span>
              <span className={`px-3 py-1 rounded font-bold ${
                output === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}>
                {output === 1 ? 'HIGH (1)' : 'LOW (0)'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Truth Table (Right col) */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-xs text-slate-700 dark:text-slate-200">
                Truth Table: {gate}
              </h5>
              {gateInfo[gate].universal && (
                <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded font-bold">
                  Universal
                </span>
              )}
            </div>
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="py-1">A</th>
                  {gate !== 'NOT' && <th className="py-1">B</th>}
                  <th className="py-1">Y (Out)</th>
                </tr>
              </thead>
              <tbody>
                {truthTable.map((row, idx) => {
                  const isActive = gate === 'NOT' ? row.a === inputA : row.a === inputA && row.b === inputB;
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/50 font-bold text-blue-800 dark:text-blue-200'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <td className="py-2">{row.a}</td>
                      {gate !== 'NOT' && <td className="py-2">{row.b}</td>}
                      <td className={`py-2 font-bold ${row.out === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                        {row.out}
                        {isActive && ' ◄'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            {gateInfo[gate].desc}
          </div>
        </div>
      </div>
    </div>
  );
};
