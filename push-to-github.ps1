# Push thewoleisaiah to GitHub PowerShell Script
param (
    [string]$RepoUrl = "https://github.com/the-woleisaiah/thwoleisaiah.git"
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "    thewoleisaiah - Push to GitHub Automation" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check if git exists
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not in your system PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/ and rerun this script." -ForegroundColor Yellow
    exit 1
}

# 2. Check / Initialize Git repo
Write-Host "[1/5] Checking Git repository status..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    Write-Host "Initializing new Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Existing Git repository detected." -ForegroundColor Green
}

# 3. Stage files
Write-Host "`n[2/5] Staging files..." -ForegroundColor Green
git add .

# 4. Commit
Write-Host "`n[3/5] Creating commit..." -ForegroundColor Green
git commit -m "feat: complete brand portfolio website with high-visibility portraits and interactive tools"

# 5. Branch
Write-Host "`n[4/5] Setting branch to main..." -ForegroundColor Green
git branch -M main

# 6. Remote handling
Write-Host "`n[5/5] Checking remote origin..." -ForegroundColor Green
$currentOrigin = git remote get-url origin 2>$null

if (-not $currentOrigin) {
    Write-Host "Adding remote origin: $RepoUrl" -ForegroundColor Cyan
    git remote add origin $RepoUrl
} else {
    Write-Host "Current origin is: $currentOrigin" -ForegroundColor DarkCyan
    if ($RepoUrl -ne $currentOrigin) {
        Write-Host "Updating remote origin to: $RepoUrl" -ForegroundColor Cyan
        git remote set-url origin $RepoUrl
    }
}

# 7. Push
Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=======================================================" -ForegroundColor Green
    Write-Host "  SUCCESS: Project successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Green
} else {
    Write-Host "`n=======================================================" -ForegroundColor Yellow
    Write-Host "  Notice: If GitHub asked for credentials, complete the login." -ForegroundColor Yellow
    Write-Host "  If the remote repository already had files (e.g. initial README), run:" -ForegroundColor Yellow
    Write-Host "    git pull origin main --rebase" -ForegroundColor White
    Write-Host "    git push -u origin main" -ForegroundColor White
    Write-Host "=======================================================" -ForegroundColor Yellow
}
