# NCQ Products - Detailed Implementation Plans

## 1. NCQ Payment Gateway - Saudi Bank Integration (MOST CRITICAL)

### Overview
The payment gateway is the revenue backbone for all NCQ products. Without it, no product can process payments or generate revenue.

### Current State
- Basic Spring Boot structure exists
- Payment state machine implemented
- Database models ready
- Mock processors for MADA/SADAD
- No actual bank connections

### Implementation Tasks

#### A. Saudi Bank API Integration

**SABB (Saudi British Bank) Integration**
```
1. Obtain API credentials and merchant account
2. Implement authentication flow:
   - OAuth2 bearer token generation
   - API key management
   - Certificate pinning for security
3. Implement payment endpoints:
   - Payment initiation
   - Payment status check
   - Refund processing
   - Settlement file download
4. Add request/response mapping for SABB format
5. Implement webhook handlers for async notifications
6. Add retry logic with exponential backoff
```

**Al Rajhi Bank Integration**
```
1. Register for Al Rajhi developer portal
2. Implement SOAP/REST adapter (they use both)
3. Add digital signature for requests
4. Implement:
   - Direct debit authorization
   - Credit card processing
   - SADAD bill payment
   - Installment options
5. Handle Arabic/English response formats
6. Implement reconciliation file parser
```

**NCB (National Commercial Bank) Integration**
```
1. Implement NCB QuickPay integration
2. Add token-based authentication
3. Implement:
   - One-time payment
   - Recurring payment
   - Merchant wallet management
4. Add fraud check integration
5. Implement settlement reporting
```

#### B. 3D Secure 2.0 Implementation

```java
// Complete the ThreeDSecureService.java

public class ThreeDSecureService {
    
    // 1. Implement device fingerprinting
    public ThreeDSEnrollment checkEnrollment(CardDetails card) {
        // Connect to card scheme directory server
        // Check if card is enrolled in 3DS
        // Return enrollment status and ACS URL
    }
    
    // 2. Implement authentication flow
    public ThreeDSAuthentication authenticate(ThreeDSRequest request) {
        // Create authentication request (AReq)
        // Send to ACS via directory server
        // Handle challenge flow if required
        // Process authentication response (ARes)
    }
    
    // 3. Implement challenge handling
    public ChallengeResponse handleChallenge(String transactionId, String challengeData) {
        // Display challenge to user
        // Collect user response
        // Submit to ACS
        // Return final authentication result
    }
}
```

#### C. PCI DSS Compliance

**Tokenization Implementation**
```
1. Create vault service for secure storage
2. Implement card tokenization:
   - Generate unique token for each card
   - Store encrypted card data
   - Map tokens to merchant accounts
3. Add token lifecycle management:
   - Token creation
   - Token update
   - Token deletion
   - Token audit trail
```

**Encryption Service Enhancement**
```
1. Implement field-level encryption
2. Add key rotation mechanism
3. Implement secure key storage (HSM integration)
4. Add encryption for:
   - Card numbers (AES-256)
   - CVV (never store, only transmit)
   - Personal data (tokenize)
```

#### D. Reconciliation System

```java
public class ReconciliationService {
    
    // 1. Implement file parsers for each bank
    public ReconciliationReport parseSettlementFile(MultipartFile file, BankType bank) {
        switch(bank) {
            case SABB: return parseSABBFile(file);
            case ALRAJHI: return parseAlRajhiFile(file);
            case NCB: return parseNCBFile(file);
        }
    }
    
    // 2. Implement automated matching
    public void reconcileTransactions() {
        // Fetch pending transactions
        // Match with bank settlement data
        // Flag discrepancies
        // Update transaction statuses
        // Generate variance report
    }
    
    // 3. Add scheduled reconciliation
    @Scheduled(cron = "0 0 6 * * *") // Daily at 6 AM
    public void dailyReconciliation() {
        // Download settlement files from banks
        // Process each file
        // Send reports to finance team
        // Update dashboard metrics
    }
}
```

#### E. Risk Management Enhancement

```java
public class EnhancedFraudDetectionService {
    
    // 1. Implement ML-based scoring
    public RiskScore calculateRiskScore(Transaction transaction) {
        // Device fingerprint analysis
        // Behavioral analysis
        // Velocity checks
        // Geolocation verification
        // Transaction pattern analysis
        return mlModel.predict(features);
    }
    
    // 2. Real-time monitoring
    public void monitorTransaction(Transaction transaction) {
        // Check against blacklists
        // Verify against rules engine
        // Check velocity limits
        // Analyze spending patterns
        // Flag suspicious activities
    }
    
    // 3. Automated response
    public FraudAction determineAction(RiskScore score) {
        if (score.isHigh()) return FraudAction.BLOCK;
        if (score.isMedium()) return FraudAction.ADDITIONAL_VERIFICATION;
        return FraudAction.ALLOW;
    }
}
```

### Testing Strategy

1. **Bank Sandbox Testing**
   - Test each bank's sandbox environment
   - Verify all payment scenarios
   - Test error handling
   - Validate webhook processing

2. **Security Testing**
   - PCI DSS compliance scan
   - Penetration testing
   - Vulnerability assessment
   - Load testing for DDoS protection

3. **Integration Testing**
   - End-to-end payment flows
   - Multi-currency transactions
   - Refund processing
   - Reconciliation accuracy

---

## 2. NCQ Platform - Billing Integration

### Overview
Connect the NCQ Platform with the Payment Gateway to enable subscription management and billing across all products.

### Current State
- Tenant management exists
- Usage tracking implemented
- Plan types defined
- No actual billing logic

### Implementation Tasks

#### A. Subscription Service Implementation

```typescript
// services/billing-service/src/services/subscription.service.ts

export class SubscriptionService {
    
    // 1. Implement subscription lifecycle
    async createSubscription(tenantId: string, planId: string) {
        // Create subscription record
        // Set up recurring payment with NCQ PGW
        // Initialize usage quotas
        // Send welcome email
        // Create first invoice
    }
    
    // 2. Plan management
    async changePlan(subscriptionId: string, newPlanId: string) {
        // Calculate proration
        // Update payment schedule
        // Adjust resource limits
        // Notify tenant of changes
        // Update billing cycle
    }
    
    // 3. Usage-based billing
    async calculateUsageCharges(tenantId: string) {
        // Aggregate usage metrics
        // Apply pricing rules
        // Calculate overages
        // Generate line items
        // Create usage invoice
    }
}
```

#### B. Invoice Generation System

```typescript
// services/billing-service/src/services/invoice.service.ts

export class InvoiceService {
    
    // 1. Invoice generation
    async generateInvoice(subscription: Subscription) {
        const invoice = {
            subscriptionFees: await this.calculateSubscriptionFees(subscription),
            usageCharges: await this.calculateUsageCharges(subscription),
            taxes: await this.calculateTaxes(subscription),
            credits: await this.applyCredits(subscription)
        };
        
        // Generate PDF
        // Store in file service
        // Send to payment gateway
        // Email to customer
    }
    
    // 2. Payment processing
    async processPayment(invoiceId: string) {
        // Call NCQ Payment Gateway
        // Handle success/failure
        // Update invoice status
        // Provision/deprovision services
    }
}
```

#### C. Billing Portal UI

```typescript
// frontend/user-portal/src/pages/billing/*

// 1. Subscription management page
const SubscriptionPage = () => {
    // Current plan display
    // Plan comparison table
    // Upgrade/downgrade buttons
    // Cancellation flow
};

// 2. Invoice history page
const InvoicesPage = () => {
    // Invoice list with filters
    // Download PDF functionality
    // Payment status indicators
    // Pay outstanding invoices
};

// 3. Payment methods page
const PaymentMethodsPage = () => {
    // Add/remove cards
    // Set default payment method
    // Bank account management
    // Payment history
};

// 4. Usage dashboard
const UsageDashboard = () => {
    // Real-time usage metrics
    // Usage trends charts
    // Quota warnings
    // Overage projections
};
```

#### D. Integration with Products

```typescript
// 1. Hospital Management Integration
class HospitalBillingAdapter {
    // Track patient records count
    // Monitor appointment volume
    // Calculate storage usage
    // Apply healthcare-specific pricing
}

// 2. NCQ LLM Integration
class LLMBillingAdapter {
    // Track API calls
    // Monitor token usage
    // Calculate model training costs
    // Apply tier-based pricing
}

// 3. Blockchain Integration
class BlockchainBillingAdapter {
    // Track transaction volume
    // Monitor node hours
    // Calculate storage costs
    // Apply network usage fees
}
```

### Database Schema Updates

```sql
-- Subscription tables
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    plan_id VARCHAR(50),
    status VARCHAR(20),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN,
    trial_end TIMESTAMP
);

-- Invoice tables
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    subscription_id UUID REFERENCES subscriptions(id),
    amount_due DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20),
    due_date DATE,
    paid_at TIMESTAMP
);

-- Usage tracking
CREATE TABLE usage_records (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    product VARCHAR(50),
    metric_name VARCHAR(100),
    quantity DECIMAL(10,4),
    timestamp TIMESTAMP
);
```

---

## 3. NCQ LLM - Real AI Implementation

### Overview
Replace mock responses with actual LLM inference capabilities.

### Current State
- API structure complete
- Provider framework ready
- All responses are mocked
- No actual model loading

### Implementation Tasks

#### A. Model Serving Infrastructure

```python
# backend/services/inference_service.py

class ModelInferenceService:
    
    def __init__(self):
        self.model_registry = {}
        self.setup_inference_engines()
    
    # 1. Setup vLLM for high-performance inference
    def setup_vllm_engine(self):
        from vllm import LLM, SamplingParams
        
        # Initialize vLLM with GPU
        self.vllm_engine = LLM(
            model="meta-llama/Llama-2-7b-chat-hf",
            tensor_parallel_size=2,  # Number of GPUs
            max_model_len=4096,
            dtype="float16"
        )
    
    # 2. Implement model loading
    async def load_model(self, model_id: str, tenant_id: str):
        # Check if model is cached
        # Download from HuggingFace if needed
        # Apply tenant-specific LoRA if exists
        # Load into GPU memory
        # Register in model registry
    
    # 3. Implement inference
    async def generate(self, request: ChatCompletionRequest) -> ChatCompletionResponse:
        # Select appropriate model
        # Prepare prompt with chat template
        # Run inference
        # Stream or return response
        # Track usage for billing
```

#### B. Multi-Model Router

```python
# backend/services/router_service.py

class ModelRouter:
    
    # 1. Intelligent routing based on request
    def select_model(self, request: ChatRequest) -> ModelConfig:
        # Analyze request requirements
        # Check context length needs
        # Consider latency requirements
        # Factor in cost constraints
        # Return optimal model choice
    
    # 2. Implement fallback logic
    async def execute_with_fallback(self, request: ChatRequest):
        primary_model = self.select_model(request)
        
        try:
            return await self.inference_service.generate(
                request, primary_model
            )
        except ModelOverloadError:
            # Try secondary model
            fallback_model = self.get_fallback_model(primary_model)
            return await self.inference_service.generate(
                request, fallback_model
            )
```

#### C. Local Model Management

```python
# backend/services/model_manager.py

class LocalModelManager:
    
    # 1. Model downloading service
    async def download_model(self, model_id: str):
        # Use HuggingFace Hub API
        # Download model files
        # Verify checksums
        # Extract to model directory
        # Update model registry
    
    # 2. Model optimization
    async def optimize_model(self, model_id: str):
        # Quantize to INT8/INT4
        # Apply flash attention
        # Compile with TorchScript
        # Cache optimized version
    
    # 3. Fine-tuning service
    async def fine_tune_model(self, base_model: str, dataset: Dataset):
        # Prepare training data
        # Setup LoRA/QLoRA config
        # Run training job
        # Validate performance
        # Save adapter weights
```

#### D. Multimodal Processing

```python
# backend/services/multimodal_service.py

class MultimodalService:
    
    # 1. Image processing
    async def process_image(self, image: UploadFile, prompt: str):
        # Load vision model (LLaVA, CLIP)
        # Encode image
        # Generate description
        # Combine with text prompt
    
    # 2. Audio processing
    async def process_audio(self, audio: UploadFile):
        # Use Whisper for transcription
        # Extract audio features
        # Return text + metadata
    
    # 3. Document processing
    async def process_document(self, document: UploadFile):
        # Extract text (OCR if needed)
        # Parse structure
        # Create embeddings
        # Store in vector DB
```

#### E. Production Deployment

```yaml
# kubernetes/deployments/llm-inference.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: inference-server
        image: ncq-llm-inference:latest
        resources:
          limits:
            nvidia.com/gpu: 2  # Request 2 GPUs
            memory: 32Gi
            cpu: 8
        env:
        - name: MODEL_CACHE_DIR
          value: /models
        - name: CUDA_VISIBLE_DEVICES
          value: "0,1"
        volumeMounts:
        - name: model-cache
          mountPath: /models
      volumes:
      - name: model-cache
        persistentVolumeClaim:
          claimName: model-storage
```

### Performance Optimization

1. **Caching Strategy**
   ```python
   # Implement semantic caching
   class SemanticCache:
       def __init__(self):
           self.vector_db = ChromaDB()
       
       async def get_cached_response(self, prompt: str):
           # Generate embedding
           # Search similar prompts
           # Return if similarity > threshold
   ```

2. **Batching Requests**
   ```python
   # Batch multiple requests for efficiency
   class BatchProcessor:
       async def process_batch(self, requests: List[ChatRequest]):
           # Group by model
           # Prepare batch
           # Run inference
           # Distribute responses
   ```

3. **Model Quantization**
   ```python
   # Reduce model size for faster inference
   def quantize_model(model_path: str):
       # Load model
       # Apply INT8 quantization
       # Calibrate on sample data
       # Save quantized version
   ```

---

## 4. Production Infrastructure & Security

### Overview
Set up secure, scalable infrastructure for all NCQ products.

### Implementation Tasks

#### A. Kubernetes Infrastructure

```yaml
# infrastructure/k8s/base/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ncq-production
---
# Resource Quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "1000"
    requests.memory: 2000Gi
    requests.nvidia.com/gpu: 10
```

#### B. Secrets Management

```yaml
# 1. HashiCorp Vault Setup
# terraform/vault/main.tf

resource "vault_mount" "ncq_secrets" {
  path = "ncq-secrets"
  type = "kv-v2"
}

# 2. Kubernetes Integration
resource "vault_auth_backend" "kubernetes" {
  type = "kubernetes"
}

# 3. Database Credentials Rotation
resource "vault_database_secret_backend_connection" "postgres" {
  backend       = vault_mount.database.path
  name          = "postgres"
  allowed_roles = ["ncq-app"]
  
  postgresql {
    connection_url = "postgresql://{{username}}:{{password}}@postgres:5432/ncq"
  }
}
```

#### C. Security Hardening

```nginx
# 1. Web Application Firewall (WAF)
# nginx/modsecurity.conf

SecRuleEngine On
SecRequestBodyAccess On
SecRule REQUEST_HEADERS:Content-Type "text/xml" \
     "id:1,phase:1,t:none,t:lowercase,deny,msg:'XML content blocked'"

# 2. Rate Limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;

# 3. DDoS Protection
# Cloudflare configuration
resource "cloudflare_rate_limit" "api_limit" {
  zone_id = var.cloudflare_zone_id
  threshold = 50
  period = 60
  match {
    request {
      url_pattern = "*/api/*"
    }
  }
}
```

#### D. Monitoring & Observability

```yaml
# 1. Prometheus Setup
# monitoring/prometheus/values.yaml

prometheus:
  prometheusSpec:
    retention: 30d
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 100Gi
    additionalScrapeConfigs:
      - job_name: 'ncq-apps'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true

# 2. Grafana Dashboards
# monitoring/grafana/dashboards/

- Payment Gateway Dashboard
  - Transaction success rate
  - Payment method distribution
  - Response time percentiles
  - Error rate by bank

- Platform Health Dashboard
  - Service availability
  - API latency
  - Resource utilization
  - Active users by tenant

# 3. Alerting Rules
groups:
  - name: payment-gateway
    rules:
      - alert: HighPaymentFailureRate
        expr: rate(payment_failures_total[5m]) > 0.1
        annotations:
          summary: "High payment failure rate detected"
      
      - alert: BankAPIDown
        expr: up{job="bank-api"} == 0
        for: 2m
        annotations:
          summary: "Bank API is down"
```

#### E. Backup & Disaster Recovery

```bash
# 1. Database Backup Strategy
# scripts/backup/postgres-backup.sh

#!/bin/bash
# Automated PostgreSQL backup with encryption

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/postgres"

# Backup all databases
pg_dumpall -h $POSTGRES_HOST -U $POSTGRES_USER | \
  gzip | \
  openssl enc -aes-256-cbc -salt -k $ENCRYPTION_KEY | \
  aws s3 cp - s3://ncq-backups/postgres/backup_${TIMESTAMP}.sql.gz.enc

# 2. Disaster Recovery Plan
# terraform/dr/main.tf

# Multi-region setup
module "dr_region" {
  source = "./modules/infrastructure"
  region = "eu-west-1"  # DR region
  
  # Replicate critical services
  services = [
    "payment-gateway",
    "auth-service",
    "database-replica"
  ]
}

# 3. Data Replication
resource "aws_db_instance" "replica" {
  replicate_source_db = aws_db_instance.primary.id
  instance_class      = "db.r5.large"
  publicly_accessible = false
}
```

#### F. CI/CD Pipeline Enhancement

```yaml
# .github/workflows/production-deploy.yml

name: Production Deployment

on:
  push:
    tags:
      - 'v*'

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Run Trivy Security Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
          
      - name: SonarQube Analysis
        uses: sonarsource/sonarqube-scan-action@master
        
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
  
  deploy:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Blue-green deployment
          kubectl apply -f k8s/production/
          kubectl wait --for=condition=ready pod -l version=green
          kubectl patch service ncq-app -p '{"spec":{"selector":{"version":"green"}}}'
          kubectl delete deployment ncq-app-blue
```

### Performance Optimization

1. **Database Optimization**
   ```sql
   -- Add appropriate indexes
   CREATE INDEX idx_transactions_merchant_date ON transactions(merchant_id, created_at);
   CREATE INDEX idx_subscriptions_tenant_status ON subscriptions(tenant_id, status);
   
   -- Partition large tables
   CREATE TABLE transactions_2024 PARTITION OF transactions
   FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
   ```

2. **Caching Strategy**
   ```typescript
   // Implement multi-layer caching
   class CacheService {
     // L1: In-memory cache (Node.js)
     private memoryCache = new NodeCache();
     
     // L2: Redis cache
     private redisCache = new Redis();
     
     // L3: CDN cache
     private cdnCache = new CloudflareCache();
   }
   ```

3. **Load Testing**
   ```javascript
   // k6 load test script
   import http from 'k6/http';
   import { check } from 'k6';
   
   export let options = {
     stages: [
       { duration: '5m', target: 100 },
       { duration: '10m', target: 1000 },
       { duration: '5m', target: 0 },
     ],
   };
   
   export default function() {
     let response = http.post('https://api.ncq.sa/v1/payments', {
       amount: 100,
       currency: 'SAR',
       method: 'mada'
     });
     
     check(response, {
       'status is 200': (r) => r.status === 200,
       'response time < 500ms': (r) => r.timings.duration < 500,
     });
   }
   ```