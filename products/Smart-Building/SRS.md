# Smart Building Management System - Software Requirements Specification (SRS)

## Document Information
- **Version**: 1.0
- **Date**: January 2025
- **Status**: Final
- **Product**: NCQ Smart Building Management System
- **Document Type**: Software Requirements Specification

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Data Requirements](#6-data-requirements)
7. [External Interfaces](#7-external-interfaces)
8. [IoT Integration Requirements](#8-iot-integration-requirements)
9. [Security Requirements](#9-security-requirements)
10. [Performance Requirements](#10-performance-requirements)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the NCQ Smart Building Management System, an integrated IoT-enabled platform that transforms traditional buildings into intelligent, efficient, and user-centric environments.

### 1.2 Scope
The Smart Building Management System encompasses:
- Real-time space management and booking
- IoT sensor integration and monitoring
- Energy management and optimization
- Tenant services and mobile access
- Predictive maintenance
- Security and access control
- Environmental monitoring and control
- Analytics and reporting

### 1.3 Definitions and Acronyms
- **BMS**: Building Management System
- **IoT**: Internet of Things
- **HVAC**: Heating, Ventilation, and Air Conditioning
- **API**: Application Programming Interface
- **MQTT**: Message Queuing Telemetry Transport
- **BLE**: Bluetooth Low Energy
- **RTLS**: Real-Time Location System
- **KPI**: Key Performance Indicator

## 2. System Overview

### 2.1 System Context
The Smart Building Management System operates as a comprehensive platform that:
- Integrates with various IoT devices and sensors
- Provides real-time monitoring and control
- Optimizes resource utilization
- Enhances tenant experience
- Reduces operational costs by 30-40%

### 2.2 Major Features
1. **Space Management**: Dynamic space allocation and booking
2. **IoT Integration**: Comprehensive sensor network management
3. **Energy Optimization**: AI-driven energy management
4. **Tenant Portal**: Mobile-first tenant services
5. **Predictive Maintenance**: ML-based maintenance predictions
6. **Security Management**: Integrated access control
7. **Environmental Control**: Automated HVAC and lighting
8. **Analytics Dashboard**: Real-time insights and reporting

## 3. Functional Requirements

### 3.1 Space Management (FR-SM)

#### FR-SM-001: Space Booking System
- Real-time availability display
- Multi-type space booking (meeting rooms, desks, parking)
- Recurring booking support
- Capacity management
- Equipment and amenity filtering

#### FR-SM-002: Occupancy Tracking
- Real-time occupancy monitoring
- Historical occupancy analytics
- Heat map visualization
- Predictive occupancy modeling
- Space utilization reports

#### FR-SM-003: Wayfinding and Navigation
- Indoor navigation system
- Interactive floor maps
- Turn-by-turn directions
- Accessibility routing
- Emergency evacuation routes

### 3.2 IoT Device Management (FR-IoT)

#### FR-IoT-001: Device Registration
- Automatic device discovery
- QR code-based registration
- Bulk device import
- Device grouping and tagging
- Firmware management

#### FR-IoT-002: Sensor Monitoring
- Real-time data collection
- Multi-protocol support (MQTT, CoAP, HTTP)
- Data validation and filtering
- Alert threshold configuration
- Historical data storage

#### FR-IoT-003: Device Control
- Remote device control
- Automated rule-based actions
- Scene management
- Schedule-based automation
- Manual override capabilities

### 3.3 Energy Management (FR-EM)

#### FR-EM-001: Energy Monitoring
- Real-time consumption tracking
- Multi-source energy monitoring
- Cost calculation and projection
- Carbon footprint tracking
- Benchmarking against targets

#### FR-EM-002: Optimization Algorithms
- AI-based consumption prediction
- Demand response management
- Peak shaving strategies
- Load balancing
- Renewable energy integration

#### FR-EM-003: HVAC Control
- Zone-based temperature control
- Occupancy-based adjustments
- Weather-based optimization
- Schedule management
- Energy-saving modes

### 3.4 Tenant Services (FR-TS)

#### FR-TS-001: Mobile Application
- iOS and Android native apps
- Biometric authentication
- Push notifications
- Offline functionality
- Multi-language support

#### FR-TS-002: Service Requests
- Maintenance request submission
- Request tracking
- Photo/video attachments
- Priority classification
- Feedback collection

#### FR-TS-003: Visitor Management
- Pre-registration system
- QR code generation
- Temporary access credentials
- Host notifications
- Visitor tracking

### 3.5 Maintenance Management (FR-MM)

#### FR-MM-001: Predictive Maintenance
- Equipment health monitoring
- Failure prediction algorithms
- Maintenance scheduling
- Parts inventory management
- Vendor management

#### FR-MM-002: Work Order System
- Automated work order generation
- Task assignment and routing
- Mobile technician app
- Progress tracking
- Completion verification

#### FR-MM-003: Asset Management
- Asset registry
- Lifecycle tracking
- Warranty management
- Documentation storage
- Cost tracking

### 3.6 Security and Access Control (FR-SC)

#### FR-SC-001: Access Management
- Multi-factor authentication
- Role-based access control
- Temporary access provision
- Access audit trails
- Integration with existing systems

#### FR-SC-002: Surveillance Integration
- CCTV integration
- AI-powered threat detection
- Incident recording
- Real-time alerts
- Privacy compliance

#### FR-SC-003: Emergency Management
- Emergency alert system
- Evacuation coordination
- First responder integration
- Incident reporting
- Post-incident analysis

### 3.7 Analytics and Reporting (FR-AR)

#### FR-AR-001: Real-time Dashboards
- Customizable widgets
- Role-based views
- Mobile-responsive design
- Data refresh rates
- Alert integration

#### FR-AR-002: Report Generation
- Scheduled reports
- Custom report builder
- Multiple export formats
- Automated distribution
- Historical comparisons

#### FR-AR-003: Predictive Analytics
- Trend analysis
- Anomaly detection
- Forecasting models
- What-if scenarios
- ROI calculations

## 4. Non-Functional Requirements

### 4.1 Performance Requirements (NFR-PR)

#### NFR-PR-001: Response Time
- Web dashboard: <2 seconds page load
- Mobile app: <1 second response
- IoT command execution: <500ms
- Real-time updates: <100ms latency

#### NFR-PR-002: Throughput
- Support 100,000+ IoT devices
- Handle 1M+ sensor readings/minute
- 10,000+ concurrent users
- 50,000+ bookings/day

#### NFR-PR-003: Scalability
- Horizontal scaling for all services
- Auto-scaling based on load
- Multi-building support
- Geographic distribution

### 4.2 Reliability Requirements (NFR-RR)

#### NFR-RR-001: Availability
- 99.9% uptime for core services
- 99.99% for critical safety systems
- Redundant infrastructure
- Automatic failover

#### NFR-RR-002: Fault Tolerance
- Graceful degradation
- Offline mode for mobile apps
- Local edge computing backup
- Data replication

### 4.3 Security Requirements (NFR-SR)

#### NFR-SR-001: Data Security
- End-to-end encryption
- At-rest encryption (AES-256)
- Secure key management
- Regular security audits

#### NFR-SR-002: Privacy
- GDPR compliance
- Data anonymization
- Consent management
- Right to deletion

### 4.4 Usability Requirements (NFR-UR)

#### NFR-UR-001: User Interface
- Intuitive design
- Accessibility compliance (WCAG 2.1)
- Multi-language support
- Responsive design

#### NFR-UR-002: User Experience
- Single sign-on
- Personalization options
- Context-aware features
- Minimal training required

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interfaces                          │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ Web Portal  │ │ Mobile Apps  │ │ Building Displays  │  │
│  └─────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                      API Gateway                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    Core Services Layer                       │
├──────────────┬──────────────┬──────────────┬───────────────┤
│Space Manager │Energy Manager│Maintenance   │Security       │
│              │              │Manager       │Manager        │
├──────────────┼──────────────┼──────────────┼───────────────┤
│Analytics     │Notification  │Integration   │Configuration  │
│Engine        │Service       │Service       │Service        │
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                     Data Layer                               │
├──────────────┬──────────────┬──────────────┬───────────────┤
│PostgreSQL    │TimescaleDB   │Redis Cache   │Object Storage │
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                   IoT Integration Layer                      │
├──────────────┬──────────────┬──────────────┬───────────────┤
│MQTT Broker   │CoAP Server   │Edge Gateways │Device Registry│
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    Physical Layer                            │
├──────────────┬──────────────┬──────────────┬───────────────┤
│Sensors       │Actuators     │Controllers   │Gateways       │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

### 5.2 Component Details

#### 5.2.1 Frontend Components
- **Web Portal**: React/Next.js 14 with TypeScript
- **Mobile Apps**: React Native with Expo
- **Building Displays**: Progressive Web Apps
- **Admin Dashboard**: React with Material-UI

#### 5.2.2 Backend Services
- **API Gateway**: Kong with custom plugins
- **Core Services**: Node.js microservices
- **Message Queue**: Apache Kafka
- **Caching**: Redis with Sentinel

#### 5.2.3 IoT Platform
- **MQTT Broker**: Mosquitto clustered
- **Edge Computing**: Node-RED
- **Device Management**: ThingsBoard
- **Time-series Data**: TimescaleDB

## 6. Data Requirements

### 6.1 Data Models

#### 6.1.1 Building Schema
```typescript
interface Building {
  id: string;
  name: string;
  address: Address;
  floors: Floor[];
  zones: Zone[];
  metadata: {
    totalArea: number;
    capacity: number;
    yearBuilt: number;
    certifications: string[];
  };
  settings: {
    timezone: string;
    workingHours: Schedule;
    holidays: Date[];
  };
}

interface Floor {
  id: string;
  number: number;
  name: string;
  layout: FloorPlan;
  spaces: Space[];
  devices: IoTDevice[];
}

interface Space {
  id: string;
  type: 'meeting_room' | 'desk' | 'common_area' | 'parking';
  capacity: number;
  amenities: string[];
  bookable: boolean;
  location: Coordinates;
}
```

#### 6.1.2 IoT Device Schema
```typescript
interface IoTDevice {
  id: string;
  type: DeviceType;
  manufacturer: string;
  model: string;
  location: {
    buildingId: string;
    floorId: string;
    coordinates: Coordinates;
  };
  status: 'active' | 'inactive' | 'maintenance';
  lastSeen: Date;
  configuration: DeviceConfig;
  telemetry: TelemetryData[];
}

interface TelemetryData {
  timestamp: Date;
  metrics: {
    [key: string]: number | string | boolean;
  };
  quality: number;
}
```

### 6.2 Data Storage Requirements
- **Transactional Data**: PostgreSQL for bookings, users, configurations
- **Time-series Data**: TimescaleDB for sensor readings
- **Real-time Data**: Redis for current states
- **Documents/Media**: S3-compatible object storage
- **Analytics Data**: ClickHouse for large-scale analytics

## 7. External Interfaces

### 7.1 Hardware Interfaces
- **Sensors**: Temperature, humidity, motion, light, CO2
- **Actuators**: HVAC controls, lighting, door locks
- **Gateways**: LoRaWAN, Zigbee, BLE gateways
- **Controllers**: BACnet, Modbus controllers

### 7.2 Software Interfaces
- **Building Systems**: BMS, HVAC, lighting control
- **Enterprise Systems**: ERP, HR systems, calendaring
- **Cloud Services**: Weather API, energy pricing
- **Payment Systems**: NCQ Payment Gateway

### 7.3 Communication Interfaces
- **REST API**: Primary API interface
- **WebSocket**: Real-time updates
- **MQTT**: IoT communication
- **GraphQL**: Complex queries

## 8. IoT Integration Requirements

### 8.1 Supported Protocols
- **MQTT**: Primary IoT protocol
- **CoAP**: Constrained devices
- **HTTP/HTTPS**: Web-based devices
- **WebSocket**: Real-time streaming
- **LoRaWAN**: Long-range sensors
- **BLE**: Proximity detection

### 8.2 Device Types

#### 8.2.1 Environmental Sensors
- Temperature and humidity
- Air quality (CO2, VOC, PM2.5)
- Light levels
- Noise levels
- Water leak detection

#### 8.2.2 Occupancy Sensors
- PIR motion sensors
- Camera-based counting
- BLE beacon tracking
- WiFi presence detection
- Desk occupancy sensors

#### 8.2.3 Energy Meters
- Electricity meters
- Water flow meters
- Gas meters
- Solar panel monitors
- Battery status monitors

#### 8.2.4 Control Devices
- Smart thermostats
- Lighting controllers
- Motorized blinds
- Door locks
- Elevator controls

### 8.3 Edge Computing Requirements
- Local data processing
- Offline operation capability
- Rule engine execution
- Data aggregation
- Security enforcement

## 9. Security Requirements

### 9.1 Authentication & Authorization
- Multi-factor authentication
- Single sign-on (SSO)
- Role-based access control
- API key management
- Session management

### 9.2 Data Protection
- TLS 1.3 for all communications
- End-to-end encryption for sensitive data
- Secure credential storage
- Regular security audits
- Penetration testing

### 9.3 IoT Security
- Device authentication
- Secure provisioning
- Firmware signing
- Secure boot
- Network isolation

### 9.4 Compliance
- GDPR compliance
- ISO 27001 alignment
- Industry-specific regulations
- Data residency requirements
- Privacy by design

## 10. Performance Requirements

### 10.1 System Performance
- **API Response Time**: < 200ms (95th percentile)
- **Dashboard Load Time**: < 3 seconds
- **IoT Command Latency**: < 1 second
- **Data Processing**: < 5 seconds for analytics

### 10.2 Capacity Requirements
- **Buildings**: Support 1000+ buildings
- **Users**: 1M+ total users
- **Devices**: 10M+ IoT devices
- **Data Points**: 1B+ daily readings

### 10.3 Resource Utilization
- **CPU Usage**: < 70% average
- **Memory Usage**: < 80% peak
- **Storage Growth**: < 1TB/month
- **Network Bandwidth**: < 100Mbps average

## Appendices

### Appendix A: API Endpoints
```
# Space Management
GET    /api/v1/spaces
POST   /api/v1/bookings
PUT    /api/v1/bookings/{id}
DELETE /api/v1/bookings/{id}

# IoT Management  
GET    /api/v1/devices
POST   /api/v1/devices/{id}/command
GET    /api/v1/devices/{id}/telemetry
PUT    /api/v1/devices/{id}/config

# Analytics
GET    /api/v1/analytics/occupancy
GET    /api/v1/analytics/energy
GET    /api/v1/analytics/comfort
POST   /api/v1/reports/generate
```

### Appendix B: Integration Protocols
- BACnet/IP for HVAC systems
- Modbus TCP for power meters
- KNX for lighting control
- ONVIF for IP cameras
- MQTT for IoT sensors

### Appendix C: Compliance Standards
- ASHRAE 90.1 for energy efficiency
- WELL Building Standard
- LEED certification support
- ISO 50001 for energy management
- IEC 62443 for industrial security