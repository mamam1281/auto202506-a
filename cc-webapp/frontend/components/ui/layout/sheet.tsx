import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sheet.module.css';

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

interface SheetProps {
  /** 시트 열림 상태 */
  open?: boolean;
  /** 시트 닫기 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 시트 위치 */
  side?: SheetSide;
  /** 자식 요소 */
  children?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

interface SheetContentProps {
  /** 자식 요소 */
  children?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 시트 위치 */
  side?: SheetSide;
}

interface SheetTriggerProps {
  /** 자식 요소 */
  children?: React.ReactNode;
  /** 클릭 콜백 */
  onClick?: () => void;
  /** 추가 클래스명 */
  className?: string;
}

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: SheetSide;
}>({
  open: false,
  onOpenChange: () => {},
  side: 'right'
});

const Sheet: React.FC<SheetProps> = ({ 
  open = false, 
  onOpenChange = () => {}, 
  side = 'right',
  children,
  className 
}) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange, side }}>
      <div className={`${styles.sheet} ${className || ''}`}>
        {children}
      </div>
    </SheetContext.Provider>
  );
};

const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, onClick, className }) => {
  const { onOpenChange } = React.useContext(SheetContext);
  
  const handleClick = () => {
    onOpenChange(true);
    onClick?.();
  };

  return (
    <div onClick={handleClick} className={`${styles.trigger} ${className || ''}`}>
      {children}
    </div>
  );
};

const SheetContent: React.FC<SheetContentProps> = ({ children, className, side }) => {
  const { open, onOpenChange, side: contextSide } = React.useContext(SheetContext);
  const sheetSide = side || contextSide;

  const variants = {
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' }
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' }
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' }
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.backdrop}
            onClick={() => onOpenChange(false)}
          />
          
          {/* Sheet Content */}
          <motion.div
            initial={variants[sheetSide].initial}
            animate={variants[sheetSide].animate}
            exit={variants[sheetSide].exit}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className={`${styles.content} ${styles[sheetSide]} ${className || ''}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SheetHeader: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={`${styles.header} ${className || ''}`}>
    {children}
  </div>
);

const SheetTitle: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h2 className={`${styles.title} ${className || ''}`}>
    {children}
  </h2>
);

const SheetDescription: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={`${styles.description} ${className || ''}`}>
    {children}
  </p>
);

const SheetFooter: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={`${styles.footer} ${className || ''}`}>
    {children}
  </div>
);

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
};
