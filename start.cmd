@echo off
chcp 65001 >nul
title OpenCode Launcher (GitHub MCP)
mode con: cols=80 lines=30
color 0A

echo.
echo  ============================================================
echo    OpenCode + GitHub MCP Launcher
echo  ============================================================
echo.
echo  This script NEVER writes your token to a file. It only reads
echo  the GITHUB_API_KEY environment variable and launches OpenCode.
echo.

:ask_token
if "%GITHUB_API_KEY%"=="" (
  set /p "GITHUB_API_KEY=  Enter GitHub token (GITHUB_API_KEY): "
)

if "%GITHUB_API_KEY%"=="" (
  echo  [!] Token empty. GitHub MCP runs without auth (public read-only).
  echo      Press any key to continue...
  pause >nul
) else (
  echo  [+] GITHUB_API_KEY loaded into environment (not written to disk).
)

echo.
echo  Launching OpenCode...
echo.

opencode
