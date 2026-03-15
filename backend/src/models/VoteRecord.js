const mongoose = require('mongoose');

const voteRecordSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  election:       { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidateIndex: { type: Number, required: true },
  txHash:         { type: String },
}, { timestamps: true });

voteRecordSchema.index({ user: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('VoteRecord', voteRecordSchema);