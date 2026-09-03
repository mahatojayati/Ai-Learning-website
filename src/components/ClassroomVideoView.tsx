import React, { useState, useEffect, useRef } from 'react';
import { TeacherAvatar, CurriculumModule, SubjectCategory } from '../types';
import { SubjectVisualizer } from './SubjectVisualizer';
import {
  Video,
  Camera,
  Maximize2,
  Minimize2,
  Hand,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Radio,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Subtitles,
  Settings,
  UserCheck,
} from 'lucide-react';

interface ClassroomVideoViewProps {
  teacher: TeacherAvatar;
  currentModule: CurriculumModule;
  currentModuleIndex: number;
  totalModules: number;
  isPlaying: boolean;
  audioLevel: number;
  category: SubjectCategory;
  language: string;
  onRaiseHand: () => void;
  voiceLabel?: string;
  onTogglePlay: () => void;
  onNextModule: () => void;
  onPrevModule: () => void;
  playbackRate?: number;
  onChangePlaybackRate?: (rate: number) => void;
  onSwitchTeacher?: () => void;
}

type CameraAngle = 'wide' | 'board' | 'instructor';

export const ClassroomVideoView: React.FC<ClassroomVideoViewProps> = ({
  teacher,
  currentModule,
  currentModuleIndex,
  totalModules,
  isPlaying,
  audioLevel,
  category,
  language,
  onRaiseHand,
  voiceLabel,
  onTogglePlay,
  onNextModule,
  onPrevModule,
  playbackRate = 1.0,
  onChangePlaybackRate,
  onSwitchTeacher,
}) => {
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('wide');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chalkStep, setChalkStep] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [quality, setQuality] = useState<'1080p' | '4K'>('1080p');
  const [lipPhase, setLipPhase] = useState(0);

  // Video playback second counter for authentic video player timeline
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setVideoSeconds((prev) => prev + 1);
        setLipPhase((prev) => (prev + 1) % 4);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Reset or initialize video seconds on module switch
  useEffect(() => {
    setVideoSeconds(0);
    setChalkStep(0);
    const chalkTimer = setInterval(() => {
      setChalkStep((prev) => Math.min(prev + 1, 3));
    }, 1500);
    return () => clearInterval(chalkTimer);
  }, [currentModule.id]);

  const toggleFullscreen = () => {
    const el = document.getElementById('classroom-video-viewport');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isHindi = language.toLowerCase().includes('hindi') || language.toLowerCase().includes('hinglish');

  // Format video seconds as mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Estimate module duration based on script length
  const totalModuleSeconds = Math.max(45, Math.floor((currentModule.speechScript.split(' ').length / 2.5)));
  const progressRatio = Math.min(1, videoSeconds / totalModuleSeconds);

  return (
    <div
      id="classroom-video-viewport"
      className="relative w-full h-full flex flex-col rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-b from-slate-950 via-zinc-950 to-slate-900 select-none transition-all"
    >
      {/* 1. Camera Studio HUD & Live Broadcast Header */}
      <div className="relative z-30 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-auto border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] tracking-wider font-semibold">
            <span className={`w-2 h-2 rounded-full bg-rose-500 ${isPlaying ? 'animate-ping' : ''}`} />
            LIVE CLASSROOM VIDEO
          </span>

          <button
            type="button"
            onClick={() => setQuality((q) => (q === '1080p' ? '4K' : '1080p'))}
            className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/80 transition-colors"
            title="Toggle video resolution"
          >
            {quality} 60FPS
          </button>

          {/* Teacher Switcher Button right on the video HUD */}
          {onSwitchTeacher && (
            <button
              type="button"
              onClick={onSwitchTeacher}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 text-[11px] font-medium transition-all"
              title="Click to choose a different instructor"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Teacher:</span>
              <span className="font-semibold text-white truncate max-w-[120px]">{teacher.name}</span>
              <span className="text-[10px] font-mono text-amber-300">({teacher.voiceGender === 'female' ? '♀' : '♂'})</span>
            </button>
          )}

          {voiceLabel && (
            <span className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
              <Volume2 className="w-3 h-3" />
              {teacher.voiceGender === 'female' ? '♀ Female Voice Track' : '♂ Male Voice Track'}
            </span>
          )}
        </div>

        {/* Camera Angle Switcher & Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-black/50 backdrop-blur-md rounded-xl p-1 border border-white/15">
            <button
              type="button"
              onClick={() => setCameraAngle('wide')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                cameraAngle === 'wide'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Wide Classroom Angle (Teacher + Chalkboard)"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">Wide Stage</span>
            </button>
            <button
              type="button"
              onClick={() => setCameraAngle('board')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                cameraAngle === 'board'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Blackboard Close-up"
            >
              <Radio className="w-3 h-3" />
              <span className="hidden sm:inline">Board Zoom</span>
            </button>
            <button
              type="button"
              onClick={() => setCameraAngle('instructor')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                cameraAngle === 'instructor'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Instructor Close-up"
            >
              <Camera className="w-3 h-3" />
              <span className="hidden sm:inline">Instructor</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRaiseHand}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all"
            title="Raise Hand to Ask Question"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Raise Hand</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-white/70 hover:text-white border border-white/15 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Classroom'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main Classroom Video Stage Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between">
        {/* Layer A: Ambient Classroom Wall & Lecture Lighting */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/25 via-slate-950/90 to-black pointer-events-none" />

        {/* Dynamic Classroom Layout depending on Camera Angle */}
        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-stretch p-3 sm:p-5 pt-3 pb-16 gap-4 overflow-hidden">
          {/* TEACHER IN CLASSROOM: Realistic Animated Video Presentation */}
          {(cameraAngle === 'wide' || cameraAngle === 'instructor') && (
            <div
              className={`relative flex flex-col justify-between rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-500 ${
                cameraAngle === 'instructor'
                  ? 'w-full max-w-4xl mx-auto h-full'
                  : 'w-full lg:w-5/12 h-64 lg:h-full shrink-0'
              }`}
            >
              {/* Classroom Podium & Teacher Video Feed */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-top filter contrast-105 brightness-95 transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Animated Lecturer Lip-Sync & Breathing Effect when speaking */}
                {isPlaying && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Synchronized speech wave aura */}
                    <div
                      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl transition-opacity duration-150"
                      style={{
                        background: teacher.voiceGender === 'female' ? 'rgba(244, 114, 182, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        opacity: 0.3 + audioLevel * 0.7,
                      }}
                    />

                    {/* Animated mouth phoneme speech indicator */}
                    {audioLevel > 0.04 && (
                      <div className="absolute top-[48%] left-[50.5%] -translate-x-1/2 -translate-y-1/2">
                        <div
                          className="rounded-full bg-[#831843]/60 blur-[1px] transition-all duration-100"
                          style={{
                            width: `${14 + audioLevel * 16}px`,
                            height: `${4 + audioLevel * 12}px`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Animated Teaching Aura & Subtle Classroom Lighting Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35" />
                
                {/* Spotlight effect on teacher */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Teaching Live Laser Pointer Beam when speaking */}
                {isPlaying && (
                  <div
                    className="absolute z-20 pointer-events-none transition-all duration-300"
                    style={{
                      right: '10%',
                      top: `${32 + Math.sin(videoSeconds * 2 + audioLevel * 8) * 18}%`,
                    }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_14px_#ef4444] animate-pulse" />
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent to-red-500 opacity-60" />
                  </div>
                )}
              </div>

              {/* Classroom OSD Badge (Teacher details + voice indicator) */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/75 backdrop-blur-xl px-2.5 py-1.5 rounded-xl border border-white/15">
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                      }`}
                    />
                    <span
                      className={`absolute w-2.5 h-2.5 rounded-full ${
                        isPlaying ? 'bg-emerald-400' : 'bg-white/40'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block leading-tight">
                      {teacher.name}
                    </span>
                    <span className="text-[10px] text-white/60 font-mono">
                      Lecturer • {teacher.voiceGender === 'female' ? '♀ Female Vocal' : '♂ Male Vocal'}
                    </span>
                  </div>
                </div>

                {/* Real-time speech equalizer bars */}
                {isPlaying && (
                  <div className="flex items-end gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
                    {[35, 70, 95, 55, 80, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full transition-all duration-100"
                        style={{ height: `${Math.max(4, h * (audioLevel || 0.2))}px` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Big Centered Play Button when paused */}
              {!isPlaying && (
                <div
                  onClick={onTogglePlay}
                  className="absolute inset-0 z-25 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 group-hover:bg-white/30 border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all transform group-hover:scale-110">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <span className="mt-3 text-xs font-mono tracking-wider uppercase text-white font-medium bg-black/60 px-3 py-1 rounded-full border border-white/20">
                    ▶ Play Video Lecture
                  </span>
                </div>
              )}

              {/* Bottom Classroom Lecture Notes on Teacher Stage */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/70">
                  <span className="text-amber-300">
                    MODULE {currentModuleIndex + 1}/{totalModules}
                  </span>
                  <span className="text-white/50 capitalize">{currentModule.type} Section</span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                  {currentModule.title}
                </h4>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {currentModule.keyTakeaway}
                </p>
              </div>
            </div>
          )}

          {/* CLASSROOM CHALKBOARD / SMARTBOARD STAGE */}
          {(cameraAngle === 'wide' || cameraAngle === 'board') && (
            <div
              className={`relative flex-1 h-full rounded-2xl overflow-hidden border-4 border-[#2b211a] shadow-2xl flex flex-col justify-between transition-all duration-500 bg-[#14231b] ${
                cameraAngle === 'board' ? 'w-full max-w-5xl mx-auto' : ''
              }`}
              style={{
                backgroundImage: `radial-gradient(#1c3126 1px, transparent 1px), radial-gradient(#1c3126 1px, #14231b 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            >
              {/* Slate Chalkboard Wooden Frame & Top Chalk Tray Lighting */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#3a2c22] to-[#251b14] border-b border-[#4d3b2f] flex items-center justify-between px-3 z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9fc7ab]/80 font-bold">
                    Classroom Smartboard • {category.toUpperCase()}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/40">
                  {isHindi ? 'लाइव क्लासरूम' : 'ACTIVE BLACKBOARD'}
                </span>
              </div>

              {/* Main Blackboard Content: Subject Visualizer + Chalk Notes */}
              <div className="relative z-10 flex-1 p-3 sm:p-5 pt-8 overflow-y-auto flex flex-col justify-between [scrollbar-width:none]">
                <div className="flex-1 flex flex-col justify-center">
                  <SubjectVisualizer
                    visualType={currentModule.visualType}
                    content={currentModule.visualContent}
                    category={category}
                    isHindiOrHinglish={isHindi}
                  />
                </div>

                {/* Interactive Blackboard Chalk Notes at the bottom */}
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-[#2d4739] backdrop-blur-sm text-left">
                  <div className="flex items-center gap-1.5 text-xs text-amber-200/90 font-mono mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Teacher's Live Board Notes:</span>
                  </div>
                  <p className="text-xs text-emerald-100/90 font-mono leading-relaxed">
                    {chalkStep >= 0 && (
                      <span className="text-white/95">{currentModule.keyTakeaway}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Bottom Chalk Tray with Virtual Chalks & Eraser */}
              <div className="relative z-20 h-4 bg-gradient-to-r from-[#2a1d15] via-[#3a2c22] to-[#2a1d15] border-t border-[#4d3b2f] flex items-center px-4 gap-2">
                <div className="w-6 h-1.5 rounded-sm bg-white/90 shadow-sm" title="White Chalk" />
                <div className="w-6 h-1.5 rounded-sm bg-amber-300/90 shadow-sm" title="Yellow Chalk" />
                <div className="w-6 h-1.5 rounded-sm bg-sky-300/90 shadow-sm" title="Blue Chalk" />
                <div className="w-10 h-2 rounded-sm bg-stone-700 border border-stone-600 ml-2" title="Chalk Eraser" />
              </div>
            </div>
          )}
        </div>

        {/* Live Subtitles Ticker (if enabled) */}
        {showSubtitles && (
          <div className="absolute bottom-16 left-4 right-4 z-25 pointer-events-none flex justify-center">
            <div className="max-w-2xl bg-black/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center text-xs sm:text-sm text-white/95 shadow-2xl leading-relaxed">
              <span className="text-amber-300 font-mono mr-1.5 font-bold">[{teacher.name}]:</span>
              <span>{currentModule.speechScript.slice(0, 180)}...</span>
            </div>
          </div>
        )}

        {/* 3. Comprehensive Video Lecture Player Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/90 to-black/40 border-t border-white/15 px-3 sm:px-6 py-2.5 flex flex-col gap-1.5">
          {/* Video Timeline Scrubber Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/60 min-w-[34px]">
              {formatTime(videoSeconds)}
            </span>
            <div
              onClick={onTogglePlay}
              className="relative flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group overflow-hidden"
            >
              {/* Buffer Bar */}
              <div
                className="absolute top-0 left-0 bottom-0 bg-white/30 rounded-full"
                style={{ width: `${Math.min(100, (progressRatio + 0.2) * 100)}%` }}
              />
              {/* Active Progress Bar */}
              <div
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/60 min-w-[34px]">
              {formatTime(totalModuleSeconds)}
            </span>
          </div>

          {/* Player Controls Row */}
          <div className="flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all transform active:scale-95"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              {/* Prev Module */}
              <button
                type="button"
                onClick={onPrevModule}
                disabled={currentModuleIndex === 0}
                className="p-1.5 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Module"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Next Module */}
              <button
                type="button"
                onClick={onNextModule}
                className="p-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
                title="Next Module"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume / Mute */}
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Subtitles Toggle */}
              <button
                type="button"
                onClick={() => setShowSubtitles((s) => !s)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  showSubtitles ? 'text-emerald-400 bg-emerald-500/15' : 'text-white/50 hover:text-white'
                }`}
                title="Toggle Subtitles / CC"
              >
                <Subtitles className="w-4 h-4" />
                <span className="hidden md:inline text-[10px] font-mono">CC</span>
              </button>

              {/* Playback Speed */}
              {onChangePlaybackRate && (
                <div className="flex items-center bg-white/10 rounded-lg px-1.5 py-0.5">
                  {[1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => onChangePlaybackRate(rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        playbackRate === rate ? 'bg-white/30 text-white font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-white/70 hover:text-white transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
