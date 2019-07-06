const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    isVerified:{type: Boolean,default:false},
    isBlocked:{type: Boolean,default:false},
    isDeleted:{type: Boolean,default:false},
    firstName: String,
    lastName: String,
    email: String,
    countryCode: String,
    contactNo: String,
    password: String,
    salt: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('user', userSchema);
