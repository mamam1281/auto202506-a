import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  // 기본 렌더링 테스트
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  // Variant 테스트
  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('outline');
  });

  // Size 테스트
  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('lg');
  });

  // 클릭 이벤트 테스트
  it('handles click events correctly', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Disabled 상태 테스트
  it('prevents click when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Loading 상태 테스트
  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('loading');
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  // Icon 테스트
  it('renders with icon correctly', () => {
    const TestIcon = () => <span data-testid="test-icon">🚀</span>;
    
    render(
      <Button icon={<TestIcon />} iconPosition="left">
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  // Icon only 테스트
  it('renders icon only button correctly', () => {
    const TestIcon = () => <span data-testid="test-icon">🚀</span>;
    
    render(<Button icon={<TestIcon />} iconOnly />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('iconOnly');
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.queryByText('With Icon')).not.toBeInTheDocument();
  });

  // Full width 테스트
  it('applies full width class correctly', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  // 커스텀 className 테스트
  it('applies custom className correctly', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  // 타입 속성 테스트
  it('sets correct button type', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  // 접근성 테스트
  it('maintains accessibility attributes', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeDisabled();
  });

  // 여러 props 조합 테스트
  it('handles multiple props combination correctly', () => {
    const handleClick = jest.fn();
    
    render(
      <Button
        variant="gradient"
        size="lg"
        fullWidth
        onClick={handleClick}
        className="test-button"
      >
        Complex Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('gradient', 'lg', 'fullWidth', 'test-button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
