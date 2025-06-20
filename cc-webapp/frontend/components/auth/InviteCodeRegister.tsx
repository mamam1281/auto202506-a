'use client';

import { useState } from 'react';
import Button from '../ui/basic/Button';
import Card from '../ui/data-display/Card';

interface InviteCodeRegisterProps {
  onSuccess?: (user: any) => void;
}

export function InviteCodeRegister({ onSuccess }: InviteCodeRegisterProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invite_code: inviteCode.toUpperCase(),
          nickname: nickname.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '가입에 실패했습니다');
      }

      const user = await response.json();
      
      // 로컬스토리지에 사용자 정보 저장 (단순 인증)
      localStorage.setItem('user', JSON.stringify(user));
      
      onSuccess?.(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">CJ</span>
          </div>
          <h1 className="text-2xl font-bold">VIP 초대코드</h1>
          <p className="text-gray-600 mt-2">
            특별 VIP 멤버십을 위한<br />
            초대코드를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium mb-2">
              초대코드
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="VIP2024"
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-wider uppercase"
              required
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !inviteCode || !nickname}
            className="w-full"
          >
            {loading ? '가입 중...' : '코드 확인'}
          </Button>
        </form>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium">💎 VIP 멤버십 혜택</p>
            <ul className="mt-2 space-y-1 text-blue-600">
              <li>• 독점 게임 및 콘텐츠 접근</li>
              <li>• 프리미엄 보상 및 혜택</li>
              <li>• VIP 전용 고객 지원</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            초대코드가 없으신가요?
          </p>
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← 메인 화면으로 돌아가기
          </a>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-600">💡 데모용 초대코드</p>
          <div className="flex justify-center space-x-2 mt-1">
            <code className="bg-white px-2 py-1 rounded text-xs">VIP2024</code>
            <code className="bg-white px-2 py-1 rounded text-xs">DEMO99</code>
            <code className="bg-white px-2 py-1 rounded text-xs">TEST01</code>
          </div>
        </div>
      </div>
    </Card>
  );
}
