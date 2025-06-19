// UI 컴포넌트 통합 export - 통합 가이드 기준

// 기본 UI 컴포넌트
export { default as Accordion } from './Accordion';
export type { AccordionProps, AccordionItem } from './Accordion';

export { default as Alert } from './Alert';
export type { AlertProps } from './Alert';

export { default as AlertDialog } from './AlertDialog';
export type { AlertDialogProps } from './AlertDialog';

export { default as AspectRatio } from './AspectRatio';
export type { AspectRatioProps } from './AspectRatio';

export { default as Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { default as Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Calendar } from './Calendar';
export type { CalendarProps } from './Calendar';

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { default as Collapsible } from './Collapsible';
export type { CollapsibleProps } from './Collapsible';

export { default as Dialog } from './Dialog';
export type { DialogProps } from './Dialog';

export { default as Form } from './Form';
export type { FormProps, FormFieldProps } from './Form';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Label } from './Label';
export type { LabelProps } from './Label';

export { default as Layout } from './Layout';
export type { LayoutProps } from './Layout';

export { default as Loading } from './Loading';
export type { LoadingProps } from './Loading';

export { default as MotionCard } from './MotionCard';
export type { MotionCardProps } from './MotionCard';

export { default as Popover } from './Popover';
export type { PopoverProps } from './Popover';

export { default as Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { default as RadioGroup } from './RadioGroup';
export type { RadioGroupProps, RadioOption } from './RadioGroup';

export { default as Select } from './Select';
export type { SelectProps } from './Select';

export { default as Separator } from './Separator';
export type { SeparatorProps } from './Separator';

export { default as Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { default as Switch } from './Switch';
export type { SwitchProps } from './Switch';

export { default as Tabs } from './Tabs';
export type { TabsProps, TabItem } from './Tabs';

export { default as Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

export { default as Toast } from './Toast';
export type { ToastProps } from './Toast';

export { default as TokenDisplay } from './TokenDisplay';
export type { TokenDisplayProps } from './TokenDisplay';

export { default as Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

// 추가 UI 컴포넌트들
export { default as Carousel } from './Carousel';
export type { CarouselProps, CarouselItem } from './Carousel';

export { default as Chart } from './Chart';
export type { ChartProps, ChartDataPoint } from './Chart';

export { default as Command } from './Command';
export type { CommandProps, CommandItem } from './Command';

export { default as ContextMenu } from './ContextMenu';
export type { ContextMenuProps, ContextMenuItem } from './ContextMenu';

export { default as Drawer } from './Drawer';
export type { DrawerProps } from './Drawer';

export { default as DropdownMenu } from './DropdownMenu';
export type { DropdownMenuProps, DropdownMenuItem } from './DropdownMenu';

export { default as HoverCard } from './HoverCard';
export type { HoverCardProps } from './HoverCard';

export { default as Menubar } from './Menubar';
export type { MenubarProps, MenubarItem } from './Menubar';

export { default as NavigationMenu } from './NavigationMenu';
export type { NavigationMenuProps, NavigationMenuItem } from './NavigationMenu';

export { default as Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { default as Resizable } from './Resizable';
export type { ResizableProps } from './Resizable';

export { default as ScrollArea } from './ScrollArea';
export type { ScrollAreaProps } from './ScrollArea';

// 새로 추가된 컴포넌트들
export { 
  Sidebar, 
  SidebarProvider, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarTrigger, 
  SidebarInset 
} from './Sidebar';

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption 
} from './Table';

export { Toggle } from './Toggle';

export { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

export { 
  ToasterProvider, 
  useToast, 
  toast 
} from './Sonner';

// 유틸리티 훅들
export { useMobile, useMediaQuery, useBreakpoint, useOrientation, useViewport } from './use-mobile';

// 유틸리티 함수들
export { cn, formatNumber, delay, debounce, throttle, storage, generateId, removeEmpty, chunk, shuffle } from './utils';

// 게임 전용 컴포넌트 (체크리스트 요구사항)
export { default as TokenBalanceWidget } from './TokenBalanceWidget';
export type { TokenBalanceWidgetProps } from './TokenBalanceWidget';

export { default as CJChatBubble } from './CJChatBubble';
export type { CJChatBubbleProps, Message } from './CJChatBubble';

export { CJAIChatBubble } from './CJAIChatBubble';
export type { CJAIChatBubbleProps, Message as CJAIMessage } from './CJAIChatBubble';

export { default as SlotMachine } from './SlotMachine';
export type { SlotMachineProps } from './SlotMachine';

// 추후 추가될 게임 컴포넌트들
// export { default as RouletteWheel } from './RouletteWheel';
// export { default as GachaBox } from './GachaBox';
// export { default as RPSGame } from './RPSGame';
