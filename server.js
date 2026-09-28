const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Port Dinamis untuk Railway
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sajikan file statis dari folder utama
app.use(express.static(path.join(__dirname)));

// 2. Handling Koneksi Database (Railway vs Lokal)
const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

let db;

if (dbUrl) {
    // Jalur Production (Railway): Membuat koneksi dari Connection String MYSQL_URL
    db = mysql.createConnection(dbUrl);
} else {
    // Jalur Development (Lokal / Laragon)
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'mainbadminton_db',
        port: process.env.DB_PORT || 3306
    });
}

db.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Terhubung ke database MySQL!');
    }
});

// Endpoint API Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            // Cetak error detail ke console Railway agar mudah di-debug
            console.error('Error saat query login:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];
            return res.json({
                success: true,
                message: 'Login berhasil!',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.json({ success: false, message: 'Email atau password salah!' });
        }
    });
});

// Route Tampilan HTML
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Jalankan Server pada 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
});