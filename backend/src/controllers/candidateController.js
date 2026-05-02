const path = require('path');
const fs = require('fs/promises');
const Candidate = require('../models/Candidate');
const Match = require('../models/Match');
const { parseResumeFile } = require('../services/resumeParserService');
const { generateCandidateAnalysis } = require('../services/aiAnalysisService');
const { isDbConnected } = require('../config/db');
const {
  listCandidates: listDemoCandidates,
  createCandidate: createDemoCandidate,
  getCandidate: getDemoCandidate,
  getCandidateMatches: getDemoCandidateMatches,
  deleteCandidate: deleteDemoCandidate,
} = require('../utils/demoStore');

const getUserId = (req) => req.user?.id || req.user?._id;

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

const createCandidate = async (req, res) => {
  try {
    const { name, email, skills, education, experience } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    if (!isDbConnected()) {
      const candidate = createDemoCandidate(getUserId(req), {
        name,
        email,
        skills: Array.isArray(skills) ? skills : [],
        education: Array.isArray(education) ? education : [],
        experience: experience || '',
        resumeFile: 'sample-candidate.pdf',
      });

      return res.status(201).json({
        message: 'Sample candidate created successfully',
        candidate,
        mode: 'demo',
      });
    }

    const candidate = await Candidate.create({
      recruiter: getUserId(req),
      name,
      email,
      skills: Array.isArray(skills) ? skills : [],
      education: Array.isArray(education) ? education : [],
      experience: experience || '',
      resumeFile: 'sample-candidate.pdf',
      aiAnalysis: {
        summary: `Sample candidate profile for ${name}`,
        strengths: skills ? skills.slice(0, 2) : [],
        concerns: [],
        generatedAt: new Date(),
      },
    });

    return res.status(201).json({
      message: 'Sample candidate created successfully',
      candidate: toCandidateResponse(candidate),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create candidate', error: error.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    if (!isDbConnected()) {
      const fallbackName = path.parse(req.file.originalname || req.file.filename || 'Candidate').name;
      const candidate = createDemoCandidate(getUserId(req), {
        name: fallbackName || 'Demo Candidate',
        email: `${String(fallbackName || 'candidate').replace(/\s+/g, '.').toLowerCase()}@demo.local`,
        skills: ['React', 'Node.js', 'JavaScript'],
        education: ['BS Computer Science'],
        experience: '3+ years',
        resumeFile: req.file.filename || 'sample-candidate.pdf',
        resumeText: 'Demo resume content',
      });

      return res.status(201).json({
        message: 'Resume uploaded and parsed successfully',
        candidate,
        mode: 'demo',
      });
    }

    const parsedData = await parseResumeFile(req.file.path);

    const draftCandidate = {
      recruiter: getUserId(req),
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
    if (!isDbConnected()) {
      const candidates = listDemoCandidates(getUserId(req)).map((candidate) => {
        const { resumeText, ...rest } = candidate;
        return rest;
      });
      return res.json({ candidates, mode: 'demo' });
    }

    const candidates = await Candidate.find({ recruiter: getUserId(req) })
      .select('-resumeText')
      .sort({ createdAt: -1 });

    return res.json({ candidates });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch candidates', error: error.message });
  }
};

const getCandidateProfile = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const candidate = getDemoCandidate(getUserId(req), req.params.candidateId);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      const matches = getDemoCandidateMatches(getUserId(req), candidate._id);
      return res.json({
        candidate: toCandidateResponse(candidate),
        matches,
        mode: 'demo',
      });
    }

    const candidate = await Candidate.findOne({
      _id: req.params.candidateId,
      recruiter: getUserId(req),
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const matches = await Match.find({ candidateId: candidate._id })
      .populate('jobId', 'title description requiredSkills createdAt')
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

    if (!isDbConnected()) {
      const candidate = getDemoCandidate(getUserId(req), candidateId);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      return res.json({
        message: 'Candidate analysis generated',
        aiAnalysis: candidate.aiAnalysis || {
          summary: jobDescription
            ? `Demo analysis based on provided job description: ${jobDescription.substring(0, 100)}`
            : 'Demo AI analysis is available.',
          strengths: ['Strong problem-solving', 'Relevant technical stack'],
          concerns: ['Needs project-level deep-dive in interview'],
          recommendation: 'Proceed to technical round.',
          confidence: 84,
          generatedAt: new Date(),
          source: 'heuristic',
        },
        mode: 'demo',
      });
    }

    const candidate = await Candidate.findOne({
      _id: candidateId,
      recruiter: getUserId(req),
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
    if (!isDbConnected()) {
      return res.status(404).json({ message: 'Resume file not available in demo mode' });
    }

    const candidate = await Candidate.findOne({
      _id: req.params.candidateId,
      recruiter: getUserId(req),
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    return res.sendFile(path.resolve(__dirname, '../../uploads', candidate.resumeFile));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load resume file', error: error.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const deleted = deleteDemoCandidate(getUserId(req), req.params.candidateId);
      if (!deleted) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
      return res.json({ message: 'Candidate deleted successfully', mode: 'demo' });
    }

    const candidate = await Candidate.findOneAndDelete({
      _id: req.params.candidateId,
      recruiter: getUserId(req),
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await Match.deleteMany({ candidateId: candidate._id });

    if (candidate.resumeFile) {
      const resumePath = path.resolve(__dirname, '../../uploads', candidate.resumeFile);
      await fs.unlink(resumePath).catch(() => {});
    }

    return res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete candidate', error: error.message });
  }
};

module.exports = {
  createCandidate,
  uploadResume,
  getCandidates,
  getCandidateProfile,
  runCandidateAnalysis,
  getResumeFile,
  deleteCandidate,
};
