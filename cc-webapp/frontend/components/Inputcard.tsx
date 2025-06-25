import React from 'react';
import { BaseCard } from './Basecard';
import Button from './Button';
import { Input } from './Input';
import { Label } from './Label';
import { User, Lock, LogIn } from 'lucide-react';

interface InputCardProps {
  title?: string;
  onSubmit?: (data: { username: string; password: string }) => void;
  className?: string;
}

export const InputCard: React.FC<InputCardProps> = ({
  title = "로그인",
  onSubmit,
  className = ""
}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ username, password });
    }
  };

  return (
    <BaseCard className={`w-full mx-auto min-h-[400px] ${className}`}>
      <div className="p-6 space-y-8 w-full">
        {/* Header with title and icon */}
        <div className="flex items-center gap-3 mb-2">
          <LogIn 
            className="text-[var(--color-info)] flex-shrink-0" 
            size={24}
            aria-hidden="true" 
          />
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Username Field */}
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 mb-2">
              <User 
                className="text-[var(--color-text-secondary)] flex-shrink-0" 
                size={16}
                aria-hidden="true" 
              />
              <Label 
                htmlFor="username" 
                className="text-sm font-medium text-[var(--color-text-primary)]"
              >
                사용자명
              </Label>
            </div>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자명을 입력하세요"
              className="w-full"
              fullWidth={true}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 mb-2">
              <Lock 
                className="text-[var(--color-text-secondary)] flex-shrink-0" 
                size={16}
                aria-hidden="true" 
              />
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-[var(--color-text-primary)]"
              >
                비밀번호
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full"
              fullWidth={true}
              required
            />
          </div>

          {/* Submit Button with extra spacing */}
          <div className="pt-6">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              className="w-full"
            >
              로그인
            </Button>
          </div>
        </form>
      </div>
    </BaseCard>
  );
};

export default InputCard;
