const Election = require('../models/Election');
const { createElectionOnChain } = require('../services/blockchainService');
const { scheduleResultsReveal } = require('../services/resultsService');

exports.createElection = async (req, res) => {
  try {
    const { title, description, candidates, startTime, deadline } = req.body;

    const election = await Election.create({
      title,
      description,
      candidates,
      startTime:  new Date(startTime),
      deadline:   new Date(deadline),
      createdBy:  req.user._id,
      status:     'active',
    });

    // Register on blockchain
    try {
      const onChainId = await createElectionOnChain(
        election._id.toString(),
        candidates.length,
        new Date(deadline)
      );
      election.onChainId = onChainId;
      await election.save();
      console.log(`⛓️  Election recorded on-chain with ID: ${onChainId}`);
    } catch (chainErr) {
      console.error('⚠️  Blockchain write failed:', chainErr.message);
      // Election still saved in MongoDB — don't fail the whole request
    }

    // Schedule auto-reveal at deadline
    scheduleResultsReveal(election);

    res.status(201).json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ deadline: 1 });
    res.json(elections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    await Election.findByIdAndDelete(req.params.id);
    res.json({ message: 'Election deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};