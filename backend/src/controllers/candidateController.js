const path = require('path');
const Candidate = require('../models/Candidate');
const { parseResumeFile } = require('../services/resumeParserService');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const parsedData = await parseResumeFile(req.file.path);

    const candidate = await Candidate.create({
      recruiter: req.user._id,
      ...parsedData,
      resumeFile: req.file.filename,
    });

    return res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      candidate,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to parse resume', error: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    return res.json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
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
  getResumeFile,
};
