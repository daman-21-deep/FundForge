#!/bin/bash
set -e

# Configuration
NETWORK="testnet"
ADMIN_ALIAS="admin"

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <contract_id> <path_to_new_wasm>"
  exit 1
fi

CONTRACT_ID="$1"
WASM_PATH="$2"

echo "========================================="
echo "Installing new WASM contract version..."
echo "========================================="
NEW_WASM_HASH=$(stellar contract install \
  --wasm $WASM_PATH \
  --source-account $ADMIN_ALIAS \
  --network $NETWORK)

echo "New WASM Hash: $NEW_WASM_HASH"

echo "========================================="
echo "Invoking upgrade on contract: $CONTRACT_ID"
echo "========================================="
stellar contract invoke \
  --id $CONTRACT_ID \
  --source-account $ADMIN_ALIAS \
  --network $NETWORK \
  -- \
  upgrade \
  --new_wasm_hash $NEW_WASM_HASH

echo "========================================="
echo "Contract logic upgrade successfully verified!"
echo "========================================="
