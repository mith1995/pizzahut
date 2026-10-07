#!/usr/bin/env bash
# Render build script. Runs from the backend/ folder.
set -o errexit

pip install --upgrade pip
pip install -r requirement.txt

python manage.py collectstatic --no-input
python manage.py migrate --no-input
