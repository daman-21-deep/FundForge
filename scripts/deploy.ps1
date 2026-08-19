# FundForge Deployment Script for Windows PowerShell
$ErrorActionPreference = "Stop"

$NETWORK = "testnet"
$RPC_URL = "https://soroban-testnet.stellar.org"
$ADMIN_ALIAS = "admin"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Building Soroban Smart Contracts WASM..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
cargo build --target wasm32-unknown-unknown --release

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Deploying Campaign Registry Contract..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
$REGISTRY_ID = stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/campaign_registry.wasm `
  --source-account $ADMIN_ALIAS `
  --network $NETWORK

Write-Host "Registry Contract deployed. ID: $REGISTRY_ID" -ForegroundColor Green

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Installing Funding Escrow WASM..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
$ESCROW_HASH = stellar contract install `
  --wasm target/wasm32-unknown-unknown/release/funding_escrow.wasm `
  --source-account $ADMIN_ALIAS `
  --network $NETWORK

Write-Host "Funding Escrow WASM installed. HASH: $ESCROW_HASH" -ForegroundColor Green

# Save details to .env.production
@"
VITE_REGISTRY_CONTRACT="$REGISTRY_ID"
VITE_ESCROW_WASM_HASH="$ESCROW_HASH"
VITE_RPC_URL="$RPC_URL"
VITE_HORIZON_URL="https://horizon-testnet.stellar.org"
"@ | Out-File -FilePath .env.production -Encoding utf8

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Deployment complete! Saved to .env.production" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
