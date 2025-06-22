'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserPreferences } from '@/types/user';
import { storage } from '@/lib/utils';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  addAchievement: (achievement: string) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // 액션들
      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
        
        // 로컬 스토리지에도 저장
        storage.set('cj_user', user);
      },

      clearUser: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        
        // 로컬 스토리지에서도 제거
        storage.remove('cj_user');
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = { ...user, ...updates };
        set({ user: updatedUser });
        storage.set('cj_user', updatedUser);
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          preferences: { ...user.preferences, ...preferences } as UserPreferences
        };
        
        set({ user: updatedUser });
        storage.set('cj_user', updatedUser);
      },

      addTokens: (amount: number) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          tokens: user.tokens + amount
        };
        
        set({ user: updatedUser });
        storage.set('cj_user', updatedUser);
      },

      spendTokens: (amount: number) => {
        const { user } = get();
        if (!user || user.tokens < amount) return false;

        const updatedUser = {
          ...user,
          tokens: user.tokens - amount
        };
        
        set({ user: updatedUser });
        storage.set('cj_user', updatedUser);
        return true;
      },

      addAchievement: (achievement: string) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          achievements: [...user.achievements, achievement]
        };
        
        set({ user: updatedUser });
        storage.set('cj_user', updatedUser);
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'cj-auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.get(name),
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      })),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useUserTokens = () => useAuthStore((state) => state.user?.tokens ?? 0);
export const useUserLevel = () => useAuthStore((state) => state.user?.level ?? 1);
export const useUserAchievements = () => useAuthStore((state) => state.user?.achievements ?? []);