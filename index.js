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
    const query = "SELECT cI.ClientID, cI.Name,cI.Username, cI.Email, cI.CPF, DATE_FORMAT(cI.Birthdate, '%d/%m/%Y') AS Birthdate, GROUP_CONCAT(a.CEP SEPARATOR ', ') AS CEPs FROM client AS cI JOIN address AS a ON cI.ClientID = a.ClientID GROUP BY cI.ClientID LIMIT 0, 1000;";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('/user', (req, res) => {
    const { id } = req.query;
    const query = `
        SELECT 
            cI.ClientID, 
            cI.Name, 
            cI.Username, 
            cI.Email, 
            cI.CPF,
            GROUP_CONCAT(DISTINCT pN.number SEPARATOR ', ') AS PhoneNumbers,
            DATE_FORMAT(cI.Birthdate, '%d/%m/%Y') AS Birthdate,
            GROUP_CONCAT(DISTINCT a.CEP SEPARATOR ', ') AS CEPs,
            GROUP_CONCAT(DISTINCT a.Address SEPARATOR ', ') AS Addresses,
            GROUP_CONCAT(DISTINCT a.HouseNum SEPARATOR ', ') AS HouseNumbers,
            GROUP_CONCAT(DISTINCT a.Complement SEPARATOR ', ') AS Complements
        FROM 
            client AS cI
        JOIN 
            address AS a ON cI.ClientID = a.ClientID
        JOIN 
            phoneNumber AS pN ON cI.ClientID = pN.clientID
        WHERE 
            cI.ClientID = ?
        GROUP BY 
            cI.ClientID
        LIMIT 0, 1000;
    `;

    con.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário', err);
            res.status(500).send("Erro no servidor");
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send("Usuário não encontrado");
            }
        }
    });
});

app.get('/products', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price , p.Stock, p.Type FROM product as p";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

app.get('/product', (req, res) => {
    const { id } = req.query;
    const query = "SELECT p.ProductID, p.Name , p.Rating, p.Price , p.Stock, p.URL, p.Type FROM product AS p   WHERE ProductID =?";

    con.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto', err);
            res.status(500).send("Erro no servidor");
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send("Produto não encontrado");
            }
        }
    });
})

app.get('/productsPC', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL FROM product as p WHERE p.Type = 'Desktop' && p.Stock <> 0 ;";

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
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL FROM product as p WHERE p.Type = 'Mobile' && p.Stock <> 0 ; ";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})
app.get('/productsConsole', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL FROM product as p WHERE p.Type = 'Console' && p.Stock <> 0 ; ";

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

    const query = "SELECT  ClientID, email, password FROM client WHERE email = ?";
    con.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
        }

        const user = results[0];

        if (!user.password) {
            return res.status(500).json({ success: false, message: 'Senha não encontrada no servidor' });
        }

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                res.json({ success: true, message: 'Login bem-sucedido', clientid: user.ClientID });
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
            con.query('SELECT MAX(clientID) AS maxClientId FROM client', (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último clientID' });
                const newClientID = (result[0].maxClientId || 0) + 1;

                // Inserir na tabela `client`
                const clientQuery = "INSERT INTO client (clientID, password, birthdate, username, email, cpf, name) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const clientValues = [newClientID, hashedPassword, birthdate, username, emailR, cpf, name];

                con.query(clientQuery, clientValues, (err, result) => {
                    if (err) {
                        return con.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erro ao inserir dados na tabela client' });
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
                                const phoneQuery = "INSERT INTO phonenumber (numberID, number, clientid) VALUES (?, ?, ?)";
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

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;

    const query = "DELETE FROM client WHERE clientid =?";

    con.query(query, [id], (err, result) => {
        if(err){
            console.error('Erro ao deletar usuário');
            res.status(500).json({success: false, message:"Erro no servidor"});
        } else {
            if(result.affectedRows > 0){
                res.json({success: true, message:"Usuário deletado com sucesso"});
            } else{
                res.status(404).json({success: false, message:"Usuário não encontrado"})
            }
        }
    })
})

app.delete('/products/:id', (req, res) => {
    const {id} = req.params;

    const query = "DELETE FROM product WHERE productid =?";

    con.query(query, [id], (err, result) => {
        if(err){
            console.error('Erro ao deletar produto');
            res.status(500).json({success: false, message:"Erro no servidor"});
        } else {
            if(result.affectedRows > 0){
                res.json({success: true, message:"Produto deletado com sucesso"});
            } else{
                res.status(404).json({success: false, message:"Produto não encontrado"})
            }
        }
    })
})

//... seu código existente

// Endpoint para busca de produtos
app.get('/searchProducts', (req, res) => {
    const { query } = req.query; // Recebe o parâmetro de pesquisa na URL
    const sqlQuery = `
        SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.Type, p.URL 
        FROM product AS p 
        WHERE p.Name LIKE ? OR p.Type LIKE ?;`;

    // Usa o operador LIKE para busca parcial
    con.query(sqlQuery, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    });
});

// Endpoint para busca de clientes
app.get('/searchUsers', (req, res) => {
    const { query } = req.query; // Recebe o parâmetro de pesquisa na URL
    const sqlQuery = `
        SELECT cI.ClientID, cI.Name, cI.Username, cI.Email, cI.CPF,
               DATE_FORMAT(cI.Birthdate, '%d/%m/%Y') AS Birthdate,
               GROUP_CONCAT(a.CEP SEPARATOR ', ') AS CEPs
        FROM client AS cI
        LEFT JOIN address AS a ON cI.ClientID = a.ClientID
        WHERE cI.Name LIKE ? OR cI.Username LIKE ? OR cI.Email LIKE ?
        GROUP BY cI.ClientID;`;

    con.query(sqlQuery, [`%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    });
});




app.get('', (req, res) => {
    res.send('index');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});