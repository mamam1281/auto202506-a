import { useState } from 'react';
import { motion } from 'framer-motion';
import { GachaContainer } from './GachaContainer';
import { PullButton } from './PullButton';
import { TicketCounter } from './TicketCounter';
import { ResultModal } from './ResultModal';
import { GachaState, GachaResult, TIER_CONFIG } from '../../types/gacha';
import { useTickets } from '../../contexts/TicketContext';

// 샘플 가챠 아이템들
const SAMPLE_ITEMS: Omit<GachaResult, 'id'>[] = [
  // Common items (60%)
  { name: '기본 검', tier: 'common', description: '평범한 검입니다.', image: '⚔️' },
  { name: '나무 방패', tier: 'common', description: '나무로 만든 방패입니다.', image: '🛡️' },
  { name: '가죽 갑옷', tier: 'common', description: '가죽으로 만든 갑옷입니다.', image: '🎽' },
  { name: '체력 물약', tier: 'common', description: '체력을 회복하는 물약입니다.', image: '🧪' },
  
  // Rare items (25%)
  { name: '강철 검', tier: 'rare', description: '강철로 제련된 검입니다.', image: '⚔️' },
  { name: '마법 반지', tier: 'rare', description: '마법이 깃든 반지입니다.', image: '💍' },
  { name: '은 갑옷', tier: 'rare', description: '은으로 만든 갑옷입니다.', image: '🎽' },
  
  // Epic items (12%)
  { name: '용의 검', tier: 'epic', description: '용의 힘이 깃든 전설의 검입니다.', image: '🗡️' },
  { name: '마법사의 지팡이', tier: 'epic', description: '강력한 마법을 사용할 수 있는 지팡이입니다.', image: '🪄' },
  { name: '황금 갑옷', tier: 'epic', description: '황금으로 제작된 고급 갑옷입니다.', image: '👑' },
  
  // Legendary items (3%)
  { name: '신의 검', tier: 'legendary', description: '신이 내린 최강의 검입니다.', image: '⚡' },
  { name: '불멸의 왕관', tier: 'legendary', description: '불멸의 힘을 주는 왕관입니다.', image: '👑' },
];

interface GachaBoxProps {
  tickets: number; // Context에서 관리하므로 읽기 전용
  onPull: () => Promise<any>; // 호환성을 위해 유지
  onTicketUpdate: () => void; // 사용하지 않지만 호환성을 위해 유지
  className?: string;
}

export function GachaBox({ className = '' }: GachaBoxProps) {
  const { state, spendTicket } = useTickets();
  const [gachaState, setGachaState] = useState<GachaState>('ready');
  const [currentResult, setCurrentResult] = useState<GachaResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // 가챠 뽑기 시뮬레이션
  const simulateGacha = (): GachaResult => {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    // 등급별 확률에 따라 아이템 선택
    const tiers = Object.keys(TIER_CONFIG) as Array<keyof typeof TIER_CONFIG>;
    let selectedTier = 'common';
    
    for (const tier of tiers) {
      cumulativeProbability += TIER_CONFIG[tier].probability;
      if (random <= cumulativeProbability) {
        selectedTier = tier;
        break;
      }
    }
    
    // 선택된 등급의 아이템들 중에서 랜덤 선택
    const itemsOfTier = SAMPLE_ITEMS.filter(item => item.tier === selectedTier);
    const selectedItem = itemsOfTier[Math.floor(Math.random() * itemsOfTier.length)];
    
    return {
      ...selectedItem,
      id: Date.now().toString(),
    };
  };

  const handlePull = async () => {
    if (gachaState !== 'ready' || state.count < 1) return;

    try {
      setGachaState('pulling');
      
      // Context에서 티켓 소모
      const success = spendTicket();
      if (!success) {
        setGachaState('ready');
        return;
      }

      // 2초 대기 (애니메이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = simulateGacha();
      setCurrentResult(result);
      setGachaState('reveal');
      
      // 1초 후 결과 모달 표시
      setTimeout(() => {
        setShowResultModal(true);
      }, 1000);
      
    } catch (error) {
      console.error('가챠 뽑기 실패:', error);
      setGachaState('ready');
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    setCurrentResult(null);
    setGachaState('ready');
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 티켓 카운터 - Context에서 상태 가져오기 */}
      <motion.div 
        className="flex justify-center mb-3 sm:mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TicketCounter count={state.count} />
      </motion.div>

      {/* 가챠 컨테이너 - 모바일 크기 조정 */}
      <motion.div 
        className="mb-4 sm:mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GachaContainer 
          state={gachaState} 
          tier={currentResult?.tier}
        />
      </motion.div>

      {/* 뽑기 버튼 - Context 상태 사용 */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <PullButton
          state={gachaState}
          tickets={state.count}
          onPull={handlePull}
          className="w-full sm:w-auto sm:min-w-[200px]"
        />
      </motion.div>

      {/* 결과 모달 - Confetti 효과 포함 */}
      <ResultModal
        isOpen={showResultModal}
        result={currentResult}
        onClose={handleCloseModal}
      />
    </div>
  );
}