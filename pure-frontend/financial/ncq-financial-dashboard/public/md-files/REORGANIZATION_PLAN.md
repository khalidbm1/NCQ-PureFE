# NCQ SaaS Platform Reorganization Plan

## Overview
NCQ co is a comprehensive SaaS platform containing multiple products and core technologies that integrate with each other.

## Proposed Directory Structure

```
NCQ co/
├── Core Technologies/
│   ├── IoT Platform/           # Core IoT services (MQTT, sensors, edge computing)
│   └── Blockchain/             # Corda + Hyperledger implementations
│       ├── Corda/
│       └── Hyperledger/
│
├── Products/
│   ├── Hospital Management/    # Uses Blockchain for patient records + IoT for monitoring
│   │   └── hospital-saas/
│   │
│   ├── Smart Hospitality/      # NEW - Uses IoT for smart hotels/buildings
│   │   ├── backend/           # Node.js/TypeScript API
│   │   ├── frontend/          # React/Next.js
│   │   ├── mobile/            # React Native app
│   │   └── iot-integration/   # Integration with Core IoT
│   │
│   ├── NCQ LLM/               # AI Platform
│   │   └── llm-saas/
│   │
│   ├── NCQ Mobile LLM/        # Mobile version of LLM
│   │   └── mobile/
│   │
│   ├── NCQ PGW/               # Payment Gateway (shared service)
│   │   └── ncq-payment-gateway/
│   │
│   └── NCQ Mobile App/        # Mirror of NCQ Platform
│       └── mobile-app/
│
├── NCQ Platform/              # Main platform that orchestrates everything
│   ├── services/
│   ├── frontend/
│   └── infrastructure/
│
├── Shared Services/           # Services used across all products
│   ├── Authentication/
│   ├── Payment Integration/   # Uses NCQ PGW
│   ├── Notification/
│   └── Analytics/
│
└── Documentation/
    ├── smart-hospitality-srs.md
    ├── iot-platform-srs.md
    ├── hospital-management-srs.md
    └── ...
```

## Implementation Plan

### Phase 1: Create Smart Hospitality Product

1. **Directory Structure**:
   ```
   Products/Smart Hospitality/
   ├── backend/
   │   ├── src/
   │   │   ├── api/
   │   │   ├── services/
   │   │   ├── models/
   │   │   ├── iot-integration/    # Connect to Core IoT
   │   │   └── config/
   │   ├── package.json
   │   └── Dockerfile
   │
   ├── frontend/
   │   ├── src/
   │   │   ├── pages/
   │   │   │   ├── dashboard/
   │   │   │   ├── rooms/
   │   │   │   ├── bookings/
   │   │   │   ├── iot-controls/
   │   │   │   └── analytics/
   │   │   └── components/
   │   ├── package.json
   │   └── Dockerfile
   │
   ├── mobile/
   │   ├── src/
   │   │   ├── screens/
   │   │   ├── services/
   │   │   └── components/
   │   └── package.json
   │
   ├── iot-integration/
   │   ├── device-templates/      # Room sensors, HVAC, lighting
   │   ├── automation-rules/      # Energy saving, comfort rules
   │   └── edge-gateway/          # Local processing
   │
   ├── docker-compose.yml
   └── README.md
   ```

2. **Features to Implement**:
   - Property Management System (PMS)
   - IoT-enabled room automation
   - Booking and reservation management
   - Guest mobile app with room controls
   - Energy management dashboard
   - Housekeeping coordination
   - Integration with Core IoT Platform

3. **IoT Integration Points**:
   - Room sensors (temperature, humidity, occupancy)
   - Smart lighting control
   - HVAC automation
   - Door locks and access control
   - Energy monitoring
   - Predictive maintenance alerts

### Phase 2: Reorganize Existing Products

1. Move existing directories to new structure
2. Update import paths and configurations
3. Create shared service integrations
4. Update docker-compose files for new paths

### Phase 3: Integration Setup

1. **Smart Hospitality ↔ IoT Platform**:
   - MQTT broker connection
   - Device provisioning API
   - Real-time data streaming
   - Edge gateway configuration

2. **Smart Hospitality ↔ NCQ PGW**:
   - Booking payments
   - Service charges
   - Billing integration

3. **Smart Hospitality ↔ NCQ Platform**:
   - SSO authentication
   - Centralized monitoring
   - Analytics dashboard

### Port Allocation for Demo

**Smart Hospitality**:
- Frontend: 4000
- Backend API: 4001
- Mobile API: 4002
- IoT Gateway: 1883 (MQTT)

This ensures no conflicts with:
- NCQ Platform: 3000-3004, 8001-8004
- Hospital Management: 5001, 3005
- NCQ LLM: 8000, 3006

## Benefits of This Structure

1. **Clear Separation**: Core technologies vs Products
2. **Reusability**: IoT and Blockchain can be used by multiple products
3. **Scalability**: Easy to add new products
4. **Integration**: Clear integration points between products
5. **Maintenance**: Easier to maintain and update individual products

## Next Steps

1. Create Smart Hospitality directory structure
2. Implement basic PMS functionality
3. Integrate with Core IoT Platform
4. Set up demo environment
5. Create unified dashboard for all products