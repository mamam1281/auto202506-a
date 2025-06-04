# UX/UI Design Document

## 11.1. User Flow
1. **Login/Signup**  
2. **Main Dashboard**  
   - Slot Machine → Play Now button  
   - Rock‐Paper‐Scissors → Choose friend match or AI match  
   - Roulette → Play Now button  
   - Psychometric Quiz/Survey → Prompt to participate  
3. **Game Play UI**  
   - Slot: 3 reels, Spin button, display (coins, streak)  
   - RPS: 3 buttons (Rock, Paper, Scissors), AI animations  
   - Roulette: Spinning animation, highlight winning segment  
4. **Result & Reward Screen**  
   - Win/Loss → show multimedia feedback (confetti/sad animation + sound)  
   - Reward popup (coins, content unlock)  
5. **Emotion Feedback UI**  
   - Text bubble + AI character facial change in top‐right corner  
   - Win → “Haha!” / Loss → “Oh no…”  
6. **Adult Content Viewer**  
   - Progressive reveal: blurred thumbnail → partial reveal → full reveal  
   - Tap to enlarge modal  
7. **Notifications & Popups**  
   - Real‐time push (web push or email)  
   - “Today's Challenge” modal, weekly challenge banner, reminder banner

## 11.2. Wireframes & Screen Designs
- See `/docs/ui_ux_mockup.png` for design reference  
- **Responsive Grid Layout:**
  - Desktop: 3‐column layout (Game list, main content, sidebar)
  - Mobile: Single‐column scroll layout

## 11.3. Design System
- **Color Palette**  
  - Primary: #4f46e5 (Purple)  
  - Secondary: #f59e0b (Orange)  
  - Success: #16a34a (Green), Danger: #dc2626 (Red)  
  - Background: #f9fafb (Light Gray), Text: #1f2937 (Dark Gray)
- **Typography**  
  - Headings: “Inter, 700, 1.5rem, letter‐spacing: -0.5px”  
  - Body: “Inter, 400, 1rem, line‐height: 1.6”
- **Icons**  
  - lucide‐react library  
  - Game‐specific icons: 🍒, 🔔, 🎰 etc.

## 11.4. Animations & Sound
- **Animation Library:** Framer Motion  
- **Examples:**  
  - Win: `confetti` + button glow  
  - Loss: Screen shake + gray tone filter  
- **Sound Effects:**  
  - Win: `victory.mp3`  
  - Loss: `failure.mp3`  
  - Reward: `reward.mp3`
