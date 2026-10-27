@echo off
chcp 65001 >nul
title HoopZone - Basketball Store Dev Server
echo ===================================================================
echo     🏀 HOOPZONE - WEBSITE THUONG MAI DIEN TU BONG RO 🏀
echo     Khoa Cong nghe so & Truyen thong - Dai hoc Phuong Dong
echo ===================================================================
echo.
echo [*] Dang khoi dong may chu phat trien tai http://localhost:3000 ...
echo [*] Trinh duyet web se tu dong mo sau vai giay...
echo.

start "" "http://localhost:3000"
call npm.cmd run dev

pause
