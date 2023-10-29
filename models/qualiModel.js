const {Schema, model } = require('mongoose');

const qualSchema = new Schema({
  institution: {
    type: String,
    required: true
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

  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, "qualification must belong to a user"]
  },

},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

qualSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'institution'
  });

  next();

});

module.exports = model('qualification', qualSchema);
