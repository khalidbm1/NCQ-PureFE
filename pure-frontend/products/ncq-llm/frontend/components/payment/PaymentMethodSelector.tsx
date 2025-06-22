'use client'

import React, { useState } from 'react'
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SAUDI_PAYMENT_METHODS, calculateTotalWithFees, formatSARAmount } from '@/lib/ncq-payment'

interface PaymentMethodSelectorProps {
  amount: number
  currency: string
  onPaymentMethodSelect: (method: any) => void
  selectedMethod?: string
  isProcessing?: boolean
}

export default function PaymentMethodSelector({
  amount,
  currency,
  onPaymentMethodSelect,
  selectedMethod = 'card',
  isProcessing = false
}: PaymentMethodSelectorProps) {
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

  const [bankTransferDetails, setBankTransferDetails] = useState({
    bankCode: '',
    accountNumber: ''
  })

  const selectedPaymentMethod = SAUDI_PAYMENT_METHODS.find(m => m.type === selectedMethod)
  const totalAmount = calculateTotalWithFees(amount, selectedMethod)

  const handleMethodSelect = (method: string) => {
    onPaymentMethodSelect({ type: method })
  }

  const renderCardForm = () => (
    <div className="space-y-4 mt-4">
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

  const renderMADAForm = () => (
    <div className="space-y-4 mt-4">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          MADA is the national payment scheme of Saudi Arabia. All Saudi banks support MADA cards.
        </AlertDescription>
      </Alert>
      {renderCardForm()}
    </div>
  )

  const renderSTCPayForm = () => (
    <div className="space-y-4 mt-4">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          STC Pay is a digital wallet service. You'll be redirected to complete the payment.
        </AlertDescription>
      </Alert>
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
    <div className="space-y-4 mt-4">
      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          SADAD (Saudi Payments) enables secure bank transfers. You'll receive instructions to complete the transfer.
        </AlertDescription>
      </Alert>
      <div>
        <Label htmlFor="bankCode">Bank</Label>
        <Select
          value={bankTransferDetails.bankCode}
          onValueChange={(value) => setBankTransferDetails({ ...bankTransferDetails, bankCode: value })}
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

  const renderApplePayForm = () => (
    <div className="space-y-4 mt-4">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Pay securely with Touch ID, Face ID, or your device passcode.
        </AlertDescription>
      </Alert>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Banknote className="h-8 w-8 mx-auto mb-2 text-gray-600" />
        <p className="text-sm text-gray-600">
          Click "Pay with Apple Pay" to complete your payment
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodSelect} className="space-y-3">
          {SAUDI_PAYMENT_METHODS.filter(m => m.enabled).map((method) => (
            <Card key={method.type} className={`cursor-pointer transition-colors ${
              selectedMethod === method.type ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}>
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={method.type} id={method.type} />
                  <Label htmlFor={method.type} className="flex items-center cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                        {method.type === 'card' && <CreditCard className="h-5 w-5 text-blue-600" />}
                        {method.type === 'mada' && <CreditCard className="h-5 w-5 text-green-600" />}
                        {method.type === 'stc_pay' && <Smartphone className="h-5 w-5 text-purple-600" />}
                        {method.type === 'bank_transfer' && <Building2 className="h-5 w-5 text-orange-600" />}
                        {method.type === 'apple_pay' && <Banknote className="h-5 w-5 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          Fee: {method.fees?.[0]?.type === 'percentage' 
                            ? `${method.fees[0].value}%` 
                            : method.fees?.[0]?.value 
                              ? formatSARAmount(method.fees[0].value)
                              : 'No fee'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">
                          {formatSARAmount(calculateTotalWithFees(amount, method.type))}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </Card>
          ))}
        </RadioGroup>
      </div>

      {/* Payment Details Form */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPaymentMethod?.type === 'card' && <CreditCard className="h-5 w-5" />}
              {selectedPaymentMethod?.type === 'mada' && <CreditCard className="h-5 w-5 text-green-600" />}
              {selectedPaymentMethod?.type === 'stc_pay' && <Smartphone className="h-5 w-5 text-purple-600" />}
              {selectedPaymentMethod?.type === 'bank_transfer' && <Building2 className="h-5 w-5 text-orange-600" />}
              {selectedPaymentMethod?.type === 'apple_pay' && <Banknote className="h-5 w-5" />}
              {selectedPaymentMethod?.name}
            </CardTitle>
            <CardDescription>
              Enter your payment information securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMethod === 'card' && renderCardForm()}
            {selectedMethod === 'mada' && renderMADAForm()}
            {selectedMethod === 'stc_pay' && renderSTCPayForm()}
            {selectedMethod === 'bank_transfer' && renderBankTransferForm()}
            {selectedMethod === 'apple_pay' && renderApplePayForm()}
          </CardContent>
        </Card>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subscription Amount</span>
              <span>{formatSARAmount(amount)}</span>
            </div>
            {selectedPaymentMethod?.fees?.[0] && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Processing Fee</span>
                <span>
                  {selectedPaymentMethod.fees[0].type === 'percentage'
                    ? `${selectedPaymentMethod.fees[0].value}% (${formatSARAmount((amount * selectedPaymentMethod.fees[0].value) / 100)})`
                    : formatSARAmount(selectedPaymentMethod.fees[0].value)
                  }
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatSARAmount(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Your payment is secured by NCQ Payment Gateway with 256-bit SSL encryption. 
          All transactions are processed in compliance with Saudi Central Bank regulations.
        </AlertDescription>
      </Alert>
    </div>
  )
}