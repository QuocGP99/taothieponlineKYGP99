# ========================================================
# GP STUDIO99 – ĐÓNG GÓI BẢN PRODUCTION CHO INET CPANEL
# ========================================================
$ErrorActionPreference = "Stop"

Write-Host ">>> [1/4] Kiem tra thu muc ban build .next..." -ForegroundColor Cyan
if (-not (Test-Path ".next")) {
    Write-Host ">>> Thu muc .next chua ton tai. Dang chay build truoc..." -ForegroundColor Yellow
    npm run build
}

$zipFileName = "thiep-online-inet-deploy.zip"
$stagingDir = ".staging-inet-deploy"

# Don dep file cu neu co
if (Test-Path $zipFileName) {
    Remove-Item -Force $zipFileName
}
if (Test-Path $stagingDir) {
    Remove-Item -Recurse -Force $stagingDir
}

Write-Host ">>> [2/4] Chuan bi thu muc staging chua cac tap tin can thiet..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $stagingDir | Out-Null

# 1. Chep file he thong root
Copy-Item -Path "package.json" -Destination $stagingDir
if (Test-Path "package-lock.json") { Copy-Item -Path "package-lock.json" -Destination $stagingDir }
Copy-Item -Path "next.config.js" -Destination $stagingDir
Copy-Item -Path "server.js" -Destination $stagingDir
Copy-Item -Path ".env.example" -Destination $stagingDir
Copy-Item -Path "README_INET_DEPLOY.md" -Destination $stagingDir

# 2. Chep cac thu muc source
Copy-Item -Path "public" -Destination "$stagingDir\public" -Recurse
Copy-Item -Path "database" -Destination "$stagingDir\database" -Recurse
Copy-Item -Path "src" -Destination "$stagingDir\src" -Recurse

# 3. Chep thu muc build .next (Loai bo thu muc cache de giam dung luong zip tu 150MB xuong con ~15MB)
Write-Host ">>> [3/4] Toi uu hoa thu muc .next (bo qua cache)..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$stagingDir\.next" | Out-Null
Get-ChildItem -Path ".next" -Exclude "cache" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination "$stagingDir\.next\$($_.Name)" -Recurse
}

# 4. Nen tap tin zip
Write-Host ">>> [4/4] Dang dong goi tap tin $zipFileName..." -ForegroundColor Cyan
Compress-Archive -Path "$stagingDir\*" -DestinationPath $zipFileName -CompressionLevel Optimal

# Xoa thu muc staging
Remove-Item -Recurse -Force $stagingDir

$zipItem = Get-Item $zipFileName
$sizeMB = [math]::Round($zipItem.Length / 1MB, 2)

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " HOAN TAT! Goi cai dat iNET da tao thanh cong!" -ForegroundColor Green
Write-Host " Tap tin: $zipFileName" -ForegroundColor Yellow
Write-Host " Dung luong: $sizeMB MB" -ForegroundColor Yellow
Write-Host " Huong dan: Xem file README_INET_DEPLOY.md" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
