import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertTriangle, Layers } from 'lucide-react';

type FFType = 'SR' | 'JK' | 'D' | 'T';

export const FlipFlopSimulator: React.FC = () => {
  const [ffType, setFfType] = useState<FFType>('JK');
  const [input1, setInput1] = useState<number>(1); // S or J or D or T
  const [input2, setInput2] = useState<number>(1); // R or K (ignored for D & T)
  const [q, setQ] = useState<number>(0);
  const [clockState, setClockState] = useState<number>(0);
  const [isAutoClock, setIsAutoClock] = useState<boolean>(false);
  const [history, setHistory] = useState<{ clk: number; q: number; in1: number; in2: number }[]>([
    { clk: 0, q: 0, in1: 1, in2: 1 },
  ]);

  // Compute Next State
  const getNextState = (type: FFType, in1: number, in2: number, currentQ: number): { nextQ: number; stateDesc: string; invalid?: boolean } => {
    switch (type) {
      case 'SR':
        if (in1 === 0 && in2 === 0) return { nextQ: currentQ, stateDesc: 'No Change (Memory / Hold)' };
        if (in1 === 0 && in2 === 1) return { nextQ: 0, stateDesc: 'Reset (Q = 0)' };
        if (in1 === 1 && in2 === 0) return { nextQ: 1, stateDesc: 'Set (Q = 1)' };
        return { nextQ: 0, stateDesc: 'Forbidden / Invalid State (S=R=1 violates Q = Q̅)', invalid: true };

      case 'JK':
        if (in1 === 0 && in2 === 0) return { nextQ: currentQ, stateDesc: 'No Change (Hold)' };
        if (in1 === 0 && in2 === 1) return { nextQ: 0, stateDesc: 'Reset (Q = 0)' };
        if (in1 === 1 && in2 === 0) return { nextQ: 1, stateDesc: 'Set (Q = 1)' };
        return { nextQ: currentQ === 1 ? 0 : 1, stateDesc: 'Toggle (Q = Q̅) [Solves SR forbidden state]' };

      case 'D':
        return { nextQ: in1, stateDesc: in1 === 1 ? 'Data Transparent (Q = 1)' : 'Data Transparent (Q = 0)' };

      case 'T':
        return in1 === 1
          ? { nextQ: currentQ === 1 ? 0 : 1, stateDesc: 'Toggle (T=1)' }
          : { nextQ: currentQ, stateDesc: 'Hold / No Change (T=0)' };

      default:
        return { nextQ: currentQ, stateDesc: 'Hold' };
    }
  };

  const nextStateInfo = getNextState(ffType, input1, input2, q);

  // Trigger Positive Edge Clock Pulse
  const triggerClockEdge = () => {
    // Clock goes LOW to HIGH
    setClockState(1);
    const { nextQ } = getNextState(ffType, input1, input2, q);
    setQ(nextQ);

    setHistory(prev => {
      const updated = [...prev.slice(-15), { clk: 1, q: nextQ, in1: input1, in2: input2 }];
      return updated;
    });

    // Fall back to low after 300ms
    setTimeout(() => {
      setClockState(0);
      setHistory(prev => [...prev.slice(-15), { clk: 0, q: nextQ, in1: input1, in2: input2 }]);
    }, 300);
  };

  // Auto-clock interval
  useEffect(() => {
    let interval: any;
    if (isAutoClock) {
      interval = setInterval(() => {
        triggerClockEdge();
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoClock, ffType, input1, input2, q]);

  const characteristicEquations: Record<FFType, string> = {
    SR: 'Q(t+1) = S + R̅·Q  (Constraint: S·R = 0)',
    JK: 'Q(t+1) = J·Q̅ + K̅·Q',
    D: 'Q(t+1) = D',
    T: 'Q(t+1) = T ⊕ Q = T·Q̅ + T̅·Q',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            Universal Flip-Flop Simulator & Dynamic Timing Waveform
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive SR, JK, D, and T edge-triggered latches with real-time digital waveform generation.
          </p>
        </div>

        {/* FF Type Selector */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(['SR', 'JK', 'D', 'T'] as FFType[]).map(type => (
            <button
              key={type}
              onClick={() => {
                setFfType(type);
                setInput1(1);
                setInput2(type === 'SR' ? 0 : 1);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                ffType === type ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {type} FF
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Flip-Flop Schematic Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-center">
        {/* Controls Column */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Flip-Flop Data Inputs:
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setInput1(input1 === 1 ? 0 : 1)}
                className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                  input1 === 1
                    ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                {ffType === 'SR' ? 'S' : ffType === 'JK' ? 'J' : ffType === 'D' ? 'D' : 'T'} = {input1}
              </button>

              {(ffType === 'SR' || ffType === 'JK') && (
                <button
                  onClick={() => setInput2(input2 === 1 ? 0 : 1)}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    input2 === 1
                      ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  {ffType === 'SR' ? 'R' : 'K'} = {input2}
                </button>
              )}
            </div>
          </div>

          {/* Clock Trigger controls */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Clock Control (Positive Edge Triggered):
            </span>
            <div className="flex gap-2">
              <button
                onClick={triggerClockEdge}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Clock className="w-3.5 h-3.5" />
                Pulse Clock (▲ Edge)
              </button>
              <button
                onClick={() => setIsAutoClock(!isAutoClock)}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border ${
                  isAutoClock
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {isAutoClock ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoClock ? 'Stop 1Hz' : 'Auto 1Hz'}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
              <span>Clock Signal:</span>
              <span className={`font-bold ${clockState === 1 ? 'text-purple-600' : 'text-slate-400'}`}>
                {clockState === 1 ? 'HIGH (1)' : 'LOW (0)'}
              </span>
            </div>
          </div>
        </div>

        {/* SVG Flip-Flop Circuit Box (Center) */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
          <svg viewBox="0 0 240 180" className="w-48 h-36">
            {/* FF Box */}
            <rect x="50" y="20" width="140" height="140" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5" />
            <text x="120" y="95" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {ffType} FF
            </text>

            {/* Positive Edge Triangle */}
            <polyline points="50,90 65,100 50,110" fill="none" stroke="#a855f7" strokeWidth="2" />
            <line x1="20" y1="100" x2="50" y2="100" stroke={clockState === 1 ? '#a855f7' : '#475569'} strokeWidth="3" />
            <text x="25" y="92" fill="#a855f7" fontSize="10" fontFamily="monospace">CLK</text>

            {/* Input 1 line */}
            <line x1="20" y1="50" x2="50" y2="50" stroke={input1 === 1 ? '#10b981' : '#475569'} strokeWidth="3" />
            <text x="25" y="42" fill={input1 === 1 ? '#10b981' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              {ffType === 'SR' ? 'S' : ffType === 'JK' ? 'J' : ffType === 'D' ? 'D' : 'T'}
            </text>

            {/* Input 2 line (if SR or JK) */}
            {(ffType === 'SR' || ffType === 'JK') && (
              <>
                <line x1="20" y1="140" x2="50" y2="140" stroke={input2 === 1 ? '#10b981' : '#475569'} strokeWidth="3" />
                <text x="25" y="132" fill={input2 === 1 ? '#10b981' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {ffType === 'SR' ? 'R' : 'K'}
                </text>
              </>
            )}

            {/* Output Q line */}
            <line x1="190" y1="50" x2="220" y2="50" stroke={q === 1 ? '#10b981' : '#475569'} strokeWidth="3" />
            <circle cx="220" cy="50" r="4" fill={q === 1 ? '#10b981' : '#475569'} />
            <text x="200" y="42" fill={q === 1 ? '#10b981' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold">Q={q}</text>

            {/* Output Q-bar line */}
            <line x1="190" y1="130" x2="220" y2="130" stroke={q === 0 ? '#10b981' : '#475569'} strokeWidth="3" />
            <circle cx="220" cy="130" r="4" fill={q === 0 ? '#10b981' : '#475569'} />
            <text x="200" y="122" fill={q === 0 ? '#10b981' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold">Q̅={q === 1 ? 0 : 1}</text>
          </svg>

          <div className="mt-2 text-center">
            <span className={`text-xs px-2.5 py-1 rounded font-semibold font-mono ${
              nextStateInfo.invalid
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500'
                : 'bg-purple-500/20 text-purple-300'
            }`}>
              {nextStateInfo.stateDesc}
            </span>
          </div>
        </div>

        {/* State Equation & Excitation Info */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Characteristic Equation:
            </span>
            <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-900">
              {characteristicEquations[ffType]}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Current State Vector:
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-center">
              <div className="p-2 bg-white dark:bg-slate-900 rounded border">
                <span className="text-[10px] text-slate-400 block">Present Q(t)</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{q}</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border">
                <span className="text-[10px] text-slate-400 block">Next Q(t+1)</span>
                <span className="text-sm font-bold text-purple-600">{nextStateInfo.nextQ}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Digital Waveform Timeline */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono text-emerald-400">Live Digital Waveform (CLK & Q)</span>
          <span className="text-[11px] text-slate-500">Updates on clock edges</span>
        </div>

        <div className="h-16 flex items-end gap-1 overflow-x-auto py-2">
          {history.map((h, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 w-6 shrink-0">
              {/* CLK wave */}
              <div
                className={`w-full ${
                  h.clk === 1 ? 'h-6 bg-purple-500' : 'h-1 bg-slate-700'
                } rounded-t transition-all`}
              />
              {/* Q wave */}
              <div
                className={`w-full ${
                  h.q === 1 ? 'h-6 bg-emerald-500' : 'h-1 bg-slate-700'
                } rounded-t transition-all`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span className="text-purple-400">■ Clock Waveform</span>
          <span className="text-emerald-400">■ Output Q Waveform</span>
        </div>
      </div>
    </div>
  );
};
