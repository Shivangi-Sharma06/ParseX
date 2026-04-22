const express = require('express');
const {
  runMatchForJob,
  getMatchesForJob,
  shortlistCandidate,
  sendShortlistEmailForMatch,
  emailAllShortlistedForJob,
} = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/:jobId/run', runMatchForJob);
router.get('/:jobId', getMatchesForJob);
router.patch('/shortlist/:matchId', shortlistCandidate);
router.post('/email/:matchId', sendShortlistEmailForMatch);
router.post('/:jobId/email-shortlisted', emailAllShortlistedForJob);

module.exports = router;
