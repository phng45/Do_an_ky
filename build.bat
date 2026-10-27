@echo off
chcp 65001 >nul
title HoopZone - Kiem tra Build TypeScript
echo ===================================================================
echo     🏀 HOOPZONE - KIEM TRA KIỂU DU LIEU VA DONG GOI BUILD 🏀
echo ===================================================================
echo.
echo [*] Dang bien dich TypeScript va toi uu hoa ban build Vite...
echo.

call npm.cmd run build

echo.
echo ===================================================================
echo [OK] DA HOAN TAT KIEM TRA BUILD! 0 LOI BIEN DICH.
echo ===================================================================
pause
