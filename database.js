const sqlite3 = require('sqlite3').verbose();

// Buat atau buka database
const db = new sqlite3.Database('data.db');

// Buat tabel jika belum ada
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS gas_levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            co2 REAL,
            nh3 REAL,
            nox REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
