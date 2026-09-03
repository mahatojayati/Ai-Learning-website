export interface VoiceMatchResult {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
  rate: number;
  genderUsed: 'female' | 'male';
  voiceLabel: string;
}

// Known female voice keywords across Windows, macOS, iOS, Android, Linux, ChromeOS
const FEMALE_NAMES = [
  'natural female',
  'google uk english female',
  'google us english female',
  'jenny',
  'aria',
  'samantha',
  'victoria',
  'karen',
  'zira',
  'swara',
  'kalpana',
  'ava',
  'emma',
  'sophia',
  'sonia',
  'serena',
  'fiona',
  'moira',
  'veena',
  'tessa',
  'allison',
  'susan',
  'hazel',
  'catherine',
  'monica',
  'laura',
  'paulina',
  'sofia',
  'helena',
  'amelie',
  'celine',
  'julie',
  'katja',
  'hedda',
  'anna',
  'olga',
  'daria',
  'ksenia',
  'milena',
  'tatyana',
  'elena',
  'luciana',
  'mariska',
  'yuna',
  'kyoko',
  'ting-ting',
  'sin-ji',
  'meijia',
  'female',
  'woman',
  'girl',
  'uk english female',
  'us english female',
  'australian female',
];

// Explicit male voice names
const MALE_NAMES = [
  'natural male',
  'google uk english male',
  'google us english',
  'google english',
  'guy',
  'david',
  'mark',
  'daniel',
  'alex',
  'george',
  'fred',
  'ravi',
  'madhav',
  'hemant',
  'anil',
  'pavel',
  'ivan',
  'andrei',
  'igor',
  'jorge',
  'thomas',
  'nicolas',
  'stefan',
  'martin',
  'oliver',
  'diego',
  'male',
  'man',
  'boy',
];

export function isVoiceFemale(v: SpeechSynthesisVoice): boolean {
  const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
  if (FEMALE_NAMES.some((kw) => lower.includes(kw))) return true;
  if (MALE_NAMES.some((kw) => lower.includes(kw))) return false;
  return false;
}

export function isVoiceMale(v: SpeechSynthesisVoice): boolean {
  const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
  if (MALE_NAMES.some((kw) => lower.includes(kw))) return true;
  if (FEMALE_NAMES.some((kw) => lower.includes(kw))) return false;
  return false;
}

// Clean markdown, symbols, and mathematical notation to prevent speech synthesizer stuttering
export function cleanSpeechScript(raw: string): string {
  if (!raw) return '';
  let text = raw;

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, 'as shown in the code demonstration.');
  text = text.replace(/`([^`]+)`/g, '$1');

  // Replace common LaTeX and math symbols with fluent spoken words
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2');
  text = text.replace(/\\Delta\s*([a-zA-Z])/g, 'change in $1');
  text = text.replace(/\\Omega/g, ' ohms');
  text = text.replace(/\\pi/g, ' pi');
  text = text.replace(/\\approx/g, ' approximately ');
  text = text.replace(/\\times/g, ' times ');
  text = text.replace(/\\le/g, ' less than or equal to ');
  text = text.replace(/\\ge/g, ' greater than or equal to ');
  text = text.replace(/[\$\\]/g, ''); // strip dollar signs & lone backslashes

  // Replace Markdown styling
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  text = text.replace(/^#+\s+/gm, '');
  text = text.replace(/^[-*•]\s+/gm, '');
  text = text.replace(/\[\d+\]/g, ''); // reference numbers like [1]
  text = text.replace(/->|=>/g, ' leads to ');

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

export function selectVoiceForTeacher(
  voices: SpeechSynthesisVoice[],
  gender: 'female' | 'male',
  language: string,
  preferredPitch = 1.0,
  preferredRate = 1.0
): VoiceMatchResult {
  // Balanced natural pitch: 1.02 for female (natural clarity) and 0.98 for male.
  // CRITICAL: Avoid non-standard pitches like 1.38 or 0.88 which cause severe browser speech tremor/shakiness!
  const naturalPitch = gender === 'female' ? 1.02 : 0.98;
  const naturalRate = Math.max(0.92, Math.min(1.15, preferredRate || 1.0));

  if (!voices || voices.length === 0) {
    return {
      voice: null,
      pitch: naturalPitch,
      rate: naturalRate,
      genderUsed: gender,
      voiceLabel: gender === 'female' ? 'Natural Female Voice' : 'Natural Male Voice',
    };
  }

  const langLower = language.toLowerCase();
  let langPrefix = 'en';
  if (langLower.includes('hindi') || langLower.includes('hinglish')) {
    langPrefix = 'hi';
  } else if (langLower.includes('spanish')) {
    langPrefix = 'es';
  } else if (langLower.includes('french')) {
    langPrefix = 'fr';
  } else if (langLower.includes('german')) {
    langPrefix = 'de';
  } else if (langLower.includes('russian')) {
    langPrefix = 'ru';
  }

  const matchingLangVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langPrefix)
  );
  const pool = matchingLangVoices.length > 0 ? matchingLangVoices : voices;

  if (gender === 'female') {
    // 1. Highest quality: natural or neural female voice in matching language
    let chosen = pool.find((v) => {
      const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
      return (lower.includes('natural') || lower.includes('online')) && FEMALE_NAMES.some((kw) => lower.includes(kw));
    });

    // 2. Any explicit female voice in language pool
    if (!chosen) {
      chosen = pool.find((v) => {
        const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
        return FEMALE_NAMES.some((kw) => lower.includes(kw));
      });
    }

    // 3. Fallback to any female voice in whole system
    if (!chosen) {
      chosen = voices.find((v) => {
        const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
        return FEMALE_NAMES.some((kw) => lower.includes(kw));
      });
    }

    return {
      voice: chosen || null,
      pitch: naturalPitch,
      rate: naturalRate,
      genderUsed: 'female',
      voiceLabel: chosen ? `${chosen.name} (Smooth Female)` : 'Natural System Voice (Female Calibrated)',
    };
  } else {
    // 1. Highest quality: natural or neural male voice
    let chosen = pool.find((v) => {
      const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
      return (lower.includes('natural') || lower.includes('online')) && MALE_NAMES.some((kw) => lower.includes(kw));
    });

    // 2. Any male voice in language pool
    if (!chosen) {
      chosen = pool.find((v) => {
        const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
        return MALE_NAMES.some((kw) => lower.includes(kw));
      });
    }

    // 3. Fallback to any male voice in whole system
    if (!chosen) {
      chosen = voices.find((v) => {
        const lower = `${v.name} ${v.voiceURI}`.toLowerCase();
        return MALE_NAMES.some((kw) => lower.includes(kw));
      });
    }

    return {
      voice: chosen || pool[0] || null,
      pitch: naturalPitch,
      rate: naturalRate,
      genderUsed: 'male',
      voiceLabel: chosen ? `${chosen.name} (Smooth Male)` : 'Natural System Voice (Male Calibrated)',
    };
  }
}

// Interactive helper to test any voice
export function testSpeakVoice(
  voice: SpeechSynthesisVoice | null,
  pitch: number,
  rate: number,
  text: string = 'Hello! I am your AI educator. Ready to learn?'
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const cleanText = cleanSpeechScript(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  if (voice) {
    utterance.voice = voice;
  }
  utterance.pitch = Math.max(0.95, Math.min(1.08, pitch || 1.0));
  utterance.rate = Math.max(0.9, Math.min(1.2, rate || 1.0));
  window.speechSynthesis.speak(utterance);
}
