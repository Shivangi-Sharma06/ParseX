const express = require('express');
const {
  uploadResume,
  getCandidates,
  getCandidateProfile,
  runCandidateAnalysis,
  getResumeFile,
} = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getCandidates);
router.get('/:candidateId', getCandidateProfile);
router.post('/:candidateId/analyze', runCandidateAnalysis);
router.get('/:candidateId/resume', getResumeFile);

module.exports = router;
