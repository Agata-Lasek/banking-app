#!/bin/bash

HOST=${HOST:-"0.0.0.0"}
PORT=${PORT:-"3004"}

prestart() {
  poetry run python prestart.py
  poetry run alembic upgrade head
}

usage() {
  echo "Usage: start.sh [-h] [-p] [-d]"
  echo " "
  echo "options:"
  echo "-h  show brief help"
  echo "-p  start production server"
  echo "-d  start development server"
}

while getopts 'hpd' OPTION; do
  case "$OPTION" in
    h)
      usage
      exit 0
      ;;
    p)
      echo "Starting production server..."
      prestart
      exec poetry run uvicorn src.main:app --host "$HOST" --port "$PORT"
      ;;
    d)
      echo "Starting development server..."
      prestart
      exec poetry run uvicorn src.main:app --host "$HOST" --port "$PORT" --reload
      ;;
    *)
      usage
      exit 0
      ;;
  esac
done
