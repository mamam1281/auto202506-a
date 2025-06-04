# cc-webapp/backend/Dockerfile
FROM python:3.9-slim

# Set environment variables for consistent behavior
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies that might be needed by some Python packages (e.g., psycopg2)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libpq-dev \
#  && rm -rf /var/lib/apt/lists/*
# For psycopg2-binary (used in requirements.txt), pre-built binaries are used,
# so libpq-dev might not be strictly needed unless building from source.
# Keeping it simple for now; add if build fails for specific packages.

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
# Upgrade pip and install requirements
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code
# Ensure paths are relative to the Dockerfile's location (cc-webapp/backend/)
COPY ./app ./app
COPY alembic.ini ./alembic.ini
COPY ./alembic ./alembic
# If .env.example is intended to be packaged (e.g., for reference), copy it.
# COPY .env.example .env.example
# Do NOT copy .env files containing secrets into Docker images.

# Set default environment variables (can be overridden by docker-compose or run command)
# These are crucial for alembic upgrade head if env.py reads from them.
ENV DATABASE_URL="postgresql://user:password@db:5432/cc_db"
ENV REDIS_URL="redis://redis:6379/0"
ENV KAFKA_BROKER="kafka:9092" # Or kafka1:9092 if using common multi-broker setup names
ENV JWT_SECRET="your_default_entwicklung_secret_key_do_not_use_in_prod_change_this"
# Note: For alembic.ini to use DATABASE_URL from env for sqlalchemy.url,
# app/alembic/env.py was configured in Subtask 2 to load DATABASE_URL from the environment
# and set config.set_main_option("sqlalchemy.url", db_url).

# Run database migrations during the build process
# This ensures the database schema is up-to-date when the container starts.
# Pros: Image is self-contained and ready.
# Cons:
#   1. Image needs rebuilding if only migrations change.
#   2. DB must be accessible at build time if not using a dummy URL or if Alembic cannot generate offline.
#      The default DATABASE_URL above points to a hostname 'db', which will not resolve during `docker build`
#      unless the build environment has specific network configurations (e.g., Docker BuildKit with network access,
#      or building within a Compose setup that defines 'db').
#
# Alternative (often preferred for production): Run migrations as an entrypoint script or init container in Compose/Kubernetes.
# This allows the same image to be used across environments and separates build from deployment concerns.
#
# For this spec, "RUN alembic upgrade head" is requested in Dockerfile.
# This implies a potential need to handle DB connectivity during build or ensure Alembic can run offline if needed.
# If this step fails during `docker build`, it's likely due to the DB not being reachable.
# A common workaround for build-time migrations is to pass a build-time accessible DATABASE_URL ARG
# or ensure the build system can reach the 'db' host (e.g. building with compose `docker-compose build backend`).
RUN echo "Attempting to run Alembic migrations (alembic upgrade head)." && \
    echo "INFO: This step requires the database to be accessible if Alembic is configured to connect." && \
    echo "INFO: Current DATABASE_URL for build is $DATABASE_URL" && \
    # RUN alembic upgrade head # <<< THIS LINE IS NOW REMOVED. Migrations moved to entrypoint.sh

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# Set the entrypoint to the script.
# The entrypoint.sh script will be responsible for running migrations and then starting the app.
ENTRYPOINT ["/app/entrypoint.sh"]

# CMD can be removed or left as is if entrypoint.sh uses 'exec "$@"'.
# Since our entrypoint.sh directly execs uvicorn, this CMD is effectively ignored.
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
