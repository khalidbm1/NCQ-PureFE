'use client'

import React, { useState } from 'react'
import { Plus, CreditCard, Smartphone, Building2, Banknote, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { NCQPaymentClient, SAUDI_PAYMENT_METHODS } from '@/lib/ncq-payment'

interface AddPaymentMethodDialogProps {
  trigger?: React.ReactNode
  onPaymentMethodAdded?: (method: any) => void
}

export default function AddPaymentMethodDialog({
  trigger,
  onPaymentMethodAdded
}: AddPaymentMethodDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  })

  const [stcPayDetails, setStcPayDetails] = useState({
    mobileNumber: ''
  })

  const [bankDetails, setBankDetails] = useState({
    bankCode: '',
    accountNumber: ''
  })

  const resetForm = () => {
    setCardDetails({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      holderName: ''
    })
    setStcPayDetails({ mobileNumber: '' })
    setBankDetails({ bankCode: '', accountNumber: '' })
    setSelectedType('card')
  }

  const handleAddPaymentMethod = async () => {
    setIsProcessing(true)
    
    try {
      // Validate form based on selected type
      if (selectedType === 'card' || selectedType === 'mada') {
        if (!cardDetails.number || !cardDetails.expiryMonth || !cardDetails.expiryYear || !cardDetails.cvv || !cardDetails.holderName) {
          throw new Error('Please fill in all card details')
        }
      } else if (selectedType === 'stc_pay') {
        if (!stcPayDetails.mobileNumber) {
          throw new Error('Please enter your STC Pay mobile number')
        }
      } else if (selectedType === 'bank_transfer') {
        if (!bankDetails.bankCode) {
          throw new Error('Please select your bank')
        }
      }

      // Create payment method based on type
      let paymentMethodData: any = { type: selectedType }
      
      if (selectedType === 'card' || selectedType === 'mada') {
        // For card/MADA, we would typically tokenize the card details
        const paymentClient = new NCQPaymentClient({
          apiKey: process.env.NEXT_PUBLIC_PAYMENT_API_KEY!,
          environment: process.env.NEXT_PUBLIC_PAYMENT_ENV as 'sandbox' | 'production' || 'sandbox',
          merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID!,
          ncqBankAccount: {
            bankName: 'Saudi National Bank',
            iban: 'SA0210000001234567890123',
            accountNumber: '1234567890123',
            swiftCode: 'NCBKSARI',
            accountHolder: 'NCQ Technologies Ltd.'
          }
        })
        
        const tokenResult = await paymentClient.tokenizeCard(cardDetails)
        paymentMethodData = {
          type: selectedType,
          card: {
            token: tokenResult.token,
            last4: tokenResult.last4,
            brand: tokenResult.brand,
            expiryMonth: parseInt(cardDetails.expiryMonth),
            expiryYear: parseInt(cardDetails.expiryYear)
          }
        }
      } else if (selectedType === 'stc_pay') {
        paymentMethodData = {
          type: selectedType,
          stcPay: {
            mobileNumber: stcPayDetails.mobileNumber
          }
        }
      } else if (selectedType === 'bank_transfer') {
        paymentMethodData = {
          type: selectedType,
          bankTransfer: {
            bankCode: bankDetails.bankCode
          }
        }
      }

      // Call API to save payment method
      const response = await fetch('/api/v1/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentMethodData)
      })

      if (!response.ok) {
        throw new Error('Failed to add payment method')
      }

      const result = await response.json()

      toast({
        title: 'Payment Method Added',
        description: 'Your payment method has been successfully added.',
      })

      onPaymentMethodAdded?.(result)
      setOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: 'Failed to Add Payment Method',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderCardForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChange={(e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
            setCardDetails({ ...cardDetails, number: value })
          }}
          maxLength={19}
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
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
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
  )

  const renderSTCPayForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="stcMobile">Mobile Number</Label>
        <Input
          id="stcMobile"
          placeholder="+966 50 123 4567"
          value={stcPayDetails.mobileNumber}
          onChange={(e) => setStcPayDetails({ ...stcPayDetails, mobileNumber: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your STC Pay registered mobile number
        </p>
      </div>
    </div>
  )

  const renderBankTransferForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bankCode">Bank</Label>
        <Select
          value={bankDetails.bankCode}
          onValueChange={(value) => setBankDetails({ ...bankDetails, bankCode: value })}
        >
          <SelectTrigger id="bankCode">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NCB">National Commercial Bank</SelectItem>
            <SelectItem value="RAJHI">Al Rajhi Bank</SelectItem>
            <SelectItem value="RIYADH">Riyad Bank</SelectItem>
            <SelectItem value="SAMBA">Samba Financial Group</SelectItem>
            <SelectItem value="ANB">Arab National Bank</SelectItem>
            <SelectItem value="ALINMA">Alinma Bank</SelectItem>
            <SelectItem value="JAZIRA">Bank Aljazira</SelectItem>
            <SelectItem value="BSF">Bank Saudi Fransi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account for future purchases
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Payment Method Type Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Payment Method Type</Label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-3">
              {SAUDI_PAYMENT_METHODS.filter(m => m.enabled && m.type !== 'apple_pay').map((method) => (
                <div key={method.type} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.type} id={method.type} />
                  <Label htmlFor={method.type} className="flex items-center cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                        {method.type === 'card' && <CreditCard className="h-5 w-5 text-blue-600" />}
                        {method.type === 'mada' && <CreditCard className="h-5 w-5 text-green-600" />}
                        {method.type === 'stc_pay' && <Smartphone className="h-5 w-5 text-purple-600" />}
                        {method.type === 'bank_transfer' && <Building2 className="h-5 w-5 text-orange-600" />}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Method Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedType === 'card' && 'Credit/Debit Card Details'}
                {selectedType === 'mada' && 'MADA Card Details'}
                {selectedType === 'stc_pay' && 'STC Pay Details'}
                {selectedType === 'bank_transfer' && 'Bank Transfer Details'}
              </CardTitle>
              <CardDescription>
                {selectedType === 'card' && 'Enter your credit or debit card information'}
                {selectedType === 'mada' && 'Enter your MADA card information'}
                {selectedType === 'stc_pay' && 'Enter your STC Pay mobile number'}
                {selectedType === 'bank_transfer' && 'Select your bank for SADAD transfers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(selectedType === 'card' || selectedType === 'mada') && renderCardForm()}
              {selectedType === 'stc_pay' && renderSTCPayForm()}
              {selectedType === 'bank_transfer' && renderBankTransferForm()}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <AlertDescription>
              Your payment information is encrypted and securely stored. We never store your complete card details.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPaymentMethod} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Payment Method'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}