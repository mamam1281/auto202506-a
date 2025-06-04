# Onboarding Guide & Documentation

## 10.1. Project Introduction
- **Project Name:** CC
- **Goal:** Build an addictive webapp combining adult content unlocking, emotion feedback, and gamification.

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
