#!/bin/bash
cd "$(dirname "$0")"
CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]' chroma run --host localhost --port 8000
