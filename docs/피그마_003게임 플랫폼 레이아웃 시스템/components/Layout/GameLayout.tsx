import { ReactNode, useState } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface GameLayoutProps {
  children: ReactNode;
  gameTitle?: string;
  onBack?: () => void;
  showControls?: boolean;
  className?: string;
}

export function GameLayout({ 
  children, 
  gameTitle = "게임",
  onBack,
  showControls = true,
  className 
}: GameLayoutProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleFullscreen = () => {
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className={cn(
      "min-h-screen bg-[var(--bg-primary)] text-white",
      className
    )}>
      {/* 게임 헤더 */}
      {showControls && (
        <header className="sticky top-0 z-50 border-b border-[var(--surface-glass)] bg-[var(--bg-secondary)]/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            {/* 왼쪽: 뒤로가기 & 게임 제목 */}
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-white hover:bg-[var(--surface-glass)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="font-medium text-lg">{gameTitle}</h1>
            </div>

            {/* 오른쪽: 게임 컨트롤 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-[var(--surface-glass)]"
                aria-label={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSettings}
                className="text-white hover:bg-[var(--surface-glass)]"
                aria-label="게임 설정"
              >
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-[var(--surface-glass)]"
                aria-label={isFullscreen ? "전체화면 해제" : "전체화면"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* 게임 컨텐츠 영역 */}
      <div className="relative">
        {/* 게임 설정 패널 */}
        {showSettings && (
          <div className="absolute top-0 right-0 z-40 w-80 h-full bg-[var(--bg-secondary)]/95 backdrop-blur border-l border-[var(--surface-glass)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-medium text-lg">게임 설정</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSettings}
                className="text-white hover:bg-[var(--surface-glass)]"
              >
                ×
              </Button>
            </div>
            
            {/* 설정 옵션들 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">음량</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full h-2 bg-[var(--surface-glass)] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">그래픽 품질</label>
                <select className="w-full p-2 bg-[var(--surface-glass)] rounded-lg text-white">
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">자동 저장</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="auto-save"
                    className="sr-only"
                    defaultChecked
                  />
                  <label
                    htmlFor="auto-save"
                    className="block w-10 h-6 bg-[var(--surface-glass)] rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 메인 게임 영역 */}
        <main className={cn(
          "relative min-h-[calc(100vh-3.5rem)]",
          !showControls && "min-h-screen"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}