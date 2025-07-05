import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Activity,
  Heart,
  Users,
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  UserPlus,
  BedDouble,
  Syringe,
  Brain,
  Eye,
  Baby,
  Bone,
  HeartHandshake,
  ShieldCheck,
  Microscope,
  Zap,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Timer,
  Loader2,
  QrCode,
  Smartphone,
  CreditCard,
  Receipt,
  Banknote,
  Wifi,
  Volume2,
  Camera,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Car,
  Bus,
  Info,
  Settings,
  LogOut,
  RefreshCw,
  Share2,
  Printer,
  Save,
  Send,
  Archive,
  BarChart3,
  PieChart,
  LineChart,
  CalendarDays,
  UserCheck,
  UserX,
  ClipboardList,
  Clipboard,
  FileCheck,
  FilePlus,
  FolderOpen,
  Database,
  Server,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  ScanLine,
  Cpu,
  HardDrive,
  Radio,
  Bluetooth,
  Cast,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Mic,
  Video,
  Image,
  Paperclip,
  Link,
  Globe,
  Navigation,
  Compass,
  Map,
  Flag,
  Bookmark,
  Star,
  Award,
  Gift,
  Package,
  ShoppingCart,
  ShoppingBag,
  Tag,
  Percent,
  Calculator,
  Wallet,
  PiggyBank,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
  BarChart,
  Activity as Pulse,
  Zap as Lightning,
  Sparkles,
  Flame,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunrise,
  Sunset,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  MoreHorizontal,
  Grid,
  List,
  LayoutGrid,
  LayoutList,
  Columns,
  Sidebar,
  PanelLeft,
  PanelRight,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  RotateCw,
  RotateCcw,
  Repeat,
  Shuffle,
  Play,
  Pause,
  StopCircle,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Volume,
  VolumeX,
  Volume1,
  Volume2 as VolumeHigh,
  Airplay,
  Tv,
  Tv2,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Gitlab,
  Chrome,
  Command,
  Cloud,
  CloudOff,
  CloudUpload,
  CloudDownload,
  Upload,
  UploadCloud,
  Download as DownloadIcon,
  DownloadCloud,
  HelpCircle,
  InfoIcon,
  AlertTriangle,
  AlertOctagon,
  XCircle,
  XOctagon,
  CheckCircle2,
  CheckSquare,
  X,
  Check,
  Minus,
  PlusIcon,
  MinusCircle,
  PlusCircle,
  PlusSquare,
  MinusSquare,
  Hash,
  AtSign,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Mail as MailIcon,
  Send as SendIcon,
  Inbox,
  Archive as ArchiveIcon,
  Trash,
  Trash2 as TrashIcon,
  PenTool,
  Edit2,
  Edit3,
  Eraser,
  Scissors,
  Copy,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardList as ClipboardListIcon,
  ClipboardX,
  FileIcon,
  FilePlus as FilePlusIcon,
  FileMinus,
  FileSearch,
  FileCode,
  FileText as FileTextIcon,
  FolderIcon,
  FolderOpen as FolderOpenIcon,
  FolderPlus,
  FolderMinus,
  FolderSearch,
  Save as SaveIcon,
  SaveAll,
  Home,
  Building,
  Building2,
  Store,
  Hotel,
  Castle,
  Construction,
  Mountain,
  Trees,
  Palmtree,
  Waves,
  Fish,
  Anchor,
  Ship,
  Sailboat,
  Plane,
  Train,
  Car as CarIcon,
  Truck,
  Bus as BusIcon,
  Bike,
  ParkingCircle,
  Fuel,
  Gauge,
  Wrench,
  Hammer,
  Screwdriver,
  Paintbrush,
  Palette,
  Pipette,
  Layers,
  Layout,
  LayoutDashboard,
  LayoutTemplate,
  Table,
  Table2,
  Filter as FilterIcon,
  Sliders,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Settings as SettingsIcon,
  Settings2,
  Tool,
  Cog,
  UserIcon,
  UserPlus as UserPlusIcon,
  UserMinus,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  Users as UsersIcon,
  UserCircle,
  UserCircle2,
  PersonStanding,
  Contact,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
  Receipt as ReceiptIcon,
  BadgeDollarSign,
  Coins,
  Landmark,
  Briefcase,
  Package as PackageIcon,
  Package2,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  PackageX,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  Tag as TagIcon,
  Tags,
  Ticket,
  Barcode,
  QrCode as QrCodeIcon,
  Cpu as CpuIcon,
  HardDrive as HardDriveIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop,
  Keyboard,
  Mouse,
  MousePointer,
  Printer as PrinterIcon,
  Scanner,
  Camera as CameraIcon,
  Image as ImageIcon,
  Film,
  Radio as RadioIcon,
  Podcast,
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Router,
  Cast as CastIcon,
  Phone as PhoneIcon,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Voicemail,
  Video as VideoIcon,
  VideoOff,
  Webcam,
  Mic as MicIcon,
  MicOff,
  Speaker as SpeakerIcon,
  Headphones as HeadphonesIcon,
  Music,
  Music2,
  Music3,
  Music4,
  Disc,
  Disc2,
  Disc3,
  Album,
  Aperture,
  Camera as CameraIcon2,
  Focus,
  Flashlight,
  FlashlightOff,
  Moon as MoonIcon,
  Sun as SunIcon,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  CloudIcon,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning as CloudLightningIcon,
  CloudMoon,
  CloudOff as CloudOffIcon,
  CloudRain as CloudRainIcon,
  CloudRainWind,
  CloudSnow as CloudSnowIcon,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Droplet,
  Droplets as DropletsIcon,
  Snowflake as SnowflakeIcon,
  Thermometer as ThermometerIcon,
  ThermometerSnowflake,
  ThermometerSun,
  Tornado,
  Wind as WindIcon,
  Haze,
  Umbrella,
  Rainbow,
  Zap as ZapIcon,
  ZapOff,
  Lightbulb,
  LightbulbOff,
  Flashlight as FlashlightIcon,
  FlashlightOff as FlashlightOffIcon,
  Candle,
  Flame as FlameIcon,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Plug,
  Plug2,
  PlugZap,
  PlugZap2
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
  Title,
  Tooltip,
  Legend
);

// Mock data for demonstration
const mockPatients = [
  { id: 'P001', name: 'Ahmed Al-Rashid', age: 45, gender: 'Male', condition: 'Hypertension', room: '204', doctor: 'Dr. Sarah Chen', status: 'stable', lastVisit: '2 hours ago' },
  { id: 'P002', name: 'Fatima Hassan', age: 32, gender: 'Female', condition: 'Diabetes Type 2', room: '108', doctor: 'Dr. Mohammed Ali', status: 'improving', lastVisit: '1 hour ago' },
  { id: 'P003', name: 'Khalid Ibrahim', age: 67, gender: 'Male', condition: 'Post-Surgery', room: '312', doctor: 'Dr. Emily Johnson', status: 'critical', lastVisit: '30 min ago' },
  { id: 'P004', name: 'Noura Al-Zahrani', age: 28, gender: 'Female', condition: 'Pregnancy', room: 'Maternity', doctor: 'Dr. Aisha Patel', status: 'stable', lastVisit: '4 hours ago' },
  { id: 'P005', name: 'Omar Syed', age: 54, gender: 'Male', condition: 'Cardiac Care', room: 'ICU-2', doctor: 'Dr. James Wilson', status: 'monitoring', lastVisit: '15 min ago' }
];

const mockAppointments = [
  { id: 'A001', patient: 'Sara Ahmed', doctor: 'Dr. Chen', time: '09:00 AM', type: 'Consultation', status: 'confirmed', duration: '30 min' },
  { id: 'A002', patient: 'Ali Hassan', doctor: 'Dr. Ali', time: '09:30 AM', type: 'Follow-up', status: 'in-progress', duration: '20 min' },
  { id: 'A003', patient: 'Mona Khalil', doctor: 'Dr. Johnson', time: '10:00 AM', type: 'Emergency', status: 'waiting', duration: '45 min' },
  { id: 'A004', patient: 'Yusuf Omar', doctor: 'Dr. Patel', time: '10:30 AM', type: 'Checkup', status: 'confirmed', duration: '30 min' },
  { id: 'A005', patient: 'Layla Noor', doctor: 'Dr. Wilson', time: '11:00 AM', type: 'Surgery Prep', status: 'scheduled', duration: '60 min' }
];

const departments = [
  { id: 'emergency', name: 'Emergency', icon: Zap, beds: 20, occupied: 18, staff: 45, color: 'text-red-500' },
  { id: 'cardiology', name: 'Cardiology', icon: Heart, beds: 30, occupied: 22, staff: 28, color: 'text-pink-500' },
  { id: 'neurology', name: 'Neurology', icon: Brain, beds: 25, occupied: 19, staff: 24, color: 'text-purple-500' },
  { id: 'pediatrics', name: 'Pediatrics', icon: Baby, beds: 40, occupied: 28, staff: 35, color: 'text-blue-500' },
  { id: 'orthopedics', name: 'Orthopedics', icon: Bone, beds: 35, occupied: 25, staff: 30, color: 'text-orange-500' },
  { id: 'maternity', name: 'Maternity', icon: HeartHandshake, beds: 30, occupied: 24, staff: 32, color: 'text-green-500' }
];

export default function HospitalManagementEnhanced() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Chart data
  const patientFlowData = {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [
      {
        label: 'Admissions',
        data: [12, 28, 45, 38, 25, 15],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Discharges',
        data: [8, 15, 22, 35, 30, 20],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      }
    ]
  };

  const departmentOccupancyData = {
    labels: departments.map(d => d.name),
    datasets: [
      {
        label: 'Bed Occupancy',
        data: departments.map(d => (d.occupied / d.beds) * 100),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ]
      }
    ]
  };

  const waitTimeData = {
    labels: ['Emergency', 'Urgent', 'Standard', 'Scheduled'],
    datasets: [
      {
        data: [15, 35, 45, 120],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
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
            <Heart className="w-8 h-8 text-red-500" />
            Hospital Management System
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive healthcare management with real-time monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            New Patient
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            title: 'Total Patients', 
            value: '1,847', 
            change: '+12%', 
            icon: Users, 
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            trend: 'up'
          },
          { 
            title: 'Available Beds', 
            value: '42/280', 
            change: '85% occupied', 
            icon: BedDouble, 
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            trend: 'stable'
          },
          { 
            title: 'Active Staff', 
            value: '234', 
            change: '96% on duty', 
            icon: Stethoscope, 
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            trend: 'up'
          },
          { 
            title: 'Emergency Cases', 
            value: '18', 
            change: '-5% from avg', 
            icon: AlertCircle, 
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
                  {metric.trend === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
                  {metric.change}
                </div>
                <Progress 
                  value={metric.title === 'Available Beds' ? 85 : 
                         metric.title === 'Active Staff' ? 96 : 
                         65} 
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard View */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Patient Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Patient Flow Today
                </CardTitle>
                <CardDescription>Admissions and discharges over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line 
                    data={patientFlowData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Department Occupancy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Department Occupancy
                </CardTitle>
                <CardDescription>Current bed occupancy by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar 
                    data={departmentOccupancyData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Critical Alerts
              </CardTitle>
              <CardDescription>Requires immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: 'Emergency', message: 'ICU at 95% capacity', time: '5 min ago', severity: 'critical' },
                  { type: 'Equipment', message: 'MRI Scanner #2 maintenance due', time: '1 hour ago', severity: 'warning' },
                  { type: 'Pharmacy', message: 'Low stock: Insulin (20 units remaining)', time: '2 hours ago', severity: 'medium' },
                  { type: 'Staff', message: 'Night shift understaffed in Emergency', time: '3 hours ago', severity: 'high' }
                ].map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      alert.severity === 'critical' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                      alert.severity === 'high' && "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
                      alert.severity === 'warning' && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                      alert.severity === 'medium' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className={cn(
                        "w-5 h-5",
                        alert.severity === 'critical' && "text-red-500",
                        alert.severity === 'high' && "text-orange-500",
                        alert.severity === 'warning' && "text-yellow-500",
                        alert.severity === 'medium' && "text-blue-500"
                      )} />
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                      <Button size="sm" variant="ghost" className="mt-1">
                        Resolve
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: UserPlus, label: 'Register Patient', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
              { icon: Calendar, label: 'Book Appointment', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
              { icon: Pill, label: 'Prescriptions', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
              { icon: FileText, label: 'Lab Results', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
              { icon: BedDouble, label: 'Bed Management', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/20' },
              { icon: DollarSign, label: 'Billing', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
              { icon: Stethoscope, label: 'Staff Schedule', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
              { icon: BarChart3, label: 'Reports', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-950/20' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn("cursor-pointer hover:shadow-lg transition-all", action.bg)}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <action.icon className={cn("w-10 h-10 mb-3", action.color)} />
                    <p className="text-sm font-medium text-center">{action.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Patients View */}
        <TabsContent value="patients" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search patients by name, ID, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="improving">Improving</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>

          {/* Patients List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Patients</CardTitle>
              <CardDescription>Active patients in the hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{patient.name}</p>
                          <Badge variant="outline" className="text-xs">{patient.id}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{patient.age} years • {patient.gender}</span>
                          <span>Room {patient.room}</span>
                          <span>{patient.condition}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{patient.doctor}</p>
                        <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                      </div>
                      <Badge className={cn(
                        "capitalize",
                        patient.status === 'stable' && "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                        patient.status === 'critical' && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                        patient.status === 'improving' && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        patient.status === 'monitoring' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                      )}>
                        {patient.status}
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments View */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Appointments
                  </CardTitle>
                  <CardDescription>Schedule for {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{appointment.time.split(' ')[0].split(':')[0]}</p>
                            <p className="text-xs text-muted-foreground">{appointment.time.split(' ')[1]}</p>
                          </div>
                          <div className="h-12 w-px bg-border" />
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{appointment.doctor}</span>
                              <span>•</span>
                              <span>{appointment.type}</span>
                              <span>•</span>
                              <span>{appointment.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "capitalize",
                            appointment.status === 'confirmed' && "bg-green-100 text-green-700",
                            appointment.status === 'in-progress' && "bg-blue-100 text-blue-700",
                            appointment.status === 'waiting' && "bg-yellow-100 text-yellow-700",
                            appointment.status === 'scheduled' && "bg-gray-100 text-gray-700"
                          )}>
                            {appointment.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wait Time Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Average Wait Times
                </CardTitle>
                <CardDescription>Current waiting periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <Doughnut 
                    data={waitTimeData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.label + ': ' + context.parsed + ' min';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Waiting</span>
                    <span className="font-medium">47 patients</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Wait Time</span>
                    <span className="font-medium">38 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments View */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <dept.icon className={cn("w-5 h-5", dept.color)} />
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bed Occupancy</span>
                        <span className="text-sm font-medium">{dept.occupied}/{dept.beds}</span>
                      </div>
                      <Progress value={(dept.occupied / dept.beds) * 100} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{dept.staff}</p>
                          <p className="text-xs text-muted-foreground">Staff Members</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{Math.round((dept.occupied / dept.beds) * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Utilization</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <dept.icon className={cn("w-8 h-8", dept.color)} />
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-sm text-muted-foreground">{dept.staff} staff members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold">98%</p>
                        <p className="text-xs text-muted-foreground">Satisfaction</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">4.8</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{Math.floor(Math.random() * 50) + 100}</p>
                        <p className="text-xs text-muted-foreground">Daily Patients</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff View */}
        <TabsContent value="staff" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Staff Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Distribution</CardTitle>
                <CardDescription>Active staff by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { role: 'Doctors', count: 45, total: 50, icon: Stethoscope, color: 'text-blue-500' },
                    { role: 'Nurses', count: 120, total: 130, icon: Heart, color: 'text-pink-500' },
                    { role: 'Technicians', count: 28, total: 30, icon: Microscope, color: 'text-purple-500' },
                    { role: 'Support Staff', count: 65, total: 70, icon: Users, color: 'text-green-500' }
                  ].map((staff) => (
                    <div key={staff.role} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <staff.icon className={cn("w-4 h-4", staff.color)} />
                          <span className="font-medium">{staff.role}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{staff.count}/{staff.total}</span>
                      </div>
                      <Progress value={(staff.count / staff.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shift Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Current Shift Status</CardTitle>
                <CardDescription>Staff availability by shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { shift: 'Morning (6 AM - 2 PM)', status: 'active', staff: 85, required: 80 },
                    { shift: 'Evening (2 PM - 10 PM)', status: 'upcoming', staff: 78, required: 80 },
                    { shift: 'Night (10 PM - 6 AM)', status: 'scheduled', staff: 60, required: 65 }
                  ].map((shift) => (
                    <div key={shift.shift} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{shift.shift}</p>
                          <Badge variant={shift.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                            {shift.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{shift.staff}/{shift.required}</p>
                          <p className="text-xs text-muted-foreground">Staff assigned</p>
                        </div>
                      </div>
                      <Progress value={(shift.staff / shift.required) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Patient Satisfaction', value: '94%', change: '+2.3%', color: 'text-green-500' },
              { label: 'Treatment Success Rate', value: '89%', change: '+1.5%', color: 'text-blue-500' },
              { label: 'Average Stay Duration', value: '4.2 days', change: '-0.3', color: 'text-purple-500' },
              { label: 'Cost per Patient', value: '$2,340', change: '-5%', color: 'text-orange-500' }
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <TrendingUp className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Hospital performance metrics over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line 
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [
                      {
                        label: 'Patient Volume',
                        data: [1200, 1350, 1400, 1380, 1450, 1520],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        yAxisID: 'y',
                      },
                      {
                        label: 'Satisfaction Rate (%)',
                        data: [88, 89, 91, 90, 93, 94],
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
                          text: 'Patient Volume'
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
                          text: 'Satisfaction Rate (%)'
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

      {/* Patient Details Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPatient(null)}
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
                  <h2 className="text-2xl font-bold">Patient Details</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPatient(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                      <p className="text-muted-foreground">
                        ID: {selectedPatient.id} • {selectedPatient.age} years • {selectedPatient.gender}
                      </p>
                      <Badge className="mt-2">{selectedPatient.status}</Badge>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Records
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      Prescriptions
                    </Button>
                  </div>

                  {/* Detailed Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Medical Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Condition</span>
                          <span className="text-sm font-medium">{selectedPatient.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Room</span>
                          <span className="text-sm font-medium">{selectedPatient.room}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Doctor</span>
                          <span className="text-sm font-medium">{selectedPatient.doctor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Admitted</span>
                          <span className="text-sm font-medium">3 days ago</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Vitals</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Blood Pressure</span>
                          <span className="text-sm font-medium">120/80 mmHg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Heart Rate</span>
                          <span className="text-sm font-medium">72 bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Temperature</span>
                          <span className="text-sm font-medium">98.6°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">O2 Saturation</span>
                          <span className="text-sm font-medium">98%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { time: '2 hours ago', event: 'Medication administered', icon: Pill },
                          { time: '4 hours ago', event: 'Vitals checked', icon: Activity },
                          { time: '6 hours ago', event: 'Doctor visit', icon: Stethoscope },
                          { time: 'Yesterday', event: 'Lab results received', icon: FileText }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <activity.icon className="w-4 h-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm">{activity.event}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}