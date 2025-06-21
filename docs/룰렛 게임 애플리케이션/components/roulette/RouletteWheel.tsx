'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ROULETTE_NUMBERS, getNumberColor, TIMINGS } from './constants';

interface RouletteWheelProps {
  isSpinning: boolean;
  result: number | null;
  onSpinComplete: (result: number) => void;
}

export function RouletteWheel({ isSpinning, result, onSpinComplete }: RouletteWheelProps) {
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  // 숫자별 각도 계산 (360도 / 37개 숫자)
  const anglePerNumber = 360 / ROULETTE_NUMBERS.length;

  // 특정 숫자의 각도 계산
  const getAngleForNumber = (number: number): number => {
    const index = ROULETTE_NUMBERS.indexOf(number);
    return index * anglePerNumber;
  };

  useEffect(() => {
    if (isSpinning && result !== null) {
      // 최소 8바퀴 + 결과 각도까지 회전 (더 현실적인 스핀)
      const targetAngle = getAngleForNumber(result);
      const spinRotation = currentRotation + 360 * 8 + (360 - targetAngle) + Math.random() * 20 - 10; // 약간의 랜덤성 추가
      
      controls.start({
        rotate: spinRotation,
        transition: {
          duration: 6,
          ease: [0.17, 0.67, 0.12, 0.99], // 더 부드러운 감속
        }
      }).then(() => {
        setCurrentRotation(spinRotation % 360);
        setTimeout(() => onSpinComplete(result), 800);
      });
    }
  }, [isSpinning, result, controls, currentRotation, onSpinComplete]);

  // 룰렛 섹터 렌더링
  const renderRouletteNumbers = () => {
    return ROULETTE_NUMBERS.map((number, index) => {
      const angle = index * anglePerNumber;
      const nextAngle = ((index + 1) % ROULETTE_NUMBERS.length) * anglePerNumber;
      const color = getNumberColor(number);
      
      // 색상 설정
      const sectorColor = color === 'red' ? '#DC2626' : color === 'black' ? '#1F2937' : '#059669';
      const textColor = '#FFFFFF';
      
      // SVG path 생성 (파이 섹터)
      const centerX = 160; // 휠 중심 X
      const centerY = 160; // 휠 중심 Y
      const outerRadius = 150;
      const innerRadius = 40;
      
      const startAngleRad = (angle * Math.PI) / 180;
      const endAngleRad = (nextAngle * Math.PI) / 180;
      
      const x1 = centerX + outerRadius * Math.cos(startAngleRad);
      const y1 = centerY + outerRadius * Math.sin(startAngleRad);
      const x2 = centerX + outerRadius * Math.cos(endAngleRad);
      const y2 = centerY + outerRadius * Math.sin(endAngleRad);
      
      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = centerY + innerRadius * Math.sin(startAngleRad);
      
      const largeArcFlag = endAngleRad - startAngleRad <= Math.PI ? "0" : "1";
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
      
      // 텍스트 위치 계산
      const textRadius = (outerRadius + innerRadius) / 2;
      const textAngle = (startAngleRad + endAngleRad) / 2;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);
      
      return (
        <g key={number}>
          <path
            d={pathData}
            fill={sectorColor}
            stroke="#FFD700"
            strokeWidth="1"
            className="transition-all duration-200 hover:brightness-110"
          />
          <text
            x={textX}
            y={textY}
            fill={textColor}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
            className="pointer-events-none select-none"
            style={{
              transform: `rotate(${(angle + nextAngle) / 2}deg)`,
              transformOrigin: `${textX}px ${textY}px`
            }}
          >
            {number}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative flex items-center justify-center p-8">
      {/* 룰렛 외부 테두리 */}
      <div className="relative w-96 h-96 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-2 shadow-2xl">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 p-1">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1a1a2e] border-2 border-[--color-game-gold]">
            
            {/* 룰렛 휠 SVG */}
            <motion.div
              className="absolute inset-0"
              animate={controls}
              style={{ transformOrigin: 'center' }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 320 320"
                className="absolute inset-0"
              >
                {/* 배경 원 */}
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  fill="#1a1a2e"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                
                {/* 룰렛 숫자 섹터들 */}
                {renderRouletteNumbers()}
                
                {/* 중앙 허브 */}
                <circle
                  cx="160"
                  cy="160"
                  r="40"
                  fill="url(#centerGradient)"
                  stroke="#FFD700"
                  strokeWidth="3"
                />
                
                {/* 그라디언트 정의 */}
                <defs>
                  <radialGradient id="centerGradient" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="70%" stopColor="#FFA500" />
                    <stop offset="100%" stopColor="#FF8C00" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
            
            {/* 볼 포인터 */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-[--color-game-gold]" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-full shadow-lg border border-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스핀 상태 오버레이 */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="glass-surface px-6 py-3 rounded-xl border border-[--color-game-gold]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[--color-game-gold] border-t-transparent rounded-full animate-spin" />
              <p className="text-[--color-game-gold] neon-text">Spinning the wheel...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 휠 하단 그림자 */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-8 bg-black/20 rounded-full blur-xl" />
    </div>
  );
}