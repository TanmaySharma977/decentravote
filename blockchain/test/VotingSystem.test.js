const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('VotingSystem', () => {
  let votingSystem;
  let owner, addr1, addr2;

  const CANDIDATES = ['Alice', 'Bob', 'Charlie'];
  let startTime, endTime;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const VotingSystem = await ethers.getContractFactory('VotingSystem');
    votingSystem = await VotingSystem.deploy();

    const now = await time.latest();
    startTime = now + 60;      // starts in 1 min
    endTime = now + 3600;      // ends in 1 hour
  });

  // ─── Deployment ────────────────────────────────────────────────────────────

  describe('Deployment', () => {
    it('should set the deployer as owner', async () => {
      expect(await votingSystem.owner()).to.equal(owner.address);
    });

    it('should initialize electionCount to 0', async () => {
      expect(await votingSystem.electionCount()).to.equal(0);
    });
  });

  // ─── createElection ────────────────────────────────────────────────────────

  describe('createElection', () => {
    it('should create an election and emit event', async () => {
      await expect(
        votingSystem.createElection('Test Election', CANDIDATES, startTime, endTime)
      )
        .to.emit(votingSystem, 'ElectionCreated')
        .withArgs(0, 'Test Election', startTime, endTime);

      expect(await votingSystem.electionCount()).to.equal(1);
    });

    it('should revert with less than 2 candidates', async () => {
      await expect(
        votingSystem.createElection('Bad', ['OnlyOne'], startTime, endTime)
      ).to.be.revertedWith('VotingSystem: need at least 2 candidates');
    });

    it('should revert if end <= start', async () => {
      await expect(
        votingSystem.createElection('Bad', CANDIDATES, endTime, startTime)
      ).to.be.revertedWith('VotingSystem: end must be after start');
    });

    it('should revert if called by non-owner', async () => {
      await expect(
        votingSystem.connect(addr1).createElection('Hack', CANDIDATES, startTime, endTime)
      ).to.be.revertedWith('VotingSystem: not owner');
    });

    it('should return correct election metadata', async () => {
      await votingSystem.createElection('E1', CANDIDATES, startTime, endTime);
      const [title, st, et, count] = await votingSystem.getElection(0);
      expect(title).to.equal('E1');
      expect(Number(st)).to.equal(startTime);
      expect(Number(et)).to.equal(endTime);
      expect(Number(count)).to.equal(CANDIDATES.length);
    });
  });

  // ─── vote ──────────────────────────────────────────────────────────────────

  describe('vote', () => {
    beforeEach(async () => {
      await votingSystem.createElection('Election', CANDIDATES, startTime, endTime);
      await time.increaseTo(startTime + 1); // move to active period
    });

    it('should allow a voter to cast a vote and emit VoteCast', async () => {
      await expect(votingSystem.connect(addr1).vote(0, 0))
        .to.emit(votingSystem, 'VoteCast')
        .withArgs(0, 0, addr1.address);
    });

    it('should prevent double voting', async () => {
      await votingSystem.connect(addr1).vote(0, 0);
      await expect(votingSystem.connect(addr1).vote(0, 1)).to.be.revertedWith(
        'VotingSystem: already voted'
      );
    });

    it('should revert with invalid candidate index', async () => {
      await expect(votingSystem.connect(addr1).vote(0, 99)).to.be.revertedWith(
        'VotingSystem: invalid candidate'
      );
    });

    it('should revert when election has not started', async () => {
      // Create a future election
      const now2 = await time.latest();
      await votingSystem.createElection('Future', CANDIDATES, now2 + 9999, now2 + 99999);
      await expect(votingSystem.connect(addr1).vote(1, 0)).to.be.revertedWith(
        'VotingSystem: election not started'
      );
    });

    it('should revert when election has ended', async () => {
      await time.increaseTo(endTime + 1);
      await expect(votingSystem.connect(addr1).vote(0, 0)).to.be.revertedWith(
        'VotingSystem: election has ended'
      );
    });
  });

  // ─── getResults ────────────────────────────────────────────────────────────

  describe('getResults', () => {
    beforeEach(async () => {
      await votingSystem.createElection('Results Test', CANDIDATES, startTime, endTime);
      await time.increaseTo(startTime + 1);
    });

    it('should return correct vote counts', async () => {
      await votingSystem.connect(addr1).vote(0, 0); // Alice +1
      await votingSystem.connect(addr2).vote(0, 0); // Alice +1
      await votingSystem.connect(owner).vote(0, 1); // Bob +1

      const [names, votes] = await votingSystem.getResults(0);
      expect(names[0]).to.equal('Alice');
      expect(Number(votes[0])).to.equal(2);
      expect(names[1]).to.equal('Bob');
      expect(Number(votes[1])).to.equal(1);
      expect(Number(votes[2])).to.equal(0);
    });

    it('should revert for non-existent election', async () => {
      await expect(votingSystem.getResults(999)).to.be.revertedWith(
        'VotingSystem: election not found'
      );
    });
  });

  // ─── transferOwnership ─────────────────────────────────────────────────────

  describe('transferOwnership', () => {
    it('should transfer ownership', async () => {
      await votingSystem.transferOwnership(addr1.address);
      expect(await votingSystem.owner()).to.equal(addr1.address);
    });

    it('should revert on zero address', async () => {
      await expect(
        votingSystem.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith('VotingSystem: zero address');
    });
  });
});
