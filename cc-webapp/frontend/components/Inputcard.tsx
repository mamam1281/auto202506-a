import { useState } from 'react';
import { BaseCard } from './Basecard';
import { Input } from './Input';
import Button from './Button';
import { Label } from './Label';
import { User, Mail, Lock } from 'lucide-react';

interface InputFormCardProps {
  title: string;
  onSubmit?: (data: Record<string, string>) => void;
}

export function InputFormCard({ title, onSubmit }: InputFormCardProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <BaseCard className="w-full max-w-sm">
      <div className="space-y-4">
        <h3 className="text-card-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-chart-5" />
          {title}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-muted-foreground">이름</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                className="pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-muted-foreground">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                className="pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-muted-foreground">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button 
            type="submit"
            variant="primary"
            className="w-full"
          >
            제출하기
          </Button>
        </form>
      </div>
    </BaseCard>
  );
}