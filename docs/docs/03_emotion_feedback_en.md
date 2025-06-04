# Emotion Analysis & Feedback System Document

## 3.1. Purpose & Overview
- **Goal:** Detect user’s emotional state from their actions, then provide real‐time, personalized feedback that reinforces engagement.
- **Key Use Cases:**
  1. **Game Success** → “happiness” → “Congrats! You’re on fire! Keep going!”
  2. **Game Failure** → “frustration” → “Don’t give up! Try again!”
  3. **Daily Inactivity (>12 hours)** → “concern” → “We miss you! Come back for new rewards.”

## 3.2. Emotion Matrix Definition
A simple lookup table mapping `action_type` → `{ emotion, message }`.

| Action Type      | Emotion       | Feedback Message                                    |
|------------------|---------------|------------------------------------------------------|
| GAME_WIN         | happiness     | “Amazing! You did it! Next level awaits.”            |
| GAME_FAIL        | frustration   | “Don’t worry! You can beat it next time.”            |
| GAME_RETRY       | determination | “You’ve got this! Give it one more shot.”            |
| DAILY_INACTIVE   | concern       | “It’s been a while! Come back and claim your rewards.” |
| REWARD_CLAIM     | satisfaction  | “Enjoy your reward! Keep the streak alive.”          |
| PSYCHO_QUIZ_FAIL | confusion     | “Need help? Try again or ask for a hint.”            |

### 3.2.1. Storage
- **In‐Memory Python Dict (FastAPI)**
  ```python
  emotion_matrix = {
      "GAME_WIN":      {"emotion": "happiness",    "message": "Amazing! You did it! Next level awaits."},
      "GAME_FAIL":     {"emotion": "frustration",  "message": "Don’t worry! You can beat it next time."},
      "GAME_RETRY":    {"emotion": "determination","message": "You’ve got this! Give it one more shot."},
      "DAILY_INACTIVE":{"emotion": "concern",      "message": "It’s been a while! Come back and claim your rewards."},
      "REWARD_CLAIM":  {"emotion": "satisfaction", "message": "Enjoy your reward! Keep the streak alive."},
      "PSYCHO_QUIZ_FAIL":{"emotion":"confusion",   "message": "Need help? Try again or ask for a hint."},
  }
  ```

### 3.2.2. FastAPI Endpoint
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class FeedbackRequest(BaseModel):
    user_id: int
    action_type: str

@app.post("/api/feedback")
def get_feedback(req: FeedbackRequest):
    entry = emotion_matrix.get(req.action_type)
    if not entry:
        return {"emotion": "neutral", "message": "Keep going!"}
    return {"emotion": entry["emotion"], "message": entry["message"]}
```

## 3.3. Frontend Integration
- **React Hook:** `useEmotionFeedback.js`
  ```js
  import axios from "axios";

  export async function fetchEmotionFeedback(userId, actionType) {
    const response = await axios.post("/api/feedback", {
      user_id: userId,
      action_type: actionType
    });
    return response.data; // { emotion, message }
  }
  ```
- **Usage Example (in SlotMachine.jsx):**
  ```jsx
  import React, { useState } from "react";
  import { fetchEmotionFeedback } from "./useEmotionFeedback";

  function SlotMachine({ userId }) {
    const [feedback, setFeedback] = useState({ emotion: "", message: "" });

    async function handleSpinResult(isWin) {
      const action = isWin ? "GAME_WIN" : "GAME_FAIL";
      const data = await fetchEmotionFeedback(userId, action);
      setFeedback(data);
      // show animation based on data.emotion
    }

    return (
      <div>
        {/* Slot UI */}
        <button onClick={() => handleSpinResult(Math.random() < 0.2)}>Spin</button>
        <div className={`feedback ${feedback.emotion}`}>
          {feedback.message}
        </div>
      </div>
    );
  }

  export default SlotMachine;
  ```

## 3.4. Psychometric/Survey Feedback
- **On Quiz Failures:**
  - Endpoint: `POST /api/quiz/submit` returns `{ success: bool, message: string }`.
  - If submission invalid → emotion “confusion”, message “Need help? Try again.”
