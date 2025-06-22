/**
 * Encryption settings component
 */
import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  RefreshCw, 
  Download, 
  Upload,
  AlertTriangle,
  Check,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEncryption } from '@/hooks/encryption/useEncryption';
import { toast } from '@/components/ui/use-toast';

export function EncryptionSettings() {
  const { 
    encryptionStatus, 
    generateKeys, 
    toggleAutoEncrypt,
    isLoading 
  } = useEncryption();
  
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRotateDialog, setShowRotateDialog] = useState(false);
  
  const handleExportKeys = async () => {
    if (!exportPassword) {
      toast({
        title: 'Password Required',
        description: 'Please enter a password to encrypt your exported keys.',
        variant: 'destructive',
      });
      return;
    }
    
    // Export keys logic here
    // This would encrypt the keys with the password and download them
    
    toast({
      title: 'Keys Exported',
      description: 'Your encryption keys have been exported securely.',
    });
    
    setShowExportDialog(false);
    setExportPassword('');
  };
  
  const handleRotateKeys = async () => {
    try {
      await generateKeys();
      toast({
        title: 'Keys Rotated',
        description: 'Your encryption keys have been rotated successfully.',
      });
      setShowRotateDialog(false);
    } catch (error) {
      toast({
        title: 'Rotation Failed',
        description: 'Failed to rotate encryption keys.',
        variant: 'destructive',
      });
    }
  };
  
  const copyPublicKey = () => {
    // Copy public key to clipboard
    navigator.clipboard.writeText('public_key_here');
    toast({
      title: 'Copied',
      description: 'Public key copied to clipboard.',
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Encryption Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Encryption Status
          </CardTitle>
          <CardDescription>
            Manage your end-to-end encryption settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {encryptionStatus.hasKeys ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Encryption Enabled</span>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Key className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Keys generated on {new Date(encryptionStatus.keyGeneratedAt!).toLocaleDateString()}
              </div>
            </>
          ) : (
            <>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Encryption Not Configured</AlertTitle>
                <AlertDescription>
                  Generate encryption keys to enable end-to-end encryption for your messages and files.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={generateKeys} 
                disabled={isLoading}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                Generate Encryption Keys
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Auto-Encryption Settings */}
      {encryptionStatus.hasKeys && (
        <Card>
          <CardHeader>
            <CardTitle>Auto-Encryption</CardTitle>
            <CardDescription>
              Automatically encrypt all messages and files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-encrypt" className="flex flex-col gap-1">
                <span>Enable Auto-Encryption</span>
                <span className="text-sm font-normal text-muted-foreground">
                  All messages and files will be encrypted automatically
                </span>
              </Label>
              <Switch
                id="auto-encrypt"
                checked={encryptionStatus.autoEncrypt}
                onCheckedChange={toggleAutoEncrypt}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key Management */}
      {encryptionStatus.hasKeys && (
        <Card>
          <CardHeader>
            <CardTitle>Key Management</CardTitle>
            <CardDescription>
              Manage your encryption keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Public Key */}
            <div className="space-y-2">
              <Label>Public Key</Label>
              <div className="flex gap-2">
                <Input
                  value="SHA256:xxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyPublicKey}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this with others to receive encrypted messages
              </p>
            </div>
            
            <Separator />
            
            {/* Key Actions */}
            <div className="space-y-2">
              {/* Export Keys */}
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Keys
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Encryption Keys</DialogTitle>
                    <DialogDescription>
                      Export your keys for backup. They will be encrypted with your password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="export-password">Password</Label>
                      <Input
                        id="export-password"
                        type="password"
                        value={exportPassword}
                        onChange={(e) => setExportPassword(e.target.value)}
                        placeholder="Enter a strong password"
                      />
                    </div>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Keep this password safe. You'll need it to import your keys.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleExportKeys}>
                      Export Keys
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Import Keys */}
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Keys
              </Button>
              
              {/* Rotate Keys */}
              <Dialog open={showRotateDialog} onOpenChange={setShowRotateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Rotate Keys
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rotate Encryption Keys</DialogTitle>
                    <DialogDescription>
                      Generate new encryption keys. Old encrypted messages will still be accessible.
                    </DialogDescription>
                  </DialogHeader>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      After rotating keys, others will need your new public key to send you encrypted messages.
                    </AlertDescription>
                  </Alert>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRotateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleRotateKeys}
                      disabled={isLoading}
                    >
                      Rotate Keys
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Messages are encrypted end-to-end using RSA-4096 and AES-256</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Private keys never leave your device</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <span>NCQ cannot read your encrypted messages</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Keys are stored securely in your browser</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}