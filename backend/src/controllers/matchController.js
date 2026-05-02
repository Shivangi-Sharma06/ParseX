const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Match = require('../models/Match');
const { calculateMatch } = require('../services/matchingService');
const { sendShortlistEmail } = require('../services/emailService');
const { isDbConnected } = require('../config/db');
const {
  runMatchesForJob: runDemoMatchesForJob,
  getMatchesForJob: getDemoMatchesForJob,
  updateShortlist: updateDemoShortlist,
  markEmailSent: markDemoEmailSent,
} = require('../utils/demoStore');

const getUserId = (req) => req.user?.id || req.user?._id;

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
    if (!isDbConnected()) {
      const response = runDemoMatchesForJob(getUserId(req), req.params.jobId);
      if (!response) {
        return res.status(404).json({ message: 'Job not found' });
      }
      return res.json({
        job: response.job,
        count: response.results.length,
        results: response.results,
        mode: 'demo',
      });
    }

    const job = await Job.findOne({ _id: req.params.jobId, createdBy: getUserId(req) });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const candidates = await Candidate.find({ recruiter: getUserId(req) }).select('-resumeText');

    if (!candidates.length) {
      return res.json({
        job,
        count: 0,
        results: [],
      });
    }

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
    if (!isDbConnected()) {
      const response = getDemoMatchesForJob(getUserId(req), req.params.jobId);
      if (!response) {
        return res.status(404).json({ message: 'Job not found' });
      }
      return res.json({
        job: response.job,
        count: response.results.length,
        results: response.results,
        mode: 'demo',
      });
    }

    const job = await Job.findOne({ _id: req.params.jobId, createdBy: getUserId(req) });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const matches = await Match.find({ jobId: job._id })
      .populate('candidateId', '-resumeText')
      .sort({ matchScore: -1 });

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
    const shouldShortlist =
      typeof req.body?.shortlisted === 'boolean' ? req.body.shortlisted : true;

    if (!isDbConnected()) {
      const match = updateDemoShortlist(getUserId(req), req.params.matchId, shouldShortlist);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      return res.json({
        message: shouldShortlist ? 'Candidate shortlisted' : 'Candidate removed from shortlist',
        match,
        mode: 'demo',
      });
    }

    const match = await Match.findById(req.params.matchId).populate('candidateId').populate('jobId');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (String(match.jobId.createdBy) !== String(getUserId(req))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    match.shortlisted = shouldShortlist;
    match.shortlistedAt = shouldShortlist ? new Date() : null;

    if (!shouldShortlist) {
      match.shortlistEmailStatus = 'not_sent';
      match.shortlistEmailError = '';
      await match.save();
      return res.json({
        message: 'Candidate removed from shortlist',
        match,
      });
    }

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

const sendShortlistEmailForMatch = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const match = markDemoEmailSent(getUserId(req), req.params.matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      return res.json({
        message: 'Shortlist email sent successfully',
        match,
        mode: 'demo',
      });
    }

    const match = await Match.findById(req.params.matchId).populate('candidateId').populate('jobId');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (String(match.jobId.createdBy) !== String(getUserId(req))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await sendShortlistEmail({
      to: match.candidateId.email,
      candidateName: match.candidateId.name,
      jobTitle: match.jobId.title,
      score: match.matchScore,
    });

    match.shortlisted = true;
    match.shortlistedAt = match.shortlistedAt || new Date();
    match.shortlistEmailStatus = 'sent';
    match.shortlistEmailError = '';
    await match.save();

    return res.json({
      message: 'Shortlist email sent successfully',
      match,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send shortlist email', error: error.message });
  }
};

const emailAllShortlistedForJob = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const response = getDemoMatchesForJob(getUserId(req), req.params.jobId);
      if (!response) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const shortlisted = response.results.filter((item) => item.shortlisted);
      if (!shortlisted.length) {
        return res.status(400).json({ message: 'No shortlisted candidates found for this job' });
      }

      shortlisted.forEach((item) => {
        markDemoEmailSent(getUserId(req), item._id);
      });

      return res.json({
        message: 'Bulk shortlist email process completed',
        sentCount: shortlisted.length,
        failedCount: 0,
        total: shortlisted.length,
        mode: 'demo',
      });
    }

    const job = await Job.findOne({ _id: req.params.jobId, createdBy: getUserId(req) });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const matches = await Match.find({ jobId: job._id, shortlisted: true })
      .populate('candidateId')
      .populate('jobId');

    if (!matches.length) {
      return res.status(400).json({ message: 'No shortlisted candidates found for this job' });
    }

    let sentCount = 0;
    let failedCount = 0;

    await Promise.all(
      matches.map(async (match) => {
        try {
          await sendShortlistEmail({
            to: match.candidateId.email,
            candidateName: match.candidateId.name,
            jobTitle: match.jobId.title,
            score: match.matchScore,
          });

          match.shortlistEmailStatus = 'sent';
          match.shortlistEmailError = '';
          sentCount += 1;
        } catch (error) {
          match.shortlistEmailStatus = 'failed';
          match.shortlistEmailError = error.message;
          failedCount += 1;
        }

        await match.save();
      }),
    );

    return res.json({
      message: 'Bulk shortlist email process completed',
      sentCount,
      failedCount,
      total: matches.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to send shortlist emails', error: error.message });
  }
};

module.exports = {
  runMatchForJob,
  getMatchesForJob,
  shortlistCandidate,
  sendShortlistEmailForMatch,
  emailAllShortlistedForJob,
};
