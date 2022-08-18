require('dotenv').config();
const connnection = require('../../database/connection');
const util = require('util');
const query = util.promisify(connnection.query).bind(connnection);
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const e = require('express');
var nodemailer = require('nodemailer');
var fs = require('fs');
const email_id = process.env.EMAIL;
const password = process.env.PASSWORD;
class Userservice {
  //login
  static async login(email, password) {
    if (email) {
      const result = await query('select * from users where email =?', [email])
      if (result.length > 0) {
        let hash = await bcrypt.compare(password, result[0].password)
        if (!email) {
          throw "Email does not match";
        }
        else if (!hash) {
          throw "Password does not match";
        } else {
          return result[0];
        }
      }
      else {
        throw "user doesn't exist";
      }
    }

  }

  //signup
  static async signup(first_name, last_name, email, password, created_at) {
    if (email) {
      const result = await query('select * from users where email=?', [email])
      if (result.length > 0) {
        throw "user already exist";
      }
      else {
        let hash = await bcrypt.hash(password, 10)
        const insert = await query("insert into users(first_name,last_name,email,password,created_at) values(?,?,?,?,?)", [first_name, last_name, email, hash, created_at]);
        const user_detail = await query('select * from users where id=?', [insert.insertId]);
        return user_detail[0];

      }
    }
  }

  //forget password
  static async forgotPassword(email) {
    let digits = '0123456789';
    let reset_token = '';
    const result = await query('select * from users where email=?', [email]);
    let email_val = result[0] ? result[0].email : null
    console.log(email_val);
    if (result.length > 0) {
      for (let i = 0; i < 6; i++) {
        reset_token += digits[Math.floor(Math.random() * 10)];
      }
      await query('update users set reset_token=? where email=?', [reset_token, email]);
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 465,
        auth: {
          user: email_id,
          pass: password

        }
      });
      var mailOptions = {
        from: email_id,
        to: email_val,
        subject: 'Password Reset Link',
        text: 'Reset password token opt ' + ' ' + reset_token

      };
      smtpTransport.sendMail(mailOptions)
      return "email sent successfully";

    } else {
      throw "Email does not exits";
    }
  }

  //reset password
  static async resetPassword(reset_token, password) {
    const result = await query('select * from users where reset_token =?', [reset_token]);
    if (result.length > 0) {
      let updated = result[0].updated_at
      let updated_at = new Date(new Date(updated).getTime() + 1 * 60 * 1000).toISOString();
      const current_time = new Date(new Date().getTime()).toISOString();
      if (current_time > updated_at) {
        throw "token expired";
      }
      else {
        let hash = await bcrypt.hash(password, 10)
        await query('update users set password=? where reset_token=?', [hash, reset_token]);
        return "password reset successfully" ;
      }
    }
    else {
      throw "invalid token";
    }
  }

  //change password
  static async changePassword(password, new_password, row) {
    let hash = await bcrypt.compare(password, row.password)
    console.log(hash);
    if (!hash) {
      throw "Password does not match";
    } else {
      let hash_data = await bcrypt.hash(new_password, 12);
      await query('update users set password=? where id=?', [hash_data, row.id]);
      return "password change successfully";
    }
  }

}
module.exports = Userservice;