<#
setup-https.ps1
PowerShell helper to generate mkcert certificates and update .env.development.local

Run in PowerShell (may need Administrator for mkcert -install):
  cd frontend\scripts
  .\setup-https.ps1
#>

function Ensure-CommandExists {
    param([string]$cmd)
    $which = Get-Command $cmd -ErrorAction SilentlyContinue
    return $null -ne $which
}

if (-not (Ensure-CommandExists mkcert)) {
    Write-Host "mkcert not found. Install mkcert first. See README_HTTPS.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "Generating certificates for localhost..."

$certsDir = "..\certs"
if (-not (Test-Path $certsDir)) { New-Item -ItemType Directory -Path $certsDir | Out-Null }

mkcert -cert-file "$certsDir\localhost.pem" -key-file "$certsDir\localhost-key.pem" localhost 127.0.0.1 ::1

if (-not (Test-Path "$certsDir\localhost.pem")) {
    Write-Host "Failed to generate certs." -ForegroundColor Red
    exit 1
}

Write-Host "Certificates generated at $certsDir"

# Update .env.development.local
$envFile = "..\.env.development.local"
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $content = $content -replace "#?SSL_CRT_FILE=.*", "SSL_CRT_FILE=certs/localhost.pem"
    $content = $content -replace "#?SSL_KEY_FILE=.*", "SSL_KEY_FILE=certs/localhost-key.pem"
    $content | Set-Content $envFile -Encoding UTF8
    Write-Host "Updated $envFile with SSL_CRT_FILE and SSL_KEY_FILE" -ForegroundColor Green
} else {
    Write-Host "Could not find $envFile. Please update frontend/.env.development.local manually." -ForegroundColor Yellow
}

Write-Host "Done. Now run 'cd .. && npm start' within the frontend folder to start the dev server with trusted certs." -ForegroundColor Green
