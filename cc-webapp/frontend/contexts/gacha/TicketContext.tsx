import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import type { GachaTier } from '../../../types/gacha'; // Adjusted import path

// 티켓 상태 타입 정의
interface TicketState {
  count: number;
  totalSpent: number;
  lastUpdated: Date;
  // Potentially track pity count if done on frontend for simulation
  // pityCount?: number;
}

// 액션 타입 정의
type TicketAction =
  | { type: 'ADD_TICKETS'; payload: number }
  | { type: 'SPEND_TICKET' }
  | { type: 'RESET_TICKETS'; payload?: { initialCount?: number, initialSpent?: number } }
  | { type: 'SET_TICKETS'; payload: number };

// 컨텍스트 타입 정의
interface TicketContextType {
  state: TicketState;
  addTickets: (amount: number) => void;
  spendTicket: () => boolean; // Returns true if ticket was spent, false otherwise
  resetTickets: (options?: { initialCount?: number, initialSpent?: number }) => void;
  setTickets: (amount: number) => void;
}

// 초기 상태
const initialState: TicketState = {
  count: 10, // Default initial tickets
  totalSpent: 0,
  lastUpdated: new Date(),
  // pityCount: 0,
};

// 리듀서 함수
function ticketReducer(state: TicketState, action: TicketAction): TicketState {
  switch (action.type) {
    case 'ADD_TICKETS':
      return {
        ...state,
        count: state.count + action.payload,
        lastUpdated: new Date()
      };

    case 'SPEND_TICKET':
      if (state.count <= 0) return state; // Prevent spending if no tickets
      return {
        ...state,
        count: state.count - 1,
        totalSpent: state.totalSpent + 1,
        lastUpdated: new Date(),
        // pityCount: (state.pityCount ?? 0) + 1, // Increment pity count
      };

    case 'RESET_TICKETS':
      return {
        ...state,
        count: action.payload?.initialCount ?? 10,
        totalSpent: action.payload?.initialSpent ?? 0,
        lastUpdated: new Date(),
        // pityCount: 0, // Reset pity count
      };

    case 'SET_TICKETS':
      return {
        ...state,
        count: Math.max(0, action.payload), // Ensure count doesn't go below 0
        lastUpdated: new Date()
      };

    default:
      // This case should ideally not be reached if types are correct
      return state;
  }
}

// 컨텍스트 생성
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// 프로바이더 컴포넌트
interface TicketProviderProps {
  children: ReactNode;
  initialScopedCount?: number; // Optional initial count for specific scopes
  initialScopedSpent?: number; // Optional initial spent for specific scopes
}

export function TicketProvider({ children, initialScopedCount, initialScopedSpent }: TicketProviderProps) {
  const [state, dispatch] = useReducer(ticketReducer, {
    ...initialState,
    count: initialScopedCount ?? initialState.count,
    totalSpent: initialScopedSpent ?? initialState.totalSpent,
  });

  const addTickets = useCallback((amount: number) => {
    dispatch({ type: 'ADD_TICKETS', payload: amount });
  }, []);

  const spendTicket = useCallback((): boolean => {
    if (state.count <= 0) {
      console.warn("Attempted to spend ticket with zero balance.");
      return false;
    }
    dispatch({ type: 'SPEND_TICKET' });
    return true;
  }, [state.count]);

  const resetTickets = useCallback((options?: { initialCount?: number, initialSpent?: number }) => {
    dispatch({ type: 'RESET_TICKETS', payload: options ?? {} });
  }, []);

  const setTickets = useCallback((amount: number) => {
    dispatch({ type: 'SET_TICKETS', payload: amount });
  }, []);

  // const resetPity = useCallback(() => {
  //   // This would be called after a high-tier pull if pity is managed here
  //   // dispatch({ type: 'RESET_PITY' });
  // }, []);

  const value: TicketContextType = {
    state,
    addTickets,
    spendTicket,
    resetTickets,
    setTickets,
    // resetPity (if frontend pity management is added)
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

// 커스텀 훅
export function useTickets(): TicketContextType {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}

// 편의를 위한 개별 훅들 (Optional, but can be handy)
export function useTicketCount(): number {
  const { state } = useTickets();
  return state.count;
}

export function useTotalSpent(): number {
  const { state } = useTickets();
  return state.totalSpent;
}

export function useTicketActions() {
  const { addTickets, spendTicket, resetTickets, setTickets } = useTickets();
  return { addTickets, spendTicket, resetTickets, setTickets };
}
