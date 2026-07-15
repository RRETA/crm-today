#!/bin/sh
set -e

echo "Esperando a MariaDB en ${DB_HOST}:${DB_PORT}..."
until mysqladmin ping -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" --silent; do
  sleep 1
done
echo "MariaDB disponible."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
