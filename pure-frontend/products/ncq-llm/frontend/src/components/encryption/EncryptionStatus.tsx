/**
 * Encryption status indicator component
 */
import React from 'react';
import { Shield, ShieldCheck, ShieldOff, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEncryption } from '@/hooks/encryption/useEncryption';

interface EncryptionStatusProps {
  variant?: 'icon' | 'badge' | 'full';
  showSettings?: boolean;
}

export function EncryptionStatus({ 
  variant = 'badge', 
  showSettings = false 
}: EncryptionStatusProps) {
  const { encryptionStatus, generateKeys, isLoading } = useEncryption();
  
  const getStatusIcon = () => {
    if (!encryptionStatus.hasKeys) {
      return <ShieldOff className="h-4 w-4" />;
    }
    if (encryptionStatus.autoEncrypt) {
      return <ShieldCheck className="h-4 w-4" />;
    }
    return <Shield className="h-4 w-4" />;
  };
  
  const getStatusText = () => {
    if (!encryptionStatus.hasKeys) {
      return 'No Encryption';
    }
    if (encryptionStatus.autoEncrypt) {
      return 'Auto-Encrypted';
    }
    return 'Encryption Available';
  };
  
  const getStatusColor = () => {
    if (!encryptionStatus.hasKeys) {
      return 'destructive';
    }
    if (encryptionStatus.autoEncrypt) {
      return 'success';
    }
    return 'secondary';
  };
  
  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={showSettings ? undefined : generateKeys}
              disabled={isLoading || encryptionStatus.hasKeys}
            >
              {getStatusIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
            {!encryptionStatus.hasKeys && (
              <p className="text-xs text-muted-foreground">
                Click to enable encryption
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  if (variant === 'badge') {
    return (
      <Badge
        variant={getStatusColor() as any}
        className="gap-1"
      >
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
    );
  }
  
  // Full variant
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${getStatusColor()}/10`}>
          {getStatusIcon()}
        </div>
        <div>
          <h4 className="font-medium">{getStatusText()}</h4>
          <p className="text-sm text-muted-foreground">
            {encryptionStatus.hasKeys 
              ? `Keys generated ${new Date(encryptionStatus.keyGeneratedAt!).toLocaleDateString()}`
              : 'End-to-end encryption not configured'
            }
          </p>
        </div>
      </div>
      
      {!encryptionStatus.hasKeys && (
        <Button
          onClick={generateKeys}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? 'Generating...' : 'Enable Encryption'}
        </Button>
      )}
    </div>
  );
}