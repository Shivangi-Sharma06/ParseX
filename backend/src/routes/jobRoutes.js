const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const { idParam, jobPayloadValidation, runValidation } = require('../middleware/validators');

const router = express.Router();

router.use(authMiddleware);
router.post('/', jobPayloadValidation, runValidation, createJob);
router.get('/', getJobs);
router.put('/:jobId', idParam('jobId'), jobPayloadValidation, runValidation, updateJob);
router.delete('/:jobId', idParam('jobId'), runValidation, deleteJob);

module.exports = router;
