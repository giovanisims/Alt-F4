const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "puc@1234",
    database: "altf4",
    port: 3305
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database");
});

module.exports = con;