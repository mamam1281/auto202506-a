'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/basic/button';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="auth-container popup-mode">
      <div className="auth-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-6">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl text-white game-title">설정</h1>
          </div>

          <div className="space-y-6">
            <section className="p-4 bg-card rounded-lg border border-border">
              <h2 className="text-lg text-white mb-4 game-subtitle">계정 설정</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">프로필 편집</span>
                  <Button variant="ghost" size="sm">수정</Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">비밀번호 변경</span>
                  <Button variant="ghost" size="sm">변경</Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">알림 설정</span>
                  <Button variant="ghost" size="sm">설정</Button>
                </div>
              </div>
            </section>

            <section className="p-4 bg-card rounded-lg border border-border">
              <h2 className="text-lg text-white mb-4 game-subtitle">게임 설정</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">사운드</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">켜짐</span>
                    <div className="w-10 h-5 bg-primary/30 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">진동</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">꺼짐</span>
                    <div className="w-10 h-5 bg-muted/30 rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">그래픽 품질</span>
                  <Button variant="ghost" size="sm">고품질</Button>
                </div>
              </div>
            </section>

            <section className="p-4 bg-card rounded-lg border border-border">
              <h2 className="text-lg text-white mb-4 game-subtitle">앱 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">버전</span>
                  <span className="text-sm text-muted-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">이용약관</span>
                  <Button variant="ghost" size="sm">보기</Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-white">개인정보처리방침</span>
                  <Button variant="ghost" size="sm">보기</Button>
                </div>
              </div>
            </section>
            
            <div className="text-center">
              <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                로그아웃
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
