"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mustAttentionIn;
const userConstants_1 = require("../constants/userConstants");
const MIN_PASSWORD = 5;
function hasCorrectEmailFormatRequired(email) {
    const [beforeDomain, afterDomain] = email.split("@");
    if (!beforeDomain || !afterDomain)
        return false;
    return true;
}
function hasMinPasswordLengthRequired(password) {
    if (password.length < MIN_PASSWORD)
        return false;
    return true;
}
function isCorrectPassword(password, confirmPassword) {
    if (password !== confirmPassword)
        return false;
    return true;
}
function mustAttentionIn(email, password, confirmPassword) {
    if (!hasCorrectEmailFormatRequired(email))
        return userConstants_1.userConstants.INVALID_EMAIL_ERROR;
    if (!hasMinPasswordLengthRequired(password))
        return userConstants_1.userConstants.INVALID_PASSWORD_ERROR;
    if (!isCorrectPassword(password, confirmPassword))
        return userConstants_1.userConstants.INCORRECT_PASSWORD;
}
