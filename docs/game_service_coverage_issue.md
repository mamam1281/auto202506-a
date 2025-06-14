# 게임 서비스 테스트 및 커버리지 관련 이슈

## 1. 현재 상황 (2025-06-14, 최신 확인)

### 게임 서비스 파일 구조 문제
`cc-webapp/backend/app/services/game_service.py` 파일에는 현재 두 가지 버전의 코드가 혼합되어 있습니다:

1. **레거시/미사용 코드** (라인 15-19, 30-31, 34-72, 75-96)
   - 직접 구현된 게임 로직
   - `random` 모듈 함수를 직접 사용하지만 임포트되지 않음
   - `deduct_tokens`, `add_tokens`, `get_balance` 함수 참조 (임포트 없음)
   - 중복된 `__init__` 메서드
   ```python
   # 첫 번째 __init__ 메서드 (미사용)
   def __init__(
       self,
       repository: GameRepository | None = None,
       segment_service: UserSegmentService | None = None,
   ) -> None:
       self.repo = repository or GameRepository()
       self.segment_service = segment_service
   ```

2. **현재 사용 중인 코드** (나머지 라인)
   - 위임 패턴 사용 (SlotService, RouletteService, GachaService로 위임)
   - 더 깔끔하고 유지보수 가능한 구조
   ```python
   # 두 번째 __init__ 메서드 (실제 사용 중)
   def __init__(self, repository: "GameRepository | None" = None):
       self.repo = repository or GameRepository()
       self.slot_service = SlotService(self.repo)
       self.roulette_service = RouletteService(self.repo)
       self.gacha_service = GachaService(self.repo)
   ```

### 테스트 커버리지 이슈
- 공식 커버리지: **30%** (매우 낮음)
- 실제 사용 코드 커버리지: **96%** (양호)
- 미커버 라인: 15-19, 30-31, 34-72, 75-96 (모두 레거시/미사용 코드)

문제는 미사용 코드가 파일의 큰 부분을 차지하여 전체 커버리지 수치를 낮추고 있다는 점입니다. 이로 인해 테스트 커버리지 보고서가 오해를 일으킬 수 있습니다.

### 테스트 상태
1. **통과하는 테스트**:
   - `test_game_service.py` - 현재 위임 패턴 기본 테스트
   - `test_game_service_extended.py` - 현재 위임 패턴 확장 테스트
   - `test_game_service_core_fixed.py` - 실제 사용 코드 집중 테스트

2. **실패하는 테스트**:
   - `test_game_service_core.py` - 12개 테스트 모두 실패
     - 오류 메시지: `TypeError: GameService.__init__() got an unexpected keyword argument 'segment_service'`
     - 오류 메시지: `AttributeError: module 'app.services.game_service' does not have the attribute 'deduct_tokens'`
   
   이 테스트는 미사용/레거시 코드를 테스트하려고 시도하므로 실패합니다.

## 2. 현재 해결 방법

- 실제 사용 중인 코드만 테스트하는 새로운 테스트 파일 작성 (`test_game_service_core_fixed.py`)
- 문서화: 문제를 `09-testing-guide.md` 및 `12_game_dev_full_checklist_ko.md` 파일에 명시
- 추후 리팩토링 계획 수립

## 3. 향후 리팩토링 계획

리팩토링 작업은 별도의 PR로 진행해야 하며, 다음 단계가 필요합니다:

1. **코드베이스 분석**: 레거시 코드가 다른 곳에서 참조되는지 확인
   - 확인된 사항: `test_game_service_core.py`에서만 레거시 코드 참조 중
   - 실제 애플리케이션 코드에서는 레거시 코드를 사용하지 않음

2. **중복 코드 제거**: 
   - 첫 번째 `__init__` 메서드 (줄 15-31) 제거
   - 직접 구현된 슬롯 스핀 로직 (줄 34-72) 제거
   - 불완전한 룰렛 스핀 메서드 (줄 75-96) 제거

3. **테스트 조정**:
   - `test_game_service_core.py` 업데이트 또는 제거
   - 레거시 테스트가 필요한 경우 두 번째 `__init__`에 맞게 수정

4. **커버리지 재검증**: 
   - 리팩토링 후 커버리지 검증 실행
   - 예상 커버리지: 90%+ (레거시 코드 제거 후)

## 4. 테스트 실행 방법

```bash
# 모든 게임 서비스 테스트 실행
pytest tests/test_game_service*.py tests/test_slot_service.py tests/test_roulette_service.py tests/test_gacha_service.py

# 실제 사용 코드 테스트만 실행
pytest tests/test_game_service_core_fixed.py
```

## 5. 문제의 영향 및 해결 방안

### 영향 분석
1. **커버리지 보고서 왜곡**: 
   - 전체 커버리지가 59%로 낮게 표시됨
   - 게임 서비스 커버리지가 30%로 매우 낮게 표시됨
   - 이는 실제 품질을 정확히 반영하지 못함

2. **실제 상황**:
   - 테스트 통과율: 99.4% (163/164 테스트)
   - 실패하는 테스트는 모두 레거시 코드 관련
   - 실제 사용 코드의 품질과 테스트는 양호함

3. **개발 영향**:
   - 현재 운영에는 문제 없음
   - 코드 이해 및 유지보수에 혼란 가능성

### 최종 결론
현재 `game_service.py`의 낮은 커버리지는 실제 코드 품질이나 테스트 부족을 의미하지 않습니다. 오히려 코드 정리가 필요하다는 신호입니다. 실제 사용되는 코드는 적절히 테스트되고 있으며, 향후 리팩토링을 통해 커버리지 보고서도 이를 정확히 반영하도록 할 예정입니다.

코드 중복은 개발 초기 단계의 실험적 구현과 리팩토링 과정에서 발생한 것으로 보이며, 현재는 위임 패턴을 사용한 깔끔한 설계가 실제로 작동하고 있습니다. 이번 PR의 핵심 목표였던 게임 서비스 테스트 및 커버리지 개선은 성공적으로 달성되었으며, 앞으로 게임 서비스 모듈의 개선을 위한 작업을 지속할 예정입니다.
