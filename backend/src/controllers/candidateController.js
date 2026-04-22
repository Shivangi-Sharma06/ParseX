const path = require('path');
const Candidate = require('../models/Candidate');
const Match = require('../models/Match');
const { parseResumeFile } = require('../services/resumeParserService');
const { generateCandidateAnalysis } = require('../services/aiAnalysisService');

const toCandidateResponse = (candidateDoc) => ({
  _id: candidateDoc._id,
  recruiter: candidateDoc.recruiter,
  name: candidateDoc.name,
  email: candidateDoc.email,
  skills: candidateDoc.skills,
  education: candidateDoc.education,
  experience: candidateDoc.experience,
  resumeFile: candidateDoc.resumeFile,
  aiAnalysis: candidateDoc.aiAnalysis,
  createdAt: candidateDoc.createdAt,
  updatedAt: candidateDoc.updatedAt,
});

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const parsedData = await parseResumeFile(req.file.path);

    const draftCandidate = {
      recruiter: req.user._id,
      ...parsedData,
      resumeFile: req.file.filename,
    };

    const aiAnalysis = await generateCandidateAnalysis({
      candidate: draftCandidate,
      resumeText: parsedData.resumeText,
    });

    const candidate = await Candidate.create({
      ...draftCandidate,
      aiAnalysis: {
        ...aiAnalysis,
        generatedAt: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      candidate: toCandidateResponse(candidate),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to parse resume', error: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ recruiter: req.user._id })
      .select('-resumeText')
      .sort({ createdAt: -1 });
    return res.json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
  }
};

const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.candidateId,
      recruiter: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const matches = await Match.find({ candidateId: candidate._id })
      .populate('jobId', 'title requiredSkills createdAt')
      .sort({ matchScore: -1 });

    return res.json({
      candidate: toCandidateResponse(candidate),
      matches,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch candidate profile', error: error.message });
  }
};

const runCandidateAnalysis = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { jobDescription = '' } = req.body || {};

    const candidate = await Candidate.findOne({
      _id: candidateId,
      recruiter: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const analysis = await generateCandidateAnalysis({
      candidate,
      jobDescription,
      resumeText: candidate.resumeText,
    });

    candidate.aiAnalysis = {
      ...analysis,
      generatedAt: new Date(),
    };

    await candidate.save();

    return res.json({
      message: 'Candidate analysis generated',
      aiAnalysis: candidate.aiAnalysis,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to run candidate analysis', error: error.message });
  }
};

const getResumeFile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.candidateId,
      recruiter: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    return res.sendFile(path.resolve(__dirname, '../../uploads', candidate.resumeFile));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load resume file', error: error.message });
  }
};

module.exports = {
  uploadResume,
  getCandidates,
  getCandidateProfile,
  runCandidateAnalysis,
  getResumeFile,
};
