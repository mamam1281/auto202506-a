// CJChatBubble.tsx (글로벌 위치로 이동)
// 게임/메인/대시보드/설정 등 어디서든 사용 가능한 글로벌 챗버블

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, User, Loader2 } from 'lucide-react';
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
  disabled?: boolean;
}

export function CJChatBubble({ 
  className = '', 
  position = 'bottom-right',
  onSendMessage,
  messages: externalMessages,
  placeholder = '메시지를 입력하세요...',
  title = 'CJ Chat',
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
        ? await onSendMessage(userMessage.text)
        : `메시지를 받았습니다: "${userMessage.text}"`;
      if (!externalMessages) {
        setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
          id: Date.now().toString() + '-ai',
          text: response,
          sender: 'system',
          timestamp: new Date(),
        }));
      }
    } catch (error) {
      if (!externalMessages) {
        setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
          id: Date.now().toString() + '-err',
          text: '오류가 발생했습니다. 다시 시도해 주세요.',
          sender: 'system',
          timestamp: new Date(),
        }));
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
    <div className={`${styles.chatBubble} ${getPositionClasses()} ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={styles.chatWindow}
          >
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarWrapper}>
                    <User className={styles.avatar} />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{title}</h3>
                    <p>AI 어시스턴트</p>
                  </div>
                </div>
                <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="챗 닫기">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <div key={msg.id} className={styles.messageWrapper + ' ' + (msg.sender === 'user' ? styles.user : styles.system)}>
                  <div className={styles.messageContent}>
                    <span className={styles.messageText}>{msg.text}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputContainer}>
              <input
                className={styles.inputField}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading || disabled}
                aria-label="메시지 입력"
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={isLoading || disabled || !inputValue.trim()}
                aria-label="메시지 전송"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button className={styles.toggleButton} onClick={() => setIsOpen(true)} aria-label="챗 열기">
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}

export default CJChatBubble;
