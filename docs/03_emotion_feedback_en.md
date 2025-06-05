3.1. Purpose & Overview
Goal:

사용자 행동을 기반으로 감정 상태(도파민 분비 경로)를 감지하고,

즉각적이고 심리적으로 자극적인 피드백(애니메이션, 사운드, 사이버 토큰 보상)을 제공하여

“행위중독 트리거(Variable‐Ratio Reward + Social Feedback)”와 “도파민 루프”를 극대화

궁극적으로 본사 사이트에서 획득한 사이버 토큰을 앱 내 소비로 연결하고, 앱에서 부족 시 다시 본사로 유도하며 리텐션을 강화함.

핵심 포인트
즉각 피드백(Immediate Feedback):

게임 결과 직후 애니메이션 + 사운드 + 토큰 보상 패키지

재미 요소(시각·청각)와 **사이버 토큰 즉시 획득(또는 감소)**를 결합하여 사용자의 도파민 분비를 유발

행위중독 트리거(Behavioral Addiction Triggers):

Variable‐Ratio Reward Schedule: 슬롯, 룰렛, 가챠 등에서 “언제 당첨될지 모름” 긴장감

Social Proof / Leaderboard: 실시간 랭킹 → 경쟁심 자극

Limited-Time Offer / Flash Event: “본사 사이트 로그인이 2시간 후에 종료됩니다 → 100토큰 보너스”

사이버 토큰 연계:

본사 사이트 이용 시 획득 → Redis에 user:{id}:cyber_token_balance 저장

앱 내 게임·언락 시 사용 → 토큰 잔고 감소

잔고 부족 시 본사 사이트로 즉시 유도 (리디렉션 / 푸시 알림)

3.2. Emotion Matrix & Feedback Triggers
Action Type	Emotion Trigger	Reward Behavior	Feedback Message & Asset
GAME_WIN	Dopamine Surge	+10~50 사이버 토큰(랜덤) + 화려한 애니메이션	“🎉 대박! {earned_tokens} 토큰 획득! 고스피드 플레이 계속!”
(Confetti 애니메이션 + Victory 사운드)
GAME_FAIL	Frustration Loop	–2 사이버 토큰(작은 패널티) + 격려 애니메이션	“😓 아쉽네요… 하지만 곧 보상을 다시 받을 수 있어요!”
(Sad Shake 애니메이션 + Encourage 사운드)
GAME_RETRY	Determination Boost	–1 사이버 토큰(재도전 비용) + 짧은 “다시 도전” 애니메이션	“🔥 한 번 더? 이번엔 확률이 15% 상승했어요!”
(Flash 애니메이션 + Beat 사운드)
DAILY_INACTIVE (>12h)	Concern	푸시 알림 → 본사 사이트에서 +100 토큰 보상 제안	“⌛ 오랜만이네요! 본사 사이트 로그인만 해도 100토큰 드려요!”
(Ring 톤 + 토큰 이미지 애니메이션)
REWARD_CLAIM	Satisfaction	+ 일정량 사이버 토큰(콘텐츠 언락 보너스)	“👏 보상 획득! {item_name} 언락 완료. 다음 보상까지 {next_threshold}토큰 남음”
(Unlock 애니메이션 + Cheer 사운드)
QUIZ_COMPLETE	Curiosity/Engagement	+200 토큰(본사 사이트 퀴즈) + 리스크 프로필 반영	“🧠 퀴즈 완료! 당신은 {risk_profile}형 플레이어군요. 맞춤 리워드를 추천해드릴게요!”

Note: 각 상황별로 “애니메이션+사운드+토큰 증감” 패키지가 한 세트로 묶여, 유저의 감정 상태(도파민 분비)와 직결되도록 설계.

3.3. FastAPI Endpoint Integration
3.3.1. Emotion Feedback 엔드포인트
python
복사
편집
from fastapi import FastAPI, HTTPException, Depends
from .database import get_db, get_redis
from .schemas import FeedbackRequest, FeedbackResponse
from .models import User
from datetime import datetime
import random

app = FastAPI()

# Emotion Matrix 정의 (사이버 토큰 변화량, 감정 메시지, 애니메이션 태그, 사운드 태그 포함)
emotion_matrix = {
    "GAME_WIN": {
      "emotion": "happiness",
      "message": "🎉 대박! {earned_tokens} 토큰 획득! 고스피드 플레이 계속!",
      "token_delta": lambda streak: random.randint(10, 50) + min(streak*2, 20),
      "animation": "confetti",
      "sound": "victory.mp3"
    },
    "GAME_FAIL": {
      "emotion": "frustration",
      "message": "😓 아쉽네요… 하지만 곧 보상을 다시 받을 수 있어요!",
      "token_delta": -2,
      "animation": "shake_sad",
      "sound": "encourage.mp3"
    },
    "GAME_RETRY": {
      "emotion": "determination",
      "message": "🔥 한 번 더? 이번엔 확률이 15% 상승했어요!",
      "token_delta": -1,
      "animation": "flash",
      "sound": "beat.mp3"
    },
    "DAILY_INACTIVE": {
      "emotion": "concern",
      "message": "⌛ 오랜만이네요! 본사 사이트 로그인만 해도 100토큰 드려요!",
      "token_delta": 0,  # 실제 토큰은 본사 사이트 연동 시 지급
      "animation": "token_rain",
      "sound": "ring.mp3"
    },
    "REWARD_CLAIM": {
      "emotion": "satisfaction",
      "message": "👏 보상 획득! {item_name} 언락 완료. 다음 보상까지 {next_threshold}토큰 남음",
      "token_delta": 0,  # 이미 지급된 보상
      "animation": "unlock",
      "sound": "cheer.mp3"
    },
    "QUIZ_COMPLETE": {
      "emotion": "curiosity",
      "message": "🧠 퀴즈 완료! 당신은 {risk_profile}형 플레이어군요. 맞춤 리워드를 추천해드릴게요!",
      "token_delta": 200,
      "animation": "quiz_success",
      "sound": "think.mp3"
    }
}

@app.post("/api/feedback", response_model=FeedbackResponse)
def get_feedback(req: FeedbackRequest, db=Depends(get_db), redis=Depends(get_redis)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    entry = emotion_matrix.get(req.action_type)
    if not entry:
        # 기본 피드백
        return {"emotion": "neutral", "message": "계속 진행해보세요!", "animation": None, "sound": None, "token_delta": 0}
    
    # 토큰 증감 계산
    if callable(entry["token_delta"]):
        # 연승/연패 등 streak를 고려
        streak = int(redis.get(f"user:{req.user_id}:streak_count") or 0)
        token_change = entry["token_delta"](streak)
    else:
        token_change = entry["token_delta"]
    
    # 토큰 잔고 업데이트
    if token_change != 0:
        redis.incrby(f"user:{req.user_id}:cyber_token_balance", token_change)
    
    # 메시지 포맷팅
    formatted_message = entry["message"].format(
        earned_tokens=token_change if token_change > 0 else 0,
        item_name=req.metadata.get("item_name", ""),
        next_threshold=req.metadata.get("next_threshold", "")
    )
    
    # 마지막 액션 시각 업데이트
    redis.set(f"user:{req.user_id}:last_action_ts", int(datetime.utcnow().timestamp()))
    
    return {
        "emotion": entry["emotion"],
        "message": formatted_message,
        "animation": entry["animation"],
        "sound": entry["sound"],
        "token_delta": token_change
    }
FeedbackResponse 스키마 예시:

python
복사
편집
from pydantic import BaseModel
from typing import Optional

class FeedbackRequest(BaseModel):
    user_id: int
    action_type: str
    metadata: dict = {}

class FeedbackResponse(BaseModel):
    emotion: str              # happiness, frustration, determination 등
    message: str              # 사용자에게 보여줄 텍스트
    animation: Optional[str]  # confetti, shake_sad 등
    sound: Optional[str]      # victory.mp3, encourage.mp3 등
    token_delta: int          # +/- 변화된 토큰 수량
적용 흐름:

유저가 슬롯·룰렛·퀴즈 등 주요 행동을 완료

프론트에서 /api/feedback 호출 → 위 로직 실행

응답으로 받은 animation/sound → 즉시 재생, token_delta 정보로 토큰 UI 갱신

3.4. Frontend Integration (React 예시)
3.4.1. useEmotionFeedback Hook
jsx
복사
편집
import axios from "axios";

export async function fetchEmotionFeedback(userId, actionType, metadata = {}) {
  const response = await axios.post("/api/feedback", {
    user_id: userId,
    action_type: actionType,
    metadata: metadata
  });
  return response.data; // { emotion, message, animation, sound, token_delta }
}
3.4.2. SlotMachine 컴포넌트 수정 예시
jsx
복사
편집
import React, { useState, useEffect } from "react";
import { fetchEmotionFeedback } from "../hooks/useEmotionFeedback";
import useSound from "use-sound";
import Confetti from "react-confetti"; // 예시로 사용할 수 있는 라이브러리
import { useSelector, useDispatch } from "react-redux";

function SlotMachine({ userId }) {
  const [reels, setReels] = useState([0, 0, 0]);
  const [streakCount, setStreakCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  // Redux 또는 Context로부터 사이버 토큰 잔고 구독
  const balance = useSelector(state => state.user.cyberTokenBalance);
  const dispatch = useDispatch();

  // 사운드 준비
  const [playVictory] = useSound("/sounds/victory.mp3");
  const [playEncourage] = useSound("/sounds/encourage.mp3");

  useEffect(() => {
    // 초기 토큰 잔고 로드
    setTokenBalance(balance);
  }, [balance]);

  const spin = async () => {
    // 1) 실제 승리 판정 로직 (variable-ratio 기반)
    const isWin = Math.random() < (0.10 + Math.min(streakCount * 0.01, 0.30));
    const actionType = isWin ? "GAME_WIN" : "GAME_FAIL";
    const metadata = {}; // 추후 필요한 메타데이터 추가

    // 2) emotion feedback 요청
    const data = await fetchEmotionFeedback(userId, actionType, metadata);
    setFeedback(data);

    // 3) 애니메이션 & 사운드
    if (data.animation === "confetti") {
      // Confetti 애니메이션 노출
      // 예: <Confetti numberOfPieces={200} />
      playVictory();
    } else if (data.animation === "shake_sad") {
      playEncourage();
      // 화면 흔들기 등의 추가 이펙트 처리
    }

    // 4) 레일즈(리덕스) 토큰 잔고 업데이트
    if (data.token_delta !== 0) {
      dispatch({ type: "UPDATE_TOKEN_BALANCE", payload: data.token_delta });
    }

    // 5) 스트릭(streak) 관리
    if (isWin) {
      setStreakCount(prev => prev + 1);
      dispatch({ type: "UPDATE_STREAK", payload: streakCount + 1 });
    } else {
      setStreakCount(0);
      dispatch({ type: "UPDATE_STREAK", payload: 0 });
    }

    // 6) 리콤보 신호: 다음 액션 예고 (ex: GAME_RETRY 권장)
    if (!isWin && streakCount >= 2) {
      const retryFeedback = await fetchEmotionFeedback(userId, "GAME_RETRY", {});
      // 화면에 “한 번 더” 토스트 노출
      setFeedback(retryFeedback);
      playEncourage();
      dispatch({ type: "UPDATE_TOKEN_BALANCE", payload: retryFeedback.token_delta });
    }

    // 7) 릴 출력 (0~9 랜덤)
    setReels([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]);
  };

  return (
    <div>
      <h2>Slot Machine</h2>
      <div className="reels">
        {reels.map((num, idx) => (
          <div key={idx} className="reel">{num}</div>
        ))}
      </div>
      <button onClick={spin}>Spin</button>
      {feedback && (
        <div className={`feedback ${feedback.emotion}`}>
          {feedback.message}
        </div>
      )}
      <div>Streak: {streakCount}</div>
      <div>Cyber Token Balance: {tokenBalance}</div>
    </div>
  );
}

export default SlotMachine;
주요 특징:

GAME_WIN 시 “도파민 서지” 트리거 → 화려한 콘페티 + 토큰 보상

GAME_FAIL 시 “좌절 → 재도전” 루프 활성화 → 소량 토큰 차감 후 “한 번 더” 유도

리덕스/컨텍스트를 이용해 사이버 토큰 잔고와 스트릭 카운트를 전역 관리

3.5. Psychometric/Survey 피드백 연동
퀴즈 완료(Quiz Complete) 시 /api/feedback 호출 → QUIZ_COMPLETE

리스크 프로필을 기반으로 한 피드백 메시지 + +200 토큰 보상

도파민 피드백: 애니메이션 “quiz_success” + (think.mp3) 사운드

이후 개인화 추천 (02 문서의 Recommendation Engine)에서 risk_profile 활용

3.6. 요약
유저 행동 → FastAPI /api/feedback 호출 →

도파민 루프(애니메이션 + 사운드 + 토큰 증감) 활성화 →

사이버 토큰 잔고가 변동되면 즉시 Redux/Redis → UI 업데이트 →

잔고 부족 시 본사 사이트 리디렉션 → 리텐션 고리 완성

<!-- English translation below -->

# Emotion Feedback (English Translation)

3.1. Purpose & Overview
Goal:

To detect emotional states (dopamine secretion pathways) based on user behavior, and

To provide immediate and psychologically stimulating feedback (animations, sounds, cyber token rewards) to maximize

"Behavioral Addiction Triggers (Variable-Ratio Reward + Social Feedback)" and "Dopamine Loops"

Ultimately, to connect the cyber tokens acquired on the headquarters site to consumption within the app, and to redirect to the headquarters when lacking in the app, thereby strengthening retention.

Key Points
Immediate Feedback:

Animation + Sound + Token Reward Package immediately after game results

Combining fun elements (visual and auditory) with **immediate acquisition (or reduction) of cyber tokens** to induce dopamine secretion in users

Behavioral Addiction Triggers:

Variable-Ratio Reward Schedule: Uncertainty of "when will I win" in slots, roulette, gacha, etc.

Social Proof / Leaderboard: Real-time rankings → Stimulate competitiveness

Limited-Time Offer / Flash Event: "Headquarters site login ends in 2 hours → 100 token bonus"

Linkage with Cyber Tokens:

Acquired when using the headquarters site → Stored in Redis as user:{id}:cyber_token_balance

Used in-app games/unlocks → Decrease in token balance

Immediate guidance to the headquarters site when the balance is insufficient (redirection/push notification)

3.2. Emotion Matrix & Feedback Triggers
Action Type	Emotion Trigger	Reward Behavior	Feedback Message & Asset
GAME_WIN	Dopamine Surge	+10~50 사이버 토큰(랜덤) + 화려한 애니메이션	“🎉 대박! {earned_tokens} 토큰 획득! 고스피드 플레이 계속!”
(Confetti 애니메이션 + Victory 사운드)
GAME_FAIL	Frustration Loop	–2 사이버 토큰(작은 패널티) + 격려 애니메이션	“😓 아쉽네요… 하지만 곧 보상을 다시 받을 수 있어요!”
(Sad Shake 애니메이션 + Encourage 사운드)
GAME_RETRY	Determination Boost	–1 사이버 토큰(재도전 비용) + 짧은 “다시 도전” 애니메이션	“🔥 한 번 더? 이번엔 확률이 15% 상승했어요!”
(Flash 애니메이션 + Beat 사운드)
DAILY_INACTIVE (>12h)	Concern	푸시 알림 → 본사 사이트에서 +100 토큰 보상 제안	“⌛ 오랜만이네요! 본사 사이트 로그인만 해도 100토큰 드려요!”
(Ring 톤 + 토큰 이미지 애니메이션)
REWARD_CLAIM	Satisfaction	+ 일정량 사이버 토큰(콘텐츠 언락 보너스)	“👏 보상 획득! {item_name} 언락 완료. 다음 보상까지 {next_threshold}토큰 남음”
(Unlock 애니메이션 + Cheer 사운드)
QUIZ_COMPLETE	Curiosity/Engagement	+200 토큰(본사 사이트 퀴즈) + 리스크 프로필 반영	“🧠 퀴즈 완료! 당신은 {risk_profile}형 플레이어군요. 맞춤 리워드를 추천해드릴게요!”

Note: Each situation is designed as a set of "Animation + Sound + Token Change" packages, directly linked to the user's emotional state (dopamine secretion).

3.3. FastAPI Endpoint Integration
3.3.1. Emotion Feedback Endpoint
python
Copy
Edit
from fastapi import FastAPI, HTTPException, Depends
from .database import get_db, get_redis
from .schemas import FeedbackRequest, FeedbackResponse
from .models import User
from datetime import datetime
import random

app = FastAPI()

# Define Emotion Matrix (including changes in cyber token, emotional message, animation tag, sound tag)
emotion_matrix = {
    "GAME_WIN": {
      "emotion": "happiness",
      "message": "🎉 대박! {earned_tokens} 토큰 획득! 고스피드 플레이 계속!",
      "token_delta": lambda streak: random.randint(10, 50) + min(streak*2, 20),
      "animation": "confetti",
      "sound": "victory.mp3"
    },
    "GAME_FAIL": {
      "emotion": "frustration",
      "message": "😓 아쉽네요… 하지만 곧 보상을 다시 받을 수 있어요!",
      "token_delta": -2,
      "animation": "shake_sad",
      "sound": "encourage.mp3"
    },
    "GAME_RETRY": {
      "emotion": "determination",
      "message": "🔥 한 번 더? 이번엔 확률이 15% 상승했어요!",
      "token_delta": -1,
      "animation": "flash",
      "sound": "beat.mp3"
    },
    "DAILY_INACTIVE": {
      "emotion": "concern",
      "message": "⌛ 오랜만이네요! 본사 사이트 로그인만 해도 100토큰 드려요!",
      "token_delta": 0,  # Actual tokens granted when linked with the headquarters site
      "animation": "token_rain",
      "sound": "ring.mp3"
    },
    "REWARD_CLAIM": {
      "emotion": "satisfaction",
      "message": "👏 보상 획득! {item_name} 언락 완료. 다음 보상까지 {next_threshold}토큰 남음",
      "token_delta": 0,  # Already granted rewards
      "animation": "unlock",
      "sound": "cheer.mp3"
    },
    "QUIZ_COMPLETE": {
      "emotion": "curiosity",
      "message": "🧠 퀴즈 완료! 당신은 {risk_profile}형 플레이어군요. 맞춤 리워드를 추천해드릴게요!",
      "token_delta": 200,
      "animation": "quiz_success",
      "sound": "think.mp3"
    }
}

@app.post("/api/feedback", response_model=FeedbackResponse)
def get_feedback(req: FeedbackRequest, db=Depends(get_db), redis=Depends(get_redis)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    entry = emotion_matrix.get(req.action_type)
    if not entry:
        # Default feedback
        return {"emotion": "neutral", "message": "계속 진행해보세요!", "animation": None, "sound": None, "token_delta": 0}
    
    # Calculate token change
    if callable(entry["token_delta"]):
        # Considering streaks like winning/losing streaks
        streak = int(redis.get(f"user:{req.user_id}:streak_count") or 0)
        token_change = entry["token_delta"](streak)
    else:
        token_change = entry["token_delta"]
    
    # Update token balance
    if token_change != 0:
        redis.incrby(f"user:{req.user_id}:cyber_token_balance", token_change)
    
    # Format message
    formatted_message = entry["message"].format(
        earned_tokens=token_change if token_change > 0 else 0,
        item_name=req.metadata.get("item_name", ""),
        next_threshold=req.metadata.get("next_threshold", "")
    )
    
    # Update last action timestamp
    redis.set(f"user:{req.user_id}:last_action_ts", int(datetime.utcnow().timestamp()))
    
    return {
        "emotion": entry["emotion"],
        "message": formatted_message,
        "animation": entry["animation"],
        "sound": entry["sound"],
        "token_delta": token_change
    }
Example of FeedbackResponse schema:

python
Copy
Edit
from pydantic import BaseModel
from typing import Optional

class FeedbackRequest(BaseModel):
    user_id: int
    action_type: str
    metadata: dict = {}

class FeedbackResponse(BaseModel):
    emotion: str              # happiness, frustration, determination, etc.
    message: str              # Text to be displayed to the user
    animation: Optional[str]  # confetti, shake_sad, etc.
    sound: Optional[str]      # victory.mp3, encourage.mp3, etc.
    token_delta: int          # +/- Changed amount of tokens
Application Flow:

The user completes main actions like slots, roulette, quizzes

The front calls /api/feedback → Executes the above logic

Received animation/sound in response → Immediate playback, token_delta information updates the token UI

3.4. Frontend Integration (React Example)
3.4.1. useEmotionFeedback Hook
jsx
Copy
Edit
import axios from "axios";

export async function fetchEmotionFeedback(userId, actionType, metadata = {}) {
  const response = await axios.post("/api/feedback", {
    user_id: userId,
    action_type: actionType,
    metadata: metadata
  });
  return response.data; // { emotion, message, animation, sound, token_delta }
}
3.4.2. SlotMachine Component Modification Example
jsx
Copy
Edit
import React, { useState, useEffect } from "react";
import { fetchEmotionFeedback } from "../hooks/useEmotionFeedback";
import useSound from "use-sound";
import Confetti from "react-confetti"; // A library that can be used as an example
import { useSelector, useDispatch } from "react-redux";

function SlotMachine({ userId }) {
  const [reels, setReels] = useState([0, 0, 0]);
  const [streakCount, setStreakCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);

  // Subscribe to cyber token balance from Redux or Context
  const balance = useSelector(state => state.user.cyberTokenBalance);
  const dispatch = useDispatch();

  // Prepare sounds
  const [playVictory] = useSound("/sounds/victory.mp3");
  const [playEncourage] = useSound("/sounds/encourage.mp3");

  useEffect(() => {
    // Load initial token balance
    setTokenBalance(balance);
  }, [balance]);

  const spin = async () => {
    // 1) Actual win judgment logic (based on variable-ratio)
    const isWin = Math.random() < (0.10 + Math.min(streakCount * 0.01, 0.30));
    const actionType = isWin ? "GAME_WIN" : "GAME_FAIL";
    const metadata = {}; // Add necessary metadata later

    // 2) Request emotion feedback
    const data = await fetchEmotionFeedback(userId, actionType, metadata);
    setFeedback(data);

    // 3) Animation & Sound
    if (data.animation === "confetti") {
      // Show Confetti animation
      // Example: <Confetti numberOfPieces={200} />
      playVictory();
    } else if (data.animation === "shake_sad") {
      playEncourage();
      // Additional effects like shaking the screen
    }

    // 4) Update Redux token balance
    if (data.token_delta !== 0) {
      dispatch({ type: "UPDATE_TOKEN_BALANCE", payload: data.token_delta });
    }

    // 5) Manage streak
    if (isWin) {
      setStreakCount(prev => prev + 1);
      dispatch({ type: "UPDATE_STREAK", payload: streakCount + 1 });
    } else {
      setStreakCount(0);
      dispatch({ type: "UPDATE_STREAK", payload: 0 });
    }

    // 6) Recombu signal: Preview of the next action (e.g., recommend GAME_RETRY)
    if (!isWin && streakCount >= 2) {
      const retryFeedback = await fetchEmotionFeedback(userId, "GAME_RETRY", {});
      // Show "Try again" toast on the screen
      setFeedback(retryFeedback);
      playEncourage();
      dispatch({ type: "UPDATE_TOKEN_BALANCE", payload: retryFeedback.token_delta });
    }

    // 7) Output reels (random 0~9)
    setReels([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]);
  };

  return (
    <div>
      <h2>Slot Machine</h2>
      <div className="reels">
        {reels.map((num, idx) => (
          <div key={idx} className="reel">{num}</div>
        ))}
      </div>
      <button onClick={spin}>Spin</button>
      {feedback && (
        <div className={`feedback ${feedback.emotion}`}>
          {feedback.message}
        </div>
      )}
      <div>Streak: {streakCount}</div>
      <div>Cyber Token Balance: {tokenBalance}</div>
    </div>
  );
}

export default SlotMachine;
Main Features:

Trigger "Dopamine Surge" with GAME_WIN → Colorful confetti + Token reward

Activate "Frustration → Retry" loop with GAME_FAIL → Induce "Try again" after small token deduction

Globally manage cyber token balance and streak count using Redux/Context

3.5. Integration of Psychometric/Survey Feedback
Call /api/feedback on Quiz Complete → QUIZ_COMPLETE

Feedback message based on risk profile + +200 token reward

Dopamine feedback: Animation "quiz_success" + Sound "think.mp3"

Utilize risk_profile in subsequent personalized recommendations (Recommendation Engine in Document 02)

3.6. Summary
User behavior → FastAPI /api/feedback call →

Activate Dopamine Loop (Animation + Sound + Token Change) →

Immediately update UI via Redux/Redis when cyber token balance changes →

Redirect to headquarters site when balance is insufficient → Complete the retention loop

