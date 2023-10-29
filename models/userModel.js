const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
    trim: true,

    validate: [validator.isEmail, "Please provide a valid email"]
  },

  budget: {
    type: String,
  },

  job: {
    type: String,
  },

  skills: {
    type: Array
  },

  language: {
    type: String
  },
  totalEarned: {
    type: String
  },
  workingRate: {
    type: String
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: "user"
  },

  photo: String,

  bio: String,

  address: String,

  website: String,

  location: {
    type: String,
    required: true
  },

  lookingFor: {
    type: String
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    min: [8, "password must be at least 8"],
    select: false
  },

  confirmPassword: {
    type: String,
    required: [true, "Please provide your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },

      message: "Password aren't the same"
    }
  },


  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    select: false
  },


},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

userSchema.virtual('notifications', {
  ref: 'notifications',
  foreignField: 'user',
  localField: '_id'
});

userSchema.virtual('phoneNumber', {
  ref: 'phone',
  foreignField: 'user',
  localField: '_id'
});

userSchema.virtual('qualification', {
  ref: 'qualification',
  foreignField: 'user',
  localField: '_id'
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();


  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});


userSchema.methods.comparePassword = function (signinPassword, userPassword) {
  return bcrypt.compare(signinPassword, userPassword);
};


userSchema.methods.checkPasswordChangedAt = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimestamp;
  };

  return false;

};

module.exports = mongoose.model('User', userSchema);





