@echo off
REM Assisted start script for Windows
REM Installs dependencies and launches the local server
npm install
npm run build-win
npm run serve
pause

