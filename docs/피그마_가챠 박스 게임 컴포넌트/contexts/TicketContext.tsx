import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 티켓 상태 타입 정의
interface TicketState {
  count: number;
  totalSpent: number;
  lastUpdated: Date;
}

// 액션 타입 정의
type TicketAction = 
  | { type: 'ADD_TICKETS'; payload: number }
  | { type: 'SPEND_TICKET' }
  | { type: 'RESET_TICKETS'; payload?: number }
  | { type: 'SET_TICKETS'; payload: number };

// 컨텍스트 타입 정의
interface TicketContextType {
  state: TicketState;
  addTickets: (amount: number) => void;
  spendTicket: () => boolean;
  resetTickets: (amount?: number) => void;
  setTickets: (amount: number) => void;
}

// 초기 상태
const initialState: TicketState = {
  count: 5,
  totalSpent: 0,
  lastUpdated: new Date()
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
      if (state.count <= 0) return state;
      return {
        ...state,
        count: state.count - 1,
        totalSpent: state.totalSpent + 1,
        lastUpdated: new Date()
      };
    
    case 'RESET_TICKETS':
      return {
        ...state,
        count: action.payload ?? 10,
        lastUpdated: new Date()
      };
    
    case 'SET_TICKETS':
      return {
        ...state,
        count: Math.max(0, action.payload),
        lastUpdated: new Date()
      };
    
    default:
      return state;
  }
}

// 컨텍스트 생성
const TicketContext = createContext<TicketContextType | undefined>(undefined);

// 프로바이더 컴포넌트
interface TicketProviderProps {
  children: ReactNode;
}

export function TicketProvider({ children }: TicketProviderProps) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const addTickets = (amount: number) => {
    dispatch({ type: 'ADD_TICKETS', payload: amount });
  };

  const spendTicket = (): boolean => {
    if (state.count <= 0) return false;
    dispatch({ type: 'SPEND_TICKET' });
    return true;
  };

  const resetTickets = (amount?: number) => {
    dispatch({ type: 'RESET_TICKETS', payload: amount });
  };

  const setTickets = (amount: number) => {
    dispatch({ type: 'SET_TICKETS', payload: amount });
  };

  const value: TicketContextType = {
    state,
    addTickets,
    spendTicket,
    resetTickets,
    setTickets
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

// 편의를 위한 개별 훅들
export function useTicketCount(): number {
  const { state } = useTickets();
  return state.count;
}

export function useTicketActions() {
  const { addTickets, spendTicket, resetTickets, setTickets } = useTickets();
  return { addTickets, spendTicket, resetTickets, setTickets };
}