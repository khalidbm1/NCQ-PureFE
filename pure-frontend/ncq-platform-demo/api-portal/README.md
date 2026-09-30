# NCQ API Documentation Portal

A comprehensive API documentation portal for all NCQ platform services with interactive testing capabilities.

## Features

- 📚 **Unified API Documentation**: Single portal for all NCQ services
- 🧪 **Interactive Testing**: Test API endpoints directly from the documentation
- 🔐 **Authentication Integration**: Built-in auth flow for testing protected endpoints
- 📊 **API Analytics**: Track API usage and performance metrics
- 🌍 **Multi-language Support**: Documentation in English and Arabic
- 🎨 **Customizable Themes**: Light/Dark mode with NCQ branding
- 📱 **Responsive Design**: Works on all devices
- 🔍 **Advanced Search**: Find endpoints, parameters, and examples quickly
- 📈 **Version Management**: Support for multiple API versions
- 🤝 **SDK Generation**: Auto-generate SDKs for various languages

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NCQ API Portal                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │ Documentation   │  │ API Explorer    │  │ SDK Gen    │ │
│  │ - OpenAPI Specs │  │ - Interactive   │  │ - TypeScript│ │
│  │ - Markdown Docs │  │ - Auth Flow     │  │ - Python   │ │
│  │ - Code Examples │  │ - Response Mock │  │ - Java     │ │
│  └─────────────────┘  └─────────────────┘  └────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │ Analytics       │  │ Version Control │  │ Search     │ │
│  │ - Usage Stats   │  │ - API Versions  │  │ - Full Text│ │
│  │ - Performance   │  │ - Changelog     │  │ - Filters  │ │
│  │ - Error Rates   │  │ - Deprecation   │  │ - AI Help  │ │
│  └─────────────────┘  └─────────────────┘  └────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Services Documented

1. **Authentication Service** - JWT, OAuth2, MFA
2. **Identity Service** - User & tenant management
3. **Permission Service** - RBAC and policies
4. **IoT Platform** - Device management and telemetry
5. **Blockchain Service** - Smart contracts and transactions
6. **Payment Gateway** - Payment processing and webhooks
7. **Hospital Management** - Healthcare APIs
8. **Smart Hospitality** - Hotel and guest services
9. **LLM Platform** - AI and ML endpoints
10. **Configuration Service** - Dynamic configs and feature flags

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: Tailwind CSS, Headless UI, NCQ Design System
- **Documentation**: OpenAPI 3.1, AsyncAPI 2.0, GraphQL Schema
- **API Testing**: Axios, React Query
- **Analytics**: Google Analytics, Custom Metrics
- **Search**: Algolia, ElasticSearch
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Redis

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

```
NEXT_PUBLIC_API_BASE_URL=https://api.ncq.sa
NEXT_PUBLIC_AUTH_URL=https://auth.ncq.sa
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
POSTGRES_URL=postgresql://user:pass@localhost/api_portal
REDIS_URL=redis://localhost:6379
```

## License

Copyright © 2024 Khalid bin Ibrahim Al-Muhanna. All rights reserved.