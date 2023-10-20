const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    country: String,
    phoneNumber: String,
    city: String,
    state: String,
    gender: String,
    code: {
        type: Number,
        unique: true
        //        default: Math.floor((Math.random() * 1000000) + 1)
    }

});

module.exports = mongoose.model('verifyId', idSchema);
