const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    
    projectName: String,
    
    category: String,
    
    DescribeService: String,
    
    Duration: String,
    
    Budget: String,
    
    file: String
                                          
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

notificationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'fullName photo'
    });

    next();
});
                   
module.exports = mongoose.model('notification', notificationSchema);
    
    
    
    
    
    
    
    
    