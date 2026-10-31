// Synthesized Web Audio API sound effects and speech synthesis for Pasapalabra

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'correct' | 'wrong' | 'pass' | 'victory' | 'click', enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (type === 'correct') {
      // Pleasant bright ascending triad: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;
        const duration = 0.35;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
      return;
    }

    if (type === 'wrong') {
      // Low buzz: 220Hz downward drop with square/sawtooth
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const duration = 0.35;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + duration);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
      return;
    }

    if (type === 'pass') {
      // Pasapalabra whoosh / tick: mid ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const duration = 0.2;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
      return;
    }

    if (type === 'victory') {
      // Fanfare sequence
      const melody = [
        { f: 523.25, d: 0.15, t: 0 },
        { f: 659.25, d: 0.15, t: 0.15 },
        { f: 783.99, d: 0.15, t: 0.3 },
        { f: 1046.5, d: 0.45, t: 0.45 },
      ];
      melody.forEach(item => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + item.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + item.d + 0.05);
      });
    }
  } catch {
    // Graceful fallback if audio is not allowed
  }
}

export function speakText(text: string, lang: 'es' | 'hy') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'es' ? 'es-ES' : 'hy-AM';
    utterance.rate = 0.95;

    // Pick appropriate voice if loaded
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(lang));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors
  }
}
