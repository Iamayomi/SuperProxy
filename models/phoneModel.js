const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        trim: true,
        required: true
    },

    phoneOPT: String,

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        //        required: [true, "notification must belong to a user"]
    }
});


module.exports = mongoose.model('phone', phoneSchema);





