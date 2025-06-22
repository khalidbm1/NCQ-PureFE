/**
 * Encrypted chat component with E2E encryption
 */
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useEncryption } from '@/hooks/encryption/useEncryption';
import { useWebSocket } from '@/hooks/useWebSocket';
import { format } from 'date-fns';

interface EncryptedMessage {
  id: string;
  senderId: string;
  recipientId: string;
  encryptedContent: string;
  encryptedKey: string;
  iv: string;
  timestamp: string;
  decrypted?: boolean;
  content?: string;
}

interface EncryptedChatProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  conversationId?: string;
}

export function EncryptedChat({
  recipientId,
  recipientName,
  recipientAvatar,
  conversationId,
}: EncryptedChatProps) {
  const [messages, setMessages] = useState<EncryptedMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  const { encryptMessage, decryptMessage, encryptionStatus } = useEncryption();
  const { sendMessage, subscribe } = useWebSocket();
  
  useEffect(() => {
    // Subscribe to encrypted messages
    const unsubscribe = subscribe('encrypted_message', async (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [...prev, data]);
        
        // Auto-decrypt if enabled
        if (encryptionStatus.autoEncrypt && data.recipientId === 'current_user_id') {
          await handleDecryptMessage(data);
        }
      }
    });
    
    return unsubscribe;
  }, [conversationId, encryptionStatus.autoEncrypt]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !encryptionStatus.hasKeys) return;
    
    setIsEncrypting(true);
    try {
      // Encrypt message
      const encryptedData = await encryptMessage(inputMessage, recipientId);
      
      // Create message object
      const message: EncryptedMessage = {
        id: Date.now().toString(),
        senderId: 'current_user_id', // Replace with actual user ID
        recipientId,
        encryptedContent: encryptedData.encryptedContent,
        encryptedKey: encryptedData.encryptedKey,
        iv: encryptedData.iv,
        timestamp: new Date().toISOString(),
        decrypted: true,
        content: inputMessage,
      };
      
      // Add to local messages
      setMessages((prev) => [...prev, message]);
      
      // Send via WebSocket
      sendMessage('encrypted_message', {
        ...message,
        conversationId,
      });
      
      // Clear input
      setInputMessage('');
    } catch (error) {
      console.error('Failed to encrypt message:', error);
    } finally {
      setIsEncrypting(false);
    }
  };
  
  const handleDecryptMessage = async (message: EncryptedMessage) => {
    if (message.decrypted) return;
    
    setIsDecrypting(true);
    try {
      const decryptedContent = await decryptMessage({
        encryptedContent: message.encryptedContent,
        encryptedKey: message.encryptedKey,
        iv: message.iv,
      });
      
      // Update message with decrypted content
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id
            ? { ...msg, decrypted: true, content: decryptedContent }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to decrypt message:', error);
    } finally {
      setIsDecrypting(false);
    }
  };
  
  const isOwnMessage = (message: EncryptedMessage) => {
    return message.senderId === 'current_user_id'; // Replace with actual user ID
  };
  
  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback>{recipientName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{recipientName}</h3>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">
                End-to-end encrypted
              </span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="gap-1">
          <Lock className="h-3 w-3" />
          E2E
        </Badge>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                isOwnMessage(message) ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage(message)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.decrypted ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm italic">Encrypted message</span>
                    {!isOwnMessage(message) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDecryptMessage(message)}
                        disabled={isDecrypting}
                      >
                        {isDecrypting ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t">
        {encryptionStatus.hasKeys ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type an encrypted message..."
                className="pl-10"
                disabled={isEncrypting}
              />
            </div>
            <Button type="submit" disabled={isEncrypting || !inputMessage.trim()}>
              {isEncrypting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-2 text-sm text-muted-foreground">
            Encryption keys required to send messages
          </div>
        )}
      </div>
    </Card>
  );
}