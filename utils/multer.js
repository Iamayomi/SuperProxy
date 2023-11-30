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

module.exports = multer({
  Storage: multerFilter,
  fileFilter: multerFilter
});