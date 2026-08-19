#!/bin/bash
set -e

# Configuration
NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
ADMIN_ALIAS="admin"

echo "========================================="
echo "Building Soroban Smart Contracts..."
echo "========================================="
cargo build --target wasm32-unknown-unknown --release

echo "========================================="
echo "Deploying Campaign Registry Contract..."
echo "========================================="
REGISTRY_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/campaign_registry.wasm \
  --source-account $ADMIN_ALIAS \
  --network $NETWORK)

echo "Registry Contract deployed. ID: $REGISTRY_ID"

echo "========================================="
echo "Installing Funding Escrow WASM..."
echo "========================================="
ESCROW_HASH=$(stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/funding_escrow.wasm \
  --source-account $ADMIN_ALIAS \
  --network $NETWORK)

echo "Funding Escrow WASM installed. HASH: $ESCROW_HASH"

# Save details to environment cache
echo "VITE_REGISTRY_CONTRACT=\"$REGISTRY_ID\"" > .env.production
echo "VITE_ESCROW_WASM_HASH=\"$ESCROW_HASH\"" >> .env.production
echo "VITE_RPC_URL=\"$RPC_URL\"" >> .env.production
echo "VITE_HORIZON_URL=\"https://horizon-testnet.stellar.org\"" >> .env.production

echo "========================================="
echo "Deployment complete! Details saved to .env.production"
echo "========================================="
