const express = require('express');
var router = express.Router();
const HomeController = require('./home.controller');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const app = express();
app.use(express.static("./uploads"));

/*---------------Home Page-------------------*/
router.post('/uploadFile', upload.single('profile_image'), HomeController.uploadFile);
router.get('/getimage',HomeController.getImage);
router.post("/publish/article", HomeController.publishArticle);
router.get("/fetchPublishedArticle", HomeController.findAllArticle);
router.get("/isActive", HomeController.findAllPublished);
router.get("/article/:id", HomeController.findSingleArticle);
router.put("/article/:id", HomeController.changeArticle);
router.delete("/article/:id", HomeController.removeArticle);
router.delete("/articles", HomeController.removeAllArticle);

/*---------contact us-----------*/
router.post('/contactUs', HomeController.contactUs);

/*---------gallery-----------*/
router.post("/gallery", HomeController.createGallery);
router.get("/gallery", HomeController.findGallery);

/*----------------skype_bookings------------------*/
router.post("/createBooking", HomeController.createBooking);
router.get("/getBooking", HomeController.getBooking);

/*--------------------webinar_and_interviews----------------*/
router.post("/postWebinar", HomeController.postWebinar);
router.get("/getWebinar", HomeController.getWebinar);
router.get("/getWebinarId/:id", HomeController.getWebinarSingle);

module.exports = router;