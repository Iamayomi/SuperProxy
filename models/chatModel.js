const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "notification must belong to a user"]
    },
    
    text: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    },

   },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }

);

chatSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'fullName photo'
    });

    next();

});


module.exports = mongoose.model('chat', chatSchema);