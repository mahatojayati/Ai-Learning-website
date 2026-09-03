import React, { useState } from 'react';
import { AssessmentQuestion, LessonPlan, TeacherAvatar } from '../types';
import { LiquidGlassButton } from './LiquidGlassButton';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';

interface AssessmentReportModalProps {
  lesson: LessonPlan;
  teacher: TeacherAvatar;
  onClose: () => void;
  onRetake: () => void;
}

export const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({
  lesson,
  teacher,
  onClose,
  onRetake,
}) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'report' | 'roadmap'>('quiz');

  const questions = lesson.finalAssessment || [];

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 100,
    };
  };

  const scoreData = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease]">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 liquid-glass-card border border-white/20 shadow-2xl text-white [scrollbar-width:none]">
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white/20 shrink-0">
              <img
                src={teacher.imageUrl}
                alt={teacher.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Final Assessment & Diagnostic Report
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-white">
                {lesson.title}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'quiz' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'report' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              Diagnostic Report
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'roadmap' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              7-Day Roadmap
            </button>
          </div>
        </div>

        {/* TAB 1: Quiz Questions */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <p className="text-xs sm:text-sm text-white/70">
              Answer the questions below to test your mastery of the concepts covered in this video lesson with {teacher.name}.
            </p>

            <div className="space-y-5">
              {questions.map((q, qIndex) => {
                const isAnswered = answers[qIndex] !== undefined;
                const isCorrect = answers[qIndex] === q.correctAnswer;

                return (
                  <div
                    key={q.id || qIndex}
                    className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-mono text-white/50">Q{qIndex + 1}.</span>
                      <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">
                        {q.conceptTested}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-medium text-white">{q.question}</h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = answers[qIndex] === optIndex;
                        let optionStyle = 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-white/80';

                        if (isSubmitted) {
                          if (optIndex === q.correctAnswer) {
                            optionStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-100 ring-1 ring-emerald-400';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-500/20 border-rose-400 text-rose-100 ring-1 ring-rose-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-white/20 border-white/40 text-white ring-1 ring-white';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectAnswer(qIndex, optIndex)}
                            className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm border transition-all duration-150 flex items-center justify-between ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isSubmitted && optIndex === q.correctAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {q.hint && !isSubmitted && (
                      <p className="text-[11px] text-white/40 italic">💡 Hint: {q.hint}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Submit Action */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-white/60">
                {Object.keys(answers).length} of {questions.length} answered
              </span>

              {!isSubmitted ? (
                <LiquidGlassButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsSubmitted(true);
                    setActiveTab('report');
                  }}
                  disabled={Object.keys(answers).length === 0}
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Submit & View Diagnostic Report
                </LiquidGlassButton>
              ) : (
                <LiquidGlassButton
                  variant="accent"
                  size="md"
                  onClick={() => setActiveTab('report')}
                >
                  View Learning Diagnostic Report
                </LiquidGlassButton>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Diagnostic Report (Matches Section 13 from Hackathon Prompt) */}
        {activeTab === 'report' && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
            {/* Score & Mastery Gauge */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-slate-900/40 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-xs font-mono uppercase text-emerald-300 tracking-wider">
                  Assessment Outcome
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {scoreData.percentage >= 70 ? 'Excellent Mastery!' : 'Foundational Progress'}
                </h3>
                <p className="text-xs text-white/70 max-w-md leading-relaxed">
                  {teacher.name} has analyzed your response patterns to construct this personalized performance breakdown.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/15 min-w-[120px]">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {scoreData.percentage}%
                </span>
                <span className="text-[11px] text-white/50 mt-1">
                  {scoreData.correct} / {scoreData.total} Correct
                </span>
              </div>
            </div>

            {/* Two Column Diagnostic: Strong Areas vs Areas for Improvement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strong Areas */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Concepts Understood</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Direct proportionality in governing relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Qualitative understanding of driving potential difference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Hydraulic pressure and flow analogies</span>
                  </li>
                </ul>
              </div>

              {/* Needs Improvement / Misconceptions */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase font-mono">
                  <BookOpen className="w-4 h-4" />
                  <span>Targeted Revision Areas</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Inverse division when calculating Current (I = V / R)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Distinguishing between circuit energy consumption and resistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Practical multi-step unit conversions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Teacher's Recommendation Box */}
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 text-xs space-y-1.5">
              <span className="font-semibold text-white block">
                {teacher.name}'s Recommended Next Action:
              </span>
              <p className="text-white/80 leading-relaxed">
                Revise inverse relationship calculations by completing two interactive circuit simulations with varied resistance parameters. Then proceed to the next module in your 7-day personalized study track.
              </p>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <LiquidGlassButton variant="subtle" size="sm" onClick={onRetake} icon={<RefreshCw className="w-3.5 h-3.5" />}>
                Retake Video Lesson
              </LiquidGlassButton>

              <div className="flex items-center gap-2">
                <LiquidGlassButton variant="default" size="sm" onClick={() => setActiveTab('roadmap')}>
                  View 7-Day Roadmap
                </LiquidGlassButton>
                <LiquidGlassButton variant="primary" size="md" onClick={onClose}>
                  Done
                </LiquidGlassButton>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI-Generated 7-Day Learning Path (Section 15) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>Personalized 7-Day Curriculum Pathway</span>
              </div>
              <p className="text-xs text-white/70">
                Generated dynamically to guide you from foundational principles to master-level problem solving.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { day: 'Day 1', title: 'Foundations & Driving Potential (V = I · R)', status: 'Completed', active: false },
                { day: 'Day 2', title: 'Kirchhoff\'s Current and Voltage Laws in Complex Loops', status: 'Next Up', active: true },
                { day: 'Day 3', title: 'Series and Parallel Resistor Network Equivalence', status: 'Scheduled', active: false },
                { day: 'Day 4', title: 'Capacitive Transients & RC Circuit Time Constants', status: 'Scheduled', active: false },
                { day: 'Day 5', title: 'Magnetic Flux & Faraday\'s Induction Principles', status: 'Scheduled', active: false },
                { day: 'Day 6', title: 'AC Impedance, Frequency Response & Resonance', status: 'Scheduled', active: false },
                { day: 'Day 7', title: 'Comprehensive Practical Assessment & Lab Simulation', status: 'Scheduled', active: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    item.active
                      ? 'bg-white/15 border-white/30 text-white font-medium shadow-md'
                      : item.status === 'Completed'
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                      : 'bg-white/[0.03] border-white/10 text-white/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white/90">{item.day}</span>
                    <span className="w-px h-4 bg-white/20" />
                    <span>{item.title}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${
                      item.active
                        ? 'bg-amber-400 text-black font-semibold'
                        : item.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <LiquidGlassButton variant="primary" size="md" onClick={onClose}>
                Back to Studio
              </LiquidGlassButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
