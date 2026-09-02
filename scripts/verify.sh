#!/usr/bin/env bash
# The single verification command for humans and agents alike.
# Agents drop flags and forget arguments when given many commands. Give them one door.
set -e
echo "==> Backend unit tests"
npm --prefix backend run test
echo "==> Frontend production build"
npm --prefix frontend run build
echo "==> VERIFY OK"
