'use client';

import React, { useState } from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX, MessageCircle, X } from 'lucide-react';
import Button from '../basic/Button';
import { cn } from '../utils/utils';
import styles from './GameLayout.module.css';

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
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * # GameLayout 컴포넌트
 * 
 * 카지노 클럽 F2P 게임에 특화된 레이아웃 컴포넌트입니다.
 * 사이버 토큰 시스템, CJ AI, 성인 콘텐츠 언락 등을 통합 지원합니다.
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

  return (
    <div className={cn(styles.gameLayout, className)}>
      {/* 게임 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className={styles.backButton}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className={styles.gameInfo}>
            <h1 className={styles.gameTitle}>
              {gameTitle || gameTypeLabels[gameType]}
            </h1>
            <div className={styles.gameType}>{gameTypeLabels[gameType]}</div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.tokenDisplay}>
            <span className={styles.tokenAmount}>{tokenBalance.toLocaleString()}</span>
            <span className={styles.tokenLabel}>토큰</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className={styles.iconButton}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={styles.iconButton}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* 메인 게임 영역 */}
      <main className={styles.mainContent}>
        <div className={styles.gameArea}>
          {children}
        </div>

        {/* 사이드 패널들 */}
        <div className={styles.sidePanels}>
          {/* 성인 콘텐츠 언락 상태 */}
          {showUnlockStatus && (
            <div className={styles.unlockPanel}>
              <h3>콘텐츠 언락</h3>
              <div className={styles.unlockStages}>
                <div className={styles.unlockStage}>
                  <span>Stage 1</span>
                  <span className={styles.unlockCost}>200 토큰</span>
                </div>
                <div className={styles.unlockStage}>
                  <span>Stage 2</span>
                  <span className={styles.unlockCost}>500 토큰</span>
                </div>
                <div className={styles.unlockStage}>
                  <span>Stage 3</span>
                  <span className={styles.unlockCost}>1,000 토큰</span>
                </div>
              </div>
            </div>
          )}

          {/* 확률 정보 */}
          {showProbability && (
            <div className={styles.probabilityPanel}>
              <h3>확률 정보</h3>
              <div className={styles.probabilityList}>
                <div className={styles.probabilityItem}>
                  <span>당첨</span>
                  <span>15%</span>
                </div>
                <div className={styles.probabilityItem}>
                  <span>대박</span>
                  <span>2%</span>
                </div>
                <div className={styles.probabilityItem}>
                  <span>잭팟</span>
                  <span>0.1%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CJ AI 채팅 버튼 */}
      {showCJAI && (
        <Button
          onClick={() => setShowCJPanel(!showCJPanel)}
          className={styles.cjAIButton}
        >
          <MessageCircle className="w-5 h-5" />
          <span>CJ AI</span>
        </Button>
      )}

      {/* CJ AI 채팅 패널 */}
      {showCJAI && showCJPanel && (
        <div className={styles.cjAIPanel}>
          <div className={styles.cjAIHeader}>
            <h3>CJ AI 어시스턴트</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCJPanel(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className={styles.cjAIContent}>
            <div className={styles.chatMessages}>
              <div className={styles.aiMessage}>
                <span>🤖</span>
                <p>안녕하세요! 게임에 도움이 필요하시면 언제든 말씀해주세요.</p>
              </div>
            </div>
            <div className={styles.chatInput}>
              <input 
                type="text" 
                placeholder="메시지를 입력하세요..."
                className={styles.messageInput}
              />
              <Button size="sm">전송</Button>
            </div>
          </div>
        </div>
      )}

      {/* 게임 부족 토큰 알림 */}
      {tokenBalance < tokenCost && (
        <div className={styles.insufficientTokens}>
          <div className={styles.alertContent}>
            <h4>토큰이 부족합니다!</h4>
            <p>기업 사이트에서 토큰을 충전하세요.</p>
          </div>
          <Button className={styles.chargeButton}>
            토큰 충전하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default GameLayout;
