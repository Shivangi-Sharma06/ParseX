const express = require('express');
const { runMatchForJob, getMatchesForJob } = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/:jobId/run', runMatchForJob);
router.get('/:jobId', getMatchesForJob);

module.exports = router;
