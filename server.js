const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const dataPath = path.join(__dirname, 'data.json');
app.get('/data', (req, res) => {
    res.sendFile(dataPath);
});

app.listen(PORT, () => {
    console.log(`Express sunucusu çalışıyor, PORT: ${PORT}`);
});