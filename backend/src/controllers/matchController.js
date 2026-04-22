const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Match = require('../models/Match');
const { calculateMatch } = require('../services/matchingService');
const { sendShortlistEmail } = require('../services/emailService');

const toResultItem = ({ matchDoc, candidate, job }) => ({
  _id: matchDoc._id,
  candidate,
  job,
  matchScore: matchDoc.matchScore,
  matchedSkills: matchDoc.matchedSkills,
  shortlisted: matchDoc.shortlisted,
  shortlistedAt: matchDoc.shortlistedAt,
  shortlistEmailStatus: matchDoc.shortlistEmailStatus,
});

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

        return toResultItem({ matchDoc, candidate, job });
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

    const matches = await Match.find({ jobId: job._id }).populate('candidateId').sort({ matchScore: -1 });

    const results = matches.map((match) =>
      toResultItem({
        matchDoc: match,
        candidate: match.candidateId,
        job,
      }),
    );

    return res.json({
      job,
      count: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
};

const shortlistCandidate = async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate('candidateId').populate('jobId');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (String(match.jobId.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    match.shortlisted = true;
    match.shortlistedAt = new Date();

    try {
      await sendShortlistEmail({
        to: match.candidateId.email,
        candidateName: match.candidateId.name,
        jobTitle: match.jobId.title,
        score: match.matchScore,
      });

      match.shortlistEmailStatus = 'sent';
      match.shortlistEmailError = '';
    } catch (emailError) {
      match.shortlistEmailStatus = 'failed';
      match.shortlistEmailError = emailError.message;
    }

    await match.save();

    return res.json({
      message: 'Candidate shortlisted',
      match,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to shortlist candidate', error: error.message });
  }
};

module.exports = {
  runMatchForJob,
  getMatchesForJob,
  shortlistCandidate,
};
