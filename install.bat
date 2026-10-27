@echo off
chcp 65001 >nul
title HoopZone - Cai dat Dependencies
echo ===================================================================
echo     🏀 HOOPZONE - CAI DAT GOI THU VIEN & MOI TRUONG 🏀
echo ===================================================================
echo.
echo [*] Dang thuc thi npm.cmd install --legacy-peer-deps ...
echo [*] Khong bi han che boi PowerShell Execution Policy!
echo.

call npm.cmd install --legacy-peer-deps

echo.
echo ===================================================================
echo [OK] DA HOAN TAT CAI DAT! Nhan nut bat ky de dong cua so.
echo      Sau do hay chay start.bat de khoi dong website.
echo ===================================================================
pause
