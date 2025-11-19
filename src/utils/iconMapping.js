// Icon mapping from Ant Design Icons to Lucide React
// This file helps with systematic migration
import {
  Menu as MenuIcon,
  MoreVertical,
  MoreHorizontal,
  Info,
  Settings,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  FileSpreadsheet,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Download,
  Send,
  Trash2,
  Plus,
  PlusCircle,
  CheckCircle,
  XCircle,
  Search,
  Inbox,
  HelpCircle,
  UserPlus,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

export const iconMap = {
  // Menu & Navigation
  MenuOutlined: MenuIcon,
  MoreOutlined: MoreVertical,
  MoreHorizontalOutlined: MoreHorizontal,
  
  // Info & Settings
  InfoCircleOutlined: Info,
  SettingOutlined: Settings,
  SettingsOutlined: Settings,
  QuestionOutlined: HelpCircle,
  QuestionCircleOutlined: HelpCircle,
  
  // Arrows
  ArrowDownOutlined: ArrowDown,
  ArrowUpOutlined: ArrowUp,
  ArrowRightOutlined: ArrowRight,
  LeftOutlined: ChevronLeft,
  
  // Files
  FileExcelOutlined: FileSpreadsheet,
  FileExcelFilled: FileSpreadsheet,
  FilePdfOutlined: FileText,
  FilePdfFilled: FileText,
  PaperClipOutlined: Paperclip,
  FileImageOutlined: ImageIcon,
  CloudDownloadOutlined: Download,
  InboxOutlined: Inbox,
  
  // Actions
  SendOutlined: Send,
  DeleteOutlined: Trash2,
  PlusOutlined: Plus,
  PlusCircleOutlined: PlusCircle,
  CheckCircleOutlined: CheckCircle,
  CheckCircleFilled: CheckCircle,
  CloseCircleOutlined: XCircle,
  CloseCircleFilled: XCircle,
  SearchOutlined: Search,
  
  // User
  UserAddOutlined: UserPlus,
  LogoutOutlined: LogOut,
};

export default iconMap;

