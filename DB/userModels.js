const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next(); //Если пароль не изменён = действий не трубется
    this.password = crypto.createHash('sha512').update(this.password).digest('hex');
    next(); // По хорошему нужно добавить соль
});

UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.createHash('sha512').update(password).digest('hex');
    return this.password === hash;
};

module.exports = mongoose.model('User', UserSchema);
