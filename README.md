<<<<<<< HEAD
# DecentraVote 🗳️

A **decentralized voting platform** built with:
- **Backend**: Node.js + Express + MongoDB
- **Blockchain**: Hardhat + Solidity (Sepolia testnet)
- **Frontend**: React + Vite

## Project Structure

```
decentravote/
├── backend/     # REST API (Express + MongoDB + ethers.js)
├── blockchain/  # Hardhat smart contracts
└── frontend/    # React + Vite SPA
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env  # Fill in your values
npm run dev
```

### 2. Blockchain
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `backend/.env.example` for required environment variables.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | Node.js, Express, JWT |
| Database | MongoDB, Mongoose |
| Blockchain | Solidity, Hardhat, ethers.js |
| Frontend | React, Vite, Axios |
| Email | Nodemailer |

## Features

- 🔐 JWT-based authentication with admin approval workflow
- 📧 Email notifications for account approval/rejection
- 🗳️ On-chain vote casting via Ethereum smart contract
- 📊 Real-time results with charts
- ⏱️ Countdown timer for election deadlines
- 🔒 Role-based access control (Admin / Voter)
=======
# DecentraVote 🗳️

A **decentralized voting platform** built with:
- **Backend**: Node.js + Express + MongoDB
- **Blockchain**: Hardhat + Solidity (Sepolia testnet)
- **Frontend**: React + Vite

## Project Structure

```
decentravote/
├── backend/     # REST API (Express + MongoDB + ethers.js)
├── blockchain/  # Hardhat smart contracts
└── frontend/    # React + Vite SPA
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env  # Fill in your values
npm run dev
```

### 2. Blockchain
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `backend/.env.example` for required environment variables.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | Node.js, Express, JWT |
| Database | MongoDB, Mongoose |
| Blockchain | Solidity, Hardhat, ethers.js |
| Frontend | React, Vite, Axios |
| Email | Nodemailer |

## Features

- 🔐 JWT-based authentication with admin approval workflow
- 📧 Email notifications for account approval/rejection
- 🗳️ On-chain vote casting via Ethereum smart contract
- 📊 Real-time results with charts
- ⏱️ Countdown timer for election deadlines
- 🔒 Role-based access control (Admin / Voter)
>>>>>>> db8414a8d3357203b327f46e746d734cbd7b14ce
