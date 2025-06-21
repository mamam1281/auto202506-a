import { Container } from "./Container";
import Separator from "../basic/Separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    게임: ["인기 게임", "신규 게임", "장르별", "랭킹"],
    커뮤니티: ["공지사항", "이벤트", "가이드", "FAQ"],
    계정: ["내 프로필", "게임 기록", "결제 내역", "설정"],
    지원: ["고객 센터", "문의하기", "버그 신고", "제안하기"],
  };  return (
    <footer className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
      <Container size="xl">
        <div className="py-12">
          {/* 메인 푸터 컨텐츠 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {Object.entries(footerLinks).map(
              ([category, links]) => (
                <div key={category}>
                  <h3 className="font-medium mb-4 text-[var(--neon-purple-2)]">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>

          <Separator className="mb-8" />

          {/* 하단 정보 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-[var(--neon-purple-3)] to-[var(--neon-purple-1)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  G
                </span>
              </div>
              <span className="font-medium">GamePlatform</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <span>
                © {currentYear} GamePlatform. All rights
                reserved.
              </span>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  개인정보처리방침
                </a>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  이용약관
                </a>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  쿠키 정책
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}