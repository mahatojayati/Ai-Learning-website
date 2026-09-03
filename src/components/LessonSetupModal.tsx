import React, { useState, useEffect } from 'react';
import { SAMPLE_MATERIALS, SampleMaterial } from '../data/sampleMaterials';
import { TEACHERS } from '../data/teachers';
import { DurationOption, LearnerLevel, TeacherAvatar, TeachingStyle, LessonFormat } from '../types';
import { LiquidGlassButton } from './LiquidGlassButton';
import { testSpeakVoice, selectVoiceForTeacher } from '../utils/speechVoiceHelper';
import {
  UploadCloud,
  FileText,
  Clock,
  Sparkles,
  Globe,
  Compass,
  GraduationCap,
  X,
  Check,
  Video,
  Headphones,
  Volume2,
  Play,
} from 'lucide-react';

interface LessonSetupModalProps {
  isOpen: boolean;
  selectedTeacher: TeacherAvatar;
  onClose: () => void;
  onStartLesson: (config: {
    topic: string;
    materialText: string;
    level: LearnerLevel;
    durationMinutes: DurationOption;
    language: string;
    style: TeachingStyle;
    teacher: TeacherAvatar;
    format: LessonFormat;
  }) => void;
  isGenerating: boolean;
}

export const LessonSetupModal: React.FC<LessonSetupModalProps> = ({
  isOpen,
  selectedTeacher,
  onClose,
  onStartLesson,
  isGenerating,
}) => {
  const [topic, setTopic] = useState('Chapter 4: Ohm\'s Law & Electrical Circuits');
  const [materialText, setMaterialText] = useState(SAMPLE_MATERIALS[0].contentSnippet);
  const [level, setLevel] = useState<LearnerLevel>('beginner');
  const [duration, setDuration] = useState<DurationOption>(2);
  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState<TeachingStyle>('analogies');
  const [format, setFormat] = useState<LessonFormat>('video');
  const [activeTeacher, setActiveTeacher] = useState<TeacherAvatar>(selectedTeacher);
  const [teacherFilter, setTeacherFilter] = useState<'all' | 'female' | 'male'>('all');
  const [fileName, setFileName] = useState<string | null>('Physics_Chapter4_Ohm.pdf');
  const [isDragging, setIsDragging] = useState(false);
  const [previewingTeacherId, setPreviewingTeacherId] = useState<string | null>(null);

  // Sync activeTeacher when selectedTeacher prop changes
  useEffect(() => {
    setActiveTeacher(selectedTeacher);
  }, [selectedTeacher.id]);

  if (!isOpen) return null;

  const handleVoicePreview = (t: TeacherAvatar, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingTeacherId(t.id);
    const voices = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
    const match = selectVoiceForTeacher(voices, t.voiceGender, language);
    const samplePhrase = t.voiceGender === 'female'
      ? `Hello! I am ${t.name}. I am excited to guide your lesson in ${t.role.split('•')[1]?.trim() || 'this subject'}.`
      : `Welcome! I am ${t.name}. Let us master ${t.role.split('•')[1]?.trim() || 'this concept'} step by step.`;
    
    testSpeakVoice(match.voice, match.pitch, match.rate, samplePhrase);
    setTimeout(() => setPreviewingTeacherId(null), 3500);
  };

  if (!isOpen) return null;

  const handleSelectSample = (sample: SampleMaterial) => {
    setTopic(sample.title);
    setMaterialText(sample.contentSnippet);
    setFileName(`${sample.id}.txt`);
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setMaterialText(text.slice(0, 15000));
        if (!topic || topic === 'Chapter 4: Ohm\'s Law & Electrical Circuits') {
          setTopic(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    onStartLesson({
      topic: topic.trim() || 'Core Science & Technology Foundations',
      materialText,
      level,
      durationMinutes: duration,
      language,
      style,
      teacher: activeTeacher,
      format,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-[fadeIn_0.2s_ease]">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 liquid-glass-card border border-white/20 shadow-2xl text-white [scrollbar-width:none]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-white/30 shrink-0">
              <img
                src={activeTeacher.imageUrl}
                alt={activeTeacher.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Lesson Planning Studio
              </span>
              <h2 className="text-lg sm:text-xl font-normal text-white">
                Configure Teaching Session with {activeTeacher.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Topic or Upload Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-white/70">
                1. Subject or Learning Material
              </label>
              <span className="text-[11px] text-white/40">Upload or Pick Sample</span>
            </div>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Chapter 4: Ohm's Law in 20 minutes, or Explain Newton's Laws"
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
            />

            {/* Quick Sample Selector buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-white/50 font-mono">Samples:</span>
              {SAMPLE_MATERIALS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all ${
                    topic === s.title
                      ? 'bg-white/25 border-white text-white font-medium shadow-sm'
                      : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.1]'
                  }`}
                >
                  {s.subject}: {s.title.split(':')[1] || s.title}
                </button>
              ))}
            </div>

            {/* Drag and Drop Document Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-white/20 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt,.md,.pdf,.doc,.docx,.json';
                input.onchange = (e: any) => {
                  if (e.target?.files?.[0]) handleFileUpload(e.target.files[0]);
                };
                input.click();
              }}
            >
              <UploadCloud className="w-6 h-6 text-white/60" />
              <div className="text-xs text-white/80">
                <span className="font-semibold text-white">Click or drag & drop</span> textbooks,
                lecture notes, PDF or DOCX
              </div>
              {fileName && (
                <div className="text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <FileText className="w-3.5 h-3.5" />
                  Loaded: {fileName}
                </div>
              )}
            </div>
          </div>

          {/* 2. Learner Level & Available Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Learner Level */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-white/70 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Learner Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as LearnerLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 px-1 text-xs rounded-xl capitalize font-medium border transition-all ${
                      level === lvl
                        ? 'bg-white/25 border-white text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-white/50 block">
                {level === 'beginner' && 'Simple terminology, analogies, fundamental concepts.'}
                {level === 'intermediate' && 'Technical explanations and practical real-world examples.'}
                {level === 'advanced' && 'Mathematical rigor, deep systems theory, edge cases.'}
              </span>
            </div>

            {/* Available Time Budget (Section 7 from PDF) */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-white/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Available Time
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { value: 2, label: '2 min', desc: 'Fast Sprint' },
                  { value: 5, label: '5 min', desc: 'Essentials' },
                  { value: 10, label: '10 min', desc: 'Focused' },
                  { value: 15, label: '15 min', desc: 'Deep Dive' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setDuration(item.value as DurationOption)}
                    className={`py-2 px-1 text-xs rounded-xl font-medium border transition-all text-center ${
                      duration === item.value
                        ? 'bg-white/25 border-white text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-[9px] text-white/50 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Language & Teaching Style (Multilingual - Section 8 from PDF) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-white/70 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Teaching Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['English', 'Hindi', 'Hinglish', 'Spanish', 'French', 'German'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-2 px-2 text-xs rounded-xl font-medium border transition-all ${
                      language === lang
                        ? 'bg-white/25 border-white text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Teaching Style */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-white/70 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Teaching Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'analogies', label: 'Analogies & Visuals' },
                  { id: 'socratic', label: 'Socratic Q&A' },
                  { id: 'practical', label: 'Practical Labs' },
                  { id: 'exam', label: 'Exam & Interview' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id as TeachingStyle)}
                    className={`py-2 px-2 text-xs rounded-xl font-medium border transition-all text-left ${
                      style === s.id
                        ? 'bg-white/25 border-white text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Format Selection: Video Classroom vs Audio Only */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-white/70 block">
                Choose Format
              </span>
              <span className="text-[11px] text-amber-300 font-mono">
                Classroom Video or Audio Only
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('video')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  format === 'video'
                    ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-400 ring-1 ring-emerald-400/50 shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06]'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">Classroom Video</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-mono font-bold">
                      CLASSROOM
                    </span>
                  </div>
                  <p className="text-xs text-white/65 mt-1 leading-relaxed">
                    Watch instructor teach at the blackboard with camera angles, live chalk notes & visualizer.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('audio')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  format === 'audio'
                    ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06]'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">Audio Podcast</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/25 text-cyan-300 font-mono font-bold">
                      AUDIO ONLY
                    </span>
                  </div>
                  <p className="text-xs text-white/65 mt-1 leading-relaxed">
                    Distraction-free audio lesson with real-time waveform, teleprompter transcript & chapter jumps.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Teacher Faculty Selection with full freedom */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase text-white/80 font-medium block">
                  Select Your Instructor Faculty ({TEACHERS.length} Professors)
                </span>
                <span className="text-[11px] text-white/50">
                  Pick any instructor — male or female voices are dynamically synthesized
                </span>
              </div>

              {/* Faculty Filter Buttons */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setTeacherFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    teacherFilter === 'all'
                      ? 'bg-white/20 text-white font-medium shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  All ({TEACHERS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherFilter('female')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    teacherFilter === 'female'
                      ? 'bg-pink-500/25 border border-pink-500/40 text-pink-200 font-medium shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>♀ Female</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherFilter('male')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    teacherFilter === 'male'
                      ? 'bg-sky-500/25 border border-sky-500/40 text-sky-200 font-medium shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>♂ Male</span>
                </button>
              </div>
            </div>

            {/* Grid of All Teachers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 [scrollbar-width:thin]">
              {TEACHERS.filter((t) => {
                if (teacherFilter === 'female') return t.voiceGender === 'female';
                if (teacherFilter === 'male') return t.voiceGender === 'male';
                return true;
              }).map((t) => {
                const isSelected = activeTeacher.id === t.id;
                const isPreviewing = previewingTeacherId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTeacher(t)}
                    className={`p-2.5 rounded-2xl border flex flex-col justify-between gap-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/20 border-white ring-2 ring-white/50 shadow-lg scale-[1.01]'
                        : 'bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <img
                          src={t.imageUrl}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-white/30"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            t.voiceGender === 'female'
                              ? 'bg-pink-600 text-white'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {t.voiceGender === 'female' ? '♀' : '♂'}
                        </span>
                      </div>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white block truncate">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-white/60 block truncate">
                          {t.role.split('•')[1]?.trim() || t.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                      <span
                        className={`font-mono px-1.5 py-0.5 rounded ${
                          t.voiceGender === 'female'
                            ? 'bg-pink-500/20 text-pink-300'
                            : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {t.voiceGender === 'female' ? 'Female Voice' : 'Male Voice'}
                      </span>

                      {/* Test Voice Sample Button */}
                      <button
                        type="button"
                        onClick={(e) => handleVoicePreview(t, e)}
                        className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all ${
                          isPreviewing
                            ? 'bg-emerald-500 text-black font-semibold animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                        }`}
                        title="Listen to teacher voice preview"
                      >
                        {isPreviewing ? (
                          <>
                            <Volume2 className="w-3 h-3 animate-spin" />
                            <span>Speaking...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5" />
                            <span>Preview</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/15">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <LiquidGlassButton
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isGenerating}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {isGenerating
                ? 'Synthesizing Lesson...'
                : format === 'video'
                ? 'Launch Classroom Video Lesson'
                : 'Launch Audio Podcast Lesson'}
            </LiquidGlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};
