#!/bin/sh
set -e

echo "Esperando a PostgreSQL en ${DB_HOST}:${DB_PORT}..."
until PGPASSWORD="${DB_PASSWORD}" pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -q; do
  sleep 1
done
echo "PostgreSQL disponible."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
