export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  phoneNumber: string;
  nationalId?: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
  mfaType?: MFAType;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum MFAType {
  TOTP = 'TOTP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  BIOMETRIC = 'BIOMETRIC'
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceFingerprint?: string;
}

export interface MFAChallenge {
  challengeId: string;
  type: MFAType;
  expiresAt: Date;
  maskedDestination?: string; // e.g., "*****567" for phone
}

export interface MFAVerification {
  challengeId: string;
  code?: string;
  biometricData?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  requiresMfa?: boolean;
  mfaChallenge?: MFAChallenge;
}

export interface BiometricCredential {
  credentialId: string;
  publicKey: string;
  name: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    ip: string;
    location?: string;
  };
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  expiryDays?: number;
}

export interface AuthError {
  code: string;
  message: string;
  messageAr: string;
  field?: string;
  attempts?: number;
  lockoutTime?: Date;
}