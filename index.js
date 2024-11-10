const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());
app.use(express.static('pages'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

// Usar as rotas definidas nos arquivos separados
app.use(userRoutes);
app.use(productRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});