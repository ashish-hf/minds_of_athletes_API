const { check, buildCheckFunction, validationResult } = require('express-validator');

exports.signup = [
    check('first_name', "Please enter an first name")
        .notEmpty()
        .escape()
        .trim(),
    check('last_name', "Please enter an last name")
        .notEmpty()
        .escape()
        .trim(),
    check('email', "enter the email address")
        .notEmpty()
        .escape(),
    check('email', "Invalid email address")
        .notEmpty()
        .escape()
        .trim().isEmail(),
    check('password', "Enter the password").notEmpty(),
    check('password', "the Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 })
];
exports.login = [
    check('email', "enter the email address")
        .notEmpty()
        .escape(),
    check('email', "Invalid email address")
        .notEmpty()
        .escape()
        .trim().isEmail(),
    check('password', "Enter the password").notEmpty(),
    check('password', "the Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 })
];
