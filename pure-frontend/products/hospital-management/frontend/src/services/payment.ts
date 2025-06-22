import api from './api';
import { NCQPaymentWidget } from '@ncq/payment-widget';

interface PaymentMethod {
  id: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  type: string;
}

interface SetupIntent {
  clientSecret: string;
}

interface SubscriptionResponse {
  subscriptionId: string;
  status: string;
  clientSecret?: string;
}

class NCQPaymentService {
  private widget: NCQPaymentWidget;

  constructor() {
    this.widget = new NCQPaymentWidget({
      apiKey: import.meta.env.VITE_NCQ_PGW_PUBLIC_KEY || '',
      service: 'hospital-management',
      locale: 'ar-SA',
      theme: {
        primaryColor: '#10B981',
        fontFamily: 'Inter, sans-serif'
      }
    });
  }

  async createPaymentMethod(cardElement: any, billingDetails: any) {
    // NCQ Widget handles tokenization internally
    const paymentMethod = await this.widget.createPaymentMethod({
      billing_details: billingDetails
    });
    
    return paymentMethod;
  }

  async confirmCardSetup(clientSecret: string, cardElement: any) {
    // NCQ Widget handles setup confirmation
    const setupIntent = await this.widget.confirmSetup(clientSecret);
    return setupIntent;
  }

  async confirmCardPayment(clientSecret: string, paymentMethodId: string) {
    // NCQ Widget handles payment confirmation
    const paymentIntent = await this.widget.confirmPayment(clientSecret, {
      payment_method: paymentMethodId
    });
    
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
    // Return NCQ Widget element creator
    return this.widget.elements();
  }

  isInitialized() {
    return this.widget.isReady();
  }
}

export default new NCQPaymentService();
