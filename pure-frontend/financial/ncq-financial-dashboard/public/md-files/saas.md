# Distributed Multi-Product SaaS Platform Technical Implementation Guide

## Platform architecture enables autonomous teams while maintaining cohesion

Building a distributed SaaS platform where autonomous teams develop separate products (hospital management, smart hospitality, IoT platform, blockchain) requires careful balance between independence and integration. The architecture must support complete technology stack ownership per team while providing shared services like payment gateways, authentication, and monitoring.

The key challenge lies in creating boundaries that enable autonomy without sacrificing platform coherence. Teams need freedom to choose technologies and deployment strategies while adhering to common standards for inter-service communication, security, and operational excellence.

## 1. Distributed Architecture Patterns for Team Autonomy

### Domain-Driven Design with Bounded Contexts

Each product team owns a bounded context representing their complete domain. This approach ensures clear service boundaries and reduces inter-team dependencies.

```yaml
# Service structure following DDD principles
hospital-management-service:
  domain: Healthcare Operations
  bounded-context: HospitalContext
  aggregates: [Patient, Appointment, MedicalRecord, Staff]
  
smart-hospitality-service:
  domain: Guest Experience Management
  bounded-context: HospitalityContext
  aggregates: [Guest, Booking, Room, Service]

iot-platform-service:
  domain: Device Management
  bounded-context: IoTContext
  aggregates: [Device, Sensor, DataStream, Alert]
```

### Microservices Mesh Architecture

Service mesh provides infrastructure-layer networking with **Istio** for complex deployments or **Linkerd** for simplicity. The mesh handles service-to-service communication, security, and observability without application code changes.

```yaml
# Istio VirtualService for team routing
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: hospital-service-routing
spec:
  hosts:
  - hospital-service
  http:
  - match:
    - headers:
        x-version:
          exact: v2
    route:
    - destination:
        host: hospital-service
        subset: v2
      weight: 100
  - route:
    - destination:
        host: hospital-service
        subset: v1
```

## 2. Payment Gateway as Standalone Product and Shared Service

### Multi-Tenant Payment Architecture

The payment gateway operates as both an independent product and shared service through careful API design and tenant isolation.

```javascript
// Payment Gateway Service Architecture
class PaymentGatewayService {
  constructor(tenantManager, routingEngine) {
    this.tenantManager = tenantManager;
    this.routingEngine = routingEngine;
  }
  
  async processPayment(paymentRequest) {
    // Determine if standalone or integrated mode
    const context = await this.tenantManager.getContext(paymentRequest.tenantId);
    
    if (context.mode === 'standalone') {
      // Full payment product features
      return await this.handleStandalonePayment(paymentRequest);
    } else {
      // Shared service mode for other products
      return await this.handleIntegratedPayment(paymentRequest, context);
    }
  }
  
  async handleIntegratedPayment(request, context) {
    // Route to appropriate provider based on rules
    const provider = await this.routingEngine.selectProvider({
      tenantId: request.tenantId,
      amount: request.amount,
      region: context.region
    });
    
    // Process with tenant isolation
    return await provider.processPayment({
      ...request,
      metadata: { 
        sourceProduct: context.sourceProduct,
        integrationMode: 'shared'
      }
    });
  }
}
```

### Payment Event Broadcasting

```javascript
// Payment event publisher for cross-product integration
class PaymentEventPublisher {
  async publishPaymentCompleted(payment) {
    const event = {
      eventType: 'payment.completed',
      paymentId: payment.id,
      tenantId: payment.tenantId,
      amount: payment.amount,
      sourceProduct: payment.metadata.sourceProduct,
      timestamp: new Date().toISOString()
    };
    
    // Publish to product-specific topics
    await this.kafka.send({
      topic: `payments.${payment.metadata.sourceProduct}`,
      messages: [{ key: payment.id, value: JSON.stringify(event) }]
    });
  }
}
```

## 3. Hybrid Platform Architecture

### Core Shared Services

Shared services provide platform-wide functionality while preserving team autonomy through well-defined interfaces.

```typescript
// Shared Authentication Service
interface AuthenticationService {
  validateToken(token: string): Promise<TokenPayload>;
  generateToken(user: User, context: TenantContext): Promise<string>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
}

// Shared Monitoring Service
interface MonitoringService {
  recordMetric(metric: Metric, tags: Tags): void;
  createAlert(condition: AlertCondition): Promise<Alert>;
  getTeamDashboard(teamId: string): Promise<Dashboard>;
}

// Shared Deployment Service
interface DeploymentService {
  deployService(service: ServiceDefinition, team: Team): Promise<Deployment>;
  promoteToProduction(deploymentId: string): Promise<void>;
  rollback(deploymentId: string): Promise<void>;
}
```

### Platform Service Registry

```yaml
# Platform services configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: platform-services
data:
  services.yaml: |
    shared-services:
      authentication:
        endpoint: https://auth.platform.internal
        version: v1
      monitoring:
        endpoint: https://monitoring.platform.internal
        version: v1
      deployment:
        endpoint: https://deployment.platform.internal
        version: v1
    team-services:
      hospital-team:
        namespace: hospital-prod
        services: [patient-service, appointment-service]
      hospitality-team:
        namespace: hospitality-prod
        services: [booking-service, guest-service]
```

## 4. Inter-Team API Contracts and Communication

### OpenAPI Contract Management

Teams define and share API contracts using OpenAPI specifications with automated validation and SDK generation.

```yaml
# Hospital Management API Contract
openapi: 3.0.0
info:
  title: Patient Service API
  version: 1.0.0
  x-team: hospital-management
paths:
  /patients/{id}:
    get:
      operationId: getPatient
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'
components:
  schemas:
    Patient:
      type: object
      required: [id, name, dateOfBirth]
      properties:
        id:
          type: string
        name:
          type: string
        dateOfBirth:
          type: string
          format: date
```

### Contract Testing with Pact

```javascript
// Consumer-driven contract test
describe('Hospitality Service consuming Patient API', () => {
  const provider = new Pact({
    consumer: 'hospitality-service',
    provider: 'patient-service'
  });
  
  it('should retrieve patient for guest verification', async () => {
    await provider.addInteraction({
      state: 'patient exists',
      uponReceiving: 'a request for patient data',
      withRequest: {
        method: 'GET',
        path: '/patients/123'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: '123',
          name: 'John Doe',
          dateOfBirth: '1990-01-01'
        }
      }
    });
  });
});
```

## 5. Service Discovery and API Gateway Patterns

### Multi-Layer Service Discovery

Combining Kubernetes native discovery with service mesh capabilities provides robust service location.

```yaml
# Kong API Gateway configuration for team services
_format_version: "2.1"
services:
  - name: hospital-api
    url: http://hospital-service.hospital-prod:8080
    routes:
      - name: hospital-route
        paths: ["/api/hospital"]
    plugins:
      - name: rate-limiting
        config:
          minute: 1000
      - name: jwt
        config:
          claims_to_verify: ["exp", "team"]

  - name: hospitality-api
    url: http://hospitality-service.hospitality-prod:8080
    routes:
      - name: hospitality-route
        paths: ["/api/hospitality"]
```

### GraphQL Federation Gateway

```typescript
// Federated GraphQL gateway
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'patients', url: 'http://patient-service:4001/graphql' },
    { name: 'bookings', url: 'http://booking-service:4002/graphql' },
    { name: 'devices', url: 'http://iot-service:4003/graphql' },
    { name: 'payments', url: 'http://payment-service:4004/graphql' }
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set('x-team-id', context.teamId);
      }
    });
  }
});
```

## 6. Event-Driven Architecture for Loose Coupling

### Apache Kafka Topic Organization

```yaml
# Kafka topic structure for team isolation
topics:
  # Team-specific topics
  hospital.events:
    partitions: 10
    replication: 3
    retention: 7d
  
  hospitality.events:
    partitions: 10
    replication: 3
    retention: 7d
    
  # Cross-team integration topics  
  platform.integration.events:
    partitions: 20
    replication: 3
    retention: 30d
    
  # Payment gateway events
  payments.transactions:
    partitions: 50
    replication: 3
    retention: 90d
```

### Event-Driven Integration Patterns

```javascript
// Saga orchestrator for cross-team workflows
class BookingPaymentSaga {
  constructor(eventBus, paymentService, bookingService) {
    this.eventBus = eventBus;
    this.paymentService = paymentService;
    this.bookingService = bookingService;
  }
  
  async handleBookingCreated(event) {
    const sagaId = generateSagaId();
    
    try {
      // Process payment through shared gateway
      const payment = await this.paymentService.processPayment({
        amount: event.totalAmount,
        customerId: event.guestId,
        metadata: {
          bookingId: event.bookingId,
          sagaId
        }
      });
      
      // Confirm booking
      await this.bookingService.confirmBooking(event.bookingId);
      
      // Publish success event
      await this.eventBus.publish({
        type: 'booking.payment.completed',
        sagaId,
        bookingId: event.bookingId,
        paymentId: payment.id
      });
      
    } catch (error) {
      // Compensate on failure
      await this.handleSagaFailure(sagaId, error);
    }
  }
}
```

## 7. Shared Development Standards Without Constraining Autonomy

### Platform Engineering Standards

```yaml
# Platform standards configuration
apiVersion: platform.io/v1
kind: DevelopmentStandards
metadata:
  name: platform-standards
spec:
  required:
    api:
      - openapi: "3.0.0"
      - versioning: "url-path"
    security:
      - authentication: "oauth2"
      - encryption: "tls-1.3"
    observability:
      - metrics: "prometheus"
      - tracing: "opentelemetry"
      - logging: "structured-json"
  recommended:
    languages: ["go", "java", "typescript", "python"]
    databases: ["postgresql", "mongodb", "redis"]
    messaging: ["kafka", "rabbitmq"]
  team-overrides:
    blockchain-team:
      languages: ["rust", "solidity"]
      databases: ["leveldb"]
```

### Automated Compliance Checking

```javascript
// Platform compliance validator
class ComplianceValidator {
  async validateService(serviceMetadata) {
    const violations = [];
    
    // Check required standards
    if (!serviceMetadata.api.openapi) {
      violations.push('Missing OpenAPI specification');
    }
    
    if (!serviceMetadata.observability.metrics) {
      violations.push('Metrics endpoint not exposed');
    }
    
    // Allow team-specific overrides
    const teamOverrides = this.getTeamOverrides(serviceMetadata.team);
    const standards = this.mergeStandards(this.baseStandards, teamOverrides);
    
    return {
      compliant: violations.length === 0,
      violations,
      appliedStandards: standards
    };
  }
}
```

## 8. Kubernetes Namespace Isolation and Multi-Tenancy

### Hierarchical Namespace Structure

```yaml
# Team namespace with resource quotas
apiVersion: v1
kind: Namespace
metadata:
  name: hospital-prod
  labels:
    team: hospital
    environment: production
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: hospital-quota
  namespace: hospital-prod
spec:
  hard:
    requests.cpu: "100"
    requests.memory: "200Gi"
    limits.cpu: "200"
    limits.memory: "400Gi"
    persistentvolumeclaims: "20"
---
# Network isolation policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: team-isolation
  namespace: hospital-prod
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: hospital-prod
    - namespaceSelector:
        matchLabels:
          name: shared-services
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: hospital-prod
    - namespaceSelector:
        matchLabels:
          name: shared-services
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443  # External HTTPS
```

### Multi-Tenant Service Mesh Configuration

```yaml
# Istio multi-tenant setup
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: hospital-team-policy
  namespace: hospital-prod
spec:
  rules:
  - from:
    - source:
        namespaces: ["hospital-prod", "shared-services"]
    - source:
        principals: ["cluster.local/ns/hospital-prod/sa/*"]
  - to:
    - operation:
        methods: ["GET", "POST", "PUT", "DELETE"]
```

## 9. API Versioning Strategies for Independent Evolution

### URL Path Versioning with Deprecation

```typescript
// API versioning middleware
const versioningMiddleware = (req, res, next) => {
  const version = req.path.match(/\/api\/v(\d+)\//)?.[1] || '1';
  
  // Check deprecated versions
  if (version < MINIMUM_SUPPORTED_VERSION) {
    return res.status(410).json({
      error: 'API version deprecated',
      message: `Minimum supported version is v${MINIMUM_SUPPORTED_VERSION}`,
      migration_guide: 'https://docs.platform.com/migration'
    });
  }
  
  req.apiVersion = version;
  next();
};

// Version-specific routing
app.use('/api/v1/patients', patientRoutesV1);
app.use('/api/v2/patients', patientRoutesV2);
```

### GraphQL Schema Evolution

```graphql
# Deprecated field with migration path
type Patient {
  id: ID!
  name: String!
  dateOfBirth: String!
  age: Int! @deprecated(reason: "Use dateOfBirth instead")
  
  # New field with default resolver
  medicalHistory: [MedicalRecord!]! @since(version: "2.0")
}
```

## 10. Centralized Observability Across Autonomous Products

### Multi-Tenant Prometheus Configuration

```yaml
# ServiceMonitor for team metrics collection
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: hospital-services
  namespace: hospital-prod
spec:
  selector:
    matchLabels:
      team: hospital
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
    metricRelabelings:
    - sourceLabels: [__name__]
      regex: '(.*)'
      targetLabel: __name__
      replacement: 'hospital_${1}'
```

### Distributed Tracing with Jaeger

```javascript
// OpenTelemetry initialization for cross-team tracing
const { NodeTracerProvider } = require('@opentelemetry/node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ResourceAttributes.SERVICE_NAME]: 'hospital-service',
    [ResourceAttributes.SERVICE_NAMESPACE]: 'hospital-prod',
    'team.name': 'hospital'
  })
});

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://jaeger-collector.observability:14268/api/traces',
  headers: {
    'X-Team-ID': 'hospital'
  }
});

provider.addSpanProcessor(new BatchSpanProcessor(jaegerExporter));
```

### Centralized Logging with Team Segregation

```yaml
# Fluent Bit configuration for team log routing
[FILTER]
    Name    modify
    Match   kube.*
    Add     team ${KUBERNETES_NAMESPACE}
    
[OUTPUT]
    Name            es
    Match           kube.hospital-prod.*
    Host            elasticsearch.logging
    Port            9200
    Index           hospital-logs
    Type            _doc
    
[OUTPUT]
    Name            es
    Match           kube.hospitality-prod.*
    Host            elasticsearch.logging
    Port            9200
    Index           hospitality-logs
    Type            _doc
```

## 11. CI/CD Patterns for Independent Team Deployments

### GitOps with ArgoCD App-of-Apps

```yaml
# Root application for team deployments
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: platform-apps
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/platform/gitops
    targetRevision: HEAD
    path: teams/
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
---
# Team-specific application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: hospital-services
  namespace: argocd
spec:
  project: hospital-team
  source:
    repoURL: https://github.com/hospital-team/configs
    targetRevision: HEAD
    path: deployments/
  destination:
    namespace: hospital-prod
    server: https://kubernetes.default.svc
```

### Progressive Delivery with Flagger

```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: patient-service
  namespace: hospital-prod
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-service
  progressDeadlineSeconds: 60
  service:
    port: 8080
  analysis:
    interval: 30s
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
      interval: 1m
    - name: request-duration
      thresholdRange:
        max: 500
      interval: 30s
```

## 12. Database Strategies with Team Data Ownership

### Database-per-Service Pattern

```yaml
# PostgreSQL operator for team databases
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: hospital-db
  namespace: hospital-prod
spec:
  instances: 3
  postgresql:
    parameters:
      max_connections: "200"
  bootstrap:
    initdb:
      database: hospital_management
      owner: hospital_app
      secret:
        name: hospital-db-secret
  storage:
    size: 100Gi
    storageClass: fast-ssd
```

### Cross-Service Data Synchronization

```javascript
// Change Data Capture for cross-team data sharing
class CDCProcessor {
  constructor(source, target, transformer) {
    this.source = source;
    this.target = target;
    this.transformer = transformer;
  }
  
  async processChanges() {
    const changes = await this.source.captureChanges();
    
    for (const change of changes) {
      if (this.shouldShare(change)) {
        const transformed = await this.transformer.transform(change);
        await this.publishToIntegrationTopic(transformed);
      }
    }
  }
  
  shouldShare(change) {
    // Check data sharing policies
    return change.table === 'patients' && 
           change.columns.includes('public_fields');
  }
}
```

## 13. Integration Patterns via Payment Gateway

### Payment Gateway Integration SDK

```typescript
// Team-specific payment integration
export class HospitalPaymentIntegration {
  constructor(private paymentGateway: PaymentGatewaySDK) {}
  
  async processBilling(invoice: HospitalInvoice): Promise<PaymentResult> {
    // Transform hospital-specific data to payment format
    const paymentRequest = {
      amount: invoice.totalAmount,
      currency: 'USD',
      customerId: invoice.patientId,
      metadata: {
        invoiceId: invoice.id,
        department: invoice.department,
        serviceType: 'hospital-billing'
      },
      lineItems: invoice.items.map(item => ({
        description: item.description,
        amount: item.amount,
        code: item.medicalCode
      }))
    };
    
    // Process through shared gateway
    const result = await this.paymentGateway.processPayment(paymentRequest);
    
    // Handle hospital-specific post-payment logic
    if (result.success) {
      await this.updateMedicalRecords(invoice.patientId, result.transactionId);
    }
    
    return result;
  }
}
```

### Event-Driven Payment Integration

```javascript
// Payment event handlers for different products
class PaymentEventRouter {
  constructor(eventBus) {
    this.handlers = new Map();
    this.eventBus = eventBus;
  }
  
  registerHandler(product, handler) {
    this.handlers.set(product, handler);
  }
  
  async routePaymentEvent(event) {
    const handler = this.handlers.get(event.metadata.sourceProduct);
    
    if (handler) {
      await handler.handlePaymentEvent(event);
    }
    
    // Publish to product-specific topic
    await this.eventBus.publish({
      topic: `${event.metadata.sourceProduct}.payment.events`,
      message: event
    });
  }
}
```

## 14. Developer Portal for API Discovery

### Backstage Developer Portal Configuration

```yaml
# Backstage catalog for team services
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: patient-service
  description: Hospital patient management service
  tags:
    - java
    - hospital-team
  annotations:
    github.com/project-slug: hospital-team/patient-service
    jenkins.io/job-full-name: hospital-team/patient-service
spec:
  type: service
  lifecycle: production
  owner: hospital-team
  system: hospital-management
  providesApis:
    - patient-api-v1
    - patient-api-v2
---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: patient-api-v1
  description: Patient management API v1
spec:
  type: openapi
  lifecycle: deprecated
  owner: hospital-team
  definition:
    $text: https://github.com/hospital-team/apis/patient-v1.yaml
```

### API Documentation Generation

```javascript
// Automated API documentation generator
class APIDocGenerator {
  async generateDocs(service) {
    const openApiSpec = await this.fetchOpenApiSpec(service);
    const examples = await this.generateExamples(openApiSpec);
    const sdkCode = await this.generateSDK(openApiSpec);
    
    return {
      specification: openApiSpec,
      interactiveDoc: this.generateSwaggerUI(openApiSpec),
      codeExamples: examples,
      sdkDownloads: {
        typescript: sdkCode.typescript,
        python: sdkCode.python,
        go: sdkCode.go
      },
      postmanCollection: this.generatePostmanCollection(openApiSpec)
    };
  }
}
```

## 15. Complete Implementation Examples for All Products

### Platform Overview with Technology Diversity

```yaml
# Platform products and their technology stacks
products:
  payment-gateway:
    team: fintech-team
    tech-stack: ["golang", "postgresql", "redis", "kafka"]
    role: shared-service-and-product
    
  hospital-management:
    team: healthcare-team
    tech-stack: ["java", "spring-boot", "oracle", "rabbitmq"]
    integrates-with: ["payment-gateway"]
    
  smart-hospitality:
    team: hospitality-team
    tech-stack: ["nodejs", "typescript", "mongodb", "mqtt"]
    integrates-with: ["payment-gateway", "iot-platform"]
    
  iot-platform:
    team: iot-team
    tech-stack: ["python", "fastapi", "timescaledb", "kafka"]
    integrates-with: ["payment-gateway"]
    
  blockchain-products:
    team: blockchain-team
    tech-stack: ["rust", "solidity", "leveldb", "ipfs"]
    integrates-with: ["payment-gateway"]
```

### 1. Payment Gateway Service (Go) - Shared Service & Product

```go
// payment-gateway/internal/service/payment_service.go
package service

import (
    "context"
    "github.com/shopspring/decimal"
)

type PaymentService struct {
    repo         PaymentRepository
    eventBus     EventPublisher
    providers    map[string]PaymentProvider
}

type PaymentRequest struct {
    Amount       decimal.Decimal        `json:"amount"`
    Currency     string                 `json:"currency"`
    CustomerID   string                 `json:"customer_id"`
    ProductTeam  string                 `json:"product_team"`
    Metadata     map[string]interface{} `json:"metadata"`
}

func (s *PaymentService) ProcessPayment(ctx context.Context, req PaymentRequest) (*PaymentResult, error) {
    // Default to SAR currency
    if req.Currency == "" {
        req.Currency = "SAR"
    }
    
    // Route based on product team requirements
    provider := s.selectProvider(req.ProductTeam, req.Amount)
    
    payment := &Payment{
        ID:          generatePaymentID(),
        Amount:      req.Amount,
        Currency:    req.Currency,
        Status:      "PENDING",
        ProductTeam: req.ProductTeam,
        Metadata:    req.Metadata,
    }
    
    // Process payment
    result, err := provider.ProcessPayment(ctx, payment)
    if err != nil {
        payment.Status = "FAILED"
        s.repo.Save(ctx, payment)
        return nil, err
    }
    
    payment.Status = "COMPLETED"
    payment.ProviderRef = result.TransactionID
    s.repo.Save(ctx, payment)
    
    // Publish event for subscribing products
    s.eventBus.Publish(ctx, PaymentCompletedEvent{
        PaymentID:    payment.ID,
        Amount:       payment.Amount.String(),
        Currency:     payment.Currency,
        ProductTeam:  payment.ProductTeam,
        Metadata:     payment.Metadata,
    })
    
    return result, nil
}

// Standalone payment product API
func (s *PaymentService) CreateMerchantAccount(ctx context.Context, req MerchantRequest) (*Merchant, error) {
    // Payment gateway as a product - merchant onboarding
    merchant := &Merchant{
        ID:            generateMerchantID(),
        BusinessName:  req.BusinessName,
        RegistrationNo: req.CommercialRegistration,
        Currency:      "SAR",
        SettlementAccount: req.BankAccount,
    }
    
    return s.repo.SaveMerchant(ctx, merchant)
}
```

### 2. Hospital Management System (Java/Spring Boot)

```java
// hospital-management/patient-service/src/main/java/com/hospital/service/BillingService.java
package com.hospital.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.math.BigDecimal;

@Service
public class BillingService {
    private final PaymentGatewayClient paymentClient;
    private final PatientRepository patientRepo;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Value("${hospital.currency}")
    private String currency = "SAR";
    
    public BillingResult processMedicalBill(String patientId, MedicalBill bill) {
        Patient patient = patientRepo.findById(patientId)
            .orElseThrow(() -> new PatientNotFoundException(patientId));
        
        // Calculate total with VAT (15% in Saudi Arabia)
        BigDecimal subtotal = bill.getItems().stream()
            .map(MedicalItem::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal vat = subtotal.multiply(new BigDecimal("0.15"));
        BigDecimal total = subtotal.add(vat);
        
        // Integrate with payment gateway
        PaymentRequest paymentReq = PaymentRequest.builder()
            .amount(total)
            .currency(currency)
            .customerId(patient.getNationalId())
            .productTeam("healthcare-team")
            .metadata(Map.of(
                "patientId", patientId,
                "billId", bill.getId(),
                "department", bill.getDepartment(),
                "insuranceClaim", bill.getInsuranceClaimNo()
            ))
            .build();
        
        PaymentResponse payment = paymentClient.processPayment(paymentReq);
        
        if (payment.isSuccess()) {
            bill.setPaymentStatus(PaymentStatus.PAID);
            bill.setPaymentReference(payment.getTransactionId());
            
            // Publish event for medical records
            kafkaTemplate.send("hospital.billing.events", 
                new BillPaidEvent(patientId, bill.getId(), payment.getTransactionId()));
        }
        
        return new BillingResult(bill, payment);
    }
}

// Integration with HL7 FHIR for interoperability
@RestController
@RequestMapping("/api/v1/fhir")
public class FHIRController {
    
    @PostMapping("/claim")
    public ResponseEntity<ClaimResponse> submitInsuranceClaim(@RequestBody Claim claim) {
        // Convert FHIR claim to internal format and process payment
        MedicalBill bill = fhirMapper.mapClaimToBill(claim);
        BillingResult result = billingService.processMedicalBill(
            claim.getPatient().getReference(), 
            bill
        );
        
        return ResponseEntity.ok(fhirMapper.mapToClaimResponse(result));
    }
}
```

### 3. Smart Hospitality Platform (Node.js/TypeScript)

```typescript
// smart-hospitality/booking-service/src/services/BookingService.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentGatewaySDK } from '@ncq/payment-sdk';
import { MqttService } from './MqttService';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking') private bookingModel: Model<Booking>,
    private paymentGateway: PaymentGatewaySDK,
    private mqttService: MqttService,
    private iotIntegration: IoTIntegrationService
  ) {}

  async createBooking(bookingRequest: CreateBookingDto): Promise<Booking> {
    // Calculate room rates in SAR
    const nights = this.calculateNights(
      bookingRequest.checkIn, 
      bookingRequest.checkOut
    );
    const baseRate = bookingRequest.roomRate * nights;
    const tourismFee = baseRate * 0.025; // 2.5% tourism fee
    const vat = baseRate * 0.15; // 15% VAT
    const totalAmount = baseRate + tourismFee + vat;

    // Create booking
    const booking = new this.bookingModel({
      guestId: bookingRequest.guestId,
      roomNumber: bookingRequest.roomNumber,
      checkIn: bookingRequest.checkIn,
      checkOut: bookingRequest.checkOut,
      totalAmount,
      currency: 'SAR',
      status: 'PENDING'
    });

    // Process payment through gateway
    const paymentResult = await this.paymentGateway.processPayment({
      amount: totalAmount,
      currency: 'SAR',
      customerId: bookingRequest.guestId,
      productTeam: 'hospitality-team',
      metadata: {
        bookingId: booking._id,
        roomNumber: bookingRequest.roomNumber,
        nights: nights,
        serviceType: 'room-booking'
      }
    });

    if (paymentResult.success) {
      booking.paymentId = paymentResult.transactionId;
      booking.status = 'CONFIRMED';
      
      // Notify IoT platform to prepare room
      await this.prepareRoomViaIoT(booking);
      
      // Publish booking confirmation
      this.mqttService.publish(
        `hospitality/bookings/${booking._id}/confirmed`,
        {
          bookingId: booking._id,
          roomNumber: booking.roomNumber,
          guestPreferences: await this.getGuestPreferences(bookingRequest.guestId)
        }
      );
    }

    return await booking.save();
  }

  private async prepareRoomViaIoT(booking: Booking): Promise<void> {
    // Integration with IoT platform
    const guestPreferences = await this.getGuestPreferences(booking.guestId);
    
    await this.iotIntegration.configureRoom({
      roomNumber: booking.roomNumber,
      temperature: guestPreferences.temperature || 22,
      lightingProfile: guestPreferences.lighting || 'default',
      checkInTime: booking.checkIn,
      guestId: booking.guestId
    });
  }
}

// WebSocket real-time updates
@WebSocketGateway()
export class BookingGateway {
  @SubscribeMessage('booking:status')
  async handleBookingStatus(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    // Real-time booking status updates
    const booking = await this.bookingService.getBooking(data.bookingId);
    client.emit('booking:update', {
      status: booking.status,
      room: booking.roomNumber,
      paymentStatus: booking.paymentId ? 'PAID' : 'PENDING'
    });
  }
}
```

### 4. IoT Platform (Python/FastAPI)

```python
# iot-platform/device_service/services/device_manager.py
from typing import Dict, List, Optional
from decimal import Decimal
from datetime import datetime
import asyncio
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Device, SensorReading, Alert
from app.integrations.payment_gateway import PaymentGatewayClient
from app.messaging.kafka_producer import KafkaProducer

class DeviceManager:
    def __init__(
        self, 
        db_session: AsyncSession,
        payment_client: PaymentGatewayClient,
        kafka_producer: KafkaProducer
    ):
        self.db = db_session
        self.payment_client = payment_client
        self.kafka = kafka_producer

    async def register_device(self, device_data: Dict) -> Device:
        """Register a new IoT device with usage-based billing setup"""
        device = Device(
            device_id=device_data['device_id'],
            device_type=device_data['type'],
            location=device_data['location'],
            customer_id=device_data['customer_id'],
            billing_plan='usage-based',
            currency='SAR'
        )
        
        # Setup recurring billing if required
        if device_data.get('requires_subscription'):
            payment_result = await self.payment_client.create_subscription({
                'amount': Decimal('99.00'),  # Monthly subscription in SAR
                'currency': 'SAR',
                'customer_id': device.customer_id,
                'product_team': 'iot-team',
                'interval': 'monthly',
                'metadata': {
                    'device_id': device.device_id,
                    'service_type': 'iot-monitoring'
                }
            })
            
            device.subscription_id = payment_result['subscription_id']
        
        self.db.add(device)
        await self.db.commit()
        
        # Publish device registration event
        await self.kafka.send_event(
            'iot.devices.registered',
            {
                'device_id': device.device_id,
                'customer_id': device.customer_id,
                'timestamp': datetime.utcnow().isoformat()
            }
        )
        
        return device

    async def process_sensor_data(
        self, 
        device_id: str, 
        readings: List[Dict]
    ) -> None:
        """Process sensor readings and trigger billing for data usage"""
        device = await self.get_device(device_id)
        
        # Store readings in TimescaleDB
        for reading in readings:
            sensor_reading = SensorReading(
                device_id=device_id,
                metric_name=reading['metric'],
                value=reading['value'],
                unit=reading['unit'],
                timestamp=reading['timestamp']
            )
            self.db.add(sensor_reading)
        
        # Calculate data usage charges (per 1000 readings)
        reading_count = len(readings)
        if reading_count >= 1000:
            usage_charges = Decimal('0.10') * (reading_count // 1000)  # 0.10 SAR per 1000 readings
            
            await self.payment_client.process_payment({
                'amount': usage_charges,
                'currency': 'SAR',
                'customer_id': device.customer_id,
                'product_team': 'iot-team',
                'metadata': {
                    'device_id': device_id,
                    'reading_count': reading_count,
                    'billing_type': 'data-usage'
                }
            })
        
        # Check for alerts
        await self.check_alerts(device_id, readings)
        
        await self.db.commit()

    async def configure_room_automation(
        self, 
        room_config: Dict
    ) -> Dict:
        """Integration with Smart Hospitality for room automation"""
        devices = await self.get_room_devices(room_config['room_number'])
        
        tasks = []
        for device in devices:
            if device.device_type == 'thermostat':
                tasks.append(
                    self.set_temperature(device.device_id, room_config['temperature'])
                )
            elif device.device_type == 'smart_light':
                tasks.append(
                    self.set_lighting(device.device_id, room_config['lighting_profile'])
                )
            elif device.device_type == 'smart_lock':
                tasks.append(
                    self.configure_access(device.device_id, room_config['guest_id'])
                )
        
        await asyncio.gather(*tasks)
        
        return {
            'room_number': room_config['room_number'],
            'devices_configured': len(devices),
            'status': 'ready'
        }

# FastAPI endpoints
from fastapi import APIRouter, Depends
from app.dependencies import get_device_manager

router = APIRouter()

@router.post("/devices/{device_id}/telemetry")
async def ingest_telemetry(
    device_id: str,
    telemetry: List[TelemetryReading],
    device_manager: DeviceManager = Depends(get_device_manager)
):
    """Ingest IoT device telemetry data"""
    await device_manager.process_sensor_data(
        device_id,
        [reading.dict() for reading in telemetry]
    )
    
    return {
        "status": "processed",
        "count": len(telemetry),
        "device_id": device_id
    }
```

### 5. Blockchain Products (Rust/Solidity)

```rust
// blockchain-products/payment-settlement/src/settlement_engine.rs
use tokio::sync::Mutex;
use web3::types::{Address, U256};
use ethers::prelude::*;
use std::sync::Arc;

pub struct SettlementEngine {
    payment_gateway_client: Arc<PaymentGatewayClient>,
    blockchain_provider: Arc<Provider<Http>>,
    settlement_contract: Address,
    wallet: LocalWallet,
}

impl SettlementEngine {
    pub async fn process_settlement(
        &self,
        merchant_id: &str,
        amount_sar: f64,
    ) -> Result<SettlementResult, SettlementError> {
        // Query accumulated transactions from payment gateway
        let transactions = self.payment_gateway_client
            .get_unsettled_transactions(merchant_id)
            .await?;
        
        let total_amount_sar = transactions.iter()
            .map(|tx| tx.amount)
            .sum::<f64>();
        
        // Convert SAR to blockchain native token (e.g., stablecoin)
        let amount_wei = self.convert_sar_to_wei(total_amount_sar);
        
        // Execute on-chain settlement
        let contract = SettlementContract::new(
            self.settlement_contract,
            self.blockchain_provider.clone()
        );
        
        let tx = contract
            .settle_merchant(
                merchant_id.parse()?,
                amount_wei,
                transactions.len() as u32,
            )
            .send()
            .await?
            .await?;
        
        // Record settlement in payment gateway
        let settlement_record = self.payment_gateway_client
            .record_settlement(RecordSettlementRequest {
                merchant_id: merchant_id.to_string(),
                amount: total_amount_sar,
                currency: "SAR".to_string(),
                blockchain_tx: format!("{:?}", tx.transaction_hash),
                product_team: "blockchain-team".to_string(),
                metadata: serde_json::json!({
                    "transaction_count": transactions.len(),
                    "block_number": tx.block_number,
                    "gas_used": tx.gas_used,
                }),
            })
            .await?;
        
        Ok(SettlementResult {
            settlement_id: settlement_record.id,
            blockchain_tx: tx.transaction_hash,
            amount_sar: total_amount_sar,
            transaction_count: transactions.len(),
        })
    }
    
    pub async fn create_payment_channel(
        &self,
        participant_a: &str,
        participant_b: &str,
        deposit_sar: f64,
    ) -> Result<PaymentChannel, ChannelError> {
        // Process deposit through payment gateway
        let deposit_result = self.payment_gateway_client
            .process_payment(PaymentRequest {
                amount: deposit_sar,
                currency: "SAR".to_string(),
                customer_id: participant_a.to_string(),
                product_team: "blockchain-team".to_string(),
                metadata: serde_json::json!({
                    "channel_type": "payment_channel",
                    "participant_b": participant_b,
                    "purpose": "channel_deposit"
                }),
            })
            .await?;
        
        // Deploy payment channel on blockchain
        let channel_address = self.deploy_channel_contract(
            participant_a,
            participant_b,
            self.convert_sar_to_wei(deposit_sar),
        ).await?;
        
        Ok(PaymentChannel {
            address: channel_address,
            participants: vec![participant_a.to_string(), participant_b.to_string()],
            deposit_amount_sar: deposit_sar,
            payment_reference: deposit_result.transaction_id,
        })
    }
}

// Solidity smart contract for settlements
// contracts/Settlement.sol
/*
pragma solidity ^0.8.0;

contract SettlementContract {
    mapping(address => uint256) public merchantBalances;
    mapping(address => uint256) public lastSettlement;
    
    event SettlementProcessed(
        address indexed merchant,
        uint256 amount,
        uint256 transactionCount,
        uint256 timestamp
    );
    
    function settleMerchant(
        address merchant,
        uint256 amount,
        uint32 transactionCount
    ) external onlyAuthorized {
        require(merchant != address(0), "Invalid merchant");
        require(amount > 0, "Amount must be positive");
        
        merchantBalances[merchant] += amount;
        lastSettlement[merchant] = block.timestamp;
        
        emit SettlementProcessed(
            merchant,
            amount,
            transactionCount,
            block.timestamp
        );
    }
}
*/
```

### Integration Testing Across Products

```typescript
// integration-tests/cross-product-flow.test.ts
import { test, expect } from '@playwright/test';

test('Complete cross-product payment flow', async ({ request }) => {
  // 1. Hospital creates a medical bill
  const billResponse = await request.post('/api/hospital/v1/bills', {
    data: {
      patientId: 'P123456',
      items: [
        { code: 'CONS001', description: 'Consultation', amount: 500.00 },
        { code: 'LAB001', description: 'Blood Test', amount: 200.00 }
      ],
      currency: 'SAR'
    }
  });
  
  const bill = await billResponse.json();
  expect(bill.total).toBe(805.00); // 700 + 15% VAT
  
  // 2. Payment processed through gateway
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const paymentStatus = await request.get(
    `/api/payments/v1/transactions/${bill.paymentId}`
  );
  expect(paymentStatus.status()).toBe(200);
  
  // 3. IoT platform receives payment event and activates medical equipment
  const iotEvents = await request.get('/api/iot/v1/events', {
    params: { 
      type: 'payment.completed',
      metadata_contains: 'CONS001'
    }
  });
  
  const events = await iotEvents.json();
  expect(events.length).toBeGreaterThan(0);
  expect(events[0].action).toBe('equipment.activated');
});
```

### Platform Monitoring Dashboard

```yaml
# Grafana dashboard configuration for all products
apiVersion: v1
kind: ConfigMap
metadata:
  name: platform-dashboard
data:
  dashboard.json: |
    {
      "title": "NCQ Multi-Product Platform",
      "panels": [
        {
          "title": "Payment Gateway Metrics",
          "targets": [
            {
              "expr": "sum(payment_transactions_total{currency=\"SAR\"}) by (product_team)"
            }
          ]
        },
        {
          "title": "Hospital Management Load",
          "targets": [
            {
              "expr": "rate(hospital_api_requests_total[5m])"
            }
          ]
        },
        {
          "title": "Smart Hospitality Bookings",
          "targets": [
            {
              "expr": "hospitality_bookings_total{status=\"confirmed\"}"
            }
          ]
        },
        {
          "title": "IoT Device Telemetry",
          "targets": [
            {
              "expr": "rate(iot_telemetry_ingested_bytes[5m])"
            }
          ]
        },
        {
          "title": "Blockchain Settlements",
          "targets": [
            {
              "expr": "blockchain_settlements_sar_total"
            }
          ]
        }
      ]
    }
```

This comprehensive implementation guide demonstrates how all five products (Payment Gateway, Hospital Management, Smart Hospitality, IoT Platform, and Blockchain) work autonomously with different technology stacks while seamlessly integrating through the payment gateway and shared platform services. Each team maintains complete control over their technology choices while adhering to common integration patterns and Saudi Arabian business requirements (SAR currency, VAT compliance).

### 6. NCQ LLM Platform (Python/FastAPI + Next.js)

NCQ LLM represents the most advanced product in the platform, offering intelligent language model services with multi-provider routing, local model support, and tenant-specific learning capabilities.

```python
# ncq-llm/backend/services/intelligent_gateway.py
from typing import Dict, List, Optional, AsyncIterator
from decimal import Decimal
import asyncio
from app.core.providers import ProviderManager
from app.services.model_management import ModelManager
from app.services.tenant_learning import TenantLearningService
from app.integrations.payment_gateway import PaymentGatewayClient

class IntelligentGateway:
    def __init__(
        self,
        provider_manager: ProviderManager,
        model_manager: ModelManager,
        learning_service: TenantLearningService,
        payment_client: PaymentGatewayClient
    ):
        self.providers = provider_manager
        self.models = model_manager
        self.learning = learning_service
        self.payment = payment_client

    async def route_request(
        self,
        request: ChatCompletionRequest,
        tenant_id: str,
        routing_strategy: str = "balanced"
    ) -> ChatCompletionResponse:
        """Intelligently route requests to optimal provider"""
        
        # Check if tenant has custom model
        tenant_model = await self.models.get_tenant_model(tenant_id)
        if tenant_model and request.model == "auto":
            return await self._use_tenant_model(tenant_model, request, tenant_id)
        
        # Select provider based on strategy
        provider_selection = await self._select_provider(
            request=request,
            strategy=routing_strategy,
            tenant_id=tenant_id
        )
        
        # Track usage for billing
        usage_metadata = {
            "tenant_id": tenant_id,
            "model": provider_selection.model,
            "provider": provider_selection.provider,
            "tokens": 0  # Will be updated after completion
        }
        
        try:
            # Execute request with fallback
            response = await self._execute_with_fallback(
                request=request,
                providers=provider_selection.ranked_providers,
                tenant_id=tenant_id
            )
            
            # Calculate costs in SAR
            usage_metadata["tokens"] = response.usage.total_tokens
            cost_sar = self._calculate_cost_sar(
                provider=provider_selection.provider,
                model=provider_selection.model,
                tokens=response.usage.total_tokens
            )
            
            # Process usage-based payment
            if cost_sar > Decimal('0.01'):  # Minimum billable amount
                await self.payment.process_payment({
                    'amount': float(cost_sar),
                    'currency': 'SAR',
                    'customer_id': tenant_id,
                    'product_team': 'llm-team',
                    'metadata': usage_metadata
                })
            
            # Store for learning if enabled
            if request.enable_learning:
                await self.learning.store_interaction(
                    tenant_id=tenant_id,
                    request=request,
                    response=response
                )
            
            # Add routing metadata
            response.ncq_metadata = {
                "routing": {
                    "strategy": routing_strategy,
                    "selected_provider": provider_selection.provider,
                    "selected_model": provider_selection.model,
                    "fallback_used": provider_selection.fallback_used,
                    "latency_ms": provider_selection.latency_ms
                },
                "cost": {
                    "amount_sar": str(cost_sar),
                    "tokens_used": response.usage.total_tokens
                }
            }
            
            return response
            
        except Exception as e:
            # Log failure and attempt with different provider
            await self._handle_routing_failure(e, request, tenant_id)
            raise

    async def download_model(
        self,
        model_key: str,
        admin_token: str
    ) -> Dict:
        """Download and setup local model"""
        
        # Verify admin permissions
        if not await self._verify_admin(admin_token):
            raise PermissionError("Admin access required")
        
        # Get model info
        model_info = self.models.AVAILABLE_MODELS.get(model_key)
        if not model_info:
            raise ValueError(f"Unknown model: {model_key}")
        
        # Process one-time setup fee
        setup_fee = Decimal('299.00')  # One-time model setup fee in SAR
        payment_result = await self.payment.process_payment({
            'amount': float(setup_fee),
            'currency': 'SAR',
            'customer_id': 'platform-admin',
            'product_team': 'llm-team',
            'metadata': {
                'model': model_key,
                'type': 'model-setup',
                'size_gb': model_info['size_gb']
            }
        })
        
        # Download model
        download_task = await self.models.download_model(model_key)
        
        return {
            "model": model_key,
            "status": "downloading",
            "payment_reference": payment_result['transaction_id'],
            "estimated_time_minutes": model_info['size_gb'] * 2  # Rough estimate
        }

    async def create_tenant_model(
        self,
        tenant_id: str,
        base_model: str,
        training_config: Dict
    ) -> Dict:
        """Create customized model for tenant"""
        
        # Check tenant subscription
        subscription = await self._check_tenant_subscription(tenant_id)
        if subscription.plan not in ['professional', 'enterprise']:
            raise ValueError("Professional or Enterprise plan required for custom models")
        
        # Create isolated model instance
        model = await self.models.create_tenant_model(
            tenant_id=tenant_id,
            base_model_key=base_model,
            config={
                **training_config,
                "isolation_level": "complete",
                "data_retention_days": 90
            }
        )
        
        # Setup continuous learning
        await self.learning.enable_auto_training(
            tenant_id=tenant_id,
            model_id=model.id,
            threshold=100  # Auto-train after 100 quality interactions
        )
        
        return {
            "model_id": model.id,
            "tenant_id": tenant_id,
            "base_model": base_model,
            "status": "ready",
            "learning_enabled": True
        }

    def _calculate_cost_sar(
        self,
        provider: str,
        model: str,
        tokens: int
    ) -> Decimal:
        """Calculate cost in Saudi Riyals"""
        
        # Provider rates per 1K tokens in SAR
        rates = {
            "openai": {
                "gpt-4": Decimal('0.11'),  # ~$0.03 -> SAR
                "gpt-3.5-turbo": Decimal('0.007')  # ~$0.002 -> SAR
            },
            "deepseek": {
                "deepseek-chat": Decimal('0.0004'),  # $0.0001 -> SAR
                "deepseek-coder": Decimal('0.0004')
            },
            "huggingface": {
                "default": Decimal('0.0')  # Free tier
            },
            "local": {
                "default": Decimal('0.0002')  # Infrastructure cost only
            }
        }
        
        rate = rates.get(provider, {}).get(model, Decimal('0.001'))
        return rate * Decimal(tokens) / Decimal('1000')

# Mobile app integration
@router.websocket("/ws/chat/{tenant_id}")
async def websocket_chat(
    websocket: WebSocket,
    tenant_id: str,
    gateway: IntelligentGateway = Depends(get_gateway)
):
    """WebSocket endpoint for mobile app streaming"""
    await websocket.accept()
    
    try:
        while True:
            # Receive message from mobile app
            data = await websocket.receive_json()
            
            # Stream response
            async for chunk in gateway.stream_completion(
                request=ChatCompletionRequest(**data),
                tenant_id=tenant_id
            ):
                await websocket.send_json({
                    "type": "stream",
                    "content": chunk.content,
                    "finish_reason": chunk.finish_reason
                })
                
    except WebSocketDisconnect:
        await gateway.finalize_stream_billing(tenant_id)
```

### NCQ LLM Frontend (Next.js + TypeScript)

```typescript
// ncq-llm/frontend/components/admin/ModelManagement.tsx
import { useState, useEffect } from 'react';
import { Card, Progress, Button, Select } from '@/components/ui';
import { usePayment } from '@/hooks/usePayment';
import { api } from '@/services/api';

export function ModelManagement() {
  const [availableModels, setAvailableModels] = useState([]);
  const [downloads, setDownloads] = useState({});
  const { processPayment } = usePayment();

  const downloadModel = async (modelKey: string) => {
    try {
      // Show payment confirmation
      const model = availableModels.find(m => m.key === modelKey);
      const confirmed = await processPayment({
        amount: 299.00,
        currency: 'SAR',
        description: `Download ${model.name} (${model.size_gb}GB)`,
        type: 'one-time'
      });

      if (confirmed) {
        const result = await api.models.download(modelKey);
        
        // Track download progress
        const ws = new WebSocket(`${API_WS_URL}/downloads/${result.download_id}`);
        ws.onmessage = (event) => {
          const progress = JSON.parse(event.data);
          setDownloads(prev => ({
            ...prev,
            [modelKey]: progress
          }));
        };
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Local Model Management</h2>
        <p className="text-gray-600 mb-6">
          Download and deploy models locally for 90%+ cost savings
        </p>
        
        <div className="grid gap-4">
          {availableModels.map(model => (
            <div key={model.key} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {model.size_gb}GB | Context: {model.context_length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Setup Fee</p>
                  <p className="text-lg font-bold">299 SAR</p>
                </div>
              </div>
              
              {downloads[model.key] ? (
                <Progress 
                  value={downloads[model.key].progress} 
                  className="mt-4"
                />
              ) : (
                <Button 
                  onClick={() => downloadModel(model.key)}
                  className="mt-4"
                  disabled={model.downloaded}
                >
                  {model.downloaded ? 'Downloaded' : 'Download Model'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <TenantModelsSection />
      <UsageAnalytics />
    </div>
  );
}

// Real-time admin dashboard
export function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    apiCalls: 0,
    tokensUsed: 0,
    revenue: 0,
    modelDistribution: {}
  });

  useEffect(() => {
    // Real-time metrics via WebSocket
    const ws = new WebSocket(`${API_WS_URL}/admin/metrics`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(prev => ({
        ...prev,
        ...data
      }));
    };

    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Monthly Revenue"
        value={`${metrics.revenue.toLocaleString()} SAR`}
        change="+23%"
        icon="💰"
      />
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        change="+12%"
        icon="👥"
      />
      <MetricCard
        title="API Calls (24h)"
        value={metrics.apiCalls.toLocaleString()}
        change="+45%"
        icon="📊"
      />
      <MetricCard
        title="Tokens Used"
        value={`${(metrics.tokensUsed / 1e6).toFixed(1)}M`}
        change="+67%"
        icon="🔤"
      />
      
      <ModelUsageChart data={metrics.modelDistribution} />
      <RevenueByPlanChart />
      <SystemHealthMonitor />
    </div>
  );
}
```

### NCQ LLM Mobile App (React Native + Expo)

```typescript
// ncq-llm/mobile/app/(tabs)/chat.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { ModelSelector } from '@/components/ModelSelector';
import { api } from '@/services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [routingStrategy, setRoutingStrategy] = useState('balanced');
  const { user } = useAuth();
  const { sendMessage, onMessage } = useWebSocket();

  // Voice input handling
  const startListening = useCallback(async () => {
    try {
      await Voice.start('ar-SA'); // Arabic (Saudi Arabia)
      setIsListening(true);
    } catch (e) {
      console.error('Voice start error:', e);
    }
  }, []);

  // Process chat messages
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    
    // Add user message
    setMessages(prev => GiftedChat.append(prev, newMessages));
    
    // Show typing indicator
    setMessages(prev => [...prev, {
      _id: 'typing',
      text: '...',
      user: { _id: 2, name: 'AI' },
      createdAt: new Date(),
    }]);

    try {
      // Send via WebSocket for streaming
      const response = await api.chat.stream({
        messages: [{ role: 'user', content: message.text }],
        model: selectedModel,
        routing_strategy: routingStrategy,
        tenant_id: user.organization_id,
        enable_learning: true
      });

      let aiResponse = '';
      
      // Handle streaming chunks
      response.onChunk((chunk) => {
        aiResponse += chunk.content;
        
        // Update AI message
        setMessages(prev => {
          const filtered = prev.filter(m => m._id !== 'typing');
          const aiMessage = {
            _id: Math.random().toString(),
            text: aiResponse,
            user: { _id: 2, name: 'AI' },
            createdAt: new Date(),
            metadata: chunk.metadata
          };
          return [aiMessage, ...filtered.slice(1)];
        });
      });

      response.onComplete((usage) => {
        // Show cost estimate
        showCostNotification(usage.cost_sar);
        
        // Text-to-speech for response
        if (user.preferences?.enableVoiceOutput) {
          Speech.speak(aiResponse, {
            language: 'ar-SA',
            rate: 0.9
          });
        }
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.filter(m => m._id !== 'typing'));
    }
  }, [selectedModel, routingStrategy, user]);

  // Voice results
  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value[0]) {
        onSend([{
          _id: Math.random().toString(),
          text: e.value[0],
          user: { _id: 1 },
          createdAt: new Date(),
        }]);
      }
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSend]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <ModelSelector
          selected={selectedModel}
          onSelect={setSelectedModel}
          strategy={routingStrategy}
          onStrategyChange={setRoutingStrategy}
        />
        
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderActions={() => (
            <VoiceInputButton
              isListening={isListening}
              onPress={isListening ? Voice.stop : startListening}
            />
          )}
          renderBubble={renderBubble}
          renderFooter={renderFooter}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
```

### Cross-Product Integration with NCQ LLM

```python
# Integration example: Hospital Management using NCQ LLM
class MedicalAssistantIntegration:
    def __init__(self, llm_client: NCQLLMClient, hospital_db: Database):
        self.llm = llm_client
        self.db = hospital_db
        
    async def analyze_patient_symptoms(
        self,
        patient_id: str,
        symptoms: List[str],
        medical_history: Dict
    ) -> Dict:
        """Use NCQ LLM to analyze symptoms with medical knowledge"""
        
        # Prepare context from patient history
        context = await self._prepare_medical_context(patient_id, medical_history)
        
        # Query LLM with medical-specific routing
        response = await self.llm.complete({
            "messages": [
                {
                    "role": "system",
                    "content": "You are a medical assistant. Analyze symptoms and suggest possible conditions. Always recommend consulting a healthcare professional."
                },
                {
                    "role": "user",
                    "content": f"Patient symptoms: {', '.join(symptoms)}\nMedical history: {context}"
                }
            ],
            "model": "auto",
            "routing_strategy": "capability_matched",  # Selects best medical model
            "tenant_id": "hospital-tenant",
            "enable_learning": True,
            "metadata": {
                "patient_id": patient_id,
                "integration": "medical-assistant"
            }
        })
        
        # Process and structure the response
        analysis = self._parse_medical_analysis(response.content)
        
        # Store for hospital records
        await self.db.patient_interactions.insert({
            "patient_id": patient_id,
            "interaction_type": "ai_symptom_analysis",
            "symptoms": symptoms,
            "analysis": analysis,
            "llm_response_id": response.id,
            "timestamp": datetime.utcnow(),
            "cost_sar": response.ncq_metadata["cost"]["amount_sar"]
        })
        
        return analysis

# IoT Platform using NCQ LLM for anomaly explanation
class IoTAnomalyExplainer:
    async def explain_anomaly(self, device_id: str, anomaly_data: Dict):
        response = await self.llm.complete({
            "messages": [
                {
                    "role": "system",
                    "content": "Explain IoT sensor anomalies in simple terms for facility managers."
                },
                {
                    "role": "user",
                    "content": f"Device {device_id} shows: {anomaly_data}"
                }
            ],
            "model": "auto",
            "routing_strategy": "cost_optimized",  # Use cheaper model for explanations
            "tenant_id": "iot-tenant"
        })
        
        return response.content
```

### Platform-Wide NCQ LLM Benefits

1. **Cost Optimization**: 90%+ savings with local models for government organizations
2. **Data Privacy**: Complete tenant isolation with on-premise deployment options
3. **Continuous Learning**: Each organization's AI gets smarter over time
4. **Multi-Language**: Native Arabic support for Saudi market
5. **Integration Ready**: Easy integration with all NCQ products

This implementation positions NCQ LLM as a strategic platform service that enhances all other products while operating as a standalone SaaS offering. The intelligent routing, local model support, and tenant-specific learning create significant competitive advantages in the Saudi Arabian market.