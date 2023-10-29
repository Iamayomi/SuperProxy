const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    text: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "notification must belong to a user"]
    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }

);

chatSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName photo'
    });

    next();

});


module.exports = mongoose.model('chat', chatSchema);