const mongoose = require('mongoose');


const googleSchema = new mongoose.Schema({
    id: String,
    name: String,
    provider: String,
    email: String
});

module.exports = mongoose.model('user', googleSchema);