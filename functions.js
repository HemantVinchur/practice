const crypto = require('crypto');

const hashPassword = (password) => {
    let obj = {};
    obj.salt = crypto.randomBytes(16).toString('hex');
    obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, `sha512`).toString('hex');
    return obj;
}

const validatePassword = (salt, password, hashPassword) => {
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');
    return hash === hashPassword;
}

module.exports = {
    hashPassword,
    validatePassword
}