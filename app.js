require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const path=require('path');
// const swaggermerge=require('swagger-merge');
const PORT = process.env.APP_PORT ;
console.log(PORT);
var bodyParser = require("body-parser");
var con = require("./database/connection");
const swaggerUi = require('swagger-ui-express');
const userSwagger=require("./modules/user/swagger.json");
const homeSwagger= require("./modules/home/swagger.json");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = require("./modules/home/home.route");
app.use("/", route);
// const route = require("./modules/user/user.route");
// app.use("/", route);
app.use('/uploads/small', express.static('uploads/small'));
app.use('/uploads/original', express.static('uploads/original'));
app.use('/uploads/medium', express.static('uploads/medium'));
app.use('/api-docs', express.static(path.join(__dirname, 'public')))
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(homeSwagger));
// const info = {
//     version: '1.0.0',
//       title: "Everlens v2",
//       descriptions: "Everlens version 2 api"
//   }
// merged = swaggermerge.merge(
//     [
//     userSwagger,
//     homeSwagger
//     ],
//     info,
//     '/api',
//     process.env.DOMAIN + ":" + process.env.APP_PORT,
//     process.env.SCHEME
//   )
//   console.log("Swagger link -",process.env.SCHEME + '://' + process.env.DOMAIN + ':' + process.env.APP_PORT + '/api-docs/#/' );
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(merged));
app.listen(PORT);

console.log(`Running at Port ${PORT}`);