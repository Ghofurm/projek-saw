const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};
const dbName = process.env.DB_NAME || 'spk_saw_db';

// Membuat pool koneksi database MySQL
const pool = mysql.createPool({
  ...dbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fungsi inisialisasi otomatis database dan tabel (Auto-Bootstrap)
async function bootstrap() {
  try {
    // 1. Pastikan database target sudah dibuat di server MySQL
    const tempConn = await mysql.createConnection(dbConfig);
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await tempConn.end();

    // 2. Uji koneksi pool & buat tabel secara otomatis jika belum terdaftar
    const conn = await pool.getConnection();
    console.log(`✅ MySQL Connected successfully to database: "${dbName}"`);

    // Buat tabel Kriteria
    await conn.query(`
      CREATE TABLE IF NOT EXISTS kriteria (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('benefit', 'cost') NOT NULL,
        weight DECIMAL(5, 4) NOT NULL
      )
    `);

    // Buat tabel Alternatif
    await conn.query(`
      CREATE TABLE IF NOT EXISTS alternatif (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    // Buat tabel Nilai Alternatif (Matriks Keputusan)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS nilai_alternatif (
        alternatif_id VARCHAR(50),
        kriteria_id VARCHAR(50),
        score DECIMAL(10, 4) NOT NULL,
        PRIMARY KEY (alternatif_id, kriteria_id),
        FOREIGN KEY (alternatif_id) REFERENCES alternatif(id) ON DELETE CASCADE,
        FOREIGN KEY (kriteria_id) REFERENCES kriteria(id) ON DELETE CASCADE
      )
    `);

    // 3. Database siap digunakan dalam keadaan bersih
    console.log('💡 Database terdeteksi bersih dan siap digunakan.');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal melakukan inisialisasi database otomatis:', err.message);
    console.log('💡 Tip: Pastikan server MySQL lokal Anda berjalan dan konfigurasi .env Anda benar!');
  }
}

bootstrap();

module.exports = pool;
