// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {

    struct Election {
        string  mongoId;
        uint256 candidateCount;
        uint256 deadline;
        bool    exists;
        mapping(uint256 => uint256) voteCounts;
    }

    address public owner;
    uint256 public electionCount;

    mapping(uint256 => Election) private elections;

    event ElectionCreated(uint256 indexed electionId, string mongoId, uint256 deadline);
    event VoteCast(uint256 indexed electionId, uint256 candidateIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createElection(
        string memory mongoId,
        uint256 candidateCount,
        uint256 deadline
    ) external onlyOwner returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(candidateCount > 1, "Need at least 2 candidates");

        uint256 id = electionCount++;
        Election storage e = elections[id];
        e.mongoId        = mongoId;
        e.candidateCount = candidateCount;
        e.deadline       = deadline;
        e.exists         = true;

        emit ElectionCreated(id, mongoId, deadline);
        return id;
    }

    function vote(uint256 electionId, uint256 candidateIndex) external onlyOwner {
        Election storage e = elections[electionId];
        require(e.exists, "Election does not exist");
        require(block.timestamp <= e.deadline, "Voting period has ended");
        require(candidateIndex < e.candidateCount, "Invalid candidate");

        e.voteCounts[candidateIndex]++;
        emit VoteCast(electionId, candidateIndex);
    }

    function getResults(uint256 electionId) external view returns (uint256[] memory) {
        Election storage e = elections[electionId];
        require(e.exists, "Election does not exist");

        uint256[] memory counts = new uint256[](e.candidateCount);
        for (uint256 i = 0; i < e.candidateCount; i++) {
            counts[i] = e.voteCounts[i];
        }
        return counts;
    }

    function isActive(uint256 electionId) external view returns (bool) {
        return elections[electionId].exists &&
               block.timestamp <= elections[electionId].deadline;
    }
}
