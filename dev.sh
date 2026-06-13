#!/usr/bin/env bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  kill "$BACK_PID" "$CLIENT_PID" 2>/dev/null
  wait "$BACK_PID" "$CLIENT_PID" 2>/dev/null
  exit 0
}

trap cleanup INT TERM

npm run dev --prefix "$ROOT" 2>&1 | sed 's/^/[back]  /' &
BACK_PID=$!

(cd "$ROOT/client" && bun run dev) 2>&1 | sed 's/^/[client] /' &
CLIENT_PID=$!

wait
