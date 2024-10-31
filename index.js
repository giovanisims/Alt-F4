let express = require('express');
let app = express();

app.use(express.static('./pages'))

const port = 3000;

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "puc@1234",
    database: "altf4",
    port: 3305
})

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
})

app.get('/users', (req, res) => {
    const query = "SELECT cI.ClientID, cI.Name, cI.Login, cI.Email, cI.CPF, cI.Birthdate, a.CEP FROM clientinfo as cI JOIN address as a ON cI.ClientID = a.ClientID;";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('/products', (req, res) => {
    const query = "SELECT * FROM product";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('/productsPC', (req, res) => {
    const query = "SELECT p.Name, p.Rating, p.Price, p.Stock FROM product as p JOIN device as d ON p.ProductID = d.ProductID WHERE d.Type = 'PC'; ";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('/productsMobile', (req, res) => {
    const query = "SELECT p.Name, p.Rating, p.Price, p.Stock FROM product as p JOIN device as d ON p.ProductID = d.ProductID WHERE d.Type = 'Mobile'; ";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('', (req, res) => {
    res.send('index');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});