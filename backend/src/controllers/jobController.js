const Job = require('../models/Job');
const Match = require('../models/Match');
const { normalizeText } = require('../utils/skills');
const { isDbConnected } = require('../config/db');
const {
  listJobs: listDemoJobs,
  createJob: createDemoJob,
  updateJob: updateDemoJob,
  deleteJob: deleteDemoJob,
} = require('../utils/demoStore');

const getUserId = (req) => req.user?.id || req.user?._id;

const parseSkillInput = (requiredSkills = []) => {
  const rawSkills = Array.isArray(requiredSkills) ? requiredSkills : String(requiredSkills).split(',');
  const parsedSkills = [];
  const seen = new Set();

  rawSkills.forEach((skill) => {
    const normalized = normalizeText(skill);

    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    parsedSkills.push(String(skill).trim());
  });

  return parsedSkills;
};

const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;

    if (!title || !description || !requiredSkills) {
      return res.status(400).json({ message: 'Title, description and required skills are required' });
    }

    if (!isDbConnected()) {
      const demoJob = createDemoJob(getUserId(req), {
        title,
        description,
        requiredSkills: parseSkillInput(requiredSkills),
      });
      return res.status(201).json({ message: 'Job created successfully', job: demoJob, mode: 'demo' });
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills: parseSkillInput(requiredSkills),
      createdBy: getUserId(req),
    });

    return res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const jobs = listDemoJobs(getUserId(req));
      return res.json({ jobs, mode: 'demo' });
    }

    const jobs = await Job.find({ createdBy: getUserId(req) }).sort({ createdAt: -1 });

    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;
    const parsedSkills = parseSkillInput(requiredSkills);

    if (!title || !description || !parsedSkills.length) {
      return res.status(400).json({ message: 'Title, description and required skills are required' });
    }

    if (!isDbConnected()) {
      const job = updateDemoJob(getUserId(req), req.params.jobId, {
        title,
        description,
        requiredSkills: parsedSkills,
      });

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      return res.json({ message: 'Job updated successfully', job, mode: 'demo' });
    }

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.jobId,
        createdBy: getUserId(req),
      },
      {
        title,
        description,
        requiredSkills: parsedSkills,
      },
      {
        new: true,
      },
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const deleted = deleteDemoJob(getUserId(req), req.params.jobId);
      if (!deleted) {
        return res.status(404).json({ message: 'Job not found' });
      }
      return res.json({ message: 'Job deleted successfully', mode: 'demo' });
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
      createdBy: getUserId(req),
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Match.deleteMany({ jobId: job._id });

    return res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};
