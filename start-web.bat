@echo off
title GP Studio99 - Khoi Dong Website Thiep Moi Ky Yeu
color 0A
echo ========================================================
echo   GP STUDIO99 - THIEP MOI KY YEU TRUC TUYEN
echo ========================================================
echo.
echo Dang khoi dong may chu web tren cong 3000...
echo.

cd /d "%~dp0"
start http://localhost:3000
npm run dev
pause
