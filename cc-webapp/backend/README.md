# CC Webapp - Backend

This directory contains the FastAPI backend for the CC Webapp.

## Running the Application

1.  Ensure Python 3.10+ is installed.
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables:
    *   Copy `.env.example` to `.env`.
    *   Update variables in `.env` for your PostgreSQL database, Redis, and Kafka broker.
5.  Apply database migrations:
    ```bash
    alembic upgrade head
    ```
6.  Run the FastAPI development server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
The API will be available at `http://localhost:8000`.

## Key Features & Integrations

### 1. Kafka Integration for User Actions
-   All user actions submitted via the `POST /api/actions` endpoint are published as JSON messages to the Kafka topic `topic_user_actions`.
-   The message payload includes `{ user_id, action_type, action_timestamp }`.
-   A consumer script is available at `scripts/kafka_consumer.py` which can be run to observe these messages in real-time:
    ```bash
    python scripts/kafka_consumer.py
    ```
-   This integration requires a Kafka broker running and accessible via the `KAFKA_BROKER` environment variable (e.g., `localhost:9092`).

### 2. RFM Batch Job & User Segmentation
-   A daily batch job, `compute_rfm_and_update_segments` (located in `app/utils/segment_utils.py`), calculates Recency, Frequency, and Monetary (RFM) scores for users based on their actions in the last 30 days.
-   This job assigns users to RFM groups (e.g., "Whale", "Medium", "Low") and updates the `rfm_group` and `last_updated` fields in the `user_segments` table.
-   The job is scheduled using APScheduler (`app/apscheduler_jobs.py`) to run:
    -   Daily at 2:00 AM UTC.
    -   Once shortly after application startup for immediate processing in development/testing.
-   The logic for RFM calculation and group assignment should be detailed in the project's technical documentation (`02_data_personalization_en.md`).

### 3. Corporate Site Retention Integration
-   The `POST /api/notify/site_visit` endpoint is used to log instances where a user navigates from the webapp to an external corporate site.
-   It accepts a payload like `{ "user_id": 123, "source": "webapp_button" }`.
-   Logged visits are stored in the `site_visits` table, capturing `user_id`, `source`, and `visit_timestamp`.

### 4. Personalized Recommendation Endpoint
-   The `GET /api/user-segments/{user_id}/recommendation` endpoint provides personalized recommendations for users.
-   It considers the user's:
    -   `rfm_group` (from the `user_segments` table).
    -   `risk_profile` (from the `user_segments` table).
    -   Current `streak_count` (fetched from a Redis key like `user:{user_id}:streak_count`).
-   The endpoint returns a JSON object containing `recommended_reward_probability` and `recommended_time_window`, calculated based on logic outlined in the project's technical documentation (`02_data_personalization_en.md`).
-   Requires Redis to be running and accessible via the `REDIS_URL` environment variable.

## Testing
Unit tests are located in the `tests/` directory and can be run using pytest:
```bash
# Ensure you are in the cc-webapp/backend directory or set PYTHONPATH appropriately
# Example from cc-webapp directory:
# PYTHONPATH=. pytest backend/tests/
# Or from cc-webapp/backend directory:
pytest
```
