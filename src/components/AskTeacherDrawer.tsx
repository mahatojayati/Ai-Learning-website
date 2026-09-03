import React, { useState } from 'react';
import { TeacherAvatar, CurriculumModule } from '../types';
import { LiquidGlassButton } from './LiquidGlassButton';
import { MessageSquare, X, Send, Sparkles, Volume2 } from 'lucide-react';

interface AskTeacherDrawerProps {
  teacher: TeacherAvatar;
  currentTopic: string;
  currentModule?: CurriculumModule;
  language: string;
  isOpen: boolean;
  onClose: () => void;
  onSpeakText: (text: string) => void;
}

export const AskTeacherDrawer: React.FC<AskTeacherDrawerProps> = ({
  teacher,
  currentTopic,
  currentModule,
  language,
  isOpen,
  onClose,
  onSpeakText,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'teacher'; text: string; tip?: string }>
  >([
    {
      sender: 'teacher',
      text: `Hello! I'm ${teacher.name}. What questions do you have about ${currentModule?.title || currentTopic}? Feel free to ask in ${language}!`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || isLoading) return;

    const userMsg = q.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          currentTopic,
          currentModule,
          language,
          teacherName: teacher.name,
        }),
      });
      const data = await res.json();
      const teacherAnswer =
        data.response?.answerScript ||
        `When exploring this concept, keep the core relation in mind. Every variable shifts with mathematical regularity.`;
      const quickTip = data.response?.quickTip;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'teacher',
          text: teacherAnswer,
          tip: quickTip,
        },
      ]);
      // Speak the answer through natural voice
      onSpeakText(teacherAnswer);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'teacher',
          text: `In this situation, recall that resistance opposes current while voltage drives it forward.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border-l border-white/20 shadow-2xl p-5 flex flex-col justify-between animate-[fadeIn_0.3s_ease] text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/30 shrink-0">
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{teacher.name}</h4>
            <span className="text-[11px] text-white/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active in Lesson Context
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2 flex flex-wrap gap-1.5">
        {[
          'Can you give another real-world analogy?',
          language.toLowerCase().includes('hindi')
            ? 'Mujhe simple Hindi me samjhao'
            : 'Explain this in simpler terms',
          'Why does resistance decrease current?',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[11px] bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 px-2.5 py-1 rounded-full text-white/70 hover:text-white transition-all text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 [scrollbar-width:none]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-white/20 border border-white/30 text-white rounded-br-sm'
                  : 'bg-white/[0.06] border border-white/15 text-white/90 rounded-bl-sm shadow-md'
              }`}
            >
              <p>{m.text}</p>
              {m.tip && (
                <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-amber-300/90 font-mono">
                  💡 Tip: {m.tip}
                </div>
              )}
            </div>
            {m.sender === 'teacher' && (
              <button
                onClick={() => onSpeakText(m.text)}
                className="text-[10px] text-white/40 hover:text-white mt-1 ml-1 flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3" /> Re-play voice
              </button>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300/80 p-3 bg-white/[0.04] rounded-2xl border border-white/10">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{teacher.name} is formulating an explanation...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask ${teacher.name} anything...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
        />
        <LiquidGlassButton
          variant="primary"
          size="sm"
          onClick={() => handleSend()}
          disabled={!query.trim() || isLoading}
          icon={<Send className="w-3.5 h-3.5" />}
        >
          Send
        </LiquidGlassButton>
      </div>
    </div>
  );
};
