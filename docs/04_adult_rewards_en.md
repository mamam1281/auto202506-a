# Adult Content & Reward System Document

## 4.1. Overview
- **Goal:** Use adult‐content unlocking as the primary “hook” to drive user engagement. Adult assets (images/videos) are released in staged layers as rewards.
- **Stages:**  
  - **Stage 1:** Teaser thumbnails (blurry or partial clothing)  
  - **Stage 2:** Partial reveal (top/bottom clothing removed)  
  - **Stage 3:** Full reveal (complete adult asset access)  

## 4.2. Adult Content Management
- **Database Table:** `adult_content`
  | Column         | Type         | Description                           |
  |----------------|--------------|---------------------------------------|
  | content_id     | SERIAL (PK)  | Unique ID                             |
  | stage          | INTEGER      | 1, 2, or 3                            |
  | media_url      | TEXT         | Secure URL to image/video             |
  | thumbnail_url  | TEXT         | Blurred/teaser thumbnail              |
  | required_segment | VARCHAR(10) | “Whale”/“Medium”/“Low” segment required |
- **Storage:** Use a cloud storage (e.g., S3) or local CDN for media.  

## 4.3. Unlocking Logic (FastAPI)
```python
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .models import AdultContent, User

app = FastAPI()

@app.get("/api/unlock")
def get_unlocked_content(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Determine user’s current stage based on reward history
    last_stage = db.query(UserRewards).filter(
        UserRewards.user_id == user_id,
        UserRewards.reward_type == "CONTENT_UNLOCK"
    ).order_by(UserRewards.awarded_at.desc()).first()

    next_stage = last_stage.reward_value + 1 if last_stage else 1
    if next_stage > 3:
        raise HTTPException(status_code=400, detail="All stages already unlocked")

    # Check if user meets segment requirement
    content = db.query(AdultContent).filter(AdultContent.stage == next_stage).first()
    if content.required_segment not in user.segment:
        raise HTTPException(status_code=403, detail="Segment level too low")

    return {
        "stage": content.stage,
        "thumbnail_url": content.thumbnail_url,
        "media_url": content.media_url,
    }
```

## 4.4. Reward Issuance (Back‐End)
- **When to Issue Unlock Reward?**  
  - Upon **mini‐game win** or **container action**  
  - Worker checks `calculateReward` and if true:  
    1. Insert into `user_rewards` with `reward_type="CONTENT_UNLOCK", reward_value=stage`  
    2. Return stage → frontend calls `/api/unlock` to display  

```python
def attempt_content_unlock(user_id: int, db: Session):
    # Check current unlock stage
    last = db.query(UserRewards).filter(
        UserRewards.user_id == user_id,
        UserRewards.reward_type == "CONTENT_UNLOCK"
    ).order_by(UserRewards.awarded_at.desc()).first()
    next_stage = (last.reward_value if last else 0) + 1
    if next_stage > 3:
        return None  # Already fully unlocked

    # Check segment eligibility
    user = db.query(User).filter(User.id == user_id).first()
    required_seg = db.query(AdultContent).filter(AdultContent.stage == next_stage).first().required_segment
    if user.segment not in [required_seg, "Whale"]:
        return None

    # Issue reward
    reward = UserRewards(
        user_id=user_id,
        reward_type="CONTENT_UNLOCK",
        reward_value=next_stage,
        awarded_at=datetime.utcnow(),
        trigger_action_id=None
    )
    db.add(reward)
    db.commit()
    return next_stage
```

## 4.5. Tiered Reward System with Adult Content
- **Mini‐Game Integration:**  
  - Each mini‐game (Slot, RPS, Roulette) calls `calculateReward(streakCount)`  
  - On success: call `attempt_content_unlock(userId)`; if `next_stage` returned → frontend displays new media  

- **Random Reward (“Gacha”)**  
  - Each “Gacha Pull” may yield:  
    - “Partial Reveal” (stage 1 or 2)  
    - “Full Reveal” (stage 3)  
    - “Coins” or “Coupon”  

```js
const gachaTable = [
  { weight: 5,  result: { type: "CONTENT_UNLOCK", stage: 3 } },
  { weight: 20, result: { type: "CONTENT_UNLOCK", stage: 2 } },
  { weight: 50, result: { type: "CONTENT_UNLOCK", stage: 1 } },
  { weight: 25, result: { type: "COIN", amount: 100 } }
];

export function spinGacha() {
  const total = gachaTable.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * total;
  for (const entry of gachaTable) {
    if (rand < entry.weight) {
      return entry.result;
    }
    rand -= entry.weight;
  }
  return null;
}
```

- **Reward Persistence:**  
  - Every time `spinGacha()` yields type `"CONTENT_UNLOCK"`, backend `attempt_content_unlock` 호출
  - type `"COIN"` 일 때는 `user_rewards`에 `{ reward_type: "COIN", reward_value: amount }` 기록
