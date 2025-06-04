#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# It's good practice to wait for the database to be ready before running migrations.
# The DATABASE_URL env var should be available here (e.g., postgresql://user:password@db:5432/cc_db)

# Extract host and port from DATABASE_URL for waiting logic
# Example: DATABASE_URL="postgresql://user:password@db_host:5432/db_name"
# This parsing is basic and assumes a certain URL structure.
# It might not correctly parse all valid PostgreSQL connection strings.
DB_CONN_STRING_NO_PREFIX=$(echo $DATABASE_URL | sed 's_^[a-zA-Z]*://__')
DB_USER_PASS=$(echo $DB_CONN_STRING_NO_PREFIX | sed 's_@.*__')
DB_HOST_PORT_DB=$(echo $DB_CONN_STRING_NO_PREFIX | sed 's_.*@__')

DB_HOST=$(echo $DB_HOST_PORT_DB | sed -n 's_\(.*\):[0-9]*/.*_\1_p')
DB_PORT=$(echo $DB_HOST_PORT_DB | sed -n 's_.*:\([0-9]*\)/.*_\1_p')

# Fallback if parsing above fails (e.g. if no port or no user/pass in URL)
if [ -z "$DB_HOST" ]; then
    DB_HOST=$(echo $DB_HOST_PORT_DB | sed -n 's_\(.*\)/.*_\1_p' | sed 's_:[0-9]*$__') # Host without port
fi
if [ -z "$DB_PORT" ]; then
    # Attempt to get port if host was parsed without it, or default
    TEMP_PORT=$(echo $DB_HOST_PORT_DB | sed -n 's_.*:\([0-9]*\)_ \1_p' | sed 's_.* __')
    if [ -n "$TEMP_PORT" ] && echo "$TEMP_PORT" | grep -Eq '^[0-9]+$'; then
        DB_PORT=$TEMP_PORT
    else
        DB_PORT="5432" # Default PostgreSQL port if not found
    fi
fi


if [ -z "$DB_HOST" ]; then
  echo "Warning: Could not robustly parse DB_HOST from DATABASE_URL ('$DATABASE_URL')."
  echo "Proceeding with migrations after a fixed delay, but DB readiness check is skipped."
  echo "Consider installing netcat and using a more robust wait loop if issues arise."
  echo "Sleeping for 15 seconds to allow DB to initialize..."
  sleep 15
else
  echo "Waiting for database at $DB_HOST:$DB_PORT to be ready..."
  # A more robust script would be wait-for-it.sh or pg_isready in a loop.
  # These require netcat or postgresql-client to be installed in the Docker image.
  # Example with netcat (nc):
  # RETRIES=15
  # until nc -z "$DB_HOST" "$DB_PORT"; do
  #   REPLIES=$((RETRIES-1))
  #   if [ $RETRIES -eq 0 ]; then
  #     echo "Failed to connect to database after multiple retries. Exiting."
  #     exit 1
  #   fi
  #   echo "Waiting for database connection... ($RETRIES retries left)"
  #   sleep 3
  # done
  # echo "Database is ready."

  # For now, using a fixed sleep as per the prompt's simplified approach.
  # This is NOT a reliable way to wait for the DB in production.
  echo "Current entrypoint.sh uses a fixed 10-second sleep to wait for the DB."
  echo "For production, replace this with a proper wait mechanism (e.g., using pg_isready or wait-for-it.sh)."
  sleep 10
fi


echo "Running database migrations (alembic upgrade head)..."
alembic upgrade head

echo "Database migrations complete."
echo "Starting Uvicorn server on 0.0.0.0:8000..."

# Execute the command passed as arguments to the entrypoint script (CMD from Dockerfile or docker run)
# If using `exec "$@"`, the CMD in Dockerfile should be `["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
# The prompt's entrypoint directly execs uvicorn, making Dockerfile CMD less relevant if ENTRYPOINT is ["/app/entrypoint.sh"]
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
