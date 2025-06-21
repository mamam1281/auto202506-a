import { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "../ui/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]",
        "flex items-center justify-center p-4",
        className,
      )}
    >
      <Container size="sm" padding={false}>
        <div className="w-full max-w-md mx-auto">
          {/* 로고 및 헤더 */}
          {showLogo && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    G
                  </span>
                </div>
                <span className="text-2xl font-bold text-white">
                  GamePlatform
                </span>
              </div>

              {title && (
                <h1 className="text-xl font-medium text-white mb-2">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="text-sm text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* 인증 폼 카드 */}
          <div className="bg-[var(--surface-glass)] backdrop-blur-sm rounded-2xl border border-[var(--surface-glass)] p-8 shadow-2xl">
            {children}
          </div>

          {/* 푸터 링크 */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                이용약관
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
              >
                고객센터
              </a>
            </div>

            <p className="text-xs text-gray-500">
              © 2025 GamePlatform. All rights reserved.
            </p>
          </div>
        </div>
      </Container>

      {/* 배경 장식 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--neon-purple-3)]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--neon-purple-1)]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--neon-purple-2)]/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}