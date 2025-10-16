import { useState, useCallback } from 'react';
import { sendAIMessage } from '@/lib/api';
import { AIChatResponse } from '@/types';

export type ChatMessage = {
  id: string;
  message: string;
  response?: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    const messageId = Date.now().toString();
    const newMessage: ChatMessage = {
      id: messageId,
      message,
      timestamp: new Date(),
      isLoading: true,
    };

    // Add message to chat
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response: AIChatResponse = await sendAIMessage(message);
      
      // Update message with response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: response.output, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      // Update message with error
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, error: errorMessage, isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message) return;

    // Reset message state
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isLoading: true, error: undefined, response: undefined }
          : msg
      )
    );
    setIsLoading(true);

    try {
      const response: AIChatResponse = await sendAIMessage(message.message);
      
      // Update message with response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, response: response.output, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      // Update message with error
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, error: errorMessage, isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    retryMessage,
  };
}
