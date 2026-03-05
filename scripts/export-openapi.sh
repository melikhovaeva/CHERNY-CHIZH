#!/usr/bin/env sh
set -e
cd "$(dirname "$0")/../backend"
SPECTACULAR_SCHEMA_EXPORT=1 python manage.py spectacular --file openapi.json --format openapi-json
