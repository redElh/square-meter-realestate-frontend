@echo off
echo ====================================
echo Restarting React Development Server
echo ====================================
echo.

echo [1/3] Stopping existing node processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

echo [2/3] Clearing React cache...
if exist node_modules\.cache rd /s /q node_modules\.cache >nul 2>&1

echo [3/3] Starting development server...
echo.
echo The server will start momentarily...
echo Press Ctrl+C to stop the server when needed.
echo.

start "React Dev Server" cmd /k "npm start"

echo.
echo ====================================
echo Server is starting in a new window!
echo ====================================
echo.
echo Wait 10-15 seconds, then visit:
echo http://localhost:3000
echo.
echo The Google Reviews should now load correctly!
echo.
pause
