const express = require('express');
const {
  uploadResume,
  getCandidates,
  getCandidateProfile,
  runCandidateAnalysis,
  getResumeFile,
  deleteCandidate,
} = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const { idParam, runValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware);
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getCandidates);
router.get('/:candidateId', idParam('candidateId'), runValidation, getCandidateProfile);
router.post('/:candidateId/analyze', idParam('candidateId'), runValidation, runCandidateAnalysis);
router.get('/:candidateId/resume', idParam('candidateId'), runValidation, getResumeFile);
router.delete('/:candidateId', idParam('candidateId'), runValidation, deleteCandidate);

module.exports = router;
