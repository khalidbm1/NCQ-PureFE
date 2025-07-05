# Smart Building Management System - User Stories

## Document Information
- **Version**: 1.0
- **Date**: January 2025
- **Status**: Final
- **Product**: NCQ Smart Building Management System
- **Document Type**: User Stories and Scenarios

## Table of Contents
1. [Overview](#1-overview)
2. [Building Occupant Stories](#2-building-occupant-stories)
3. [Facility Manager Stories](#3-facility-manager-stories)
4. [Building Administrator Stories](#4-building-administrator-stories)
5. [Maintenance Technician Stories](#5-maintenance-technician-stories)
6. [Executive Stories](#6-executive-stories)
7. [Visitor Stories](#7-visitor-stories)
8. [Integration Stories](#8-integration-stories)
9. [Epic Breakdown](#9-epic-breakdown)

## 1. Overview

This document contains comprehensive user stories for the NCQ Smart Building Management System, organized by user type and feature area. Each story follows the standard format and includes acceptance criteria.

### Story Format
**As a** [type of user]  
**I want** [goal/desire]  
**So that** [benefit/value]

### Story Sizing
- **XS**: < 2 hours
- **S**: 2-8 hours  
- **M**: 1-3 days
- **L**: 3-5 days
- **XL**: 1-2 weeks
- **XXL**: > 2 weeks

### Priority Levels
- **P0**: Critical - Must have for launch
- **P1**: High - Should have for launch
- **P2**: Medium - Nice to have
- **P3**: Low - Future enhancement

## 2. Building Occupant Stories

### 2.1 Space Booking Stories

#### STORY-OCC-001: Quick Meeting Room Booking
**Size**: M  
**Priority**: P0  
**As a** building occupant  
**I want** to quickly book an available meeting room  
**So that** I can have impromptu meetings without wasting time searching

**Acceptance Criteria**:
- [ ] Can see available rooms on mobile app
- [ ] Can book with 2 taps or less
- [ ] Receive instant confirmation
- [ ] QR code for room access
- [ ] Calendar sync automatic

#### STORY-OCC-002: Recurring Desk Booking
**Size**: M  
**Priority**: P1  
**As a** hybrid worker  
**I want** to book my preferred desk for specific days each week  
**So that** I have a consistent workspace when I come to office

**Acceptance Criteria**:
- [ ] Set recurring pattern (e.g., every Tuesday/Thursday)
- [ ] Select preferred desk/area
- [ ] Modify individual occurrences
- [ ] Receive reminder notifications
- [ ] Cancel future bookings easily

#### STORY-OCC-003: Team Space Finder
**Size**: L  
**Priority**: P1  
**As a** team leader  
**I want** to find and book space for my entire team  
**So that** we can work together effectively

**Acceptance Criteria**:
- [ ] Search for adjacent desks/rooms
- [ ] Filter by team size
- [ ] Check team member availability
- [ ] Book multiple spaces at once
- [ ] Notify all team members

### 2.2 Comfort Control Stories

#### STORY-OCC-004: Personal Comfort Settings
**Size**: M  
**Priority**: P1  
**As an** office worker  
**I want** to set my temperature and lighting preferences  
**So that** I'm comfortable and productive at my workspace

**Acceptance Criteria**:
- [ ] Set preferred temperature range
- [ ] Adjust lighting brightness
- [ ] Save personal preferences
- [ ] Auto-apply when I arrive
- [ ] Override building defaults

#### STORY-OCC-005: Comfort Complaint Reporting
**Size**: S  
**Priority**: P1  
**As a** building occupant  
**I want** to report when I'm too hot/cold  
**So that** facilities can address comfort issues quickly

**Acceptance Criteria**:
- [ ] One-tap comfort reporting
- [ ] Location auto-detected
- [ ] See current conditions
- [ ] Track resolution status
- [ ] Anonymous option available

### 2.3 Building Services Stories

#### STORY-OCC-006: Visitor Pre-Registration
**Size**: M  
**Priority**: P0  
**As an** employee expecting visitors  
**I want** to pre-register my guests  
**So that** they have smooth building access

**Acceptance Criteria**:
- [ ] Add visitor details
- [ ] Set visit date/time
- [ ] Send QR code to visitor
- [ ] Receive arrival notification
- [ ] Extend visit if needed

#### STORY-OCC-007: Cafeteria Menu and Ordering
**Size**: L  
**Priority**: P2  
**As a** building occupant  
**I want** to view cafeteria menu and pre-order  
**So that** I can save time during lunch

**Acceptance Criteria**:
- [ ] View daily menu
- [ ] See nutritional information
- [ ] Place advance orders
- [ ] Pay through app
- [ ] Pickup notifications

#### STORY-OCC-008: Parking Space Booking
**Size**: M  
**Priority**: P1  
**As a** driving employee  
**I want** to reserve parking space  
**So that** I'm guaranteed a spot when I arrive

**Acceptance Criteria**:
- [ ] Check parking availability
- [ ] Reserve specific spot/area
- [ ] Integration with desk booking
- [ ] EV charging spot options
- [ ] Share parking when away

### 2.4 Navigation Stories

#### STORY-OCC-009: Indoor Wayfinding
**Size**: L  
**Priority**: P2  
**As a** building occupant  
**I want** turn-by-turn directions inside the building  
**So that** I can easily find meeting rooms and facilities

**Acceptance Criteria**:
- [ ] Search for any location
- [ ] Step-by-step directions
- [ ] Visual map guidance
- [ ] Accessibility routes
- [ ] Save favorite locations

#### STORY-OCC-010: Find Colleague Location
**Size**: M  
**Priority**: P3  
**As an** employee  
**I want** to find where my colleagues are sitting  
**So that** I can collaborate in person easily

**Acceptance Criteria**:
- [ ] Search colleague by name
- [ ] See their desk location (if shared)
- [ ] Get directions to them
- [ ] Respect privacy settings
- [ ] Show availability status

## 3. Facility Manager Stories

### 3.1 Monitoring Stories

#### STORY-FM-001: Real-Time Building Overview
**Size**: L  
**Priority**: P0  
**As a** facility manager  
**I want** to see real-time status of entire building  
**So that** I can quickly identify and address issues

**Acceptance Criteria**:
- [ ] Live occupancy numbers
- [ ] Active alerts/alarms
- [ ] System status indicators
- [ ] Energy consumption
- [ ] Comfort metrics

#### STORY-FM-002: Occupancy Analytics
**Size**: L  
**Priority**: P1  
**As a** facility manager  
**I want** to analyze space utilization patterns  
**So that** I can optimize space allocation

**Acceptance Criteria**:
- [ ] Historical occupancy data
- [ ] Peak usage times
- [ ] Underutilized areas
- [ ] Department-wise usage
- [ ] Trend analysis

#### STORY-FM-003: Energy Monitoring Dashboard
**Size**: L  
**Priority**: P0  
**As a** facility manager  
**I want** to monitor energy consumption in real-time  
**So that** I can identify waste and reduce costs

**Acceptance Criteria**:
- [ ] Real-time power usage
- [ ] Cost calculations
- [ ] Compare to baseline
- [ ] Identify anomalies
- [ ] System-wise breakdown

### 3.2 Control Stories

#### STORY-FM-004: HVAC Zone Control
**Size**: M  
**Priority**: P0  
**As a** facility manager  
**I want** to control HVAC settings by zone  
**So that** I can maintain comfort while saving energy

**Acceptance Criteria**:
- [ ] Adjust temperature by zone
- [ ] Set schedules
- [ ] Override automation
- [ ] See current conditions
- [ ] Energy impact preview

#### STORY-FM-005: Lighting Scene Management
**Size**: M  
**Priority**: P1  
**As a** facility manager  
**I want** to create and manage lighting scenes  
**So that** I can optimize lighting for different scenarios

**Acceptance Criteria**:
- [ ] Create custom scenes
- [ ] Schedule scene changes
- [ ] Event-based triggers
- [ ] Energy saving modes
- [ ] Emergency lighting control

### 3.3 Maintenance Stories

#### STORY-FM-006: Predictive Maintenance Alerts
**Size**: L  
**Priority**: P1  
**As a** facility manager  
**I want** to receive alerts before equipment fails  
**So that** I can prevent downtime and reduce costs

**Acceptance Criteria**:
- [ ] Failure probability scores
- [ ] Recommended actions
- [ ] Impact assessment
- [ ] Schedule maintenance
- [ ] Track effectiveness

#### STORY-FM-007: Work Order Management
**Size**: L  
**Priority**: P0  
**As a** facility manager  
**I want** to manage all maintenance work orders  
**So that** tasks are completed efficiently

**Acceptance Criteria**:
- [ ] Create/assign work orders
- [ ] Set priorities
- [ ] Track progress
- [ ] Resource allocation
- [ ] Performance metrics

### 3.4 Reporting Stories

#### STORY-FM-008: Automated Compliance Reports
**Size**: M  
**Priority**: P1  
**As a** facility manager  
**I want** automated regulatory compliance reports  
**So that** I can ensure we meet all requirements

**Acceptance Criteria**:
- [ ] Energy usage reports
- [ ] Safety compliance
- [ ] Air quality records
- [ ] Scheduled generation
- [ ] Audit trail

#### STORY-FM-009: Custom Analytics Reports
**Size**: L  
**Priority**: P2  
**As a** facility manager  
**I want** to create custom reports  
**So that** I can analyze specific metrics

**Acceptance Criteria**:
- [ ] Report builder interface
- [ ] Multiple data sources
- [ ] Save report templates
- [ ] Export capabilities
- [ ] Scheduled delivery

## 4. Building Administrator Stories

### 4.1 Configuration Stories

#### STORY-ADM-001: Building Setup Wizard
**Size**: XL  
**Priority**: P0  
**As a** building administrator  
**I want** a guided setup process  
**So that** I can configure the building correctly

**Acceptance Criteria**:
- [ ] Step-by-step wizard
- [ ] Import floor plans
- [ ] Define spaces/zones
- [ ] Set operating hours
- [ ] Configure policies

#### STORY-ADM-002: User Access Management
**Size**: M  
**Priority**: P0  
**As a** building administrator  
**I want** to manage user access rights  
**So that** people have appropriate permissions

**Acceptance Criteria**:
- [ ] Create user groups
- [ ] Assign roles
- [ ] Set access levels
- [ ] Bulk user import
- [ ] Access audit logs

#### STORY-ADM-003: IoT Device Management
**Size**: L  
**Priority**: P0  
**As a** building administrator  
**I want** to manage all IoT devices  
**So that** the building systems work properly

**Acceptance Criteria**:
- [ ] Add/remove devices
- [ ] Configure settings
- [ ] Monitor health
- [ ] Firmware updates
- [ ] Troubleshooting tools

### 4.2 Policy Management Stories

#### STORY-ADM-004: Booking Policy Configuration
**Size**: M  
**Priority**: P1  
**As a** building administrator  
**I want** to set booking rules and limits  
**So that** resources are used fairly

**Acceptance Criteria**:
- [ ] Set booking windows
- [ ] Define user quotas
- [ ] Block-out periods
- [ ] Approval workflows
- [ ] Cancellation policies

#### STORY-ADM-005: Energy Saving Policies
**Size**: M  
**Priority**: P1  
**As a** building administrator  
**I want** to configure energy saving rules  
**So that** we reduce consumption automatically

**Acceptance Criteria**:
- [ ] After-hours settings
- [ ] Occupancy-based rules
- [ ] Weekend modes
- [ ] Holiday schedules
- [ ] Override permissions

### 4.3 Integration Stories

#### STORY-ADM-006: Enterprise System Integration
**Size**: XL  
**Priority**: P1  
**As a** building administrator  
**I want** to integrate with our corporate systems  
**So that** data flows seamlessly

**Acceptance Criteria**:
- [ ] HR system sync
- [ ] Calendar integration
- [ ] Access control sync
- [ ] Financial system link
- [ ] API configuration

#### STORY-ADM-007: Third-Party Service Setup
**Size**: L  
**Priority**: P2  
**As a** building administrator  
**I want** to connect third-party services  
**So that** we can extend functionality

**Acceptance Criteria**:
- [ ] Service marketplace
- [ ] OAuth connections
- [ ] Data mapping
- [ ] Test integrations
- [ ] Monitor data flow

## 5. Maintenance Technician Stories

### 5.1 Mobile Work Order Stories

#### STORY-TECH-001: Mobile Work Order Access
**Size**: M  
**Priority**: P0  
**As a** maintenance technician  
**I want** to access work orders on my phone  
**So that** I can work efficiently in the field

**Acceptance Criteria**:
- [ ] View assigned tasks
- [ ] See priority levels
- [ ] Access location details
- [ ] View equipment history
- [ ] Offline mode support

#### STORY-TECH-002: Task Status Updates
**Size**: S  
**Priority**: P0  
**As a** maintenance technician  
**I want** to update task status quickly  
**So that** managers know progress in real-time

**Acceptance Criteria**:
- [ ] One-tap status changes
- [ ] Add progress notes
- [ ] Photo attachments
- [ ] Time tracking
- [ ] Parts used logging

#### STORY-TECH-003: Equipment Diagnostics
**Size**: L  
**Priority**: P1  
**As a** maintenance technician  
**I want** to run diagnostics on equipment  
**So that** I can identify issues quickly

**Acceptance Criteria**:
- [ ] Connect to equipment
- [ ] Run diagnostic tests
- [ ] View error codes
- [ ] Access manuals
- [ ] Order parts

### 5.2 Documentation Stories

#### STORY-TECH-004: Digital Equipment Records
**Size**: M  
**Priority**: P1  
**As a** maintenance technician  
**I want** to access equipment documentation  
**So that** I can service equipment properly

**Acceptance Criteria**:
- [ ] Equipment manuals
- [ ] Service history
- [ ] Warranty information
- [ ] Parts diagrams
- [ ] Video guides

#### STORY-TECH-005: Maintenance Photo Documentation
**Size**: S  
**Priority**: P1  
**As a** maintenance technician  
**I want** to document work with photos  
**So that** there's visual record of issues and fixes

**Acceptance Criteria**:
- [ ] Take photos in-app
- [ ] Annotate images
- [ ] Attach to work orders
- [ ] Before/after comparison
- [ ] Auto-organize by job

### 5.3 Communication Stories

#### STORY-TECH-006: Expert Consultation
**Size**: M  
**Priority**: P2  
**As a** maintenance technician  
**I want** to consult with experts remotely  
**So that** I can solve complex issues

**Acceptance Criteria**:
- [ ] Video call capability
- [ ] Screen sharing
- [ ] Document sharing
- [ ] Expert directory
- [ ] Call recording

#### STORY-TECH-007: Team Coordination
**Size**: M  
**Priority**: P1  
**As a** maintenance technician  
**I want** to coordinate with my team  
**So that** we can work efficiently together

**Acceptance Criteria**:
- [ ] Team chat
- [ ] Task handoffs
- [ ] Location sharing
- [ ] Shift schedules
- [ ] Resource sharing

## 6. Executive Stories

### 6.1 Performance Dashboard Stories

#### STORY-EXEC-001: Executive KPI Dashboard
**Size**: L  
**Priority**: P1  
**As an** executive  
**I want** to see key building performance metrics  
**So that** I can make informed decisions

**Acceptance Criteria**:
- [ ] Cost per square foot
- [ ] Occupancy rates
- [ ] Energy efficiency
- [ ] Tenant satisfaction
- [ ] ROI metrics

#### STORY-EXEC-002: Portfolio Comparison
**Size**: L  
**Priority**: P2  
**As an** executive with multiple buildings  
**I want** to compare performance across properties  
**So that** I can identify best practices

**Acceptance Criteria**:
- [ ] Side-by-side metrics
- [ ] Ranking by KPI
- [ ] Trend comparisons
- [ ] Benchmarking
- [ ] Drill-down capability

### 6.2 Financial Stories

#### STORY-EXEC-003: Cost Analysis Reports
**Size**: M  
**Priority**: P1  
**As an** executive  
**I want** detailed cost breakdowns  
**So that** I can optimize spending

**Acceptance Criteria**:
- [ ] Operating costs
- [ ] Energy costs
- [ ] Maintenance costs
- [ ] Cost trends
- [ ] Savings opportunities

#### STORY-EXEC-004: ROI Tracking
**Size**: M  
**Priority**: P1  
**As an** executive  
**I want** to track return on smart building investment  
**So that** I can justify and expand the program

**Acceptance Criteria**:
- [ ] Investment tracking
- [ ] Savings calculation
- [ ] Payback period
- [ ] Productivity gains
- [ ] Comparison to baseline

### 6.3 Strategic Planning Stories

#### STORY-EXEC-005: Predictive Analytics
**Size**: XL  
**Priority**: P2  
**As an** executive  
**I want** predictive insights about building performance  
**So that** I can plan strategically

**Acceptance Criteria**:
- [ ] Occupancy forecasts
- [ ] Energy projections
- [ ] Maintenance predictions
- [ ] Cost forecasts
- [ ] Scenario modeling

#### STORY-EXEC-006: Sustainability Reporting
**Size**: L  
**Priority**: P1  
**As an** executive  
**I want** comprehensive sustainability reports  
**So that** we can meet ESG commitments

**Acceptance Criteria**:
- [ ] Carbon footprint
- [ ] Energy efficiency
- [ ] Water usage
- [ ] Waste metrics
- [ ] Certification tracking

## 7. Visitor Stories

### 7.1 Check-In Stories

#### STORY-VIS-001: Self-Service Check-In
**Size**: M  
**Priority**: P0  
**As a** building visitor  
**I want** to check myself in quickly  
**So that** I don't waste time at reception

**Acceptance Criteria**:
- [ ] QR code scanning
- [ ] Touch-screen kiosk
- [ ] Print visitor badge
- [ ] Host notification
- [ ] Multi-language support

#### STORY-VIS-002: Pre-Visit Information
**Size**: S  
**Priority**: P1  
**As a** pre-registered visitor  
**I want** to receive visit information in advance  
**So that** I can prepare for my visit

**Acceptance Criteria**:
- [ ] Parking instructions
- [ ] Building entrance map
- [ ] Contact information
- [ ] WiFi credentials
- [ ] Safety information

### 7.2 In-Building Experience Stories

#### STORY-VIS-003: Visitor Wayfinding
**Size**: M  
**Priority**: P1  
**As a** building visitor  
**I want** easy navigation to my destination  
**So that** I don't get lost

**Acceptance Criteria**:
- [ ] Digital maps
- [ ] Turn-by-turn directions
- [ ] Landmark guidance
- [ ] Elevator directions
- [ ] Emergency exits shown

#### STORY-VIS-004: Guest WiFi Access
**Size**: S  
**Priority**: P0  
**As a** building visitor  
**I want** easy WiFi access  
**So that** I can stay connected

**Acceptance Criteria**:
- [ ] Auto-connect with badge
- [ ] Time-limited access
- [ ] Bandwidth limits
- [ ] Terms acceptance
- [ ] Secure connection

## 8. Integration Stories

### 8.1 System Integration Stories

#### STORY-INT-001: BMS Integration
**Size**: XL  
**Priority**: P0  
**As a** system integrator  
**I want** to connect existing building management systems  
**So that** we can leverage current infrastructure

**Acceptance Criteria**:
- [ ] BACnet support
- [ ] Modbus support
- [ ] Data mapping tools
- [ ] Real-time sync
- [ ] Error handling

#### STORY-INT-002: Access Control Integration
**Size**: L  
**Priority**: P0  
**As a** system integrator  
**I want** to integrate with access control systems  
**So that** we have unified security management

**Acceptance Criteria**:
- [ ] Card reader support
- [ ] Biometric integration
- [ ] Mobile credentials
- [ ] Audit trail sync
- [ ] Emergency overrides

### 8.2 Enterprise Integration Stories

#### STORY-INT-003: Calendar System Sync
**Size**: M  
**Priority**: P1  
**As an** IT administrator  
**I want** to sync with our calendar system  
**So that** room bookings appear in both systems

**Acceptance Criteria**:
- [ ] Outlook integration
- [ ] Google Calendar sync
- [ ] Two-way sync
- [ ] Conflict resolution
- [ ] Attendee sync

#### STORY-INT-004: HR System Integration
**Size**: L  
**Priority**: P1  
**As an** IT administrator  
**I want** to sync with our HR system  
**So that** employee data stays current

**Acceptance Criteria**:
- [ ] Employee data sync
- [ ] Organization structure
- [ ] Auto-provisioning
- [ ] De-provisioning
- [ ] Attribute mapping

### 8.3 IoT Integration Stories

#### STORY-INT-005: Sensor Network Setup
**Size**: L  
**Priority**: P0  
**As an** IoT specialist  
**I want** to deploy and configure sensor networks  
**So that** we can monitor building conditions

**Acceptance Criteria**:
- [ ] Auto-discovery
- [ ] Bulk configuration
- [ ] Network monitoring
- [ ] Firmware management
- [ ] Troubleshooting tools

#### STORY-INT-006: Legacy Equipment Connection
**Size**: XL  
**Priority**: P2  
**As an** IoT specialist  
**I want** to connect legacy equipment  
**So that** we don't need to replace everything

**Acceptance Criteria**:
- [ ] Protocol adapters
- [ ] Data translators
- [ ] Retrofit options
- [ ] Gateway devices
- [ ] Compatibility testing

## 9. Epic Breakdown

### 9.1 Core Platform Epic
**Goal**: Build foundational smart building platform

**Stories Included**:
- STORY-OCC-001, 002, 003, 006
- STORY-FM-001, 004, 007
- STORY-ADM-001, 002, 003
- STORY-TECH-001, 002

**Timeline**: Q1 2025  
**Success Metrics**: 5 buildings live, 1000 active users

### 9.2 Advanced Features Epic
**Goal**: Add intelligence and automation

**Stories Included**:
- STORY-FM-003, 006
- STORY-ADM-005
- STORY-EXEC-005
- All predictive features

**Timeline**: Q2 2025  
**Success Metrics**: 30% energy reduction demonstrated

### 9.3 User Experience Epic
**Goal**: Enhance occupant and visitor experience

**Stories Included**:
- STORY-OCC-004, 005, 007, 009
- STORY-VIS-001, 002, 003
- Mobile app enhancements

**Timeline**: Q3 2025  
**Success Metrics**: 90% user satisfaction

### 9.4 Enterprise Integration Epic
**Goal**: Seamless enterprise system integration

**Stories Included**:
- STORY-INT-003, 004
- STORY-ADM-006, 007
- All system integration stories

**Timeline**: Q4 2025  
**Success Metrics**: 10+ enterprise integrations

## Acceptance Criteria Template

### Definition of Done
For a user story to be considered complete:

1. **Development Complete**
   - [ ] Feature implemented
   - [ ] Unit tests written (80%+ coverage)
   - [ ] Integration tests passed
   - [ ] Code reviewed and approved

2. **Quality Assurance**
   - [ ] Functional testing passed
   - [ ] Performance benchmarks met
   - [ ] Security review completed
   - [ ] Accessibility verified

3. **Documentation**
   - [ ] User documentation updated
   - [ ] API documentation complete
   - [ ] Release notes written
   - [ ] Training materials created

4. **Deployment**
   - [ ] Deployed to staging
   - [ ] User acceptance testing
   - [ ] Production deployment
   - [ ] Monitoring configured

## Conclusion

These user stories comprehensively cover all aspects of the NCQ Smart Building Management System from the perspective of every stakeholder. They provide clear guidance for development teams while ensuring that user needs remain at the center of product development.

The stories are prioritized to deliver maximum value early while building toward a comprehensive platform that transforms how buildings are managed and experienced.