import React from 'react';

interface VariantButtonProps {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'error' | 'info' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  hoverEffect?: 'classic' | 'glow' | 'rotate';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function VariantButton({ 
  variant = 'default', 
  size = 'md', 
  hoverEffect = 'classic',
  disabled = false, 
  children, 
  onClick,
  className = ''
}: VariantButtonProps) {
  
  const baseClasses = `
    relative rounded-[10px] overflow-hidden
    transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
    cursor-pointer flex items-center justify-center
    transform-gpu will-change-transform
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
  `;

  // 호버 효과별 클래스 - 상용급으로 조정
  const hoverEffectClasses = {
    classic: `
      hover:scale-[1.01] active:scale-[0.99]
      hover:shadow-lg hover:shadow-black/15
      active:shadow-md active:shadow-black/10
      before:absolute before:inset-0 before:opacity-0 
      before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%] 
      before:transition-all before:duration-800 before:ease-out
      hover:before:opacity-100
      after:absolute after:inset-0 after:rounded-[10px] 
      after:bg-gradient-to-b after:from-white/3 after:to-transparent after:opacity-0
      hover:after:opacity-100 after:transition-opacity after:duration-250
    `,
    glow: `
      hover:scale-[1.02] active:scale-[0.98]
      hover:shadow-lg hover:shadow-black/20
      active:shadow-md active:shadow-black/15
      before:absolute before:inset-[-1px] before:opacity-0 
      before:bg-gradient-to-r before:from-transparent before:via-white/8 before:to-transparent
      before:rounded-[11px]
      hover:before:opacity-100 before:transition-all before:duration-400
      after:absolute after:inset-0 after:rounded-[10px] 
      after:bg-gradient-to-r after:from-white/0 after:via-white/4 after:to-white/0
      after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-250
      hover:brightness-105
    `,
    rotate: `
      hover:scale-[1.015] active:scale-[0.985]
      hover:rotate-[0.5deg] active:rotate-0
      hover:shadow-lg hover:shadow-black/20
      active:shadow-md active:shadow-black/15
      before:absolute before:inset-0 before:opacity-0 
      before:bg-gradient-to-br before:from-transparent before:via-white/6 before:to-transparent
      before:rotate-12 before:scale-110
      hover:before:opacity-100 before:transition-all before:duration-500 before:ease-out
      after:absolute after:inset-0 after:rounded-[10px] 
      after:bg-gradient-to-tr after:from-white/0 after:via-white/3 after:to-white/0
      after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-300
      hover:saturate-105
    `
  };
  
  const variantClasses = {
    default: `
      bg-[#333333] text-[#FFFFFF] border border-[#333333]
      hover:bg-[#404040] hover:border-[#505050] hover:brightness-105
      active:bg-[#2a2a2a] active:border-[#2a2a2a] active:brightness-95
      focus:ring-[#333333]/50
    `,
    primary: `
      bg-[#2d2d2d] text-[#FFFFFF] border border-[#2d2d2d]
      hover:bg-[#3a3a3a] hover:border-[#3a3a3a] hover:brightness-105
      active:bg-[#1a1a1a] active:border-[#1a1a1a] active:brightness-95
      focus:ring-[#2d2d2d]/50
    `,
    accent: `
      bg-[#ff4516] text-[#FFFFFF] border border-[#ff4516]
      hover:bg-[#ff5530] hover:border-[#ff5530] hover:brightness-105 hover:saturate-105
      active:bg-[#e53e0a] active:border-[#e53e0a] active:brightness-95
      focus:ring-[#ff4516]/50
      hover:shadow-[#ff4516]/20
    `,
    gradient: `
      bg-gradient-to-r from-[#7B29CD] via-[#870DD1] via-[#5B30F6] to-[#8054F2] 
      text-[#FFFFFF] border border-transparent
      hover:saturate-108 hover:brightness-108
      active:brightness-92 active:saturate-95
      focus:ring-[#7B29CD]/50
      shadow-md shadow-[#7B29CD]/15
      hover:shadow-lg hover:shadow-[#7B29CD]/25
      relative
      before:absolute before:inset-[-1px] before:rounded-[11px] before:opacity-0
      before:bg-gradient-to-r before:from-[#9945FF] before:via-[#A855F7] before:via-[#7C3AED] before:to-[#9333EA]
      hover:before:opacity-30 before:transition-all before:duration-400
      after:absolute after:inset-0 after:rounded-[10px] after:opacity-0
      after:bg-gradient-to-br after:from-[#FF6B9D]/10 after:via-transparent after:via-transparent after:to-[#4ECDC4]/10
      hover:after:opacity-100 after:transition-all after:duration-500
      [&>span]:relative [&>span]:z-20
    `,
    success: `
      bg-[#10B981] text-[#FFFFFF] border border-[#10B981]
      hover:bg-[#1dd5a0] hover:border-[#1dd5a0] hover:brightness-105
      active:bg-[#0d9668] active:border-[#0d9668] active:brightness-95
      focus:ring-[#10B981]/50
      hover:shadow-[#10B981]/20
    `,
    error: `
      bg-[#B90C29] text-[#FFFFFF] border border-[#B90C29]
      hover:bg-[#d41030] hover:border-[#d41030] hover:brightness-105
      active:bg-[#9e0a23] active:border-[#9e0a23] active:brightness-95
      focus:ring-[#B90C29]/50
      hover:shadow-[#B90C29]/20
    `,
    info: `
      bg-[#135B79] text-[#FFFFFF] border border-[#135B79]
      hover:bg-[#1a6d8a] hover:border-[#1a6d8a] hover:brightness-105
      active:bg-[#0f4a63] active:border-[#0f4a63] active:brightness-95
      focus:ring-[#135B79]/50
      hover:shadow-[#135B79]/20
    `,
    outline: `
      bg-transparent text-[#D1D5DB] border border-[#A0A0A0]
      hover:bg-[#333333] hover:text-[#FFFFFF] hover:border-[#D1D5DB] hover:brightness-105
      active:bg-[#2a2a2a] active:border-[#FFFFFF] active:brightness-95
      focus:ring-[#A0A0A0]/50
    `,
    ghost: `
      bg-transparent text-[#D1D5DB] border border-transparent
      hover:bg-[#333333] hover:text-[#FFFFFF] hover:brightness-105
      active:bg-[#2a2a2a] active:brightness-95
      focus:ring-[#333333]/50
    `
  };
  
  const sizeClasses = {
    sm: "h-8 px-4 min-w-[90px] text-[14px] font-['IBM_Plex_Sans_KR'] font-normal leading-[20px]",
    md: "h-10 px-6 min-w-[120px] text-[16px] font-['Exo'] font-normal leading-[24px]",
    lg: "h-12 px-8 min-w-[140px] text-[20px] font-['Exo'] font-semibold leading-[28px]"
  };
  
  const disabledClasses = disabled 
    ? `opacity-40 cursor-not-allowed pointer-events-none 
       transform-none hover:scale-100 hover:shadow-none hover:rotate-0
       hover:brightness-100 hover:saturate-100
       before:hidden after:hidden` 
    : "";
  
  const combinedClasses = `${baseClasses} ${hoverEffectClasses[hoverEffect]} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.replace(/\s+/g, ' ').trim();
  
  return (
    <button
      className={combinedClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type="button"
    >
      <span className="relative z-10 tracking-wide">
        {children}
      </span>
    </button>
  );
}