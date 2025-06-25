"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs@1.1.3";
import { cn } from "../ui/utils";

function ElegantTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="elegant-tabs"
      className={cn("flex flex-col gap-4 sm:gap-6", className)}
      {...props}
    />
  );
}

function ElegantTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="elegant-tabs-list"
      className={cn(
        "elegant-tabs-container",
        "inline-flex items-center justify-center rounded-2xl",
        "p-1.5 md:p-2",
        "overflow-x-auto scrollbar-hide",
        "min-h-[52px] md:min-h-[60px] w-full",
        // 데스크톱에서 최대 너비 제한
        "max-w-full md:max-w-2xl lg:max-w-3xl",
        className,
      )}
      {...props}
    />
  );
}

function ElegantTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="elegant-tabs-trigger"
      className={cn(
        "elegant-tab",
        "inline-flex items-center justify-center gap-1.5 rounded-xl",
        // 모바일과 데스크톱에서 다른 패딩
        "px-3 py-2.5 md:px-5 md:py-3.5",
        "transition-all duration-300 whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98] touch-manipulation",
        // 터치 타겟 크기 보장
        "min-h-[44px] min-w-[44px] md:min-h-[48px] md:min-w-[48px]",
        // 아이콘 크기 조정
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "[&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-5 md:[&_svg]:h-5",
        // 텍스트 크기 반응형
        "text-sm md:text-base",
        // 활성 상태 스타일링
        "data-[state=active]:active",
        className,
      )}
      {...props}
    />
  );
}

function ElegantTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="elegant-tabs-content"
      className={cn(
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:rounded-lg",
        // 모바일과 데스크톱에서 다른 패딩
        "px-2 md:px-4 lg:px-0",
        // 부드러운 페이드 인 애니메이션
        "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2",
        "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-bottom-2",
        "duration-300",
        className
      )}
      {...props}
    />
  );
}

export { ElegantTabs, ElegantTabsList, ElegantTabsTrigger, ElegantTabsContent };