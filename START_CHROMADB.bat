@echo off
echo Starting ChromaDB Server...
cd /d "%~dp0"
chroma run --host localhost --port 8000 --path ./chroma
