let express = require('express');
let app = express();

app.use(express.static('./pages'))

const port = 3000;

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "puc@123",
    database: "altf4",
    port: 3305
})

con.connect(function(err){
    if(err) throw err;
    console.log("Connected");
})

app.get('/products', (req, res) => {
    const query = "SELECT * FROM product";

    con.query(query, (err, results) => {
        if(err){
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        }else{
            res.json(results);
        }
    })
})

app.get ('', (req, res) => {
    res.send('index');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});