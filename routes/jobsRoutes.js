const express = require('express');
const jobController = require('../controllers/jobController');
const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');


const router = express.Router();

router.
use(authController.protect);

router.route('/find-jobs')
    .get(jobController.getAllJobs);

router.get('/jobPayment/:jobId', paymentController.paymentSession);

router.get('/distances/:latlng/unit/mi', jobController.getJobsDistances);

router.route('/findjobs-within/:distance/center/:latlng/unit/:unit')
    .get(jobController.getjobWithin);

router.route('/create-job')
    .post(jobController.createJob);


module.exports = router;































