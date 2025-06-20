'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageCircle, 
  X, 
  User,
  Loader2
} from 'lucide-react';
import styles from './CJChatBubble.module.css';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  isTyping?: boolean;
}

export interface CJChatBubbleProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSendMessage?: (message: string) => Promise<string>;
  messages?: Message[];
  placeholder?: string;
  title?: string;
  theme?: 'default' | 'neon' | 'minimal';
  disabled?: boolean;
}

export function CJChatBubble({ 
  className = '', 
  position = 'bottom-right',
  onSendMessage,
  messages: externalMessages,
  placeholder = '메시지를 입력하세요...',
  title = 'CJ Chat',
  theme = 'default',
  disabled = false
}: CJChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalMessages, setInternalMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 무엇을 도와드릴까요?',
      sender: 'system',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use external messages if provided, otherwise use internal state
  const messages = externalMessages || internalMessages;
  const setMessages = externalMessages ? () => {} : setInternalMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return styles.bottomLeft;
      case 'top-right':
        return styles.topRight;
      case 'top-left':
        return styles.topLeft;
      default:
        return styles.bottomRight;
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return styles.neonTheme;
      case 'minimal':
        return styles.minimalTheme;
      default:
        return styles.defaultTheme;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || disabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    if (!externalMessages) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator only for internal messages
    if (!externalMessages) {
      const typingMessage: Message = {
        id: 'typing',
        text: '...',
        sender: 'system',
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages(prev => [...prev, typingMessage]);
    }

    try {
      const response = onSendMessage 
        ? await onSendMessage(inputValue)
        : `메시지를 받았습니다: "${inputValue}"`;

      if (!externalMessages) {
        // Remove typing indicator and add real response
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'typing');
          return [...filtered, {
            id: Date.now().toString(),
            text: response,
            sender: 'system',
            timestamp: new Date(),
          }];
        });
      }
    } catch (error) {
      if (!externalMessages) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'typing');
          return [...filtered, {
            id: Date.now().toString(),
            text: '죄송합니다. 일시적인 오류가 발생했습니다.',
            sender: 'system',
            timestamp: new Date(),
          }];
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`${styles.chatBubble} ${getPositionClasses()} ${getThemeClasses()} ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.titleContainer}>
                  <h3 className={styles.title}>{title}</h3>
                  <p className={styles.status}>온라인</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={styles.closeButton}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${styles.messageWrapper} ${styles[message.sender]}`}
                >
                  <div className={`${styles.messageContent} ${styles[message.sender]}`}>
                    <div className={`${styles.messageAvatar} ${styles[message.sender]}`}>
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <div className={`${styles.messageBubble} ${styles[message.sender]}`}>
                      {message.isTyping ? (
                        <div className={styles.typingIndicator}>
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className={styles.typingDot}
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className={styles.typingDot}
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className={styles.typingDot}
                          />
                        </div>
                      ) : (
                        <p className={styles.messageText}>{message.text}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={isLoading || disabled}
                    className={styles.inputField}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || disabled}
                  className={styles.sendButton}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${styles.toggleButton} ${disabled ? styles.disabled : ''}`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={styles.pulseEffect}
        />
      </motion.button>
    </div>
  );
}

export default CJChatBubble;
