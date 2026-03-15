require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    // ✅ Polygon Amoy Testnet — no Alchemy needed, free public RPC
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: process.env.ADMIN_WALLET_PRIVATE_KEY ? [process.env.ADMIN_WALLET_PRIVATE_KEY] : [],
      chainId: 80002,
    },
    // Local development (no internet needed)
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};