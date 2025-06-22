import api from './api';

declare global {
  interface Window {
    Stripe: any;
  }
}

interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface SetupIntent {
  clientSecret: string;
}

interface SubscriptionResponse {
  subscriptionId: string;
  status: string;
  clientSecret?: string;
}

class StripeService {
  private stripe: any;
  private publishableKey: string;

  constructor() {
    this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
    if (this.publishableKey && window.Stripe) {
      this.stripe = window.Stripe(this.publishableKey);
    }
  }

  async createPaymentMethod(cardElement: any, billingDetails: any) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (error) {
      throw error;
    }

    return paymentMethod;
  }

  async confirmCardSetup(clientSecret: string, cardElement: any) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, setupIntent } = await this.stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      throw error;
    }

    return setupIntent;
  }

  async confirmCardPayment(clientSecret: string, paymentMethodId: string) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw error;
    }

    return paymentIntent;
  }

  async createSubscription(planId: string, paymentMethodId: string, billingPeriod: 'monthly' | 'annual') {
    try {
      const response = await api.post('/subscriptions/create', {
        planId,
        paymentMethodId,
        billingPeriod,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateSubscription(planId: string, billingPeriod: 'monthly' | 'annual') {
    try {
      const response = await api.put('/subscriptions/update', {
        planId,
        billingPeriod,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription(atPeriodEnd: boolean = true) {
    try {
      const response = await api.post('/subscriptions/cancel', {
        atPeriodEnd,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSetupIntent() {
    try {
      const response = await api.post('/payment-methods/setup-intent');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async attachPaymentMethod(paymentMethodId: string) {
    try {
      const response = await api.post('/payment-methods/attach', {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentMethods() {
    try {
      const response = await api.get('/payment-methods');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string) {
    try {
      const response = await api.put('/payment-methods/default', {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string) {
    try {
      const response = await api.delete(`/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoices(limit: number = 10) {
    try {
      const response = await api.get('/invoices', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async downloadInvoice(invoiceId: string) {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  createElements() {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }
    return this.stripe.elements();
  }

  isInitialized() {
    return !!this.stripe;
  }
}

export default new StripeService();