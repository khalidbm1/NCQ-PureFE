import { useState } from 'react'
import { ChevronUp, ChevronDown, Copy, Check, User, Key } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { toast } from 'sonner'

export function CredentialsPanel() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const credentials = {
    email: 'user@ncq.sa',
    password: 'user123',
    apiKey: 'demo-api-key-12345',
    tenantId: 'tenant-1'
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copied to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-sm">Demo Credentials</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="px-3 pb-3 space-y-3 border-t">
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-2 flex-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-mono truncate">{credentials.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(credentials.email, 'Email')
                  }}
                >
                  {copiedField === 'Email' ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-2 flex-1">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Password</p>
                    <p className="text-sm font-mono truncate">{credentials.password}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(credentials.password, 'Password')
                  }}
                >
                  {copiedField === 'Password' ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-2 flex-1">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">API Key</p>
                    <p className="text-sm font-mono truncate">{credentials.apiKey}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(credentials.apiKey, 'API Key')
                  }}
                >
                  {copiedField === 'API Key' ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Click to copy • Auto-logged in
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}