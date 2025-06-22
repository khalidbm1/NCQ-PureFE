import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Building2, Brain, Hotel, Wifi, CreditCard, FolderOpen,
  ChevronDown, Check, Sparkles
} from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface Product {
  id: string
  name: string
  description: string
  icon: any
  route: string
  color: string
  isNew?: boolean
}

const products: Product[] = [
  {
    id: 'files',
    name: 'File Management',
    description: 'Store, share, and manage files',
    icon: FolderOpen,
    route: '/dashboard',
    color: 'text-blue-500'
  },
  {
    id: 'hospital',
    name: 'Hospital Management',
    description: 'Complete healthcare solution',
    icon: Building2,
    route: '/hospital',
    color: 'text-green-500'
  },
  {
    id: 'llm',
    name: 'NCQ LLM Platform',
    description: 'AI-powered language models',
    icon: Brain,
    route: '/llm',
    color: 'text-purple-500',
    isNew: true
  },
  {
    id: 'hospitality',
    name: 'Smart Hospitality',
    description: 'Hotel & restaurant management',
    icon: Hotel,
    route: '/hospitality',
    color: 'text-orange-500'
  },
  {
    id: 'iot',
    name: 'IoT Platform',
    description: 'Connected device management',
    icon: Wifi,
    route: '/iot',
    color: 'text-cyan-500'
  },
  {
    id: 'pgw',
    name: 'Payment Gateway',
    description: 'Secure payment processing',
    icon: CreditCard,
    route: '/payment-gateway',
    color: 'text-emerald-500'
  }
]

export function ProductSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Find current product based on route
  const currentProduct = products.find(p => 
    location.pathname.startsWith(p.route) || 
    (p.id === 'files' && location.pathname === '/')
  ) || products[0]

  const [isOpen, setIsOpen] = useState(false)

  const handleProductSwitch = (product: Product) => {
    navigate(product.route)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[260px] justify-between"
          aria-label="Switch product"
        >
          <div className="flex items-center space-x-3">
            <currentProduct.icon className={`w-4 h-4 ${currentProduct.color}`} />
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{currentProduct.name}</span>
                {currentProduct.isNew && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentProduct.description}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px]" align="start">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>NCQ Products</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {products.map((product) => {
          const Icon = product.icon
          const isActive = product.id === currentProduct.id
          
          return (
            <DropdownMenuItem
              key={product.id}
              onClick={() => handleProductSwitch(product)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${product.color}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{product.name}</span>
                      {product.isNew && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>
                {isActive && <Check className="w-4 h-4" />}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}