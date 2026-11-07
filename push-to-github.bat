@echo off
setlocal enabledelayedexpansion
title Push thewoleisaiah to GitHub

echo =======================================================
echo     thewoleisaiah - Push to GitHub Automation
echo =======================================================
echo.

set DEFAULT_REPO_URL=https://github.com/the-woleisaiah/thwoleisaiah.git

:: 1. Check if Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking Git repository status...
if not exist ".git" (
    echo Initializing new Git repository...
    git init
) else (
    echo Existing Git repository detected.
)

echo.
echo [2/5] Staging all files...
git add .

echo.
echo [3/5] Creating commit...
git commit -m "feat: complete brand portfolio website with high-visibility portraits and interactive tools"
if %errorlevel% neq 0 (
    echo [INFO] No new changes to commit, or commit already exists.
)

echo.
echo [4/5] Setting branch to main...
git branch -M main

echo.
echo [5/5] Connecting to GitHub remote...
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo Adding remote origin: %DEFAULT_REPO_URL%
    git remote add origin %DEFAULT_REPO_URL%
) else (
    echo Updating remote origin to: %DEFAULT_REPO_URL%
    git remote set-url origin %DEFAULT_REPO_URL%
)

echo.
echo Pushing to GitHub (main branch)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo   SUCCESS: Project successfully pushed to GitHub!
    echo =======================================================
) else (
    echo.
    echo =======================================================
    echo   NOTE: Push encountered an issue or authentication prompt.
    echo   If GitHub requires sign-in, sign in via the browser pop-up.
    echo   If the remote repository already has commits (e.g. README/License),
    echo   you may need to run:
    echo     git pull origin main --rebase
    echo     git push -u origin main
    echo =======================================================
)

echo.
pause
