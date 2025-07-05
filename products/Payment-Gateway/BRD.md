# NCQ Payment Gateway - Business Requirements Document (BRD)

## Document Information
- **Version**: 1.0
- **Date**: January 2025
- **Status**: Final
- **Product**: NCQ Payment Gateway (NCQ PGW)
- **Document Type**: Business Requirements Document

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Business Context](#2-business-context)
3. [Market Analysis](#3-market-analysis)
4. [Business Objectives](#4-business-objectives)
5. [Target Market](#5-target-market)
6. [Revenue Model](#6-revenue-model)
7. [Business Requirements](#7-business-requirements)
8. [Success Metrics](#8-success-metrics)
9. [Risk Analysis](#9-risk-analysis)
10. [Implementation Roadmap](#10-implementation-roadmap)

## 1. Executive Summary

### 1.1 Business Opportunity
The Saudi Arabian digital payment market is experiencing explosive growth, projected to reach $166 billion by 2030, driven by Vision 2030's cashless society initiative. Current payment solutions face challenges:
- High transaction fees (2.5-3.5%)
- Limited local payment method support
- Complex integration requirements
- Poor Arabic language support
- Lack of real-time settlement

NCQ Payment Gateway addresses these gaps with a Saudi-first approach, offering comprehensive local payment support, competitive pricing, and seamless integration.

### 1.2 Solution Overview
NCQ PGW provides:
- **50% lower fees** than international competitors
- **Same-day settlement** for local transactions
- **Native MADA and SADAD** integration
- **Arabic-first** user experience
- **AI-powered fraud prevention** reducing chargebacks by 70%
- **10,000+ TPS** processing capacity

### 1.3 Financial Projections
- **Year 1**: $8M revenue (GMV: $400M)
- **Year 2**: $35M revenue (GMV: $2B)
- **Year 3**: $120M revenue (GMV: $8B)
- **Break-even**: Month 14
- **5-year NPV**: $450M

## 2. Business Context

### 2.1 Saudi Digital Payment Landscape

#### 2.1.1 Market Drivers
- **Vision 2030**: Target 70% digital payments by 2030
- **SAMA Initiatives**: Open banking, instant payments
- **E-commerce Growth**: 32% annual growth rate
- **Demographics**: 70% population under 35
- **Smartphone Penetration**: 96% of population

#### 2.1.2 Current Pain Points
- **High Costs**: International gateways charge 2.5-3.5% + fees
- **Settlement Delays**: 3-7 days for fund settlement
- **Integration Complexity**: Months to integrate
- **Limited Local Support**: Poor MADA/SADAD integration
- **Currency Issues**: Forced USD conversion costs

### 2.2 Regulatory Environment

#### 2.2.1 SAMA Regulations
- Payment service provider licensing
- Data localization requirements
- AML/CFT compliance
- Consumer protection rules
- Instant payment system participation

#### 2.2.2 Compliance Requirements
- PCI DSS Level 1 certification
- ISO 27001 security standards
- GDPR for international transactions
- Saudi Data Protection Law
- Banking secrecy regulations

### 2.3 Competitive Landscape Analysis

#### 2.3.1 International Players
**PayPal/Braintree**
- Market share: 15%
- Strengths: Brand, features
- Weaknesses: High fees, no MADA
- Opportunity: Localization gap

**Stripe**
- Market share: 10%
- Strengths: Developer experience
- Weaknesses: Limited local methods
- Opportunity: Enterprise focus

**2Checkout**
- Market share: 5%
- Strengths: Global reach
- Weaknesses: Poor local support
- Opportunity: SMB market

#### 2.3.2 Regional Players
**PayTabs**
- Market share: 25%
- Strengths: Regional presence
- Weaknesses: Limited innovation
- Opportunity: Technology gap

**Telr**
- Market share: 10%
- Strengths: UAE strong
- Weaknesses: Saudi focus
- Opportunity: Market share

## 3. Market Analysis

### 3.1 Total Addressable Market (TAM)

#### 3.1.1 Saudi Arabia
- **2025**: $50B digital payments
- **2030**: $166B digital payments
- **CAGR**: 27%
- **Target Capture**: 5% by 2028

#### 3.1.2 GCC Expansion
- **UAE**: $40B market
- **Kuwait**: $15B market
- **Qatar**: $12B market
- **Total GCC TAM**: $250B by 2030

### 3.2 Serviceable Available Market (SAM)
- **E-commerce**: $30B
- **Digital Services**: $15B
- **Government Payments**: $10B
- **Bill Payments**: $8B
- **Total SAM**: $63B

### 3.3 Market Segmentation

#### 3.3.1 By Business Size
- **Enterprise** (>$10M GMV): 30% of market
- **Mid-Market** ($1-10M GMV): 40% of market
- **SMB** (<$1M GMV): 30% of market

#### 3.3.2 By Industry
- **Retail/E-commerce**: 35%
- **Travel/Hospitality**: 20%
- **Government/Utilities**: 15%
- **Digital Services**: 15%
- **Others**: 15%

### 3.4 Growth Projections
- **Digital Payment Growth**: 27% CAGR
- **E-commerce Growth**: 32% CAGR
- **Mobile Payments**: 45% CAGR
- **BNPL Market**: 60% CAGR

## 4. Business Objectives

### 4.1 Strategic Objectives

#### 4.1.1 Market Leadership
- Become top 3 payment gateway in Saudi by 2027
- Process 10% of Saudi digital payments by 2028
- Lead in innovation and technology
- Set industry standards for pricing

#### 4.1.2 Financial Targets
- **GMV Targets**:
  - Year 1: $400M
  - Year 2: $2B
  - Year 3: $8B
- **Revenue Targets**:
  - Year 1: $8M
  - Year 2: $35M
  - Year 3: $120M
- **Profitability**: EBITDA positive by Month 14

#### 4.1.3 Operational Excellence
- **Uptime**: 99.99% availability
- **Performance**: <200ms transaction time
- **Fraud Rate**: <0.05%
- **Chargeback Rate**: <0.5%

### 4.2 Business Goals

#### 4.2.1 Customer Acquisition
- **Year 1**: 1,000 active merchants
- **Year 2**: 5,000 active merchants
- **Year 3**: 15,000 active merchants
- **Enterprise Clients**: 50+ by Year 3

#### 4.2.2 Product Development
- Launch core gateway (Q1 2025)
- MADA certification (Q2 2025)
- AI fraud system (Q3 2025)
- Open banking integration (Q4 2025)

#### 4.2.3 Geographic Expansion
- **Phase 1**: Saudi Arabia (2025)
- **Phase 2**: UAE, Kuwait (2026)
- **Phase 3**: Egypt, Qatar (2027)
- **Phase 4**: Rest of MENA (2028)

### 4.3 Strategic Partnerships
- Saudi banks (SABB, Al Rajhi, SNB)
- MADA network membership
- SADAD integration partner
- E-commerce platforms
- Government entities

## 5. Target Market

### 5.1 Primary Target Segments

#### 5.1.1 E-commerce Businesses
**Profile**:
- Online retailers
- Marketplaces
- Digital services
- Subscription businesses

**Pain Points**:
- High payment failure rates
- Cart abandonment
- Integration complexity
- Multi-channel needs

**Value Proposition**:
- Higher success rates
- One-click checkout
- Omni-channel support
- Advanced analytics

#### 5.1.2 Enterprise Clients
**Profile**:
- Large corporations
- Government entities
- Multi-national companies
- High-volume processors

**Pain Points**:
- Complex requirements
- Custom integrations
- Compliance needs
- Cost optimization

**Value Proposition**:
- Dedicated support
- Custom solutions
- Volume pricing
- White-label options

#### 5.1.3 SMB Market
**Profile**:
- Small retailers
- Service providers
- Startups
- Freelancers

**Pain Points**:
- High fees eating margins
- Complex setup
- Limited support
- Cash flow issues

**Value Proposition**:
- Lowest fees in market
- 5-minute setup
- 24/7 Arabic support
- Same-day settlement

### 5.2 Customer Personas

#### 5.2.1 Ahmad - E-commerce Entrepreneur
**Profile**:
- Age: 28
- Runs online fashion store
- Monthly GMV: $50,000
- Tech-savvy

**Needs**:
- Easy integration
- Mobile payments
- Instagram checkout
- Real-time analytics

**NCQ Value**:
- WordPress plugin
- Social commerce tools
- Mobile SDK
- Instant insights

#### 5.2.2 Fatima - Enterprise CFO
**Profile**:
- Age: 45
- Manages payments for retail chain
- Annual GMV: $100M
- Risk-focused

**Needs**:
- Reduced payment costs
- Fraud prevention
- Reconciliation tools
- Compliance support

**NCQ Value**:
- 50% cost savings
- AI fraud detection
- Automated reconciliation
- Full compliance

#### 5.2.3 Mohammed - Government Director
**Profile**:
- Age: 50
- Digital transformation lead
- Citizen services focus
- Security priority

**Needs**:
- Secure infrastructure
- SADAD integration
- Arabic interface
- Local support

**NCQ Value**:
- Bank-grade security
- Native SADAD
- Arabic-first design
- Local team

## 6. Revenue Model

### 6.1 Transaction-Based Pricing

#### 6.1.1 Merchant Discount Rate (MDR)
**Local Cards (MADA)**:
- Standard: 1.5%
- Enterprise: 1.2%
- Government: 1.0%
- Non-profit: 0.8%

**International Cards**:
- Standard: 2.5%
- Enterprise: 2.0%
- Premium cards: +0.5%

**Digital Wallets**:
- Apple Pay/STC Pay: 1.8%
- Bank wallets: 1.2%

#### 6.1.2 Fixed Fees
- Transaction fee: SAR 0.50
- Chargeback fee: SAR 50
- Refund fee: SAR 0
- Monthly minimum: SAR 0

### 6.2 Value-Added Services

#### 6.2.1 Premium Features
- **Fraud Protection Plus**: SAR 500/month
- **Advanced Analytics**: SAR 300/month
- **Multi-currency**: 2% FX markup
- **Recurring Billing**: SAR 200/month

#### 6.2.2 Enterprise Services
- **Dedicated Support**: SAR 5,000/month
- **Custom Integration**: SAR 50,000 one-time
- **White-label Solution**: Revenue share 20%
- **API Priority Access**: SAR 2,000/month

### 6.3 Revenue Projections

#### 6.3.1 Year 1 (2025)
- **Q1**: $1M (Getting started)
- **Q2**: $1.5M (MADA launch)
- **Q3**: $2.5M (Growth)
- **Q4**: $3M (Scale)
- **Total**: $8M

#### 6.3.2 Year 2 (2026)
- GMV growth: 400%
- Take rate: 1.75%
- VAS revenue: $5M
- **Total**: $35M

#### 6.3.3 Year 3 (2027)
- GMV: $8B
- Take rate: 1.5%
- VAS revenue: $20M
- **Total**: $120M

### 6.4 Unit Economics
- **Average Transaction Value**: SAR 250
- **Gross Margin**: 35%
- **CAC**: $500 per merchant
- **LTV**: $15,000 per merchant
- **Payback Period**: 4 months

## 7. Business Requirements

### 7.1 Core Business Requirements

#### 7.1.1 Payment Processing
**Requirement**: Process all Saudi payment methods
**Business Value**: Maximize conversion rates
**Success Criteria**: 
- MADA acceptance rate >95%
- SADAD integration complete
- International cards supported

#### 7.1.2 Merchant Experience
**Requirement**: Seamless onboarding and management
**Business Value**: Rapid adoption and retention
**Success Criteria**:
- 5-minute merchant signup
- Same-day activation
- Self-service portal

#### 7.1.3 Settlement Speed
**Requirement**: Same-day settlement for local transactions
**Business Value**: Improve merchant cash flow
**Success Criteria**:
- T+0 for MADA
- T+1 for international
- Real-time balance

### 7.2 Operational Requirements

#### 7.2.1 Compliance
**Requirement**: Full regulatory compliance
**Business Value**: Market access and trust
**Success Criteria**:
- SAMA PSP license
- PCI DSS Level 1
- ISO certifications

#### 7.2.2 Support
**Requirement**: 24/7 multilingual support
**Business Value**: Customer satisfaction
**Success Criteria**:
- <5 minute response
- Arabic/English support
- 95% satisfaction rate

#### 7.2.3 Reliability
**Requirement**: Enterprise-grade infrastructure
**Business Value**: Trust and dependability
**Success Criteria**:
- 99.99% uptime
- <200ms latency
- Zero data loss

### 7.3 Growth Requirements

#### 7.3.1 Scalability
**Requirement**: Handle exponential growth
**Business Value**: Capture market opportunity
**Success Criteria**:
- 10,000 TPS capacity
- Auto-scaling
- Global expansion ready

#### 7.3.2 Innovation
**Requirement**: Lead in payment innovation
**Business Value**: Competitive advantage
**Success Criteria**:
- AI fraud detection
- Instant payments
- Crypto readiness

## 8. Success Metrics

### 8.1 Financial Metrics
- **GMV Growth**: 300%+ annually
- **Revenue Growth**: 400%+ Year 2
- **Gross Margin**: 35%+
- **EBITDA Margin**: 20% by Year 3

### 8.2 Operational Metrics
- **Success Rate**: >95% for MADA
- **Settlement Time**: Same-day for 90%
- **Uptime**: 99.99%
- **API Response**: <100ms

### 8.3 Customer Metrics
- **Merchant NPS**: >70
- **Churn Rate**: <5% annually
- **Active Rate**: >80% monthly
- **Support CSAT**: >95%

### 8.4 Market Metrics
- **Market Share**: 5% by Year 3
- **GMV Processed**: $8B by Year 3
- **Merchant Count**: 15,000 active
- **Transaction Volume**: 100M annually

## 9. Risk Analysis

### 9.1 Market Risks

#### 9.1.1 Competition
**Risk**: Aggressive pricing by competitors
**Impact**: High
**Mitigation**:
- Superior technology
- Better service
- Local partnerships
- Value-added services

#### 9.1.2 Regulatory Changes
**Risk**: New compliance requirements
**Impact**: Medium
**Mitigation**:
- SAMA relationships
- Compliance buffer
- Agile adaptation
- Legal expertise

### 9.2 Operational Risks

#### 9.2.1 Technology
**Risk**: System outages or breaches
**Impact**: Critical
**Mitigation**:
- Redundant systems
- Security focus
- Incident response
- Cyber insurance

#### 9.2.2 Fraud
**Risk**: Large-scale fraud attacks
**Impact**: High
**Mitigation**:
- AI detection
- Real-time monitoring
- Fraud insurance
- Merchant education

### 9.3 Financial Risks

#### 9.3.1 Credit Risk
**Risk**: Merchant defaults on chargebacks
**Impact**: Medium
**Mitigation**:
- Rolling reserves
- Risk scoring
- Graduated limits
- Insurance coverage

#### 9.3.2 FX Risk
**Risk**: Currency fluctuation losses
**Impact**: Low
**Mitigation**:
- SAR focus
- Hedging strategy
- Real-time rates
- Markup buffer

## 10. Implementation Roadmap

### 10.1 Phase 1: Foundation (Q1 2025)
**Objectives**:
- Core platform launch
- Basic payment processing
- 100 pilot merchants
- SAMA license obtained

**Key Milestones**:
- Platform development complete
- Security certifications
- Bank partnerships signed
- Beta merchant onboarding

### 10.2 Phase 2: Local Leadership (Q2-Q3 2025)
**Objectives**:
- MADA certification
- SADAD integration
- 1,000 merchants
- AI fraud launch

**Key Milestones**:
- MADA go-live
- Fraud system operational
- Mobile SDKs released
- Enterprise clients signed

### 10.3 Phase 3: Scale & Expand (Q4 2025-Q2 2026)
**Objectives**:
- 5,000 merchants
- UAE market entry
- Open banking integration
- $2B GMV run rate

**Key Milestones**:
- UAE operations launch
- Instant settlement live
- Marketplace partnerships
- Series A funding

### 10.4 Phase 4: Regional Dominance (Q3 2026+)
**Objectives**:
- 15,000 merchants
- 5 country presence
- Market leadership
- IPO preparation

**Key Milestones**:
- $8B GMV achieved
- Profitability sustained
- Strategic acquisitions
- IPO readiness

### 10.5 Investment Requirements
- **Seed**: $5M (Platform development)
- **Series A**: $20M (Market expansion)
- **Series B**: $50M (Regional scale)
- **Total**: $75M to profitability

## Conclusion

NCQ Payment Gateway represents a transformative opportunity to revolutionize digital payments in Saudi Arabia and the broader MENA region. By addressing critical market gaps with innovative technology, competitive pricing, and exceptional local support, NCQ PGW is positioned to capture significant market share and drive the region's transition to a cashless economy.

The combination of favorable market dynamics, regulatory support, superior technology, and experienced team creates a compelling investment opportunity with potential for $120M+ in annual revenue within three years and a clear path to regional market leadership.