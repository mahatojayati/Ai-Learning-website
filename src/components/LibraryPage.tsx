import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SavedLessonRecord, TeacherAvatar } from '../types';
import { TEACHERS } from '../data/teachers';
import { BookOpen, Play, Calendar, Award, Trash2, Globe, Sparkles, ArrowLeft } from 'lucide-react';

interface LibraryPageProps {
  onOpenLesson: (saved: SavedLessonRecord) => void;
  onStartNewLesson: () => void;
  onBack?: () => void;
}

const STORAGE_KEY = 'kollektiva_saved_lessons_v1';

export const LibraryPage: React.FC<LibraryPageProps> = ({ onOpenLesson, onStartNewLesson, onBack }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<SavedLessonRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLessons(JSON.parse(stored));
      } else {
        // Initialize with default session record for first-time orientation
        const initial: SavedLessonRecord[] = [
          {
            id: 'rec-init-1',
            topic: "Ohm's Law & Electrical Circuits",
            title: "Ohm's Law: Voltage, Current, and Resistance in Action",
            teacherName: 'Elena Baranova',
            teacherAvatarUrl: TEACHERS[0].imageUrl,
            language: user?.preferredLanguage || 'English',
            level: 'beginner',
            date: new Date().toLocaleDateString(),
            completed: true,
            score: 100,
            lesson: {
              title: "Ohm's Law: Voltage, Current, and Resistance in Action",
              summary: 'Master the fundamental relationship between electric potential, charge flow, and opposition.',
              subjectCategory: 'physics',
              estimatedTimeMinutes: 20,
              curriculumModules: [],
              learningObjectives: [
                'Understand electric potential difference as the driving force',
                'Analyze how resistance restricts electron flow',
                'Apply I = V / R with confidence',
              ],
              finalAssessment: [],
              recommendedNextTopics: ['Kirchhoff Current Law', 'Series and Parallel Circuits'],
            },
          },
        ];
        setLessons(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.warn(e);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    const updated = lessons.filter((l) => l.id !== id);
    setLessons(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen kollektiva-page-bg text-white font-geist pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
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
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>Personal Learning Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Study Library & Lesson Transcripts
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Review prior AI video sessions, revisit explanations, and track your conceptual growth.
            </p>
          </div>

          <button
            onClick={onStartNewLesson}
            className="px-5 py-2.5 rounded-2xl bg-white text-zinc-950 hover:bg-white/90 font-medium text-xs transition-all flex items-center gap-2 shadow self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Generate New Lesson</span>
          </button>
        </div>

        {/* Lesson Cards */}
        {lessons.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
            <BookOpen className="w-10 h-10 text-white/30 mx-auto" />
            <h3 className="text-lg font-medium text-white">No lessons in your library yet</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              Launch your first AI video classroom lesson on any topic to save notes and progress here.
            </p>
            <button
              onClick={onStartNewLesson}
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold"
            >
              Start First Lesson
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lessons.map((rec) => (
              <div
                key={rec.id}
                className="p-6 rounded-3xl bg-zinc-900/70 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rec.teacherAvatarUrl}
                        alt={rec.teacherName}
                        className="w-9 h-9 rounded-xl object-cover border border-white/20"
                      />
                      <div>
                        <span className="text-xs font-medium text-white block">{rec.teacherName}</span>
                        <span className="text-[11px] text-white/50 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-sky-400" />
                          <span>{rec.language}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/10 capitalize">
                        {rec.level}
                      </span>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove from library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-normal text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-white/70 line-clamp-2">
                    {rec.lesson?.summary || 'Interactive video lesson with visual demonstrations.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    <Calendar className="w-3 h-3" />
                    <span>{rec.date}</span>
                    {rec.score !== undefined && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono font-medium ml-2">
                        <Award className="w-3 h-3" /> {rec.score}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenLesson(rec)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-zinc-950 text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Re-enter Class</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
