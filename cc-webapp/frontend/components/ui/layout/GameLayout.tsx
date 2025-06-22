'use client';

import React, { useState } from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import Button from '../basic/Button';
import { cn } from '../utils/utils';
import styles from './GameLayout.module.css';
import AppBar from './AppBar';
import Container from './Container';
import BottomNav from './BottomNav';

export interface GameLayoutProps {
  /** 자식 요소 (게임 컨텐츠) */
  children: React.ReactNode;
  /** 게임 타입 */
  gameType: 'slot' | 'roulette' | 'rps' | 'gacha';
  /** 게임 제목 */
  gameTitle?: string;
  /** 현재 토큰 잔액 */
  tokenBalance: number;
  /** 게임 플레이 비용 */
  tokenCost: number;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** CJ AI 채팅 표시 여부 */
  showCJAI?: boolean;
  /** 성인 콘텐츠 언락 상태 표시 여부 */
  showUnlockStatus?: boolean;
  /** 게임 히스토리 표시 여부 */
  showHistory?: boolean;
  /** 확률 정보 표시 여부 */
  showProbability?: boolean;
  /** AppBar 사용 여부 (기본값: true) */
  useAppBar?: boolean;
  /** 바텀 네비게이션 표시 여부 (기본값: false) */
  showBottomNav?: boolean;
  /** 컨테이너 크기 */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 콘텐츠 영역 패딩 제거 */
  noContentPadding?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * # GameLayout 컴포넌트
 * 
 * 카지노 클럽 F2P 게임에 특화된 레이아웃 컴포넌트입니다.
 * 사이버 토큰 시스템, CJ AI, 성인 콘텐츠 언락 등을 통합 지원합니다.
 * 
 * ## 업데이트 내역
 * - AppBar 컴포넌트 통합 지원
 * - Container 컴포넌트로 콘텐츠 영역 감싸기 지원
 * - BottomNav 컴포넌트 통합 지원 (모바일 전용)
 * - BottomNav 옵션 추가
 * - 안전 영역(safe-area) 자동 처리
 * @example
 * ```tsx
 * // 기본 사용법
 * <GameLayout
 *   gameType="slot"
 *   gameTitle="슈퍼 슬롯"
 *   tokenBalance={1000}
 *   tokenCost={50}
 *   onBack={() => router.push('/games')}
 * >
 *   <SlotGame />
 * </GameLayout>
 * ```
 * 
 * @example
 * ```tsx 
 * // 현대적 스타일 (AppBar 사용)
 * <GameLayout
 *   gameType="roulette"
 *   gameTitle="럭키 룰렛"
 *   tokenBalance={1000}
 *   tokenCost={100}
 *   useAppBar={true}
 *   containerSize="full"
 * >
 *   <RouletteGame />
 * </GameLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // 모바일 레이아웃 (AppBar + BottomNav)
 * <GameLayout
 *   gameType="slot"
 *   gameTitle="모바일 슬롯"
 *   tokenBalance={2500}
 *   tokenCost={10}
 *   useAppBar={true}
 *   showBottomNav={true}
 *   containerSize="full"
 * >
 *   <RouletteGame />
 * </GameLayout>
 * ```
 */
export function GameLayout({
  children,
  gameType,
  gameTitle,
  tokenBalance,
  tokenCost,
  onBack,
  showCJAI = true,
  showUnlockStatus = true,
  showHistory = false,
  showProbability = false,
  useAppBar = false,
  showBottomNav = false,
  containerSize = 'full',
  noContentPadding = true,
  className
}: GameLayoutProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showCJPanel, setShowCJPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const gameTypeLabels = {
    slot: '슬롯머신',
    roulette: '룰렛',
    rps: '가위바위보',
    gacha: '가챠박스'
  };
  
  // 토큰 잔액을 표시하는 중앙 컨텐츠
  const tokenBalanceDisplay = (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-yellow-400">{tokenBalance.toLocaleString()}</span>
      <span className="text-xs text-slate-300">토큰</span>
    </div>
  );

  return (
    <div className={cn(styles.gameLayout,className)}>
      {/* Modern AppBar 또는 전통적인 게임 헤더 */}
      {useAppBar ? (
        <AppBar
          title={gameTitle || gameTypeLabels[gameType]}
          leftContent="back"
          centerContent={tokenBalanceDisplay}
          rightContent={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="min-w-[40px] min-h-[40px]"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              {showCJAI && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCJPanel(!showCJPanel)}
                  className="min-w-[40px] min-h-[40px]"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              )}
            </div>
          }
          variant="game"
          onBackClick={onBack}
        />
      ) : (
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              className={styles.backButton}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className={styles.gameInfo}>
              <h1 className={styles.gameTitle}>
                {gameTitle || gameTypeLabels[gameType]}
              </h1>
              <div className={styles.gameType}>{gameTypeLabels[gameType]}</div>
            </div>
          </div>

        <div className={styles.headerCenter}>
          <div className={styles.tokenDisplay}>
            <span className={styles.tokenAmount}>{tokenBalance.toLocaleString()}</span>
            <span className={styles.tokenLabel}>토큰</span>
          </div>
          <div className={styles.tokenCost}>
            플레이 비용: {tokenCost} 토큰
          </div>
        </div>

        <div className={styles.headerRight}>          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className={styles.iconButton}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
            {showCJAI && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCJPanel(!showCJPanel)}
              className={styles.iconButton}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          )}
            <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={styles.iconButton}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>      {/* 메인 게임 영역 */}
      <main className={cn(
        styles.mainContent,
        showBottomNav && styles.withBottomNav
      )}>
        {noContentPadding ? (
          <div className={styles.gameArea}>
            {children}
          </div>
        ) : (
          <Container size={containerSize}>
            <div className={styles.gameArea}>
              {children}
            </div>
          </Container>
        )}

        {/* 사이드 패널들 */}
        <div className={styles.sidePanels}>
          {/* 성인 콘텐츠 언락 상태 */}
          {showUnlockStatus && (
            <div className={styles.unlockPanel}>
              <h3>🔞 성인 콘텐츠 언락</h3>
              <div className={styles.unlockProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '60%' }} />
                </div>
                <span>3/5 단계 완료</span>
              </div>
              <p>2단계 더 플레이하면 새로운 콘텐츠를 언락할 수 있습니다!</p>
            </div>
          )}

          {/* CJ AI 채팅 패널 */}
          {showCJAI && showCJPanel && (
            <div className={styles.cjPanel}>
              <div className={styles.cjHeader}>
                <h3>🤖 CJ AI 어시스턴트</h3>                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCJPanel(false)}
                  className={styles.closeButton}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className={styles.cjMessages}>
                <div className={styles.cjMessage}>
                  <strong>CJ:</strong> 안녕하세요! 오늘 운이 좋아 보이는데요? 😊
                </div>
                <div className={styles.cjMessage}>
                  <strong>CJ:</strong> 이 게임에서 승률을 높이려면 베팅 패턴을 조절해보세요!
                </div>
              </div>
              <div className={styles.cjInput}>
                <input type="text" placeholder="CJ AI에게 질문하세요..." />
                <Button size="sm">전송</Button>
              </div>
            </div>
          )}

          {/* 게임 히스토리 */}
          {showHistory && (
            <div className={styles.historyPanel}>
              <h3>📊 게임 히스토리</h3>
              <div className={styles.historyList}>
                <div className={styles.historyItem}>
                  <span>승리</span>
                  <span>+50 토큰</span>
                </div>
                <div className={styles.historyItem}>
                  <span>패배</span>
                  <span>-20 토큰</span>
                </div>
                <div className={styles.historyItem}>
                  <span>승리</span>
                  <span>+30 토큰</span>
                </div>
              </div>
            </div>
          )}

          {/* 확률 정보 */}
          {showProbability && (
            <div className={styles.probabilityPanel}>
              <h3>🎯 확률 정보</h3>
              <div className={styles.probabilityList}>
                <div className={styles.probabilityItem}>
                  <span>대박:</span>
                  <span>5%</span>
                </div>
                <div className={styles.probabilityItem}>
                  <span>중박:</span>
                  <span>15%</span>
                </div>
                <div className={styles.probabilityItem}>
                  <span>소박:</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
          )}
        </div>      </main>

      {/* 토큰 부족 경고 */}
      {tokenBalance < tokenCost && (
        <div className={styles.tokenWarning}>
          <div className={styles.warningContent}>
            <h3>⚠️ 토큰이 부족합니다!</h3>
            <p>기업 사이트에서 토큰을 충전하세요.</p>
          </div>
          <Button className={styles.chargeButton}>
            토큰 충전하기
          </Button>
        </div>
      )}
        {/* 하단 네비게이션 바 (선택적) */}
      {showBottomNav && (
        <BottomNav />
      )}
    </div>
  );
}

export default GameLayout;
