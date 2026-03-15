export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111");
export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || "Sepolia";
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ROLES = { ADMIN: 'admin', VOTER: 'voter' };
export const USER_STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };
export const ELECTION_STATUS = { UPCOMING: 'upcoming', ACTIVE: 'active', ENDED: 'ended' };
export const VOTING_STATUS = {
  NOT_STARTED: 0,
  ACTIVE: 1,
  ENDED: 2,
};