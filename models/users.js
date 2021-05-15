const mongoose = require('mongoose')
const config = require('config');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({

    email: { type: String, required: true },
    password: String,
    isAdmin: { type: Boolean, default: false }
}, { versionKey: false });

// encapsulating logic in mongoose model
userSchema.methods.createJWT = function () {

    // const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'),{expiresIn:"1d"})
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, 'thisismyprivatekey',{expiresIn:"1d"})
    return token;
}
module.exports = mongoose.model('users', userSchema);

