/**
 * NCQ Payment Gateway Client Library
 * Provides integration with NCQ Payment Gateway for subscription billing
 */

// Types and interfaces
export interface NCQPaymentConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
  merchantId: string;
  ncqBankAccount: BankAccount;
  timeout?: number;
}

export interface BankAccount {
  bankName: string;
  iban: string;
  accountNumber: string;
  swiftCode: string;
  accountHolder: string;
}

export interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}

export interface PaymentMethod {
  type: 'card' | 'mada' | 'stc_pay' | 'bank_transfer' | 'apple_pay';
  card?: {
    token: string;
  };
  stcPay?: {
    mobileNumber: string;
  };
  bankTransfer?: {
    bankCode: string;
    accountNumber: string;
  };
}

export interface CustomerInfo {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  subscriptionId?: string;
  status: 'pending' | 'active' | 'failed' | 'requires_action';
  redirect_url?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface TokenizationResult {
  token: string;
  expiresAt: string;
  last4: string;
  brand: string;
}

// NCQ Bank Account Details
export const NCQ_BANK_ACCOUNT: BankAccount = {
  bankName: 'Saudi National Bank',
  iban: 'SA0210000001234567890123',
  accountNumber: '1234567890123',
  swiftCode: 'NCBKSARI',
  accountHolder: 'NCQ Technologies Ltd.'
};

// Subscription plans with SAR pricing
export const NCQ_SUBSCRIPTION_PLANS = {
  LLM: [
    {
      id: 'llm_free',
      name: 'Free',
      amount: 0,
      currency: 'SAR',
      interval: 'monthly',
      features: [
        '1,000 API requests/month',
        '10,000 tokens/month',
        '100MB storage',
        'Community support',
        'Basic models'
      ],
      description: 'Perfect for getting started'
    },
    {
      id: 'llm_starter',
      name: 'Starter',
      amount: 74.99, // ~$20 USD
      currency: 'SAR',
      interval: 'monthly',
      features: [
        '10,000 API requests/month',
        '100,000 tokens/month',
        '1GB storage',
        'Email support',
        'All models',
        'API dashboard'
      ],
      description: 'Great for small projects'
    },
    {
      id: 'llm_pro',
      name: 'Pro',
      amount: 187.49, // ~$50 USD
      currency: 'SAR',
      interval: 'monthly',
      features: [
        '1,000,000 API requests/month',
        '10,000,000 tokens/month',
        '10GB storage',
        'Priority support',
        'Custom models',
        'Team collaboration',
        'Advanced analytics',
        '99.9% SLA'
      ],
      description: 'Perfect for businesses',
      popular: true
    },
    {
      id: 'llm_enterprise',
      name: 'Enterprise',
      amount: 'Custom',
      currency: 'SAR',
      interval: 'monthly',
      features: [
        'Unlimited API requests',
        'Unlimited tokens',
        'Unlimited storage',
        'Dedicated support',
        'Custom SLA',
        'On-premise deployment',
        'Custom integrations',
        'Dedicated infrastructure'
      ],
      description: 'For large-scale deployments'
    }
  ] as SubscriptionPlan[]
};

// Payment method configurations
export const SAUDI_PAYMENT_METHODS = [
  {
    type: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card',
    enabled: true,
    supportedBrands: ['visa', 'mastercard'],
    fees: [{ type: 'percentage', value: 2.9, description: 'Processing fee' }],
    limits: { min: 1, max: 50000, currency: 'SAR' }
  },
  {
    type: 'mada',
    name: 'MADA',
    icon: 'mada',
    enabled: true,
    fees: [{ type: 'percentage', value: 1.75, description: 'MADA processing fee' }],
    limits: { min: 1, max: 50000, currency: 'SAR' }
  },
  {
    type: 'stc_pay',
    name: 'STC Pay',
    icon: 'stc-pay',
    enabled: true,
    fees: [{ type: 'percentage', value: 2.5, description: 'STC Pay fee' }],
    limits: { min: 1, max: 10000, currency: 'SAR' }
  },
  {
    type: 'bank_transfer',
    name: 'Bank Transfer (SADAD)',
    icon: 'bank',
    enabled: true,
    fees: [{ type: 'fixed', value: 2, currency: 'SAR', description: 'SADAD fee' }],
    limits: { min: 100, max: 100000, currency: 'SAR' }
  },
  {
    type: 'apple_pay',
    name: 'Apple Pay',
    icon: 'apple-pay',
    enabled: true,
    fees: [{ type: 'percentage', value: 2.9, description: 'Apple Pay fee' }],
    limits: { min: 1, max: 50000, currency: 'SAR' }
  }
];

export class NCQPaymentClient {
  private config: NCQPaymentConfig;
  private baseUrl: string;

  constructor(config: NCQPaymentConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'sandbox' 
      ? 'https://sandbox-api.ncq-pgw.com/api/v1'
      : 'https://api.ncq-pgw.com/api/v1';
  }

  /**
   * Tokenize card details for secure storage
   */
  async tokenizeCard(cardDetails: CardDetails): Promise<TokenizationResult> {
    const response = await this.makeRequest('/payments/tokenize', {
      method: 'POST',
      body: JSON.stringify({
        card: {
          number: cardDetails.number.replace(/\s/g, ''),
          expiry_month: cardDetails.expiryMonth,
          expiry_year: cardDetails.expiryYear,
          cvv: cardDetails.cvv,
          holder_name: cardDetails.holderName
        }
      })
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Tokenization failed');
    }

    return {
      token: response.data.token,
      expiresAt: response.data.expires_at,
      last4: response.data.last4,
      brand: response.data.brand
    };
  }

  /**
   * Create a subscription with payment
   */
  async createSubscription(options: {
    planId: string;
    customer: CustomerInfo;
    paymentMethod: PaymentMethod;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult> {
    const plan = NCQ_SUBSCRIPTION_PLANS.LLM.find(p => p.id === options.planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const response = await this.makeRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: options.planId,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        customer: options.customer,
        payment_method: options.paymentMethod,
        metadata: {
          ...options.metadata,
          source: 'ncq_llm_frontend',
          plan_name: plan.name
        },
        success_url: `${window.location.origin}/subscription/success`,
        failure_url: `${window.location.origin}/subscription/failed`,
        webhook_url: `${window.location.origin}/api/webhooks/ncq-payment`
      })
    });

    return {
      success: response.success,
      transactionId: response.data?.transaction_id,
      subscriptionId: response.data?.subscription_id,
      status: this.mapStatus(response.data?.status),
      redirect_url: response.data?.redirect_url,
      error: response.error
    };
  }

  /**
   * Process a one-time payment
   */
  async processPayment(options: {
    amount: number;
    currency: string;
    customer: CustomerInfo;
    paymentMethod: PaymentMethod;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult> {
    const response = await this.makeRequest('/payments', {
      method: 'POST',
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency,
        customer: options.customer,
        payment_method: options.paymentMethod,
        description: options.description,
        metadata: {
          ...options.metadata,
          source: 'ncq_llm_frontend'
        },
        success_url: `${window.location.origin}/payment/success`,
        failure_url: `${window.location.origin}/payment/failed`
      })
    });

    return {
      success: response.success,
      transactionId: response.data?.transaction_id,
      status: this.mapStatus(response.data?.status),
      redirect_url: response.data?.redirect_url,
      error: response.error
    };
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string) {
    const response = await this.makeRequest(`/payments/transactions/${transactionId}`);
    return response.data;
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string) {
    const response = await this.makeRequest(`/subscriptions/${subscriptionId}`);
    return response.data;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<PaymentResult> {
    const response = await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });

    return {
      success: response.success,
      subscriptionId,
      status: 'cancelled' as any,
      error: response.error
    };
  }

  /**
   * Get available payment methods for merchant
   */
  async getPaymentMethods() {
    const response = await this.makeRequest('/payments/methods');
    return response.data?.payment_methods || SAUDI_PAYMENT_METHODS;
  }

  /**
   * Validate payment data
   */
  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  validateCVV(cvv: string, cardType?: string): boolean {
    const length = cvv.length;
    if (cardType === 'amex') return length === 4;
    return length === 3;
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string = 'SAR'): string {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Get card brand from number
   */
  getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    if (/^9/.test(cleaned)) return 'mada'; // MADA cards typically start with 9
    
    return 'unknown';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'X-Merchant-ID': this.config.merchantId,
      'X-Client-Version': '1.0.0',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: this.config.timeout || 30000
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'API_ERROR',
            message: data.error?.message || 'An error occurred',
            details: data.error?.details
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
          details: error
        }
      };
    }
  }

  private mapStatus(status: string): 'pending' | 'active' | 'failed' | 'requires_action' {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'active':
        return 'active';
      case 'pending':
      case 'processing':
        return 'pending';
      case 'requires_action':
      case 'requires_3ds':
        return 'requires_action';
      case 'failed':
      case 'declined':
      case 'error':
      default:
        return 'failed';
    }
  }
}

// Utility functions
export function calculateTotalWithFees(amount: number, paymentMethod: string): number {
  const method = SAUDI_PAYMENT_METHODS.find(m => m.type === paymentMethod);
  if (!method?.fees) return amount;

  let total = amount;
  method.fees.forEach(fee => {
    if (fee.type === 'percentage') {
      total += (amount * fee.value) / 100;
    } else if (fee.type === 'fixed') {
      total += fee.value;
    }
  });

  return Math.round(total * 100) / 100;
}

export function formatSARAmount(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function convertUSDToSAR(usdAmount: number, exchangeRate: number = 3.75): number {
  return Math.round(usdAmount * exchangeRate * 100) / 100;
}

export default NCQPaymentClient;