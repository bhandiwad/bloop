class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.enabled = true;
      return;
    }
    const savedPreference = localStorage.getItem('soundsEnabled');
    this.enabled = savedPreference !== 'false';
  }

  toggleSounds(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('soundsEnabled', this.enabled.toString());
    }
    return this.enabled;
  }

  isSoundEnabled(): boolean {
    return this.enabled;
  }

  private getSound(soundId: string): HTMLAudioElement | null {
    if (!this.sounds.has(soundId)) {
      const audio = new Audio();
      audio.preload = 'auto';
      this.sounds.set(soundId, audio);
      return audio;
    }
    return this.sounds.get(soundId) || null;
  }

  play(soundId: 'submit' | 'vote' | 'reveal' | 'correct' | 'fooled' | 'tick' | 'transition') {
    if (!this.enabled) return;

    const frequencies: Record<typeof soundId, { freq: number; duration: number; type?: OscillatorType }> = {
      submit: { freq: 800, duration: 0.1, type: 'sine' },
      vote: { freq: 600, duration: 0.15, type: 'sine' },
      reveal: { freq: 400, duration: 0.2, type: 'triangle' },
      correct: { freq: 880, duration: 0.3, type: 'sine' },
      fooled: { freq: 440, duration: 0.25, type: 'square' },
      tick: { freq: 1200, duration: 0.05, type: 'sine' },
      transition: { freq: 600, duration: 0.15, type: 'triangle' },
    };

    const config = frequencies[soundId];
    if (!config) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = config.type || 'sine';
      oscillator.frequency.setValueAtTime(config.freq, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  playSequence(sounds: Array<{ sound: 'submit' | 'vote' | 'reveal' | 'correct' | 'fooled' | 'tick' | 'transition'; delay: number }>) {
    if (!this.enabled) return;

    sounds.forEach(({ sound, delay }) => {
      setTimeout(() => this.play(sound), delay);
    });
  }
}

export const soundManager = new SoundManager();
