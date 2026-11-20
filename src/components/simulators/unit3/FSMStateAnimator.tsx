import React, { useState } from 'react';
import { GitBranch, Play, RotateCcw, CheckCircle2, Zap } from 'lucide-react';

export const FSMStateAnimator: React.FC = () => {
  const [modelType, setModelType] = useState<'Moore' | 'Mealy'>('Mealy');
  const [isOverlapping, setIsOverlapping] = useState<boolean>(true);
  const [currentState, setCurrentState] = useState<number>(0); // S0=0, S1=1, S2=2, S3=3
  const [inputHistory, setInputHistory] = useState<number[]>([]);
  const [detectionCount, setDetectionCount] = useState<number>(0);
  const [lastOutput, setLastOutput] = useState<number>(0);

  // Target Sequence: 1011
  // States represent length of matched prefix:
  // S0: No prefix matched ("")
  // S1: "1" matched
  // S2: "10" matched
  // S3: "101" matched

  const stepFSM = (inputBit: number) => {
    let nextState = 0;
    let out = 0;

    if (currentState === 0) {
      nextState = inputBit === 1 ? 1 : 0;
      out = 0;
    } else if (currentState === 1) {
      nextState = inputBit === 0 ? 2 : 1;
      out = 0;
    } else if (currentState === 2) {
      nextState = inputBit === 1 ? 3 : 0;
      out = 0;
    } else if (currentState === 3) {
      if (inputBit === 1) {
        // Detected sequence '1011'!
        out = 1;
        setDetectionCount(prev => prev + 1);
        nextState = isOverlapping ? 1 : 0; // In overlapping mode, suffix '1' matches prefix of next
      } else {
        nextState = 2; // '101' + '0' -> suffix '10' matches S2
        out = 0;
      }
    }

    setCurrentState(nextState);
    setLastOutput(out);
    setInputHistory(prev => [...prev.slice(-18), inputBit]);
  };

  const resetFSM = () => {
    setCurrentState(0);
    setInputHistory([]);
    setDetectionCount(0);
    setLastOutput(0);
  };

  const stateNodes = [
    { id: 0, label: 'S0', desc: 'Reset / Idle', cx: 80, cy: 90 },
    { id: 1, label: 'S1', desc: 'Matched "1"', cx: 180, cy: 90 },
    { id: 2, label: 'S2', desc: 'Matched "10"', cx: 280, cy: 90 },
    { id: 3, label: 'S3', desc: 'Matched "101"', cx: 380, cy: 90 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-500" />
            Interactive Finite State Machine (FSM) Sequence Detector: "1011"
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Feed bit-by-bit inputs and visualize synchronous state transitions between S0, S1, S2, and S3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Overlapping toggle */}
          <button
            onClick={() => { setIsOverlapping(!isOverlapping); resetFSM(); }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              isOverlapping
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {isOverlapping ? 'Overlapping Mode' : 'Non-Overlapping Mode'}
          </button>

          <button
            onClick={resetFSM}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Input Feeder Bar */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Feed Next Clock Bit:</span>
          <button
            onClick={() => stepFSM(0)}
            className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-base shadow active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={() => stepFSM(1)}
            className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-base shadow active:scale-95 transition-all"
          >
            1
          </button>
        </div>

        {/* Input stream history */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-slate-400 font-mono">Stream:</span>
          {inputHistory.length === 0 ? (
            <span className="text-xs text-slate-400 italic">Click 0 or 1 to feed</span>
          ) : (
            inputHistory.map((b, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                  b === 1 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {b}
              </span>
            ))
          )}
        </div>

        {/* Match Count Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Matches Found:</span>
          <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {detectionCount}
          </span>
        </div>
      </div>

      {/* Animated SVG State Transition Diagram */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-5 relative overflow-hidden shadow-inner">
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl mx-auto h-auto">
          {/* Transition Arrows */}
          {/* S0 to S1 on 1 */}
          <path d="M 110,80 Q 145,55 150,80" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="145" y="60" fill="#38bdf8" fontSize="10" fontFamily="monospace">1 / 0</text>

          {/* S0 self-loop on 0 */}
          <path d="M 60,70 Q 30,50 60,110" fill="none" stroke="#64748b" strokeWidth="2" />
          <text x="25" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace">0 / 0</text>

          {/* S1 to S2 on 0 */}
          <path d="M 210,80 Q 245,55 250,80" fill="none" stroke="#64748b" strokeWidth="2" />
          <text x="245" y="60" fill="#38bdf8" fontSize="10" fontFamily="monospace">0 / 0</text>

          {/* S1 self loop on 1 */}
          <path d="M 180,60 Q 180,30 200,60" fill="none" stroke="#64748b" strokeWidth="2" />
          <text x="180" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">1 / 0</text>

          {/* S2 to S3 on 1 */}
          <path d="M 310,80 Q 345,55 350,80" fill="none" stroke="#64748b" strokeWidth="2" />
          <text x="345" y="60" fill="#38bdf8" fontSize="10" fontFamily="monospace">1 / 0</text>

          {/* S3 to S1 on 1 (match!) */}
          <path d="M 380,120 Q 280,180 180,120" fill="none" stroke={lastOutput === 1 ? '#10b981' : '#64748b'} strokeWidth={lastOutput === 1 ? '3' : '2'} />
          <text x="270" y="170" fill={lastOutput === 1 ? '#10b981' : '#a855f7'} fontSize="11" fontFamily="monospace" fontWeight="bold">
            1 / 1 (MATCH DETECTED!)
          </text>

          {/* State Circles */}
          {stateNodes.map(node => {
            const isActive = currentState === node.id;
            return (
              <g key={node.id} className="cursor-pointer">
                {/* Glow ring if active */}
                {isActive && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="34"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    className="animate-ping opacity-50"
                  />
                )}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="28"
                  fill={isActive ? '#065f46' : '#1e293b'}
                  stroke={isActive ? '#10b981' : '#475569'}
                  strokeWidth={isActive ? '3' : '2'}
                />
                <text
                  x={node.cx}
                  y={node.cy + 5}
                  fill={isActive ? '#ffffff' : '#cbd5e1'}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 45}
                  fill={isActive ? '#34d399' : '#64748b'}
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {node.desc}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-2 border-t border-slate-800 pt-2">
          <span>Current Active State: <strong className="text-emerald-400">S{currentState} ({stateNodes[currentState].desc})</strong></span>
          <span>Output Y: <strong className={lastOutput === 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{lastOutput}</strong></span>
        </div>
      </div>
    </div>
  );
};
