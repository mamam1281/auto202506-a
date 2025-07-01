import React from 'react';

export interface QuickStartItemProps {
  id: string;
  label: string;
  iconBgColor: string;
  iconPlaceholder: string;
  onClick?: () => void;
}

export const QuickStartItem: React.FC<QuickStartItemProps> = ({
  label,
  iconBgColor,
  iconPlaceholder,
  onClick,
}) => (
  <div
    className="quick-start-item glassmorphism-purple flex flex-col items-center justify-center gap-2 cursor-pointer p-3"
    style={{
      '--icon-bg': iconBgColor,
      height: 'var(--content-card-size, 120px)',
      minWidth: 80,
    } as React.CSSProperties}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={label}
  >
    <div
      className="quick-start-icon flex items-center justify-center text-3xl mb-1"
      style={{
        background: 'var(--icon-bg)',
        borderRadius: 'var(--radius-lg)',
        width: 48,
        height: 48,
      }}
    >
      {iconPlaceholder}
    </div>
    <span className="quick-start-label text-body font-medium text-center">
      {label}
    </span>
  </div>
);

export default QuickStartItem;
