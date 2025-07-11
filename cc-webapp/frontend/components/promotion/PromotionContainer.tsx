'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Star, 
  Zap, 
  TrendingUp, 
  Gift, 
  Target, 
  Sparkles,
  Trophy,
  Coins,
  Play,
  ArrowLeft,
  Crown,
  Flame,
  Percent,
  Calendar,
  Users,
  Check,
  X
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'WELCOME' | 'DEPOSIT' | 'LOYALTY' | 'SPECIAL';
  discount: number;
  requirements: string[];
  benefits: string[];
  validUntil: string;
  isActive: boolean;
  isNew?: boolean;
  isHot?: boolean;
  minDeposit?: number;
  maxBonus?: number;
  icon: React.ReactNode;
  accent: string;
}

interface VIPLevel {
  level: number;
  name: string;
  requirements: number;
  benefits: string[];
  perks: {
    bonusRate: number;
    withdrawalLimit: number;
    personalManager: boolean;
  };
}

function PromotionCard({ 
  promotion, 
  onClaim 
}: { 
  promotion: Promotion; 
  onClaim: (id: string) => void;
}) {
  const handleClaim = () => {
    onClaim(promotion.id);
  };

  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 통일된 카드 디자인 */}
      <div className="relative h-[320px] p-5 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-slate-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] 
                      transition-all duration-500 
                      hover:bg-opacity-100 flex flex-col justify-between
                      transform-gpu">
        
        {/* 강화된 내부 테두리 */}
        <div className="absolute inset-[1px] rounded-2xl border border-white/10 pointer-events-none"></div>
        
        {/* 프로모션별 포인트 컬러 효과 */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${promotion.accent}/10 via-transparent to-black/20 pointer-events-none`}></div>
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${promotion.accent}/15 to-transparent rounded-full blur-2xl`}></div>
        
        {/* 상단 컨텐츠 */}
        <div className="relative z-10">
          {/* 배지 */}
          <div className="absolute top-0 right-0 flex flex-col gap-1 z-20">
            {promotion.isNew && (
              <motion.div 
                className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md
                          border border-white/30 shadow-lg
                          relative overflow-hidden"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-1 relative z-10">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">NEW</span>
                </div>
              </motion.div>
            )}
            {promotion.isHot && (
              <motion.div 
                className="px-2.5 py-1 rounded-full bg-slate-800/80 backdrop-blur-md
                          border border-slate-600/60 shadow-lg
                          relative overflow-hidden"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-1 relative z-10">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">HOT</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* 할인율 표시 */}
          <div className="mb-2">
            <div className="text-center">
              <span className="text-3xl font-black text-white drop-shadow-lg">
                {promotion.discount}%
              </span>
              <span className="text-sm text-slate-200 ml-1">보너스</span>
            </div>
          </div>

          {/* 아이콘 */}
          <div className="mb-4">
            <motion.div 
              className="w-12 h-12 mx-auto rounded-xl 
                        bg-gradient-to-br from-slate-600/70 to-slate-700/90 
                        flex items-center justify-center border border-slate-500/50
                        group-hover:from-slate-500/70 group-hover:to-slate-600/90 
                        transition-all duration-500 shadow-lg backdrop-blur-md"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {promotion.icon}
            </motion.div>
          </div>

          {/* 제목과 설명 */}
          <div className="text-center mb-4">
            <motion.h3 
              className="text-base font-black text-white mb-2 leading-tight"
              style={{ 
                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' 
              }}
            >
              {promotion.title}
            </motion.h3>
            <p className="text-xs text-slate-100 leading-relaxed px-1"
               style={{ 
                 textShadow: '0 1px 4px rgba(0,0,0,0.6)' 
               }}>
              {promotion.description.substring(0, 60)}...
            </p>
          </div>

          {/* 프로모션 정보 */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/60 border border-slate-600/60 backdrop-blur-sm">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-white font-medium">
                  {promotion.minDeposit ? `${promotion.minDeposit}💎` : '무료'}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/60 border border-slate-600/60 backdrop-blur-sm">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span className="text-white font-medium">
                  {new Date(promotion.validUntil).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 참여 버튼 */}
        <div className="relative z-10">
          <motion.button
            onClick={handleClaim}
            className="w-full py-3 px-4 rounded-xl 
                       bg-gradient-to-r from-slate-600 to-slate-700 
                       hover:from-slate-500 hover:to-slate-600
                       border border-slate-500/70 hover:border-slate-400/80
                       transition-all duration-500 
                       flex items-center justify-center gap-2 
                       shadow-lg hover:shadow-xl backdrop-blur-sm
                       text-white font-bold relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                            skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            <Gift className="w-4 h-4 text-white relative z-10 drop-shadow" />
            <span className="text-white relative z-10 drop-shadow">참여하기</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function VIPProgramCard({ vipLevel }: { vipLevel: VIPLevel }) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-amber-900/30 to-amber-800/40 border-amber-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] 
                      transition-all duration-500 transform-gpu">
        
        {/* 강화된 내부 테두리 */}
        <div className="absolute inset-[1px] rounded-2xl border border-amber-400/20 pointer-events-none"></div>
        
        {/* 골드 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-black/20 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* VIP 레벨 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <span className="text-xl font-bold text-amber-200">VIP {vipLevel.level}</span>
            </div>
            <div className="text-amber-300 text-sm font-medium">
              {vipLevel.name}
            </div>
          </div>

          {/* 혜택 목록 */}
          <div className="space-y-2 mb-4">
            {vipLevel.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* 특전 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/50 p-2 rounded-lg">
              <div className="text-amber-400 font-medium">보너스 비율</div>
              <div className="text-white">{vipLevel.perks.bonusRate}%</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg">
              <div className="text-amber-400 font-medium">출금 한도</div>
              <div className="text-white">{vipLevel.perks.withdrawalLimit.toLocaleString()}💎</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CouponInput({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
    onSubmit(couponCode);
    setCouponCode('');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative p-6 rounded-2xl backdrop-blur-xl border overflow-hidden
                      bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-slate-600/50
                      shadow-[0_8px_32px_rgba(0,0,0,0.4)] transform-gpu">
        
        <div className="absolute inset-[1px] rounded-2xl border border-white/10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h3 className="text-lg font-bold text-white mb-1">쿠폰 코드 입력</h3>
            <p className="text-sm text-slate-300">특별 혜택을 받으세요!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="쿠폰 코드를 입력하세요"
                className="w-full px-4 py-3 rounded-xl 
                          bg-slate-700/50 border border-slate-600/50 
                          text-white placeholder-slate-400
                          focus:outline-none focus:border-slate-400/80
                          transition-all duration-300"
                disabled={isSubmitting}
              />
            </div>

            <motion.button
              type="submit"
              disabled={!couponCode.trim() || isSubmitting}
              className="w-full py-3 px-4 rounded-xl 
                         bg-gradient-to-r from-yellow-600 to-yellow-700 
                         hover:from-yellow-500 hover:to-yellow-600
                         disabled:from-slate-600 disabled:to-slate-700
                         border border-yellow-500/70 hover:border-yellow-400/80
                         disabled:border-slate-500/50
                         transition-all duration-500 
                         flex items-center justify-center gap-2 
                         shadow-lg hover:shadow-xl backdrop-blur-sm
                         text-white font-bold relative overflow-hidden
                         disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{isSubmitting ? '확인 중...' : '쿠폰 사용'}</span>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default function PromotionContainer() {
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);

  // Mock 프로모션 데이터
  const promotions: Promotion[] = [
    {
      id: 'welcome',
      title: '웰컴 보너스',
      description: '첫 입금 시 최대 500% 보너스! 신규 회원만의 특별 혜택을 놓치지 마세요.',
      type: 'WELCOME',
      discount: 500,
      requirements: ['첫 입금 시', '최소 10,000💎'],
      benefits: ['500% 보너스', '무료 스핀 50회', '24시간 고객 지원'],
      validUntil: '2025-12-31',
      isActive: true,
      isNew: true,
      minDeposit: 10000,
      maxBonus: 500000,
      icon: <Crown className="w-5 h-5 text-amber-400 drop-shadow-lg" />,
      accent: 'amber-400'
    },
    {
      id: 'deposit',
      title: '입금 보너스',
      description: '매일 입금할 때마다 받는 특별 보너스! 더 많이 플레이하고 더 많이 받으세요.',
      type: 'DEPOSIT',
      discount: 200,
      requirements: ['일일 입금', '최소 5,000💎'],
      benefits: ['200% 보너스', '캐시백 10%', '레벨업 포인트 2배'],
      validUntil: '2025-08-31',
      isActive: true,
      isHot: true,
      minDeposit: 5000,
      maxBonus: 100000,
      icon: <Coins className="w-5 h-5 text-green-400 drop-shadow-lg" />,
      accent: 'green-400'
    },
    {
      id: 'loyalty',
      title: '충성도 보너스',
      description: '오래 플레이할수록 더 큰 혜택! VIP 회원을 위한 특별한 보상 시스템.',
      type: 'LOYALTY',
      discount: 300,
      requirements: ['30일 이상 플레이', 'VIP 레벨 3+'],
      benefits: ['300% 보너스', '전용 매니저', '빠른 출금'],
      validUntil: '2025-09-30',
      isActive: true,
      minDeposit: 0,
      maxBonus: 300000,
      icon: <Trophy className="w-5 h-5 text-purple-400 drop-shadow-lg" />,
      accent: 'purple-400'
    },
    {
      id: 'special',
      title: '한정 특가',
      description: '이번 주말만! 특별 이벤트 보너스로 더 큰 재미를 경험하세요.',
      type: 'SPECIAL',
      discount: 777,
      requirements: ['주말 한정', '이벤트 참여'],
      benefits: ['777% 보너스', '럭키 드로우 참여', '특별 아이템'],
      validUntil: '2025-07-13',
      isActive: true,
      isNew: true,
      isHot: true,
      minDeposit: 1000,
      maxBonus: 777000,
      icon: <Sparkles className="w-5 h-5 text-pink-400 drop-shadow-lg" />,
      accent: 'pink-400'
    }
  ];

  // Mock VIP 레벨 데이터
  const vipLevels: VIPLevel[] = [
    {
      level: 1,
      name: '브론즈',
      requirements: 10000,
      benefits: ['5% 보너스', '주간 캐시백', '기본 고객 지원'],
      perks: {
        bonusRate: 5,
        withdrawalLimit: 100000,
        personalManager: false
      }
    },
    {
      level: 2,
      name: '실버',
      requirements: 50000,
      benefits: ['10% 보너스', '주간 캐시백', '우선 고객 지원'],
      perks: {
        bonusRate: 10,
        withdrawalLimit: 500000,
        personalManager: false
      }
    },
    {
      level: 3,
      name: '골드',
      requirements: 200000,
      benefits: ['15% 보너스', '주간 캐시백', '전용 매니저'],
      perks: {
        bonusRate: 15,
        withdrawalLimit: 1000000,
        personalManager: true
      }
    }
  ];

  const handleClaimPromotion = (promotionId: string) => {
    console.log('프로모션 참여:', promotionId);
    // 실제로는 API 호출
    alert('프로모션 참여가 완료되었습니다!');
  };

  const handleCouponSubmit = (code: string) => {
    console.log('쿠폰 사용:', code);
    // 실제로는 API 호출
    alert(`쿠폰 ${code}가 성공적으로 사용되었습니다!`);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                    relative overflow-hidden">
      
      {/* 부드러운 배경 효과 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/20 rounded-full 
                        mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-24 h-24 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl 
                        animate-pulse animation-delay-2000"></div>
      </div>

      {/* 부드러운 별빛 효과 */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col px-5">
        
        {/* 개선된 헤더 */}
        <motion.header
          className="py-8 text-center relative z-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl font-black mb-3 text-white leading-none"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 8px 40px rgba(0,0,0,0.4)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            🎁 PROMOTIONS
          </motion.h1>
          <motion.p
            className="text-base text-slate-200 font-medium mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            특별한 혜택과 보너스를 만나보세요
          </motion.p>
          
          {/* 통계 */}
          <motion.div
            className="flex items-center justify-center gap-3 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-slate-800/80 backdrop-blur-xl
                            border border-slate-600/60 shadow-lg">
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-white font-medium">매일 새로운 혜택</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-slate-800/80 backdrop-blur-xl
                            border border-slate-600/60 shadow-lg">
              <Percent className="w-4 h-4 text-green-400" />
              <span className="text-white font-medium">최대 777%</span>
            </div>
          </motion.div>
        </motion.header>

        {/* 프로모션 그리드 */}
        <main className="flex-1 pb-8 space-y-8">
          {/* 활성 프로모션 */}
          <section>
            <motion.h2 
              className="text-xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              🔥 활성 프로모션
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {promotions.map((promotion, index) => (
                <motion.div
                  key={promotion.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <PromotionCard promotion={promotion} onClaim={handleClaimPromotion} />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* VIP 프로그램 */}
          <section>
            <motion.h2 
              className="text-xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              👑 VIP 프로그램
            </motion.h2>
            <div className="space-y-4">
              {vipLevels.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  <VIPProgramCard vipLevel={level} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* 쿠폰 입력 */}
          <section>
            <motion.h2 
              className="text-xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
            >
              🎫 쿠폰 코드
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              <CouponInput onSubmit={handleCouponSubmit} />
            </motion.div>
          </section>
        </main>

        {/* 푸터 */}
        <motion.footer
          className="py-4 text-center border-t border-slate-600/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <p className="text-slate-300 text-sm"
             style={{
               textShadow: '0 1px 4px rgba(0,0,0,0.5)'
             }}>
            모든 프로모션은 이용약관이 적용됩니다 🎁
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
