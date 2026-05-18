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

    // 3. Periksa apakah tabel kosong. Jika kosong, isi otomatis dengan dummy laptop
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM kriteria');
    if (rows[0].count === 0) {
      console.log('💡 Database terdeteksi kosong. Menginisialisasi data dummy default laptop...');
      
      const criteria = [
        ['C1', 'Harga (Juta Rp)', 'cost', 0.3000],
        ['C2', 'Kualitas Layar (Skala 1-10)', 'benefit', 0.2500],
        ['C3', 'Performa Prosesor (Skala 1-10)', 'benefit', 0.2000],
        ['C4', 'Daya Tahan Baterai (Jam)', 'benefit', 0.1500],
        ['C5', 'Kapasitas RAM (GB)', 'benefit', 0.1000]
      ];
      for (const c of criteria) {
        await conn.query('INSERT INTO kriteria (id, name, type, weight) VALUES (?, ?, ?, ?)', c);
      }

      const alternatives = [
        ['A1', 'Asus ROG Zephyrus'],
        ['A2', 'MacBook Air M2'],
        ['A3', 'Lenovo ThinkPad X1'],
        ['A4', 'Acer Swift Go']
      ];
      for (const a of alternatives) {
        await conn.query('INSERT INTO alternatif (id, name) VALUES (?, ?)', a);
      }

      const scores = [
        ['A1', 'C1', 22.5000], ['A1', 'C2', 9.0000], ['A1', 'C3', 9.5000], ['A1', 'C4', 6.5000], ['A1', 'C5', 16.0000],
        ['A2', 'C1', 18.0000], ['A2', 'C2', 9.5000], ['A2', 'C3', 8.5000], ['A2', 'C4', 9.5000], ['A2', 'C5', 8.0000],
        ['A3', 'C1', 25.0000], ['A3', 'C2', 8.5000], ['A3', 'C3', 8.0000], ['A3', 'C4', 8.0000], ['A3', 'C5', 16.0000],
        ['A4', 'C1', 11.5000], ['A4', 'C2', 8.0000], ['A4', 'C3', 7.5000], ['A4', 'C4', 7.0000], ['A4', 'C5', 8.0000]
      ];
      for (const s of scores) {
        await conn.query('INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) VALUES (?, ?, ?)', s);
      }
      console.log('✅ Inisialisasi data dummy sukses!');
    }

    conn.release();
  } catch (err) {
    console.error('❌ Gagal melakukan inisialisasi database otomatis:', err.message);
    console.log('💡 Tip: Pastikan server MySQL lokal Anda berjalan dan konfigurasi .env Anda benar!');
  }
}

bootstrap();

module.exports = pool;
