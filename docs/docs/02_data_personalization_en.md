# Data Analysis & Personalization System Document

## 2.1. Data Collection Overview
- **Sources of User Data:**
  1. **Mini‐Game Events** (Slot spins, RPS results, Roulette outcomes)  
  2. **Adult Content Unlock Records** (stage unlocked, timestamp)  
  3. **User Actions** (“CLAIM_REWARD”, “VIEW_CONTENT”, “FAIL_GAME” etc.)  
  4. **Psychometric Quiz & Micro Survey Responses** (2–5 question forms per session)  
  5. **Cohort Metrics** (DAU, MAU, churn, cohort survival rates)

- **Real‐Time Data Pipeline:**
  - **FastAPI** writes each user interaction to `user_actions` table, and also publishes to **Kafka topic** (`topic_user_actions`).
  - **Kafka Consumer Service** (analytics microservice) ingests events, aggregates per‐user metrics (e.g., last 7‐day DAU, total spins), writes to **ClickHouse** or **Druid** for OLAP reporting.
  - **Redis** caches “hot” metrics:  
    ```
    user:{id}:streak_count
    user:{id}:daily_play_count
    user:{id}:last_action_ts
    ```

## 2.2. RFM Analysis
- **Recency (R):** Days since last action  
- **Frequency (F):** Number of distinct action events in past 30 days  
- **Monetary (M):** Total amount spent or number of paid actions in past 30 days  

### 2.2.1. RFM Calculation Steps
1. **Query** `user_actions` for each user over the last 30 days.  
2. **Recency:**  
   ```sql
   SELECT DATEDIFF(day, MAX(action_timestamp), CURRENT_DATE) 
   FROM user_actions WHERE user_id = X;
   ```
3. **Frequency:**  
   ```sql
   SELECT COUNT(*) FROM user_actions 
   WHERE user_id = X AND action_timestamp >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);
   ```
4. **Monetary:**  
   ```sql
   SELECT SUM(metadata->>'amount')::INTEGER 
   FROM user_actions 
   WHERE user_id = X AND action_type = 'PURCHASE' 
     AND action_timestamp >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);
   ```

### 2.2.2. Segment Definitions
- **Whale (R=1–2 days, F>=20, M>=50,000₩)** → VIP  
- **Medium (R=3–7 days, F>=5, M>=10,000₩)** → Engaged  
- **Low (R>7 days or F<5)** → At‐risk/churn  

### 2.2.3. Implementation
- **Batch Scheduling** (e.g., nightly):  
  - Run RFM SQL scripts and update `user_segments` table.  
  - If a user “downgrades” from Whale→Medium, send “We miss you” push via Celery.  
  - If user moves to Whale segment, grant “Exclusive VIP Content” immediately.  

## 2.3. Psychometric Quiz & Micro Survey
- **Purpose:** Gather personality and preference data to further personalize UX and reward logic.
- **Implementation Details:**
  1. **Frontend**: Multi‐step React form (2–3 questions per view).  
     - Sample questions:  
       1. “On a scale of 1–5, how much do you enjoy taking risks?”  
       2. “When you lose a game, do you usually…”  
  2. **Backend API** (`POST /api/quiz/submit`):  
     ```python
     @app.post("/api/quiz/submit")
     def submit_quiz(response: QuizResponse):
         # response: { user_id, answers: { q1: 4, q2: 2, … } }
         # Compute risk_profile = f(answers)  # e.g., sum weighted scores
         db.execute(
             "UPDATE user_segments SET risk_profile = %s WHERE user_id = %s",
             (computed_profile, response.user_id),
         )
         return {"status": "ok"}
     ```
  3. **Scoring Logic**:  
     - Risk‐taking questions weighted +1, risk‐averse questions weighted −1.  
     - Final `risk_profile` stored as “High‐Risk”, “Moderate‐Risk”, or “Low‐Risk”  

## 2.4. Personalized Recommendation Engine
- **Inputs:** RFM segment + Psychometric profile + Recent action streak_count  
- **Outputs:** Recommended reward probability, recommended adult‐content stage, best gaming time window  
- **Algorithm Sketch (pseudocode):**
  ```python
  def generate_recommendation(user_id):
      segment = db.query("SELECT rfm_group, risk_profile FROM user_segments WHERE user_id=%s", (user_id,))
      streak = redis.get(f"user:{user_id}:streak_count")

      if segment.rfm_group == "Whale":
          base_prob = 0.15
      elif segment.rfm_group == "Medium":
          base_prob = 0.10
      else:
          base_prob = 0.05

      # Adjust by risk profile
      if segment.risk_profile == "High-Risk":
          base_prob += 0.05
      elif segment.risk_profile == "Low-Risk":
          base_prob -= 0.02

      # Further adjust by current streak
      bonus = min(int(streak) * 0.01, 0.30)
      actual_prob = base_prob + bonus

      # Recommend time window: analyze “peak usage hours” from historical data
      # (e.g., if user most active 8–10pm, set recommended_time_window = {20:00–22:00})
      peak_hour = find_user_peak_hour(user_id)

      return {
          "recommended_reward_probability": actual_prob,
          "recommended_time_window": peak_hour
      }
  ```
