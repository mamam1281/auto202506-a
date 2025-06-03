# Corporate Site Retention System Document

## 5.1. Objective
- **Purpose:** Increase retention and cross‐engagement between the CC webapp and the corporate “home site” (HQ site). Every action in the webapp should funnel visits back to HQ site, and vice versa.
- **Key Metrics:**  
  - **Webapp → Site Conversion Rate**  
  - **Site → Webapp Re‐Engagement Rate**  
  - **Time Spent on Site**  
  - **Cross‐Platform Revenue Lift**

## 5.2. Integration Workflow

### 5.2.1. Webapp → Corporate Site
1. **Trigger:** User completes a milestone in webapp (e.g., unlocks stage 2 adult content, levels up, or wins VIP reward).
2. **Prompt UI:** Show modal/banner:  
   ```
   Congratulations! You just unlocked Premium Content. Visit our Corporate Site to access exclusive deals and more!
   [Visit HQ Site]
   ```
3. **Deep Link:**  
   - URL: `https://corporate‐site.com/welcome?userId={user_id}&rewardCode={code}`
   - Backend logs:  
     ```sql
     INSERT INTO site_visits (user_id, source, timestamp) VALUES (?, 'webapp', NOW());
     ```
4. **Corporate Site Landing:**  
   - If `rewardCode` valid, show “Exclusive 10% discount” coupon → store in `site_rewards` table.

### 5.2.2. Corporate Site → Webapp
1. **Trigger:** User logs into HQ site and visits a specific page (e.g., “Adult Gallery Previews”).
2. **Action:** Show a “Play Now in CC App” button:  
   ```
   People who enjoyed our VIP Gallery also love our CC Webapp. Click here to try CC’s new Slot Machine and unlock more content!
   [Play CC App]
   ```
3. **Deep Link:**  
   - URL: `https://cc‐app.com/loginRedirect?userId={user_id}&campaign=sitePromo`
   - Upon redirect, backend records:  
     ```sql
     INSERT INTO user_actions (user_id, action_type, metadata, action_timestamp)
     VALUES (?, 'SITE_TO_WEBAPP', '{ "campaign": "sitePromo" }', NOW());
     ```

## 5.3. Reward Mechanism
- **Visit Rewards:**  
  - If user visits HQ site via webapp link, automatically grant 50 coins in CC app.  
  - Insert into `user_rewards`:  
    ```sql
    INSERT INTO user_rewards (user_id, reward_type, reward_value, awarded_at, trigger_action_id)
    VALUES (?, 'COIN', 50, NOW(), NULL);
    ```
- **Site Activity Rewards:**  
  - If user makes a purchase on HQ site (≥20,000₩), grant “Stage 2 adult content unlock” in CC app.  
  - Push notification via WebSocket:  
    ```
    New Reward Unlocked! You’ve earned Stage 2 Adult Content for spending 20,000₩ on our HQ site. Click here to view.
    ```

## 5.4. Analytics & Retention Tracking
- **Tables Involved:**  
  - `site_visits (visit_id, user_id, source, timestamp)`  
  - `site_rewards (reward_id, user_id, reward_type, reward_value, issued_at)`  
  - `user_actions` (tracks cross‐platform actions)  
- **Scheduled Jobs (Celery/APS):**  
  - Daily: aggregate cross‐platform conversion rates, write to analytics DB.  
  - Weekly: identify “visited site but didn’t return to app” segment → send re‐engagement email.
