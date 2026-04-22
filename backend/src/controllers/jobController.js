const Job = require('../models/Job');
const { normalizeText } = require('../utils/skills');

const parseSkillInput = (requiredSkills = []) =>
  (Array.isArray(requiredSkills) ? requiredSkills : String(requiredSkills).split(','))
    .map((skill) => normalizeText(skill).replace(/\s+/g, ''))
    .filter(Boolean);

const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;

    if (!title || !description || !requiredSkills) {
      return res.status(400).json({ message: 'Title, description and required skills are required' });
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills: parseSkillInput(requiredSkills),
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
};
