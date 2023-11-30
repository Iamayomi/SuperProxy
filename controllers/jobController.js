const Job = require('../models/jobModel');
const apiProperties = require('../utils/apiFeature');
const AppError = require('../utils/appError');
const errorAsync = require('../utils/errorAsync');

const cookiesOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIEs_EXPIRES * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: 'lax'
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

exports.getAllJobs = errorAsync(async function (req, res, next) {
  
    const properties = new apiProperties(Job.find(), req.query)
      .filter()
      .sorting()
      .reducesfields()
      .pagination();

    const jobs = await properties.query;

    res.cookie('jwt', cookiesOptions);

    res.status(200).json({
      status: "success",
      result: jobs.length,
      data: {
        jobs
      }
    });
});


exports.createJob = errorAsync(async function(req, res, next) {
    const createJob = await Job.create(req.body);
	console.log(req.user.email);
	createJob.email = req.user.email;
	await createJob.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        createJob
      }
    });
});

exports.getjobWithin = errorAsync(async function(req, res, next) {
    const { distance, latlng, unit } = req.params;
    
    const [lat, lng] = latlng.split(', ');
    
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
    
    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the formt lat, lang', 400))
    };
    
    const getJob = await Job.find({
        startLocation: { $geoWithin: { $centerSphere: [[lat, lng], radius ]} }
    });
    
    res.status(200).json({
      status: "success",
        results: getJob.length,
         data: {
            data: getJob
      }
    });
});


exports.getJobsDistances = errorAsync(async function(req, res, next) {
    const { distance, latlng, unit } = req.params;
    
    const [lat, lng] = latlng.split(', ');
    
    const multiplier = unit === 'mi' ? 0.000621371  : 0.001;
    
    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the formt lat, lang', 400))
    };
    
    const distances = await Job.aggregate([
        {
            $geoNear: {
               near: {
                 type: 'Point',
                 coordinates: [lng * 1, lat * 1]
               },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                job: 1,
                jobCategories: 1,
                jobDescription: 1
            }
        }
    ])
    
     res.status(200).json({
      status: "success",
        results: distances.length,
         data: {
            data: distances
      }
    });
});