"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, RefreshCw, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/lib/hooks/useAIChat";

export default function AIChatWindow() {
  const { isChatOpen, setIsChatOpen } = useAppContext();
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isLoading, sendMessage, clearMessages, retryMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "List all my tasks and projects",
    "What tasks are overdue?", 
    "Show me my project progress",
    "Summarize today's progress"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    setInputMessage('');
    await sendMessage(textToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 ${
          isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        suppressHydrationWarning
        title="Open AI Assistant"
      >
        ✨
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Welcome to AI Assistant!</p>
                  <p className="text-sm mb-4">Ask me about your tasks, projects, or anything else you need help with.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Try asking:</h4>
                    {suggestions.map((suggestion, i) => (
                      <button 
                        key={i} 
                        className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-gray-700 transition-colors"
                        onClick={() => handleSendMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-blue-600 text-white rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs opacity-75">You</span>
                          <span className="text-xs opacity-75">{formatTimestamp(msg.timestamp)}</span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-gray-100 text-gray-900 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-gray-600">AI Assistant</span>
                        </div>
                        
                        {msg.isLoading ? (
                          <div className="flex items-center space-x-2 py-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">Thinking...</span>
                          </div>
                        ) : msg.error ? (
                          <div className="space-y-2">
                            <p className="text-sm text-red-600">Error: {msg.error}</p>
                            <button
                              onClick={() => retryMessage(msg.id)}
                              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Retry</span>
                            </button>
                          </div>
                        ) : msg.response ? (
                          <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your projects..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
