
const VoteRecord = require('../models/VoteRecord');
const Election   = require('../models/Election');

exports.castVote = async (req, res) => {
  try {
    const { electionId, candidateOnChainId } = req.body;
    const userId = req.user._id;

    const already = await VoteRecord.findOne({ user: userId, election: electionId });
    if (already) return res.status(400).json({ message: 'You have already voted' });

    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    if (new Date() > election.deadline) return res.status(400).json({ message: 'Voting has ended' });

    const candidate = election.candidates[candidateOnChainId];
    if (!candidate) return res.status(400).json({ message: 'Invalid candidate' });

    const record = await VoteRecord.create({
      user: userId,
      election: electionId,
      candidateIndex: candidateOnChainId,
    });

    res.json({
      message: 'Vote cast successfully',
      candidate: candidate.name,
      txHash: record._id.toString(), // use MongoDB ID as receipt until blockchain wired
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVoteStatus = async (req, res) => {
  try {
    const record = await VoteRecord.findOne({ user: req.user._id, election: req.params.electionId });
    res.json({
      hasVoted: !!record,
      candidateOnChainId: record?.candidateIndex ?? null,
      txHash: record?._id.toString() ?? null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    if (new Date() < election.deadline)
      return res.status(403).json({ message: 'Results available after deadline' });

    const records = await VoteRecord.find({ election: req.params.id });
    const results = election.candidates.map((c, i) => ({
      name:  c.name,
      votes: records.filter(r => r.candidateIndex === i).length,
    }));
    res.json({ election, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};