'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Mic,
  MicOff,
  Settings,
  Download,
  Copy,
  RefreshCw,
  Loader2,
  Bot,
  User,
  Paperclip,
  X,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useWebSocket } from '@/hooks/use-websocket'
import { useVoiceRecognition } from '@/hooks/use-voice-recognition'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
  tokens?: number
  cached?: boolean
  attachments?: Array<{
    type: 'image' | 'document'
    url: string
    name: string
  }>
}

interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  useCache: boolean
  streamResponse: boolean
  includeTenantContext: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [settings, setSettings] = useState<ChatSettings>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    useCache: true,
    streamResponse: true,
    includeTenantContext: true,
  })

  // WebSocket for streaming responses
  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'stream') {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + data.content },
            ]
          }
          return prev
        })
      } else if (data.type === 'complete') {
        setIsLoading(false)
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                model: data.model,
                tokens: data.tokens,
                cached: data.cached,
              },
            ]
          }
          return prev
        })
      } else if (data.type === 'error') {
        setIsLoading(false)
        toast.error(data.message || 'An error occurred')
      }
    },
  })

  // Voice recognition
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: isVoiceSupported,
  } = useVoiceRecognition({
    onResult: (text) => {
      setInput((prev) => prev + ' ' + text)
    },
  })

  const handleSubmit = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: attachments.map((file) => ({
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    // Send message via WebSocket
    sendMessage({
      type: 'inference',
      content: input,
      settings,
      attachments: attachments.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const downloadChat = () => {
    const chatContent = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n')
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString()}.txt`
    a.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="flex flex-col h-[700px]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">AI Chat</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'success' : 'destructive'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadChat}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {showSettings && (
        <CardContent className="border-b pb-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Model</Label>
              <Select
                value={settings.model}
                onValueChange={(value) =>
                  setSettings({ ...settings, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                  <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                  <SelectItem value="llama2-70b">Llama 2 70B</SelectItem>
                  <SelectItem value="mistral-7b">Mistral 7B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Temperature: {settings.temperature}</Label>
              <Slider
                value={[settings.temperature]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, temperature: value })
                }
                min={0}
                max={2}
                step={0.1}
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Tokens: {settings.maxTokens}</Label>
              <Slider
                value={[settings.maxTokens]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, maxTokens: value })
                }
                min={256}
                max={4096}
                step={256}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Use Cache</Label>
              <Switch
                checked={settings.useCache}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, useCache: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Stream Response</Label>
              <Switch
                checked={settings.streamResponse}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, streamResponse: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include Tenant Context</Label>
              <Switch
                checked={settings.includeTenantContext}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, includeTenantContext: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation by typing a message below
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {message.attachments.map((attachment, idx) => (
                      <div key={idx} className="text-xs opacity-70">
                        <Paperclip className="inline h-3 w-3 mr-1" />
                        {attachment.name}
                      </div>
                    ))}
                  </div>
                )}
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {message.content || '...'}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.role === 'assistant' && message.model && (
                  <div className="mt-2 flex items-center gap-2 text-xs opacity-60">
                    <span>{message.model}</span>
                    {message.tokens && <span>• {message.tokens} tokens</span>}
                    {message.cached && (
                      <Badge variant="secondary" className="text-xs">
                        Cached
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-auto"
                      onClick={() => copyMessage(message.content)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <CardContent className="border-t pt-4">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, idx) => (
              <Badge key={idx} variant="secondary" className="pr-1">
                {file.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileSelect}
            accept="image/*,.pdf,.txt,.docx,.csv"
          />
          <label htmlFor="file-upload">
            <Button variant="ghost" size="icon" asChild>
              <span>
                <Paperclip className="h-4 w-4" />
              </span>
            </Button>
          </label>
          {isVoiceSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              className={cn(isListening && 'text-red-500')}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 