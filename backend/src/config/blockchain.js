const { ethers } = require('ethers');
const { RPC_URL } = require('./env');

let provider;

const getProvider = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
  }
  return provider;
};

module.exports = { getProvider };
