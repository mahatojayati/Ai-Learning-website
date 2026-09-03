import React from 'react';
import { TeacherAvatar, CurriculumModule } from '../types';
import {
  Volume2,
  Headphones,
  RotateCcw,
  FastForward,
  Rewind,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { LiquidGlassButton } from './LiquidGlassButton';

interface AudioFormatViewProps {
  teacher: TeacherAvatar;
  currentModule: CurriculumModule;
  currentModuleIndex: number;
  totalModules: number;
  isPlaying: boolean;
  audioLevel: number;
  language: string;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onSeekPrev: () => void;
  onSeekNext: () => void;
  onReplay: () => void;
  voiceLabel?: string;
}

export const AudioFormatView: React.FC<AudioFormatViewProps> = ({
  teacher,
  currentModule,
  currentModuleIndex,
  totalModules,
  isPlaying,
  audioLevel,
  language,
  playbackSpeed,
  onSpeedChange,
  onSeekPrev,
  onSeekNext,
  onReplay,
  voiceLabel,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col rounded-3xl overflow-hidden liquid-glass-card border border-white/18 shadow-2xl bg-gradient-to-br from-slate-950 via-zinc-950 to-neutral-900 select-none p-4 sm:p-8">
      {/* Background ambient radial aura */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950/80 to-black" />

      {/* Top Podcast OSD Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/15">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono font-semibold text-white/90 border border-white/20 shadow-sm">
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">AUDIO PODCAST LECTURE</span>
          </span>
          <span className="text-xs text-white/60 font-mono">
            {language} • Section {currentModuleIndex + 1} of {totalModules}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl liquid-glass-pill text-xs font-mono text-white/90 border border-white/18">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            {teacher.voiceGender === 'female' ? 'Female Voice Track' : 'Male Voice Track'}
          </span>
        </div>
      </div>

      {/* Center Audio Stage: Medallion + Dynamic Audio Spectrum */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 px-2 gap-6 max-w-2xl mx-auto w-full text-center">
        {/* Glowing Teacher Medallion */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Audio Ripples */}
          {isPlaying && (
            <>
              <div
                className="absolute w-44 h-44 rounded-full border border-emerald-500/30 animate-ping pointer-events-none"
                style={{ animationDuration: '2s' }}
              />
              <div
                className="absolute w-56 h-56 rounded-full border border-emerald-400/20 pointer-events-none transition-all duration-300"
                style={{
                  transform: `scale(${1 + audioLevel * 0.25})`,
                  opacity: 0.3 + audioLevel * 0.4,
                }}
              />
            </>
          )}

          {/* Teacher Avatar Image Circle */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-emerald-400 via-teal-400 to-amber-300 shadow-2xl ring-2 ring-white/30">
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover rounded-full transition-transform duration-500 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>

          {/* Sound State Badge */}
          <div className="absolute -bottom-2 px-3.5 py-1 rounded-full liquid-glass-card border border-white/20 text-xs font-medium text-white flex items-center gap-2 shadow-xl">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'
              }`}
            />
            <span className="font-semibold">{teacher.name}</span>
          </div>
        </div>

        {/* Audio Frequency Spectrum Visualizer Bars */}
        <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 h-16 pt-2">
          {Array.from({ length: 24 }).map((_, i) => {
            const heightMultiplier = Math.sin((i / 24) * Math.PI);
            const dynamicHeight = isPlaying
              ? Math.max(6, Math.min(60, 50 * heightMultiplier * audioLevel * (0.6 + Math.random() * 0.8)))
              : 6;
            return (
              <span
                key={i}
                className="w-1.5 rounded-full transition-all duration-75 bg-gradient-to-t from-emerald-500 via-teal-400 to-amber-200"
                style={{ height: `${dynamicHeight}px` }}
              />
            );
          })}
        </div>

        {/* Spoken Teleprompter Transcript */}
        <div className="w-full rounded-3xl liquid-glass-card border border-white/18 p-5 sm:p-6 backdrop-blur-2xl text-left shadow-2xl">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              Live Spoken Script
            </span>
            <span className="text-[11px] text-white/50">
              Module: {currentModule.title}
            </span>
          </div>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
            "{currentModule.speechScript}"
          </p>

          <div className="mt-3 pt-3 border-t border-white/15 flex items-start gap-2 text-xs text-emerald-300/90 font-mono">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>Key Takeaway: {currentModule.keyTakeaway}</span>
          </div>
        </div>

        {/* Audio Scrubbing & Quick Navigation Shortcuts */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={onSeekPrev}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-glass-pill text-white/70 hover:text-white text-xs border border-white/15 transition-all"
            title="Previous Section"
          >
            <Rewind className="w-3.5 h-3.5" />
            <span>Prev Section</span>
          </button>

          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-glass-pill text-white/70 hover:text-white text-xs border border-white/15 transition-all"
            title="Replay Current Section"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onSeekNext}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-glass-pill text-white/70 hover:text-white text-xs border border-white/15 transition-all"
            title="Next Section"
          >
            <span>Next Section</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Quick Speed Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15">
            {[0.8, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                  playbackSpeed === s
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
