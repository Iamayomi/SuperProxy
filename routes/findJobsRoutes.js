const express = require('express');
const findJobsController = require('../controllers/findJobsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .use(authController.protect);

router
    .route('/find-jobs')
    .get(findJobsController.getAllJobs);


module.exports = router;































