const express = require('express');
const {
  runMatchForJob,
  getMatchesForJob,
  shortlistCandidate,
  sendShortlistEmailForMatch,
  emailAllShortlistedForJob,
} = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');
const { idParam, shortlistValidation, runValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware);
router.post('/:jobId/run', idParam('jobId'), runValidation, runMatchForJob);
router.get('/:jobId', idParam('jobId'), runValidation, getMatchesForJob);
router.patch(
  '/shortlist/:matchId',
  idParam('matchId'),
  shortlistValidation,
  runValidation,
  shortlistCandidate,
);
router.post('/email/:matchId', idParam('matchId'), runValidation, sendShortlistEmailForMatch);
router.post('/:jobId/email-shortlisted', idParam('jobId'), runValidation, emailAllShortlistedForJob);

module.exports = router;
