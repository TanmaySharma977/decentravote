const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Check .env is configured
  if (!process.env.ADMIN_WALLET_PRIVATE_KEY) {
    console.error("❌ ADMIN_WALLET_PRIVATE_KEY is missing from your .env file!");
    console.error("   1. Copy blockchain\\.env.example → blockchain\\.env");
    console.error("   2. Add your MetaMask private key");
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");

  if (balance === 0n) {
    console.error("❌ No MATIC! Get free test MATIC from https://faucet.polygon.technology");
    process.exit(1);
  }

  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const contract = await VotingSystem.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ VotingSystem deployed to:", address);
  console.log("🔗 View on explorer: https://amoy.polygonscan.com/address/" + address);
  console.log("\n👉 Next steps:");
  console.log("   1. Copy address into backend/.env → CONTRACT_ADDRESS=" + address);
  console.log("   2. Copy ABI: blockchain/artifacts/contracts/VotingSystem.sol/VotingSystem.json → backend/src/config/VotingSystemABI.json");
}

main().catch((err) => { console.error(err); process.exit(1); });