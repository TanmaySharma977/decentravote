# 🗳️ DecentraVote

> A full-stack decentralized voting platform where votes are recorded immutably on the blockchain, admin approval controls voter access, and results are revealed to everyone simultaneously when the deadline hits.

**🌐 Live Demo:** [decentravote-mu.vercel.app](https://decentravote-mu.vercel.app)  
**⛓️ Smart Contract:** [View on Polygonscan](https://amoy.polygonscan.com)  
**🔧 API:** [decentravote-backend.onrender.com](https://decentravote-backend.onrender.com)

---

## 📸 Screenshots

| Login | Voter Dashboard | Admin Dashboard |
|-------|----------------|-----------------|
| Email-based auth with approval flow | Live elections with countdown timer | Manage voters & create elections |

---

## ✨ Features

### 👤 Voter
- Register with email & password
- Account requires **admin approval** before access
- View active elections with **live countdown timer**
- Cast vote — recorded **immutably on Polygon blockchain**
- Results revealed to **all users simultaneously** when deadline hits
- Blockchain transaction receipt as proof of vote

### 🔐 Admin
- Approve or reject pending voter registrations
- Create time-bound elections with multiple candidates
- Votes stored on-chain — **admin cannot tamper with results**
- Results auto-reveal at deadline via scheduled cron job
- Dashboard with voter stats and election management

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│        React 18 + Vite + Tailwind + Recharts     │
│  Login │ Signup │ Voter Dashboard │ Admin Panel  │
└────────────────────┬────────────────────────────┘
                     │  REST API  (JWT Auth)
┌────────────────────▼────────────────────────────┐
│                   BACKEND                        │
│           Node.js + Express + MongoDB            │
│  Auth │ Admin Approval │ Elections │ Scheduling  │
└────────────────────┬────────────────────────────┘
                     │  ethers.js
┌────────────────────▼────────────────────────────┐
│              BLOCKCHAIN                          │
│     Solidity Smart Contract on Polygon Amoy      │
│  Tamper-proof votes │ On-chain result tallying   │
└─────────────────────────────────────────────────┘
```

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT, bcrypt |
| **Smart Contract** | Solidity ^0.8.20, Hardhat |
| **Web3 Bridge** | ethers.js v6 |
| **Blockchain** | Polygon Amoy Testnet |
| **Scheduler** | node-cron (auto-reveal results) |
| **Email** | Nodemailer |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 📁 Project Structure

```
decentravote/
├── frontend/                   # React + Vite
│   └── src/
│       ├── pages/              # Login, Signup, Dashboards, Results
│       ├── components/
│       │   ├── auth/           # ProtectedRoute, AdminRoute
│       │   ├── admin/          # PendingApprovals, CreateElection
│       │   ├── voter/          # ElectionCard, CandidateList
│       │   └── shared/         # Navbar, CountdownTimer, ResultsChart
│       ├── hooks/              # useAuth, useElection
│       ├── context/            # AuthContext
│       └── utils/              # api.js (axios), formatters, constants
│
├── backend/                    # Node.js + Express API
│   └── src/
│       ├── models/
│       │   ├── User.js         # email, role, status (pending/approved/rejected)
│       │   ├── Election.js     # title, candidates, deadline, onChainId
│       │   └── VoteRecord.js   # prevents double voting, stores txHash
│       ├── controllers/        # auth, admin, election, vote
│       ├── routes/             # Express route definitions
│       ├── middleware/         # JWT auth, admin role guard
│       └── services/
│           ├── blockchainService.js  # ethers.js ↔ smart contract
│           ├── emailService.js       # approval & results emails
│           └── resultsService.js     # cron job — auto reveal at deadline
│
└── blockchain/                 # Hardhat project
    ├── contracts/
    │   └── VotingSystem.sol    # Core voting contract
    ├── scripts/
    │   └── deploy.js           # Deploy to Polygon Amoy
    └── test/
        └── VotingSystem.test.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://mongodb.com/atlas))
- MetaMask browser extension
- Git

### 1. Clone & Install

```bash
git clone https://github.com/TanmaySharma977/decentravote.git
cd decentravote

cd backend    && npm install
cd ../blockchain && npm install
cd ../frontend   && npm install
```

### 2. Configure Environment Variables

```bash
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/decentravote
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
ADMIN_WALLET_PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=                    # fill after step 3

# blockchain/.env
ADMIN_WALLET_PRIVATE_KEY=your_wallet_private_key

# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Deploy Smart Contract

Get free test MATIC from [faucet.polygon.technology](https://faucet.polygon.technology), then:

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
```

Copy the deployed address into `backend/.env` as `CONTRACT_ADDRESS`, then copy the ABI:

```bash
cp blockchain/artifacts/contracts/VotingSystem.sol/VotingSystem.json \
   backend/src/config/VotingSystemABI.json
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** 🎉

Default admin credentials:
```
Email:    admin@decentravote.com
Password: Admin@123
```

---

## 🐳 Docker Setup

Start everything with one command:

```bash
docker compose up
```

Open **http://localhost:5173**

Stop:
```bash
docker compose down
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [decentravote-mu.vercel.app](https://decentravote-mu.vercel.app) |
| Backend | Render | [decentravote-backend.onrender.com](https://decentravote-backend.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |
| Blockchain | Polygon Amoy | Free testnet |

---

## 🔐 Smart Contract

The `VotingSystem.sol` contract handles:
- Creating elections with candidate count and deadline
- Recording votes immutably on-chain
- Returning vote tallies per candidate
- Enforcing voting deadline — no votes accepted after deadline

```solidity
function createElection(string memory mongoId, uint256 candidateCount, uint256 deadline) external onlyOwner returns (uint256)
function vote(uint256 electionId, uint256 candidateIndex) external onlyOwner
function getResults(uint256 electionId) external view returns (uint256[] memory)
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register new voter |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/admin/users` | Admin | Get all voters |
| PATCH | `/api/admin/users/:id/approve` | Admin | Approve voter |
| PATCH | `/api/admin/users/:id/reject` | Admin | Reject voter |
| GET | `/api/elections` | Auth | List all elections |
| POST | `/api/elections` | Admin | Create election |
| POST | `/api/votes` | Auth | Cast vote |
| GET | `/api/votes/status/:electionId` | Auth | Check vote status |
| GET | `/api/votes/results/:id` | Auth | Get results (after deadline) |

---

## 👨‍💻 Author

**Tanmay Sharma**  

[GitHub](https://github.com/TanmaySharma977)

---

