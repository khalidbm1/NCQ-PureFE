# Refactoring Guide for New Platform Structure

## Overview

With the reorganization into Core Technologies, Products, and Shared Services, existing products need refactoring to:
1. Use shared services instead of duplicating functionality
2. Integrate with core technologies
3. Follow consistent patterns and standards
4. Support multi-tenancy

## Refactoring Requirements by Product

### 1. Hospital Management
**Current State**: Standalone implementation with own auth, payments, etc.

**Required Changes**:
- **Authentication**: Replace custom auth with NCQ Platform auth service
- **Payments**: Integrate NCQ PGW instead of direct Stripe integration
- **Notifications**: Use shared notification service
- **Database**: Migrate to shared PostgreSQL cluster with tenant isolation
- **Blockchain**: Integrate with Core Blockchain for patient records
- **IoT**: Connect to Core IoT Platform for patient monitoring devices

**Effort**: 2-3 weeks with 2 developers

### 2. NCQ LLM
**Current State**: Has demo auth, basic payment integration

**Required Changes**:
- **Authentication**: Update to use NCQ Platform SSO
- **Multi-tenancy**: Add tenant isolation for models and data
- **Payments**: Full NCQ PGW integration for usage-based billing
- **Analytics**: Connect to shared analytics service
- **File Storage**: Use shared file storage for training data

**Effort**: 2 weeks with 2 developers

### 3. NCQ PGW
**Current State**: Standalone payment gateway

**Required Changes**:
- **Dual Mode**: Support both standalone and embedded modes
- **SDK Updates**: Create shared SDK in Shared Services
- **Authentication**: When embedded, use platform auth
- **Multi-tenancy**: Add merchant isolation
- **Analytics**: Report to central analytics

**Effort**: 3 weeks with 3 developers

### 4. NCQ Mobile App
**Current State**: Basic mobile app

**Required Changes**:
- **API Gateway**: Route all calls through NCQ Platform API Gateway
- **Authentication**: Use platform OAuth2 with mobile flow
- **Push Notifications**: Integrate with shared notification service
- **Offline Sync**: Add offline capabilities with sync

**Effort**: 2 weeks with 2 developers

### 5. Smart Hospitality (New)
**Current State**: Just created, no refactoring needed

**Built from scratch with**:
- Shared services integration
- Core IoT Platform integration
- NCQ PGW embedded
- Platform authentication

**Effort**: N/A - Built correctly from start

## Common Refactoring Tasks

### 1. Authentication Migration
```typescript
// OLD: Direct JWT implementation
import { generateToken } from './auth';

// NEW: Platform auth service
import { NCQAuth } from '@ncq/platform-sdk';
const auth = new NCQAuth({
  serviceId: 'hospital-management',
  apiKey: process.env.NCQ_SERVICE_KEY
});
```

### 2. Payment Integration
```typescript
// OLD: Direct Stripe
import Stripe from 'stripe';
const stripe = new Stripe(key);

// NEW: NCQ PGW
import { NCQPaymentClient } from '@ncq/payment-sdk';
const payment = new NCQPaymentClient({
  apiKey: process.env.NCQ_PGW_KEY,
  productId: 'hospital-management'
});
```

### 3. Database Multi-tenancy
```sql
-- OLD: Single tenant tables
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  name VARCHAR(255)
);

-- NEW: Multi-tenant tables
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON patients
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### 4. API Gateway Integration
```yaml
# Kong route configuration
services:
  - name: hospital-management
    url: http://hospital-service:5001
    routes:
      - name: hospital-api
        paths:
          - /api/hospital
        strip_path: true
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 100
      - name: correlation-id
```

### 5. Service Discovery
```typescript
// OLD: Hardcoded URLs
const authUrl = 'http://localhost:8001';

// NEW: Service discovery
import { ServiceRegistry } from '@ncq/platform-sdk';
const authUrl = await ServiceRegistry.getService('auth-service');
```

## Refactoring Timeline

### Week 1-2: Foundation
- Set up shared SDKs
- Create migration scripts
- Update documentation
- Set up testing environments

### Week 3-4: Core Services
- Migrate authentication
- Integrate payments
- Connect notifications
- Update databases for multi-tenancy

### Week 5-6: Product-Specific
- Hospital Management blockchain integration
- NCQ LLM multi-tenant isolation
- Mobile app offline sync
- NCQ PGW dual-mode support

### Week 7-8: Testing & Deployment
- Integration testing
- Performance testing
- Security audit
- Staged rollout

## Migration Checklist

### Per Product Checklist:
- [ ] Update authentication to platform auth
- [ ] Integrate payment SDK
- [ ] Add tenant isolation
- [ ] Connect to notification service
- [ ] Use shared file storage
- [ ] Integrate with analytics
- [ ] Update API to use gateway
- [ ] Add service discovery
- [ ] Update configuration management
- [ ] Implement health checks
- [ ] Add distributed tracing
- [ ] Update documentation
- [ ] Create migration scripts
- [ ] Test in staging
- [ ] Plan rollout strategy

## Benefits After Refactoring

1. **Reduced Maintenance**: No duplicate auth/payment code
2. **Consistent Experience**: Same login across all products
3. **Centralized Billing**: One invoice for all services
4. **Better Analytics**: Unified view of platform usage
5. **Improved Security**: Central security policies
6. **Easier Scaling**: Shared infrastructure
7. **Faster Development**: Reuse shared services

## Risk Mitigation

### Data Migration
- Create rollback scripts
- Test with subset first
- Keep old system running in parallel

### Service Dependencies
- Implement circuit breakers
- Add fallback mechanisms
- Monitor service health

### User Experience
- Maintain backward compatibility
- Gradual feature migration
- Clear communication

## Success Criteria

- Zero data loss during migration
- No increase in response times
- All features remain functional
- Successful integration tests
- Positive user feedback
- Reduced operational costs