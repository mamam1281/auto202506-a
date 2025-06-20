# UI 컴포넌트 정리 체크리스트

### 데이터 표시 컴포넌트 (data-display 폴더에 있는 것들)
- [x] Card.tsx / Card.module.css (이미 삭제됨)
- [x] Accordion.tsx / Accordion.module.css
- [x] Calendar.tsx / Calendar.module.css
- [x] Carousel.tsx / Carousel.module.css
- [x] Chart.tsx / Chart.module.css
- [x] Collapsible.tsx / Collapsible.module.css
- [x] Table.tsx / Table.module.css 현재 상태 확인
- [x] `components/ui/` 디렉토리 전체 파일 목록 확인
- [x] `basic/` 폴더 내용 확인
- [ ] `data-display/` 폴더 내용 확인
- [ ] `layout/` 폴더 내용 확인
- [ ] `feedback/` 폴더 내용 확인
- [ ] `navigation/` 폴더 내용 확인
- [ ] `game/` 폴더 내용 확인
- [ ] `utils/` 폴더 내용 확인

## 중복 파일 삭제 대상 (루트 레벨에서 제거할 파일들)

### 기본 컴포넌트 (basic 폴더에 있는 것들)
- [x] Avatar.tsx / Avatar.module.css
- [x] Badge.tsx / Badge.module.css
- [x] Button.tsx / Button.module.css (이미 삭제됨)
- [x] Checkbox.tsx / Checkbox.module.css (이미 삭제됨)
- [x] Input.tsx / Input.module.css (이미 삭제됨)
- [x] Label.tsx / Label.module.css (이미 삭제됨)

### 데이터 표시 컴포넌트 (data-display 폴더에 있는 것들)
- [ ] Card.tsx / Card.module.css (이미 삭제됨)

### 레이아웃 컴포넌트 (layout 폴더에 있는 것들)
- [ ] Separator.tsx / Separator.module.css (이미 삭제됨)

### 기타 중복 파일들
- [ ] 추가 중복 파일 확인 필요

## 삭제 실행
- [ ] Avatar 관련 파일 삭제
- [ ] Badge 관련 파일 삭제  
- [ ] Checkbox 관련 파일 삭제
- [ ] Input 관련 파일 삭제
- [ ] Label 관련 파일 삭제
- [ ] 기타 중복 파일 삭제

## 정리 후 작업
- [ ] 각 서브폴더의 index.ts 파일 확인/생성
- [ ] 루트 index.ts 파일 업데이트
- [ ] import 경로 확인 및 수정
- [ ] 빌드 테스트
- [ ] 최종 검증

## 현재 진행 상황
- ✅ Button.tsx, Card.tsx, Separator.tsx 및 관련 CSS 파일 삭제 완료
- 🔄 나머지 중복 파일들 확인 및 삭제 진행 중

---
**마지막 업데이트:** 2025-06-20
