@echo off
setlocal enabledelayedexpansion
title Push thewoleisaiah to GitHub

echo =======================================================
echo     thewoleisaiah - Push to GitHub Automation
echo =======================================================
echo.

:: Check Git installation
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Git repository status...
if not exist ".git" (
    echo Initializing new Git repository...
    git init
) else (
    echo Git repository detected.
)

echo.
echo [2/4] Staging all files and committing...
git add .
git commit -m "feat: complete brand portfolio website with high-visibility portraits and interactive tools" 2>nul

git branch -M main

echo.
echo [3/4] Configure GitHub Repository URL:
echo Current default: https://github.com/the-woleisaiah/thwoleisaiah.git
echo.
set /p REPO_INPUT="Press ENTER to use default, or paste your new GitHub URL: "
if "!REPO_INPUT!"=="" (
    set TARGET_URL=https://github.com/the-woleisaiah/thwoleisaiah.git
) else (
    set TARGET_URL=!REPO_INPUT!
)

git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    git remote add origin !TARGET_URL!
) else (
    git remote set-url origin !TARGET_URL!
)
echo Remote linked to: !TARGET_URL!

echo.
echo [4/4] Pushing to GitHub...
echo (If a browser pop-up appears, sign in with the account that owns this repository)
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo =======================================================
    echo   IF YOU GOT A 403 OR PERMISSION DENIED ERROR:
    echo   Windows has cached credentials for a different GitHub account.
    echo.
    echo   To fix this:
    echo   1. Open Start menu -> search "Credential Manager"
    echo   2. Click "Windows Credentials"
    echo   3. Under "Generic Credentials", find "git:https://github.com"
    echo   4. Click "Remove"
    echo   5. Re-run this script to log into your current account.
    echo =======================================================
) else (
    echo.
    echo =======================================================
    echo   SUCCESS: Project successfully pushed to GitHub!
    echo =======================================================
)

echo.
pause
