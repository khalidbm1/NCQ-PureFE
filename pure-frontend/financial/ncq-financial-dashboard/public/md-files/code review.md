Based on the architecture blueprint, here's a comprehensive technical implementation guide with specific details:

## Core Infrastructure Architecture

### AWS Foundation Setup

**Account Structure:**
```
Root Organization
├── Security Account (SSO, GuardDuty, CloudTrail)
├── Network Hub Account (Transit Gateway, Direct Connect)
├── Shared Services Account (CI/CD, Container Registry)
└── Production Accounts (per deployment stamp)
    ├── Stamp-001 (Tenants 1-100)
    ├── Stamp-002 (Tenants 101-200)
    └── ... (up to 10-15 stamps)
```

**VPC Architecture per Stamp:**
```yaml
# terraform/modules/vpc/main.tf
resource "aws_vpc" "stamp" {
  cidr_block           = "10.${var.stamp_id}.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "stamp-${var.stamp_id}-vpc"
    Stamp = var.stamp_id
  }
}

# Subnet allocation:
# Public:  10.X.0.0/20   (4096 IPs)
# Private: 10.X.16.0/20  (4096 IPs per AZ)
# Data:    10.X.64.0/20  (RDS/ElastiCache)
# Reserved: 10.X.128.0/17 (Future expansion)
```

### Kubernetes (EKS) Configuration

**Cluster Setup:**
```yaml
# eks-cluster-config.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: saas-platform-stamp-001
  region: us-east-1
  version: "1.28"

nodeGroups:
  - name: system-nodes
    instanceType: m6i.2xlarge
    minSize: 3
    maxSize: 10
    volumeSize: 100
    volumeType: gp3
    labels:
      workload-type: system
    taints:
      - key: system
        value: "true"
        effect: NoSchedule
        
  - name: tenant-nodes
    instanceType: r6i.4xlarge
    minSize: 5
    maxSize: 50
    volumeSize: 200
    volumeType: gp3
    labels:
      workload-type: tenant
    spot: true
    instancesDistribution:
      maxPrice: 0.5
      instanceTypes: ["r6i.4xlarge", "r5.4xlarge", "r5a.4xlarge"]
      onDemandPercentageAboveBaseCapacity: 30
```

**Multi-Tenant Namespace Strategy:**
```go
// pkg/k8s/tenant/namespace.go
type TenantNamespaceManager struct {
    k8sClient kubernetes.Interface
}

func (m *TenantNamespaceManager) CreateTenantNamespace(tenantID string, tier TenantTier) error {
    namespace := &v1.Namespace{
        ObjectMeta: metav1.ObjectMeta{
            Name: fmt.Sprintf("tenant-%s", tenantID),
            Labels: map[string]string{
                "tenant-id": tenantID,
                "tier":      string(tier),
                "stamp":     os.Getenv("STAMP_ID"),
            },
        },
    }
    
    // Apply resource quotas based on tier
    resourceQuota := m.getResourceQuotaForTier(tier)
    
    // Network policies for isolation
    networkPolicy := m.getTenantNetworkPolicy(tenantID)
    
    // Create namespace with policies
    _, err := m.k8sClient.CoreV1().Namespaces().Create(context.TODO(), namespace, metav1.CreateOptions{})
    if err != nil {
        return err
    }
    
    // Apply quota and policies
    return m.applyTenantPolicies(tenantID, resourceQuota, networkPolicy)
}

func (m *TenantNamespaceManager) getResourceQuotaForTier(tier TenantTier) *v1.ResourceQuota {
    quotas := map[TenantTier]v1.ResourceList{
        TierBasic: {
            v1.ResourceCPU:              resource.MustParse("4"),
            v1.ResourceMemory:           resource.MustParse("8Gi"),
            v1.ResourcePods:             resource.MustParse("20"),
            v1.ResourcePersistentVolumeClaims: resource.MustParse("5"),
        },
        TierStandard: {
            v1.ResourceCPU:              resource.MustParse("16"),
            v1.ResourceMemory:           resource.MustParse("32Gi"),
            v1.ResourcePods:             resource.MustParse("50"),
            v1.ResourcePersistentVolumeClaims: resource.MustParse("20"),
        },
        TierEnterprise: {
            v1.ResourceCPU:              resource.MustParse("64"),
            v1.ResourceMemory:           resource.MustParse("128Gi"),
            v1.ResourcePods:             resource.MustParse("200"),
            v1.ResourcePersistentVolumeClaims: resource.MustParse("100"),
        },
    }
    
    return &v1.ResourceQuota{
        Spec: v1.ResourceQuotaSpec{
            Hard: quotas[tier],
        },
    }
}
```

## Service Mesh (Istio) Configuration

**Istio Multi-Tenant Setup:**
```yaml
# istio-control-plane.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: control-plane
spec:
  profile: default
  meshConfig:
    defaultConfig:
      proxyStatsMatcher:
        inclusionRegexps:
        - ".*outlier_detection.*"
        - ".*circuit_breakers.*"
        - ".*upstream_rq_retry.*"
        - ".*upstream_rq_pending.*"
        - ".*tenant_id.*"
    extensionProviders:
    - name: otel
      envoyOtelAls:
        service: opentelemetry-collector.istio-system.svc.cluster.local
        port: 4317
  values:
    telemetry:
      v2:
        prometheus:
          configOverride:
            inboundSidecar:
              metric_dimensions:
                tenant_id: 'request.headers["x-tenant-id"] | "unknown"'
            outboundSidecar:
              metric_dimensions:
                tenant_id: 'request.headers["x-tenant-id"] | "unknown"'
```

**Per-Tenant Traffic Management:**
```go
// pkg/istio/tenant_routing.go
func CreateTenantVirtualService(tenantID string, services []Service) (*v1beta1.VirtualService, error) {
    var httpRoutes []*v1beta1.HTTPRoute
    
    for _, svc := range services {
        route := &v1beta1.HTTPRoute{
            Match: []*v1beta1.HTTPMatchRequest{{
                Headers: map[string]*v1beta1.StringMatch{
                    "x-tenant-id": {
                        MatchType: &v1beta1.StringMatch_Exact{
                            Exact: tenantID,
                        },
                    },
                },
                Uri: &v1beta1.StringMatch{
                    MatchType: &v1beta1.StringMatch_Prefix{
                        Prefix: svc.PathPrefix,
                    },
                },
            }},
            Route: []*v1beta1.HTTPRouteDestination{{
                Destination: &v1beta1.Destination{
                    Host: fmt.Sprintf("%s.tenant-%s.svc.cluster.local", svc.Name, tenantID),
                    Port: &v1beta1.PortSelector{
                        Number: uint32(svc.Port),
                    },
                },
                Weight: 100,
            }},
            Timeout: durationpb.New(30 * time.Second),
            Retries: &v1beta1.HTTPRetry{
                Attempts:      3,
                PerTryTimeout: durationpb.New(10 * time.Second),
                RetryOn:       "5xx,reset,connect-failure,refused-stream",
            },
        }
        
        httpRoutes = append(httpRoutes, route)
    }
    
    return &v1beta1.VirtualService{
        ObjectMeta: metav1.ObjectMeta{
            Name:      fmt.Sprintf("tenant-%s-routes", tenantID),
            Namespace: fmt.Sprintf("tenant-%s", tenantID),
        },
        Spec: v1beta1.VirtualService{
            Hosts:    []string{"*"},
            Gateways: []string{"tenant-gateway"},
            Http:     httpRoutes,
        },
    }, nil
}
```

## Database Architecture

### PostgreSQL Multi-Tenant Setup

**Schema Isolation with RLS:**
```sql
-- Create tenant schema template
CREATE SCHEMA IF NOT EXISTS tenant_template;

-- Base tables with tenant_id
CREATE TABLE tenant_template.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policy
ALTER TABLE tenant_template.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tenant_template.users
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Function to create tenant schema
CREATE OR REPLACE FUNCTION create_tenant_schema(
    p_tenant_id UUID,
    p_tier VARCHAR
) RETURNS VOID AS $$
DECLARE
    schema_name VARCHAR;
BEGIN
    schema_name := 'tenant_' || replace(p_tenant_id::text, '-', '_');
    
    -- Create schema from template
    EXECUTE format('CREATE SCHEMA %I', schema_name);
    
    -- Clone all tables from template
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'tenant_template'
    LOOP
        EXECUTE format('CREATE TABLE %I.%I (LIKE tenant_template.%I INCLUDING ALL)',
            schema_name, r.tablename, r.tablename);
    END LOOP;
    
    -- Set connection limits based on tier
    CASE p_tier
        WHEN 'enterprise' THEN
            EXECUTE format('ALTER SCHEMA %I CONNECTION LIMIT 100', schema_name);
        WHEN 'standard' THEN
            EXECUTE format('ALTER SCHEMA %I CONNECTION LIMIT 20', schema_name);
        ELSE
            EXECUTE format('ALTER SCHEMA %I CONNECTION LIMIT 5', schema_name);
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

**Connection Pool Management:**
```go
// pkg/database/tenant_pool.go
type TenantConnectionPool struct {
    pools map[string]*pgxpool.Pool
    mu    sync.RWMutex
    cfg   *Config
}

func (p *TenantConnectionPool) GetConnection(ctx context.Context, tenantID string) (*pgxpool.Conn, error) {
    pool := p.getOrCreatePool(tenantID)
    
    conn, err := pool.Acquire(ctx)
    if err != nil {
        return nil, fmt.Errorf("failed to acquire connection: %w", err)
    }
    
    // Set tenant context
    _, err = conn.Exec(ctx, "SET app.tenant_id = $1", tenantID)
    if err != nil {
        conn.Release()
        return nil, fmt.Errorf("failed to set tenant context: %w", err)
    }
    
    // Set search path for schema isolation
    schemaName := fmt.Sprintf("tenant_%s", strings.ReplaceAll(tenantID, "-", "_"))
    _, err = conn.Exec(ctx, "SET search_path = $1, public", schemaName)
    if err != nil {
        conn.Release()
        return nil, fmt.Errorf("failed to set search path: %w", err)
    }
    
    return conn, nil
}

func (p *TenantConnectionPool) getOrCreatePool(tenantID string) *pgxpool.Pool {
    p.mu.RLock()
    if pool, exists := p.pools[tenantID]; exists {
        p.mu.RUnlock()
        return pool
    }
    p.mu.RUnlock()
    
    p.mu.Lock()
    defer p.mu.Unlock()
    
    // Double-check after acquiring write lock
    if pool, exists := p.pools[tenantID]; exists {
        return pool
    }
    
    // Create new pool with tenant-specific configuration
    config, _ := pgxpool.ParseConfig(p.cfg.DatabaseURL)
    config.MaxConns = p.getMaxConnsForTenant(tenantID)
    config.MinConns = 2
    config.MaxConnLifetime = 1 * time.Hour
    config.MaxConnIdleTime = 30 * time.Minute
    
    pool, _ := pgxpool.ConnectConfig(context.Background(), config)
    p.pools[tenantID] = pool
    
    return pool
}
```

## Event-Driven Architecture

### Kafka Multi-Tenant Configuration

**Topic Strategy:**
```go
// pkg/kafka/tenant_topics.go
type TenantTopicManager struct {
    adminClient kafka.AdminClient
    config      *TopicConfig
}

func (m *TenantTopicManager) CreateTenantTopics(tenantID string, tier TenantTier) error {
    topics := []kafka.TopicSpecification{
        {
            Topic:             fmt.Sprintf("tenant.%s.events", tenantID),
            NumPartitions:     m.getPartitionCount(tier),
            ReplicationFactor: 3,
            Config: map[string]string{
                "retention.ms":          "604800000", // 7 days
                "compression.type":      "snappy",
                "min.insync.replicas":   "2",
                "segment.ms":           "3600000", // 1 hour
                "max.message.bytes":    "1048576", // 1MB
            },
        },
        {
            Topic:             fmt.Sprintf("tenant.%s.commands", tenantID),
            NumPartitions:     m.getPartitionCount(tier) / 2,
            ReplicationFactor: 3,
            Config: map[string]string{
                "retention.ms":        "86400000", // 1 day
                "compression.type":    "lz4",
                "min.insync.replicas": "2",
            },
        },
    }
    
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()
    
    _, err := m.adminClient.CreateTopics(ctx, topics)
    return err
}

// Event producer with tenant isolation
type TenantEventProducer struct {
    producer *kafka.Producer
    tenantID string
}

func (p *TenantEventProducer) PublishEvent(ctx context.Context, event Event) error {
    headers := []kafka.Header{
        {Key: "tenant-id", Value: []byte(p.tenantID)},
        {Key: "event-type", Value: []byte(event.Type)},
        {Key: "trace-id", Value: []byte(trace.SpanFromContext(ctx).SpanContext().TraceID().String())},
    }
    
    message := &kafka.Message{
        TopicPartition: kafka.TopicPartition{
            Topic:     aws.String(fmt.Sprintf("tenant.%s.events", p.tenantID)),
            Partition: kafka.PartitionAny,
        },
        Key:     []byte(event.AggregateID),
        Value:   event.Data,
        Headers: headers,
    }
    
    return p.producer.Produce(message, nil)
}
```

### Event Sourcing Implementation

```go
// pkg/eventsourcing/aggregate.go
type EventStore interface {
    SaveEvents(ctx context.Context, aggregateID string, events []Event, expectedVersion int) error
    GetEvents(ctx context.Context, aggregateID string, fromVersion int) ([]Event, error)
}

type PostgresEventStore struct {
    pool *pgxpool.Pool
}

func (s *PostgresEventStore) SaveEvents(ctx context.Context, aggregateID string, events []Event, expectedVersion int) error {
    tx, err := s.pool.BeginTx(ctx, pgx.TxOptions{
        IsoLevel: pgx.Serializable,
    })
    if err != nil {
        return err
    }
    defer tx.Rollback(ctx)
    
    // Check current version
    var currentVersion int
    err = tx.QueryRow(ctx, `
        SELECT COALESCE(MAX(version), 0) 
        FROM events 
        WHERE aggregate_id = $1
    `, aggregateID).Scan(&currentVersion)
    
    if err != nil {
        return err
    }
    
    if currentVersion != expectedVersion {
        return ErrConcurrencyConflict
    }
    
    // Insert events
    for i, event := range events {
        _, err = tx.Exec(ctx, `
            INSERT INTO events (
                aggregate_id, aggregate_type, event_type, 
                event_data, metadata, version, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, 
            aggregateID,
            event.AggregateType,
            event.Type,
            event.Data,
            event.Metadata,
            expectedVersion + i + 1,
            event.Timestamp,
        )
        if err != nil {
            return err
        }
    }
    
    // Update snapshot if needed
    if (expectedVersion + len(events)) % 10 == 0 {
        if err := s.createSnapshot(ctx, tx, aggregateID); err != nil {
            return err
        }
    }
    
    return tx.Commit(ctx)
}
```

## API Gateway Configuration

### Kong Multi-Tenant Setup

```lua
-- kong/plugins/tenant-auth/handler.lua
local TenantAuthHandler = {
    PRIORITY = 1000,
    VERSION = "1.0.0",
}

function TenantAuthHandler:access(conf)
    local headers = kong.request.get_headers()
    local tenant_id = headers["x-tenant-id"]
    
    if not tenant_id then
        return kong.response.error(400, "Missing tenant ID")
    end
    
    -- Validate tenant exists and is active
    local cache_key = "tenant:" .. tenant_id
    local tenant_data = kong.cache:get(cache_key, nil, load_tenant_data, tenant_id)
    
    if not tenant_data or tenant_data.status ~= "active" then
        return kong.response.error(403, "Invalid or inactive tenant")
    end
    
    -- Apply rate limits based on tier
    local rate_limit = get_rate_limit_for_tier(tenant_data.tier)
    kong.service.request.set_header("X-RateLimit-Limit", rate_limit)
    
    -- Set tenant context for downstream services
    kong.service.request.set_header("X-Tenant-ID", tenant_id)
    kong.service.request.set_header("X-Tenant-Tier", tenant_data.tier)
    
    -- Add to distributed tracing
    local span = kong.tracing.active_span()
    if span then
        span:set_attribute("tenant.id", tenant_id)
        span:set_attribute("tenant.tier", tenant_data.tier)
    end
end

function get_rate_limit_for_tier(tier)
    local limits = {
        basic = "100",
        standard = "1000", 
        enterprise = "10000"
    }
    return limits[tier] or limits.basic
end
```

## Security Implementation

### Zero-Trust Architecture

```go
// pkg/security/zero_trust.go
type ZeroTrustMiddleware struct {
    authz      AuthorizationService
    policyEngine PolicyEngine
    riskEngine RiskEngine
}

func (m *ZeroTrustMiddleware) Authenticate(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := r.Context()
        
        // Extract and verify JWT
        token, err := m.extractAndVerifyToken(r)
        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // Continuous verification
        riskScore := m.riskEngine.CalculateRiskScore(ctx, token, r)
        if riskScore > 0.7 {
            // Require re-authentication for high-risk requests
            http.Error(w, "Re-authentication required", http.StatusUnauthorized)
            return
        }
        
        // Check device trust
        deviceID := r.Header.Get("X-Device-ID")
        if !m.isDeviceTrusted(ctx, deviceID, token.Subject) {
            http.Error(w, "Untrusted device", http.StatusForbidden)
            return
        }
        
        // Apply fine-grained policies
        decision := m.policyEngine.Evaluate(ctx, PolicyRequest{
            Subject:  token.Subject,
            Resource: r.URL.Path,
            Action:   r.Method,
            Context: map[string]interface{}{
                "tenant_id":   token.TenantID,
                "risk_score":  riskScore,
                "device_id":   deviceID,
                "source_ip":   r.RemoteAddr,
            },
        })
        
        if !decision.Allowed {
            http.Error(w, "Access denied", http.StatusForbidden)
            return
        }
        
        // Add security context
        ctx = context.WithValue(ctx, "security_context", &SecurityContext{
            TenantID:     token.TenantID,
            UserID:       token.Subject,
            Permissions:  token.Permissions,
            RiskScore:    riskScore,
        })
        
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### Encryption at Rest

```go
// pkg/crypto/tenant_encryption.go
type TenantEncryptionService struct {
    kmsClient *kms.Client
    cache     *ristretto.Cache
}

func (s *TenantEncryptionService) EncryptData(ctx context.Context, tenantID string, data []byte) ([]byte, error) {
    // Get or create data encryption key for tenant
    dek, err := s.getDataEncryptionKey(ctx, tenantID)
    if err != nil {
        return nil, err
    }
    
    // Generate nonce
    nonce := make([]byte, 12)
    if _, err := rand.Read(nonce); err != nil {
        return nil, err
    }
    
    // Encrypt using AES-GCM
    block, err := aes.NewCipher(dek)
    if err != nil {
        return nil, err
    }
    
    aead, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }
    
    // Include tenant ID in additional data for authentication
    additionalData := []byte(tenantID)
    ciphertext := aead.Seal(nil, nonce, data, additionalData)
    
    // Prepend nonce to ciphertext
    return append(nonce, ciphertext...), nil
}

func (s *TenantEncryptionService) getDataEncryptionKey(ctx context.Context, tenantID string) ([]byte, error) {
    cacheKey := fmt.Sprintf("dek:%s", tenantID)
    
    // Check cache
    if val, found := s.cache.Get(cacheKey); found {
        return val.([]byte), nil
    }
    
    // Generate new DEK using KMS
    input := &kms.GenerateDataKeyInput{
        KeyId:   aws.String(fmt.Sprintf("alias/tenant-%s", tenantID)),
        KeySpec: types.DataKeySpecAes256,
    }
    
    result, err := s.kmsClient.GenerateDataKey(ctx, input)
    if err != nil {
        return nil, err
    }
    
    // Cache the plaintext DEK (in memory only)
    s.cache.SetWithTTL(cacheKey, result.Plaintext, 1, 24*time.Hour)
    
    return result.Plaintext, nil
}
```

## Performance Optimization

### Caching Strategy

```go
// pkg/cache/multi_layer.go
type MultiLayerCache struct {
    l1Cache   *ristretto.Cache  // In-memory L1
    l2Cache   *redis.Client     // Redis L2
    metrics   *prometheus.CounterVec
}

func (c *MultiLayerCache) Get(ctx context.Context, key string) (interface{}, error) {
    // Check L1 cache
    if val, found := c.l1Cache.Get(key); found {
        c.metrics.WithLabelValues("l1", "hit").Inc()
        return val, nil
    }
    
    // Check L2 cache
    val, err := c.l2Cache.Get(ctx, key).Result()
    if err == nil {
        c.metrics.WithLabelValues("l2", "hit").Inc()
        
        // Promote to L1
        var decoded interface{}
        if err := json.Unmarshal([]byte(val), &decoded); err == nil {
            c.l1Cache.SetWithTTL(key, decoded, 1, 5*time.Minute)
        }
        
        return decoded, nil
    }
    
    c.metrics.WithLabelValues("l2", "miss").Inc()
    return nil, ErrCacheMiss
}

// Tenant-aware cache key generation
func GenerateTenantCacheKey(tenantID, entity, id string) string {
    return fmt.Sprintf("tenant:%s:%s:%s", tenantID, entity, id)
}
```

### Connection Pooling Optimization

```go
// pkg/database/optimized_pool.go
type OptimizedConnectionPool struct {
    primaryPool   *pgxpool.Pool
    readPools     []*pgxpool.Pool
    tenantAffinity map[string]int // Tenant to read replica mapping
    mu            sync.RWMutex
}

func (p *OptimizedConnectionPool) GetReadConnection(ctx context.Context, tenantID string) (*pgxpool.Conn, error) {
    // Get tenant's preferred read replica
    replicaIndex := p.getTenantReplica(tenantID)
    pool := p.readPools[replicaIndex]
    
    // Use context with timeout
    ctx, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
    defer cancel()
    
    conn, err := pool.Acquire(ctx)
    if err != nil {
        // Fallback to another replica
        for i, fallbackPool := range p.readPools {
            if i == replicaIndex {
                continue
            }
            if conn, err := fallbackPool.Acquire(ctx); err == nil {
                return conn, nil
            }
        }
        return nil, fmt.Errorf("all read replicas unavailable: %w", err)
    }
    
    return conn, nil
}

func (p *OptimizedConnectionPool) getTenantReplica(tenantID string) int {
    p.mu.RLock()
    if idx, exists := p.tenantAffinity[tenantID]; exists {
        p.mu.RUnlock()
        return idx
    }
    p.mu.RUnlock()
    
    // Assign tenant to replica using consistent hashing
    h := fnv.New32a()
    h.Write([]byte(tenantID))
    replicaIndex := int(h.Sum32()) % len(p.readPools)
    
    p.mu.Lock()
    p.tenantAffinity[tenantID] = replicaIndex
    p.mu.Unlock()
    
    return replicaIndex
}
```

## Monitoring and Observability

### OpenTelemetry Configuration

```go
// pkg/observability/tracing.go
func InitializeTracing(serviceName string) (*trace.TracerProvider, error) {
    ctx := context.Background()
    
    // OTLP exporter
    exporter, err := otlptrace.New(
        ctx,
        otlptracegrpc.NewClient(
            otlptracegrpc.WithEndpoint("otel-collector:4317"),
            otlptracegrpc.WithInsecure(),
        ),
    )
    if err != nil {
        return nil, err
    }
    
    // Resource with service information
    resource := resource.NewWithAttributes(
        semconv.SchemaURL,
        semconv.ServiceNameKey.String(serviceName),
        semconv.ServiceVersionKey.String(version.Version),
        attribute.String("environment", os.Getenv("ENVIRONMENT")),
        attribute.String("stamp.id", os.Getenv("STAMP_ID")),
    )
    
    // Sampler with tenant-aware decisions
    sampler := NewTenantAwareSampler()
    
    tp := trace.NewTracerProvider(
        trace.WithBatcher(exporter),
        trace.WithResource(resource),
        trace.WithSampler(sampler),
    )
    
    otel.SetTracerProvider(tp)
    otel.SetTextMapPropagator(
        propagation.NewCompositeTextMapPropagator(
            propagation.TraceContext{},
            propagation.Baggage{},
            &TenantContextPropagator{}, // Custom propagator for tenant context
        ),
    )
    
    return tp, nil
}

// Tenant-aware sampling
type TenantAwareSampler struct {
    defaultRate float64
    tenantRates map[string]float64
}

func (s *TenantAwareSampler) ShouldSample(parameters trace.SamplingParameters) trace.SamplingResult {
    // Extract tenant ID from span attributes
    var tenantID string
    for _, attr := range parameters.Attributes {
        if attr.Key == "tenant.id" {
            tenantID = attr.Value.AsString()
            break
        }
    }
    
    // Get sampling rate for tenant
    rate := s.defaultRate
    if tenantRate, exists := s.tenantRates[tenantID]; exists {
        rate = tenantRate
    }
    
    // Make sampling decision
    if rand.Float64() < rate {
        return trace.SamplingResult{
            Decision: trace.RecordAndSample,
        }
    }
    
    return trace.SamplingResult{
        Decision: trace.Drop,
    }
}
```

### Metrics Collection

```go
// pkg/observability/metrics.go
var (
    requestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: []float64{0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10},
        },
        []string{"tenant_id", "method", "endpoint", "status", "tier"},
    )
    
    tenantResourceUsage = prometheus.NewGaugeVec(
        prometheus.GaugeOpts{
            Name: "tenant_resource_usage",
            Help: "Resource usage by tenant",
        },
        []string{"tenant_id", "resource_type", "tier"},
    )
    
    // Custom business metrics
    paymentProcessed = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "payments_processed_total",
            Help: "Total number of payments processed",
        },
        []string{"tenant_id", "payment_method", "currency", "status"},
    )
)

func RecordTenantMetrics(ctx context.Context) {
    secCtx := ctx.Value("security_context").(*SecurityContext)
    
    // Record current resource usage
    go func() {
        cpuUsage := getCurrentCPUUsage(secCtx.TenantID)
        memoryUsage := getCurrentMemoryUsage(secCtx.TenantID)
        
        tenantResourceUsage.WithLabelValues(
            secCtx.TenantID, "cpu", secCtx.Tier,
        ).Set(cpuUsage)
        
        tenantResourceUsage.WithLabelValues(
            secCtx.TenantID, "memory", secCtx.Tier,
        ).Set(memoryUsage)
    }()
}
```

## Module-Specific Implementations

### IoT Data Pipeline

```go
// pkg/iot/pipeline.go
type IoTDataPipeline struct {
    mqttBroker   *MQTTBroker
    timeseriesDB *TimescaleDB
    streamProc   *FlinkProcessor
}

func (p *IoTDataPipeline) ProcessDeviceData(ctx context.Context, tenantID string, data []byte) error {
    span, ctx := otel.Tracer("iot").Start(ctx, "ProcessDeviceData")
    defer span.End()
    
    // Parse and validate device data
    var deviceData DeviceData
    if err := json.Unmarshal(data, &deviceData); err != nil {
        return err
    }
    
    // Apply tenant-specific transformations
    transformed := p.applyTenantTransformations(tenantID, deviceData)
    
    // Write to time-series database with automatic partitioning
    err := p.timeseriesDB.WritePoints(ctx, []TimeSeries{
        {
            Measurement: "device_metrics",
            Tags: map[string]string{
                "tenant_id": tenantID,
                "device_id": deviceData.DeviceID,
                "type":      deviceData.Type,
            },
            Fields: transformed.Metrics,
            Time:   deviceData.Timestamp,
        },
    })
    
    if err != nil {
        return err
    }
    
    // Stream to Flink for real-time analytics
    return p.streamProc.Send(ctx, StreamEvent{
        TenantID: tenantID,
        Type:     "iot.device.data",
        Data:     transformed,
    })
}

// Automatic data retention and compression
func (p *IoTDataPipeline) SetupTenantRetention(tenantID string, tier TenantTier) error {
    policies := map[TenantTier]RetentionPolicy{
        TierBasic: {
            RawDataDays:        7,
            AggregatedDataDays: 90,
            CompressionAfter:   24 * time.Hour,
        },
        TierStandard: {
            RawDataDays:        30,
            AggregatedDataDays: 365,
            CompressionAfter:   7 * 24 * time.Hour,
        },
        TierEnterprise: {
            RawDataDays:        90,
            AggregatedDataDays: 1095, // 3 years
            CompressionAfter:   30 * 24 * time.Hour,
        },
    }
    
    policy := policies[tier]
    
    // Create continuous aggregates
    queries := []string{
        fmt.Sprintf(`
            CREATE MATERIALIZED VIEW tenant_%s_hourly
            WITH (timescaledb.continuous) AS
            SELECT 
                time_bucket('1 hour', time) AS hour,
                device_id,
                AVG(value) as avg_value,
                MAX(value) as max_value,
                MIN(value) as min_value
            FROM device_metrics
            WHERE tenant_id = '%s'
            GROUP BY hour, device_id
        `, tenantID, tenantID),
        
        fmt.Sprintf(`
            SELECT add_retention_policy('device_metrics', 
                INTERVAL '%d days',
                if_not_exists => true,
                conditions => $$ tenant_id = '%s' $$
            )
        `, policy.RawDataDays, tenantID),
    }
    
    for _, query := range queries {
        if _, err := p.timeseriesDB.Exec(query); err != nil {
            return err
        }
    }
    
    return nil
}
```

### Payment Processing Integration

```go
// pkg/payment/gateway.go
type PaymentGateway struct {
    providers map[string]PaymentProvider
    vault     *VaultClient
    metrics   *PaymentMetrics
}

func (g *PaymentGateway) ProcessPayment(ctx context.Context, req PaymentRequest) (*PaymentResult, error) {
    span, ctx := otel.Tracer("payment").Start(ctx, "ProcessPayment")
    defer span.End()
    
    // Get tenant configuration
    tenantConfig, err := g.getTenantPaymentConfig(ctx, req.TenantID)
    if err != nil {
        return nil, err
    }
    
    // Tokenize sensitive data
    tokenizedCard, err := g.tokenizeCard(ctx, req.TenantID, req.CardDetails)
    if err != nil {
        return nil, err
    }
    
    // Route to appropriate provider
    provider := g.selectProvider(tenantConfig, req)
    
    // Process with retry logic
    var result *PaymentResult
    err = retry.Do(
        func() error {
            result, err = provider.Charge(ctx, ChargeRequest{
                Amount:      req.Amount,
                Currency:    req.Currency,
                Token:       tokenizedCard,
                Description: req.Description,
                Metadata: map[string]string{
                    "tenant_id": req.TenantID,
                    "order_id":  req.OrderID,
                },
            })
            return err
        },
        retry.Attempts(3),
        retry.Delay(100*time.Millisecond),
        retry.MaxDelay(1*time.Second),
        retry.OnRetry(func(n uint, err error) {
            span.RecordError(err)
            g.metrics.RecordRetry(req.TenantID, provider.Name(), n)
        }),
    )
    
    // Record metrics
    status := "success"
    if err != nil {
        status = "failed"
    }
    
    g.metrics.RecordPayment(PaymentMetric{
        TenantID:       req.TenantID,
        Provider:       provider.Name(),
        Amount:         req.Amount,
        Currency:       req.Currency,
        Status:         status,
        ProcessingTime: time.Since(span.StartTime()),
    })
    
    return result, err
}

func (g *PaymentGateway) tokenizeCard(ctx context.Context, tenantID string, card CardDetails) (string, error) {
    // Use tenant-specific encryption key
    encryptionKey := fmt.Sprintf("tenant/%s/payment-key", tenantID)
    
    // Create PCI-compliant token
    token := &CardToken{
        Last4:       card.Number[len(card.Number)-4:],
        ExpiryMonth: card.ExpiryMonth,
        ExpiryYear:  card.ExpiryYear,
        Brand:       detectCardBrand(card.Number),
        TenantID:    tenantID,
        CreatedAt:   time.Now(),
    }
    
    // Encrypt full card data
    encryptedData, err := g.vault.Encrypt(ctx, encryptionKey, card)
    if err != nil {
        return "", err
    }
    
    token.EncryptedData = encryptedData
    token.ID = generateSecureToken()
    
    // Store token with TTL
    err = g.vault.StoreWithTTL(ctx, 
        fmt.Sprintf("tokens/%s/%s", tenantID, token.ID),
        token,
        15*time.Minute, // PCI compliance: short TTL
    )
    
    return token.ID, err
}
```

This technical implementation guide provides the detailed architecture needed to build your multi-tenant SaaS platform. The key aspects include:

1. **Infrastructure**: Deployment stamps with 75-100 tenants each, using EKS for container orchestration
2. **Isolation**: Multiple layers including K8s namespaces, database schemas, and network policies
3. **Performance**: Multi-layer caching, connection pooling, and horizontal scaling
4. **Security**: Zero-trust architecture, tenant-specific encryption, and comprehensive audit trails
5. **Observability**: OpenTelemetry integration with tenant-aware sampling and metrics

