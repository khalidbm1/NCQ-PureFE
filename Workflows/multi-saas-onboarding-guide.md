# Multi-SaaS Platform Onboarding: Complete Implementation Guide (Multi-Tenant Architecture)

## Table of Contents
1. [Overview](#overview)
2. [Multi-Tenant Architecture Overview](#multi-tenant-architecture-overview)
3. [Business Process Framework](#business-process-framework)
4. [Technical Process Documentation](#technical-process-documentation)
5. [Developer Implementation Guide](#developer-implementation-guide)
6. [Architecture & Infrastructure](#architecture--infrastructure)
7. [Testing & Quality Assurance](#testing--quality-assurance)
8. [Deployment & Operations](#deployment--operations)

---

## Overview

For a company with a multi-tenant platform hosting multiple SaaS products, the onboarding process must handle both tenant-level and user-level onboarding. This involves introducing new organizations (tenants) to the platform, setting up their workspace, and then guiding individual users through both platform features and specific SaaS products they're authorized to use.

## Multi-Tenant Architecture Overview

### Tenant Isolation Strategies

1. **Database Level Isolation**
   - Separate database per tenant
   - Shared database with separate schemas
   - Shared schema with tenant ID (row-level security)

2. **Application Level Isolation**
   - Tenant-aware middleware
   - Request routing based on tenant context
   - Resource isolation and quotas

3. **Infrastructure Level Isolation**
   - Kubernetes namespaces per tenant
   - Network policies for traffic isolation
   - Resource limits and quotas

### Tenant Onboarding Flow

```mermaid
graph TB
    A[Tenant Registration] --> B[Workspace Setup]
    B --> C[Admin User Creation]
    C --> D[Product Selection]
    D --> E[Billing Configuration]
    E --> F[User Invitation]
    F --> G[Individual User Onboarding]
    G --> H[Product-Specific Onboarding]
```

---

## Business Process Framework

### 1. Tenant-Level Onboarding

#### Organization Registration
- **Purpose**: Register new organization/tenant on the platform
- **Implementation**: Tenant provisioning, workspace creation, subdomain setup
- **Considerations**: Data isolation, compliance requirements, regional data residency

#### Workspace Configuration
- **Purpose**: Set up tenant-specific configurations and branding
- **Implementation**: Custom domains, SSO integration, branding customization
- **Considerations**: White-labeling options, security policies, integration settings

#### Administrative Setup
- **Purpose**: Establish tenant administrators and governance
- **Implementation**: Admin role assignment, permission templates, audit configuration
- **Considerations**: Role hierarchy, approval workflows, compliance settings

### 2. Platform-Level Onboarding (Updated for Multi-Tenancy)

#### Initial Introduction
- **Purpose**: Welcome users to their tenant's workspace and explain available products
- **Implementation**: Tenant-aware welcome sequences, workspace tour, product catalog filtered by tenant subscriptions
- **Considerations**: Show only products licensed to the tenant

#### Navigation and Interface
- **Purpose**: Guide users through tenant-specific navigation and features
- **Implementation**: Workspace switcher for users with multiple tenants, tenant-branded UI
- **Considerations**: Maintain consistent UX across tenants while allowing customization

#### Account Management
- **Purpose**: Manage user profiles within tenant context
- **Implementation**: Tenant-scoped user management, SSO integration per tenant
- **Considerations**: Handle users belonging to multiple tenants

#### Security and Privacy
- **Purpose**: Ensure tenant data isolation and compliance
- **Implementation**: Tenant-specific security policies, data residency controls
- **Considerations**: Cross-tenant data access prevention, audit trails per tenant

### 3. Product-Specific Onboarding (Multi-Tenant Context)

#### Tenant-Aware Personalization
- **Purpose**: Customize onboarding based on tenant's industry and use case
- **Implementation**: Industry-specific templates, pre-configured workflows
- **Considerations**: Respect tenant data boundaries during personalization

#### Feature Access Control
- **Purpose**: Show features based on tenant's subscription level
- **Implementation**: Dynamic feature flags per tenant, usage-based limits
- **Considerations**: Graceful handling of feature restrictions

#### Collaborative Onboarding
- **Purpose**: Enable team-based onboarding within tenant
- **Implementation**: Shared progress tracking, team achievements, collaborative tours
- **Considerations**: Role-based onboarding paths within tenant

### Key Multi-Tenant Considerations

- **Data Isolation**: Ensure complete data separation between tenants
- **Performance**: Prevent one tenant from impacting others (noisy neighbor)
- **Scalability**: Handle tenants of vastly different sizes
- **Customization**: Balance standardization with tenant-specific needs
- **Compliance**: Meet different regulatory requirements per tenant
- **Billing**: Complex billing scenarios with multiple products and users

---

## Technical Process Documentation

### Multi-Tenant Architecture Components

#### 1. Tenant Management Service

**Business Objective:** Efficient tenant provisioning and management

**Technical Implementation:**
- **Tenant Registry**: Centralized database of all tenants with metadata
- **Provisioning Engine**: Automated workspace creation and resource allocation
- **Tenant Resolver**: Identify tenant context from request (subdomain, header, JWT)
- **Resource Quotas**: Enforce limits based on subscription tier

**Success Metrics:**
- Tenant provisioning time < 2 minutes
- Zero cross-tenant data leaks
- 99.9% tenant isolation guarantee

#### 2. Multi-Tenant Platform Onboarding

##### 2.1 Tenant Provisioning Workflow
**Technical Components:**
- **Orchestration Service**: Coordinate multi-step tenant setup
- **Database Provisioner**: Create tenant-specific schemas/databases
- **DNS Manager**: Configure custom domains and SSL certificates
- **Resource Allocator**: Set up Kubernetes namespaces and quotas

##### 2.2 User Management in Multi-Tenant Context
**Technical Components:**
- **Identity Provider Integration**: Support multiple IdPs per tenant
- **User-Tenant Mapping Service**: Handle users in multiple tenants
- **Permission Inheritance**: Cascade permissions from tenant to user level
- **Session Management**: Isolated sessions per tenant context

##### 2.3 Tenant-Aware Analytics
**Technical Components:**
- **Data Partitioning**: Separate analytics data by tenant
- **Aggregation Service**: Roll up metrics while maintaining isolation
- **Benchmarking Engine**: Compare tenant metrics (anonymized)
- **Usage Tracking**: Monitor resource consumption per tenant

### 3. Product-Specific Multi-Tenant Features

#### 3.1 Subscription Management
**Technical Implementation:**
- **Product Catalog Service**: Tenant-specific product availability
- **License Manager**: Track and enforce seat/usage limits
- **Feature Toggle Service**: Tenant-aware feature flags
- **Billing Integration**: Usage tracking and invoice generation

#### 3.2 Tenant-Specific Customization
**Technical Implementation:**
- **Theme Engine**: CSS variables and component overrides per tenant
- **Configuration Store**: Tenant-specific settings and preferences
- **Custom Field Manager**: Allow tenants to extend data models
- **Workflow Builder**: Tenant-specific automation rules

#### 3.3 Cross-Product Integration
**Technical Implementation:**
- **Tenant Context Propagation**: Maintain context across products
- **Shared Data Layer**: Consistent data access across products
- **Event Bus**: Tenant-scoped event distribution
- **API Gateway**: Route requests to appropriate product instances

### 4. Infrastructure Considerations

#### 4.1 Database Architecture
- **Strategy**: Hybrid approach - shared database with tenant schemas
- **Connection Pooling**: Per-tenant connection pools
- **Query Routing**: Automatic tenant context injection
- **Backup Strategy**: Tenant-specific backup and restore

#### 4.2 Caching Strategy
- **Cache Key Namespacing**: Include tenant ID in all cache keys
- **Cache Invalidation**: Tenant-aware cache clearing
- **Distributed Cache**: Redis cluster with tenant segregation
- **Cache Warming**: Pre-load frequently accessed tenant data

#### 4.3 Security Architecture
- **API Authentication**: JWT with tenant claims
- **Row-Level Security**: Database-level tenant isolation
- **Network Segmentation**: Tenant-specific VLANs/subnets
- **Encryption**: Per-tenant encryption keys

---

## Developer Implementation Guide

### Multi-Tenant Architecture Overview

```mermaid
graph TB
    A[API Gateway] --> B[Tenant Resolver]
    B --> C[Authentication Service]
    C --> D[Authorization Service]
    D --> E[Product Services]
    
    B --> F[Tenant Context]
    F --> G[Database Router]
    F --> H[Cache Manager]
    F --> I[Event Bus]
    
    E --> J[Tenant DB 1]
    E --> K[Tenant DB 2]
    E --> L[Shared DB with RLS]
```

### 1. Tenant Management Implementation

#### 1.1 Tenant Registration & Provisioning

```typescript
// Tenant provisioning service
interface TenantConfig {
  name: string;
  subdomain: string;
  region: string;
  tier: 'starter' | 'professional' | 'enterprise';
  products: string[];
  adminEmail: string;
}

class TenantProvisioningService {
  async provisionTenant(config: TenantConfig): Promise<Tenant> {
    // Start transaction
    const transaction = await this.db.beginTransaction();
    
    try {
      // 1. Create tenant record
      const tenant = await this.createTenantRecord(config, transaction);
      
      // 2. Set up database schema
      await this.databaseProvisioner.createTenantSchema(tenant.id);
      
      // 3. Configure DNS
      await this.dnsManager.configureTenantDomain(tenant.subdomain);
      
      // 4. Set up Kubernetes namespace
      await this.k8sManager.createTenantNamespace(tenant);
      
      // 5. Initialize product instances
      for (const productId of config.products) {
        await this.productManager.initializeForTenant(tenant.id, productId);
      }
      
      // 6. Create admin user
      const adminUser = await this.createAdminUser(
        tenant.id, 
        config.adminEmail,
        transaction
      );
      
      // 7. Send welcome email
      await this.emailService.sendTenantWelcome(tenant, adminUser);
      
      await transaction.commit();
      
      // Emit tenant created event
      await this.eventBus.emit('tenant.created', { 
        tenantId: tenant.id,
        tier: config.tier,
        products: config.products
      });
      
      return tenant;
    } catch (error) {
      await transaction.rollback();
      await this.rollbackProvisioningSteps(config);
      throw error;
    }
  }
  
  private async createTenantRecord(
    config: TenantConfig, 
    transaction: Transaction
  ): Promise<Tenant> {
    return await this.tenantRepository.create({
      id: generateTenantId(),
      name: config.name,
      subdomain: config.subdomain,
      region: config.region,
      tier: config.tier,
      status: 'provisioning',
      settings: {
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        language: 'en'
      },
      metadata: {
        createdAt: new Date(),
        products: config.products,
        seats: this.getSeatsByTier(config.tier),
        storageQuota: this.getStorageByTier(config.tier)
      }
    }, transaction);
  }
}
```

#### 1.2 Tenant Context Middleware

```javascript
// Express middleware for tenant resolution
class TenantContextMiddleware {
  async resolve(req, res, next) {
    try {
      // Multiple strategies for tenant resolution
      let tenantId = null;
      
      // 1. Subdomain extraction
      const subdomain = this.extractSubdomain(req.hostname);
      if (subdomain) {
        tenantId = await this.tenantService.getIdBySubdomain(subdomain);
      }
      
      // 2. JWT token claim
      if (!tenantId && req.user) {
        tenantId = req.user.tenantId;
      }
      
      // 3. Header-based (for API clients)
      if (!tenantId && req.headers['x-tenant-id']) {
        tenantId = req.headers['x-tenant-id'];
      }
      
      // 4. Query parameter (for specific cases)
      if (!tenantId && req.query.tenantId) {
        tenantId = req.query.tenantId;
      }
      
      if (!tenantId) {
        return res.status(400).json({ 
          error: 'Tenant context could not be resolved' 
        });
      }
      
      // Verify tenant exists and is active
      const tenant = await this.tenantService.getTenant(tenantId);
      if (!tenant || tenant.status !== 'active') {
        return res.status(404).json({ 
          error: 'Tenant not found or inactive' 
        });
      }
      
      // Set tenant context
      req.tenant = tenant;
      req.tenantId = tenant.id;
      
      // Configure tenant-specific settings
      await this.configureTenantContext(req, tenant);
      
      next();
    } catch (error) {
      next(error);
    }
  }
  
  private async configureTenantContext(req, tenant) {
    // Set database connection to use tenant schema
    req.db = await this.dbManager.getTenantConnection(tenant.id);
    
    // Configure cache namespace
    req.cache = this.cacheManager.getTenantCache(tenant.id);
    
    // Set feature flags
    req.features = await this.featureService.getFeaturesForTenant(tenant);
    
    // Configure rate limits based on tier
    req.rateLimit = this.getRateLimitConfig(tenant.tier);
  }
}
```

#### 1.3 Multi-Tenant Database Access Layer

```python
# SQLAlchemy implementation for multi-tenant database access
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool
from contextlib import contextmanager

class MultiTenantDatabaseManager:
    def __init__(self, base_connection_string):
        self.base_connection_string = base_connection_string
        self.engines = {}
        self.sessions = {}
        
    @contextmanager
    def get_tenant_session(self, tenant_id: str):
        """Get a database session for a specific tenant"""
        session = self._create_tenant_session(tenant_id)
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
    
    def _create_tenant_session(self, tenant_id: str) -> Session:
        if tenant_id not in self.engines:
            # Create engine with tenant-specific schema
            engine = create_engine(
                self.base_connection_string,
                poolclass=NullPool,  # Don't pool connections
                connect_args={
                    "options": f"-csearch_path=tenant_{tenant_id},public"
                }
            )
            
            # Add row-level security
            @event.listens_for(engine, "connect")
            def set_rls(dbapi_connection, connection_record):
                with dbapi_connection.cursor() as cursor:
                    cursor.execute(f"SET app.tenant_id = '{tenant_id}'")
            
            self.engines[tenant_id] = engine
            self.sessions[tenant_id] = sessionmaker(bind=engine)
        
        return self.sessions[tenant_id]()
    
    async def create_tenant_schema(self, tenant_id: str):
        """Create a new schema for a tenant"""
        async with self.get_admin_connection() as conn:
            await conn.execute(f"""
                CREATE SCHEMA IF NOT EXISTS tenant_{tenant_id};
                
                -- Create tables in tenant schema
                SET search_path TO tenant_{tenant_id};
                
                -- Copy table structure from template
                CREATE TABLE users (LIKE public.users_template INCLUDING ALL);
                CREATE TABLE products (LIKE public.products_template INCLUDING ALL);
                CREATE TABLE onboarding_progress (LIKE public.onboarding_template INCLUDING ALL);
                
                -- Set up RLS policies
                ALTER TABLE users ENABLE ROW LEVEL SECURITY;
                ALTER TABLE products ENABLE ROW LEVEL SECURITY;
                
                CREATE POLICY tenant_isolation ON users
                    FOR ALL TO application_role
                    USING (tenant_id = current_setting('app.tenant_id')::uuid);
            """)
```

### 2. Tenant-Aware User Onboarding

#### 2.1 User Registration with Tenant Context

```typescript
// User service with multi-tenant support
class MultiTenantUserService {
  async registerUser(
    tenantId: string, 
    userData: UserRegistrationDto,
    inviteToken?: string
  ): Promise<User> {
    const tenant = await this.tenantService.getTenant(tenantId);
    
    // Validate against tenant limits
    const userCount = await this.getUserCount(tenantId);
    if (userCount >= tenant.metadata.seats) {
      throw new Error('Tenant seat limit exceeded');
    }
    
    // Check if user exists in other tenants
    const existingUser = await this.findUserByEmail(userData.email);
    
    let user: User;
    
    if (existingUser) {
      // Add user to new tenant
      user = await this.addUserToTenant(existingUser, tenantId);
    } else {
      // Create new user
      user = await this.createUser({
        ...userData,
        tenantMemberships: [{
          tenantId,
          role: inviteToken ? 'member' : 'admin',
          joinedAt: new Date()
        }]
      });
    }
    
    // Initialize user's onboarding for this tenant
    await this.onboardingService.initializeUserOnboarding({
      userId: user.id,
      tenantId: tenantId,
      products: tenant.metadata.products,
      userRole: user.tenantMemberships.find(m => m.tenantId === tenantId)?.role
    });
    
    // Send appropriate welcome email
    if (existingUser) {
      await this.emailService.sendAddedToTenantEmail(user, tenant);
    } else {
      await this.emailService.sendWelcomeEmail(user, tenant);
    }
    
    return user;
  }
  
  async switchTenant(userId: string, targetTenantId: string): Promise<void> {
    // Verify user has access to target tenant
    const membership = await this.getTenantMembership(userId, targetTenantId);
    if (!membership) {
      throw new UnauthorizedError('User does not have access to this tenant');
    }
    
    // Update user's active tenant
    await this.updateActiveContext(userId, targetTenantId);
    
    // Clear user-specific cache
    await this.cacheService.clearUserCache(userId);
    
    // Emit context switch event
    await this.eventBus.emit('user.tenant.switched', {
      userId,
      fromTenantId: membership.lastActiveTenantId,
      toTenantId: targetTenantId
    });
  }
}
```

#### 2.2 Tenant-Specific Onboarding Flows

```javascript
// Onboarding service with tenant customization
class TenantAwareOnboardingService {
  async getOnboardingFlow(userId, tenantId) {
    const tenant = await this.tenantService.getTenant(tenantId);
    const user = await this.userService.getUser(userId);
    const userRole = this.getUserRoleInTenant(user, tenantId);
    
    // Get base onboarding flow
    let flow = await this.getBaseFlow(userRole);
    
    // Apply tenant customizations
    flow = await this.applyTenantCustomizations(flow, tenant);
    
    // Apply product-specific steps
    flow = await this.addProductSteps(flow, tenant.metadata.products);
    
    // Apply industry-specific modifications
    if (tenant.industry) {
      flow = await this.applyIndustryTemplate(flow, tenant.industry);
    }
    
    return flow;
  }
  
  async applyTenantCustomizations(flow, tenant) {
    const customizations = await this.getCustomizations(tenant.id);
    
    return {
      ...flow,
      steps: flow.steps.map(step => {
        const customStep = customizations.steps[step.id];
        if (customStep) {
          return {
            ...step,
            ...customStep,
            content: this.mergeTenantContent(step.content, customStep.content)
          };
        }
        return step;
      }),
      branding: {
        logo: tenant.branding?.logo || flow.branding.logo,
        primaryColor: tenant.branding?.primaryColor || flow.branding.primaryColor,
        fonts: tenant.branding?.fonts || flow.branding.fonts
      }
    };
  }
  
  async trackProgress(userId, tenantId, stepId, eventData) {
    // Store progress in tenant-specific table
    await this.db.withTenant(tenantId).create('onboarding_progress', {
      userId,
      stepId,
      completedAt: new Date(),
      eventData
    });
    
    // Update aggregated metrics
    await this.metricsService.increment(
      `onboarding.step_completed`,
      1,
      {
        tenant_id: tenantId,
        tenant_tier: eventData.tenantTier,
        step_id: stepId,
        user_role: eventData.userRole
      }
    );
    
    // Check for milestone completion
    await this.checkMilestones(userId, tenantId);
  }
}
```

### 3. Multi-Tenant Product Access

#### 3.1 Product Authorization

```python
# Product access control for multi-tenant environment
from functools import wraps
from flask import g, abort

class ProductAuthorizationService:
    def __init__(self, tenant_service, product_service):
        self.tenant_service = tenant_service
        self.product_service = product_service
    
    def require_product_access(self, product_id):
        """Decorator to check if tenant has access to product"""
        def decorator(f):
            @wraps(f)
            async def decorated_function(*args, **kwargs):
                tenant_id = g.tenant_id
                user_id = g.user_id
                
                # Check tenant subscription
                if not await self.tenant_has_product(tenant_id, product_id):
                    abort(403, f"Tenant does not have access to product {product_id}")
                
                # Check user permissions within tenant
                if not await self.user_can_access_product(user_id, tenant_id, product_id):
                    abort(403, f"User does not have permission for product {product_id}")
                
                # Set product context
                g.product_context = await self.get_product_context(
                    tenant_id, 
                    product_id
                )
                
                return await f(*args, **kwargs)
            
            return decorated_function
        return decorator
    
    async def get_product_context(self, tenant_id: str, product_id: str):
        """Get tenant-specific product configuration"""
        base_config = await self.product_service.get_config(product_id)
        tenant_config = await self.get_tenant_product_config(tenant_id, product_id)
        
        return {
            **base_config,
            **tenant_config,
            'limits': await self.get_tenant_limits(tenant_id, product_id),
            'features': await self.get_enabled_features(tenant_id, product_id)
        }
```

### 4. Tenant-Aware Infrastructure

#### 4.1 Kubernetes Multi-Tenant Setup

```yaml
# Tenant namespace template
apiVersion: v1
kind: Namespace
metadata:
  name: tenant-${TENANT_ID}
  labels:
    tenant-id: ${TENANT_ID}
    tenant-tier: ${TENANT_TIER}
---
# Resource quota based on tier
apiVersion: v1
kind: ResourceQuota
metadata:
  name: tenant-quota
  namespace: tenant-${TENANT_ID}
spec:
  hard:
    requests.cpu: ${CPU_QUOTA}
    requests.memory: ${MEMORY_QUOTA}
    persistentvolumeclaims: ${PVC_QUOTA}
    services: ${SERVICE_QUOTA}
---
# Network policy for tenant isolation
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-isolation
  namespace: tenant-${TENANT_ID}
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: platform-core
    - namespaceSelector:
        matchLabels:
          tenant-id: ${TENANT_ID}
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: platform-core
    - namespaceSelector:
        matchLabels:
          tenant-id: ${TENANT_ID}
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443  # Allow HTTPS external
```

#### 4.2 Tenant-Aware Caching

```javascript
// Redis caching with tenant isolation
class TenantCacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.TTL = {
      user: 3600,        // 1 hour
      config: 86400,     // 24 hours
      temporary: 300     // 5 minutes
    };
  }
  
  // Generate tenant-namespaced cache key
  getCacheKey(tenantId, resource, identifier) {
    return `tenant:${tenantId}:${resource}:${identifier}`;
  }
  
  async get(tenantId, resource, identifier) {
    const key = this.getCacheKey(tenantId, resource, identifier);
    const data = await this.redis.get(key);
    
    if (data) {
      // Track cache hit metrics per tenant
      await this.metrics.increment('cache.hit', 1, {
        tenant_id: tenantId,
        resource: resource
      });
      
      return JSON.parse(data);
    }
    
    await this.metrics.increment('cache.miss', 1, {
      tenant_id: tenantId,
      resource: resource
    });
    
    return null;
  }
  
  async set(tenantId, resource, identifier, data, ttl = null) {
    const key = this.getCacheKey(tenantId, resource, identifier);
    const serialized = JSON.stringify(data);
    
    // Check tenant cache quota
    const usage = await this.getTenantCacheUsage(tenantId);
    const quota = await this.getTenantCacheQuota(tenantId);
    
    if (usage + serialized.length > quota) {
      // Evict oldest entries for this tenant
      await this.evictTenantCache(tenantId, serialized.length);
    }
    
    const expiry = ttl || this.TTL[resource] || this.TTL.temporary;
    await this.redis.setex(key, expiry, serialized);
    
    // Track cache size per tenant
    await this.trackCacheUsage(tenantId, serialized.length);
  }
  
  async invalidateTenant(tenantId) {
    // Get all keys for tenant
    const pattern = `tenant:${tenantId}:*`;
    const keys = await this.redis.keys(pattern);
    
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    
    // Reset usage tracking
    await this.resetCacheUsage(tenantId);
  }
}
```

### 5. Multi-Tenant Analytics & Monitoring

#### 5.1 Tenant-Isolated Analytics

```typescript
// Analytics service with tenant data isolation
class MultiTenantAnalyticsService {
  async trackEvent(
    tenantId: string,
    userId: string,
    eventName: string,
    properties: Record<string, any>
  ) {
    const tenant = await this.tenantService.getTenant(tenantId);
    
    // Enrich event with tenant context
    const enrichedEvent = {
      event_name: eventName,
      tenant_id: tenantId,
      tenant_tier: tenant.tier,
      user_id: userId,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        tenant_name: tenant.name,
        tenant_region: tenant.region,
        tenant_products: tenant.metadata.products
      }
    };
    
    // Store in tenant-partitioned table
    await this.clickhouse.insert(
      `analytics_tenant_${tenantId}`,
      enrichedEvent
    );
    
    // Also store in aggregated table for platform analytics
    await this.clickhouse.insert(
      'analytics_platform',
      {
        ...enrichedEvent,
        tenant_name_hash: this.hashTenantName(tenant.name) // Privacy
      }
    );
  }
  
  async getTenantMetrics(tenantId: string, dateRange: DateRange) {
    // Ensure user can only query their tenant's data
    const query = `
      SELECT 
        toStartOfDay(timestamp) as date,
        count(DISTINCT user_id) as daily_active_users,
        count(*) as total_events,
        countIf(event_name = 'onboarding_completed') as onboarding_completions,
        avgIf(
          properties['duration'], 
          event_name = 'session_end'
        ) as avg_session_duration
      FROM analytics_tenant_${tenantId}
      WHERE timestamp BETWEEN ? AND ?
      GROUP BY date
      ORDER BY date DESC
    `;
    
    return await this.clickhouse.query(query, [
      dateRange.start,
      dateRange.end
    ]);
  }
  
  async getPlatformMetrics(dateRange: DateRange) {
    // Aggregated metrics across all tenants
    const query = `
      SELECT 
        tenant_tier,
        count(DISTINCT tenant_id) as active_tenants,
        count(DISTINCT user_id) as total_users,
        sum(total_events) as total_events,
        avg(daily_active_users) as avg_dau_per_tenant
      FROM (
        SELECT 
          tenant_id,
          tenant_tier,
          toStartOfDay(timestamp) as date,
          count(DISTINCT user_id) as daily_active_users,
          count(*) as total_events
        FROM analytics_platform
        WHERE timestamp BETWEEN ? AND ?
        GROUP BY tenant_id, tenant_tier, date
      )
      GROUP BY tenant_tier
    `;
    
    return await this.clickhouse.query(query, [
      dateRange.start,
      dateRange.end
    ]);
  }
}
```

#### 5.2 Tenant Performance Monitoring

```javascript
// Prometheus metrics with tenant labels
import { Counter, Histogram, Gauge, register } from 'prom-client';

class TenantMetricsCollector {
  constructor() {
    // API metrics per tenant
    this.apiRequests = new Counter({
      name: 'api_requests_total',
      help: 'Total API requests',
      labelNames: ['tenant_id', 'tenant_tier', 'product_id', 'endpoint', 'method', 'status']
    });
    
    this.apiDuration = new Histogram({
      name: 'api_request_duration_seconds',
      help: 'API request duration',
      labelNames: ['tenant_id', 'tenant_tier', 'product_id', 'endpoint'],
      buckets: [0.1, 0.5, 1, 2, 5]
    });
    
    // Resource usage per tenant
    this.storageUsage = new Gauge({
      name: 'tenant_storage_bytes',
      help: 'Storage usage per tenant',
      labelNames: ['tenant_id', 'tenant_tier', 'storage_type']
    });
    
    this.activeUsers = new Gauge({
      name: 'tenant_active_users',
      help: 'Active users per tenant',
      labelNames: ['tenant_id', 'tenant_tier']
    });
    
    // Onboarding metrics
    this.onboardingFunnel = new Gauge({
      name: 'onboarding_funnel_conversion',
      help: 'Onboarding funnel conversion rates',
      labelNames: ['tenant_id', 'tenant_tier', 'step', 'product_id']
    });
  }
  
  trackApiRequest(req, res, duration) {
    const labels = {
      tenant_id: req.tenantId,
      tenant_tier: req.tenant?.tier || 'unknown',
      product_id: req.productId || 'platform',
      endpoint: req.route?.path || req.path,
      method: req.method,
      status: res.statusCode
    };
    
    this.apiRequests.inc(labels);
    this.apiDuration.observe(
      { ...labels, status: undefined },
      duration / 1000
    );
  }
  
  async updateTenantMetrics() {
    // Run periodically to update gauge metrics
    const tenants = await this.tenantService.getAllActiveTenants();
    
    for (const tenant of tenants) {
      // Update storage usage
      const storage = await this.storageService.getTenantUsage(tenant.id);
      this.storageUsage.set(
        {
          tenant_id: tenant.id,
          tenant_tier: tenant.tier,
          storage_type: 'database'
        },
        storage.database
      );
      
      // Update active users
      const activeUsers = await this.userService.getActiveUserCount(
        tenant.id,
        '24h'
      );
      this.activeUsers.set(
        {
          tenant_id: tenant.id,
          tenant_tier: tenant.tier
        },
        activeUsers
      );
      
      // Update onboarding funnel
      const funnelData = await this.onboardingService.getFunnelMetrics(
        tenant.id
      );
      for (const step of funnelData) {
        this.onboardingFunnel.set(
          {
            tenant_id: tenant.id,
            tenant_tier: tenant.tier,
            step: step.name,
            product_id: step.productId
          },
          step.conversionRate
        );
      }
    }
  }
}
```

---

## Architecture & Infrastructure

### 1. Multi-Tenant Database Schema

```sql
-- Core platform schema (shared)
CREATE SCHEMA IF NOT EXISTS platform;

-- Tenant registry
CREATE TABLE platform.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'provisioning',
    tier VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    suspended_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- User table with multi-tenant support
CREATE TABLE platform.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_provider VARCHAR(50) DEFAULT 'local',
    auth_provider_id VARCHAR(255),
    profile JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User-tenant relationships
CREATE TABLE platform.tenant_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES platform.users(id),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP,
    settings JSONB DEFAULT '{}',
    UNIQUE(user_id, tenant_id)
);

-- Product subscriptions per tenant
CREATE TABLE platform.tenant_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES platform.tenants(id),
    product_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    tier VARCHAR(50),
    seats INTEGER,
    usage_limit JSONB,
    custom_config JSONB DEFAULT '{}',
    subscribed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,
    UNIQUE(tenant_id, product_id)
);

-- Template for tenant-specific schemas
CREATE SCHEMA IF NOT EXISTS tenant_template;

-- Tenant-specific onboarding progress
CREATE TABLE tenant_template.onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id VARCHAR(100),
    current_step VARCHAR(100),
    completed_steps JSONB DEFAULT '[]',
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Tenant-specific analytics events
CREATE TABLE tenant_template.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_properties JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tenants_subdomain ON platform.tenants(subdomain);
CREATE INDEX idx_tenants_status ON platform.tenants(status);
CREATE INDEX idx_memberships_user_tenant ON platform.tenant_memberships(user_id, tenant_id);
CREATE INDEX idx_memberships_tenant_status ON platform.tenant_memberships(tenant_id, status);
CREATE INDEX idx_tenant_products_tenant ON platform.tenant_products(tenant_id, status);

-- Row Level Security policies
ALTER TABLE tenant_template.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_template.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS policy for tenant isolation
CREATE POLICY tenant_isolation ON tenant_template.onboarding_progress
    FOR ALL TO application_role
    USING (current_setting('app.tenant_id')::uuid = tenant_id);
```

### 2. Multi-Tenant Docker Compose

```yaml
# docker-compose.yml for multi-tenant development
version: '3.8'

services:
  # PostgreSQL with multiple databases
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: platform_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_MULTIPLE_DATABASES: platform,tenant_template
    volumes:
      - ./scripts/create-multiple-dbs.sh:/docker-entrypoint-initdb.d/create-multiple-dbs.sh
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis with keyspace separation
  redis:
    image: redis:7-alpine
    command: >
      redis-server
      --appendonly yes
      --maxmemory 2gb
      --maxmemory-policy allkeys-lru
      --rename-command FLUSHDB ""
      --rename-command FLUSHALL ""
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"

  # Keycloak for multi-tenant SSO
  keycloak:
    image: quay.io/keycloak/keycloak:22.0
    environment:
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: ${KEYCLOAK_DB_PASSWORD}
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_ADMIN_PASSWORD}
      KC_FEATURES: multi-site
    depends_on:
      - postgres
    ports:
      - "8080:8080"

  # API Gateway with tenant routing
  kong:
    image: kong:3.4
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_DATABASE: kong
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: ${KONG_DB_PASSWORD}
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
    depends_on:
      - postgres
    ports:
      - "8000:8000"  # Proxy
      - "8443:8443"  # Proxy SSL
      - "8001:8001"  # Admin API

  # Tenant provisioning service
  tenant-service:
    build:
      context: ./services/tenant-service
      dockerfile: Dockerfile
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://platform_admin:${DB_PASSWORD}@postgres:5432/platform
      REDIS_URL: redis://redis:6379
      KUBERNETES_SERVICE_HOST: kubernetes
      KEYCLOAK_URL: http://keycloak:8080
    depends_on:
      - postgres
      - redis
      - keycloak
    ports:
      - "3001:3000"

  # Platform onboarding service
  onboarding-service:
    build:
      context: ./services/onboarding-service
      dockerfile: Dockerfile
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://platform_admin:${DB_PASSWORD}@postgres:5432/platform
      REDIS_URL: redis://redis:6379
      ANALYTICS_URL: http://clickhouse:8123
    depends_on:
      - postgres
      - redis
      - clickhouse
    ports:
      - "3002:3000"

  # ClickHouse for analytics
  clickhouse:
    image: clickhouse/clickhouse-server:23.8
    environment:
      CLICKHOUSE_USER: analytics
      CLICKHOUSE_PASSWORD: ${CLICKHOUSE_PASSWORD}
      CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT: 1
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - ./config/clickhouse/tenant-analytics.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "8123:8123"
      - "9000:9000"

  # Grafana for monitoring
  grafana:
    image: grafana/grafana:10.1.0
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_USERS_ALLOW_SIGN_UP: false
      GF_AUTH_GENERIC_OAUTH_ENABLED: true
    volumes:
      - grafana-data:/var/lib/grafana
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./config/grafana/datasources:/etc/grafana/provisioning/datasources
    ports:
      - "3000:3000"

  # Prometheus for metrics
  prometheus:
    image: prom/prometheus:v2.47.0
    volumes:
      - ./config/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - "9090:9090"

volumes:
  postgres-data:
  redis-data:
  clickhouse-data:
  grafana-data:
  prometheus-data:
```

### 3. Kubernetes Multi-Tenant Configuration

```yaml
# Tenant provisioning job template
apiVersion: batch/v1
kind: Job
metadata:
  name: provision-tenant-${TENANT_ID}
  namespace: platform-core
spec:
  template:
    spec:
      serviceAccountName: tenant-provisioner
      containers:
      - name: provisioner
        image: platform/tenant-provisioner:latest
        env:
        - name: TENANT_ID
          value: "${TENANT_ID}"
        - name: TENANT_TIER
          value: "${TENANT_TIER}"
        - name: TENANT_REGION
          value: "${TENANT_REGION}"
        command:
        - /bin/sh
        - -c
        - |
          # Create namespace
          kubectl create namespace tenant-${TENANT_ID}
          
          # Apply resource quotas based on tier
          kubectl apply -f - <<EOF
          apiVersion: v1
          kind: ResourceQuota
          metadata:
            name: tenant-quota
            namespace: tenant-${TENANT_ID}
          spec:
            hard:
              requests.cpu: "${CPU_QUOTA}"
              requests.memory: "${MEMORY_QUOTA}"
              persistentvolumeclaims: "${PVC_QUOTA}"
          EOF
          
          # Create database schema