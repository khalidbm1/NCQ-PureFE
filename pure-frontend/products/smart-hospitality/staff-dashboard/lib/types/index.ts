// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: Department
  avatar?: string
  permissions: Permission[]
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  FRONT_DESK = 'FRONT_DESK',
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  SUPERVISOR = 'SUPERVISOR',
}

export enum Department {
  MANAGEMENT = 'MANAGEMENT',
  FRONT_OFFICE = 'FRONT_OFFICE',
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  SECURITY = 'SECURITY',
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

// Room Types
export interface Room {
  id: string
  number: string
  floor: number
  type: RoomType
  status: RoomStatus
  cleaningStatus: CleaningStatus
  features: string[]
  maxOccupancy: number
  currentOccupancy: number
  rate: number
  lastCleaned?: Date
  lastMaintenance?: Date
  notes?: string
  iotDevices?: IoTDevice[]
}

export enum RoomType {
  STANDARD = 'STANDARD',
  DELUXE = 'DELUXE',
  SUITE = 'SUITE',
  EXECUTIVE = 'EXECUTIVE',
  PRESIDENTIAL = 'PRESIDENTIAL',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum CleaningStatus {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  CLEANING = 'CLEANING',
  INSPECTED = 'INSPECTED',
  DEEP_CLEANING = 'DEEP_CLEANING',
}

// Guest Types
export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  idType: string
  idNumber: string
  nationality: string
  dateOfBirth?: Date
  address?: Address
  preferences?: GuestPreferences
  loyaltyPoints?: number
  vipStatus?: boolean
  blacklisted?: boolean
  notes?: string
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface GuestPreferences {
  roomType?: RoomType
  floor?: string
  bedType?: string
  smokingRoom?: boolean
  dietaryRestrictions?: string[]
  specialRequests?: string[]
}

// Reservation Types
export interface Reservation {
  id: string
  guestId: string
  guest?: Guest
  roomId: string
  room?: Room
  checkIn: Date
  checkOut: Date
  status: ReservationStatus
  adults: number
  children: number
  totalAmount: number
  paidAmount: number
  paymentMethod?: string
  specialRequests?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Housekeeping Types
export interface HousekeepingTask {
  id: string
  roomId: string
  room?: Room
  assignedTo?: string
  assignee?: User
  type: TaskType
  priority: Priority
  status: TaskStatus
  scheduledTime?: Date
  startedAt?: Date
  completedAt?: Date
  inspectedBy?: string
  inspectionNotes?: string
  supplies?: SupplyItem[]
  notes?: string
  estimatedDuration: number
}

export enum TaskType {
  DAILY_CLEANING = 'DAILY_CLEANING',
  DEEP_CLEANING = 'DEEP_CLEANING',
  TURN_DOWN = 'TURN_DOWN',
  LAUNDRY = 'LAUNDRY',
  AMENITY_RESTOCK = 'AMENITY_RESTOCK',
  INSPECTION = 'INSPECTION',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CANCELLED = 'CANCELLED',
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string
  roomId?: string
  location: string
  category: MaintenanceCategory
  issue: string
  description: string
  reportedBy: string
  reporter?: User
  assignedTo?: string
  technician?: User
  priority: Priority
  status: MaintenanceStatus
  estimatedCost?: number
  actualCost?: number
  partsRequired?: string[]
  createdAt: Date
  scheduledDate?: Date
  completedAt?: Date
  images?: string[]
  notes?: string
}

export enum MaintenanceCategory {
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  HVAC = 'HVAC',
  FURNITURE = 'FURNITURE',
  APPLIANCE = 'APPLIANCE',
  STRUCTURAL = 'STRUCTURAL',
  OTHER = 'OTHER',
}

export enum MaintenanceStatus {
  REPORTED = 'REPORTED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  PARTS_ORDERED = 'PARTS_ORDERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Inventory Types
export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  sku: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  unit: string
  supplier?: string
  cost: number
  location: string
  lastRestocked?: Date
  expiryDate?: Date
  notes?: string
}

export enum InventoryCategory {
  CLEANING_SUPPLIES = 'CLEANING_SUPPLIES',
  TOILETRIES = 'TOILETRIES',
  LINENS = 'LINENS',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  MAINTENANCE = 'MAINTENANCE',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  OTHER = 'OTHER',
}

export interface SupplyItem {
  inventoryId: string
  inventory?: InventoryItem
  quantity: number
}

// IoT Device Types
export interface IoTDevice {
  id: string
  roomId: string
  name: string
  type: DeviceType
  status: DeviceStatus
  manufacturer: string
  model: string
  serialNumber: string
  lastSeen: Date
  battery?: number
  firmware?: string
  data?: Record<string, any>
  alerts?: DeviceAlert[]
}

export enum DeviceType {
  THERMOSTAT = 'THERMOSTAT',
  SMART_LOCK = 'SMART_LOCK',
  MOTION_SENSOR = 'MOTION_SENSOR',
  LIGHT_CONTROL = 'LIGHT_CONTROL',
  SMOKE_DETECTOR = 'SMOKE_DETECTOR',
  ENERGY_METER = 'ENERGY_METER',
  WATER_SENSOR = 'WATER_SENSOR',
  TV = 'TV',
  MINIBAR = 'MINIBAR',
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE',
}

export interface DeviceAlert {
  id: string
  deviceId: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  timestamp: Date
  acknowledged: boolean
  acknowledgedBy?: string
}

// Analytics Types
export interface DashboardMetrics {
  occupancyRate: number
  averageDailyRate: number
  revPAR: number
  totalRevenue: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  checkInsToday: number
  checkOutsToday: number
  pendingTasks: number
  maintenanceRequests: number
  guestSatisfaction: number
}

export interface RevenueData {
  date: Date
  roomRevenue: number
  foodBeverageRevenue: number
  otherRevenue: number
  totalRevenue: number
}

export interface OccupancyData {
  date: Date
  occupiedRooms: number
  totalRooms: number
  occupancyRate: number
}

// Communication Types
export interface Message {
  id: string
  from: string
  to: string | string[]
  subject?: string
  content: string
  type: MessageType
  priority: Priority
  read: boolean
  createdAt: Date
  attachments?: string[]
}

export enum MessageType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  TASK = 'TASK',
  ALERT = 'ALERT',
  REMINDER = 'REMINDER',
  UPDATE = 'UPDATE',
}

// Report Types
export interface Report {
  id: string
  name: string
  type: ReportType
  generatedBy: string
  generatedAt: Date
  period: {
    start: Date
    end: Date
  }
  data: any
  format: 'PDF' | 'EXCEL' | 'CSV'
  url?: string
}

export enum ReportType {
  OCCUPANCY = 'OCCUPANCY',
  REVENUE = 'REVENUE',
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  GUEST_SATISFACTION = 'GUEST_SATISFACTION',
  INVENTORY = 'INVENTORY',
  STAFF_PERFORMANCE = 'STAFF_PERFORMANCE',
}