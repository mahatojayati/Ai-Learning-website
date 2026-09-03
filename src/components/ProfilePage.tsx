import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TEACHERS } from '../data/teachers';
import { User, Globe, Award, BookOpen, Check, ShieldCheck, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import { LearnerLevel, TeacherAvatar } from '../types';
import { testSpeakVoice, selectVoiceForTeacher } from '../utils/speechVoiceHelper';

interface ProfilePageProps {
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Mercer');
  const [level, setLevel] = useState<LearnerLevel>(user?.level || 'intermediate');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    user?.preferredTeacherId || TEACHERS[0].id
  );
  const [isSaved, setIsSaved] = useState(false);

  const selectedTeacher =
    TEACHERS.find((t) => t.id === selectedTeacherId) || TEACHERS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      level,
      preferredLanguage: language,
      preferredTeacherId: selectedTeacherId,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestVoice = (teacher: TeacherAvatar) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const match = selectVoiceForTeacher(
      voices,
      teacher.voiceGender,
      language,
      teacher.voicePitch,
      teacher.voiceRate
    );
    testSpeakVoice(
      match.voice,
      match.pitch,
      match.rate,
      language.toLowerCase().includes('hindi')
        ? `Namaste ${name}! Main ${teacher.name} hoon, aapki AI shikshak.`
        : language.toLowerCase().includes('spanish')
        ? `¡Hola ${name}! Soy ${teacher.name}, tu profesora de inteligencia artificial.`
        : `Hello ${name}! I am ${teacher.name}, your personalized AI mentor.`
    );
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono uppercase mb-3">
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span>Learner Identity & Pedagogical Profile</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Student Settings & Preferences
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Customize your learning velocity, preferred instructional language, and default mentor avatar.
            </p>
          </div>

          {user?.isGuest && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Guest Scholar Mode</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <form onSubmit={handleSave} className="space-y-8">
          <div className="liquid-glass-card border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-sm focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'scholar@kollektiva.ai'}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider">
                  Mastery Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as LearnerLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="beginner" className="bg-zinc-900">Beginner (Foundational analogies)</option>
                  <option value="intermediate" className="bg-zinc-900">Intermediate (Theory & Practice)</option>
                  <option value="advanced" className="bg-zinc-900">Advanced (Mathematical Rigor)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-white/70 tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Instruction & Speech Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="English" className="bg-zinc-900">English (Global)</option>
                  <option value="Hindi" className="bg-zinc-900">Hindi (हिंदी)</option>
                  <option value="Spanish" className="bg-zinc-900">Spanish (Español)</option>
                  <option value="French" className="bg-zinc-900">French (Français)</option>
                  <option value="German" className="bg-zinc-900">German (Deutsch)</option>
                  <option value="Russian" className="bg-zinc-900">Russian (Русский)</option>
                  <option value="Japanese" className="bg-zinc-900">Japanese (日本語)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teacher Selection with Voice Preview */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-medium text-white">Preferred Lead Instructor</h3>
                <p className="text-xs text-white/60">
                  Select your primary faculty mentor. Teachers 1, 2, and 4 feature female voices; the rest feature male voices.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400">
                Selected: {selectedTeacher.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TEACHERS.map((teacher, idx) => {
                const isSelected = teacher.id === selectedTeacherId;
                const isFemale = teacher.voiceGender === 'female';

                return (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-2.5 relative group ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/10 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={teacher.imageUrl}
                        alt={teacher.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/20"
                      />
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center text-[10px] font-mono text-amber-300">
                        {idx + 1}
                      </span>
                      <span
                        className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isFemale ? 'bg-pink-500/80 text-white' : 'bg-sky-500/80 text-white'
                        }`}
                      >
                        {isFemale ? '♀' : '♂'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-white">{teacher.name}</h4>
                      <span className="text-[10px] text-white/60 block">{teacher.role}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestVoice(teacher);
                      }}
                      className="mt-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-white/90 flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Test Voice</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            {isSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 animate-[fadeIn_0.2s_ease]">
                <Check className="w-4 h-4" /> Preferences Saved Successfully!
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-white text-zinc-950 hover:bg-white/90 font-semibold text-xs transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Save Student Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
