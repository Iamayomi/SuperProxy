const User = require('../models/userModel');
const qualify = require('../models/qualiModel');
const multer = require('multer');


const multerStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cb(null, 'img');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }

});


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not am image! Please upload only images', false);
  }
}

const upload = multer({
  Storage: multerFilter,
  fileeFilter: multerFilter
});


exports.uploadUserPhoto = upload.single('photo');

const filterObj = (userObj, ...fields) => {
  const newObj = {};
    Object.keys(userObj).forEach(el => {
        if(fields.includes(el)) newObj[el] = userObj[el];
    });
    console.log(newObj);
    return newObj;
};


exports.updateMe = async function (req, res, next) {

const filterBody = filterObj(req.body, 'firstName', 'lastName', "email");


const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
     new: true,
     runValidators: true
 });
    
  res.status(200).json({
      status: "success",
      data : {
          user: updateUser
      }
  })
    next();
};

exports.getAUser = async function(req, res, next){
    try{
//        if (!req.body.id) req.body.id = req.params.id;
        
    const getProfile = await User.findById(req.user.id).populate('phoneNumber notifications qualification');
    
    res.status(200).json({
        status: "success",
        data: {
            getProfile
        }
    });
        
    }catch(error){
       next(res.status(400).send(error.message));
    }
   next();
};


exports.getAllUser = async function(req, res, next){
    try{
    const getProfile = await User.find();
    
    res.status(200).json({
        status: "success",
        data: {
            getProfile
        }
    });
        
    }catch(error){
        res.status(400).send(error.message);
    }
};


exports.qualifyUser = async function(req, res, next){
  try{
      if (!req.body.id) req.body.id = req.user.id;
      const qualifyUser = await qualify.create({
          institution: req.body.institution,
          admissionYear: req.body.admissionYear,
          graduateYear: req.body.graduateYear,
          degree: req.body.degree,
          areaOfStudy: req.body.areaOfStudy,
          description: req.body.description,
          user: req.body.id
      });
      
       res.status(200).json({
        status: "success",
        data: {
            qualifications: qualifyUser
        }
    });
      
  }  catch(error){
     res.status(400).send(error.message);

  }
};








