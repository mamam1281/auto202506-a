'use client';

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
        outline: "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-500",
        secondary: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 transform hover:scale-105 active:scale-95",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        // 카지노 스타일 variants
        neon: "bg-black border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transform hover:scale-105 active:scale-95 font-bold tracking-wide",
        premium: "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] transform hover:scale-105 active:scale-95 font-bold",
        gaming: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transform hover:scale-105 active:scale-95 font-mono font-bold",
        luxury: "bg-gradient-to-r from-purple-800 via-pink-700 to-purple-800 text-white hover:from-purple-700 hover:via-pink-600 hover:to-purple-700 shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] transform hover:scale-105 active:scale-95 font-bold",
        cosmic: "bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white hover:from-indigo-800 hover:via-purple-700 hover:to-pink-800 shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:shadow-[0_0_35px_rgba(99,102,241,0.9)] transform hover:scale-105 active:scale-95 font-bold animate-pulse",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-5 text-base",
        xl: "h-14 rounded-xl px-8 has-[>svg]:px-7 text-lg",
        icon: "size-10 rounded-lg",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
        ping: "animate-ping",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glowEffect?: boolean;
  particles?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    icon,
    iconPosition = 'left',
    glowEffect = false,
    particles = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {/* 로딩 스피너 */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 버튼 내용 */}
        <motion.div
          className={cn("flex items-center gap-2", loading && "opacity-0")}
          initial={false}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {icon && iconPosition === 'left' && (
            <motion.span
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <motion.span
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>

        {/* 글로우 효과 */}
        {glowEffect && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        )}

        {/* 파티클 효과 */}
        {particles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-current rounded-full opacity-60"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, animation, className }))}
          {...props}
        >
          {buttonContent}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, animation, className }))}
        disabled={isDisabled}
        whileHover={!isDisabled ? { y: -2 } : {}}
        whileTap={!isDisabled ? { y: 0, scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
