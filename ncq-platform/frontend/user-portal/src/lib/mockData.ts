import type { User } from '../types/user';

export function createMockUser(): User {
  return {
    id: 'mock-user-123',
    email: 'demo@ncq.sa',
    name: 'Demo User',
    tenantId: 'demo-tenant',
    role: 'admin',
    isActive: true,
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    subscription: {
      plan: 'premium',
      status: 'active',
      features: ['unlimited-files', 'api-access', 'priority-support']
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    profile: {
      firstName: 'Demo',
      lastName: 'User',
      company: 'NCQ Platform Demo',
      jobTitle: 'Platform Administrator'
    },
    stats: {
      filesUploaded: 0,
      storageUsed: 0,
      apiCalls: 0,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}