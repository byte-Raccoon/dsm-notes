import React, { useState } from 'react';
import { Layers, ArrowRight, Check, Zap, Scale } from 'lucide-react';

export const PriorityEncoderComparatorVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'encoder' | 'comparator'>('comparator');

  // Comparator states (4-bit A and B)
  const [valA, setValA] = useState<number>(11);
  const [valB, setValB] = useState<number>(9);

  const binA = valA.toString(2).padStart(4, '0').split('').map(Number);
  const binB = valB.toString(2).padStart(4, '0').split('').map(Number);

  // Bitwise equivalence xi = AiBi + Ai'Bi'
  const x = [
    (binA[0] === binB[0]) ? 1 : 0,
    (binA[1] === binB[1]) ? 1 : 0,
    (binA[2] === binB[2]) ? 1 : 0,
    (binA[3] === binB[3]) ? 1 : 0,
  ];

  const isEqual = valA === valB;
  const isGreater = valA > valB;
  const isLesser = valA < valB;

  // Priority Encoder states (8 inputs D0 to D7)
  const [encoderInputs, setEncoderInputs] = useState<number[]>([0, 0, 0, 1, 0, 1, 0, 0]); // D0 to D7

  // Find highest active index
  let highestActive = -1;
  for (let i = 7; i >= 0; i--) {
    if (encoderInputs[i] === 1) {
      highestActive = i;
      break;
    }
  }

  const isValid = highestActive !== -1;
  const encOutBinary = isValid ? highestActive.toString(2).padStart(3, '0') : '000';

  const toggleEncoderInput = (idx: number) => {
    setEncoderInputs(prev => {
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
            <Scale className="w-4 h-4 text-cyan-500" />
            Digital Magnitude Comparator (IC 7485) & Priority Encoder (IC 74148)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive circuit models demonstrating bitwise equality cascaded evaluation and priority arbitration logic.
          </p>
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('comparator')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              activeTab === 'comparator' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4-Bit Comparator
          </button>
          <button
            onClick={() => setActiveTab('encoder')}
            className={`px-3 py-1 text-xs font-semibold rounded ${
              activeTab === 'encoder' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            8-to-3 Priority Encoder
          </button>
        </div>
      </div>

      {activeTab === 'comparator' ? (
        <div className="space-y-5">
          {/* Inputs for Comparator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Operand A (0 to 15): {valA} ({binA.join('')}₂)
              </label>
              <input
                type="range"
                min={0}
                max={15}
                value={valA}
                onChange={e => setValA(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0000 (0)</span>
                <span>1000 (8)</span>
                <span>1111 (15)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Operand B (0 to 15): {valB} ({binB.join('')}₂)
              </label>
              <input
                type="range"
                min={0}
                max={15}
                value={valB}
                onChange={e => setValB(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0000 (0)</span>
                <span>1000 (8)</span>
                <span>1111 (15)</span>
              </div>
            </div>
          </div>

          {/* Bit-by-Bit Equivalence Stage Display */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
              Hardware Bitwise Equivalence Gates: x_i = A_i B_i + A_i' B_i' (XNOR Gates)
            </span>

            <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
              {[3, 2, 1, 0].map(bitIdx => {
                const aBit = binA[3 - bitIdx];
                const bBit = binB[3 - bitIdx];
                const eq = x[3 - bitIdx];
                return (
                  <div key={bitIdx} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block mb-1">Bit {bitIdx}</span>
                    <div className="flex justify-around text-xs mb-1">
                      <span className="text-blue-600 font-bold">A{bitIdx}={aBit}</span>
                      <span className="text-cyan-600 font-bold">B{bitIdx}={bBit}</span>
                    </div>
                    <div className={`p-1 rounded font-bold ${eq === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-400'}`}>
                      x{bitIdx} = {eq}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparator Output Banner */}
          <div className="grid grid-cols-3 gap-3 font-mono text-center">
            <div className={`p-4 rounded-xl border transition-all ${
              isGreater
                ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-xs block mb-1">A &gt; B Output</span>
              <span className="text-xl">{isGreater ? 'HIGH (1)' : 'LOW (0)'}</span>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              isEqual
                ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-xs block mb-1">A = B Output</span>
              <span className="text-xl">{isEqual ? 'HIGH (1)' : 'LOW (0)'}</span>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              isLesser
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-xs block mb-1">A &lt; B Output</span>
              <span className="text-xl">{isLesser ? 'HIGH (1)' : 'LOW (0)'}</span>
            </div>
          </div>

          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-900/60 text-xs text-cyan-900 dark:text-cyan-200 font-mono">
            <strong>Hardware Logic Equations:</strong><br />
            (A = B) = x3 · x2 · x1 · x0<br />
            (A &gt; B) = A3·B3' + x3·A2·B2' + x3·x2·A1·B1' + x3·x2·x1·A0·B0'
          </div>
        </div>
      ) : (
        /* 8-to-3 Priority Encoder View */
        <div className="space-y-5">
          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Input Lines D0 through D7 (Click bit to toggle between 0 and 1):
            </span>
            <div className="grid grid-cols-8 gap-1.5 font-mono">
              {encoderInputs.map((val, idx) => {
                const isWinner = idx === highestActive;
                return (
                  <button
                    key={idx}
                    onClick={() => toggleEncoderInput(idx)}
                    className={`py-3 rounded-lg border text-center transition-all ${
                      isWinner
                        ? 'bg-emerald-600 text-white font-bold shadow-md scale-105 border-emerald-400'
                        : val === 1
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] block opacity-75">D{idx}</span>
                    <span className="text-base">{val}</span>
                    {isWinner && <span className="text-[8px] font-sans block mt-0.5">PRIORITY</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Encoder Output */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-white font-mono flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Arbitration Winner:</span>
              <div className="text-lg font-bold text-emerald-400">
                {highestActive !== -1 ? `Input D${highestActive} (Highest Active Line)` : 'No Inputs Active'}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Encoded (Y2 Y1 Y0)</span>
                <span className="text-base font-bold text-cyan-400 tracking-wider">
                  {encOutBinary} ({highestActive !== -1 ? highestActive : '-'})
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Valid Line (V)</span>
                <span className={`text-base font-bold ${isValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isValid ? '1 (VALID)' : '0 (IDLE)'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <strong>Why Priority Encoders are needed:</strong> In standard binary encoders, if two or more input lines go HIGH at the same time, the output produces an erroneous garbled code. A Priority Encoder guarantees that the output code reflects only the input with the highest numeric priority (e.g. interrupt request lines in microprocessors).
          </div>
        </div>
      )}
    </div>
  );
};
