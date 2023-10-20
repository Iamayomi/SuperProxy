const findJobs = require('../models/findJobModel');
const apiProperties = require('../utils/apiFeature');


const cookiesOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIEs_EXPIRES * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: 'lax'
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

exports.getAllJobs = async function (req, res, next) {
  try {
    const properties = new apiProperties(findJobs.find(), req.query)
      .filter()
      .sorting()
      .fields()
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
  } catch (error) {
    next(res.status(404).send(error.message));
  }
};


