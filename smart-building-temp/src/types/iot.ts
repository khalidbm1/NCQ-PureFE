/**
 * Smart Building IoT Types
 * Comprehensive types for all building IoT devices and systems
 */

// Base IoT Device
export interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  location: Location;
  status: DeviceStatus;
  batteryLevel?: number;
  lastSeen: Date;
  firmware: string;
  metadata: Record<string, any>;
}

// Device Types
export enum DeviceType {
  // Access Control
  DOOR_SENSOR = 'door_sensor',
  DOOR_LOCK = 'door_lock',
  CARD_READER = 'card_reader',
  BIOMETRIC_SCANNER = 'biometric_scanner',
  GATE_CONTROLLER = 'gate_controller',
  
  // Environmental
  TEMPERATURE_SENSOR = 'temperature_sensor',
  HUMIDITY_SENSOR = 'humidity_sensor',
  AIR_QUALITY_SENSOR = 'air_quality_sensor',
  LIGHT_SENSOR = 'light_sensor',
  MOTION_SENSOR = 'motion_sensor',
  OCCUPANCY_SENSOR = 'occupancy_sensor',
  
  // Control Systems
  HVAC_CONTROLLER = 'hvac_controller',
  LIGHT_CONTROLLER = 'light_controller',
  BLIND_CONTROLLER = 'blind_controller',
  
  // Parking
  PARKING_SENSOR = 'parking_sensor',
  LICENSE_PLATE_READER = 'license_plate_reader',
  BARRIER_GATE = 'barrier_gate',
  
  // Safety & Security
  SMOKE_DETECTOR = 'smoke_detector',
  CAMERA = 'camera',
  EMERGENCY_BUTTON = 'emergency_button',
  WATER_LEAK_SENSOR = 'water_leak_sensor',
  
  // Utilities
  ENERGY_METER = 'energy_meter',
  WATER_METER = 'water_meter',
  WASTE_SENSOR = 'waste_sensor',
  
  // Interactive
  KIOSK = 'kiosk',
  DISPLAY_PANEL = 'display_panel',
  SPEAKER = 'speaker'
}

// Device Status
export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  UPDATING = 'updating'
}

// Location Types
export interface Location {
  building: string;
  floor: number;
  area: AreaType;
  zone: string;
  coordinates?: {
    x: number;
    y: number;
    z?: number;
  };
}

export enum AreaType {
  LOBBY = 'lobby',
  ROOM = 'room',
  BATHROOM = 'bathroom',
  PARKING = 'parking',
  GATE = 'gate',
  AISLE = 'aisle',
  CORRIDOR = 'corridor',
  ELEVATOR = 'elevator',
  STAIRWELL = 'stairwell',
  OFFICE = 'office',
  MEETING_ROOM = 'meeting_room',
  CAFETERIA = 'cafeteria',
  STORAGE = 'storage',
  UTILITY = 'utility',
  OUTDOOR = 'outdoor'
}

// Space Management
export interface SmartSpace {
  id: string;
  spaceNumber: string;
  type: SpaceType;
  floor: number;
  capacity: number;
  status: SpaceStatus;
  occupancy: OccupancyData;
  environment: EnvironmentData;
  devices: IoTDevice[];
  amenities: string[];
  bookings?: Booking[];
}

export enum SpaceType {
  // Office Spaces
  OFFICE = 'office',
  MEETING_ROOM = 'meeting_room',
  CONFERENCE_ROOM = 'conference_room',
  BREAK_ROOM = 'break_room',
  RECEPTION = 'reception',
  
  // Retail Spaces
  RETAIL_STORE = 'retail_store',
  RESTAURANT = 'restaurant',
  KIOSK = 'kiosk',
  FOOD_COURT = 'food_court',
  
  // Healthcare Spaces
  PATIENT_ROOM = 'patient_room',
  EXAMINATION_ROOM = 'examination_room',
  OPERATING_ROOM = 'operating_room',
  WAITING_AREA = 'waiting_area',
  
  // Hospitality Spaces
  GUEST_ROOM = 'guest_room',
  SUITE = 'suite',
  LOBBY = 'lobby',
  
  // Common Areas
  CORRIDOR = 'corridor',
  ATRIUM = 'atrium',
  COMMON_AREA = 'common_area',
  
  // Technical Spaces
  SERVER_ROOM = 'server_room',
  STORAGE = 'storage',
  UTILITY_ROOM = 'utility_room',
  MECHANICAL_ROOM = 'mechanical_room'
}

export enum SpaceStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning'
}

export interface OccupancyData {
  current: number;
  maximum: number;
  lastUpdated: Date;
  history: OccupancyRecord[];
}

export interface OccupancyRecord {
  timestamp: Date;
  count: number;
  duration: number;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  airQuality: AirQualityLevel;
  lightLevel: number;
  noiseLevel: number;
  co2Level: number;
}

export enum AirQualityLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  MODERATE = 'moderate',
  POOR = 'poor',
  HAZARDOUS = 'hazardous'
}

// Access Control
export interface AccessControl {
  id: string;
  type: AccessType;
  location: Location;
  permissions: AccessPermission[];
  logs: AccessLog[];
}

export enum AccessType {
  DOOR = 'door',
  GATE = 'gate',
  ELEVATOR = 'elevator',
  PARKING = 'parking',
  RESTRICTED_AREA = 'restricted_area'
}

export interface AccessPermission {
  userId: string;
  accessLevel: AccessLevel;
  validFrom: Date;
  validUntil: Date;
  zones: string[];
  schedule?: AccessSchedule;
}

export enum AccessLevel {
  GUEST = 'guest',
  RESIDENT = 'resident',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  SECURITY = 'security',
  ADMIN = 'admin'
}

export interface AccessSchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface AccessLog {
  timestamp: Date;
  userId: string;
  action: AccessAction;
  location: Location;
  device: string;
  result: AccessResult;
}

export enum AccessAction {
  ENTRY = 'entry',
  EXIT = 'exit',
  ATTEMPT = 'attempt',
  OVERRIDE = 'override'
}

export enum AccessResult {
  GRANTED = 'granted',
  DENIED = 'denied',
  TIMEOUT = 'timeout',
  ERROR = 'error'
}

// Parking Management
export interface ParkingSpace {
  id: string;
  number: string;
  level: string;
  type: ParkingType;
  status: ParkingStatus;
  dimensions: {
    width: number;
    length: number;
  };
  sensor?: IoTDevice;
  reservations?: ParkingReservation[];
}

export enum ParkingType {
  STANDARD = 'standard',
  COMPACT = 'compact',
  HANDICAP = 'handicap',
  EV_CHARGING = 'ev_charging',
  MOTORCYCLE = 'motorcycle',
  LOADING = 'loading'
}

export enum ParkingStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance'
}

export interface ParkingReservation {
  id: string;
  userId: string;
  spaceId: string;
  vehicleInfo: VehicleInfo;
  startTime: Date;
  endTime: Date;
  cost: number;
  status: ReservationStatus;
}

export interface VehicleInfo {
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  type: string;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Check-in/Check-out
export interface CheckInOut {
  id: string;
  type: CheckType;
  userId: string;
  timestamp: Date;
  location: Location;
  method: CheckMethod;
  details: CheckDetails;
}

export enum CheckType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out'
}

export enum CheckMethod {
  KIOSK = 'kiosk',
  MOBILE = 'mobile',
  RECEPTION = 'reception',
  BIOMETRIC = 'biometric',
  CARD = 'card'
}

export interface CheckDetails {
  spaceNumber?: string;
  duration?: number;
  occupantCount?: number;
  purpose?: string;
  specialRequests?: string[];
  documents?: Document[];
}

// Bathroom Management
export interface SmartBathroom {
  id: string;
  location: Location;
  type: BathroomType;
  status: BathroomStatus;
  occupancy: OccupancyData;
  cleanliness: CleanlinessData;
  supplies: SupplyLevel[];
  maintenance: MaintenanceRecord[];
}

export enum BathroomType {
  MENS = 'mens',
  WOMENS = 'womens',
  UNISEX = 'unisex',
  FAMILY = 'family',
  ACCESSIBLE = 'accessible'
}

export enum BathroomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order'
}

export interface CleanlinessData {
  level: CleanlinessLevel;
  lastCleaned: Date;
  nextScheduled: Date;
  issues: string[];
}

export enum CleanlinessLevel {
  CLEAN = 'clean',
  ACCEPTABLE = 'acceptable',
  NEEDS_ATTENTION = 'needs_attention',
  DIRTY = 'dirty'
}

export interface SupplyLevel {
  item: SupplyItem;
  level: number; // 0-100%
  lastRefilled: Date;
  estimatedEmpty: Date;
}

export enum SupplyItem {
  SOAP = 'soap',
  PAPER_TOWELS = 'paper_towels',
  TOILET_PAPER = 'toilet_paper',
  SANITIZER = 'sanitizer',
  AIR_FRESHENER = 'air_freshener'
}

// Automation Rules
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: Trigger[];
  conditions: Condition[];
  actions: Action[];
  schedule?: Schedule;
}

export interface Trigger {
  type: TriggerType;
  device?: string;
  value?: any;
  threshold?: number;
}

export enum TriggerType {
  TIME = 'time',
  DEVICE_STATE = 'device_state',
  SENSOR_VALUE = 'sensor_value',
  OCCUPANCY = 'occupancy',
  MANUAL = 'manual'
}

export interface Condition {
  type: ConditionType;
  operator: Operator;
  value: any;
}

export enum ConditionType {
  TIME_RANGE = 'time_range',
  DAY_OF_WEEK = 'day_of_week',
  DEVICE_STATE = 'device_state',
  SENSOR_VALUE = 'sensor_value',
  OCCUPANCY_COUNT = 'occupancy_count'
}

export enum Operator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  IN_RANGE = 'in_range'
}

export interface Action {
  type: ActionType;
  device?: string;
  value?: any;
  duration?: number;
}

export enum ActionType {
  SET_DEVICE_STATE = 'set_device_state',
  SEND_NOTIFICATION = 'send_notification',
  TRIGGER_ALARM = 'trigger_alarm',
  LOG_EVENT = 'log_event',
  CALL_API = 'call_api'
}

export interface Schedule {
  start: Date;
  end?: Date;
  recurrence?: Recurrence;
}

export interface Recurrence {
  pattern: RecurrencePattern;
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export enum RecurrencePattern {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// Booking System
export interface Booking {
  id: string;
  userId: string;
  resourceType: ResourceType;
  resourceId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  attendees?: string[];
  services?: string[];
  notes?: string;
}

export enum ResourceType {
  ROOM = 'room',
  PARKING_SPACE = 'parking_space',
  MEETING_ROOM = 'meeting_room',
  EQUIPMENT = 'equipment'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

// Maintenance
export interface MaintenanceRecord {
  id: string;
  type: MaintenanceType;
  priority: Priority;
  status: MaintenanceStatus;
  location: Location;
  device?: string;
  description: string;
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
  completedAt?: Date;
  notes?: string;
}

export enum MaintenanceType {
  REPAIR = 'repair',
  ROUTINE = 'routine',
  EMERGENCY = 'emergency',
  INSPECTION = 'inspection',
  UPGRADE = 'upgrade'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum MaintenanceStatus {
  REPORTED = 'reported',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Analytics
export interface BuildingAnalytics {
  occupancy: OccupancyAnalytics;
  energy: EnergyAnalytics;
  space: SpaceAnalytics;
  maintenance: MaintenanceAnalytics;
  security: SecurityAnalytics;
}

export interface OccupancyAnalytics {
  current: number;
  peak: number;
  average: number;
  trends: TrendData[];
  heatmap: HeatmapData[];
}

export interface EnergyAnalytics {
  consumption: ConsumptionData;
  cost: CostData;
  efficiency: EfficiencyData;
  savings: SavingsData;
}

export interface SpaceAnalytics {
  utilization: number;
  popular: string[];
  underutilized: string[];
  recommendations: string[];
}

export interface MaintenanceAnalytics {
  totalIssues: number;
  resolved: number;
  pending: number;
  averageResolutionTime: number;
  costByType: Record<string, number>;
}

export interface SecurityAnalytics {
  incidents: number;
  accessAttempts: number;
  unauthorizedAccess: number;
  alerts: Alert[];
}

// Helper Types
export interface TrendData {
  timestamp: Date;
  value: number;
}

export interface HeatmapData {
  location: Location;
  intensity: number;
}

export interface ConsumptionData {
  total: number;
  byType: Record<string, number>;
  comparison: number; // % change
}

export interface CostData {
  total: number;
  breakdown: Record<string, number>;
  forecast: number;
}

export interface EfficiencyData {
  score: number; // 0-100
  improvements: string[];
}

export interface SavingsData {
  amount: number;
  percentage: number;
  initiatives: string[];
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Document {
  id: string;
  type: string;
  url: string;
  uploadedAt: Date;
}