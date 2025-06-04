#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Parse DATABASE_URL ---
# Expected format: postgresql://user:password@host:port/dbname
# This parsing is more specific and robust than basic sed but still has limitations
# with extremely complex passwords or URL parameters not typically used in PG connection strings.

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set."
  exit 1
fi

# Remove protocol prefix 'postgresql://'
DB_URL_NO_PROTO=$(echo "$DATABASE_URL" | sed -e 's_^[a-zA-Z]*://__')

# Extract user and password (everything before '@')
USER_PASS_PART=$(echo "$DB_URL_NO_PROTO" | cut -d'@' -f1)
# Extract host, port, dbname (everything after '@')
HOST_PORT_DB_PART=$(echo "$DB_URL_NO_PROTO" | cut -d'@' -f2)

POSTGRES_USER=$(echo "$USER_PASS_PART" | cut -d':' -f1)
POSTGRES_PASSWORD=$(echo "$USER_PASS_PART" | cut -d':' -f2) # This will be USER if no password

# If POSTGRES_PASSWORD is the same as POSTGRES_USER, it means no password was in the user:pass@ part
if [ "$POSTGRES_PASSWORD" = "$POSTGRES_USER" ]; then
    # This can happen if DATABASE_URL is like postgresql://user@host... (no password)
    # Or if only user is present: postgresql://user:xxxx (this case is fine)
    # Check if ':' was even present in USER_PASS_PART
    if ! echo "$USER_PASS_PART" | grep -q ':'; then
        POSTGRES_PASSWORD="" # No password was supplied this way
    fi
fi


POSTGRES_HOST=$(echo "$HOST_PORT_DB_PART" | cut -d':' -f1 | cut -d'/' -f1)
# Port is between ':' and '/'
TEMP_PORT_DB=$(echo "$HOST_PORT_DB_PART" | cut -d':' -f2)
POSTGRES_PORT=$(echo "$TEMP_PORT_DB" | cut -d'/' -f1)
# DB is after '/'
POSTGRES_DB=$(echo "$HOST_PORT_DB_PART" | cut -d'/' -f2 | cut -d'?' -f1) # Also remove query params from dbname

# Set default port if not parsed or invalid
if ! echo "$POSTGRES_PORT" | grep -Eq '^[0-9]+$'; then
  POSTGRES_PORT="5432"
fi

echo "Parsed DB Parameters:"
echo "  User: $POSTGRES_USER"
# echo "  Password: [REDACTED]" # Avoid echoing password
echo "  Host: $POSTGRES_HOST"
echo "  Port: $POSTGRES_PORT"
echo "  DB Name: $POSTGRES_DB"

if [ -z "$POSTGRES_HOST" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ]; then
  echo "Error: Could not correctly parse critical database connection parameters from DATABASE_URL."
  echo "DATABASE_URL: $DATABASE_URL"
  echo "Parsed: HOST=$POSTGRES_HOST, PORT=$POSTGRES_PORT, USER=$POSTGRES_USER, DBNAME=$POSTGRES_DB"
  echo "Please ensure DATABASE_URL is in the format: postgresql://user:password@host:port/dbname"
  exit 1
fi

# --- Wait for Database ---
# Use PGPASSWORD environment variable for pg_isready if password is set
if [ ! -z "$POSTGRES_PASSWORD" ]; then
  export PGPASSWORD="$POSTGRES_PASSWORD"
fi

echo "Waiting for database at $POSTGRES_HOST:$POSTGRES_PORT (DB: $POSTGRES_DB, User: $POSTGRES_USER) to become available..."

RETRY_COUNT=0
MAX_RETRIES=20 # Number of retries
RETRY_INTERVAL=3 # Seconds between retries

# Loop until pg_isready returns success (exit code 0)
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Error: Database at $POSTGRES_HOST:$POSTGRES_PORT did not become available after $MAX_RETRIES attempts."
    if [ ! -z "$PGPASSWORD" ]; then unset PGPASSWORD; fi # Clean up env var
    exit 1
  fi
  echo "Database not yet available. Retrying in $RETRY_INTERVAL seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

if [ ! -z "$PGPASSWORD" ]; then
  unset PGPASSWORD # Clear the password from environment after use
fi

echo "Database is ready!"

# --- Run Database Migrations ---
echo "Running database migrations (alembic upgrade head)..."
alembic upgrade head
echo "Database migrations complete."

# --- Start Application ---
echo "Starting Uvicorn server on 0.0.0.0:8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
