'use client'

import React from 'react'
import { CreditCard, Smartphone, Building2, Banknote, MoreVertical, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface PaymentMethodCardProps {
  method: {
    id: string
    type: 'card' | 'mada' | 'stc_pay' | 'bank_transfer' | 'apple_pay'
    brand?: string
    last4?: string
    expiryMonth?: number
    expiryYear?: number
    phone?: string
    bankName?: string
    isDefault?: boolean
    isExpired?: boolean
  }
  onSetDefault?: (id: string) => void
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  showActions?: boolean
}

export default function PaymentMethodCard({
  method,
  onSetDefault,
  onRemove,
  onEdit,
  showActions = true
}: PaymentMethodCardProps) {
  const getMethodIcon = () => {
    switch (method.type) {
      case 'mada':
        return <CreditCard className="h-6 w-6 text-green-600" />
      case 'card':
        return <CreditCard className="h-6 w-6 text-blue-600" />
      case 'stc_pay':
        return <Smartphone className="h-6 w-6 text-purple-600" />
      case 'bank_transfer':
        return <Building2 className="h-6 w-6 text-orange-600" />
      case 'apple_pay':
        return <Banknote className="h-6 w-6 text-gray-600" />
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />
    }
  }

  const getMethodName = () => {
    switch (method.type) {
      case 'mada':
        return 'MADA'
      case 'card':
        return method.brand || 'Card'
      case 'stc_pay':
        return 'STC Pay'
      case 'bank_transfer':
        return method.bankName || 'Bank Transfer'
      case 'apple_pay':
        return 'Apple Pay'
      default:
        return 'Payment Method'
    }
  }

  const getMethodDetails = () => {
    switch (method.type) {
      case 'card':
      case 'mada':
        return method.last4 ? `•••• ${method.last4}` : 'Card'
      case 'stc_pay':
        return method.phone || 'Digital Wallet'
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'apple_pay':
        return 'Digital Wallet'
      default:
        return ''
    }
  }

  const getExpiryInfo = () => {
    if ((method.type === 'card' || method.type === 'mada') && method.expiryMonth && method.expiryYear) {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1
      
      const isExpired = method.expiryYear < currentYear || 
        (method.expiryYear === currentYear && method.expiryMonth < currentMonth)
      
      return {
        text: `Expires ${method.expiryMonth}/${method.expiryYear}`,
        isExpired
      }
    }
    return null
  }

  const expiryInfo = getExpiryInfo()

  return (
    <Card className={`transition-all hover:shadow-md ${method.isDefault ? 'border-blue-500 bg-blue-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Payment Method Icon */}
            <div className="h-12 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {getMethodIcon()}
            </div>
            
            {/* Payment Method Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{getMethodName()}</p>
                {method.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
                {expiryInfo?.isExpired && (
                  <Badge variant="destructive" className="text-xs">
                    Expired
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600">{getMethodDetails()}</p>
              
              {expiryInfo && (
                <p className={`text-xs ${expiryInfo.isExpired ? 'text-red-600' : 'text-gray-500'}`}>
                  {expiryInfo.text}
                </p>
              )}
              
              {/* Security Badge for supported methods */}
              {(method.type === 'card' || method.type === 'mada') && (
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Secured</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2">
              {!method.isDefault && onSetDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetDefault(method.id)}
                  className="text-xs"
                >
                  Set Default
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(method.id)}>
                      Edit
                    </DropdownMenuItem>
                  )}
                  {!method.isDefault && onSetDefault && (
                    <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                      Set as Default
                    </DropdownMenuItem>
                  )}
                  {onRemove && (
                    <DropdownMenuItem 
                      onClick={() => onRemove(method.id)}
                      className="text-red-600"
                    >
                      Remove
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}