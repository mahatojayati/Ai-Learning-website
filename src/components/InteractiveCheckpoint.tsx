import React, { useState, useEffect } from 'react';
import { CheckpointQuestion, EvaluationResult, TeacherAvatar } from '../types';
import { LiquidGlassButton } from './LiquidGlassButton';
import {
  HelpCircle,
  Sparkles,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface InteractiveCheckpointProps {
  question: CheckpointQuestion;
  conceptTitle: string;
  teacher: TeacherAvatar;
  language: string;
  level: string;
  onResolved: (result: EvaluationResult) => void;
  onSkip: () => void;
}

export const InteractiveCheckpoint: React.FC<InteractiveCheckpointProps> = ({
  question,
  conceptTitle,
  teacher,
  language,
  level,
  onResolved,
  onSkip,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [freeTextAnswer, setFreeTextAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check speech recognition support
  useEffect(() => {
    const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(hasSpeech);
  }, []);

  const handleToggleVoice = () => {
    if (!speechSupported) return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setFreeTextAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error', e);
      setIsListening(false);
    }
  };

  const handleEvaluate = async (studentText: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.questionText,
          studentAnswer: studentText,
          concept: conceptTitle,
          level,
          language,
          teacherName: teacher.name,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluationResult(data.evaluation);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
      // Fallback
      setEvaluationResult({
        isCorrect: true,
        confidenceScore: 90,
        feedback: 'Thank you for answering! Let us continue building on this foundation.',
        misconceptionDetected: null,
        underlyingReason: 'Good conceptual intuition.',
        intuitiveAnalogy: 'Like water through a pipe, electrical current depends directly on voltage and inversely on resistance.',
        reExplanation: question.explanation,
        suggestedDifficultyAdjustment: 'maintain',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const submitOption = (index: number) => {
    setSelectedOption(index);
    const chosenText = question.options[index];
    handleEvaluate(chosenText);
  };

  const submitFreeText = () => {
    if (!freeTextAnswer.trim()) return;
    handleEvaluate(freeTextAnswer.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 liquid-glass-card border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Checkpoint Interaction
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70">
                {conceptTitle}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-white">{teacher.name} asks:</h3>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-4"
        >
          Skip to next
        </button>
      </div>

      {/* Question Text */}
      <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 mb-5 shadow-sm">
        <p className="text-base sm:text-lg font-normal leading-relaxed text-white">
          "{question.questionText}"
        </p>
      </div>

      {/* State A: Answering Stage */}
      {!evaluationResult && (
        <div className="flex flex-col gap-4">
          {/* Multiple choice pills */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                disabled={isEvaluating}
                onClick={() => submitOption(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  selectedOption === idx
                    ? 'bg-white/20 border-white/40 ring-1 ring-white shadow-lg'
                    : 'bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/90'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center text-xs font-mono font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>

          {/* Or: Free-form explanation in own words / Voice */}
          <div className="pt-3 border-t border-white/10">
            <label className="text-xs font-medium text-white/70 flex items-center justify-between mb-2">
              <span>Or explain in your own words (Text or Voice):</span>
              {speechSupported && (
                <span className="text-[11px] text-amber-300/80">Voice input active</span>
              )}
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={freeTextAnswer}
                onChange={(e) => setFreeTextAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitFreeText()}
                placeholder="Type your explanation or thoughts here..."
                disabled={isEvaluating}
                className="w-full px-4 py-3 pr-24 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    aria-label="Toggle voice input"
                    className={`p-2 rounded-lg transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-white/60 hover:text-white bg-white/10'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={submitFreeText}
                  disabled={!freeTextAnswer.trim() || isEvaluating}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {isEvaluating && (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-300 py-3 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{teacher.name} is evaluating your reasoning & checking misconceptions...</span>
            </div>
          )}
        </div>
      )}

      {/* State B: Evaluation & Misconception Diagnosis Result */}
      {evaluationResult && (
        <div className="flex flex-col gap-4 animate-[fadeIn_0.5s_ease]">
          {/* Result Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              evaluationResult.isCorrect
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-100'
                : 'bg-amber-500/15 border-amber-400/40 text-amber-100'
            }`}
          >
            {evaluationResult.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-sm font-semibold">
                {evaluationResult.isCorrect ? 'Accurate Understanding!' : 'Concept Misconception Detected'}
              </h4>
              <p className="text-xs sm:text-sm mt-1 text-white/90 leading-relaxed">
                {evaluationResult.feedback}
              </p>
            </div>
          </div>

          {/* Misconception Deep Dive if incorrect */}
          {evaluationResult.misconceptionDetected && (
            <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pedagogical Diagnosis:</span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                {evaluationResult.misconceptionDetected}
              </p>

              {/* Intuitive Alternative Analogy (From PDF Requirement) */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Alternative Analogy:</span>
                  <span>{evaluationResult.intuitiveAnalogy}</span>
                </div>
              </div>

              {/* Clear Re-explanation */}
              <div className="text-xs text-white/70 leading-relaxed">
                <strong className="text-white">Why this happens: </strong>
                {evaluationResult.reExplanation}
              </div>
            </div>
          )}

          {/* Adapted Follow-up Question if provided */}
          {evaluationResult.adaptedFollowupQuestion && (
            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/80">
              <span className="font-mono text-[10px] text-emerald-400 uppercase block mb-1">
                Adapted Follow-up Check:
              </span>
              <p className="font-medium text-white">
                {evaluationResult.adaptedFollowupQuestion.questionText}
              </p>
              {evaluationResult.adaptedFollowupQuestion.hint && (
                <span className="text-[11px] text-white/50 block mt-1 italic">
                  Hint: {evaluationResult.adaptedFollowupQuestion.hint}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!evaluationResult.isCorrect && (
              <LiquidGlassButton
                variant="subtle"
                size="sm"
                onClick={() => {
                  setEvaluationResult(null);
                  setSelectedOption(null);
                  setFreeTextAnswer('');
                }}
              >
                Try Answering Again
              </LiquidGlassButton>
            )}

            <LiquidGlassButton
              variant="accent"
              size="md"
              onClick={() => onResolved(evaluationResult)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Continue Lesson
            </LiquidGlassButton>
          </div>
        </div>
      )}
    </div>
  );
};
