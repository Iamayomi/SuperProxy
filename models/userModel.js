const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  gender: {
    type: String,
  },

  phone: {
    type: String,
    trim: true

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

  file: {
    type: String
  },

  photo: String,

  bio: String,

  address: String,

  website: String,

  location: {
    type: String,
  },

  lookingFor: {
    type: String
  },


  institution: {
    type: String,
  },
  admissionYear: {
    type: String
  },
  graduateYear: {
    type: String
  },
  degree: {
    type: String
  },
  areaOfStudy: {
    type: String
  },
  description: {
    type: String
  },

  phoneOTP: {
    type: String,
  },

  phoneNumberExpire: Date,

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "password must be at least 8"],
    select: false
  },

  confirmPassword: {
    type: String,
    required: [true, "Please provide your password"],
    trim: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },

      message: "Password aren't the same"
    }
  },

  active: {
    type: Boolean,
    default: true,
    select: false

  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date

},

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

userSchema.virtual('chat', {
  ref: 'chat',
  foreignField: 'user',
  localField: '_id'
});

userSchema.virtual('notification', {
  ref: 'notification',
  foreignField: 'user',
  localField: '_id'
});

userSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`
});

userSchema.pre('save', function(next){
   if(!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now();
    next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();


  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createPhoneExpires = function () {
  return this.phoneNumberExpire = Date.now() + 10 * 60 * 1000;
};

userSchema.methods.comparePassword = function (signInPassword, userPassword) {
  return bcrypt.compare(signInPassword, userPassword);
};


userSchema.methods.checkPasswordChangedAt = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimestamp;
  };

  return false;

};

module.exports = mongoose.model('User', userSchema);





