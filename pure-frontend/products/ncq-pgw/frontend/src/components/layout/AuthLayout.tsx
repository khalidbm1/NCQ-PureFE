import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-saudi flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">NCQ Payment Gateway</h1>
              <p className="text-green-100">Saudi Arabia's Leading Payment Solution</p>
            </div>
          </div>
          
          <div className="space-y-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">MADA & International Cards</h3>
                <p className="text-green-100 text-sm">Support for all major payment methods including MADA, Visa, Mastercard, and digital wallets</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI-Powered Analytics</h3>
                <p className="text-green-100 text-sm">Real-time insights, fraud detection, and revenue forecasting powered by artificial intelligence</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise Security</h3>
                <p className="text-green-100 text-sm">Bank-grade security with 3D Secure, tokenization, and PCI DSS compliance</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-green-100">Uptime SLA</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50ms</div>
                <div className="text-sm text-green-100">Avg Response</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-green-100">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout