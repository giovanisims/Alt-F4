const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('../db');
const { route } = require('./productRoutes');

// Rota para obter informações do usuário

router.get('/users', (req, res) => {
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

router.get('/user', (req, res) => {
    const { id } = req.query;
    const query = `
        SELECT 
            cI.ClientID, 
            cI.Name, 
            cI.Username, 
            cI.Email, 
            cI.CPF,
            DATE_FORMAT(cI.Birthdate, '%Y-%m-%d') AS BirthdateInput,
            a.Complement,
            a.City,
            a.State,
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
            cI.ClientID, cI.Name, cI.Username, cI.Email, cI.CPF, cI.Birthdate, a.Complement, a.City, a.State
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

// Rota para login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT clientID, email, password FROM client WHERE email = ?";
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
                res.json({ success: true, message: 'Login bem-sucedido', clientid: user.clientID });
            } else {
                res.status(401).json({ success: false, message: 'Senha incorreta' });
            }
        } catch (compareError) {
            console.error('Erro ao comparar a senha:', compareError);
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' });
        }
    });
});

// Rota para registro
router.post('/register', async (req, res) => {
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
                                const phoneQuery = "INSERT INTO phonenumber (numberID, number, fk_client_clientid) VALUES (?, ?, ?)";
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


router.put('/user/:id', async (req, res) => {
    const clientId = req.params.id;
    const { cpf, email, name, phoneNumber, birthdate, cep, city, state, address, houseNum, complement, username } = req.body;

    try {
        console.log("Iniciou a transação")
        // Iniciar a transação
        con.beginTransaction((err) => {
            if (err) return res.status(500).json({ success: false, message: 'Erro ao iniciar a transação' });
            console.log("Vai fazer update");
            // Atualizar dados na tabela `client`
            const clientQuery = "UPDATE client SET birthdate = ?, username = ?, email = ?, cpf = ?, name = ? WHERE clientID = ?";
            const clientValues = [birthdate, username, email, cpf, name, clientId];
            console.log(clientQuery);
            con.query(clientQuery, clientValues, (err, result) => {
                console.log(err, result)
                if (err) {
                    return con.rollback(() => {
                        res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela client' });
                    });
                }

                // Atualizar dados na tabela `address`
                const addressQuery = "UPDATE address SET cep = ?, complement = ?, address = ?, houseNum = ?, city = ?, state = ? WHERE clientID = ?";
                const addressValues = [cep, complement, address, houseNum, city, state, clientId];

                con.query(addressQuery, addressValues, (err, result) => {
                    console.log(err, result)
                    if (err) {
                        return con.rollback(() => {
                            res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela address' });
                        });
                    }

                    // Atualizar dados na tabela `phonenumber`
                    const phoneQuery = "UPDATE phonenumber SET number = ? WHERE clientID = ?";
                    const phoneValues = [phoneNumber, clientId];
                    console.log(phoneValues)
                    con.query(phoneQuery, phoneValues, (err, result) => {
                        console.log(err, result)
                        if (err) {
                            return con.rollback(() => {
                                res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela phonenumber' });
                            });
                        }

                        // Commit se todas as atualizações forem bem-sucedidas
                        con.commit((err) => {
                            if (err) {
                                return con.rollback(() => {
                                    res.status(500).json({ success: false, message: 'Erro ao fazer commit da transação' });
                                });
                            }
                            res.json({ success: true, message: 'Dados atualizados com sucesso!' });
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


router.delete('/users/:id', (req, res) => {
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

module.exports = router;