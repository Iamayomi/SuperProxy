const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    phone: {
        type: String,
        trim: true,
        required: true
    },

    phoneOPT: String
});


module.exports = mongoose.model('phone', phoneSchema);





