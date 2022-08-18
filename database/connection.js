var mysql = require("mysql2");
var con = mysql.createConnection({
    app_port: process.env.APP_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // port: process.env.DB_PORT,
    charset: "utf8mb4",

});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;