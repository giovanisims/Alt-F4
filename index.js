let express = require('express');
let app = express();

const port = 3000;

app.use(express.static('./pages'))

app.get ('', (req, res) => {
    res.send('index');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});