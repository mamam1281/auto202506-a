'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/utils';
import styles from './Sidebar.module.css';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      <div className={styles.sidebarProvider}>{children}</div>
    </SidebarContext.Provider>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  side = 'left',
  className,
  collapsible = 'offcanvas',
}) => {
  const { isOpen } = useSidebar();  const variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: side === 'left' ? -280 : 280,
      opacity: collapsible === 'icon' ? 1 : 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">      <motion.aside
        className={cn(
          styles.sidebar,
          styles[side],
          styles[collapsible],
          { [styles.open]: isOpen },
          "bg-[#121225] border-r border-[#2a2b3e] backdrop-blur-md",
          className
        )}
        variants={variants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        exit="closed"
      >
        {children}
      </motion.aside>
    </AnimatePresence>
  );
};

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(styles.sidebarHeader, className)}>
      {children}
    </div>
  );
};

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(styles.sidebarContent, className)}>
      {children}
    </div>
  );
};

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(styles.sidebarFooter, className)}>
      {children}
    </div>
  );
};

interface SidebarTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  children,
  className,
  asChild = false,
}) => {
  const { toggle } = useSidebar();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    const newProps = {
      ...childProps,
      onClick: (e: React.MouseEvent) => {
        toggle();
        if (childProps.onClick) {
          childProps.onClick(e);
        }
      },
      className: cn(className, childProps.className),
    };
    return React.cloneElement(children, newProps);
  }

  return (
    <button
      className={cn(styles.sidebarTrigger, className)}
      onClick={toggle}
    >
      {children}
    </button>
  );
};

interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarInset: React.FC<SidebarInsetProps> = ({
  children,
  className,
}) => {
  const { isOpen } = useSidebar();

  return (
    <main
      className={cn(
        styles.sidebarInset,
        { [styles.sidebarOpen]: isOpen },
        className
      )}
    >
      {children}
    </main>
  );
};
