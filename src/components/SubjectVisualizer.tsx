import React, { useState } from 'react';
import { VisualContent } from '../types';
import { Play, Pause, RefreshCw, Cpu, Activity, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface SubjectVisualizerProps {
  visualType: string;
  content: VisualContent;
  category?: string;
  isHindiOrHinglish?: boolean;
}

export const SubjectVisualizer: React.FC<SubjectVisualizerProps> = ({
  visualType,
  content,
  category = 'physics',
  isHindiOrHinglish = false,
}) => {
  // Interactive circuit simulation state (for physics / Ohm's law)
  const [simVoltage, setSimVoltage] = useState(12);
  const [simResistance, setSimResistance] = useState(4);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  // Ohm's law calculations
  const simCurrent = Number((simVoltage / Math.max(simResistance, 0.1)).toFixed(2));
  const simPower = Number((simVoltage * simCurrent).toFixed(1));

  // Math Interactive Calculus / Tangent Graph state
  const [mathX, setMathX] = useState(2);
  const [deltaX, setDeltaX] = useState(0.5);
  const mathY = Number((mathX * mathX).toFixed(2));
  const mathSlope = Number((2 * mathX).toFixed(2)); // derivative of x^2 is 2x
  const secantSlope = Number((((mathX + deltaX) ** 2 - mathX ** 2) / Math.max(deltaX, 0.001)).toFixed(2));

  // Determine actual display type
  const isPhysics = category === 'physics' || visualType === 'interactive_sim';
  const isCode = category === 'programming' || visualType === 'code';
  const isMath = category === 'math' || (!isPhysics && !isCode);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 text-white">
      {/* Visual Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-white/10 border border-white/15 text-white/90">
            {isPhysics ? (
              <Zap className="w-4 h-4 text-amber-400" />
            ) : isCode ? (
              <Cpu className="w-4 h-4 text-emerald-400" />
            ) : (
              <Activity className="w-4 h-4 text-sky-400" />
            )}
          </span>
          <div>
            <h4 className="text-sm sm:text-base font-semibold tracking-tight text-white">
              {content.title}
            </h4>
            <p className="text-xs text-white/60 line-clamp-1">{content.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-black/30 px-2.5 py-1 rounded-md border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE STAGE</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-3 flex-1 overflow-y-auto [scrollbar-width:none]">
        {/* CASE 1: Physics Interactive Circuit Simulation (Ohm's Law) */}
        {isPhysics && (
          <div className="flex flex-col gap-4">
            {/* Real-time Electrical Dashboard */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span className="text-[11px] font-mono text-amber-300 block uppercase tracking-wider">
                  Voltage (V)
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {simVoltage}
                  <span className="text-xs text-white/50 ml-1">V</span>
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">Electric Pressure</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span className="text-[11px] font-mono text-rose-300 block uppercase tracking-wider">
                  Resistance (R)
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {simResistance}
                  <span className="text-xs text-white/50 ml-1">Ω</span>
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">Flow Obstruction</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-[11px] font-mono text-emerald-300 block uppercase tracking-wider">
                  Current (I = V/R)
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                  {simCurrent}
                  <span className="text-xs text-emerald-300/60 ml-1">A</span>
                </span>
                <span className="text-[10px] text-emerald-200/50 block mt-0.5">Electron Drift Rate</span>
              </div>
            </div>

            {/* Interactive Schematic Diagram with animated electrons */}
            <div className="relative h-32 sm:h-36 rounded-2xl bg-gradient-to-b from-black/50 to-slate-950/70 border border-white/15 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
              {/* Animated electron flow particles */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  <rect
                    x="30"
                    y="20"
                    width="340"
                    height="80"
                    rx="12"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  {/* Battery icon representation */}
                  <line x1="30" y1="50" x2="30" y2="70" stroke="#f59e0b" strokeWidth="6" />
                  <text x="12" y="64" fill="#f59e0b" fontSize="12" fontWeight="bold">
                    + -
                  </text>

                  {/* Resistor symbol representation */}
                  <path
                    d="M 170,20 L 180,10 L 190,30 L 200,10 L 210,30 L 220,10 L 230,20"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                  />
                  <text x="185" y="45" fill="#f43f5e" fontSize="10" fontWeight="bold">
                    {simResistance}Ω
                  </text>

                  {/* Light bulb indicator */}
                  <circle
                    cx="370"
                    cy="60"
                    r={Math.min(18, Math.max(6, simCurrent * 3))}
                    fill="rgba(52, 211, 153, 0.2)"
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  <text x="355" y="95" fill="#34d399" fontSize="10">
                    Load
                  </text>
                </svg>
              </div>

              {/* Formula Badge in stage */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="font-mono bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-white/90">
                  Formula: <strong className="text-amber-300">I = V ÷ R</strong> = {simVoltage}V ÷ {simResistance}Ω ={' '}
                  <strong className="text-emerald-400">{simCurrent}A</strong>
                </span>
                <span className="font-mono text-white/60 text-[11px]">
                  Power: <strong className="text-white">{simPower}W</strong>
                </span>
              </div>

              {/* Intuitive Hydraulic Pipe Analogy Banner */}
              <div className="relative z-10 p-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white/80">
                <span className="text-amber-300 font-semibold mr-1.5">
                  {isHindiOrHinglish ? '💡 Pipe Analogy:' : '💡 Hydraulic Analogy:'}
                </span>
                {simResistance > 8 ? (
                  <span>
                    Pipe is severely constricted (high resistance)! Only a trickle of water (current) escapes: {simCurrent}A.
                  </span>
                ) : (
                  <span>
                    Pipe is wide open with minimal friction! A strong torrent of charge flows: {simCurrent}A.
                  </span>
                )}
              </div>
            </div>

            {/* Simulation Sliders (User interacts to verify Ohm's law!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Adjust Voltage (V):</span>
                  <span className="font-mono font-bold text-amber-300">{simVoltage} V</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="48"
                  step="2"
                  value={simVoltage}
                  onChange={(e) => setSimVoltage(Number(e.target.value))}
                  className="accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/70">Adjust Resistance (R):</span>
                  <span className="font-mono font-bold text-rose-300">{simResistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={simResistance}
                  onChange={(e) => setSimResistance(Number(e.target.value))}
                  className="accent-rose-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: Programming Code Execution & Walkthrough */}
        {isCode && (
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-xl">
              <div className="bg-white/10 px-3 py-2 flex items-center justify-between border-b border-white/10 text-white/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-white/50">Component.tsx</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (content.codeSnippet) {
                      navigator.clipboard?.writeText(content.codeSnippet);
                      setCodeCopied(true);
                      setTimeout(() => setCodeCopied(false), 2000);
                    }
                  }}
                  className="text-[10px] text-white/60 hover:text-white transition-colors"
                >
                  {codeCopied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre className="p-3 sm:p-4 text-emerald-300 overflow-x-auto leading-relaxed text-[11px] sm:text-xs">
                {content.codeSnippet ||
                  `// Declarative State Transformation\nfunction TeacherModule() {\n  const [current, setCurrent] = useState(0);\n  return <Visualizer current={current} />;\n}`}
              </pre>
            </div>

            {/* Execution Trace / Output */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-1">
                Execution State Flow:
              </span>
              <ul className="space-y-1 text-white/80 text-[11px]">
                {content.steps?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{step}</span>
                  </li>
                )) || (
                  <li className="text-white/60">State changes trigger reconciliation pass.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* CASE 3: Mathematics / Calculus / Equations / Custom Topics */}
        {!isPhysics && !isCode && (
          <div className="flex flex-col gap-3">
            {/* Interactive Calculus & Geometric Slope Visualizer (for Math) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-black/60 to-slate-950/80 border border-white/15 shadow-inner">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Dynamic Function Curve: f(x) = x²
                </span>
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  Derivative m = f'(x) = 2x = {mathSlope}
                </span>
              </div>

              {/* Curve Stage SVG */}
              <div className="relative h-28 sm:h-32 w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 320 120">
                  {/* Grid Lines */}
                  <line x1="20" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  <line x1="160" y1="10" x2="160" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

                  {/* Parabola Curve y = 0.05 * (x - 160)^2 */}
                  <path
                    d="M 60,10 Q 160,130 260,10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />

                  {/* Interactive Point (mathX) */}
                  {(() => {
                    const cx = 160 + mathX * 22;
                    const cy = 100 - (mathX * mathX) * 4.5;
                    const slope = 2 * mathX;
                    const x1 = cx - 35;
                    const y1 = cy + slope * 8;
                    const x2 = cx + 35;
                    const y2 = cy - slope * 8;
                    return (
                      <g>
                        {/* Tangent Line */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                        {/* Point on curve */}
                        <circle cx={cx} cy={cy} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                        <text x={cx + 8} y={cy - 6} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          ({mathX}, {mathY})
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider Controls for Math */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5 text-xs">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-white/70 font-mono">
                    <span>Evaluate Coordinate x:</span>
                    <span className="text-amber-300 font-bold">{mathX}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.5"
                    value={mathX}
                    onChange={(e) => setMathX(Number(e.target.value))}
                    className="accent-amber-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-white/70 font-mono">
                    <span>Secant Δx Interval:</span>
                    <span className="text-sky-300 font-bold">{deltaX} (Δx → 0)</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="2"
                    step="0.05"
                    value={deltaX}
                    onChange={(e) => setDeltaX(Number(e.target.value))}
                    className="accent-sky-400 cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                </div>
              </div>

              {/* Limit formula callout */}
              <div className="mt-2 text-[11px] font-mono text-white/80 bg-white/[0.04] p-2 rounded-lg border border-white/10 flex items-center justify-between">
                <span>Secant Slope Δy/Δx: <strong className="text-sky-300">{secantSlope}</strong></span>
                <span>Limit as Δx → 0: <strong className="text-emerald-400">{mathSlope}</strong></span>
              </div>
            </div>

            {/* Formula Cards */}
            {content.equations && content.equations.length > 0 && (
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/15 flex flex-wrap gap-2 justify-center items-center">
                {content.equations.map((eq, i) => (
                  <div
                    key={i}
                    className="font-mono text-xs sm:text-sm font-bold text-amber-300 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm"
                  >
                    {eq}
                  </div>
                ))}
              </div>
            )}

            {/* Sequential Conceptual Steps */}
            {content.steps && content.steps.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-white/40 block">
                  Step-by-Step Mathematical Derivation:
                </span>
                {content.steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                      activeStepIndex === idx
                        ? 'bg-white/15 border border-white/30 text-white font-medium shadow-md'
                        : 'bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          activeStepIndex === idx ? 'bg-white text-black' : 'bg-white/10 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {activeStepIndex === idx && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Key Takeaways Bottom strip */}
      {content.details && content.details.length > 0 && (
        <div className="pt-2 border-t border-white/10 text-[11px] text-white/60 flex flex-wrap gap-2">
          {content.details.map((d, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 rounded-md">
              <span className="w-1 h-1 rounded-full bg-white/40" />
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
