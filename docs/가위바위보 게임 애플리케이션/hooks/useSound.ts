'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import type { GameResult } from '@/types/game';

interface SoundMap {
  win: string;
  lose: string;
  draw: string;
  selection: string;
  click: string;
  countdown: string;
}

// 웹 오디오 API를 사용한 간단한 사운드 생성
const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Web Audio API not supported:', error);
  }
};

// 사운드 패턴 정의
const SOUND_PATTERNS: SoundMap = {
  win: 'win',
  lose: 'lose', 
  draw: 'draw',
  selection: 'selection',
  click: 'click',
  countdown: 'countdown'
};

export const useSound = () => {
  const { settings } = useGameContext();
  const audioContextRef = useRef<AudioContext | null>(null);

  // 오디오 컨텍스트 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && settings.soundEnabled) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [settings.soundEnabled]);

  // 승리 사운드
  const playWinSound = useCallback(() => {
    // 상승하는 멜로디
    createTone(523.25, 0.2); // C5
    setTimeout(() => createTone(659.25, 0.2), 200); // E5
    setTimeout(() => createTone(783.99, 0.4), 400); // G5
  }, []);

  // 패배 사운드
  const playLoseSound = useCallback(() => {
    // 하강하는 멜로디
    createTone(523.25, 0.2); // C5
    setTimeout(() => createTone(466.16, 0.2), 200); // B♭4
    setTimeout(() => createTone(392.00, 0.4), 400); // G4
  }, []);

  // 무승부 사운드
  const playDrawSound = useCallback(() => {
    // 중성적인 톤
    createTone(523.25, 0.3); // C5
    setTimeout(() => createTone(523.25, 0.3), 400); // C5 반복
  }, []);

  // 선택 사운드
  const playSelectionSound = useCallback(() => {
    createTone(659.25, 0.1, 'square'); // E5 짧은 비프음
  }, []);

  // 클릭 사운드
  const playClickSound = useCallback(() => {
    createTone(800, 0.05, 'square'); // 짧은 클릭음
  }, []);

  // 카운트다운 사운드
  const playCountdownSound = useCallback(() => {
    createTone(440, 0.1); // A4
  }, []);

  // 메인 사운드 재생 함수
  const playSound = useCallback((soundType: GameResult | 'selection' | 'click' | 'countdown') => {
    if (!settings.soundEnabled) return;

    switch (soundType) {
      case 'win':
        playWinSound();
        break;
      case 'lose':
        playLoseSound();
        break;
      case 'draw':
        playDrawSound();
        break;
      case 'selection':
        playSelectionSound();
        break;
      case 'click':
        playClickSound();
        break;
      case 'countdown':
        playCountdownSound();
        break;
      default:
        break;
    }
  }, [settings.soundEnabled, playWinSound, playLoseSound, playDrawSound, playSelectionSound, playClickSound, playCountdownSound]);

  // 사운드 시퀀스 재생 (확장 가능)
  const playSoundSequence = useCallback((sequence: Array<{ type: GameResult | 'selection' | 'click' | 'countdown'; delay: number }>) => {
    if (!settings.soundEnabled) return;

    sequence.forEach(({ type, delay }) => {
      setTimeout(() => playSound(type), delay);
    });
  }, [settings.soundEnabled, playSound]);

  return {
    playSound,
    playSoundSequence,
    soundEnabled: settings.soundEnabled
  };
};