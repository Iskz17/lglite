export { Button, type ButtonProps } from "./components/button/button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from "./components/card/card";
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
} from "./components/dialog/dialog";
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverArrow,
  type PopoverContentProps,
} from "./components/popover/popover";
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  type TooltipContentProps,
} from "./components/tooltip/tooltip";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  type DropdownMenuContentProps,
} from "./components/dropdown-menu/dropdown-menu";
export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsListProps } from "./components/tabs/tabs";
export { Badge, type BadgeProps } from "./components/badge/badge";
export { Input, type InputProps } from "./components/input/input";
export { Switch, type SwitchProps } from "./components/switch/switch";
export { Slider, type SliderProps } from "./components/slider/slider";
export { Dock, DockItem, dockMagnify, type DockProps, type DockItemProps } from "./components/dock/dock";
export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  type NavbarProps,
  type NavbarContentProps,
  type NavbarItemProps,
} from "./components/navbar/navbar";

// --- Phase 3 Overlay batch ---
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
} from "./components/alert-dialog/alert-dialog";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuContent,
  ContextMenuSubContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuSubTrigger,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  type ContextMenuContentProps,
} from "./components/context-menu/context-menu";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
} from "./components/sheet/sheet";
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardContentProps,
} from "./components/hover-card/hover-card";
export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarSub,
  MenubarTrigger,
  MenubarContent,
  MenubarSubContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSubTrigger,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  type MenubarProps,
  type MenubarContentProps,
} from "./components/menubar/menubar";
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  type NavigationMenuProps,
  type NavigationMenuViewportProps,
} from "./components/navigation-menu/navigation-menu";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  type SelectContentProps,
} from "./components/select/select";
export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerContentProps,
} from "./components/drawer/drawer";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  type CommandProps,
  type CommandDialogProps,
} from "./components/command/command";

// --- Phase 3 Control batch ---
export { Checkbox, type CheckboxProps } from "./components/checkbox/checkbox";
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from "./components/radio-group/radio-group";
export { Toggle, toggleVariants, type ToggleProps } from "./components/toggle/toggle";
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
} from "./components/toggle-group/toggle-group";
export { Progress, type ProgressProps } from "./components/progress/progress";

// --- Phase 3 Flat / Inset / remaining batch ---
export { Label, type LabelProps } from "./components/label/label";
export { Separator, type SeparatorProps } from "./components/separator/separator";
export { Skeleton, type SkeletonProps } from "./components/skeleton/skeleton";
export { AspectRatio } from "./components/aspect-ratio/aspect-ratio";
export { Textarea, type TextareaProps } from "./components/textarea/textarea";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPProps,
  type InputOTPSlotProps,
} from "./components/input-otp/input-otp";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
} from "./components/accordion/accordion";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/collapsible/collapsible";
export { Alert, AlertTitle, AlertDescription, alertVariants, type AlertProps } from "./components/alert/alert";
export { Avatar, AvatarImage, AvatarFallback, type AvatarProps } from "./components/avatar/avatar";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbLinkProps,
} from "./components/breadcrumb/breadcrumb";
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  type PaginationLinkProps,
} from "./components/pagination/pagination";
export { ScrollArea, ScrollBar, type ScrollAreaProps, type ScrollBarProps } from "./components/scroll-area/scroll-area";
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
  type CarouselProps,
  type CarouselButtonProps,
} from "./components/carousel/carousel";
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type ResizableHandleProps,
} from "./components/resizable/resizable";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./components/table/table";
export { DataTable, type ColumnDef, type DataTableProps } from "./components/data-table/data-table";
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  type SidebarProps,
  type SidebarMenuButtonProps,
} from "./components/sidebar/sidebar";
export { Toaster, toast, type ToasterProps } from "./components/sonner/sonner";

// --- Phase 3 Compositions ---
export { Calendar, type CalendarProps } from "./components/calendar/calendar";
export { DatePicker, type DatePickerProps } from "./components/date-picker/date-picker";
export { Combobox, type ComboboxProps, type ComboboxOption } from "./components/combobox/combobox";
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./components/form/form";

// Re-export the engine surface so consumers need only @lglite/react.
export {
  GlassProvider,
  GlassScript,
  GlassText,
  useGlass,
  cn,
  glassSurface,
  type GlassProviderProps,
} from "@lglite/glass-core";
