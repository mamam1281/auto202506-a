# Overall System Design Document (Architecture)

## 1.1. Project Overview
- **Project Name:** CC
- **Goal:** Build a highly addictive, emotion-driven web application that blends adult‐content unlocking, mini‐games, and real‐time emotion feedback to maximize user immersion and retention.
- **Primary Objectives:**
  1. **Behavioral Addiction Triggering:** Use variable‐ratio reward schedules, multisensory feedback (sounds, animations), and randomization to keep users engaged.
  2. **Emotion Formation & Feedback:** Analyze user actions in real time and provide tailored emotional responses (e.g., encouragement on failure, celebration on success).
  3. **Relationship Immersion UX:** Cultivate a sense of personal connection via a persona (“AI Character”) that evolves with user progress.
  4. **Adult Content Unlocking:** Gradually unlock adult‐themed assets (images/videos) as rewards tied to user achievements.
  5. **Data‐Driven Personalization:** Segment users via RFM + psychometric quizzes and dynamically adjust difficulty, rewards, and content.

## 1.2. High‐Level Architecture Diagram
\`\`\`
+-------------------------------------------+
|                Frontend                   |
|   (React.js + HTML5/CSS3 + JavaScript)    |
|   • Mini‐games (Slot, RPS, Roulette)      |
|   • Emotion feedback UI (animations + dlg)|
|   • Adult‐content viewer & unlocking view |
|   • Psychometric quiz / micro‐surveys     |
|   • Notification banner / Pop‐ups         |
+-------------------------------------------+
                 ↓ (HTTP/WS)
+-------------------------------------------+
|                Backend                    |
|      (FastAPI + Python)                   |
|   • Auth & JWT (login/logout)             |
|   • API endpoints for:                    |
|     – /api/actions        (track action)  |
|     – /api/rewards        (fetch rewards) |
|     – /api/feedback       (emotion logic) |
|     – /api/unlock         (adult‐content) |
|     – /api/user‐segments   (personalization) |
|     – /api/notification    (push events)  |
|   • Redis (streak_count, last_action_ts)  |
|   • Kafka (real‐time event streaming)     |
|   • Celery/APS scheduler (reminders, push)|
+-------------------------------------------+
                 ↓ (SQLAlchemy ORM)
+-------------------------------------------+
|             PostgreSQL / Redis             |
|   Tables:                                   |
|   • users                                  |
|   • user_actions                           |
|   • user_rewards                           |
|   • user_segments (RFM & psychometrics)    |
|   • adult_content (metadata + stage)       |
|   • cohort_survivors (D1/D7/D14/D30)        |
|   • notifications (queued messages)        |
+-------------------------------------------+
\`\`\`

## 1.3. Component Breakdown

### 1.3.1. Frontend (React.js)
- **Mini‐Games Collection**
  - **SlotMachineComponent**
  - **RPSGameComponent (Rock‐Paper‐Scissors)**
  - **RouletteComponent (Random Pinball)**
  - Each subcomponent integrates:
    1. **Variable‐ratio reward logic** (imported from \`rewardUtils.js\`)
    2. **Sound assets** (victory.mp3, failure.mp3)
    3. **Animation assets** (e.g., confetti, sad face, rewards pop‐up)

- **Emotion Feedback UI**
  - Fetches from \`/api/feedback\` after each user action
  - Displays animation + text bubble + optional “AI Character” face change

- **Adult‐Content Viewer**
  - Protected route: \`/adult‐content/:stage\`
  - Displays unlocked images/videos based on user’s current “unlock stage”

- **Psychometric Quiz & Micro‐Survey**
  - Multi‐step quiz component to collect “risk‐taking” vs. “risk‐averse” user profiles
  - Minimalist UI (2–3 questions per screen, quick taps)

- **Notifications & Pop‐Ups**
  - Real‐time banners that say e.g. “Hey [Username], your VIP video is unlocked — come watch!”
  - Connects to WebSocket / Server‐Sent Events for push updates

- **UI/UX Common**
  - Responsive design: desktop + mobile
  - Tailwind CSS for consistent styling
  - Component library (shadcn/ui, lucide‐react icons)
  - Accessibility: ARIA roles, keyboard navigation

### 1.3.2. Backend (FastAPI)
- **Authentication & Authorization**
  - JWT‐based login / refresh token
  - OAuth2.0 (optional Google/Facebook login)

- **API Modules**
  1. **User Module (\`/api/users\`)**
     - GET \`/api/users/{id}\` (profile + segment data)
     - POST \`/api/users/login\` / \`/refresh\`
  2. **Action Module (\`/api/actions\`)**
     - POST: record user action { user_id, action_type, metadata }
       • Writes to \`user_actions\` table
       • Updates Redis keys:
         \`\`\`
         user:{id}:streak_count
         user:{id}:last_action_ts
         \`\`\`
       • Triggers potential reward logic
  3. **Reward Module (\`/api/users/{id}/rewards\`)**
     - GET: Returns paginated reward history
  4. **Emotion Feedback Module (\`/api/feedback\`)**
     - POST: { user_id, action_type } → returns { emotion, message }
     - Uses in‐memory \`emotionMatrix = { “GAME_WIN”: {…}, … }\`
  5. **Adult Content Module (\`/api/unlock\`)**
     - GET: fetch next stage of adult content based on user’s segment and achievements
  6. **Segmentation & Personalization (\`/api/user‐segments\`)**
     - Runs RFM + psychometric logic
     - Returns recommended reward probabilities, time windows
  7. **Notification Module (\`/api/notification\`)**
     - POST: schedule push/email via Celery/APSscheduler

- **Real‐Time Data Processing**
  - **Redis**:
    - \`user:{id}:streak_count\` (integer)
    - \`user:{id}:last_action_ts\` (timestamp)
    - \`user:{id}:daily_reward_count\`
  - **Kafka Consumer**:
    - Streams \`user_actions\` events to analytics service (e.g., ClickHouse)
  - **Celery / APSscheduler**:
    - Cron job: every hour → check Redis \`last_action_ts\` → if > 12h → enqueue “reminder DM”
    - Daily job: cohort D1/D7/D14/D30 retention calculation

### 1.3.3. Database (PostgreSQL)
- **users**
  - \`user_id\` (PK), \`email\`, \`password_hash\`, \`signup_date\`, \`last_login\`, \`segment_id\`
- **user_actions**
  - \`action_id\` (PK), \`user_id\` (FK), \`action_type\`, \`action_timestamp\`, \`metadata\` (JSONB)
- **user_rewards**
  - \`reward_id\` (PK), \`user_id\` (FK), \`reward_type\`, \`reward_value\`, \`
