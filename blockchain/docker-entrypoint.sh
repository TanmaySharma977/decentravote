#!/bin/sh
set -e

echo "⛓️  Starting Hardhat node on 0.0.0.0:8545..."
npx hardhat node --hostname 0.0.0.0 &
NODE_PID=$!

echo "⏳ Waiting for node to be ready..."
sleep 6

echo "🚀 Deploying VotingSystem contract..."
npx hardhat run scripts/deploy.js --network localhost

echo "✅ Contract deployed. Hardhat node running."
wait $NODE_PID
