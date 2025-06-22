import { apiClient } from "./client";

export interface ProfileData {
  name?: string;
  email?: string;
  company?: string;
  timezone?: string;
}

export interface NotificationsSettings {
  email: Record<string, boolean>;
  push: Record<string, boolean>;
}

export interface SecuritySettings {
  twoFactor: boolean;
  apiKeyExpiry: string;
  ipWhitelist: boolean;
}

export interface PreferencesSettings {
  theme: string;
  language: string;
  dateFormat: string;
  numberFormat: string;
}

export const settingsApi = {
  async updateProfile(data: ProfileData) {
    return apiClient.put("/api/v1/user/profile", data);
  },
  async updateNotifications(data: NotificationsSettings) {
    return apiClient.put("/api/v1/user/notifications", data);
  },
  async updateSecurity(data: SecuritySettings) {
    return apiClient.put("/api/v1/user/security", data);
  },
  async updatePreferences(data: PreferencesSettings) {
    return apiClient.put("/api/v1/user/preferences", data);
  },
};
