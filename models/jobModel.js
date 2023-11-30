const mongoose = require('mongoose');
const userModel = require('./userModel');


const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    
  photo: {
    type: String,
    required: true
  },
	
 email: {
    type: String,
  },

  jobCategories: {
    type: String,
//    select: false
  },

  price: {
    type: String,
    required: true
  },

  coverLetter: {
    type: String,
    select: false
  },

  attachments: {
    type: String,
    select: false
  },

  duration: {
    type: String,
    required: true
  },
    
  timeRate: {
    type: String,
    required: true
  },

  rating : {
    type: Number,
    Default: 1,
    max: [6, 'ratng must below 6']
},
    
  jobName: {
    type: String,
    required: true
  },

  jobDescription: {
    type: String
  },
    
    startLocation: {
       type: { 
         type: String,
         default: "Point",
         enum: ['Point']
    },
      coordinates:[Number],
      address: String,                                   
      description: String
    },

  locations: 
      {
       type: { 
         type: String,
         default: "Point",
         enum: ['Point']
    },
      coordinates:[Number],
      address: String,                                   
      description: String
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

jobSchema.index({startLocation: '2dsphere'});

jobSchema.virtual('priceRate').get(function() {
   return `${this.timeRate} rate - $${this.price}` 
});


jobSchema.virtual('invite', {
  ref: 'proposal',
  foreignField: 'user',
  localField: '_id'
});

jobSchema.virtual('chat', {
  ref: 'chat',
  foreignField: 'user',
  localField: '_id'
});

module.exports = mongoose.model('job', jobSchema);


