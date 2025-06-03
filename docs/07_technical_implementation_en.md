# Technical Implementation Document

## 7.1. Frontend Implementation

### 7.1.1. Project Structure (React/Next.js)
```
/frontend
│
├── public/
│   ├── sounds/           # victory.mp3, failure.mp3 etc.
│   ├── images/           # thumbnails, stage assets
│
├── src/
│   ├── components/
│   │    ├── SlotMachine.jsx
│   │    ├── RPSGame.jsx
│   │    ├── Roulette.jsx
│   │    ├── EmotionFeedback.jsx
│   │    ├── AdultContentViewer.jsx
│   │    ├── QuizForm.jsx
│   │    └── NotificationBanner.jsx
│   │
│   ├── hooks/
│   │    └── useEmotionFeedback.js
│   │
│   ├── pages/
│   │    ├── index.jsx       # Landing page
│   │    ├── app.jsx         # Next.js App wrapper
│   │    ├── _document.jsx   # HTML <head>
│   │    ├── slots.jsx       # /slots route
│   │    ├── rps.jsx         # /rps route
│   │    ├── roulette.jsx    # /roulette route
│   │    ├── adult_content.jsx # /adult_content route
│   │    ├── quiz.jsx        # /quiz route
│   │    └── profile.jsx     # /profile route
│   │
│   ├── utils/
│   │    ├── rewardUtils.js   # calculateReward, spinGacha
│   │    └── apiClient.js     # axios instance, baseURL
│   │
│   ├── styles/
│   │    ├── globals.css
│   │    └── modules/         # CSS modules per component
│   │
│   └── AppRouter.jsx         # React Router (if not using Next.js)
│
├── package.json
└── tailwind.config.js
```

### 7.1.2. Example Component: `SlotMachine.jsx`
```jsx
import React, { useState, useEffect } from "react";
import { calculateReward } from "../utils/rewardUtils";
import { fetchEmotionFeedback } from "../hooks/useEmotionFeedback";
import confetti from "canvas-confetti";
import useSound from "use-sound";
import victorySound from "../public/sounds/victory.mp3";
import failureSound from "../public/sounds/failure.mp3";
import styles from "../styles/SlotMachine.module.css";

const SlotMachine = ({ userId }) => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [streakCount, setStreakCount] = useState(0);
  const [feedback, setFeedback] = useState({ emotion: "", message: "" });
  const [playVictory] = useSound(victorySound);
  const [playFailure] = useSound(failureSound);

  const spin = async () => {
    const isWin = calculateReward(streakCount);
    if (isWin) {
      setStreakCount(streakCount + 1);
      playVictory();
      confetti();
      const resp = await fetchEmotionFeedback(userId, "GAME_WIN");
      setFeedback(resp);
    } else {
      setStreakCount(0);
      playFailure();
      const resp = await fetchEmotionFeedback(userId, "GAME_FAIL");
      setFeedback(resp);
    }
    // Update reels randomly (0-9)
    setReels([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]);
  };

  return (
    <div className={styles.container}>
      <h2>Slot Machine</h2>
      <div className={styles.reels}>
        {reels.map((num, idx) => (
          <div key={idx} className={styles.reel}>{num}</div>
        ))}
      </div>
      <button onClick={spin} className={styles.spinButton}>Spin</button>
      {feedback.message && (
        <div className={`${styles.feedback} ${styles[feedback.emotion]}`}>
          {feedback.message}
        </div>
      )}
      <div className={styles.streak}>Streak: {streakCount}</div>
    </div>
  );
};

export default SlotMachine;
```

### 7.1.3. CSS Module Example: `SlotMachine.module.css`
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.reels {
  display: flex;
  gap: 1rem;
}

.reel {
  width: 60px;
  height: 60px;
  background-color: #f0f0f0;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
}

.spinButton {
  margin-top: 1.5rem;
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.spinButton:hover {
  background-color: #4338ca;
}

.feedback {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
}

.happiness {
  color: #16a34a;
}

.frustration {
  color: #dc2626;
}

.determination {
  color: #1e40af;
}

.streak {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #6b7280;
}
```

## 7.2. Backend Implementation (FastAPI)
```markdown
## 7.2. Backend Implementation

### 7.2.1. Project Structure (FastAPI)
```
/backend
│
├── app/
│   ├── main.py              # FastAPI app and router registration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas (User, Action, Reward, etc.)
│   ├── database.py          # DB engine, session, Redis client setup
│   ├── routers/
│   │    ├── users.py        # /api/users
│   │    ├── actions.py      # /api/actions
│   │    ├── rewards.py      # /api/users/{id}/rewards
│   │    ├── feedback.py     # /api/feedback
│   │    ├── unlock.py       # /api/unlock
│   │    ├── user_segments.py # /api/user-segments
│   │    └── notification.py # /api/notification
│   │
│   ├── utils/
│   │    ├── reward_utils.py  # calculateReward, spin_gacha, etc.
│   │    └── emotion_utils.py # emotion_matrix processing
│   │
│   └── celery_worker.py      # Celery task definitions
│
├── requirements.txt
└── alembic/                 # Migration scripts
```

### 7.2.2. Example FastAPI Endpoint: `/api/actions`
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db, get_redis
from .models import UserAction
from .schemas import ActionCreate

router = APIRouter()

@router.post("/api/actions", status_code=200)
def create_action(action: ActionCreate, db: Session = Depends(get_db), redis=Depends(get_redis)):
    user = db.query(User).filter(User.id == action.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_action = UserAction(
        user_id=action.user_id,
        action_type=action.action_type,
        action_timestamp=action.timestamp,
        metadata=action.metadata
    )
    db.add(new_action)
    db.commit()
    db.refresh(new_action)

    # Redis cache update
    streak_key = f"user:{action.user_id}:streak_count"
    last_ts_key = f"user:{action.user_id}:last_action_ts"
    redis.incr(streak_key)
    redis.set(last_ts_key, int(action.timestamp.timestamp()))

    return {"action_id": new_action.id}
```

### 7.2.3. Reward Logic Example (`reward_utils.py`)
```python
import random

def calculate_reward(streak_count: int) -> bool:
    base_prob = 0.10
    streak_bonus = min(streak_count * 0.01, 0.30)  # max +30% bonus
    actual_prob = base_prob + streak_bonus
    return random.random() < actual_prob

def spin_gacha():
    gacha_table = [
        { "weight": 5,  "result": { "type": "CONTENT_UNLOCK", "stage": 3 } },
        { "weight": 20, "result": { "type": "CONTENT_UNLOCK", "stage": 2 } },
        { "weight": 50, "result": { "type": "CONTENT_UNLOCK", "stage": 1 } },
        { "weight": 25, "result": { "type": "COIN", "amount": 100 } },
    ]
    total = sum(entry["weight"] for entry in gacha_table)
    rand = random.random() * total
    for entry in gacha_table:
        if rand < entry["weight"]:
            return entry["result"]
        rand -= entry["weight"]
    return None
```

### 7.2.4. Redis & Kafka Setup Example (`database.py`)
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import redis
from confluent_kafka import Consumer, Producer

DATABASE_URL = "postgresql://user:password@localhost:5432/cc_db"
REDIS_URL = "redis://localhost:6379/0"
KAFKA_BROKER = "localhost:9092"

# PostgreSQL session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Redis client
redis_client = redis.Redis.from_url(REDIS_URL)

# Kafka producer/consumer example
producer = Producer({"bootstrap.servers": KAFKA_BROKER})
consumer = Consumer({
    "bootstrap.servers": KAFKA_BROKER,
    "group.id": "cc_app_group"
})
```

## 7.3. Image/Outfit Management System
- Admin uploads character/outfit images, which are dynamically loaded per stage for the AI character
- Example:
  ```python
  import os
  from PIL import Image

  def load_outfit(character_id: str, stage: int):
      outfit_path = f"assets/{character_id}/outfits/{stage}.png"
      if os.path.exists(outfit_path):
          return Image.open(outfit_path)
      return None
  ```

## 7.4. Emotion Analytics Pipeline
- Emotion matrix is used by FastAPI to provide real-time feedback messages
- Example:
  ```python
  emotion_matrix = {
      "GAME_WIN": {"emotion":"happiness", "feedback":"You did amazing! Keep it up!"},
      "GAME_FAIL": {"emotion":"frustration", "feedback":"Don't worry! Try again!"},
      "GAME_RETRY":{"emotion":"determination","feedback":"You can do it, give it another shot!"}
  }

  def get_feedback_message(action_type: str):
      return emotion_matrix.get(action_type, {"emotion":"neutral","feedback":"You're doing great!"})
  ```
