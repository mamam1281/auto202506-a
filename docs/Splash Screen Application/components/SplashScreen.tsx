import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SplashScreenProps {
  onComplete?: () => void;
  version?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  version = '1.0.0' 
}) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const loadingStages = [
    'Initializing...',
    'Loading resources...',
    'Checking authentication...',
    'Almost ready...'
  ];

  useEffect(() => {
    // Initial fade-in animation
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Simulate loading stages
    const stageTimer = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < loadingStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageTimer);
          // Simulate auth check completion
          setTimeout(() => {
            setIsCheckingAuth(false);
            // Complete splash after final stage
            setTimeout(() => {
              onComplete?.();
            }, 1000);
          }, 1500);
          return prev;
        }
      });
    }, 1200);

    return () => {
      clearTimeout(showTimer);
      clearInterval(stageTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse [animation-delay:2s]"></div>

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center space-y-8 transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Logo section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
          <div className="relative bg-card border border-border rounded-full p-8 shadow-lg backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-inner">
              <div className="text-4xl font-bold text-primary-foreground transform transition-transform duration-300 group-hover:scale-110">
                CJ
              </div>
            </div>
          </div>
          
          {/* Rotating ring animation */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/30 animate-spin [animation-duration:3s]"></div>
          <div className="absolute inset-2 rounded-full border border-transparent border-r-accent/30 animate-spin [animation-duration:2s] [animation-direction:reverse]"></div>
        </div>

        {/* App title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
            CJ Gaming
          </h1>
          <p className="text-muted-foreground text-lg">
            VIP Exclusive Platform
          </p>
        </div>

        {/* Loading section */}
        <div className="flex flex-col items-center space-y-6 min-h-[120px]">
          <LoadingSpinner size="lg" variant="modern" className="text-primary" />
          
          <div className="text-center space-y-2">
            <p className="text-foreground font-medium">
              {loadingStages[loadingStage]}
            </p>
            
            {/* Progress bar */}
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
                style={{ 
                  width: `${((loadingStage + 1) / loadingStages.length) * 100}%` 
                }}
              ></div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}% complete
            </p>
          </div>
        </div>

        {/* Authentication status */}
        {isCheckingAuth && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <LoadingSpinner size="sm" variant="dots" />
            <span>Verifying credentials...</span>
          </div>
        )}
      </div>

      {/* Version info */}
      <div className={`absolute bottom-8 left-8 transition-all duration-1000 delay-500 ${
        showContent ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span>Version {version}</span>
        </div>
      </div>

      {/* Beta badge */}
      <div className={`absolute top-8 right-8 transition-all duration-1000 delay-700 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          BETA
        </div>
      </div>
    </div>
  );
};