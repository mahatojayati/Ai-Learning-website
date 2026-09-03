import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TEACHERS } from '../data/teachers';
import { BrainCircuit, Sparkles, HelpCircle, CheckCircle, AlertTriangle, ArrowRight, RotateCcw, Volume2, Loader2, ArrowLeft } from 'lucide-react';
import { LearnerLevel, TeacherAvatar } from '../types';
import { selectVoiceForTeacher, testSpeakVoice } from '../utils/speechVoiceHelper';

interface PracticeQuestion {
  id: string;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  misconceptionAnalysis: {
    correctReason: string;
    distractorExplanations: string[];
  };
  hint: string;
  relatedConcept: string;
}

interface PracticePageProps {
  onBack?: () => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onBack }) => {
  const { user } = useAuth();

  const [topic, setTopic] = useState('Newtonian Mechanics & Inertial Frames');
  const [level, setLevel] = useState<LearnerLevel>(user?.level || 'intermediate');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAvatar>(TEACHERS[5]); // Oleg Kravtsov (Diagnostic specialist)

  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleGenerateQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setSelectedIndex(null);
    setHasSubmitted(false);
    setShowHint(false);

    try {
      const res = await fetch('/api/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          level,
          language,
          teacherName: selectedTeacher.name,
        }),
      });

      const data = await res.json();
      if (data.practice) {
        setQuestion(data.practice);
      }
    } catch (err) {
      console.error('Failed to generate practice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakFeedback = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const match = selectVoiceForTeacher(
      voices,
      selectedTeacher.voiceGender,
      language,
      selectedTeacher.voicePitch,
      selectedTeacher.voiceRate
    );
    testSpeakVoice(match.voice, match.pitch, match.rate, text);
  };

  return (
    <div className="min-h-screen kollektiva-page-bg text-white font-geist pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-400 font-mono uppercase mb-3">
              <BrainCircuit className="w-3.5 h-3.5 text-sky-300" />
              <span>AI Cognitive Misconception Arena</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Adaptive Practice & Diagnostics
            </h1>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Zero static question banks. Every challenge is synthesized in real-time by AI to test deep conceptual understanding and pinpoint exact mental models.
            </p>
          </div>

          {/* Instructor indicator */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
            <img
              src={selectedTeacher.imageUrl}
              alt={selectedTeacher.name}
              className="w-12 h-12 rounded-xl object-cover border border-white/20"
            />
            <div>
              <span className="text-xs text-white/60 block">Diagnostic Examiner</span>
              <span className="text-sm font-medium text-white">{selectedTeacher.name}</span>
              <span className="text-[11px] text-sky-400 block">
                {selectedTeacher.voiceGender === 'female' ? '♀ Female Voice' : '♂ Male Voice'}
              </span>
            </div>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <form onSubmit={handleGenerateQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Target Topic to Practice
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Electromagnetic Induction, Dynamic Programming, Photosynthesis..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400"
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
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Difficulty:</span>
                {(['beginner', 'intermediate', 'advanced'] as LearnerLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border transition-all ${
                      level === lvl
                        ? 'bg-white text-zinc-950 border-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-white/90 font-medium text-xs transition-all flex items-center gap-2 shadow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Question...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
                    <span>Generate AI Question in {language}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Question Area */}
        {question && (
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Question Scenario */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-sky-400">
                  Concept: {question.relatedConcept}
                </span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-amber-300/90 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              </div>

              {showHint && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                  💡 <strong>Hint:</strong> {question.hint}
                </div>
              )}

              {question.scenario && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed font-serif italic">
                  "{question.scenario}"
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-normal text-white leading-snug">
                {question.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrect = idx === question.correctIndex;

                let borderClass = 'border-white/10 hover:border-white/20 bg-white/5';
                if (hasSubmitted) {
                  if (isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    borderClass = 'border-rose-500 bg-rose-500/20 text-rose-200';
                  } else {
                    borderClass = 'opacity-40 border-white/5 bg-transparent';
                  }
                } else if (isSelected) {
                  borderClass = 'border-sky-400 bg-sky-500/20 text-white';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-start gap-3.5 ${borderClass}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/15 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {hasSubmitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasSubmitted && isSelected && !isCorrect && (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Action */}
            {!hasSubmitted ? (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={selectedIndex === null}
                  onClick={() => setHasSubmitted(true)}
                  className="w-full py-3 rounded-2xl bg-white text-zinc-950 hover:bg-white/90 font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <span>Submit Diagnostic Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                {/* Result Feedback Banner */}
                <div
                  className={`p-5 rounded-2xl border ${
                    selectedIndex === question.correctIndex
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase font-bold tracking-wider">
                      {selectedIndex === question.correctIndex
                        ? '✓ Correct Reasoning'
                        : '⚠ Misconception Identified'}
                    </span>
                    <button
                      onClick={() =>
                        handleSpeakFeedback(
                          selectedIndex === question.correctIndex
                            ? question.misconceptionAnalysis.correctReason
                            : question.misconceptionAnalysis.distractorExplanations[selectedIndex!] ||
                              question.misconceptionAnalysis.correctReason
                        )
                      }
                      className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Instructor</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-white/90">
                    {selectedIndex === question.correctIndex
                      ? question.misconceptionAnalysis.correctReason
                      : question.misconceptionAnalysis.distractorExplanations[selectedIndex!] ||
                        `You selected an incorrect model. Correct principle: ${question.misconceptionAnalysis.correctReason}`}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleGenerateQuestion}
                    className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-white/90 text-xs font-semibold transition-all flex items-center gap-2 shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Next Adaptive Challenge</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
