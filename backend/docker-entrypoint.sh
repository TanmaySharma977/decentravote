#!/bin/sh
set -e

DEPLOYED_JSON="/app/artifacts/deployed.json"

echo "⏳ Waiting for contract to be deployed..."
for i in $(seq 1 30); do
  if [ -f "$DEPLOYED_JSON" ]; then
    echo "✅ Found deployed.json"
    break
  fi
  echo "   Attempt $i/30 — waiting 3s..."
  sleep 3
done

if [ ! -f "$DEPLOYED_JSON" ]; then
  echo "❌ deployed.json not found after 90s. Starting anyway..."
else
  # Read contract address from deployed.json and export it
  CONTRACT_ADDRESS=$(node -e "console.log(require('$DEPLOYED_JSON').address)")
  export CONTRACT_ADDRESS
  echo "⛓️  Contract address: $CONTRACT_ADDRESS"

  # Copy ABI to config folder
  node -e "
    const d = require('$DEPLOYED_JSON');
    require('fs').writeFileSync('./src/config/VotingSystemABI.json', JSON.stringify(d.abi, null, 2));
    console.log('📄 ABI written to src/config/VotingSystemABI.json');
  "
fi

echo "🚀 Starting backend..."
exec node server.js
