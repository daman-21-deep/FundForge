#!/bin/bash
set -e

# Load environment details
if [ -f .env.production ]; then
  source .env.production
else
  echo "Error: .env.production not found. Run deploy.sh first."
  exit 1
fi

NETWORK="testnet"
ADMIN_ALIAS="admin"
ADMIN_ADDRESS=$(stellar keys address $ADMIN_ALIAS)

echo "========================================="
echo "Initializing Campaign Registry Contract..."
echo "========================================="

# Call initialize method on registry
stellar contract invoke \
  --id $VITE_REGISTRY_CONTRACT \
  --source-account $ADMIN_ALIAS \
  --network $NETWORK \
  -- \
  initialize \
  --admin $ADMIN_ADDRESS

echo "Registry initialization successful!"

# Configure the Escrow WASM hash in registry settings (optional if needed on setup)
echo "========================================="
echo "Contract Configuration Finished!"
echo "========================================="
