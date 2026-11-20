import React, { useState } from 'react';
import { Network, Check, ArrowRight, Cpu } from 'lucide-react';

export const MuxDemuxSimulator: React.FC = () => {
  const [mode, setMode] = useState<'mux' | 'demux' | 'universal'>('mux');
  const [s1, setS1] = useState<number>(0);
  const [s0, setS0] = useState<number>(1);
  const [inputs, setInputs] = useState<number[]>([1, 0, 1, 0]); // I0, I1, I2, I3
  const [enable, setEnable] = useState<number>(1); // Active High Enable (or 0 for active low)

  // Selected channel index
  const selectedChannel = (s1 << 1) | s0;

  // 4:1 Mux Output
  const muxOutput = enable === 1 ? inputs[selectedChannel] : 0;

  // Toggle individual input bit
  const toggleInput = (idx: number) => {
    setInputs(prev => {
      const copy = [...prev];
      copy[idx] = copy[idx] === 1 ? 0 : 1;
      return copy;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-500" />
            4:1 Multiplexer (Data Selector) & Function Generator Visualizer
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Route data dynamically using select address lines and implement arbitrary logic functions without gates.
          </p>
        </div>

        {/* Mode switches */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('mux')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              mode === 'mux' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4:1 MUX Simulator
          </button>
          <button
            onClick={() => setMode('universal')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              mode === 'universal' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Universal Function Generator
          </button>
        </div>
      </div>

      {mode === 'mux' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Controls Column */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                1. Select Lines (Address: S1 S0)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setS1(s1 === 1 ? 0 : 1)}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    s1 === 1
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  S1 = {s1}
                </button>
                <button
                  onClick={() => setS0(s0 === 1 ? 0 : 1)}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-colors ${
                    s0 === 1
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  S0 = {s0}
                </button>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Active Channel: Channel <strong className="text-cyan-600">I{selectedChannel}</strong>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                2. Data Input Channels (Click to Toggle 0/1)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {inputs.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleInput(idx)}
                    className={`py-3 rounded-lg font-mono font-bold text-center border-2 transition-all ${
                      idx === selectedChannel
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5">I{idx}</div>
                    <div className="text-base">{val}</div>
                    {idx === selectedChannel && (
                      <span className="text-[9px] text-cyan-500 font-sans block">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={() => setEnable(enable === 1 ? 0 : 1)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  enable === 1
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400'
                }`}
              >
                Enable Chip (E): {enable === 1 ? '1 (CHIP ENABLED)' : '0 (CHIP DISABLED)'}
              </button>
            </div>
          </div>

          {/* SVG Mux Trapezoid & Visual Logic Path */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative shadow-inner">
            <svg viewBox="0 0 360 220" className="w-full max-w-sm h-auto">
              {/* Trapezoid MUX Body */}
              <polygon
                points="110,30 250,60 250,160 110,190"
                fill="#1e293b"
                stroke="#06b6d4"
                strokeWidth="3"
              />
              <text x="180" y="115" fill="#e2e8f0" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                4 : 1 MUX
              </text>

              {/* Data Input Lines (Left) */}
              {[
                { y: 55, label: 'I0', idx: 0 },
                { y: 90, label: 'I1', idx: 1 },
                { y: 130, label: 'I2', idx: 2 },
                { y: 165, label: 'I3', idx: 3 },
              ].map(line => {
                const isChActive = line.idx === selectedChannel;
                return (
                  <g key={line.idx}>
                    <line
                      x1="30"
                      y1={line.y}
                      x2="110"
                      y2={line.y}
                      stroke={isChActive ? '#06b6d4' : '#475569'}
                      strokeWidth={isChActive ? '4' : '2'}
                      strokeDasharray={isChActive ? '6 3' : 'none'}
                    />
                    <circle cx="30" cy={line.y} r="4" fill={isChActive ? '#06b6d4' : '#475569'} />
                    <text x="10" y={line.y + 4} fill={isChActive ? '#06b6d4' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
                      {line.label}={inputs[line.idx]}
                    </text>
                  </g>
                );
              })}

              {/* Select Lines (Bottom) */}
              <line x1="150" y1="210" x2="150" y2="182" stroke="#38bdf8" strokeWidth="2" />
              <text x="150" y="218" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">S1={s1}</text>

              <line x1="200" y1="210" x2="200" y2="171" stroke="#38bdf8" strokeWidth="2" />
              <text x="200" y="218" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">S0={s0}</text>

              {/* Output Line (Right) */}
              <line
                x1="250"
                y1="110"
                x2="330"
                y2="110"
                stroke={muxOutput === 1 ? '#10b981' : '#475569'}
                strokeWidth="4"
                strokeDasharray={muxOutput === 1 ? '6 3' : 'none'}
              />
              <circle cx="330" cy="110" r="5" fill={muxOutput === 1 ? '#10b981' : '#475569'} />
              <text x="315" y="95" fill={muxOutput === 1 ? '#10b981' : '#94a3b8'} fontSize="14" fontFamily="monospace" fontWeight="bold">
                Y={muxOutput}
              </text>
            </svg>

            <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              Hardware Equation: Y = S1'S0'I0 + S1'S0I1 + S1S0'I2 + S1S0I3 = <span className="text-cyan-400 font-bold">{muxOutput}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Universal Function Generator explanation & visualizer */
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>DTU 10-Mark Question: Implementing F(A, B, C) = Σm(1, 3, 5, 6) using a 4:1 MUX</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
            By connecting A and B to select lines S1 and S0, each input Ik corresponds to two minterms (m[2k] and m[2k+1]). We derive the input values directly from variable C:
          </p>
          <div className="grid grid-cols-4 gap-2 font-mono text-center">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded border">
              <span className="text-slate-400 text-[10px]">I0 (m0, m1)</span>
              <div className="font-bold text-cyan-600">I0 = C</div>
              <span className="text-[10px] text-slate-500">m0=0, m1=1</span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded border">
              <span className="text-slate-400 text-[10px]">I1 (m2, m3)</span>
              <div className="font-bold text-cyan-600">I1 = C</div>
              <span className="text-[10px] text-slate-500">m2=0, m3=1</span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded border">
              <span className="text-slate-400 text-[10px]">I2 (m4, m5)</span>
              <div className="font-bold text-cyan-600">I2 = C</div>
              <span className="text-[10px] text-slate-500">m4=0, m5=1</span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded border">
              <span className="text-slate-400 text-[10px]">I3 (m6, m7)</span>
              <div className="font-bold text-cyan-600">I3 = C̅</div>
              <span className="text-[10px] text-slate-500">m6=1, m7=0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
