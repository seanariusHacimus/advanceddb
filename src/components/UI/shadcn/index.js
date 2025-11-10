// Central export file for all shadcn/ui components
// This makes imports easier: import { Button, Input, Card } from './components/UI/shadcn';

// Layout & Navigation
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
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
export { Separator } from './separator';
export { Progress } from './progress';
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
export { Button, IconButton, ButtonGroup } from './button';
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

