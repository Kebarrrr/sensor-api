const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Endpoint untuk mendapatkan semua data
app.get('/api/gas-levels', (req, res) => {
    db.all('SELECT * FROM gas_levels', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ status: 'success', data: rows });
    });
});

// Endpoint untuk menambahkan data
app.post('/api/gas-levels', (req, res) => {
    const { co2, nh3, nox } = req.body;

    if (!co2 || !nh3 || !nox) {
        return res.status(400).json({ error: 'Semua data harus diisi!' });
    }

    const query = 'INSERT INTO gas_levels (co2, nh3, nox) VALUES (?, ?, ?)';
    const params = [co2, nh3, nox];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ status: 'success', id: this.lastID });
    });
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
