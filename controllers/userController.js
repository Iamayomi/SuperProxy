const User = require('../models/userModel');
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

//const filterObj = (obj, ...allowedField) => {
//  const newObj = {};
//  Object.keys(obj).forEach(el => {
//    if (allowedField.includes(el)) newObj[el] = obj[el];
//  });
//  return newObj;
//};

const fitrObj = (obj, val) => {
  const newObj = {};
   Object.keys(obj).forEach(el => { newObj[el] = obj[el];  
   });
  return newObj;
};

exports.updateMe = async function (req, res, next) {

//const filterBody = filterObj(req.body, "firstName", "lastName", "gender", "photo", "budget", "bio", "skills", "language", "totalEarned", "workingRate", "address", "website", "job");
    
const fitrBody = fitrObj(req.body, req.user);

const updateUser = await User.findByIdAndUpdate(req.user.id, fitrBody, {
    new: true,
    runValidators: true
});

res.status(200).json({
    status: "success",
    data: {
        user: updateUser
    }
})
    
};

















