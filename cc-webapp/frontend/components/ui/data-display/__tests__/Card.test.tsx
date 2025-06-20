import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';

// Framer Motion 모킹
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('Card Component', () => {
  // 기본 렌더링 테스트
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Test Content</div>
      </Card>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  // 변형별 CSS 클래스 테스트
  it('applies variant classes correctly', () => {
    const { container } = render(
      <Card variant="game" data-testid="card">
        Content
      </Card>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('game');
  });

  // 크기별 CSS 클래스 테스트
  it('applies size classes correctly', () => {
    const { container } = render(
      <Card size="lg" data-testid="card">
        Content
      </Card>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('lg');
  });

  // 클릭 가능한 카드 테스트
  it('handles click events when clickable', () => {
    const mockOnClick = jest.fn();
    
    render(
      <Card clickable onClick={mockOnClick} data-testid="card">
        Clickable Content
      </Card>
    );
    
    const card = screen.getByTestId('card');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(card).toHaveStyle('cursor: pointer');
  });

  // 클릭 불가능한 카드 테스트
  it('does not trigger click when not clickable', () => {
    const mockOnClick = jest.fn();
    
    render(
      <Card onClick={mockOnClick} data-testid="card">
        Non-clickable Content
      </Card>
    );
    
    const card = screen.getByTestId('card');
    fireEvent.click(card);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  // 네온 효과 테스트
  it('renders neon effects when neonEffect is true', () => {
    const { container } = render(
      <Card neonEffect data-testid="card">
        Neon Content
      </Card>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('neonEffect');
  });

  // 패딩 및 그림자 설정 테스트
  it('applies padding and shadow classes correctly', () => {
    const { container } = render(
      <Card padding="lg" shadow="xl" data-testid="card">
        Content
      </Card>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('padding-lg');
    expect(card).toHaveClass('shadow-xl');
  });

  // 추가 props 전달 테스트
  it('forwards additional props to motion.div', () => {
    render(
      <Card data-custom="test-value" aria-label="Custom Card">
        Content
      </Card>
    );
    
    const card = screen.getByLabelText('Custom Card');
    expect(card).toHaveAttribute('data-custom', 'test-value');
  });

  // 애니메이션 비활성화 테스트
  it('disables animations when animated is false', () => {
    const { container } = render(
      <Card animated={false} data-testid="card">
        Content
      </Card>
    );
    
    // 애니메이션이 비활성화되어도 컴포넌트가 정상 렌더링되는지 확인
    expect(container.firstChild).toBeInTheDocument();
  });

  // className prop 테스트
  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});
