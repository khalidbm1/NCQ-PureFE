# Software Requirements Specification
# Smart Hospitality Platform

**Document Version:** 1.0  
**Date:** December 2024  
**Product Team:** Hospitality Team  
**Status:** Draft

## Table of Contents
1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [System Features](#5-system-features)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Security Requirements](#7-security-requirements)
8. [Compliance Requirements](#8-compliance-requirements)

## 1. Introduction

### 1.1 Purpose
This SRS document defines the requirements for the NCQ Smart Hospitality Platform, an integrated hotel management and guest experience system designed for the Saudi Arabian hospitality market.

### 1.2 Scope
The Smart Hospitality Platform encompasses:
- Property Management System (PMS)
- Guest experience mobile applications
- IoT-enabled room automation
- Booking and reservation management
- Revenue management and dynamic pricing
- Housekeeping and maintenance coordination
- Food & beverage management
- Guest services and concierge
- Loyalty program management
- Multi-property chain management

### 1.3 Definitions, Acronyms, and Abbreviations
- **PMS**: Property Management System
- **CRS**: Central Reservation System
- **OTA**: Online Travel Agency
- **ADR**: Average Daily Rate
- **RevPAR**: Revenue Per Available Room
- **IoT**: Internet of Things
- **POS**: Point of Sale
- **F&B**: Food and Beverage
- **CRM**: Customer Relationship Management
- **RFID**: Radio Frequency Identification

### 1.4 Technology Stack
- **Backend**: Node.js with TypeScript
- **Database**: MongoDB (primary), Redis (cache)
- **Message Queue**: MQTT for IoT, Kafka for events
- **API**: RESTful, GraphQL, WebSocket
- **Frontend**: Angular for web, React Native for mobile
- **IoT Protocol**: MQTT, CoAP
- **Infrastructure**: Kubernetes, Docker

## 2. Overall Description

### 2.1 Product Perspective
The Smart Hospitality Platform operates as:
- Comprehensive hotel operations management system
- Guest-centric mobile experience platform
- IoT integration hub for smart room features
- Multi-channel distribution system
- Analytics and revenue optimization engine

### 2.2 Product Functions
- Online and walk-in reservations
- Guest check-in/check-out (including mobile)
- Room management and housekeeping
- IoT device control and automation
- Restaurant and spa bookings
- Billing and payment processing
- Guest preferences and loyalty
- Staff task management
- Revenue optimization
- Multi-property operations

### 2.3 User Classes
1. **Guests**
   - Hotel guests
   - Corporate clients
   - Group bookings
   - Loyalty members

2. **Front Desk Staff**
   - Receptionists
   - Concierge
   - Guest relations

3. **Housekeeping**
   - Room attendants
   - Supervisors
   - Laundry staff

4. **Management**
   - Hotel managers
   - Revenue managers
   - Operations directors

5. **Maintenance**
   - Engineering staff
   - IoT technicians

6. **F&B Staff**
   - Restaurant staff
   - Room service
   - Banquet teams

### 2.4 Operating Environment
- 24/7 operation for global guests
- Multi-language support (Arabic, English, others)
- Integration with global distribution systems
- Compliance with Saudi tourism regulations
- Support for Islamic hospitality requirements

### 2.5 Constraints
- Must comply with Saudi tourism authority regulations
- Support for gender-specific requirements
- Prayer time notifications and Qibla direction
- Halal certification tracking
- Special requirements during Hajj/Umrah seasons

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Reservation Management
- **SH-FUNC-001**: Direct booking via website/mobile
- **SH-FUNC-002**: OTA integration (Booking.com, Expedia)
- **SH-FUNC-003**: Group reservation handling
- **SH-FUNC-004**: Corporate rate management
- **SH-FUNC-005**: Package and promotion creation
- **SH-FUNC-006**: Room type availability management
- **SH-FUNC-007**: Waitlist management
- **SH-FUNC-008**: Booking modification and cancellation
- **SH-FUNC-009**: Commission tracking
- **SH-FUNC-010**: Channel manager integration

#### 3.1.2 Guest Check-in/Check-out
- **SH-FUNC-011**: Mobile check-in with digital key
- **SH-FUNC-012**: Kiosk self-service check-in
- **SH-FUNC-013**: ID/Passport scanning
- **SH-FUNC-014**: Saudi tourism visa verification
- **SH-FUNC-015**: Pre-arrival data collection
- **SH-FUNC-016**: Room upgrade offerings
- **SH-FUNC-017**: Express check-out
- **SH-FUNC-018**: Late check-out management
- **SH-FUNC-019**: Folio management
- **SH-FUNC-020**: Group check-in handling

#### 3.1.3 Room Management
- **SH-FUNC-021**: Real-time room status tracking
- **SH-FUNC-022**: Room assignment optimization
- **SH-FUNC-023**: Room blocking for maintenance
- **SH-FUNC-024**: Connecting room management
- **SH-FUNC-025**: Room move handling
- **SH-FUNC-026**: Early check-in coordination
- **SH-FUNC-027**: Room type inventory
- **SH-FUNC-028**: Virtual room tours
- **SH-FUNC-029**: Room amenity tracking
- **SH-FUNC-030**: Smoking/non-smoking preferences

#### 3.1.4 IoT Room Automation
- **SH-FUNC-031**: Smart thermostat control
- **SH-FUNC-032**: Automated lighting scenes
- **SH-FUNC-033**: Smart TV personalization
- **SH-FUNC-034**: Motorized curtain control
- **SH-FUNC-035**: Digital door locks with mobile key
- **SH-FUNC-036**: Energy management system
- **SH-FUNC-037**: Occupancy detection
- **SH-FUNC-038**: Voice assistant integration
- **SH-FUNC-039**: Welcome scene activation
- **SH-FUNC-040**: Prayer time notifications

#### 3.1.5 Guest Services
- **SH-FUNC-041**: Mobile concierge chat
- **SH-FUNC-042**: Room service ordering
- **SH-FUNC-043**: Spa appointment booking
- **SH-FUNC-044**: Restaurant reservations
- **SH-FUNC-045**: Transportation arrangements
- **SH-FUNC-046**: Wake-up call management
- **SH-FUNC-047**: Laundry service requests
- **SH-FUNC-048**: Maintenance request tracking
- **SH-FUNC-049**: Local attraction information
- **SH-FUNC-050**: Prayer room booking

#### 3.1.6 Housekeeping Management
- **SH-FUNC-051**: Room cleaning assignments
- **SH-FUNC-052**: Real-time status updates
- **SH-FUNC-053**: Inspection checklists
- **SH-FUNC-054**: Linen inventory tracking
- **SH-FUNC-055**: Lost and found management
- **SH-FUNC-056**: Minibar restocking
- **SH-FUNC-057**: Special request handling
- **SH-FUNC-058**: Turndown service scheduling
- **SH-FUNC-059**: Quality scoring system
- **SH-FUNC-060**: Supply requisitions

#### 3.1.7 Revenue Management
- **SH-FUNC-061**: Dynamic pricing engine
- **SH-FUNC-062**: Competitor rate shopping
- **SH-FUNC-063**: Demand forecasting
- **SH-FUNC-064**: Revenue optimization algorithms
- **SH-FUNC-065**: Rate parity monitoring
- **SH-FUNC-066**: Yield management
- **SH-FUNC-067**: Length of stay restrictions
- **SH-FUNC-068**: Overbooking management
- **SH-FUNC-069**: Seasonal rate planning
- **SH-FUNC-070**: Hajj/Umrah pricing

#### 3.1.8 Billing and Payments
- **SH-FUNC-071**: Folio management
- **SH-FUNC-072**: Split billing
- **SH-FUNC-073**: City ledger accounts
- **SH-FUNC-074**: Multi-currency support
- **SH-FUNC-075**: Payment gateway integration
- **SH-FUNC-076**: VAT calculation (15%)
- **SH-FUNC-077**: Tourism fee collection
- **SH-FUNC-078**: Deposit handling
- **SH-FUNC-079**: Invoice generation
- **SH-FUNC-080**: Payment reconciliation

#### 3.1.9 Food & Beverage Management
- **SH-FUNC-081**: Restaurant POS integration
- **SH-FUNC-082**: Table reservation system
- **SH-FUNC-083**: In-room dining orders
- **SH-FUNC-084**: Banquet event management
- **SH-FUNC-085**: Menu management
- **SH-FUNC-086**: Inventory tracking
- **SH-FUNC-087**: Recipe costing
- **SH-FUNC-088**: Halal certification tracking
- **SH-FUNC-089**: Special dietary requirements
- **SH-FUNC-090**: Kitchen display system

#### 3.1.10 Guest Experience & Loyalty
- **SH-FUNC-091**: Guest preference tracking
- **SH-FUNC-092**: Loyalty point management
- **SH-FUNC-093**: Tier status tracking
- **SH-FUNC-094**: Personalized offers
- **SH-FUNC-095**: Birthday/anniversary recognition
- **SH-FUNC-096**: Guest feedback collection
- **SH-FUNC-097**: Social media integration
- **SH-FUNC-098**: Mobile app engagement
- **SH-FUNC-099**: Digital guest directory
- **SH-FUNC-100**: Virtual concierge AI

## 4. External Interface Requirements

### 4.1 User Interfaces
- **SH-UI-001**: Property management web dashboard
- **SH-UI-002**: Guest mobile application (iOS/Android)
- **SH-UI-003**: Staff mobile app
- **SH-UI-004**: In-room tablet interface
- **SH-UI-005**: Self-service kiosks

### 4.2 Hardware Interfaces
- **SH-HW-001**: Smart door lock systems
- **SH-HW-002**: IoT sensors and actuators
- **SH-HW-003**: POS terminals
- **SH-HW-004**: Key card encoders
- **SH-HW-005**: Passport/ID scanners

### 4.3 Software Interfaces
- **SH-SW-001**: OTA channel managers
- **SH-SW-002**: Payment gateway (NCQ)
- **SH-SW-003**: IoT platform integration
- **SH-SW-004**: Accounting systems
- **SH-SW-005**: CRM platforms

### 4.4 Communication Interfaces
- **SH-COM-001**: REST APIs for integrations
- **SH-COM-002**: MQTT for IoT devices
- **SH-COM-003**: WebSocket for real-time updates
- **SH-COM-004**: SMS gateway
- **SH-COM-005**: Email services

## 5. System Features

### 5.1 Mobile Guest Experience
#### 5.1.1 Description
Comprehensive mobile app providing end-to-end guest journey management.

#### 5.1.2 Functional Requirements
- Mobile check-in/out
- Digital room key
- Service requests
- Bill viewing and payment
- Local recommendations
- Chat with staff
- Room controls
- Express checkout

#### 5.1.3 Priority: High

### 5.2 Smart Room Automation
#### 5.2.1 Description
IoT-enabled room features for enhanced comfort and efficiency.

#### 5.2.2 Functional Requirements
- Automated climate control
- Personalized lighting scenes
- Entertainment preferences
- Energy saving modes
- Voice control
- Occupancy-based automation
- Welcome scenarios
- Integration with guest preferences

#### 5.2.3 Priority: High

### 5.3 Revenue Optimization Engine
#### 5.3.1 Description
AI-powered dynamic pricing and revenue management system.

#### 5.3.2 Functional Requirements
- Demand forecasting
- Competitive pricing analysis
- Dynamic rate optimization
- Channel performance tracking
- Predictive analytics
- A/B testing for rates
- Event-based pricing
- Group displacement analysis

#### 5.3.3 Priority: Medium

### 5.4 Multi-Property Management
#### 5.4.1 Description
Centralized management for hotel chains and groups.

#### 5.4.2 Functional Requirements
- Central reservation system
- Cross-property reporting
- Shared loyalty program
- Staff mobility tracking
- Inventory sharing
- Standardized operations
- Brand consistency
- Regional analytics

#### 5.4.3 Priority: Medium

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
- **SH-PERF-001**: Check-in process < 2 minutes
- **SH-PERF-002**: Mobile app response < 1 second
- **SH-PERF-003**: Support 10,000 concurrent users
- **SH-PERF-004**: IoT command latency < 500ms
- **SH-PERF-005**: Report generation < 5 seconds

### 6.2 Reliability Requirements
- **SH-REL-001**: 99.95% system uptime
- **SH-REL-002**: Offline mode for critical functions
- **SH-REL-003**: Automatic failover
- **SH-REL-004**: Data backup every hour
- **SH-REL-005**: Disaster recovery < 2 hours

### 6.3 Scalability Requirements
- **SH-SCALE-001**: Support 5,000 room property
- **SH-SCALE-002**: 50 property chain management
- **SH-SCALE-003**: 1 million guest profiles
- **SH-SCALE-004**: 100,000 IoT devices
- **SH-SCALE-005**: Peak season load handling

### 6.4 Usability Requirements
- **SH-USE-001**: Multilingual support (10+ languages)
- **SH-USE-002**: Mobile-first design
- **SH-USE-003**: Accessibility compliance
- **SH-USE-004**: Intuitive navigation
- **SH-USE-005**: Cultural customization

## 7. Security Requirements

### 7.1 Data Security
- **SH-SEC-001**: PCI DSS compliance for payments
- **SH-SEC-002**: Guest data encryption
- **SH-SEC-003**: Secure key card encoding
- **SH-SEC-004**: Mobile key encryption
- **SH-SEC-005**: Secure API authentication

### 7.2 Access Control
- **SH-SEC-006**: Role-based permissions
- **SH-SEC-007**: Multi-factor authentication
- **SH-SEC-008**: Session management
- **SH-SEC-009**: Audit trail logging
- **SH-SEC-010**: Data access monitoring

### 7.3 IoT Security
- **SH-SEC-011**: Device authentication
- **SH-SEC-012**: Encrypted MQTT communication
- **SH-SEC-013**: Firmware security
- **SH-SEC-014**: Network isolation
- **SH-SEC-015**: Intrusion detection

### 7.4 Privacy Protection
- **SH-SEC-016**: Guest consent management
- **SH-SEC-017**: Data anonymization
- **SH-SEC-018**: Right to deletion
- **SH-SEC-019**: Marketing preferences
- **SH-SEC-020**: Camera privacy controls

## 8. Compliance Requirements

### 8.1 Tourism Regulations
- **SH-COMP-001**: Saudi Tourism Authority compliance
- **SH-COMP-002**: Hotel classification standards
- **SH-COMP-003**: Guest registration requirements
- **SH-COMP-004**: Tourism fee collection
- **SH-COMP-005**: Hajj/Umrah regulations

### 8.2 Financial Compliance
- **SH-COMP-006**: VAT compliance (15%)
- **SH-COMP-007**: ZATCA integration
- **SH-COMP-008**: Financial reporting standards
- **SH-COMP-009**: Anti-money laundering
- **SH-COMP-010**: Currency regulations

### 8.3 Data Protection
- **SH-COMP-011**: Saudi data protection laws
- **SH-COMP-012**: GDPR for EU guests
- **SH-COMP-013**: Data retention policies
- **SH-COMP-014**: Cross-border data transfer
- **SH-COMP-015**: Breach notification

## Appendices

### Appendix A: IoT Device Integration
| Device Type | Protocol | Functions | Integration |
|------------|----------|-----------|-------------|
| Smart Lock | MQTT | Lock/unlock, access logs | Real-time |
| Thermostat | MQTT | Temperature, scheduling | Bidirectional |
| Lighting | Zigbee | Scenes, dimming | Via hub |
| TV | HTTP API | Channel, volume, casting | Direct |
| Curtains | Z-Wave | Open/close, scheduling | Via hub |

### Appendix B: Guest Journey Touchpoints
| Stage | System Feature | Guest Benefit |
|-------|----------------|---------------|
| Pre-arrival | Mobile check-in | Skip front desk |
| Arrival | Digital key | Contactless entry |
| In-stay | Room controls | Personalized comfort |
| Services | Mobile ordering | Convenience |
| Departure | Express checkout | Quick departure |

### Appendix C: Integration Example
```typescript
// Guest check-in with IoT room preparation
interface GuestCheckInService {
  async performMobileCheckIn(
    bookingId: string,
    guestDevice: string
  ): Promise<CheckInResult> {
    // Verify booking and payment
    const booking = await this.bookingService.getBooking(bookingId);
    const payment = await this.paymentGateway.verifyPayment({
      amount: booking.totalAmount,
      currency: 'SAR',
      bookingReference: bookingId
    });

    if (payment.status === 'COMPLETED') {
      // Assign room and generate digital key
      const room = await this.roomService.assignRoom(booking);
      const digitalKey = await this.generateDigitalKey(room.number, {
        guestId: booking.guestId,
        validFrom: booking.checkIn,
        validUntil: booking.checkOut
      });

      // Prepare room via IoT
      await this.iotService.prepareRoom({
        roomNumber: room.number,
        temperature: booking.preferences.temperature || 22,
        lighting: booking.preferences.lightingScene || 'welcome',
        language: booking.preferences.language || 'ar'
      });

      // Send confirmation
      await this.notificationService.sendCheckInConfirmation({
        guest: booking.guest,
        room: room.number,
        digitalKey: digitalKey.accessCode
      });

      return {
        success: true,
        roomNumber: room.number,
        digitalKey: digitalKey.accessCode,
        checkInTime: new Date()
      };
    }
  }
}
```