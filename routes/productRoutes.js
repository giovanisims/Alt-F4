const express = require('express');
const router = express.Router();
const con = require('../db');

// Rota para obter todos os produtos
router.get('/products', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL, p.Type FROM product AS p";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            res.json(results);
        }
    });
});

// Rota GET para buscar produtos com base em um termo de pesquisa
router.get('/products/search', (req, res) => {
    const { q } = req.query; 
    const query = 'SELECT  ProductID, Name, Rating, Price, Stock, URL, Type FROM product WHERE Name LIKE ?';
    const searchValue = `%${q}%`;
  
    con.query(query, [searchValue], (err, results) => {
      if (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
      } else {
        res.status(200).json(results);
      }
    });
  });
  

// Rota para obter produtos por categoria (PC)
router.get('/productsPC', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL, p.Type FROM product AS p WHERE Type = 'Desktop'";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            res.json(results);
        }
    });
});

// Rota para obter produtos por categoria (Mobile)
router.get('/productsMobile', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL, p.Type FROM product AS p WHERE Type = 'Mobile'";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            res.json(results);
        }
    });
});

// Rota para obter produtos por categoria (Console)
router.get('/productsConsole', (req, res) => {
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL, p.Type FROM product AS p WHERE Type = 'Console'";

    con.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos', err);
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            res.json(results);
        }
    });
});

// Rota para obter um produto específico
router.get('/product', (req, res) => {
    const { id } = req.query;
    const query = "SELECT p.ProductID, p.Name, p.Rating, p.Price, p.Stock, p.URL, p.Type, p.Description FROM product AS p WHERE ProductID = ?";

    con.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto', err);
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ success: false, message: "Produto não encontrado" });
            }
        }
    });
});

router.post('/addProduct', (req, res) => {
    const { name, rating, price, stock, URL, type } = req.body;
    const query = "INSERT INTO product (ProductID, Name, Rating, Price, Stock, URL, Type) VALUES(?, ?, ?, ?, ?, ?, ?)";

    con.query('SELECT MAX(ProductID) AS maxProductID FROM product', (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro ao obter o último productID' });
        const newProductID = (result[0].maxProductID || 0) + 1;

        con.query(query, [newProductID, name, rating, price, stock, URL, type], (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao inserir o produto' });
            }
            res.json({ success: true, message: 'Produto adicionado com sucesso!' });
        });
    });
});

router.put('/editProduct/:id' , (req, res) =>{
    const productID = req.params.id;
    const { name, rating, price, stock, URL, type  } = req.body;

    const query = "UPDATE product SET Name = ?, Rating = ?, Price = ?, Stock = ?, URL = ?, Type = ? WHERE productID = ?";
    const productValues = [name, rating, price, stock, URL, type, productID];


    con.query(query, productValues, (err,results) =>{
        if (err) {
            return con.rollback(() => {
                res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela product' });
            });
        }
        res.json({ success: true, message: 'Dados atualizados com sucesso!' });
    })

})

router.post('/buy/:id', (req, res) => {
    const productID = req.params.id;
    const {quantity} = req.body;

    const querySelect = `SELECT Stock FROM Product WHERE ProductID = ?`;
    con.query(querySelect, [productID], (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar estoque.');

        const currentStock = results[0].Stock;

        if (currentStock < quantity) {
            return res.status(400).send('Estoque insuficiente.');
        }

        const newStock = currentStock - quantity;
        const queryUpdate = `UPDATE Product SET Stock = ? WHERE ProductID = ?`;

        con.query(queryUpdate, [newStock, productID], (err, results) => {
            if (err) return res.status(500).send('Erro ao atualizar estoque.');

            res.send({ message: 'Compra realizada com sucesso!', newStock });
        });
    });
});

router.put('/editStock/:id' , (req, res) =>{
    const productID = req.params.id;

    const query = "UPDATE product SET Stock = ? WHERE productID = ?";
    const productValues = [name, rating, price, stock, URL, type, productID];


    con.query(query, productValues, (err,results) =>{
        if (err) {
            return con.rollback(() => {
                res.status(500).json({ success: false, message: 'Erro ao atualizar dados na tabela product' });
            });
        }
        res.json({ success: true, message: 'Dados atualizados com sucesso!' });
    })

})

router.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM product WHERE productid =?";

    con.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto');
            res.status(500).json({ success: false, message: "Erro no servidor" });
        } else {
            if (result.affectedRows > 0) {
                res.json({ success: true, message: "Produto deletado com sucesso" });
            } else {
                res.status(404).json({ success: false, message: "Produto não encontrado" })
            }
        }
    })
})
module.exports = router;