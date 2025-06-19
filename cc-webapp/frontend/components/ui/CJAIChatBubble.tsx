'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  X, 
  Sparkles,
  Zap
} from 'lucide-react';
import styles from './CJAIChatBubble.module.css';

// Standard animation configurations from unified guides
const animationConfig = {
  entrance: { 
    initial: { opacity: 0, y: 20 }, 
    animate: { opacity: 1, y: 0 }, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  entranceFast: { 
    initial: { opacity: 0, y: 10 }, 
    animate: { opacity: 1, y: 0 }, 
    transition: { duration: 0.3, ease: "easeOut" } 
  },
  exit: { 
    initial: { opacity: 1, scale: 1 }, 
    exit: { opacity: 0, scale: 0.95 }, 
    transition: { duration: 0.2, ease: "easeIn" } 
  }
};

const interactionAnimations = {
  scale: { 
    whileHover: { scale: 1.05 }, 
    whileTap: { scale: 0.95 }, 
    transition: { type: "spring" as const, stiffness: 400, damping: 17 } 
  },
  scaleSubtle: { 
    whileHover: { scale: 1.02 }, 
    whileTap: { scale: 0.98 }, 
    transition: { type: "spring" as const, stiffness: 300, damping: 20 } 
  },
  scaleBold: { 
    whileHover: { scale: 1.1 }, 
    whileTap: { scale: 0.9 }, 
    transition: { type: "spring" as const, stiffness: 500, damping: 15 } 
  }
};

const loopAnimations = {
  pulse: { 
    animate: { scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }, 
    transition: { duration: 2, ease: "easeInOut" as const, repeat: Infinity } 
  },
  pulseSubtle: { 
    animate: { scale: [1, 1.02, 1] }, 
    transition: { duration: 3, ease: "easeInOut" as const, repeat: Infinity } 
  }
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface CJAIChatBubbleProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSendMessage?: (message: string) => Promise<string>;
}

export function CJAIChatBubble({ 
  className = '', 
  position = 'bottom-right',
  onSendMessage 
}: CJAIChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! CJ AI 어시스턴트입니다. 무엇을 도와드릴까요? 😊',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '...',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = onSendMessage 
        ? await onSendMessage(inputValue)
        : `네, "${inputValue}"에 대해 도움을 드릴 수 있습니다. CJ AI가 최선을 다해 답변드리겠습니다! ✨`;

      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요.',
          sender: 'ai',
          timestamp: new Date(),
        }];
      });
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
    <div className={`${styles.chatBubble} ${getPositionClasses()} ${className}`}>
      <AnimatePresence>
        {isOpen && (          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>                    <motion.div
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                      className={styles.statusIndicator}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>CJ AI Assistant</h3>
                    <p>온라인</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={styles.closeButton}
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((message) => (                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${styles.messageWrapper} ${styles[message.sender]}`}
                >
                  <div className={`${styles.messageContent} ${styles[message.sender]}`}>
                    <div className={`${styles.messageAvatar} ${styles[message.sender]}`}>
                      {message.sender === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-white" />
                      )}
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
                    placeholder="메시지를 입력하세요..."
                    disabled={isLoading}
                    className={styles.inputField}
                  />
                </div>                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
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

      {/* Chat Button */}      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
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
              className={styles.iconWrapper}
            >
              <MessageCircle className="w-6 h-6 text-white" />              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                className={styles.notificationBadge}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={styles.pulseEffect}
        />

        {/* Hover Effect */}
        <div className={styles.hoverOverlay} />
      </motion.button>
    </div>
  );
}

export default CJAIChatBubble;
