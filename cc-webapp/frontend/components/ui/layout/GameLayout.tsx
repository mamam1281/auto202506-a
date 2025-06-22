'use client';

import React, { useState } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX, Settings, X } from 'lucide-react';
import Button from '../basic/Button';
import { cn } from '../utils/utils';
import styles from './GameLayout.module.css';

export interface GameLayoutProps {
  /** 자식 요소 (게임 컨텐츠) */
  children: React.ReactNode;
  /** 게임 제목 */
  gameTitle?: string;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** 게임 컨트롤 표시 여부 */
  showControls?: boolean;
  /** 토큰 잔액 표시 여부 */
  showTokenBalance?: boolean;
  /** 전체화면 지원 여부 */
  fullscreenSupport?: boolean;
  /** 게임 설정 패널 표시 여부 */
  showSettings?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 게임별 커스텀 컨트롤 */
  customControls?: React.ReactNode;
}

/**
 * # GameLayout 컴포넌트
 * 
 * Figma 003 게임 플랫폼 레이아웃 시스템 기준으로 제작된 게임 전용 레이아웃입니다.
 * 게임 플레이에 최적화된 UI와 컨트롤을 제공합니다.
 */
export function GameLayout({
  children,
  gameTitle = "게임",
  onBack,
  showControls = true,
  showTokenBalance = true,
  fullscreenSupport = true,
  showSettings = true,
  className,
  customControls
}: GameLayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const toggleFullscreen = () => {
    if (!fullscreenSupport) return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSettingsPanel = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

  return (
    <div className={cn(styles.gameLayout, className)}>
      {/* 게임 헤더 */}
      {showControls && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {/* 왼쪽: 뒤로가기 + 제목 */}
            <div className={styles.headerLeft}>
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className={styles.backButton}
                  aria-label="뒤로가기"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className={styles.gameTitle}>{gameTitle}</h1>
            </div>

            {/* 중앙: 토큰 잔액 */}
            {showTokenBalance && (
              <div className={styles.headerCenter}>
                <div className={styles.tokenBalance}>
                  {/* TokenBalanceWidget는 나중에 추가 */}
                  <span className={styles.tokenText}>1,250 토큰</span>
                </div>
              </div>
            )}

            {/* 오른쪽: 게임 컨트롤 */}
            <div className={styles.headerRight}>
              {/* 커스텀 컨트롤 */}
              {customControls}

              {/* 음소거 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className={styles.controlButton}
                aria-label={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              {/* 설정 버튼 */}
              {showSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSettingsPanel}
                  className={styles.controlButton}
                  aria-label="게임 설정"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}

              {/* 전체화면 버튼 */}
              {fullscreenSupport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className={styles.controlButton}
                  aria-label={isFullscreen ? "전체화면 해제" : "전체화면"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* 게임 컨텐츠 영역 */}
      <div className={styles.gameContent}>
        {/* 게임 설정 패널 */}
        {showSettingsPanel && (
          <div className={styles.settingsPanel}>
            <div className={styles.settingsPanelHeader}>
              <h2 className={styles.settingsPanelTitle}>게임 설정</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSettingsPanel}
                className={styles.settingsCloseButton}
                aria-label="설정 패널 닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className={styles.settingsPanelContent}>
              {/* 음량 설정 */}
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>음량</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className={styles.settingSlider}
                />
              </div>

              {/* 그래픽 품질 */}
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>그래픽 품질</label>
                <select className={styles.settingSelect}>
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>

              {/* 자동 저장 */}
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>자동 저장</span>
                <div className={styles.toggleContainer}>
                  <input
                    type="checkbox"
                    id="auto-save"
                    className={styles.toggleInput}
                    defaultChecked
                  />
                  <label htmlFor="auto-save" className={styles.toggleLabel} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 메인 게임 영역 */}
        <main className={cn(
          styles.gameMain,
          !showControls && styles.gameMainFullscreen
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default GameLayout;