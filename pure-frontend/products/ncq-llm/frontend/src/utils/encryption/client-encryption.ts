/**
 * Client-side encryption utilities for NCQ LLM
 * Handles encryption/decryption in the browser
 */

export class ClientEncryption {
  private publicKey: CryptoKey | null = null;
  private privateKey: CryptoKey | null = null;
  
  /**
   * Generate a new keypair for the user
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
    
    // Export keys to PEM format
    const publicKeyData = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyData = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    
    return {
      publicKey: this.arrayBufferToPem(publicKeyData, 'PUBLIC KEY'),
      privateKey: this.arrayBufferToPem(privateKeyData, 'PRIVATE KEY'),
    };
  }
  
  /**
   * Import public key from PEM string
   */
  async importPublicKey(pemKey: string): Promise<CryptoKey> {
    const keyData = this.pemToArrayBuffer(pemKey);
    return crypto.subtle.importKey(
      'spki',
      keyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );
  }
  
  /**
   * Import private key from PEM string
   */
  async importPrivateKey(pemKey: string): Promise<CryptoKey> {
    const keyData = this.pemToArrayBuffer(pemKey);
    return crypto.subtle.importKey(
      'pkcs8',
      keyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['decrypt']
    );
  }
  
  /**
   * Encrypt message using hybrid encryption (RSA + AES)
   */
  async encryptMessage(
    message: string,
    recipientPublicKey: string
  ): Promise<{
    encryptedContent: string;
    encryptedKey: string;
    iv: string;
  }> {
    // Generate AES key for this message
    const aesKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt message with AES
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      messageData
    );
    
    // Import recipient's public key
    const publicKey = await this.importPublicKey(recipientPublicKey);
    
    // Export AES key
    const aesKeyData = await crypto.subtle.exportKey('raw', aesKey);
    
    // Encrypt AES key with recipient's public key
    const encryptedKey = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      aesKeyData
    );
    
    return {
      encryptedContent: this.arrayBufferToBase64(encryptedContent),
      encryptedKey: this.arrayBufferToBase64(encryptedKey),
      iv: this.arrayBufferToBase64(iv),
    };
  }
  
  /**
   * Decrypt message
   */
  async decryptMessage(
    encryptedData: {
      encryptedContent: string;
      encryptedKey: string;
      iv: string;
    },
    privateKey: string
  ): Promise<string> {
    // Import private key
    const privKey = await this.importPrivateKey(privateKey);
    
    // Decrypt AES key
    const encryptedKeyBuffer = this.base64ToArrayBuffer(encryptedData.encryptedKey);
    const aesKeyData = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privKey,
      encryptedKeyBuffer
    );
    
    // Import AES key
    const aesKey = await crypto.subtle.importKey(
      'raw',
      aesKeyData,
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['decrypt']
    );
    
    // Decrypt content
    const encryptedContentBuffer = this.base64ToArrayBuffer(encryptedData.encryptedContent);
    const ivBuffer = this.base64ToArrayBuffer(encryptedData.iv);
    
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      aesKey,
      encryptedContentBuffer
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  }
  
  /**
   * Encrypt file
   */
  async encryptFile(
    file: File,
    userPublicKey: string
  ): Promise<{
    encryptedData: ArrayBuffer;
    encryptedKey: string;
    iv: string;
    metadata: {
      fileName: string;
      fileType: string;
      fileSize: number;
    };
  }> {
    // Read file
    const fileData = await file.arrayBuffer();
    
    // Generate AES key
    const aesKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt file data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      fileData
    );
    
    // Import public key
    const publicKey = await this.importPublicKey(userPublicKey);
    
    // Export and encrypt AES key
    const aesKeyData = await crypto.subtle.exportKey('raw', aesKey);
    const encryptedKey = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      aesKeyData
    );
    
    return {
      encryptedData,
      encryptedKey: this.arrayBufferToBase64(encryptedKey),
      iv: this.arrayBufferToBase64(iv),
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    };
  }
  
  /**
   * Create secure hash of sensitive data
   */
  async hashData(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const encoder = new TextEncoder();
    const saltValue = salt || crypto.getRandomValues(new Uint8Array(16)).toString();
    const dataToHash = encoder.encode(data + saltValue);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
    
    return {
      hash: this.arrayBufferToBase64(hashBuffer),
      salt: saltValue,
    };
  }
  
  /**
   * Derive key from password (for key encryption)
   */
  async deriveKeyFromPassword(
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Helper methods
  
  private arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
    const base64 = this.arrayBufferToBase64(buffer);
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
  }
  
  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace(/-----BEGIN .*-----/, '')
      .replace(/-----END .*-----/, '')
      .replace(/\s/g, '');
    return this.base64ToArrayBuffer(base64);
  }
  
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Export singleton instance
export const clientEncryption = new ClientEncryption();

// Export types
export interface EncryptedMessage {
  id: string;
  encryptedContent: string;
  encryptedKey: string;
  iv: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
}

export interface EncryptionStatus {
  enabled: boolean;
  hasKeys: boolean;
  keyGeneratedAt?: string;
  autoEncrypt: boolean;
}