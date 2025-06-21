import React, { useState } from 'react';
import { TokenBalanceWidget } from './components/TokenBalanceWidget';
import { CJAIChatBubble } from './components/CJAIChatBubble';
import { CJChatBubble } from './components/CJChatBubble';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, MessageSquare, Bot, Heart } from 'lucide-react';

export default function App() {
  const [tokenAmount, setTokenAmount] = useState(1234567);
  const [tokenStatus, setTokenStatus] = useState<'normal' | 'warning' | 'critical'>('normal');
  const [tokenChange, setTokenChange] = useState<'none' | 'increase' | 'decrease'>('increase');
  
  // Chat Bubble Demo States
  const [currentMood, setCurrentMood] = useState<'normal' | 'happy' | 'sad' | 'angry'>('normal');
  const [currentState, setCurrentState] = useState<'idle' | 'typing' | 'speaking'>('idle');
  const [currentMessage, setCurrentMessage] = useState('안녕하세요! CJ AI입니다. 어떻게 도와드릴까요? 😊');

  // Mock AI response function
  const handleAIMessage = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple response logic based on keywords
    if (message.toLowerCase().includes('토큰')) {
      return `현재 토큰 잔고는 ${tokenAmount.toLocaleString()}개입니다. 토큰 관리에 대해 더 자세히 알려드릴까요?`;
    }
    if (message.toLowerCase().includes('안녕') || message.toLowerCase().includes('hello')) {
      return '안녕하세요! CJ AI 어시스턴트입니다. 토큰 관리나 다른 서비스에 대해 궁금한 점이 있으시면 언제든 물어보세요! 🤖✨';
    }
    if (message.toLowerCase().includes('도움')) {
      return '물론입니다! 다음과 같은 도움을 드릴 수 있습니다:\n• 토큰 잔고 확인 및 관리\n• 계정 정보 조회\n• 서비스 이용 가이드\n• 기술 지원\n\n어떤 도움이 필요하신가요?';
    }
    
    return `"${message}"에 대해 답변드리겠습니다. CJ AI가 최선을 다해 도움을 드리고 있습니다. 더 구체적인 질문이 있으시면 언제든 말씀해 주세요! 💡`;
  };

  const simulateTokenChange = () => {
    const changes = ['increase', 'decrease', 'none'] as const;
    const statuses = ['normal', 'warning', 'critical'] as const;
    
    setTokenChange(changes[Math.floor(Math.random() * changes.length)]);
    setTokenStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    setTokenAmount(Math.floor(Math.random() * 2000000) + 100000);
  };

  const simulateMoodChange = () => {
    const moods = ['normal', 'happy', 'sad', 'angry'] as const;
    const states = ['idle', 'typing', 'speaking'] as const;
    const messages = [
      '안녕하세요! 좋은 하루 되세요! 😊',
      '죄송합니다. 조금 더 시간이 필요할 것 같습니다.',
      '정말 화가 나는 상황이네요! 😡',
      '와! 정말 기쁜 소식이에요! 🎉',
      '현재 처리 중입니다. 잠시만 기다려주세요...',
      '도움이 더 필요하시면 언제든 말씀해주세요!'
    ];
    
    const newMood = moods[Math.floor(Math.random() * moods.length)];
    const newState = states[Math.floor(Math.random() * states.length)];
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setCurrentMood(newMood);
    setCurrentState(newState);
    setCurrentMessage(newMessage);
  };

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked!');
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 pt-12 pb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
            CJ AI Dashboard
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto px-4">
          2025년 최신 트렌드의 Token Balance Widget과 AI Chat Bubble 컴포넌트
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Token Balance Widget Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2 justify-center lg:justify-start">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                Token Balance Widget
              </h2>
              <p className="text-slate-400">
                실시간 토큰 잔고 및 상태 모니터링
              </p>
            </div>
            
            <TokenBalanceWidget
              amount={tokenAmount}
              status={tokenStatus}
              change={tokenChange}
              className="max-w-md mx-auto lg:mx-0"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={simulateTokenChange}
              className="w-full max-w-md mx-auto lg:mx-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              토큰 상태 변경 시뮬레이션
            </motion.button>
          </motion.div>

          {/* AI Chat Bubble Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2 justify-center lg:justify-start">
                <Sparkles className="w-6 h-6 text-blue-400" />
                CJ AI Chat Interface
              </h2>
              <p className="text-slate-400">
                스마트한 AI 어시스턴트와 실시간 대화
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">주요 기능</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  실시간 AI 대화 지원
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  반응형 디자인 (웹/모바일)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  부드러운 애니메이션 효과
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  다크 테마 글래스모피즘
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <p className="text-sm text-slate-300">
                  💡 <strong>사용법:</strong> 우측 하단의 채팅 버튼을 클릭하여 AI와 대화를 시작해보세요!
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* New CJ Chat Bubble Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2 justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              CJ Chat Bubble Demo
            </h2>
            <p className="text-slate-400">
              감정 상태와 AI 상태에 따른 동적 메시지 버블
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chat Bubble Demo */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">라이브 데모</h3>
              
              <div className="space-y-4 mb-6">
                <CJChatBubble
                  message={currentMessage}
                  state={currentState}
                  avatarMood={currentMood}
                  showVoiceToggle={true}
                  onVoiceToggle={handleVoiceToggle}
                />
              </div>

              {/* Current Status Display */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">감정 상태:</span>
                    <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium ${
                      currentMood === 'happy' ? 'bg-emerald-500/20 text-emerald-400' :
                      currentMood === 'sad' ? 'bg-blue-500/20 text-blue-400' :
                      currentMood === 'angry' ? 'bg-red-500/20 text-red-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {currentMood}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">AI 상태:</span>
                    <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium ${
                      currentState === 'typing' ? 'bg-amber-500/20 text-amber-400' :
                      currentState === 'speaking' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {currentState}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={simulateMoodChange}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-shadow flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                감정 & 상태 변경 시뮬레이션
              </motion.button>
            </div>

            {/* Features & Specifications */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">컴포넌트 기능</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2" />
                  <div>
                    <h4 className="text-slate-200 font-medium">동적 아바타</h4>
                    <p className="text-slate-400 text-sm">감정 상태에 따른 색상 및 아이콘 변화</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div>
                    <h4 className="text-slate-200 font-medium">상태 애니메이션</h4>
                    <p className="text-slate-400 text-sm">타이핑, 말하기, 대기 상태별 시각 효과</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                  <div>
                    <h4 className="text-slate-200 font-medium">음성 토글</h4>
                    <p className="text-slate-400 text-sm">음성 기능 온/오프 제어</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2" />
                  <div>
                    <h4 className="text-slate-200 font-medium">반응형 버블</h4>
                    <p className="text-slate-400 text-sm">메시지 길이에 따른 동적 크기 조절</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-400 rounded-full mt-2" />
                  <div>
                    <h4 className="text-slate-200 font-medium">글래스모피즘</h4>
                    <p className="text-slate-400 text-sm">2025년 트렌드 디자인 적용</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium text-slate-300">Props Interface</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  message, state, avatarMood, showVoiceToggle, onVoiceToggle
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Modern Design',
              description: '2025년 최신 디자인 트렌드 반영',
              icon: Sparkles,
              color: 'from-blue-500 to-purple-500'
            },
            {
              title: 'Responsive',
              description: '웹과 모바일 모든 환경 지원',
              icon: TrendingUp,
              color: 'from-emerald-500 to-teal-500'
            },
            {
              title: 'Interactive',
              description: 'Framer Motion 애니메이션',
              icon: Zap,
              color: 'from-amber-500 to-orange-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl hover:border-slate-600/50 transition-colors"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-center text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Chat Bubble Component */}
      <CJAIChatBubble 
        position="bottom-right"
        onSendMessage={handleAIMessage}
      />
    </div>
  );
}