'use client';

import { useCallback } from 'react';
import { useGameContext } from '@/contexts/GameContext';
import type { GameResult, GameScore, GameStats } from '@/types/game';

export const useGameStats = () => {
  const { stats, updateStats: updateContextStats } = useGameContext();

  // 통계 업데이트
  const updateStats = useCallback((result: GameResult, score: GameScore) => {
    updateContextStats(result, score);
  }, [updateContextStats]);

  // 승률 계산
  const getWinRate = useCallback((): number => {
    const totalGames = stats.totalGames;
    if (totalGames === 0) return 0;
    return Math.round((stats.winRate + Number.EPSILON) * 100) / 100;
  }, [stats.totalGames, stats.winRate]);

  // 현재 연승 기록
  const getCurrentStreak = useCallback((): number => {
    return stats.currentWinStreak;
  }, [stats.currentWinStreak]);

  // 최고 연승 기록
  const getLongestStreak = useCallback((): number => {
    return stats.longestWinStreak;
  }, [stats.longestWinStreak]);

  // 전체 게임 수
  const getTotalGames = useCallback((): number => {
    return stats.totalGames;
  }, [stats.totalGames]);

  // 선호하는 선택지 (확장 가능)
  const getFavoriteChoice = useCallback(() => {
    return stats.favoriteChoice;
  }, [stats.favoriteChoice]);

  // 평균 게임 시간 (확장 가능)
  const getAverageGameTime = useCallback((): number => {
    return stats.averageGameTime;
  }, [stats.averageGameTime]);

  // 통계 요약 반환
  const getStats = useCallback((): GameStats => {
    return {
      totalGames: getTotalGames(),
      winRate: getWinRate(),
      longestWinStreak: getLongestStreak(),
      currentWinStreak: getCurrentStreak(),
      favoriteChoice: getFavoriteChoice(),
      averageGameTime: getAverageGameTime()
    };
  }, [getTotalGames, getWinRate, getLongestStreak, getCurrentStreak, getFavoriteChoice, getAverageGameTime]);

  // 성과 체크 (확장 가능)
  const checkAchievements = useCallback((newStats: GameStats) => {
    const achievements = [];
    
    if (newStats.currentWinStreak >= 5) {
      achievements.push({ id: 'win-streak-5', name: '연승 마스터', description: '5연승 달성!' });
    }
    
    if (newStats.currentWinStreak >= 10) {
      achievements.push({ id: 'win-streak-10', name: '연승 전설', description: '10연승 달성!' });
    }
    
    if (newStats.totalGames >= 50) {
      achievements.push({ id: 'games-50', name: '베테랑 플레이어', description: '50게임 플레이!' });
    }
    
    if (newStats.winRate >= 70) {
      achievements.push({ id: 'high-winrate', name: '승률 마스터', description: '70% 이상 승률 달성!' });
    }

    return achievements;
  }, []);

  return {
    updateStats,
    getStats,
    getWinRate,
    getCurrentStreak,
    getLongestStreak,
    getTotalGames,
    getFavoriteChoice,
    getAverageGameTime,
    checkAchievements,
    stats
  };
};