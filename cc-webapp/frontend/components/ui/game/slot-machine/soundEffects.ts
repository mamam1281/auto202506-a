// 슬롯머신 사운드/피드백/진동 관리 유틸리티 (SOLID/SRP)

export interface SoundEffects {
  spinStart: () => void;
  spinStop: () => void;
  win: () => void;
  bigWin: () => void;
  jackpot: () => void;
  betChange: () => void;
  buttonClick: () => void;
}

export interface HapticFeedback {
  light: () => void;
  medium: () => void;
  heavy: () => void;
}

class SlotSoundManager implements SoundEffects {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  spinStart() {
    // 스핀 시작 효과음 (기계 회전 소리)
    this.playTone(200, 0.1, 0.05);
    setTimeout(() => this.playTone(180, 0.15, 0.03), 50);
  }

  spinStop() {
    // 스핀 정지 효과음 (기계 정지 소리)
    this.playTone(150, 0.2, 0.06);
  }

  win() {
    // 일반 당첨 효과음 (상승 멜로디)
    const notes = [262, 330, 392, 523]; // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 0.08), i * 100);
    });
  }

  bigWin() {
    // 큰 당첨 효과음 (더 화려한 멜로디)
    const notes = [262, 330, 392, 523, 659, 784]; // C, E, G, C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 0.1), i * 80);
    });
  }

  jackpot() {
    // 잭팟 효과음 (트럼펫 팡파레)
    const fanfare = [523, 659, 784, 1047, 784, 659, 523, 784];
    fanfare.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 0.12), i * 120);
    });
  }

  betChange() {
    // 베팅 변경 효과음 (짧은 클릭)
    this.playTone(800, 0.05, 0.04);
  }

  buttonClick() {
    // 버튼 클릭 효과음 (짧은 탭)
    this.playTone(1000, 0.08, 0.05);
  }
}

class SlotHapticManager implements HapticFeedback {
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  light() {
    if (this.isSupported) {
      navigator.vibrate(50);
    }
  }

  medium() {
    if (this.isSupported) {
      navigator.vibrate(100);
    }
  }

  heavy() {
    if (this.isSupported) {
      navigator.vibrate([100, 50, 100]);
    }
  }
}

// 싱글톤 패턴으로 사운드/햅틱 매니저 제공
export const soundManager = new SlotSoundManager();
export const hapticManager = new SlotHapticManager();

// 통합 피드백 함수들
export const playSlotFeedback = {
  spinStart: () => {
    soundManager.spinStart();
    hapticManager.light();
  },
  spinStop: () => {
    soundManager.spinStop();
    hapticManager.light();
  },
  win: () => {
    soundManager.win();
    hapticManager.medium();
  },
  bigWin: () => {
    soundManager.bigWin();
    hapticManager.heavy();
  },
  jackpot: () => {
    soundManager.jackpot();
    hapticManager.heavy();
  },
  betChange: () => {
    soundManager.betChange();
  },
  buttonClick: () => {
    soundManager.buttonClick();
    hapticManager.light();
  }
};
