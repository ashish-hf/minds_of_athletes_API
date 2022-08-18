const con = require('../../database/connection');
const util = require('util');
const query = util.promisify(con.query).bind(con);
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const e = require('express');
var nodemailer = require('nodemailer');
var fs = require('fs');

class Userservice {
 
  //image upload
  static async upload(imageupload) {
    if (imageupload) {
      return "image uploaded successfully";
    }
    else {
      throw "File is empty";
    }
  }

  // publishArticle
  static async publishArticle(image,title,discription,created_at,isActive) {
        const result1 = await query("insert into home_page(image,title,discription,created_at,isActive) values(?,?,?,?,?)", [image,title,discription,created_at,isActive]);
        const result2 = await query('select * from home_page where id=?', [result1.insertId]);
        return result2[0];
      }
    
      // findAllArticle
  static async findAllArticle()
  {
    const res=await query("select * from home_page");
    return res;
  }
    
  // findAllPublished
  static async findAllPublished(){
    const result=await query("SELECT * FROM home_page WHERE isActive=true");
    return result;
  }
 
  // findSingleArticle
  static async findSingleArticle(id){
    const result=await query(`SELECT * FROM home_page WHERE id = ${id}`);
    return result[0];
  }
 
  // updateArticle
  static async changeArticle(image,title,discription,id){
    const result=await query("UPDATE home_page SET image = ?, title = ?, discription = ? WHERE id = ?",
    [image,title,discription,id]);
    return result;
  }

  // deleteArticle
  static async removeArticle(id){
    const result=await query(`DELETE FROM home_page WHERE id =${id}`);
    return result;
  }
  
  // deleteAllArticle
  static async removeAllArticle(){
    const result=await query("DELETE FROM home_page");
    return result;
  }

  // contactUs
static async contactUs(first_name,last_name,email,phone,message){
  const result=await query("insert into contact_us(first_name,last_name,email,phone,message) values(?,?,?,?,?)",[first_name,last_name,email,phone,message]);
  return result;
}

// createGallery
static async createGallery(id,image,created_at) {
  const result1 = await query("insert into gallery(id,image,created_at) values(?,?,?)", [id,image,created_at]);
  const result2 = await query("select * from gallery where id=?",[result1.insertId]);
  return result2[0];

}

// findGallery
static async findGallery()
{
  const res=await query("select * from gallery");
  return res;
}

// createBooking
static async createBooking(id,date,discription,time_slot_from,time_slot_to,created_at) {
  const result1 = await query("insert into skype_bookings(id,date,discription,time_slot_from,time_slot_to,created_at) values(?,?,?,?,?,?)", [id,date,discription,time_slot_from,time_slot_to,created_at]);
  const result2 = await query('select * from skype_bookings where id=?', [result1.insertId]);
  return result2[0];

}

// getBooking
static async getBooking()
{
  const res=await query("select * from skype_bookings");
  return res;
}

// webinar
static async postWebinar(id,video,title,discription,created_at) {
  const result1 = await query("insert into webinar_and_interviews(id,video,title,discription,created_at) values(?,?,?,?,?)", [id,video,title,discription,created_at]);
  const result2 = await query('select * from webinar_and_interviews where id=?', [result1.insertId]);
  return [result2[0], "user inserted successfully"];

}

// getWebinar
static async getWebinar()
{
  const res=await query("select * from webinar_and_interviews");
  return res;
}

// getWebinarSingle
static async getWebinarSingle(id){
  const result=await query(`SELECT * FROM webinar_and_interviews WHERE id = ${id}`);
  return result;
}

}
module.exports = Userservice;