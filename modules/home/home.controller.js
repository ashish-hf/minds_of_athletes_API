const con = require('../../database/connection');
const util = require('util');
const { check, buildCheckFunction, validationResult } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const Userservice = require("./home.service");
const multer = require('multer');
const express = require("express");
const path=require('path');
const sharp = require("sharp");
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const port = process.env.APP_PORT;
const domain = process.env.DOMAIN;
app.use(express.static("./uploads"));


class UserController {

  //image upload
  static async uploadFile(req, res) {
    try {
      if (req.file) {
        const { buffer, originalname } = req.file;
        const timestamp = new Date().toISOString();
        const ref = `${timestamp}-${originalname}`;
        await sharp(buffer).webp({ quality: 1 }).toFile("./uploads/small/" + ref);
        const link1 = `http://${domain}:${port}/uploads/small/${ref}`;
        await sharp(buffer).webp({}).toFile("./uploads/original/" + ref);
        const link2 = `http://${domain}:${port}/uploads/original/${ref}`;
        await sharp(buffer).webp({ quality: 20 }).toFile("./uploads/medium/" + ref);
        const link3 = `http://${domain}:${port}/uploads/medium/${ref}`;
        let result = await Userservice.upload(originalname)
        return res.json({ ref });
      }
      else {
        throw 'invalid data';
      }
    }
    catch (err) {

      res.status(400).json({ err });
    }

  }

  //get image
  static async getImage(req, res) {
    try {
      let file = req.query.file
      res.sendFile(path.join(process.cwd(), './uploads/original/' + file));
    }
    catch (err) {
      res.status(400).json({
        error: "bad request",
        error_description: err
      });
    }
  }

  //publishArticle
  static async publishArticle(req, res) {
    try {
      const { image, title, discription } = req.body;
      const created_at = req.body.created_at || new Date();
      const isActive = req.body.isActive || true
      let result = await Userservice.publishArticle(image, title, discription, created_at, isActive);
      return res.status(200).json({ message: "user inserted successfully", record: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // findAllArticle
  static async findAllArticle(req, res) {
    try {
      let result = await Userservice.findAllArticle();
      return res.status(200).json({ records: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // findAllPublished
  static async findAllPublished(req, res) {
    try {
      let result = await Userservice.findAllPublished();
      return res.status(200).json({ records: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // findSingleArticle
  static async findSingleArticle(req, res) {
    try {
      let result = await Userservice.findSingleArticle(req.params.id);
      return res.status(200).json({ message: "record found", record: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // updateArticle
  static async changeArticle(req, res) {
    try {
      const id = req.params.id;
      const {image, title, discription } = req.body;
      let result = await Userservice.changeArticle(image, title, discription, id);
      return res.status(200).json({ message: "record updated", data: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // deleteArticle
  static async removeArticle(req, res) {
    try {
      let result = await Userservice.removeArticle(req.params.id);
      return res.status(200).json({ message: "deleted successfully", user: result })
    }
    catch (err) {
      // res.status(400).json({err});
      console.log(err);
    }
  }

  // deleteAllArticle
  static async removeAllArticle(req, res) {
    try {
      let result = await Userservice.removeAllArticle();
      return res.status(200).json({ data: result })
    }
    catch (err) {
      res.status(400).json({ err });
      console.log(err);
    }
  }

  // contactUs
  static async contactUs(req, res) {
    try {
      const { first_name, last_name, email, phone, message } = req.body;
      let result = await Userservice.contactUs(first_name, last_name, email, phone, message);
      return res.status(200).json({ data: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // createGallery
  static async createGallery(req, res) {
    try {
   const {id,image}=req.body;
      const created_at = req.body.created_at || new Date();
      let result = await Userservice.createGallery(id, image, created_at);
      return res.status(200).json({ message: "data inserted successfully", record: result });
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // findGallery
  static async findGallery(req, res) {
    try {
      let result = await Userservice.findGallery();
      console.log(result);
      return res.status(200).json({ data: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // createBooking
  static async createBooking(req, res) {
    try {
      const {id,date,discription,time_slot_from,time_slot_to}=req.body;
      const created_at = req.body.created_at || new Date();
      let result = await Userservice.createBooking(id, date, discription, time_slot_from, time_slot_to, created_at);
      return res.status(200).json({ data: "record inserted successfully" })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // getBooking
  static async getBooking(req, res) {
    try {
      let result = await Userservice.getBooking();
      return res.status(200).json({ records: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // postWebinar
  static async postWebinar(req, res) {
    try {
      const {id,video,title,discription}=req.body;
      const created_at = req.body.created_at || new Date();
      let result = await Userservice.postWebinar(id, video, title, discription, created_at);
      return res.status(200).json({ record: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // getWebinar
  static async getWebinar(req, res) {
    try {
      let result = await Userservice.getWebinar();
      return res.status(200).json({ data: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

  // getWebinarSingle
  static async getWebinarSingle(req, res) {
    try {
      let result = await Userservice.getWebinarSingle(req.params.id);
      return res.status(200).json({ data: result })
    }
    catch (err) {
      res.status(400).json({ err });
    }
  }

}
module.exports = UserController
