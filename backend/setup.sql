-- Skrip SQL Inisialisasi Database SPK SAW Neobrutalism
-- Peringatan: Menjalankan skrip ini akan menghapus tabel lama (jika ada) dan membuat ulang.

CREATE DATABASE IF NOT EXISTS spk_saw_db;
USE spk_saw_db;

-- 1. Tabel Kriteria
CREATE TABLE IF NOT EXISTS kriteria (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('benefit', 'cost') NOT NULL,
  weight DECIMAL(5, 4) NOT NULL
);

-- 2. Tabel Alternatif
CREATE TABLE IF NOT EXISTS alternatif (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- 3. Tabel Nilai Alternatif (Matriks Keputusan)
CREATE TABLE IF NOT EXISTS nilai_alternatif (
  alternatif_id VARCHAR(50),
  kriteria_id VARCHAR(50),
  score DECIMAL(10, 4) NOT NULL,
  PRIMARY KEY (alternatif_id, kriteria_id),
  FOREIGN KEY (alternatif_id) REFERENCES alternatif(id) ON DELETE CASCADE,
  FOREIGN KEY (kriteria_id) REFERENCES kriteria(id) ON DELETE CASCADE
);

-- Hapus data lama untuk memastikan inisialisasi bersih
DELETE FROM nilai_alternatif;
DELETE FROM alternatif;
DELETE FROM kriteria;

-- 4. Masukkan Dummy Data Kriteria
INSERT INTO kriteria (id, name, type, weight) VALUES
('C1', 'Harga (Juta Rp)', 'cost', 0.3000),
('C2', 'Kualitas Layar (Skala 1-10)', 'benefit', 0.2500),
('C3', 'Performa Prosesor (Skala 1-10)', 'benefit', 0.2000),
('C4', 'Daya Tahan Baterai (Jam)', 'benefit', 0.1500),
('C5', 'Kapasitas RAM (GB)', 'benefit', 0.1000);

-- 5. Masukkan Dummy Data Alternatif
INSERT INTO alternatif (id, name) VALUES
('A1', 'Asus ROG Zephyrus'),
('A2', 'MacBook Air M2'),
('A3', 'Lenovo ThinkPad X1'),
('A4', 'Acer Swift Go');

-- 6. Masukkan Dummy Data Nilai Alternatif
INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) VALUES
-- Asus ROG Zephyrus (A1)
('A1', 'C1', 22.5000),
('A1', 'C2', 9.0000),
('A1', 'C3', 9.5000),
('A1', 'C4', 6.5000),
('A1', 'C5', 16.0000),

-- MacBook Air M2 (A2)
('A2', 'C1', 18.0000),
('A2', 'C2', 9.5000),
('A2', 'C3', 8.5000),
('A2', 'C4', 9.5000),
('A2', 'C5', 8.0000),

-- Lenovo ThinkPad X1 (A3)
('A3', 'C1', 25.0000),
('A3', 'C2', 8.5000),
('A3', 'C3', 8.0000),
('A3', 'C4', 8.0000),
('A3', 'C5', 16.0000),

-- Acer Swift Go (A4)
('A4', 'C1', 11.5000),
('A4', 'C2', 8.0000),
('A4', 'C3', 7.5000),
('A4', 'C4', 7.0000),
('A4', 'C5', 8.0000);
