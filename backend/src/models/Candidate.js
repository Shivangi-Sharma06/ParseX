const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: 'Unknown Candidate',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: '',
    },
    resumeFile: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      summary: {
        type: String,
        default: '',
      },
      strengths: {
        type: [String],
        default: [],
      },
      concerns: {
        type: [String],
        default: [],
      },
      recommendation: {
        type: String,
        default: '',
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      generatedAt: {
        type: Date,
      },
      source: {
        type: String,
        enum: ['openai', 'heuristic'],
        default: 'heuristic',
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Candidate', candidateSchema);
