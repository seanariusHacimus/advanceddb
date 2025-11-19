// Central export file for all shadcn/ui components
// This makes imports easier: import { Button, Input, Card } from './components/UI/shadcn';

// Layout & Navigation
export { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarDivider, 
  SidebarNavItem, 
  SidebarNavLink 
} from './sidebar';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Navigation, NavigationItem, NavigationSpacer } from './navigation';
export { Separator } from './separator';
export { Progress } from './progress';
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
export { Row, Col, RowWithGutter } from './grid';
export { Modal, ModalOverlay, ModalContainer, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from './modal';
// Re-export ModalContainer as ModalContent for compatibility
export { ModalContainer as ModalContent } from './modal';
export { 
  DropdownMenu, 
  DropdownTrigger, 
  DropdownContent, 
  DropdownItem, 
  DropdownSeparator, 
  DropdownLabel,
  DropdownShortcut,
  DropdownMenuWrapper 
} from './dropdown';

// Form Components
export { Input, Textarea, Label, FormGroup, FormError, FormDescription, InputWrapper, InputIcon } from './input';
export { Checkbox } from './checkbox';
export { Radio } from './radio';
export { Switch } from './switch';
export { Select } from './select';

// UI Elements
export { Button, IconButton } from './button';
export { ButtonGroup, ButtonGroupItem, PageHeader, PageHeaderTitle, PageHeaderActions } from './button-group';
export { Badge, DotBadge, BadgeGroup } from './badge';
export { Avatar, AvatarContainer, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup } from './avatar';
export { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
export { 
  Skeleton, 
  SkeletonText, 
  SkeletonHeading, 
  SkeletonAvatar, 
  SkeletonButton,
  SkeletonCard,
  SkeletonCardPattern,
  SkeletonProfile 
} from './skeleton';

// Feedback
export { 
  Alert, 
  AlertIcon, 
  AlertContent, 
  AlertTitle, 
  AlertDescription,
  AlertWithIcon 
} from './alert';
export { Empty } from './empty';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard, StatCardContent } from './card';
export { MiniProgressIndicator } from './mini-progress-indicator';
export { 
  PieChart, 
  PieChartContainer, 
  PieChartLegend, 
  LegendItem, 
  LegendLabel, 
  LegendColor, 
  LegendValue,
  ProgressList,
  ProgressListItem,
  ProgressItem,
  ProgressHeader,
  ProgressTitle,
  ProgressPercentage,
  ProgressBarContainer,
  ProgressBarFill,
  TaskList,
  TaskListItem,
  TaskBadge,
  TaskContent,
  TaskTitle,
  TaskMeta,
  TaskAction
} from './charts';
export { ToastProvider, useToast } from './toast';
export { 
  Dialog, 
  DialogOverlay, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogBody, 
  DialogFooter, 
  DialogClose 
} from './dialog';
export { AlertDialog, Popconfirm, useAlertDialog } from './alert-dialog';
export { 
  Table, 
  TableContainer, 
  TableElement, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell 
} from './table';

// Additional migrated components (already exported above, kept for clarity)
// export { Modal } - already exported on line 20
// export { Select } - already exported on line 37
// export { Alert } - already exported on lines 57-64
export { DatePicker } from './datepicker';
export { Spin } from './spin';
// Divider - use Separator instead (already exported on line 16)
export {
  SubActionCard,
  SubActionCardItem,
  SubActionsContainer,
  AddSubActionContainer,
  DragHandle,
  SubActionContent,
  SubActionName,
  SubActionDate,
  SubActionResponsible,
  SubActionStatus,
  SubActionActions
} from './sub-action-card';

