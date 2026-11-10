@echo off
title AgroGestión Sumapaz — PWA
echo ======================================================================
echo    AGROGESTION SUMAPAZ - OBSERVATORIO AGROTURISTICO
echo ======================================================================
echo.
cd /d "%~dp0sumapaz-agroturismo-pwa"

:: Liberar puerto 5173 si quedo algun proceso fantasma previo
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [1/2] Iniciando servidor Vite en http://127.0.0.1:5173 ...
echo [2/2] Abriendo tu navegador web predeterminado...
echo.
echo * NOTA: Esta ventana de consola debe permanecer abierta mientras uses el sistema.
echo * La aplicacion se visualiza en tu navegador web.
echo.
echo Presiona Ctrl+C en esta consola cuando desees apagar el servidor.
echo ======================================================================
echo.

call npm run dev -- --host 127.0.0.1 --port 5173 --strictPort --open
pause
