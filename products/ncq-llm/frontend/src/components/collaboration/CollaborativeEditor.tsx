/**
 * Collaborative editor component with real-time synchronization
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
  className?: string;
  readOnly?: boolean;
}

interface CursorPosition {
  userId: string;
  position: number;
  color: string;
  userName?: string;
}

interface Selection {
  userId: string;
  start: number;
  end: number;
  color: string;
}

export function CollaborativeEditor({
  documentId,
  initialContent = '',
  onContentChange,
  className,
  readOnly = false,
}: CollaborativeEditorProps) {
  const { user } = useAuth();
  const { sendMessage, subscribe, joinRoom, leaveRoom } = useWebSocket();
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initialContent);
  const [version, setVersion] = useState(0);
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map());
  const [selections, setSelections] = useState<Map<string, Selection>>(new Map());
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  
  // Color palette for users
  const userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#FFD54F', '#4FC3F7', '#BA68C8',
  ];
  
  const getUserColor = useCallback((userId: string) => {
    const index = userId.charCodeAt(0) % userColors.length;
    return userColors[index];
  }, []);
  
  // Join document room on mount
  useEffect(() => {
    joinRoom(documentId);
    
    // Request document sync
    sendMessage('document_sync', {
      document_id: documentId,
      client_version: version,
    });
    
    return () => {
      leaveRoom(documentId);
    };
  }, [documentId]);
  
  // Subscribe to document events
  useEffect(() => {
    const handleDocumentUpdate = (data: any) => {
      if (data.document_id !== documentId || data.user_id === user?.id) {
        return;
      }
      
      // Apply operation to local content
      const operation = data.operation;
      setContent(prevContent => {
        let newContent = prevContent;
        
        if (operation.type === 'insert') {
          newContent = 
            prevContent.slice(0, operation.position) +
            operation.content +
            prevContent.slice(operation.position);
        } else if (operation.type === 'delete') {
          newContent = 
            prevContent.slice(0, operation.position) +
            prevContent.slice(operation.position + operation.length);
        }
        
        return newContent;
      });
      
      setVersion(data.version);
    };
    
    const handleCursorPosition = (data: any) => {
      if (data.document_id !== documentId || data.user_id === user?.id) {
        return;
      }
      
      setCursors(prev => {
        const next = new Map(prev);
        next.set(data.user_id, {
          userId: data.user_id,
          position: data.position,
          color: getUserColor(data.user_id),
          userName: data.user_name,
        });
        return next;
      });
    };
    
    const handleSelectionChange = (data: any) => {
      if (data.document_id !== documentId || data.user_id === user?.id) {
        return;
      }
      
      setSelections(prev => {
        const next = new Map(prev);
        if (data.selection.start === data.selection.end) {
          next.delete(data.user_id);
        } else {
          next.set(data.user_id, {
            userId: data.user_id,
            start: data.selection.start,
            end: data.selection.end,
            color: getUserColor(data.user_id),
          });
        }
        return next;
      });
    };
    
    const handleUserJoin = (data: any) => {
      if (data.document_id === documentId) {
        setActiveUsers(data.active_users);
      }
    };
    
    const handleUserLeave = (data: any) => {
      if (data.document_id === documentId) {
        setCursors(prev => {
          const next = new Map(prev);
          next.delete(data.user_id);
          return next;
        });
        setSelections(prev => {
          const next = new Map(prev);
          next.delete(data.user_id);
          return next;
        });
        setActiveUsers(data.active_users);
      }
    };
    
    const unsubscribers = [
      subscribe('document_update', handleDocumentUpdate),
      subscribe('cursor_position', handleCursorPosition),
      subscribe('selection_change', handleSelectionChange),
      subscribe('collaborative_user_join', handleUserJoin),
      subscribe('collaborative_user_leave', handleUserLeave),
    ];
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [documentId, user?.id, getUserColor, subscribe]);
  
  // Handle local changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldContent = content;
    
    // Calculate operation
    let operation;
    if (newContent.length > oldContent.length) {
      // Insert operation
      const position = e.target.selectionStart - (newContent.length - oldContent.length);
      const insertedContent = newContent.slice(position, e.target.selectionStart);
      
      operation = {
        type: 'insert',
        position,
        content: insertedContent,
      };
    } else if (newContent.length < oldContent.length) {
      // Delete operation
      const position = e.target.selectionStart;
      const length = oldContent.length - newContent.length;
      
      operation = {
        type: 'delete',
        position,
        length,
      };
    } else {
      // Replace operation (treated as delete + insert)
      // For simplicity, we'll skip this case
      return;
    }
    
    // Update local content
    setContent(newContent);
    onContentChange?.(newContent);
    
    // Send operation to server
    sendMessage('document_update', {
      document_id: documentId,
      operation,
    });
  }, [content, documentId, sendMessage, onContentChange]);
  
  // Handle cursor/selection changes
  const handleSelectionChange = useCallback(() => {
    if (!editorRef.current || !user) return;
    
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    
    // Send cursor position
    sendMessage('cursor_position', {
      document_id: documentId,
      position: end,
    });
    
    // Send selection if any
    if (start !== end) {
      sendMessage('selection_change', {
        document_id: documentId,
        selection: { start, end },
      });
    }
  }, [documentId, user, sendMessage]);
  
  // Render cursors and selections
  const renderDecorations = () => {
    if (!editorRef.current) return null;
    
    const decorations: React.ReactNode[] = [];
    
    // Render selections
    selections.forEach((selection, userId) => {
      // Calculate position for selection highlight
      // This is simplified - in production, use a proper text measurement library
      decorations.push(
        <div
          key={`selection-${userId}`}
          className="absolute pointer-events-none"
          style={{
            backgroundColor: selection.color,
            opacity: 0.3,
            // Position calculation would go here
          }}
        />
      );
    });
    
    // Render cursors
    cursors.forEach((cursor, userId) => {
      decorations.push(
        <div
          key={`cursor-${userId}`}
          className="absolute pointer-events-none"
          style={{
            left: '0px', // Calculate based on cursor.position
            top: '0px',  // Calculate based on line
          }}
        >
          <div
            className="w-0.5 h-5 animate-pulse"
            style={{ backgroundColor: cursor.color }}
          />
          {cursor.userName && (
            <Badge
              variant="outline"
              className="text-xs absolute -top-6 left-0 whitespace-nowrap"
              style={{ borderColor: cursor.color, color: cursor.color }}
            >
              {cursor.userName}
            </Badge>
          )}
        </div>
      );
    });
    
    return decorations;
  };
  
  return (
    <Card className={cn('relative', className)}>
      {/* Active users */}
      <div className="flex items-center gap-2 p-4 border-b">
        <span className="text-sm text-muted-foreground">Active users:</span>
        <div className="flex -space-x-2">
          {activeUsers.slice(0, 5).map((userId) => (
            <Avatar key={userId} className="h-6 w-6 border-2 border-background">
              <AvatarFallback
                style={{ backgroundColor: getUserColor(userId) }}
                className="text-xs text-white"
              >
                {userId[0]}
              </AvatarFallback>
            </Avatar>
          ))}
          {activeUsers.length > 5 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
              +{activeUsers.length - 5}
            </div>
          )}
        </div>
      </div>
      
      {/* Editor */}
      <div className="relative p-4">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleChange}
          onSelect={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          readOnly={readOnly}
          className={cn(
            'w-full min-h-[400px] p-4 font-mono text-sm',
            'bg-transparent resize-none focus:outline-none',
            'selection:bg-primary/20'
          )}
          placeholder="Start typing..."
        />
        
        {/* Decorations (cursors and selections) */}
        <div className="absolute inset-0 pointer-events-none">
          {renderDecorations()}
        </div>
      </div>
      
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t text-xs text-muted-foreground">
        <span>Version: {version}</span>
        <span>{content.length} characters</span>
      </div>
    </Card>
  );
}