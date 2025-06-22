"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/useTranslation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store/auth";
import { settingsApi } from "@/lib/api";

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const { user } = useAuthStore();
  const isRTL = language === "ar";

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
    timezone: "UTC",
  });

  const [notifications, setNotifications] = useState({
    email: {
      usage: true,
      billing: true,
      security: true,
      updates: false,
    },
    push: {
      usage: false,
      billing: true,
      security: true,
      updates: false,
    },
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    apiKeyExpiry: "90",
    ipWhitelist: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: language,
    dateFormat: "MM/DD/YYYY",
    numberFormat: "comma",
  });

  const handleSaveProfile = async () => {
    try {
      await settingsApi.updateProfile(profileData);
    } finally {
      console.log("Saving profile:", profileData);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await settingsApi.updateNotifications(notifications);
    } finally {
      console.log("Saving notifications:", notifications);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await settingsApi.updateSecurity(security);
    } finally {
      console.log("Saving security:", security);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await settingsApi.updatePreferences(preferences);
      setLanguage(preferences.language);
    } finally {
      console.log("Saving preferences:", preferences);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.settings.title")}
        </h1>
        <p className="text-gray-600 mt-1">{t("dashboard.settings.subtitle")}</p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("dashboard.settings.profile.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.settings.profile.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.profile.name")}
              </label>
              <Input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder={t("dashboard.settings.profile.namePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.profile.email")}
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                placeholder={t("dashboard.settings.profile.emailPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.profile.company")}
              </label>
              <Input
                value={profileData.company}
                onChange={(e) =>
                  setProfileData({ ...profileData, company: e.target.value })
                }
                placeholder={t("dashboard.settings.profile.companyPlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.profile.timezone")}
              </label>
              <select
                value={profileData.timezone}
                onChange={(e) =>
                  setProfileData({ ...profileData, timezone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Singapore">Singapore</option>
              </select>
            </div>

            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />
              {t("dashboard.settings.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("dashboard.settings.notifications.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.settings.notifications.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">
                {t("dashboard.settings.notifications.email")}
              </h4>
              <div className="space-y-3">
                {Object.entries(notifications.email).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {t(`dashboard.settings.notifications.${key}`)}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          email: {
                            ...notifications.email,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">
                {t("dashboard.settings.notifications.push")}
              </h4>
              <div className="space-y-3">
                {Object.entries(notifications.push).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {t(`dashboard.settings.notifications.${key}`)}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          push: {
                            ...notifications.push,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveNotifications}>
              <Save className="h-4 w-4 mr-2" />
              {t("dashboard.settings.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("dashboard.settings.security.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.settings.security.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">
                  {t("dashboard.settings.security.twoFactor")}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.settings.security.twoFactorDesc")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={security.twoFactor}
                onChange={(e) =>
                  setSecurity({ ...security, twoFactor: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.security.apiKeyExpiry")}
              </label>
              <select
                value={security.apiKeyExpiry}
                onChange={(e) =>
                  setSecurity({ ...security, apiKeyExpiry: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="30">
                  {t("dashboard.settings.security.days", { count: 30 })}
                </option>
                <option value="60">
                  {t("dashboard.settings.security.days", { count: 60 })}
                </option>
                <option value="90">
                  {t("dashboard.settings.security.days", { count: 90 })}
                </option>
                <option value="never">
                  {t("dashboard.settings.security.never")}
                </option>
              </select>
            </div>

            <label className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">
                  {t("dashboard.settings.security.ipWhitelist")}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {t("dashboard.settings.security.ipWhitelistDesc")}
                </p>
              </div>
              <input
                type="checkbox"
                checked={security.ipWhitelist}
                onChange={(e) =>
                  setSecurity({ ...security, ipWhitelist: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">
                {t("dashboard.settings.security.dangerZone")}
              </h4>
              <Button variant="destructive" size="sm">
                {t("dashboard.settings.security.changePassword")}
              </Button>
            </div>

            <Button onClick={handleSaveSecurity}>
              <Save className="h-4 w-4 mr-2" />
              {t("dashboard.settings.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("dashboard.settings.preferences.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.settings.preferences.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.preferences.theme")}
              </label>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  setPreferences({ ...preferences, theme: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="light">
                  {t("dashboard.settings.preferences.light")}
                </option>
                <option value="dark">
                  {t("dashboard.settings.preferences.dark")}
                </option>
                <option value="system">
                  {t("dashboard.settings.preferences.system")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.preferences.language")}
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("dashboard.settings.preferences.dateFormat")}
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) =>
                  setPreferences({ ...preferences, dateFormat: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <Button onClick={handleSavePreferences}>
              <Save className="h-4 w-4 mr-2" />
              {t("dashboard.settings.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
