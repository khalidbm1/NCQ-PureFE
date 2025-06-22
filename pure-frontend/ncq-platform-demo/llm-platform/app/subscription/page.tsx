'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, CreditCard, Building2, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NCQPaymentClient, NCQ_SUBSCRIPTION_PLANS, NCQ_BANK_ACCOUNT } from '@/lib/ncq-payment';

const paymentClient = new NCQPaymentClient({
  apiKey: process.env.NEXT_PUBLIC_PAYMENT_API_KEY!,
  environment: process.env.NEXT_PUBLIC_PAYMENT_ENV as 'sandbox' | 'production' || 'sandbox',
  merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID!,
  ncqBankAccount: NCQ_BANK_ACCOUNT,
});

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

const plans: SubscriptionPlan[] = NCQ_SUBSCRIPTION_PLANS.LLM.map(plan => ({
  ...plan,
  price: plan.amount,
  popular: plan.id === 'llm_pro',
}));

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('llm_pro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mada' | 'stc_pay' | 'bank_transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
  });

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/v1/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      let paymentMethodData: any = { type: paymentMethod };
      
      // Prepare payment method based on type
      if (paymentMethod === 'card') {
        // First tokenize the card
        const tokenResponse = await paymentClient.tokenizeCard(cardDetails);
        paymentMethodData.card = { token: tokenResponse.token };
      }
      
      // Create subscription through backend API
      const response = await fetch('/api/v1/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          plan_id: selectedPlan,
          payment_method: paymentMethodData,
        }),
      });
      
      const result = await response.json();
      
      if (result.redirect_url) {
        // 3D Secure required
        window.location.href = result.redirect_url;
      } else if (result.status === 'active') {
        toast({
          title: 'Subscription Activated!',
          description: 'Your subscription has been activated successfully.',
        });
        router.push('/dashboard');
      } else if (result.status === 'pending') {
        toast({
          title: 'Payment Processing',
          description: 'Your payment is being processed. You will receive a confirmation email.',
        });
      }
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: 'Failed to process your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setShowPaymentDialog(false);
    }
  };

  const handleUpgrade = async (newPlanId: string) => {
    if (!currentSubscription) return;
    
    setSelectedPlan(newPlanId);
    setShowPaymentDialog(true);
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    try {
      const response = await fetch('/api/v1/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        toast({
          title: 'Subscription Cancelled',
          description: 'Your subscription will remain active until the end of the billing period.',
        });
        fetchCurrentSubscription();
      }
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock the full potential of NCQ LLM with our flexible subscription plans
        </p>
        <Alert className="mt-4 max-w-2xl mx-auto">
          <AlertDescription>
            All payments are securely processed through NCQ Payment Gateway and transferred directly to NCQ bank account ({NCQ_BANK_ACCOUNT.iban})
          </AlertDescription>
        </Alert>
      </div>

      {currentSubscription && (
        <Card className="mb-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              You are currently on the {currentSubscription.plan.name} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Status: <span className="font-semibold">{currentSubscription.status}</span></p>
              <p>Renews on: <span className="font-semibold">{new Date(currentSubscription.current_period_end).toLocaleDateString()}</span></p>
              <p>API Calls: <span className="font-semibold">{currentSubscription.usage.api_calls} / {currentSubscription.usage.api_calls_limit}</span></p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.currency} {plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              {currentSubscription?.plan.id === plan.id ? (
                <Button className="w-full" disabled>
                  Current Plan
                </Button>
              ) : currentSubscription && plan.price > currentSubscription.plan.amount ? (
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id)}
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setShowPaymentDialog(true);
                  }}
                >
                  Subscribe
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Choose your payment method and complete the subscription
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mada" id="mada" />
                <Label htmlFor="mada" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  MADA Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stc_pay" id="stc_pay" />
                <Label htmlFor="stc_pay" className="flex items-center cursor-pointer">
                  <Smartphone className="mr-2 h-4 w-4" />
                  STC Pay
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  Bank Transfer (SADAD)
                </Label>
              </div>
            </RadioGroup>

            {(paymentMethod === 'card' || paymentMethod === 'mada') && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select
                      value={cardDetails.expiryMonth}
                      onValueChange={(value) => setCardDetails({ ...cardDetails, expiryMonth: value })}
                    >
                      <SelectTrigger id="expiryMonth">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select
                      value={cardDetails.expiryYear}
                      onValueChange={(value) => setCardDetails({ ...cardDetails, expiryYear: value })}
                    >
                      <SelectTrigger id="expiryYear">
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <SelectItem key={year} value={year.toString().slice(-2)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="holderName">Cardholder Name</Label>
                  <Input
                    id="holderName"
                    placeholder="John Doe"
                    value={cardDetails.holderName}
                    onChange={(e) => setCardDetails({ ...cardDetails, holderName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <Alert>
              <AlertDescription className="text-xs">
                Your payment will be processed securely through NCQ Payment Gateway. 
                All subscription payments are transferred directly to NCQ Technologies Ltd. bank account.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubscribe} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 