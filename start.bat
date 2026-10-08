@echo off
title Cortex - http://localhost:3007
cd /d "%~dp0"

echo.
echo   ============================================
echo    Cortex setup
echo   ============================================
echo.

rem ---- 1. Node must be installed ----
where npm >nul 2>nul
if errorlevel 1 (
  echo   [ERROR] npm was not found on this computer.
  echo.
  echo   Install Node.js from https://nodejs.org  then run this file again.
  echo.
  pause
  exit /b 1
)

rem ---- 2. Install dependencies if missing ----
if not exist "node_modules" (
  echo   [1/3] Installing dependencies... this can take a few minutes
  call npm install
  if errorlevel 1 (
    echo.
    echo   [ERROR] npm install failed. Check your internet connection
    echo           and make sure Node.js is installed, then try again.
    echo.
    pause
    exit /b 1
  )
) else (
  echo   [1/3] Dependencies already installed
)

rem ---- 3. Build the app into dist\ ----
if not exist "dist\index.html" (
  echo   [2/3] Building Cortex... this creates the dist folder
  call npm run build
  if errorlevel 1 (
    echo.
    echo   [ERROR] The build failed. Re-run this file after checking
    echo           the messages above.
    echo.
    pause
    exit /b 1
  )
) else (
  echo   [2/3] Build already present
)

if not exist "dist\index.html" (
  echo.
  echo   [ERROR] dist\index.html was still not created.
  echo           Run "npm run build" manually to see the full error.
  echo.
  pause
  exit /b 1
)

rem ---- 4. Start the server ----
echo   [3/3] Starting Cortex
echo.
echo   ============================================
echo    Cortex is ready
echo    Open:  http://localhost:3007
echo   ============================================
echo.

start "" "http://localhost:3007"
node server.js

pause
