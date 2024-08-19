let express = require('express');
let app = express();

const port = 3000;

app.use(express.static('./pages'))

app.get ('/hello', (req, res) => {
    res.send('Hello, World!');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});