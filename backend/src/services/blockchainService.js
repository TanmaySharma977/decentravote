const { ethers } = require('ethers');
const artifactJson = require('../config/VotingSystemABI.json');

const contractABI = artifactJson.abi; // ← extract just the ABI array

let provider, signer, contract;

const init = () => {
  if (contract) return;
  provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC || 'http://127.0.0.1:8545'
  );
  signer   = new ethers.Wallet(process.env.ADMIN_WALLET_PRIVATE_KEY, provider);
  contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);
};

exports.createElectionOnChain = async (mongoId, candidateCount, deadline) => {
  init();
  const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000);
  const tx = await contract.createElection(mongoId, candidateCount, deadlineTs);
  const receipt = await tx.wait();
  const event = receipt.logs.find(l => l.fragment?.name === 'ElectionCreated');
  return Number(event?.args?.electionId ?? 0);
};

exports.castVoteOnChain = async (onChainElectionId, candidateIndex) => {
  init();
  const tx = await contract.vote(onChainElectionId, candidateIndex);
  const receipt = await tx.wait();
  return receipt.hash;
};

exports.getResultsFromChain = async (onChainElectionId, candidates) => {
  init();
  const voteCounts = await contract.getResults(onChainElectionId);
  return candidates.map((c, i) => ({
    name:  c.name,
    votes: Number(voteCounts[i]),
  }));
};