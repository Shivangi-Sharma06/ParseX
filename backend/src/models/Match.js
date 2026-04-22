const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    shortlisted: {
      type: Boolean,
      default: false,
    },
    shortlistedAt: {
      type: Date,
      default: null,
    },
    shortlistEmailStatus: {
      type: String,
      enum: ['not_sent', 'sent', 'failed'],
      default: 'not_sent',
    },
    shortlistEmailError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

matchSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
