'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CreditCard,
  Smartphone,
  Banknote,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Lock,
  Zap,
  QrCode,
  Wallet,
  Building,
  Star,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

interface PaymentIntegrationProps {
  amount: number;
  currency?: string;
  description: string;
  merchantId?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'wallet' | 'bnpl';
  icon: React.ComponentType<any>;
  provider: string;
  fees: number;
  processingTime: string;
  description: string;
  supported: boolean;
  recommended?: boolean;
}

export function PaymentIntegration({ 
  amount, 
  currency = 'SAR', 
  description, 
  merchantId = 'hotel-paradise',
  onSuccess, 
  onError, 
  onCancel 
}: PaymentIntegrationProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'processing' | 'complete'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentData, setPaymentData] = useState<any>({});

  // Available payment methods in Saudi Arabia
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mada',
      name: 'MADA Card',
      type: 'card',
      icon: CreditCard,
      provider: 'MADA',
      fees: 0,
      processingTime: 'Instant',
      description: 'Saudi national payment system',
      supported: true,
      recommended: true
    },
    {
      id: 'visa',
      name: 'Visa Card',
      type: 'card',
      icon: CreditCard,
      provider: 'Visa',
      fees: 2.5,
      processingTime: 'Instant',
      description: 'International credit/debit cards',
      supported: true
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'card',
      icon: CreditCard,
      provider: 'Mastercard',
      fees: 2.5,
      processingTime: 'Instant',
      description: 'International credit/debit cards',
      supported: true
    },
    {
      id: 'sabb',
      name: 'SABB Bank Transfer',
      type: 'bank',
      icon: Building,
      provider: 'SABB',
      fees: 1.0,
      processingTime: '2-5 minutes',
      description: 'Direct bank transfer',
      supported: true
    },
    {
      id: 'alrajhi',
      name: 'Al Rajhi Bank',
      type: 'bank',
      icon: Building,
      provider: 'Al Rajhi',
      fees: 1.0,
      processingTime: '2-5 minutes',
      description: 'Direct bank transfer',
      supported: true
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      type: 'wallet',
      icon: Smartphone,
      provider: 'STC',
      fees: 0,
      processingTime: 'Instant',
      description: 'Mobile wallet payment',
      supported: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      type: 'wallet',
      icon: Smartphone,
      provider: 'Apple',
      fees: 0,
      processingTime: 'Instant',
      description: 'Contactless mobile payment',
      supported: true
    },
    {
      id: 'samsung_pay',
      name: 'Samsung Pay',
      type: 'wallet',
      icon: Smartphone,
      provider: 'Samsung',
      fees: 0,
      processingTime: 'Instant',
      description: 'Contactless mobile payment',
      supported: true
    },
    {
      id: 'tabby',
      name: 'Tabby (Buy Now Pay Later)',
      type: 'bnpl',
      icon: Wallet,
      provider: 'Tabby',
      fees: 0,
      processingTime: 'Instant',
      description: 'Split payment into 4 installments',
      supported: true
    }
  ];

  const paymentMutation = useMutation({
    mutationFn: (data: any) => apiClient.createPayment(data),
    onSuccess: (result) => {
      setCurrentStep('complete');
      onSuccess?.(result.data);
    },
    onError: (error) => {
      onError?.(error);
    }
  });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep('details');
  };

  const handlePaymentSubmit = (details: any) => {
    setPaymentData(details);
    setCurrentStep('processing');
    
    // Simulate payment processing
    paymentMutation.mutate({
      amount,
      currency,
      method: selectedMethod?.id,
      details,
      merchantId,
      description
    });
  };

  const calculateTotal = () => {
    if (!selectedMethod) return amount;
    const fees = (amount * selectedMethod.fees) / 100;
    return amount + fees;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
            <p className="text-blue-100">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          </div>
        </div>
      </div>

      {/* Payment Steps */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {currentStep === 'method' && (
            <PaymentMethodSelection
              methods={paymentMethods}
              onSelect={handleMethodSelect}
              onCancel={onCancel}
            />
          )}
          
          {currentStep === 'details' && selectedMethod && (
            <PaymentDetails
              method={selectedMethod}
              amount={amount}
              total={calculateTotal()}
              currency={currency}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep('method')}
            />
          )}
          
          {currentStep === 'processing' && (
            <PaymentProcessing
              method={selectedMethod}
              amount={calculateTotal()}
              currency={currency}
            />
          )}
          
          {currentStep === 'complete' && (
            <PaymentComplete
              method={selectedMethod}
              amount={calculateTotal()}
              currency={currency}
              data={paymentData}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Security Footer */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4 text-green-600" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>SAMA Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodSelection({ methods, onSelect, onCancel }: any) {
  const groupedMethods = methods.reduce((acc: any, method: PaymentMethod) => {
    if (!acc[method.type]) acc[method.type] = [];
    acc[method.type].push(method);
    return acc;
  }, {});

  const methodTypeNames = {
    card: 'Cards',
    bank: 'Bank Transfer',
    wallet: 'Digital Wallets',
    bnpl: 'Buy Now Pay Later'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Choose Payment Method
        </h3>
        <p className="text-gray-600">
          Select your preferred payment option
        </p>
      </div>

      {Object.entries(groupedMethods).map(([type, typeMethods]: [string, any]) => (
        <div key={type} className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
            {methodTypeNames[type as keyof typeof methodTypeNames]}
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {typeMethods.map((method: PaymentMethod) => {
              const Icon = method.icon;
              
              return (
                <button
                  key={method.id}
                  onClick={() => onSelect(method)}
                  disabled={!method.supported}
                  className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                    method.supported 
                      ? 'border-gray-200 hover:border-blue-300 cursor-pointer' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                  } ${method.recommended ? 'ring-2 ring-blue-500 ring-opacity-20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-gray-900">{method.name}</h5>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {method.fees > 0 ? `${method.fees}% fee` : 'No fees'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {method.processingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {onCancel && (
        <div className="pt-4 border-t">
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel Payment
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function PaymentDetails({ method, amount, total, currency, onSubmit, onBack }: any) {
  const [formData, setFormData] = useState<any>({});
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(formData);
    }
  };

  const renderPaymentForm = () => {
    const Icon = method.icon;

    switch (method.type) {
      case 'card':
        return (
          <CardPaymentForm 
            method={method}
            data={formData}
            onChange={setFormData}
            onValidityChange={setIsValid}
          />
        );
      case 'bank':
        return (
          <BankTransferForm 
            method={method}
            data={formData}
            onChange={setFormData}
            onValidityChange={setIsValid}
          />
        );
      case 'wallet':
        return (
          <WalletPaymentForm 
            method={method}
            data={formData}
            onChange={setFormData}
            onValidityChange={setIsValid}
          />
        );
      case 'bnpl':
        return (
          <BNPLPaymentForm 
            method={method}
            amount={total}
            data={formData}
            onChange={setFormData}
            onValidityChange={setIsValid}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          <p className="text-sm text-gray-600">{method.name}</p>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount)}</span>
          </div>
          {method.fees > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee ({method.fees}%)</span>
              <span className="font-medium">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format((amount * method.fees) / 100)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderPaymentForm()}
        
        <Button 
          type="submit" 
          disabled={!isValid}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <Lock className="h-4 w-4 mr-2" />
          Pay {new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(total)}
        </Button>
      </form>
    </motion.div>
  );
}

function CardPaymentForm({ method, data, onChange, onValidityChange }: any) {
  const [errors, setErrors] = useState<any>({});

  const validateForm = (formData: any) => {
    const newErrors: any = {};
    
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number required';
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV required';
    }
    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Cardholder name required';
    }

    setErrors(newErrors);
    onValidityChange(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
    validateForm(newData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={data.cardNumber || ''}
          onChange={(e) => handleChange('cardNumber', e.target.value)}
          className={`w-full p-3 border rounded-lg ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
          maxLength={19}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={data.expiryDate || ''}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'}`}
            maxLength={5}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            placeholder="123"
            value={data.cvv || ''}
            onChange={(e) => handleChange('cvv', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.cvv ? 'border-red-300' : 'border-gray-300'}`}
            maxLength={4}
          />
          {errors.cvv && (
            <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="John Doe"
          value={data.cardholderName || ''}
          onChange={(e) => handleChange('cardholderName', e.target.value)}
          className={`w-full p-3 border rounded-lg ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'}`}
        />
        {errors.cardholderName && (
          <p className="mt-1 text-xs text-red-600">{errors.cardholderName}</p>
        )}
      </div>

      {method.id === 'mada' && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900">MADA Card</h5>
              <p className="text-xs text-blue-700">
                This transaction will be processed through the Saudi MADA network with enhanced security.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BankTransferForm({ method, data, onChange, onValidityChange }: any) {
  useEffect(() => {
    // Bank transfer requires minimal validation
    onValidityChange(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          {method.name} Transfer
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          You will be redirected to {method.provider} to complete the payment securely.
        </p>
        <div className="text-xs text-blue-600">
          <p>• Processing time: {method.processingTime}</p>
          <p>• Transaction fee: {method.fees}%</p>
          <p>• Secure authentication required</p>
        </div>
      </div>
    </div>
  );
}

function WalletPaymentForm({ method, data, onChange, onValidityChange }: any) {
  useEffect(() => {
    // Wallet payment requires minimal validation
    onValidityChange(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <Smartphone className="h-12 w-12 mx-auto mb-3 text-green-600" />
        <h4 className="font-medium text-green-900 mb-2">
          Pay with {method.name}
        </h4>
        <p className="text-sm text-green-700">
          You will be redirected to the {method.name} app to complete the payment.
        </p>
      </div>

      {method.id === 'stc_pay' && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-1">How it works:</h5>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. You'll be redirected to STC Pay</li>
            <li>2. Login with your STC Pay credentials</li>
            <li>3. Confirm the payment amount</li>
            <li>4. Complete with your PIN or biometric</li>
          </ol>
        </div>
      )}
    </div>
  );
}

function BNPLPaymentForm({ method, amount, data, onChange, onValidityChange }: any) {
  const installmentAmount = amount / 4;

  useEffect(() => {
    onValidityChange(true);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-medium text-purple-900 mb-3">
          Split into 4 interest-free payments
        </h4>
        
        <div className="grid grid-cols-4 gap-2 text-center">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="bg-white p-2 rounded border">
              <p className="text-xs text-gray-600">
                {index === 0 ? 'Today' : `Month ${index + 1}`}
              </p>
              <p className="text-sm font-medium">
                {new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(installmentAmount)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 text-xs text-purple-700">
          <p>• No interest or hidden fees</p>
          <p>• Automatic payments every 30 days</p>
          <p>• Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}

function PaymentProcessing({ method, amount, currency }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-6 py-8"
    >
      <div className="w-16 h-16 mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Payment
        </h3>
        <p className="text-gray-600">
          Please wait while we process your {method?.name} payment...
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Do not close this window or press back
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentComplete({ method, amount, currency, data }: any) {
  const transactionId = `TXN-${Date.now()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600">
          Your payment has been processed successfully.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">{method?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">
              {new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date</span>
            <span className="font-medium">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Download Receipt
        </Button>
        <Button variant="outline" className="w-full">
          Return to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}