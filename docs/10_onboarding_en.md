# Onboarding Guide & Documentation

## 10.1. Project Introduction
- **Project Name:** CC
- **Goal:** Build an addictive webapp combining adult content unlocking, emotion feedback, and gamification.
- **Target Audience:** Men aged 20-50
- **Design Priority:** EXTREMELY HIGH - Premium, professional, and visually appealing design is CRITICAL

## 10.2. Initial Setup
1. **Clone Repository**
   ```bash
   git clone https://github.com/your_org/cc_project.git
   cd cc_project
   ```
2. **Backend Dependencies**
   ```bash
   cd cc-webapp/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. **Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```
4. **Environment Variables** (`.env`)
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/cc_db
   REDIS_URL=redis://localhost:6379/0
   KAFKA_BROKER=localhost:9092
   JWT_SECRET=your_jwt_secret_key
   ```

## 10.3. Running the Applications
1. **Start Backend (FastAPI)**
   ```bash
   cd cc-webapp/backend
   alembic upgrade head   # DB migrations
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. **Start Frontend (Next.js)**
   ```bash
   cd cc-webapp/frontend
   npm run dev
   ```
3. **Run Celery Worker**
   ```bash
   cd cc-webapp/backend
   celery -A celery_worker worker --loglevel=info
   ```
4. **(Optional) Kafka Consumer**
   ```bash
   cd cc-webapp/backend
   python scripts/kafka_consumer.py
   ```

## 10.4. Development Conventions
- **Git Commit Message Format:**
  ```
  feat(cc): Implement user action logging (POST /api/actions)
  fix(cc): Fix reward probability calculation bug
  docs(cc): Add /api/users/{user_id}/rewards to OpenAPI spec
  ```
- **Branch Strategy:**
  - `main`: Production releases
  - `develop`: Development integration
  - `feature/`: Feature branches
  - `hotfix/`: Urgent fixes

## 10.5. Key References
- **ERD Diagram:** `/docs/erd.png`
- **Sequence Diagram:** `/docs/sequence_addiction_flow.png`
- **UI/UX Mockup:** `/docs/ui_ux_mockup.png`
- **API Spec:** Swagger UI (`/docs`), `/docs/openapi.yaml`

## 10.6. Additional Resources
- **Test Cases:** `/docs/test_cases.md`
- **Deployment & Installation:** `/docs/deployment_installation.md`
- **Maintenance Guide:** `/docs/maintenance_guide.md`
- **Security & Auth:** `/docs/security_authentication_en.md`
- **Game Dev Checklist (Korean):** `/docs/game_dev_full_checklist_ko.md`

## 10.7. Current Progress Status (codex/작성-게임-개발-체크리스트-문서 Branch)

### ✅ Completed Items
- [x] Project structure setup (backend/frontend directories)
- [x] Basic documentation framework
- [x] ERD design and database schema
- [x] API specification (OpenAPI/Swagger)
- [x] Security and authentication documentation
- [x] Game development checklist (Korean)
- [x] Test cases documentation
- [x] Deployment and installation guide

### 🚧 In Progress / Missing
- [ ] **UI/UX mockup creation** (CRITICAL - MISSING)
- [ ] Frontend implementation based on mockups/wireframes
- [ ] Full feature implementation matching technical specifications
- [ ] Integration testing between frontend and backend
- [ ] Performance optimization

### 📋 Next Priority Tasks
1. **UI/UX Mockup Design**: Create comprehensive wireframes and mockups for all screens
2. **Frontend Implementation**: Complete React/Next.js components based on created mockups
3. **Feature Completion**: Implement all gamification features (rewards, levels, achievements)
4. **Content Management**: Build adult content unlocking system
5. **Emotion Feedback**: Implement user interaction tracking and feedback loops
6. **Testing & QA**: Comprehensive testing of all features

## 10.8. External AI Prompt Template

**For continuing work on `codex/작성-게임-개발-체크리스트-문서` branch:**

```
You are working on the CC project (addictive webapp with adult content, gamification, and emotion feedback). 

Current branch: codex/작성-게임-개발-체크리스트-문서

FIRST STEP: READ AND REVIEW ALL PROJECT DOCUMENTATION
Before starting any work, you must read and understand these key documents:
1. /docs/10_onboarding_en.md (THIS FILE - contains all project requirements)
2. /docs/openapi.yaml (API specifications)
3. /docs/security_authentication_en.md (Security requirements)
4. /docs/game_dev_full_checklist_ko.md (Game development checklist)
5. /docs/erd.png (Database schema)
6. /docs/sequence_addiction_flow.png (System flow)

TARGET AUDIENCE: Men aged 20-50
DESIGN PRIORITY: EXTREMELY HIGH - This is CRITICAL. The design must be premium, professional, visually stunning, and highly appealing to the target demographic.

CRITICAL MISSING COMPONENT: UI/UX mockups and wireframes need to be created first.

PRIORITY SEQUENCE:
1. **READ ALL DOCUMENTATION FIRST** (especially this onboarding guide)
2. Create comprehensive UI/UX mockups/wireframes for all screens
3. Implement complete frontend based on those mockups
4. Ensure all features are fully functional

Requirements for Mockup Creation (DESIGN IS CRITICAL):
1. **Design Quality**: Premium, modern, sleek design that appeals to men aged 20-50
2. **Color Scheme**: Dark/sophisticated themes, masculine appeal, professional look
3. **Typography**: Clean, modern fonts that convey quality and sophistication
4. **Visual Hierarchy**: Clear, intuitive navigation and content organization
5. **Main Screens**: login, dashboard, content gallery, user profile, rewards system
6. **Gamification Elements**: Attractive progress bars, achievement badges, level indicators
7. **Content Unlocking**: Sophisticated mechanisms and adult content viewing interfaces
8. **Emotion Feedback**: Modern UI components (reactions, ratings, comments)
9. **Mobile-Responsive**: Flawless design across all devices
10. **Addictive Design**: Use psychological design principles to maximize engagement
11. **Professional Standards**: Must look like a premium, paid application

Requirements for Frontend Implementation:
1. Follow the API specifications in /docs/openapi.yaml
2. Ensure compatibility with backend FastAPI services
3. Maintain security standards from /docs/security_authentication_en.md
4. Include all gamification features: user levels, rewards, achievements
5. Implement content unlocking mechanisms
6. Add emotion feedback and user interaction tracking
7. **MATCH MOCKUPS EXACTLY** - Design implementation must be pixel-perfect

Tech Stack:
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, PostgreSQL, Redis, Kafka
- Authentication: JWT tokens
- Design: Focus on premium UI libraries (Framer Motion, Headless UI, etc.)

Focus on: FIRST READ ALL DOCS, then CREATE PREMIUM UI/UX MOCKUPS (targeting men 20-50), then implement frontend components

Deliverables: 
1. Documentation review summary
2. High-quality mockup files (PNG/Figma/etc.) with professional design standards
3. Working frontend code that matches the mockups exactly with premium design quality

IMPORTANT: Start by confirming you have read and understood all the documentation, especially the project requirements in this onboarding guide.
```
