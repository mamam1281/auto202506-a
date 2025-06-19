import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CJChatBubble.module.css';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface CJChatBubbleProps {
  /** 채팅 상태 */
  state?: 'idle' | 'typing' | 'speaking';
  
  /** 메시지 내용 */
  message?: string;
  
  /** 아바타 감정 상태 */
  avatarMood?: 'neutral' | 'happy' | 'thinking' | 'excited';
  
  /** 음성 토글 활성화 여부 */
  voiceEnabled?: boolean;
  
  /** 위치 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /** 메시지 전송 콜백 */
  onSendMessage?: (message: string) => void;
  
  /** 음성 토글 콜백 */
  onVoiceToggle?: (enabled: boolean) => void;
  
  /** 추가 CSS 클래스명 */
  className?: string;
}

const CJChatBubble: React.FC<CJChatBubbleProps> = ({
  state = 'idle',
  message = '',
  avatarMood = 'neutral',
  voiceEnabled = false,
  position = 'bottom-right',
  onSendMessage,
  onVoiceToggle,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI 메시지 추가
  useEffect(() => {
    if (message && state === 'typing') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [message, state]);

  // 메시지 전송
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    onSendMessage?.(inputMessage);
  };

  // 키보드 이벤트
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 아바타 이모지 결정
  const getAvatarEmoji = () => {
    switch (avatarMood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      case 'excited': return '🤩';
      default: return '🤖';
    }
  };

  // 애니메이션 설정
  const bubbleVariants = {
    collapsed: { 
      width: 60, 
      height: 60, 
      borderRadius: 30 
    },
    expanded: { 
      width: 320, 
      height: 400, 
      borderRadius: 16 
    }
  };

  const avatarVariants = {
    idle: { scale: 1, rotate: 0 },
    typing: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
    speaking: { scale: [1, 1.05, 1] }
  };

  const containerClassNames = [
    styles.container,
    styles[position],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassNames}>
      <motion.div
        className={styles.chatBubble}
        variants={bubbleVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* AI 아바타 (항상 표시) */}
        <motion.div
          className={styles.avatar}
          variants={avatarVariants}
          animate={state}
          transition={{ duration: 0.5, repeat: state !== 'idle' ? Infinity : 0 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className={styles.avatarEmoji}>
            {getAvatarEmoji()}
          </span>
          
          {/* 온라인 인디케이터 */}
          <div className={styles.onlineIndicator} />
          
          {/* 펄스 효과 */}
          {state !== 'idle' && (
            <motion.div
              className={styles.pulseEffect}
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* 확장된 채팅 인터페이스 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className={styles.chatInterface}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {/* 헤더 */}
              <div className={styles.chatHeader}>
                <div className={styles.headerInfo}>
                  <span className={styles.aiName}>CJ AI</span>
                  <span className={styles.statusText}>
                    {state === 'typing' ? 'Typing...' : 
                     state === 'speaking' ? 'Speaking...' : 'Online'}
                  </span>
                </div>
                
                {/* 음성 토글 버튼 */}
                <button
                  className={`${styles.voiceToggle} ${voiceEnabled ? styles.enabled : ''}`}
                  onClick={() => onVoiceToggle?.(!voiceEnabled)}
                >
                  {voiceEnabled ? '🔊' : '🔇'}
                </button>
                
                {/* 닫기 버튼 */}
                <button
                  className={styles.closeButton}
                  onClick={() => setIsExpanded(false)}
                >
                  ✕
                </button>
              </div>

              {/* 메시지 영역 */}
              <div className={styles.messagesContainer}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`${styles.message} ${styles[msg.type]}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.messageContent}>
                      {msg.content}
                    </div>
                    <div className={styles.messageTime}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                ))}
                
                {/* 타이핑 인디케이터 */}
                {isTyping && (
                  <motion.div
                    className={`${styles.message} ${styles.ai} ${styles.typing}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className={styles.typingDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className={styles.inputContainer}>
                <textarea
                  className={styles.messageInput}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask CJ AI anything..."
                  rows={2}
                />
                <button
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                >
                  🚀
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CJChatBubble;
