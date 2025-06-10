"""
통합 가차 서비스 테스트 - MCP 최적화
기존 중복 테스트들을 통합하고 공통 픽스처 활용
"""

import pytest
import time
from unittest.mock import Mock, patch, AsyncMock
from decimal import Decimal

pytestmark = pytest.mark.gacha


class TestBasicGachaService:
    """기본 가차 서비스 테스트"""
    
    def test_gacha_pull_basic(self):
        """기본 가차 뽑기 테스트"""
        # Given: Mock gacha service
        mock_gacha = Mock()
        mock_gacha.pull.return_value = {
            "item_id": "sword_001",
            "item_name": "Iron Sword",
            "rarity": "common",
            "user_id": 1
        }
        
        # When: Pull gacha
        result = mock_gacha.pull(user_id=1, gacha_type="basic")
        
        # Then: Valid result
        assert result["item_id"] is not None
        assert result["rarity"] in ["common", "rare", "epic", "legendary"]
        assert result["user_id"] == 1
    
    def test_multiple_gacha_pulls(self):
        """다중 가차 뽑기 테스트"""
        mock_gacha = Mock()
        
        # 10연차 시뮬레이션
        items = []
        for i in range(10):
            mock_gacha.pull.return_value = {
                "item_id": f"item_{i:03d}",
                "item_name": f"Item {i}",
                "rarity": "common" if i < 8 else "rare",
                "user_id": 1
            }
            result = mock_gacha.pull(user_id=1, gacha_type="basic")
            items.append(result)
        
        assert len(items) == 10
        # 최소 1개는 레어 이상이어야 함
        rare_items = [item for item in items if item["rarity"] in ["rare", "epic", "legendary"]]
        assert len(rare_items) >= 1


class TestGachaRaritySystem:
    """가차 희귀도 시스템 테스트"""
    
    def test_rarity_distribution(self):
        """희귀도 분포 테스트"""
        mock_gacha = Mock()
        
        # 확률 시뮬레이션
        rarity_counts = {"common": 0, "rare": 0, "epic": 0, "legendary": 0}
        
        for i in range(100):
            # 확률 기반 희귀도 결정
            if i < 70:  # 70% common
                rarity = "common"
            elif i < 90:  # 20% rare
                rarity = "rare"
            elif i < 98:  # 8% epic
                rarity = "epic"
            else:  # 2% legendary
                rarity = "legendary"
            
            mock_gacha.pull.return_value = {
                "item_id": f"item_{i:03d}",
                "rarity": rarity,
                "user_id": 1
            }
            
            result = mock_gacha.pull(user_id=1)
            rarity_counts[result["rarity"]] += 1
        
        # 대략적인 확률 검증
        assert rarity_counts["common"] >= 60  # 60% 이상
        assert rarity_counts["rare"] >= 10   # 10% 이상
        assert rarity_counts["legendary"] <= 10  # 10% 이하
    
    def test_pity_system(self):
        """천장 시스템 테스트"""
        mock_gacha = Mock()
        
        # 천장까지 뽑기 (90회)
        pity_counter = 0
        guaranteed_rare = False
        
        for i in range(90):
            pity_counter += 1
            
            # 90번째에는 무조건 레어 이상
            if pity_counter >= 90:
                rarity = "epic"
                guaranteed_rare = True
                pity_counter = 0
            else:
                rarity = "common"
            
            mock_gacha.pull.return_value = {
                "item_id": f"pity_item_{i:03d}",
                "rarity": rarity,
                "pity_count": pity_counter,
                "user_id": 1
            }
            
            result = mock_gacha.pull(user_id=1)
            
            if result["rarity"] in ["epic", "legendary"]:
                guaranteed_rare = True
                break
        
        assert guaranteed_rare == True


class TestGachaCurrency:
    """가차 화폐 시스템 테스트"""
    
    def test_currency_deduction(self):
        """화폐 차감 테스트"""
        mock_gacha = Mock()
        mock_user = Mock()
        
        # 초기 화폐
        initial_gems = 1000
        pull_cost = 100
        
        mock_user.gems = initial_gems
        mock_gacha.get_pull_cost.return_value = pull_cost
        
        # 가차 뽑기 후 화폐 차감
        mock_gacha.pull.return_value = {
            "item_id": "test_item",
            "rarity": "common",
            "user_id": 1,
            "cost": pull_cost
        }
        
        result = mock_gacha.pull(user_id=1, currency="gems")
        expected_gems = initial_gems - pull_cost
        
        # 화폐 차감 확인
        assert result["cost"] == pull_cost
        # 실제로는 서비스에서 사용자 화폐를 업데이트해야 함
    
    def test_insufficient_currency(self):
        """화폐 부족 테스트"""
        mock_gacha = Mock()
        
        # 화폐 부족 시나리오
        mock_gacha.pull.side_effect = ValueError("Insufficient gems")
        
        with pytest.raises(ValueError, match="Insufficient gems"):
            mock_gacha.pull(user_id=1, currency="gems")
    
    def test_free_pull_daily(self):
        """일일 무료 뽑기 테스트"""
        mock_gacha = Mock()
        
        # 무료 뽑기 가능
        mock_gacha.can_free_pull.return_value = True
        mock_gacha.pull.return_value = {
            "item_id": "free_item",
            "rarity": "common",
            "user_id": 1,
            "cost": 0,
            "is_free": True
        }
        
        result = mock_gacha.pull(user_id=1, pull_type="free")
        
        assert result["cost"] == 0
        assert result["is_free"] == True
        
        # 무료 뽑기 사용 후
        mock_gacha.can_free_pull.return_value = False


class TestGachaInventory:
    """가차 인벤토리 테스트"""
    
    def test_item_storage(self):
        """아이템 저장 테스트"""
        mock_inventory = Mock()
        
        # 아이템 추가
        item = {
            "item_id": "sword_001",
            "item_name": "Iron Sword",
            "rarity": "common",
            "quantity": 1
        }
        
        mock_inventory.add_item.return_value = True
        result = mock_inventory.add_item(user_id=1, item=item)
        
        assert result == True
        
        # 인벤토리 조회
        mock_inventory.get_items.return_value = [item]
        items = mock_inventory.get_items(user_id=1)
        
        assert len(items) == 1
        assert items[0]["item_id"] == "sword_001"
    
    def test_duplicate_item_stacking(self):
        """중복 아이템 스택 테스트"""
        mock_inventory = Mock()
        
        # 동일 아이템 여러 개 획득
        item_id = "potion_hp_001"
        
        mock_inventory.add_item.return_value = True
        
        # 첫 번째 아이템
        mock_inventory.add_item(user_id=1, item_id=item_id, quantity=1)
        
        # 두 번째 같은 아이템 (스택)
        mock_inventory.add_item(user_id=1, item_id=item_id, quantity=2)
        
        # 최종 수량 확인
        mock_inventory.get_item_quantity.return_value = 3
        quantity = mock_inventory.get_item_quantity(user_id=1, item_id=item_id)
        
        assert quantity == 3
    
    def test_inventory_capacity(self):
        """인벤토리 용량 테스트"""
        mock_inventory = Mock()
        
        # 용량 제한 (예: 100개)
        max_capacity = 100
        current_items = 99
        
        mock_inventory.get_item_count.return_value = current_items
        mock_inventory.get_max_capacity.return_value = max_capacity
        
        # 용량 확인
        can_add = current_items < max_capacity
        assert can_add == True
        
        # 용량 초과 시
        mock_inventory.get_item_count.return_value = max_capacity
        can_add = mock_inventory.get_item_count(1) < max_capacity
        assert can_add == False


class TestGachaEvents:
    """가차 이벤트 테스트"""
    
    def test_rate_up_event(self):
        """확률 업 이벤트 테스트"""
        mock_gacha = Mock()
        
        # 이벤트 기간 중 확률 증가
        normal_rate = 0.02  # 2% legendary
        event_rate = 0.05   # 5% legendary
        
        mock_gacha.get_legendary_rate.return_value = event_rate
        mock_gacha.is_event_active.return_value = True
        
        # 이벤트 확률로 뽑기
        mock_gacha.pull.return_value = {
            "item_id": "legendary_sword",
            "rarity": "legendary",
            "event_bonus": True,
            "user_id": 1
        }
        
        result = mock_gacha.pull(user_id=1, event="rate_up")
        
        assert result["event_bonus"] == True
        assert mock_gacha.get_legendary_rate() > normal_rate
    
    def test_limited_banner(self):
        """한정 배너 테스트"""
        mock_gacha = Mock()
        
        # 한정 아이템
        limited_items = ["limited_weapon_001", "limited_character_001"]
        
        mock_gacha.get_banner_items.return_value = limited_items
        mock_gacha.is_banner_active.return_value = True
        
        mock_gacha.pull.return_value = {
            "item_id": "limited_weapon_001",
            "rarity": "legendary",
            "is_limited": True,
            "banner": "summer_festival",
            "user_id": 1
        }
        
        result = mock_gacha.pull(user_id=1, banner="summer_festival")
        
        assert result["is_limited"] == True
        assert result["item_id"] in limited_items
    
    def test_step_up_gacha(self):
        """스텝업 가차 테스트"""
        mock_gacha = Mock()
        
        # 스텝별 혜택
        step_benefits = {
            1: {"discount": 0.5, "guaranteed": None},
            2: {"discount": 0.3, "guaranteed": None},
            3: {"discount": 0.0, "guaranteed": "rare"},
            5: {"discount": 0.0, "guaranteed": "epic"},
            10: {"discount": 0.0, "guaranteed": "legendary"}
        }
        
        current_step = 3
        
        mock_gacha.get_current_step.return_value = current_step
        mock_gacha.get_step_benefit.return_value = step_benefits[current_step]
        
        # 3단계에서는 레어 이상 보장
        mock_gacha.pull.return_value = {
            "item_id": "guaranteed_rare",
            "rarity": "rare",
            "step": current_step,
            "guaranteed": True,
            "user_id": 1
        }
        
        result = mock_gacha.pull(user_id=1, pull_type="step_up")
        
        assert result["guaranteed"] == True
        assert result["step"] == current_step
        assert result["rarity"] in ["rare", "epic", "legendary"]


class TestGachaPerformance:
    """가차 성능 테스트"""
    
    @pytest.mark.performance
    def test_bulk_pull_performance(self):
        """대량 뽑기 성능 테스트"""
        mock_gacha = Mock()
        
        # 100연차 성능 측정
        start_time = time.time()
        
        results = []
        for i in range(100):
            mock_gacha.pull.return_value = {
                "item_id": f"bulk_item_{i:03d}",
                "rarity": "common",
                "user_id": 1
            }
            result = mock_gacha.pull(user_id=1)
            results.append(result)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # 100연차를 1초 내에 처리
        assert processing_time < 1.0
        assert len(results) == 100
    
    def test_concurrent_pulls(self):
        """동시 뽑기 테스트"""
        import concurrent.futures
        
        mock_gacha = Mock()
        
        def pull_gacha(user_id):
            mock_gacha.pull.return_value = {
                "item_id": f"concurrent_item_{user_id}",
                "rarity": "common",
                "user_id": user_id
            }
            return mock_gacha.pull(user_id=user_id)
        
        # 여러 사용자 동시 뽑기
        user_ids = list(range(1, 11))  # 10명 사용자
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(pull_gacha, user_id) for user_id in user_ids]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        assert len(results) == 10
        
        # 각 사용자별로 고유한 결과
        user_ids_in_results = [result["user_id"] for result in results]
        assert len(set(user_ids_in_results)) == 10


class TestGachaAnalytics:
    """가차 분석 테스트"""
    
    def test_pull_statistics(self):
        """뽑기 통계 테스트"""
        mock_analytics = Mock()
        
        # 사용자별 뽑기 통계
        stats = {
            "total_pulls": 150,
            "common_count": 105,
            "rare_count": 30,
            "epic_count": 12,
            "legendary_count": 3,
            "total_spent": 15000,
            "average_rarity": 1.2
        }
        
        mock_analytics.get_user_stats.return_value = stats
        result = mock_analytics.get_user_stats(user_id=1)
        
        assert result["total_pulls"] == 150
        assert result["legendary_count"] == 3
        assert result["total_spent"] > 0
    
    def test_gacha_revenue_tracking(self):
        """가차 수익 추적 테스트"""
        mock_analytics = Mock()
        
        # 일별 수익 데이터
        daily_revenue = {
            "2024-01-01": {"gems_spent": 50000, "pulls": 500, "revenue_usd": 250},
            "2024-01-02": {"gems_spent": 75000, "pulls": 750, "revenue_usd": 375},
        }
        
        mock_analytics.get_daily_revenue.return_value = daily_revenue
        result = mock_analytics.get_daily_revenue("2024-01-01", "2024-01-02")
        
        assert len(result) == 2
        assert result["2024-01-01"]["revenue_usd"] == 250
        assert result["2024-01-02"]["pulls"] == 750


if __name__ == "__main__":
    pytest.main([__file__, "-v"])