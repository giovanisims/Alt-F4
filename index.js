let express = require('express');
let app = express();
const bcrypt = require('bcrypt');

app.use(express.json())
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

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT email, keyword FROM clientinfo WHERE email = ?";
    con.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
        }

        const user = results[0];

        if (!user.keyword) {
            return res.status(500).json({ success: false, message: 'Senha não encontrada no servidor' });
        }

        try {
            const passwordMatch = await bcrypt.compare(password, user.keyword);
            if (passwordMatch) {
                res.json({ success: true, message: 'Login bem-sucedido' });
            } else {
                res.status(401).json({ success: false, message: 'Senha incorreta' });
            }
        } catch (compareError) {
            console.error('Erro ao comparar a senha:', compareError);
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' });
        }
    });
});


app.post('/register', async (req, res) => {
    const { cpf, emailR, name, phone, birthdate, cep, city, state, address, houseNum, complement, username, passwordR } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordR, saltRounds);

        // Iniciar a transação
        con.beginTransaction((err) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao iniciar a transação' });

            // Obter o próximo `clientID` manualmente
            con.query('SELECT MAX(clientID) AS maxClientId FROM clientinfo', (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último clientID' });
                const newClientID = (result[0].maxClientId || 0) + 1;

                // Inserir na tabela `clientinfo`
                const clientInfoQuery = "INSERT INTO clientinfo (clientID, keyword, birthdate, login, email, cpf, name) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const clientInfoValues = [newClientID, hashedPassword, birthdate, username, emailR, cpf, name];

                con.query(clientInfoQuery, clientInfoValues, (err, result) => {
                    if (err) {
                        return con.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erro ao inserir dados na tabela clientinfo' });
                        });
                    }

                    // Obter o próximo `addressID` manualmente
                    con.query('SELECT MAX(addressID) AS maxAddressId FROM address', (err, result) => {
                        if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último addressID' });
                        const newAddressID = (result[0].maxAddressId || 0) + 1;

                        // Inserir na tabela `address`
                        const addressQuery = "INSERT INTO address (addressID, clientID, cep, complement, address, houseNum, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                        const addressValues = [newAddressID, newClientID, cep, complement, address, houseNum, city, state];

                        con.query(addressQuery, addressValues, (err, result) => {
                            if (err) {
                                return con.rollback(() => {
                                    res.status(500).json({ success: false, message: 'Erro ao inserir dados na tabela address' });
                                });
                            }

                            // Obter o próximo `numberID` manualmente
                            con.query('SELECT MAX(numberID) AS maxNumberId FROM phonenumber', (err, result) => {
                                if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último numberID' });
                                const newNumberID = (result[0].maxNumberId || 0) + 1;

                                // Inserir na tabela `phonenumber`
                                const phoneQuery = "INSERT INTO phonenumber (numberID, number, fk_clientinfo_clientid) VALUES (?, ?, ?)";
                                const phoneValues = [newNumberID, phone, newClientID];

                                con.query(phoneQuery, phoneValues, (err, result) => {
                                    if (err) {
                                        return con.rollback(() => {
                                            res.status(500).json({ success: false, message: 'Erro ao inserir dados na tabela phonenumber' });
                                        });
                                    }

                                    // Commit se todas as inserções forem bem-sucedidas
                                    con.commit((err) => {
                                        if (err) {
                                            return con.rollback(() => {
                                                res.status(500).json({ success: false, message: 'Erro ao fazer commit da transação' });
                                            });
                                        }
                                        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});




app.get('', (req, res) => {
    res.send('index');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});