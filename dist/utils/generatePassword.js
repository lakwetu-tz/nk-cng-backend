"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const generatePassword = (length = 12) => {
    const charset = 'QWERTYUIOASDFGHJKLZXCVBNM123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};
exports.generatePassword = generatePassword;
