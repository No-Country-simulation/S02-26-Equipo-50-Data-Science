@echo off
title Sistema de Inventario Equipo 50

echo ==================================================
echo Iniciando los servidores de la aplicacion...
echo ==================================================
echo.

echo [1/2] Iniciando el Backend (Puerto 3000)...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [2/2] Iniciando el Frontend (Puerto 5173)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================
echo ¡Todo listo! Se han abierto dos ventanas nuevas para
echo mantener los servidores encendidos.
echo.
echo El proyecto de React estara disponible en breve en:
echo -^> http://localhost:5173/inventario
echo ==================================================
pause
