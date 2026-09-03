import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TEACHERS } from '../data/teachers';
import { Sparkles, BookOpen, Clock, Layers, ArrowRight, CheckCircle2, Loader2, Play, ArrowLeft } from 'lucide-react';
import { LearnerLevel, TeacherAvatar } from '../types';

interface CurriculumChapter {
  chapterNumber: number;
  title: string;
  description: string;
  keyConcepts: string[];
  estimatedHours: number;
  difficulty: string;
  practicalProject: string;
}

interface CurriculumData {
  curriculumTitle: string;
  overview: string;
  estimatedWeeks: number;
  prerequisites: string[];
  chapters: CurriculumChapter[];
  capstoneProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
}

interface CurriculumPageProps {
  onStartLessonOnTopic: (topic: string, teacher: TeacherAvatar, level: LearnerLevel, language: string) => void;
  onBack?: () => void;
}

export const CurriculumPage: React.FC<CurriculumPageProps> = ({ onStartLessonOnTopic, onBack }) => {
  const { user } = useAuth();

  const [subjectGoal, setSubjectGoal] = useState('Quantum Computing & Qubit Superposition');
  const [level, setLevel] = useState<LearnerLevel>(user?.level || 'intermediate');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [priorKnowledge, setPriorKnowledge] = useState('Basic linear algebra and Python basics');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAvatar>(TEACHERS[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);

  const handleGenerateCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectGoal.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectGoal,
          level,
          language,
          weeklyHours,
          teacherName: selectedTeacher.name,
          priorKnowledge,
        }),
      });

      const data = await res.json();
      if (data.curriculum) {
        setCurriculum(data.curriculum);
      }
    } catch (err) {
      console.error('Failed to generate curriculum:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen kollektiva-page-bg text-white font-geist pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Navigation Action */}
        {onBack && (
          <div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all shadow-sm hover:scale-[1.02]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI-Driven Dynamic Curriculum Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Personalized Syllabus Generator
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-2xl">
              Zero static presets. Kollektiva uses generative pedagogy to design an adaptive, multi-week learning plan calibrated to your specific objectives and language.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
            <img
              src={selectedTeacher.imageUrl}
              alt={selectedTeacher.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/20"
            />
            <div>
              <span className="text-xs text-white/60 block">Academic Mentor</span>
              <span className="text-sm font-medium text-white">{selectedTeacher.name}</span>
              <span className="text-[11px] text-emerald-400 block">{selectedTeacher.specialty}</span>
            </div>
          </div>
        </div>

        {/* Input Generator Card */}
        <div className="liquid-glass-card border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <form onSubmit={handleGenerateCurriculum} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Target Subject / Goal */}
              <div className="lg:col-span-2 space-y-2">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Target Topic / Learning Ambition
                </label>
                <input
                  type="text"
                  value={subjectGoal}
                  onChange={(e) => setSubjectGoal(e.target.value)}
                  placeholder="e.g. Statistical Mechanics, Neural Attention Mechanisms, Multivariable Calculus..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                />
              </div>

              {/* Weekly Hours */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Available Pacing (Hours / Week)
                </label>
                <div className="flex items-center gap-2">
                  {[3, 6, 10, 15].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setWeeklyHours(hrs)}
                      className={`flex-1 py-3 rounded-xl text-xs font-medium border transition-all ${
                        weeklyHours === hrs
                          ? 'bg-white text-zinc-950 border-white shadow'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {hrs} hrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Level */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Target Mastery Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as LearnerLevel)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="beginner" className="bg-zinc-900">Beginner (First Principles & Intuition)</option>
                  <option value="intermediate" className="bg-zinc-900">Intermediate (Theory + Application)</option>
                  <option value="advanced" className="bg-zinc-900">Advanced (Mathematical Rigor & Edge Cases)</option>
                </select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Syllabus & Explanation Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="English" className="bg-zinc-900">English</option>
                  <option value="Hindi" className="bg-zinc-900">Hindi (हिंदी)</option>
                  <option value="Spanish" className="bg-zinc-900">Spanish (Español)</option>
                  <option value="French" className="bg-zinc-900">French (Français)</option>
                  <option value="German" className="bg-zinc-900">German (Deutsch)</option>
                  <option value="Russian" className="bg-zinc-900">Russian (Русский)</option>
                  <option value="Japanese" className="bg-zinc-900">Japanese (日本語)</option>
                </select>
              </div>

              {/* Assigned Teacher */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Lead Instructor Avatar
                </label>
                <select
                  value={selectedTeacher.id}
                  onChange={(e) => {
                    const found = TEACHERS.find((t) => t.id === e.target.value);
                    if (found) setSelectedTeacher(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {TEACHERS.map((t, idx) => (
                    <option key={t.id} value={t.id} className="bg-zinc-900">
                      {idx + 1}. {t.name} ({t.voiceGender === 'female' ? '♀ Female' : '♂ Male'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prior Knowledge */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                Current Background / Prior Familiarity (Optional)
              </label>
              <input
                type="text"
                value={priorKnowledge}
                onChange={(e) => setPriorKnowledge(e.target.value)}
                placeholder="What have you already studied? e.g. College algebra, high school physics..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-zinc-950 hover:bg-white/90 font-semibold text-sm transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Synthesizing Tailored Curriculum with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Generate Personalized Curriculum in {language}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Render Generated Curriculum */}
        {curriculum && (
          <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
            {/* Overview Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-normal text-white">
                  {curriculum.curriculumTitle}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-emerald-300">
                    Duration: ~{curriculum.estimatedWeeks} Weeks
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-sky-300">
                    Lang: {language}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed max-w-3xl mb-4">
                {curriculum.overview}
              </p>

              {curriculum.prerequisites?.length > 0 && (
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-white/60">Prerequisites:</span>
                  {curriculum.prerequisites.map((p, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white/90">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Chapters Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Pedagogical Chapters & Video Modules</span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {curriculum.chapters.map((ch) => (
                  <div
                    key={ch.chapterNumber}
                    className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono text-xs text-amber-300 font-bold">
                          {ch.chapterNumber}
                        </span>
                        <h4 className="text-base font-medium text-white">{ch.title}</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 font-mono capitalize">
                          {ch.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">{ch.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {ch.keyConcepts?.map((kc, kidx) => (
                          <span
                            key={kidx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>

                      {ch.practicalProject && (
                        <div className="text-xs text-sky-300/90 pt-1 flex items-center gap-1.5">
                          <span className="font-semibold text-white/60">Hands-on:</span>
                          <span>{ch.practicalProject}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                      <div className="text-right text-xs text-white/50 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{ch.estimatedHours} Hours</span>
                      </div>

                      <button
                        onClick={() =>
                          onStartLessonOnTopic(
                            ch.title,
                            selectedTeacher,
                            level,
                            language
                          )
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-white/90 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Launch Video Lesson</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Project Section */}
            {curriculum.capstoneProject && (
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10">
                <div className="flex items-center gap-2 text-amber-300 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">Culminating Milestone</span>
                </div>
                <h4 className="text-lg font-medium text-white mb-2">
                  {curriculum.capstoneProject.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed mb-4 max-w-3xl">
                  {curriculum.capstoneProject.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {curriculum.capstoneProject.deliverables?.map((d, didx) => (
                    <span key={didx} className="text-xs px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-white/80">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
