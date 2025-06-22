/**
 * React hook for encryption functionality
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { clientEncryption, EncryptionStatus } from '@/utils/encryption/client-encryption';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface UseEncryptionReturn {
  encryptionStatus: EncryptionStatus;
  isLoading: boolean;
  generateKeys: () => Promise<void>;
  encryptMessage: (content: string, recipientId: string) => Promise<any>;
  decryptMessage: (encryptedData: any) => Promise<string>;
  encryptFile: (file: File) => Promise<any>;
  toggleAutoEncrypt: () => Promise<void>;
  getPublicKey: (userId: string) => Promise<string>;
}

export function useEncryption(): UseEncryptionReturn {
  const { user } = useAuth();
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus>({
    enabled: false,
    hasKeys: false,
    autoEncrypt: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userKeys, setUserKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);

  // Load encryption status on mount
  useEffect(() => {
    if (user) {
      loadEncryptionStatus();
    }
  }, [user]);

  const loadEncryptionStatus = async () => {
    try {
      const response = await api.get('/api/v1/encryption/status');
      setEncryptionStatus(response.data);
      
      // Load keys from secure storage if available
      const storedKeys = await loadKeysFromStorage();
      if (storedKeys) {
        setUserKeys(storedKeys);
      }
    } catch (error) {
      console.error('Failed to load encryption status:', error);
    }
  };

  const generateKeys = async () => {
    setIsLoading(true);
    try {
      // Generate keys client-side
      const keyPair = await clientEncryption.generateKeyPair();
      
      // Send public key to server
      const response = await api.post('/api/v1/encryption/keys/generate', {
        publicKey: keyPair.publicKey,
      });
      
      // Store keys securely (in production, use more secure storage)
      await storeKeysSecurely(keyPair);
      setUserKeys(keyPair);
      
      setEncryptionStatus({
        ...encryptionStatus,
        hasKeys: true,
        keyGeneratedAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Encryption Keys Generated',
        description: 'Your messages can now be encrypted end-to-end.',
      });
    } catch (error) {
      toast({
        title: 'Key Generation Failed',
        description: 'Failed to generate encryption keys. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const encryptMessage = async (content: string, recipientId: string) => {
    if (!userKeys) {
      throw new Error('No encryption keys available');
    }
    
    try {
      // Get recipient's public key
      const recipientKey = await getPublicKey(recipientId);
      
      // Encrypt message client-side
      const encryptedData = await clientEncryption.encryptMessage(content, recipientKey);
      
      // Send encrypted message to server
      const response = await api.post('/api/v1/encryption/messages/encrypt', {
        ...encryptedData,
        recipientId,
      });
      
      return response.data;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  };

  const decryptMessage = async (encryptedData: any): Promise<string> => {
    if (!userKeys) {
      throw new Error('No decryption keys available');
    }
    
    try {
      // Decrypt message client-side
      const decryptedContent = await clientEncryption.decryptMessage(
        {
          encryptedContent: encryptedData.encryptedContent,
          encryptedKey: encryptedData.encryptedKey,
          iv: encryptedData.iv,
        },
        userKeys.privateKey
      );
      
      return decryptedContent;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  };

  const encryptFile = async (file: File) => {
    if (!userKeys) {
      throw new Error('No encryption keys available');
    }
    
    setIsLoading(true);
    try {
      // Encrypt file client-side
      const encryptedFile = await clientEncryption.encryptFile(file, userKeys.publicKey);
      
      // Create form data
      const formData = new FormData();
      formData.append('encryptedData', new Blob([encryptedFile.encryptedData]));
      formData.append('encryptedKey', encryptedFile.encryptedKey);
      formData.append('iv', encryptedFile.iv);
      formData.append('metadata', JSON.stringify(encryptedFile.metadata));
      
      // Upload encrypted file
      const response = await api.post('/api/v1/encryption/files/encrypt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({
        title: 'File Encrypted',
        description: 'Your file has been encrypted and uploaded securely.',
      });
      
      return response.data;
    } catch (error) {
      toast({
        title: 'File Encryption Failed',
        description: 'Failed to encrypt file. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoEncrypt = async () => {
    try {
      const newStatus = !encryptionStatus.autoEncrypt;
      
      const response = await api.patch('/api/v1/encryption/settings', {
        autoEncryptMessages: newStatus,
        autoEncryptFiles: newStatus,
      });
      
      setEncryptionStatus({
        ...encryptionStatus,
        autoEncrypt: newStatus,
      });
      
      toast({
        title: newStatus ? 'Auto-Encryption Enabled' : 'Auto-Encryption Disabled',
        description: newStatus 
          ? 'All messages and files will be encrypted automatically.'
          : 'Encryption is now manual.',
      });
    } catch (error) {
      toast({
        title: 'Settings Update Failed',
        description: 'Failed to update encryption settings.',
        variant: 'destructive',
      });
    }
  };

  const getPublicKey = async (userId: string): Promise<string> => {
    try {
      const response = await api.get(`/api/v1/encryption/keys/public/${userId}`);
      return response.data.publicKey;
    } catch (error) {
      throw new Error(`Failed to get public key for user ${userId}`);
    }
  };

  // Secure key storage helpers
  const storeKeysSecurely = async (keyPair: { publicKey: string; privateKey: string }) => {
    // In production, use more secure storage methods
    // For now, using encrypted IndexedDB
    const encryptedKeys = await encryptKeysForStorage(keyPair);
    localStorage.setItem('ncq_enc_keys', encryptedKeys);
  };

  const loadKeysFromStorage = async (): Promise<{ publicKey: string; privateKey: string } | null> => {
    const encryptedKeys = localStorage.getItem('ncq_enc_keys');
    if (!encryptedKeys) return null;
    
    try {
      return await decryptKeysFromStorage(encryptedKeys);
    } catch (error) {
      console.error('Failed to decrypt stored keys:', error);
      return null;
    }
  };

  const encryptKeysForStorage = async (keyPair: { publicKey: string; privateKey: string }) => {
    // Use a derived key from user password or device key
    // This is simplified - in production, use proper key derivation
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const password = user?.id || 'default'; // In production, use secure password
    
    const key = await clientEncryption.deriveKeyFromPassword(password, salt);
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JSON.stringify(keyPair));
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      keyData
    );
    
    return JSON.stringify({
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData)),
    });
  };

  const decryptKeysFromStorage = async (encryptedKeys: string) => {
    const { salt, iv, data } = JSON.parse(encryptedKeys);
    const password = user?.id || 'default';
    
    const key = await clientEncryption.deriveKeyFromPassword(
      password,
      new Uint8Array(salt)
    );
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(data)
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
  };

  return {
    encryptionStatus,
    isLoading,
    generateKeys,
    encryptMessage,
    decryptMessage,
    encryptFile,
    toggleAutoEncrypt,
    getPublicKey,
  };
}