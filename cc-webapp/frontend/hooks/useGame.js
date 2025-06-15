'use client';
import { useState, useEffect } from 'react';
import { fetchTokenBalance } from '@/services/auth';
import { playSlot, playRoulette, pullGacha } from '@/services/gameApi';
import { tokenManager } from '@/utils/tokenManager';

export function useGame() {
  const [accessToken, setAccessToken] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const stored = tokenManager.getAccessToken();
    if (stored && tokenManager.isCurrentTokenValid()) {
      setAccessToken(stored);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      refreshTokens();
    }
  }, [accessToken]);

  const refreshTokens = async () => {
    if (!accessToken) return;
    try {
      const tokenData = await fetchTokenBalance(accessToken);
      setTokens(tokenData?.free_tokens || 0);
    } catch (error) {
      console.error('토큰 조회 실패:', error);
    }
  };

  const spinSlot = async (betAmount) => {
    if (!accessToken || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await playSlot(betAmount, accessToken);
      setTokens(result.balance);
      return result;
    } catch (error) {
      console.error('슬롯 게임 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const spinRoulette = async (betType, betAmount, value) => {
    if (!accessToken || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await playRoulette(betType, betAmount, value, accessToken);
      setTokens(result.balance);
      return result;
    } catch (error) {
      console.error('룰렛 게임 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const pullGachaGame = async (count = 1) => {
    if (!accessToken || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await pullGacha(count, accessToken);
      setTokens(result.balance);
      return result;
    } catch (error) {
      console.error('가챠 게임 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    accessToken,
    setAccessToken,
    tokens,
    isLoading,
    refreshTokens,
    spinSlot,
    spinRoulette,
    pullGachaGame,
  };
}
