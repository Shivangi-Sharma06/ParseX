const { calculateMatch } = require('../services/matchingService');

const DEMO_USER_ID = '64f000000000000000000001';
const DEMO_ROLE = 'recruiter';

const now = Date.now();

const demoJobsTemplate = [
  {
    _id: '64a000000000000000000001',
    title: 'Web3 Engineer',
    description:
      'Build decentralized applications, smart contracts, and blockchain integrations for product workflows.',
    requiredSkills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'Node.js'],
    createdAt: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    _id: '64a000000000000000000002',
    title: 'Backend Engineer',
    description:
      'Design robust APIs and microservices with Node.js, MongoDB, and cloud deployment practices.',
    requiredSkills: ['Node.js', 'MongoDB', 'Express', 'REST API', 'PostgreSQL'],
    createdAt: new Date(now - 4 * 86400000).toISOString(),
  },
  {
    _id: '64a000000000000000000003',
    title: 'Senior Frontend Engineer',
    description:
      'Lead UI delivery with React and TypeScript while improving performance and design consistency.',
    requiredSkills: ['React', 'JavaScript', 'Tailwind', 'TypeScript'],
    createdAt: new Date(now - 6 * 86400000).toISOString(),
  },
];

const demoCandidatesTemplate = [
  {
    _id: '64b000000000000000000001',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    education: ['BS Computer Science'],
    experience: '5+ years',
    resumeFile: 'sample-candidate.pdf',
    resumeText: 'Alice Johnson React JavaScript TypeScript CSS',
    aiAnalysis: {
      summary: 'Strong frontend engineer with product mindset.',
      strengths: ['Strong React expertise', 'Clean UI implementation'],
      concerns: ['Limited backend depth'],
      recommendation: 'Proceed to technical interview.',
      confidence: 91,
      generatedAt: new Date(now - 86400000).toISOString(),
      source: 'heuristic',
    },
    createdAt: new Date(now - 86400000).toISOString(),
  },
  {
    _id: '64b000000000000000000002',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    skills: ['Node.js', 'MongoDB', 'Express', 'JavaScript'],
    education: ['BS Information Technology'],
    experience: '4+ years',
    resumeFile: 'sample-candidate.pdf',
    resumeText: 'Bob Smith Node.js MongoDB Express JavaScript',
    aiAnalysis: {
      summary: 'Backend-oriented engineer with API and database experience.',
      strengths: ['API development', 'Database handling'],
      concerns: ['Needs stronger frontend exposure'],
      recommendation: 'Proceed to system design round.',
      confidence: 86,
      generatedAt: new Date(now - 2 * 86400000).toISOString(),
      source: 'heuristic',
    },
    createdAt: new Date(now - 2 * 86400000).toISOString(),
  },
  {
    _id: '64b000000000000000000003',
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    skills: ['React', 'Node.js', 'MongoDB', 'Python'],
    education: ['BS Computer Science', 'MS Data Science'],
    experience: '6+ years',
    resumeFile: 'sample-candidate.pdf',
    resumeText: 'Carol Davis React Node.js MongoDB Python',
    aiAnalysis: {
      summary: 'Balanced full-stack candidate with practical delivery experience.',
      strengths: ['Full-stack profile', 'Good collaboration skills'],
      concerns: ['Needs deeper cloud production exposure'],
      recommendation: 'Proceed to managerial round.',
      confidence: 89,
      generatedAt: new Date(now - 3 * 86400000).toISOString(),
      source: 'heuristic',
    },
    createdAt: new Date(now - 3 * 86400000).toISOString(),
  },
];

const demoUsersByEmail = new Map();
const demoUsersById = new Map();
const demoJobsByUser = new Map();
const demoCandidatesByUser = new Map();
const demoMatchesByUser = new Map();

const clone = (value) => JSON.parse(JSON.stringify(value));

const ensureDemoUser = ({ email = 'demo@parsex.local', username = 'Demo Recruiter' } = {}) => {
  const normalizedEmail = String(email || 'demo@parsex.local').toLowerCase();
  const existing = demoUsersByEmail.get(normalizedEmail);
  if (existing) {
    return existing;
  }

  const user = {
    _id: DEMO_USER_ID,
    id: DEMO_USER_ID,
    username: username || 'Demo Recruiter',
    email: normalizedEmail,
    role: DEMO_ROLE,
  };

  demoUsersByEmail.set(normalizedEmail, user);
  demoUsersById.set(user._id, user);
  return user;
};

const ensureUserStore = (userId = DEMO_USER_ID) => {
  if (!demoJobsByUser.has(userId)) {
    demoJobsByUser.set(userId, clone(demoJobsTemplate));
  }
  if (!demoCandidatesByUser.has(userId)) {
    const baseCandidates = clone(demoCandidatesTemplate).map((candidate) => ({
      ...candidate,
      recruiter: userId,
      updatedAt: candidate.createdAt,
    }));
    demoCandidatesByUser.set(userId, baseCandidates);
  }
  if (!demoMatchesByUser.has(userId)) {
    demoMatchesByUser.set(userId, []);
  }
};

const getUser = (userId = DEMO_USER_ID) => {
  const existing = demoUsersById.get(userId);
  if (existing) {
    return existing;
  }
  return ensureDemoUser();
};

const listJobs = (userId = DEMO_USER_ID) => {
  ensureUserStore(userId);
  return clone(demoJobsByUser.get(userId));
};

const listCandidates = (userId = DEMO_USER_ID) => {
  ensureUserStore(userId);
  return clone(demoCandidatesByUser.get(userId));
};

const createJob = (userId, { title, description, requiredSkills }) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const idSuffix = String(jobs.length + 1).padStart(6, '0');
  const job = {
    _id: `64a000000000000000${idSuffix}`,
    title,
    description,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.unshift(job);
  return clone(job);
};

const updateJob = (userId, jobId, payload) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const index = jobs.findIndex((job) => String(job._id) === String(jobId));
  if (index < 0) return null;
  jobs[index] = {
    ...jobs[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return clone(jobs[index]);
};

const deleteJob = (userId, jobId) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const index = jobs.findIndex((job) => String(job._id) === String(jobId));
  if (index < 0) return null;
  const [deleted] = jobs.splice(index, 1);
  const matches = demoMatchesByUser.get(userId) || [];
  demoMatchesByUser.set(
    userId,
    matches.filter((match) => String(match.jobId) !== String(jobId)),
  );
  return clone(deleted);
};

const createCandidate = (userId, payload) => {
  ensureUserStore(userId);
  const candidates = demoCandidatesByUser.get(userId);
  const idSuffix = String(candidates.length + 1).padStart(6, '0');
  const candidate = {
    _id: `64b000000000000000${idSuffix}`,
    recruiter: userId,
    name: payload.name,
    email: String(payload.email || '').toLowerCase(),
    skills: Array.isArray(payload.skills) ? payload.skills : [],
    education: Array.isArray(payload.education) ? payload.education : [],
    experience: payload.experience || '',
    resumeFile: payload.resumeFile || 'sample-candidate.pdf',
    resumeText: payload.resumeText || '',
    aiAnalysis: payload.aiAnalysis || {
      summary: `Sample candidate profile for ${payload.name}`,
      strengths: [],
      concerns: [],
      recommendation: 'Proceed to interview.',
      confidence: 80,
      generatedAt: new Date().toISOString(),
      source: 'heuristic',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  candidates.unshift(candidate);
  return clone(candidate);
};

const getCandidate = (userId, candidateId) => {
  ensureUserStore(userId);
  const candidates = demoCandidatesByUser.get(userId);
  return clone(candidates.find((candidate) => String(candidate._id) === String(candidateId)) || null);
};

const deleteCandidate = (userId, candidateId) => {
  ensureUserStore(userId);
  const candidates = demoCandidatesByUser.get(userId);
  const index = candidates.findIndex((candidate) => String(candidate._id) === String(candidateId));
  if (index < 0) return null;
  const [deleted] = candidates.splice(index, 1);
  const matches = demoMatchesByUser.get(userId) || [];
  demoMatchesByUser.set(
    userId,
    matches.filter((match) => String(match.candidateId) !== String(candidateId)),
  );
  return clone(deleted);
};

const runMatchesForJob = (userId, jobId) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const candidates = demoCandidatesByUser.get(userId);
  const matches = demoMatchesByUser.get(userId);
  const job = jobs.find((item) => String(item._id) === String(jobId));
  if (!job) return null;

  const ranked = candidates
    .map((candidate) => {
      const { score, matchedSkills } = calculateMatch(candidate.skills, job.requiredSkills);
      const existing = matches.find(
        (match) =>
          String(match.candidateId) === String(candidate._id) && String(match.jobId) === String(job._id),
      );

      if (existing) {
        existing.matchScore = score;
        existing.matchedSkills = matchedSkills;
        existing.updatedAt = new Date().toISOString();
        return existing;
      }

      const idSuffix = String(matches.length + 1).padStart(6, '0');
      const created = {
        _id: `64c000000000000000${idSuffix}`,
        candidateId: candidate._id,
        jobId: job._id,
        matchScore: score,
        matchedSkills,
        shortlisted: false,
        shortlistedAt: null,
        shortlistEmailStatus: 'not_sent',
        shortlistEmailError: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      matches.push(created);
      return created;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    job: clone(job),
    results: ranked.map((match) => ({
      _id: match._id,
      candidate: clone(candidates.find((candidate) => String(candidate._id) === String(match.candidateId)) || null),
      job: clone(job),
      matchScore: match.matchScore,
      matchedSkills: clone(match.matchedSkills || []),
      shortlisted: Boolean(match.shortlisted),
      shortlistedAt: match.shortlistedAt,
      shortlistEmailStatus: match.shortlistEmailStatus || 'not_sent',
    })),
  };
};

const getMatchesForJob = (userId, jobId) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const candidates = demoCandidatesByUser.get(userId);
  const matches = demoMatchesByUser.get(userId);
  const job = jobs.find((item) => String(item._id) === String(jobId));
  if (!job) return null;

  const results = matches
    .filter((match) => String(match.jobId) === String(jobId))
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((match) => ({
      _id: match._id,
      candidate: clone(candidates.find((candidate) => String(candidate._id) === String(match.candidateId)) || null),
      job: clone(job),
      matchScore: match.matchScore,
      matchedSkills: clone(match.matchedSkills || []),
      shortlisted: Boolean(match.shortlisted),
      shortlistedAt: match.shortlistedAt,
      shortlistEmailStatus: match.shortlistEmailStatus || 'not_sent',
    }));

  return { job: clone(job), results };
};

const getCandidateMatches = (userId, candidateId) => {
  ensureUserStore(userId);
  const jobs = demoJobsByUser.get(userId);
  const matches = demoMatchesByUser.get(userId);
  return matches
    .filter((match) => String(match.candidateId) === String(candidateId))
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((match) => ({
      ...clone(match),
      jobId: clone(jobs.find((job) => String(job._id) === String(match.jobId)) || null),
    }));
};

const updateShortlist = (userId, matchId, shortlisted) => {
  ensureUserStore(userId);
  const matches = demoMatchesByUser.get(userId);
  const match = matches.find((item) => String(item._id) === String(matchId));
  if (!match) return null;
  match.shortlisted = Boolean(shortlisted);
  match.shortlistedAt = shortlisted ? new Date().toISOString() : null;
  if (!shortlisted) {
    match.shortlistEmailStatus = 'not_sent';
    match.shortlistEmailError = '';
  }
  match.updatedAt = new Date().toISOString();
  return clone(match);
};

const markEmailSent = (userId, matchId) => {
  ensureUserStore(userId);
  const matches = demoMatchesByUser.get(userId);
  const match = matches.find((item) => String(item._id) === String(matchId));
  if (!match) return null;
  match.shortlisted = true;
  match.shortlistedAt = match.shortlistedAt || new Date().toISOString();
  match.shortlistEmailStatus = 'sent';
  match.shortlistEmailError = '';
  match.updatedAt = new Date().toISOString();
  return clone(match);
};

const getMatchById = (userId, matchId) => {
  ensureUserStore(userId);
  const matches = demoMatchesByUser.get(userId);
  return clone(matches.find((match) => String(match._id) === String(matchId)) || null);
};

module.exports = {
  DEMO_USER_ID,
  ensureDemoUser,
  getUser,
  listJobs,
  listCandidates,
  createJob,
  updateJob,
  deleteJob,
  createCandidate,
  getCandidate,
  deleteCandidate,
  runMatchesForJob,
  getMatchesForJob,
  getCandidateMatches,
  updateShortlist,
  markEmailSent,
  getMatchById,
};
