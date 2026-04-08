const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Match = require('../models/Match');
const { calculateMatch } = require('../services/matchingService');

const runMatchForJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, createdBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const candidates = await Candidate.find({ recruiter: req.user._id });

    const matchResults = await Promise.all(
      candidates.map(async (candidate) => {
        const { score, matchedSkills } = calculateMatch(candidate.skills, job.requiredSkills);

        const matchDoc = await Match.findOneAndUpdate(
          {
            candidateId: candidate._id,
            jobId: job._id,
          },
          {
            candidateId: candidate._id,
            jobId: job._id,
            matchScore: score,
            matchedSkills,
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );

        return {
          _id: matchDoc._id,
          candidate,
          job,
          matchScore: score,
          matchedSkills,
        };
      }),
    );

    const rankedCandidates = matchResults.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      job,
      count: rankedCandidates.length,
      results: rankedCandidates,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to run matching', error: error.message });
  }
};

const getMatchesForJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, createdBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const matches = await Match.find({ jobId: job._id })
      .populate('candidateId')
      .sort({ matchScore: -1 });

    const results = matches.map((match) => ({
      _id: match._id,
      candidate: match.candidateId,
      job,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills,
    }));

    return res.json({
      job,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
};

module.exports = {
  runMatchForJob,
  getMatchesForJob,
};
