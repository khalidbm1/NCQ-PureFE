# NCQ Payment Gateway - Software Requirements Specification (SRS)

## Document Information
- **Version**: 1.0
- **Date**: January 2025
- **Status**: Final
- **Product**: NCQ Payment Gateway (NCQ PGW)
- **Document Type**: Software Requirements Specification

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Data Requirements](#6-data-requirements)
7. [External Interfaces](#7-external-interfaces)
8. [Security Requirements](#8-security-requirements)
9. [Compliance Requirements](#9-compliance-requirements)
10. [Performance Requirements](#10-performance-requirements)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the NCQ Payment Gateway (NCQ PGW), a cutting-edge payment processing platform designed specifically for the Saudi Arabian and MENA markets, offering seamless integration with local and international payment methods.

### 1.2 Scope
The NCQ Payment Gateway encompasses:
- Multi-channel payment processing (online, mobile, POS)
- Local payment method support (MADA, SADAD, STC Pay)
- International card processing (Visa, Mastercard, Amex)
- Digital wallet integration
- Real-time fraud detection
- Merchant management portal
- Comprehensive reporting and analytics
- Multi-currency support
- Recurring payments and subscriptions
- PCI DSS Level 1 compliance

### 1.3 Definitions and Acronyms
- **PGW**: Payment Gateway
- **PCI DSS**: Payment Card Industry Data Security Standard
- **MADA**: Saudi national payment network
- **SADAD**: Saudi bill payment system
- **SAMA**: Saudi Central Bank
- **3DS**: 3D Secure authentication
- **API**: Application Programming Interface
- **TPS**: Transactions Per Second
- **KYC**: Know Your Customer
- **AML**: Anti-Money Laundering

## 2. System Overview

### 2.1 System Context
NCQ Payment Gateway provides:
- Unified payment processing for all channels
- Direct bank integrations for lower costs
- AI-powered fraud prevention
- Real-time transaction processing
- Comprehensive merchant tools
- Regional compliance built-in

### 2.2 Major Components
1. **Payment Processing Engine**: Core transaction processing
2. **Merchant Portal**: Business management interface
3. **Payment APIs**: Integration endpoints
4. **Fraud Detection System**: AI-powered security
5. **Settlement Engine**: Automated fund settlement
6. **Reporting System**: Analytics and insights
7. **Risk Management**: Compliance and monitoring
8. **Integration Hub**: Bank and provider connections

## 3. Functional Requirements

### 3.1 Payment Processing (FR-PP)

#### FR-PP-001: Transaction Processing
- Support multiple payment types (cards, wallets, bank transfers)
- Real-time authorization
- Transaction routing optimization
- Multi-currency processing
- Partial payment support
- Split payment capability

#### FR-PP-002: Payment Methods Support
- **Local Methods**:
  - MADA cards (all types)
  - SADAD payment system
  - STC Pay integration
  - Bank transfers (SARIE)
- **International Methods**:
  - Visa/Mastercard/Amex
  - Apple Pay/Google Pay
  - PayPal integration
  - Cryptocurrency (future)

#### FR-PP-003: Transaction Management
- Transaction search and filtering
- Status tracking
- Modification capabilities
- Cancellation/refund processing
- Chargeback handling
- Transaction history

### 3.2 Merchant Management (FR-MM)

#### FR-MM-001: Merchant Onboarding
- Digital KYC process
- Document verification
- Risk assessment
- Account provisioning
- API key generation
- Integration assistance

#### FR-MM-002: Merchant Portal
- Dashboard with key metrics
- Transaction management
- Settlement tracking
- Report generation
- User management
- Settings configuration

#### FR-MM-003: Multi-Store Support
- Multiple store management
- Centralized reporting
- Store-level permissions
- Consolidated billing
- Cross-store analytics

### 3.3 Security & Fraud Prevention (FR-SF)

#### FR-SF-001: Real-time Fraud Detection
- AI/ML-based fraud scoring
- Rule-based detection
- Velocity checking
- Geo-location verification
- Device fingerprinting
- Behavioral analysis

#### FR-SF-002: 3D Secure Integration
- 3DS 2.0 support
- Frictionless authentication
- Challenge flow handling
- Liability shift
- Mobile SDK support

#### FR-SF-003: Tokenization Service
- Card tokenization
- Token vault management
- Token lifecycle management
- Cross-channel tokens
- Network tokenization

### 3.4 Settlement & Reconciliation (FR-SR)

#### FR-SR-001: Automated Settlement
- Daily settlement processing
- Multi-bank settlement
- Settlement reconciliation
- Fee calculation
- Currency conversion
- Settlement reports

#### FR-SR-002: Financial Reconciliation
- Three-way reconciliation
- Discrepancy detection
- Automated matching
- Exception handling
- Audit trails
- Bank statement import

#### FR-SR-003: Merchant Payouts
- Flexible payout schedules
- Multiple payout methods
- Hold and release controls
- Reserve management
- Payout notifications

### 3.5 Reporting & Analytics (FR-RA)

#### FR-RA-001: Real-time Analytics
- Transaction volume metrics
- Success/failure rates
- Revenue analytics
- Geographic distribution
- Payment method breakdown
- Trend analysis

#### FR-RA-002: Custom Reporting
- Report builder interface
- Scheduled reports
- Data export options
- API access to data
- Visualization tools
- Drill-down capabilities

#### FR-RA-003: Compliance Reporting
- Regulatory reports
- SAMA reporting
- Tax reports
- AML reports
- Audit reports
- Transaction logs

### 3.6 Integration Services (FR-IS)

#### FR-IS-001: Payment APIs
- RESTful API design
- SDK availability (Multiple languages)
- Webhook notifications
- Batch processing API
- Testing environment
- API versioning

#### FR-IS-002: Third-party Integrations
- E-commerce platforms
- ERP systems
- Accounting software
- POS systems
- Mobile apps
- Banking APIs

#### FR-IS-003: Plugin Ecosystem
- WooCommerce plugin
- Shopify app
- Magento extension
- Custom integrations
- No-code solutions

### 3.7 Risk Management (FR-RM)

#### FR-RM-001: Transaction Monitoring
- Real-time monitoring
- Suspicious activity detection
- Sanctions screening
- PEP checking
- Watchlist management
- Case management

#### FR-RM-002: Compliance Management
- KYC/CDD processes
- AML procedures
- Risk scoring
- Enhanced due diligence
- Regulatory updates
- Compliance dashboard

#### FR-RM-003: Dispute Management
- Chargeback handling
- Dispute workflows
- Evidence collection
- Representment tools
- Win rate tracking
- Notification system

## 4. Non-Functional Requirements

### 4.1 Performance Requirements (NFR-PR)

#### NFR-PR-001: Transaction Speed
- Authorization: <200ms average
- End-to-end: <2 seconds
- API response: <100ms
- Dashboard load: <3 seconds

#### NFR-PR-002: Throughput
- 10,000+ TPS capacity
- 99.99% success rate
- Linear scalability
- Load balancing

#### NFR-PR-003: Capacity
- 100M+ transactions/month
- 50,000+ merchants
- 1M+ cardholders
- Unlimited products

### 4.2 Reliability Requirements (NFR-RR)

#### NFR-RR-001: Availability
- 99.99% uptime SLA
- Zero planned downtime
- Hot failover capability
- Disaster recovery

#### NFR-RR-002: Data Integrity
- Zero transaction loss
- ACID compliance
- Data validation
- Audit trails

### 4.3 Security Requirements (NFR-SR)

#### NFR-SR-001: Data Protection
- PCI DSS Level 1
- End-to-end encryption
- Tokenization
- Key management

#### NFR-SR-002: Access Control
- Multi-factor authentication
- Role-based access
- IP whitelisting
- Session management

### 4.4 Usability Requirements (NFR-UR)

#### NFR-UR-001: User Experience
- Intuitive interfaces
- Mobile responsive
- Multi-language (Arabic/English)
- Accessibility compliant

#### NFR-UR-002: Integration Ease
- Simple API design
- Comprehensive documentation
- Code examples
- Testing tools

## 5. System Architecture

### 5.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    External Interfaces                       │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │  Merchants  │ │  Cardholders │ │  Banking Partners  │  │
│  └─────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                      API Gateway                             │
│              (Load Balancing, Rate Limiting)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    Application Layer                         │
├────────────┬────────────┬────────────┬─────────────────────┤
│  Payment   │  Merchant  │   Risk     │    Reporting        │
│  Engine    │  Services  │   Engine   │    Services         │
├────────────┼────────────┼────────────┼─────────────────────┤
│Settlement  │   Fraud    │   Token    │    Integration      │
│  Engine    │ Detection  │   Vault    │     Services        │
└────────────┴────────────┴────────────┴─────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                  Integration Layer                           │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │Bank APIs    │ │ Card Networks│ │ Payment Providers  │  │
│  └─────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                      Data Layer                              │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ PostgreSQL  │ │    Redis     │ │   Kafka           │  │
│  │  (Primary)  │ │   (Cache)    │ │ (Event Stream)    │  │
│  └─────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Architecture

#### 5.2.1 Payment Engine
- Transaction orchestration
- Routing logic
- Authorization handling
- Response processing
- Retry mechanisms

#### 5.2.2 Risk Engine
- Real-time scoring
- Rule evaluation
- ML model execution
- Decision logging
- Alert generation

#### 5.2.3 Settlement Engine
- Batch processing
- Fee calculation
- Currency conversion
- Bank file generation
- Reconciliation

### 5.3 Technology Stack

```yaml
Backend:
  Language: Java 21
  Framework: Spring Boot 3.4
  Database: PostgreSQL 16
  Cache: Redis 7.2
  Message Queue: Apache Kafka
  
Frontend:
  Merchant Portal: React 18
  Admin Panel: Angular 17
  Mobile SDKs: Native (iOS/Android)
  
Infrastructure:
  Container: Docker
  Orchestration: Kubernetes
  Service Mesh: Istio
  Monitoring: Prometheus + Grafana
  
Security:
  HSM: Hardware Security Module
  WAF: Web Application Firewall
  SIEM: Security monitoring
  Vault: HashiCorp Vault
```

## 6. Data Requirements

### 6.1 Core Data Models

#### 6.1.1 Transaction Model
```java
class Transaction {
    String transactionId;      // Unique identifier
    String merchantId;         // Merchant reference
    String orderId;           // Merchant order ID
    
    BigDecimal amount;        // Transaction amount
    String currency;          // ISO currency code
    String status;            // Transaction status
    
    PaymentMethod paymentMethod;
    CardDetails cardDetails;  // Tokenized
    
    Timestamp createdAt;
    Timestamp updatedAt;
    
    FraudScore fraudScore;
    Settlement settlement;
    
    Map<String, Object> metadata;
}
```

#### 6.1.2 Merchant Model
```java
class Merchant {
    String merchantId;
    String businessName;
    String registrationNumber;
    
    KYCStatus kycStatus;
    RiskProfile riskProfile;
    
    List<Store> stores;
    List<ApiKey> apiKeys;
    List<User> users;
    
    BankAccount settlementAccount;
    FeeStructure fees;
    
    Timestamp onboardedAt;
    Boolean active;
}
```

### 6.2 Data Storage Requirements

#### 6.2.1 Transaction Data
- Retention: 7 years
- Encryption: AES-256
- Backup: Real-time replication
- Archive: After 1 year

#### 6.2.2 Sensitive Data
- PAN: Tokenized only
- CVV: Never stored
- Passwords: Bcrypt hashed
- API keys: Encrypted

### 6.3 Data Volumes
- Transactions: 100M+/month
- Storage growth: 500GB/month
- Active merchants: 50,000+
- Daily settlements: 10,000+

## 7. External Interfaces

### 7.1 Payment Network Interfaces
- **MADA Network**: ISO 8583 protocol
- **Visa/Mastercard**: REST APIs
- **SADAD**: SOAP/XML interface
- **Banks**: Custom APIs per bank

### 7.2 Merchant Integration

#### 7.2.1 REST API
```http
POST /v1/payments
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "SAR",
  "payment_method": "card",
  "card": {
    "number": "4111111111111111",
    "exp_month": 12,
    "exp_year": 2025,
    "cvv": "123"
  },
  "metadata": {
    "order_id": "ORD-12345",
    "customer_id": "CUST-67890"
  }
}
```

#### 7.2.2 Webhook Events
```json
{
  "event_type": "payment.success",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "transaction_id": "txn_1234567890",
    "amount": 100.00,
    "currency": "SAR",
    "status": "success"
  }
}
```

### 7.3 SDK Interfaces
- JavaScript SDK
- iOS SDK (Swift)
- Android SDK (Kotlin)
- PHP Library
- Python Package
- .NET Library

## 8. Security Requirements

### 8.1 PCI DSS Compliance

#### 8.1.1 Network Security
- Network segmentation
- Firewall configuration
- Intrusion detection
- DMZ architecture
- VPN access only

#### 8.1.2 Data Security
- Cardholder data encryption
- Secure key management
- Access control
- Audit logging
- Vulnerability scanning

### 8.2 Application Security

#### 8.2.1 Authentication
- API key authentication
- OAuth 2.0 support
- JWT tokens
- Rate limiting
- IP allowlisting

#### 8.2.2 Encryption
- TLS 1.3 minimum
- AES-256 for data at rest
- HSM for key storage
- Certificate pinning
- Perfect forward secrecy

### 8.3 Operational Security

#### 8.3.1 Monitoring
- Real-time alerts
- Anomaly detection
- Security dashboards
- Incident response
- Forensic capabilities

#### 8.3.2 Compliance
- Daily security scans
- Quarterly audits
- Penetration testing
- Code reviews
- Security training

## 9. Compliance Requirements

### 9.1 Regulatory Compliance

#### 9.1.1 SAMA Requirements
- Transaction reporting
- AML/CFT compliance
- Customer due diligence
- Suspicious activity reporting
- Data localization

#### 9.1.2 International Standards
- PCI DSS Level 1
- ISO 27001/27002
- PA-DSS compliance
- EMV compliance
- 3D Secure 2.0

### 9.2 Legal Requirements

#### 9.2.1 Data Protection
- Data residency in Saudi Arabia
- Privacy policy compliance
- Consent management
- Right to access/delete
- Breach notification

#### 9.2.2 Financial Regulations
- Anti-money laundering
- Counter-terrorism financing
- Sanctions screening
- Transaction limits
- Reporting obligations

### 9.3 Industry Standards

#### 9.3.1 Card Network Rules
- Visa regulations
- Mastercard standards
- MADA requirements
- Chargeback rules
- Dispute procedures

#### 9.3.2 API Standards
- REST principles
- OpenAPI 3.0
- JSON:API format
- OAuth 2.0
- Webhook standards

## 10. Performance Requirements

### 10.1 Response Time Requirements
- Authorization: <200ms (95th percentile)
- API calls: <100ms
- Dashboard queries: <2 seconds
- Report generation: <10 seconds
- Webhook delivery: <5 seconds

### 10.2 Throughput Requirements
- Peak TPS: 10,000
- Sustained TPS: 5,000
- Concurrent connections: 50,000
- API requests/second: 20,000
- Webhook deliveries/second: 10,000

### 10.3 Scalability Requirements
- Horizontal scaling
- Auto-scaling policies
- Database sharding
- Cache clustering
- CDN integration

### 10.4 Resource Requirements
- CPU: <70% average utilization
- Memory: <80% peak usage
- Storage IOPS: 50,000+
- Network: 10Gbps minimum
- Database connections: 10,000 pool

## Appendices

### Appendix A: API Endpoints
```
# Payment Processing
POST   /v1/payments
GET    /v1/payments/{id}
POST   /v1/payments/{id}/capture
POST   /v1/payments/{id}/refund
POST   /v1/payments/{id}/cancel

# Tokenization
POST   /v1/tokens
GET    /v1/tokens/{id}
DELETE /v1/tokens/{id}

# Merchant Management  
GET    /v1/merchants/profile
PUT    /v1/merchants/profile
GET    /v1/merchants/transactions
GET    /v1/merchants/settlements

# Reporting
GET    /v1/reports/transactions
GET    /v1/reports/settlements
POST   /v1/reports/custom
```

### Appendix B: Status Codes
- 1000: Success
- 2001: Insufficient funds
- 2002: Card expired
- 2003: Invalid card
- 3001: Fraud suspected
- 3002: Velocity exceeded
- 4001: System error
- 4002: Network timeout

### Appendix C: Supported Currencies
- SAR (Saudi Riyal) - Primary
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- AED (UAE Dirham)
- KWD (Kuwaiti Dinar)
- Additional currencies on request