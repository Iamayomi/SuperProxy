const mongoose = require('mongoose');
const userModel = require('./userModel');

const findJobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  photo: {
    type: String
  },

  jobCategories: {
    type: String,
    required: true,
    select: false
  },

  budget: {
    type: String,
    required: true
  },

  coverLetter: {
    type: String,
    required: true,
    select: false
  },

  attachments: {
    type: String,
    required: true,
    select: false
  },

  duration: {
    type: String,
    required: true
  },

  job: {
    type: String,
    required: true
  },

  jobDescription: {
    type: String,
    required: true
  },

  location: {
    type: String
  },

  level: {
    type: String,
    required: true,
    select: false
  },

  createdTime: {
    type: Date,
    default: Date.now()
  }

},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

findJobSchema.virtual('notifications', {
  ref: 'notifications',
  foreignField: 'user',
  localField: '_id'
});

findJobSchema.virtual('chat', {
  ref: 'chat',
  foreignField: 'user',
  localField: '_id'
});

module.exports = mongoose.model('findJob', findJobSchema);