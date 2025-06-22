export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Added for compatibility
  role: 'super_admin' | 'hospital_admin' | 'doctor' | 'nurse' | 'receptionist' | 'accountant' | 'viewer';
  permissions?: string[];
  tenant_id?: string; // Added for tenant identification
}

export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled' | 'suspended';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  subdomain: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
  subdomain: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}