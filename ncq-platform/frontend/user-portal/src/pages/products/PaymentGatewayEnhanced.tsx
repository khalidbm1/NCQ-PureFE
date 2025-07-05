import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale } from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Smartphone,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  PieChart,
  Receipt,
  Send,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  X,
  Plus,
  Minus,
  Settings,
  HelpCircle,
  Info,
  Zap,
  ShieldCheck,
  ShieldX,
  UserCheck,
  Users,
  Building2,
  Store,
  ShoppingCart,
  ShoppingBag,
  Package,
  Truck,
  MapPin,
  Navigation,
  Phone,
  Mail,
  MessageSquare,
  Bell,
  BellOff,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  FileText,
  File,
  Folder,
  Database,
  Server,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Cpu,
  HardDrive,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Video,
  Image,
  Music,
  Film,
  Radio,
  Tv,
  Airplay,
  Cast,
  Bluetooth,
  Router,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Disc,
  Disc2,
  Disc3,
  Album,
  Aperture,
  Focus,
  Flashlight,
  FlashlightOff,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudSun,
  CloudMoon,
  CloudOff as CloudOffIcon,
  Droplets,
  Thermometer,
  Wind,
  Tornado,
  Umbrella,
  Rainbow,
  Snowflake,
  Flame,
  Zap as Lightning,
  Star,
  Sparkles,
  Heart,
  HeartOff,
  HeartHandshake,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MessagesSquare,
  Share,
  Share2,
  Forward,
  Reply,
  ReplyAll,
  Send as SendIcon,
  Inbox,
  Archive,
  Trash,
  Trash2,
  Tag,
  Tags,
  Bookmark,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkCheck,
  BookmarkX,
  Flag,
  FlagOff,
  Pin,
  PinOff,
  MapPinOff,
  Compass,
  Map,
  Navigation2,
  Locate,
  LocateFixed,
  LocateOff,
  Target,
  Crosshair,
  Move,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
  Expand,
  Shrink,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronsLeftRight,
  RotateCw,
  RotateCcw,
  RefreshCcw,
  Repeat,
  Repeat1,
  Shuffle,
  Play,
  Pause,
  StopCircle,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Voicemail,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  VideoOff,
  CameraOff,
  MicOff,
  BellRing,
  BellPlus,
  BellMinus,
  Alarm,
  AlarmCheck,
  AlarmMinus,
  AlarmPlus,
  Calendar,
  CalendarDays,
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays as CalendarEvent,
  CalendarHeart,
  CalendarMinus,
  CalendarOff,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  CalendarX2,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  Timer,
  TimerOff,
  TimerReset,
  Stopwatch,
  History,
  Undo,
  Redo,
  Undo2,
  Redo2,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightDown,
  CornerRightUp,
  CornerUpLeft,
  CornerUpRight,
  MoveDownLeft,
  MoveDownRight,
  MoveUpLeft,
  MoveUpRight,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  BarChart,
  BarChart2,
  LineChart,
  PieChart as PieChartIcon,
  Activity as Pulse,
  Waves,
  Gauge,
  Percent,
  Calculator,
  Binary,
  Code,
  Code2,
  Terminal,
  TerminalSquare,
  FileCode,
  FileCode2,
  FolderOpen,
  FolderClosed,
  FolderPlus,
  FolderMinus,
  FolderSearch,
  FolderSearch2,
  FolderX,
  FolderCheck,
  FolderDot,
  FolderGit,
  FolderGit2,
  FolderHeart,
  FolderKey,
  FolderLock,
  FolderOpen as FolderOpenIcon,
  FolderSymlink,
  FolderTree,
  FolderUp,
  FolderDown,
  Files,
  FileStack,
  FilePlus,
  FilePlus2,
  FileMinus,
  FileMinus2,
  FileSearch,
  FileSearch2,
  FileX,
  FileX2,
  FileCheck,
  FileCheck2,
  FileClock,
  FileDigit,
  FileDown,
  FileEdit,
  FileHeart,
  FileImage,
  FileInput,
  FileJson,
  FileJson2,
  FileKey,
  FileKey2,
  FileLock,
  FileLock2,
  FileMusic,
  FileOutput,
  FilePieChart,
  FileQuestion,
  FileScan,
  FileSpreadsheet,
  FileSymlink,
  FileTerminal,
  FileText,
  FileType,
  FileType2,
  FileUp,
  FileVideo,
  FileVideo2,
  FileVolume,
  FileVolume2,
  FileWarning,
  FileX as FileXIcon,
  Paperclip,
  Link,
  Link2,
  Link2Off,
  Unlink,
  Unlink2,
  Anchor,
  Hash,
  AtSign,
  Copyright,
  Copyleft,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  ListEnd,
  ListFilter,
  ListMinus,
  ListMusic,
  ListPlus,
  ListRestart,
  ListStart,
  ListTodo,
  ListTree,
  ListVideo,
  ListX,
  StickyNote,
  PenTool,
  Pencil,
  PencilLine,
  PencilRuler,
  Pen,
  PenSquare,
  PenLine,
  Highlighter,
  Marker,
  Eraser,
  Stamp,
  Brush,
  Paintbrush,
  Paintbrush2,
  Paint,
  PaintBucket,
  Palette,
  SwatchBook,
  Pipette,
  Contrast,
  Crop,
  Slice,
  Scissors,
  Copy as CopyIcon,
  CopyCheck,
  CopyMinus,
  CopyPlus,
  CopySlash,
  CopyX,
  ClipboardIcon,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardEdit,
  ClipboardList,
  ClipboardPaste,
  ClipboardPenLine,
  ClipboardSignature,
  ClipboardType,
  ClipboardX,
  Book,
  BookA,
  BookAudio,
  BookCheck,
  BookCopy,
  BookDashed,
  BookDown,
  BookHeadphones,
  BookHeart,
  BookImage,
  BookKey,
  BookLock,
  BookMarked,
  BookMinus,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookPlus,
  BookText,
  BookType,
  BookUp,
  BookUp2,
  BookUser,
  BookX,
  NotebookIcon,
  NotebookPen,
  NotebookTabs,
  NotebookText,
  Newspaper,
  LibraryBig,
  LibrarySquare,
  Library,
  GraduationCap,
  School,
  School2,
  Backpack,
  LampDesk,
  Microscope,
  Telescope,
  Binoculars,
  ScanSearch,
  ScanText,
  ScanBarcode,
  ScanEye,
  ScanFace,
  ScanLine,
  QrCode,
  Barcode,
  TicketIcon,
  TicketCheck,
  TicketMinus,
  TicketPercent,
  TicketPlus,
  TicketSlash,
  TicketX,
  Receipt as ReceiptIcon,
  ReceiptCent,
  ReceiptEuro,
  ReceiptIndianRupee,
  ReceiptJapaneseYen,
  ReceiptPoundSterling,
  ReceiptRussianRuble,
  ReceiptSwissFranc,
  ReceiptText,
  ScrollIcon,
  ScrollText,
  FileStack as Stack,
  Layers,
  Layers2,
  Layers3,
  Combine,
  Ungroup,
  Group,
  BoxSelect,
  Lasso,
  LassoSelect,
  Component,
  Puzzle,
  Blocks,
  Cuboid,
  Cylinder,
  Box,
  Package as PackageIcon,
  Package2,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  PackageSearch,
  PackageX,
  Codesandbox,
  Container,
  Hexagon,
  Pentagon,
  Octagon,
  Square,
  Circle,
  CircleOff,
  CircleAlert,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowOutDownLeft,
  CircleArrowOutDownRight,
  CircleArrowOutUpLeft,
  CircleArrowOutUpRight,
  CircleArrowRight,
  CircleArrowUp,
  CircleCheck,
  CircleCheckBig,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  CircleChevronUp,
  CircleDashed,
  CircleDollarSign,
  CircleDot,
  CircleDotDashed,
  CircleEllipsis,
  CircleEqual,
  CircleFadingPlus,
  CircleGauge,
  CircleHelp,
  CircleMinus,
  CircleOff as CircleOffIcon,
  CircleParking,
  CircleParkingOff,
  CirclePause,
  CirclePercent,
  CirclePlay,
  CirclePlus,
  CirclePower,
  CircleSlash,
  CircleSlash2,
  CircleStop,
  CircleUser,
  CircleUserRound,
  CircleX,
  Triangle,
  TriangleAlert,
  TriangleRight,
  Diamond,
  DiamondPercent,
  Gem,
  Crown,
  Award,
  Medal,
  Trophy,
  Gift,
  PartyPopper,
  Sparkle,
  Wand,
  Wand2,
  BadgeIcon,
  BadgeAlert,
  BadgeCent,
  BadgeCheck,
  BadgeDollarSign as BadgeDollar,
  BadgeEuro,
  BadgeHelp,
  BadgeIndianRupee,
  BadgeInfo,
  BadgeJapaneseYen,
  BadgeMinus,
  BadgePercent,
  BadgePlus,
  BadgePoundSterling,
  BadgeRussianRuble,
  BadgeSwissFranc,
  BadgeX,
  Banknote,
  Coins,
  Currency,
  DollarSign as Dollar,
  Euro,
  IndianRupee,
  JapaneseYen,
  PoundSterling,
  RussianRuble,
  SwissFranc,
  HandCoins,
  Landmark,
  Wallet,
  Wallet2,
  WalletCards,
  WalletMinimal,
  PiggyBank,
  Vault,
  SafeIcon,
  ShieldAlert,
  ShieldBan,
  ShieldCheck as ShieldCheckIcon,
  ShieldEllipsis,
  ShieldHalf,
  ShieldMinus,
  ShieldOff,
  ShieldPlus,
  ShieldQuestion,
  ShieldX as ShieldXIcon,
  LockIcon,
  LockKeyhole,
  LockKeyholeOpen,
  LockOpen,
  Unlock as UnlockIcon,
  UnlockKeyhole,
  KeyIcon,
  KeyRound,
  KeySquare,
  Fingerprint,
  ScanIcon,
  ScanBarcode as ScanBarcodeIcon,
  ScanEye as ScanEyeIcon,
  ScanFace as ScanFaceIcon,
  ScanLine as ScanLineIcon,
  ScanSearch as ScanSearchIcon,
  ScanText as ScanTextIcon,
  Ban,
  BanIcon,
  CircleSlash as CircleSlashIcon,
  CircleSlash2 as CircleSlash2Icon,
  Slash,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundMinus,
  UserRoundPen,
  UserRoundPlus,
  UserRoundSearch,
  UserRoundX,
  UserCog,
  UserMinus,
  UserPen,
  UserPlus,
  UserSearch,
  UserX,
  UsersRound,
  Contact,
  Contact2,
  PersonStanding
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Mock transaction data
const mockTransactions = [
  { id: 'TXN001', merchant: 'NCQ Store', amount: 150.00, currency: 'SAR', status: 'completed', method: 'MADA', time: '2 min ago', fee: 3.75 },
  { id: 'TXN002', merchant: 'Smart Cafe', amount: 45.50, currency: 'SAR', status: 'processing', method: 'STC Pay', time: '5 min ago', fee: 1.14 },
  { id: 'TXN003', merchant: 'Tech Shop', amount: 890.00, currency: 'SAR', status: 'completed', method: 'Visa', time: '12 min ago', fee: 22.25 },
  { id: 'TXN004', merchant: 'Fashion Hub', amount: 320.00, currency: 'SAR', status: 'failed', method: 'Mastercard', time: '18 min ago', fee: 0 },
  { id: 'TXN005', merchant: 'Food Delivery', amount: 78.90, currency: 'SAR', status: 'completed', method: 'Apple Pay', time: '25 min ago', fee: 1.97 }
];

const paymentMethods = [
  { id: 'mada', name: 'MADA', icon: CreditCard, volume: 45, share: 35, enabled: true },
  { id: 'stc', name: 'STC Pay', icon: Smartphone, volume: 32, share: 25, enabled: true },
  { id: 'visa', name: 'Visa', icon: CreditCard, volume: 28, share: 22, enabled: true },
  { id: 'mastercard', name: 'Mastercard', icon: CreditCard, volume: 15, share: 12, enabled: true },
  { id: 'apple', name: 'Apple Pay', icon: Smartphone, volume: 8, share: 6, enabled: true },
  { id: 'sadad', name: 'SADAD', icon: Building2, volume: 0, share: 0, enabled: false }
];

export default function PaymentGatewayEnhanced() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [showTestMode, setShowTestMode] = useState(false);
  const [enable3DSecure, setEnable3DSecure] = useState(true);
  const [enableFraudDetection, setEnableFraudDetection] = useState(true);

  // Chart data
  const transactionVolumeData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Transaction Volume',
        data: [120, 95, 280, 450, 380, 220],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Success Rate (%)',
        data: [95, 93, 97, 96, 94, 95],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  const paymentMethodsData = {
    labels: paymentMethods.map(m => m.name),
    datasets: [
      {
        data: paymentMethods.map(m => m.share),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }
    ]
  };

  const fraudDetectionData = {
    labels: ['Authentication', 'Velocity', 'Geolocation', 'Device', 'Behavioral', 'ML Score'],
    datasets: [
      {
        label: 'Risk Score',
        data: [85, 72, 90, 78, 88, 92],
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        borderColor: 'rgb(239, 68, 68)',
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(239, 68, 68)'
      }
    ]
  };

  const settlementData = {
    labels: ['Pending', 'Processing', 'Settled', 'Disputed'],
    datasets: [
      {
        data: [23500, 45200, 892000, 3200],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-green-500" />
            Payment Gateway
          </h1>
          <p className="text-muted-foreground mt-1">
            Secure payment processing with advanced fraud detection
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="test-mode" className="text-sm">Test Mode</Label>
            <Switch
              id="test-mode"
              checked={showTestMode}
              onCheckedChange={setShowTestMode}
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Integration
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { 
            title: 'Total Volume', 
            value: showTestMode ? 'SAR 0.00' : 'SAR 1.2M', 
            change: '+18%', 
            icon: DollarSign, 
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            trend: 'up'
          },
          { 
            title: 'Transactions', 
            value: showTestMode ? '0' : '8,456', 
            change: '+12%', 
            icon: CreditCard, 
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            trend: 'up'
          },
          { 
            title: 'Success Rate', 
            value: showTestMode ? 'N/A' : '96.8%', 
            change: '+2.3%', 
            icon: CheckCircle, 
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            trend: 'up'
          },
          { 
            title: 'Avg. Transaction', 
            value: showTestMode ? 'SAR 0.00' : 'SAR 142', 
            change: '+5%', 
            icon: Activity, 
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            trend: 'up'
          },
          { 
            title: 'Fraud Blocked', 
            value: showTestMode ? '0' : '23', 
            change: '-15%', 
            icon: Shield, 
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/20',
            trend: 'down'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("relative overflow-hidden", metric.bgColor)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-800", metric.bgColor)}>
                  <metric.icon className={cn("h-4 w-4", metric.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                  {metric.change} from yesterday
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard View */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Transaction Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Transaction Volume & Success Rate
                </CardTitle>
                <CardDescription>24-hour overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line 
                    data={transactionVolumeData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false,
                      },
                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'left' as const,
                          title: {
                            display: true,
                            text: 'Transactions'
                          }
                        },
                        y1: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          min: 90,
                          max: 100,
                          grid: {
                            drawOnChartArea: false,
                          },
                          title: {
                            display: true,
                            text: 'Success Rate (%)'
                          }
                        },
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Payment Methods Distribution
                </CardTitle>
                <CardDescription>Transaction volume by method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Doughnut 
                    data={paymentMethodsData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right' as const,
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CreditCard, label: 'Process Payment', desc: 'Manual transaction', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
              { icon: RefreshCw, label: 'Refund', desc: 'Process refunds', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
              { icon: Receipt, label: 'Invoices', desc: 'Generate invoices', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
              { icon: Shield, label: 'Fraud Center', desc: 'Review suspicious', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn("cursor-pointer hover:shadow-lg transition-all", action.bg)}>
                  <CardContent className="p-6">
                    <action.icon className={cn("w-8 h-8 mb-3", action.color)} />
                    <h4 className="font-semibold">{action.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        transaction.status === 'completed' && "bg-green-100 dark:bg-green-950",
                        transaction.status === 'processing' && "bg-blue-100 dark:bg-blue-950",
                        transaction.status === 'failed' && "bg-red-100 dark:bg-red-950"
                      )}>
                        <CreditCard className={cn(
                          "w-5 h-5",
                          transaction.status === 'completed' && "text-green-600",
                          transaction.status === 'processing' && "text-blue-600",
                          transaction.status === 'failed' && "text-red-600"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.merchant}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.method} • {transaction.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </p>
                      <Badge className={cn(
                        "text-xs",
                        transaction.status === 'completed' && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                        transaction.status === 'processing' && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        transaction.status === 'failed' && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      )}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions View */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by transaction ID, merchant, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Detailed transaction records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Transaction ID</th>
                      <th className="text-left p-2">Merchant</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-accent">
                        <td className="p-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{transaction.id}</code>
                        </td>
                        <td className="p-2">{transaction.merchant}</td>
                        <td className="p-2 font-medium">
                          {transaction.currency} {transaction.amount.toFixed(2)}
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{transaction.method}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={cn(
                            transaction.status === 'completed' && "bg-green-100 text-green-700",
                            transaction.status === 'processing' && "bg-blue-100 text-blue-700",
                            transaction.status === 'failed' && "bg-red-100 text-red-700"
                          )}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">{transaction.time}</td>
                        <td className="p-2">
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods View */}
        <TabsContent value="methods" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={cn(!method.enabled && "opacity-60")}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <method.icon className="w-5 h-5" />
                      {method.name}
                    </div>
                    <Switch checked={method.enabled} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Volume</span>
                      <span className="font-medium">{method.volume}%</span>
                    </div>
                    <Progress value={method.volume} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Market Share</p>
                        <p className="text-lg font-bold">{method.share}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-lg font-bold">{method.enabled ? '96%' : 'N/A'}</p>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Features */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Features</CardTitle>
              <CardDescription>Advanced payment capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">3D Secure Authentication</p>
                      <p className="text-sm text-muted-foreground">Risk-based authentication for card payments</p>
                    </div>
                  </div>
                  <Switch checked={enable3DSecure} onCheckedChange={setEnable3DSecure} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">AI Fraud Detection</p>
                      <p className="text-sm text-muted-foreground">Machine learning-based fraud prevention</p>
                    </div>
                  </div>
                  <Switch checked={enableFraudDetection} onCheckedChange={setEnableFraudDetection} />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Multi-Currency Support</p>
                      <p className="text-sm text-muted-foreground">Accept payments in 135+ currencies</p>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Digital Wallets</p>
                      <p className="text-sm text-muted-foreground">Apple Pay, Google Pay, STC Pay integration</p>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security View */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Fraud Detection Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Fraud Detection Analysis
                </CardTitle>
                <CardDescription>AI-powered risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Radar 
                    data={fraudDetectionData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Security Alerts
                </CardTitle>
                <CardDescription>Recent suspicious activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'High Risk', message: 'Multiple failed attempts from IP 192.168.1.1', time: '5 min ago', severity: 'high' },
                    { type: 'Velocity', message: 'Unusual transaction pattern detected', time: '15 min ago', severity: 'medium' },
                    { type: 'Geography', message: 'Transaction from new country: Brazil', time: '1 hour ago', severity: 'low' },
                    { type: 'Amount', message: 'Transaction 300% above average', time: '2 hours ago', severity: 'medium' }
                  ].map((alert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded-lg border",
                        alert.severity === 'high' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                        alert.severity === 'medium' && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                        alert.severity === 'low' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{alert.type}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: 'Fraud Rate', value: '0.08%', change: '-12%', icon: ShieldX, color: 'text-green-500' },
              { label: 'Blocked Transactions', value: '23', change: '+5', icon: Ban, color: 'text-red-500' },
              { label: 'Chargebacks', value: '7', change: '-2', icon: RefreshCw, color: 'text-orange-500' },
              { label: 'Security Score', value: '94/100', change: '+2', icon: ShieldCheck, color: 'text-blue-500' }
            ].map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={cn("w-5 h-5", metric.color)} />
                    <span className="text-sm text-muted-foreground">{metric.change}</span>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settlements View */}
        <TabsContent value="settlements" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Settlement Status */}
            <Card>
              <CardHeader>
                <CardTitle>Settlement Status</CardTitle>
                <CardDescription>Current settlement distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Doughnut 
                    data={settlementData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settlement Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Settlement Schedule</CardTitle>
                <CardDescription>Upcoming settlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Today', amount: 'SAR 125,400', status: 'processing', time: '2:00 PM' },
                    { date: 'Tomorrow', amount: 'SAR 98,750', status: 'scheduled', time: '2:00 PM' },
                    { date: 'Dec 12', amount: 'SAR 156,200', status: 'scheduled', time: '2:00 PM' },
                    { date: 'Dec 13', amount: 'SAR 142,800', status: 'scheduled', time: '2:00 PM' }
                  ].map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{settlement.date}</p>
                        <p className="text-sm text-muted-foreground">{settlement.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{settlement.amount}</p>
                        <Badge variant={settlement.status === 'processing' ? 'default' : 'secondary'}>
                          {settlement.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settlement Details */}
          <Card>
            <CardHeader>
              <CardTitle>Settlement Details</CardTitle>
              <CardDescription>Breakdown by payment method and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Method</th>
                      <th className="text-right p-2">Transactions</th>
                      <th className="text-right p-2">Gross Amount</th>
                      <th className="text-right p-2">Fees</th>
                      <th className="text-right p-2">Net Amount</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.filter(m => m.enabled).map((method) => (
                      <tr key={method.id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <method.icon className="w-4 h-4 text-muted-foreground" />
                            {method.name}
                          </div>
                        </td>
                        <td className="p-2 text-right">{Math.floor(Math.random() * 1000)}</td>
                        <td className="p-2 text-right font-medium">SAR {(Math.random() * 100000).toFixed(2)}</td>
                        <td className="p-2 text-right text-red-600">SAR {(Math.random() * 3000).toFixed(2)}</td>
                        <td className="p-2 text-right font-semibold">SAR {(Math.random() * 97000).toFixed(2)}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Average Transaction Value', value: 'SAR 142', change: '+5.2%', period: 'vs last week' },
              { label: 'Conversion Rate', value: '68.4%', change: '+2.8%', period: 'vs last week' },
              { label: 'Cart Abandonment', value: '31.6%', change: '-2.8%', period: 'vs last week' },
              { label: 'Repeat Customers', value: '42%', change: '+8.5%', period: 'vs last month' }
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.change.startsWith('+') ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={cn(
                      "text-xs",
                      stat.change.startsWith('+') ? "text-green-500" : "text-red-500"
                    )}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.period}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue and transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line 
                  data={{
                    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Revenue (SAR)',
                        data: [850000, 920000, 980000, 1050000, 1150000, 1200000],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        yAxisID: 'y',
                      },
                      {
                        label: 'Transactions',
                        data: [6200, 6800, 7200, 7600, 8200, 8456],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        yAxisID: 'y1',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    scales: {
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        title: {
                          display: true,
                          text: 'Revenue (SAR)'
                        }
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                        title: {
                          display: true,
                          text: 'Transaction Count'
                        }
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Transaction Details</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Transaction Overview */}
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-mono font-semibold">{selectedTransaction.id}</p>
                    </div>
                    <Badge className={cn(
                      "text-lg px-3 py-1",
                      selectedTransaction.status === 'completed' && "bg-green-100 text-green-700",
                      selectedTransaction.status === 'processing' && "bg-blue-100 text-blue-700",
                      selectedTransaction.status === 'failed' && "bg-red-100 text-red-700"
                    )}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Merchant</p>
                        <p className="font-medium">{selectedTransaction.merchant}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">{selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{selectedTransaction.method}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Processing Fee</p>
                        <p className="font-medium">{selectedTransaction.currency} {selectedTransaction.fee.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Net Amount</p>
                        <p className="font-medium">{selectedTransaction.currency} {(selectedTransaction.amount - selectedTransaction.fee).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p className="font-medium">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refund
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Receipt
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-3">Transaction Timeline</h3>
                    <div className="space-y-3">
                      {[
                        { event: 'Payment initiated', time: '2:45:30 PM', status: 'completed' },
                        { event: '3D Secure authentication', time: '2:45:32 PM', status: 'completed' },
                        { event: 'Payment authorized', time: '2:45:35 PM', status: 'completed' },
                        { event: 'Payment captured', time: '2:45:36 PM', status: selectedTransaction.status }
                      ].map((event, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            event.status === 'completed' && "bg-green-100 dark:bg-green-950",
                            event.status === 'processing' && "bg-blue-100 dark:bg-blue-950",
                            event.status === 'failed' && "bg-red-100 dark:bg-red-950"
                          )}>
                            {event.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                            {event.status === 'processing' && <Clock className="w-4 h-4 text-blue-600" />}
                            {event.status === 'failed' && <X className="w-4 h-4 text-red-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}