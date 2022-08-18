const con = require('../../database/connection');
const { check, buildCheckFunction, validationResult } = require('express-validator');
const util = require('util');
const query = util.promisify(con.query).bind(con);
var jwt = require('jsonwebtoken');
const Userservice = require("./user.service");
class UserController {

  //signup
  static async signup(req, res) {
    const errors = await validationResult(req)
    let err = errors.array()
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: err[0].msg });
    }
    try {
      const { first_name, last_name, email, password } = req.body;
      const created_at = req.body.created_at || new Date();
      let user = await Userservice.signup(first_name, last_name, email, password, created_at);
      var token = jwt.sign({ id: user.id }, 'secret');
      return res.status(200).json({ message: "user account created successfully", user, token: token })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  //login
  static async login(req, res) {
    const errors = await validationResult(req)
    let err = errors.array()
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: err[0].msg });
    }
    try {
      const { email, password } = req.body
      let result = await Userservice.login(email, password)
      var token = jwt.sign({ id: result.id }, 'secret');
      let message = "Login Successfully";
      return res.status(200).json({ message, user: result, token: token })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  //forgot password
  static async forgotPassword(req, res) {
    try {
      const email = req.body.email
      let result = await Userservice.forgotPassword(email)
      return res.status(200).json({ message: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  //reset password
  static async resetPassword(req, res) {
    try {
      const { password, reset_token } = req.body;
      let result = await Userservice.resetPassword(reset_token, password)
      return res.status(200).json({ message: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  //change password
  static async changePassword(req, res) {
    try {
      const [row] = await query("SELECT * FROM `users` WHERE `id`=?", [req.id]);
      const { password, new_password } = req.body;
      let result = await Userservice.changePassword(password, new_password, row)
      return res.status(200).json({ message: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  //profile fetch
  static async userProfile(req, res) {
    try {
      const [row] = await query("SELECT * FROM `users` WHERE `id`=?", [req.id]);
      if (row.length > 0) {
        return res.json({ user: row[0] });
      }
      res.json({ user: row });
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }
}
module.exports = UserController
