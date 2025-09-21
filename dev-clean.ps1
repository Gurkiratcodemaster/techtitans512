#!/usr/bin/env pwsh

Write-Host "🧹 Cleaning Development Environment..." -ForegroundColor Green

# Kill any running Next.js processes
Write-Host "🔄 Stopping any running Next.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Next.js cache
Write-Host "🗑️  Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
    Write-Host "✅ Removed .next directory" -ForegroundColor Green
}

# Clear npm cache
Write-Host "📦 Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Clear browser cache instructions
Write-Host "" 
Write-Host "🌐 Browser Cache Clearing:" -ForegroundColor Cyan
Write-Host "   Chrome: Ctrl+Shift+Delete > All time > Clear data" -ForegroundColor White
Write-Host "   Firefox: Ctrl+Shift+Delete > Everything > Clear Now" -ForegroundColor White
Write-Host "   Edge: Ctrl+Shift+Delete > All time > Clear now" -ForegroundColor White
Write-Host "" 

# Optional: Clear specific browser caches (Windows only)
Write-Host "🔧 Clearing system DNS cache..." -ForegroundColor Yellow
ipconfig /flushdns | Out-Null

Write-Host "" 
Write-Host "✅ Clean complete! Starting development server..." -ForegroundColor Green
Write-Host "🚀 Running: npm run dev:clean" -ForegroundColor Cyan

# Start development server
npm run dev:clean