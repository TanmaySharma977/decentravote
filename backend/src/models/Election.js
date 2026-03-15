const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  onChainId: {
    type: Number, // index in smart contract candidates array
  },
});

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Election title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    candidates: {
      type: [candidateSchema],
      validate: {
        validator: (arr) => arr.length >= 2,
        message: 'An election must have at least 2 candidates',
      },
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'closed'],
      default: 'upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    onChainElectionId: {
      type: Number, // ID in smart contract
      default: null,
    },
    txHash: {
      type: String, // transaction hash of creation tx
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: is election currently active?
electionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return now >= this.startTime && now <= this.deadline;
});

// Auto-update status based on dates
electionSchema.pre('save', function (next) {
  const now = new Date();
  if (now < this.startTime) this.status = 'upcoming';
  else if (now >= this.startTime && now <= this.deadline) this.status = 'active';
  else this.status = 'closed';
  next();
});

module.exports = mongoose.model('Election', electionSchema);
