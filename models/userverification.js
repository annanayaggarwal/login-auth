const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
    userId:String,
    uniquestring:String,
    createdat:Date,
    expiredat:Date
})

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema)

module.exports = UserVerification;