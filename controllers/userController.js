const User = require('../models/userModel');
const upload = require('../utils/multer');
const factory = require('./factoryController');


exports.uploadUserPhoto = upload.single('photo');

const filterObj = (userObj, ...fields) => {
  const newObj = {};
    Object.keys(userObj).forEach(el => {
        if(fields.includes(el)) newObj[el] = userObj[el];
    });
    return newObj;
};


exports.updateMe = async function (req, res, next) {

const filterBody = filterObj(req.body,  'email', 'phoneNumber', 'address', 'photo', 'bio', 'website');


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


exports.addingSkills = async function (req, res, next){
    
  const addSkills = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
  }); 
    console.log(req.body);
    
    res.status(200).json({
      status: "success",
      data : {
          user: addSkills
      }
  })
    next();
};

exports.getMe = async function(req, res, next){
    try{
//        if (!req.body.id) req.body.id = req.params.id;
        
    const getProfile = await User.findById(req.user.id);
    
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
    const users = await User.find();
    
    res.status(200).json({
        status: "success",
        numsOfUser: users.length,
        data: {
            users
        }
    });
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
    next();
};


exports.updateEdu = async function(req, res, next){
  try{
      
      const filterBody = filterObj(req.body,  'degree', 'graduateYear', 'admissionYear', 'description', 'areaOfStudy', 'institution');


        const updateEdu = await User.findByIdAndUpdate(req.user.id, filterBody, {
             new: true,
             runValidators: true
         });

       res.status(200).json({
        status: "success",
        data: {
            qualifications: updateEdu
        }
    });
      
  }  catch(error){
     res.status(400).send(error.message);

  }
    next();
};

exports.delMe = async function(req, res, next){
    try{

        await User.findByIdAndUpdate(req.user.id, { active: false});

        res.status(204).json({
            status: "success",
            data: null
        });
    
     }  catch(error){
     res.status(400).send(error.message);

  }
   next(); 
};


exports.deleteUser = factory.deleteOne(User);
    




