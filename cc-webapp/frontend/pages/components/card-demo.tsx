import React, { useState } from 'react';
import Card from '../../components/ui/data-display/Card';

const CardTestDemo = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleCardClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'white', marginBottom: '40px' }}>Card Component Test Demo</h1>
      
      {/* 클릭 결과 표시 */}
      {clickCount > 0 && (
        <div data-testid="click-result" style={{ 
          color: '#7b29cd', 
          marginBottom: '20px',
          padding: '10px',
          background: 'rgba(123, 41, 205, 0.1)',
          borderRadius: '8px'
        }}>
          Card clicked {clickCount} times
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* 기본 카드 */}
        <Card data-testid="card">
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>Test Content</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              기본 글래스모피즘 카드입니다.
            </p>
          </div>
        </Card>

        {/* 클릭 가능한 카드 */}
        <Card 
          data-testid="clickable-card"
          clickable 
          onClick={handleCardClick}
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>클릭 가능한 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              이 카드를 클릭해보세요!
            </p>
          </div>
        </Card>

        {/* 클릭 불가능한 카드 */}
        <Card data-testid="non-clickable-card">
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>정적 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              클릭할 수 없는 카드입니다.
            </p>
          </div>
        </Card>

        {/* 게임 카드 */}
        <Card 
          data-testid="card-game"
          variant="game" 
          neonEffect
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎯 게임 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              네온 효과가 적용된 게임 카드입니다.
            </p>
          </div>
        </Card>

        {/* 미션 카드 */}
        <Card 
          data-testid="card-mission"
          variant="mission" 
          neonEffect
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>📋 미션 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              미션용 카드입니다.
            </p>
          </div>
        </Card>

        {/* 보상 카드 */}
        <Card 
          data-testid="card-reward"
          variant="reward" 
          neonEffect
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎁 보상 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              보상용 카드입니다.
            </p>
          </div>
        </Card>
      </div>

      {/* 네온 효과 카드 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>네온 효과 테스트</h2>
        <Card 
          data-testid="neon-card"
          neonEffect
          animated
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>✨ 네온 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              네온 효과와 애니메이션이 적용된 카드입니다.
            </p>
          </div>
        </Card>
      </div>

      {/* 상호작용 카드 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>상호작용 테스트</h2>
        <Card 
          data-testid="interactive-card"
          clickable
          neonEffect
          animated
          onClick={handleCardClick}
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🎮 상호작용 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              모든 효과가 활성화된 카드입니다.
            </p>
          </div>
        </Card>
      </div>

      {/* 애니메이션 카드 */}
      <div>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>애니메이션 테스트</h2>
        <Card 
          data-testid="animated-card"
          animated
          neonEffect
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>🌟 애니메이션 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              호버 시 애니메이션이 실행됩니다.
            </p>
          </div>
        </Card>
      </div>

      {/* 접근성 테스트용 카드 */}
      <div style={{ marginTop: '40px' }}>
        <Card 
          data-testid="card-with-label"
          aria-label="Accessible Card Component"
          clickable
          onClick={handleCardClick}
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white' }}>♿ 접근성 카드</h3>
            <p style={{ margin: 0, color: '#D1D5DB' }}>
              접근성이 고려된 카드입니다.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardTestDemo;
