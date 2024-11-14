const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('../db');
const { route } = require('./productRoutes');

// Rota para obter informações do usuário

router.get('/users', (req, res) => {
    const query = "SELECT ClientID, Name, Username, Email, CPF, DATE_FORMAT(Birthdate, '%d/%m/%Y') AS Birthdate, CEP, PhoneNumber  FROM client AS cI; ";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).send("Erro no servidor");
        } else {
            res.json(results);
        }
    })
})

router.get('/users/search', (req, res) => {
    const { q } = req.query; 
    const query = `
    SELECT 
            ClientID, 
            Name, 
            Username, 
            Email, 
            CPF,
            DATE_FORMAT(Birthdate, '%d/%m/%Y') AS Birthdate,
            CEP,
            PhoneNumber
        FROM 
            client
        WHERE Name LIKE ?`;
    const searchValue = `%${q}%`;
  
    con.query(query, [searchValue], (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuarios:', err);
        res.status(500).json({ error: 'Erro ao buscar usuarios' });
      } else {
        res.status(200).json(results);
      }
    });
  });

router.get('/user', (req, res) => {
    const { id } = req.query;
    const query = `
       SELECT 
            ClientID, 
            Name, 
            Username, 
            Email, 
            CPF,
            DATE_FORMAT(Birthdate, '%Y-%m-%d') AS BirthdateInput,
            Complement,
            City,
            State,
            PhoneNumber,
            DATE_FORMAT(Birthdate, '%d/%m/%Y') AS Birthdate,
            CEP,
            Address,
            HouseNum
        FROM 
            client
        WHERE 
            ClientID = ?;    `;

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

            con.query('SELECT MAX(clientID) AS maxClientId FROM client', (err, result) => {
                if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último clientID' });
                const newClientID = (result[0].maxClientId || 0) + 1;

                const clientQuery = "INSERT INTO client (clientID, password, birthdate, username, email, cpf, name, phoneNumber, CEP, city, state, address, houseNum, complement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const clientValues = [newClientID, hashedPassword, birthdate, username, emailR, cpf, name, phone,cep,city,state,address,houseNum, complement];

                con.query(clientQuery, clientValues, (err, result) => {
                    console.log(err, result)
                    if (err) {
                        res.status(500).json({ success: false, message: 'Erro ao registrar' });
                    } else {
                        res.json({ success: true, message: 'Cadastro realizado com sucesso' });
                    }
                });
            }); 
        } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});


router.put('/user/:id', async (req, res) => {
    const clientId = req.params.id;
    const { cpf, email, name, phoneNumber, birthdate, cep, city, state, address, houseNum, complement, username, password } = req.body;

    try {
        console.log("Iniciou a transação")
        if(password){
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const clientQuery = `UPDATE Client
            SET 
            CPF = ?, 
            Email = ?, 
            Name = ?, 
            PhoneNumber = ?,
            Birthdate = ?, 
            CEP = ?, 
            City = ?, 
            State = ?, 
            Address = ?, 
            HouseNum = ?, 
            Complement = ?, 
            Username = ?,
            Password = ?
            WHERE 
                ClientID = ?
            ;`;
        const clientValues = [cpf, email, name, phoneNumber, birthdate, cep, city, state, address, houseNum, complement, username, hashedPassword, clientId];
        con.query(clientQuery, clientValues, (err, result) => {
            console.log(err, result)
            if (err) {
                res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela client' });
            } else {
                res.json({ success: true, message: 'Dados atualizados com sucesso' });
            }
        });
    }else{
        const clientQuery = `UPDATE Client
            SET 
            CPF = ?, 
            Email = ?, 
            Name = ?, 
            PhoneNumber = ?,
            Birthdate = ?, 
            CEP = ?, 
            City = ?, 
            State = ?, 
            Address = ?, 
            HouseNum = ?, 
            Complement = ?, 
            Username = ?
            WHERE 
                ClientID = ?
            ;`;
        const clientValues = [cpf, email, name, phoneNumber, birthdate, cep, city, state, address, houseNum, complement, username, clientId];
        con.query(clientQuery, clientValues, (err, result) => {
            console.log(err, result)
            if (err) {
                res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela client' });
            } else {
                res.json({ success: true, message: 'Dados atualizados com sucesso' });
            }
        });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});


router.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM client WHERE clientid =?";

    con.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar usuário');
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            if (result.affectedRows > 0) {
                res.json({ success: true, message: "Usuário deletado com sucesso" });
            } else {
                res.status(404).json({ success: false, message: "Usuário não encontrado" })
            }
        }
    })
})

module.exports = router;