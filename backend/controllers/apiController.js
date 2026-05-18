const db = require('../config/db');

// --- CRITERIA CONTROLLERS ---

exports.getAllCriteria = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kriteria');
    // Pastikan bobot berupa float
    const formatted = rows.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      weight: parseFloat(r.weight)
    }));
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data kriteria' });
  }
};

exports.createCriterion = async (req, res) => {
  const { name, type, weight } = req.body;
  if (!name || !type || weight === undefined) {
    return res.status(400).json({ error: 'Data kriteria tidak lengkap' });
  }

  const id = 'C' + Date.now();
  const parsedWeight = parseFloat(weight);

  try {
    // 1. Simpan kriteria baru
    await db.query(
      'INSERT INTO kriteria (id, name, type, weight) VALUES (?, ?, ?, ?)',
      [id, name, type, parsedWeight]
    );

    // 2. Inisialisasi nilai kriteria ini = 0 untuk seluruh alternatif yang ada
    const [alternatives] = await db.query('SELECT id FROM alternatif');
    for (const alt of alternatives) {
      await db.query(
        'INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) VALUES (?, ?, 0.0)',
        [alt.id, id]
      );
    }

    res.status(201).json({ id, name, type, weight: parsedWeight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menambahkan kriteria' });
  }
};

exports.updateCriterion = async (req, res) => {
  const { id } = req.params;
  const { name, type, weight } = req.body;

  if (!name || !type || weight === undefined) {
    return res.status(400).json({ error: 'Data kriteria tidak lengkap' });
  }

  try {
    await db.query(
      'UPDATE kriteria SET name = ?, type = ?, weight = ? WHERE id = ?',
      [name, type, parseFloat(weight), id]
    );
    res.json({ message: 'Kriteria berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui kriteria' });
  }
};

exports.deleteCriterion = async (req, res) => {
  const { id } = req.params;
  try {
    // Cascade delete akan otomatis menghapus entri di nilai_alternatif
    await db.query('DELETE FROM kriteria WHERE id = ?', [id]);
    res.json({ message: 'Kriteria berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus kriteria' });
  }
};


// --- ALTERNATIVE CONTROLLERS ---

exports.getAllAlternatives = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alternatif');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data alternatif' });
  }
};

exports.createAlternative = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama alternatif tidak boleh kosong' });
  }

  const id = 'A' + Date.now();

  try {
    // 1. Simpan alternatif baru
    await db.query('INSERT INTO alternatif (id, name) VALUES (?, ?)', [id, name]);

    // 2. Inisialisasi nilai seluruh kriteria yang ada = 0 untuk alternatif baru ini
    const [criteria] = await db.query('SELECT id FROM kriteria');
    for (const crit of criteria) {
      await db.query(
        'INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) VALUES (?, ?, 0.0)',
        [id, crit.id]
      );
    }

    res.status(201).json({ id, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menambahkan alternatif' });
  }
};

exports.updateAlternative = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nama alternatif tidak boleh kosong' });
  }

  try {
    await db.query('UPDATE alternatif SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Alternatif berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui alternatif' });
  }
};

exports.deleteAlternative = async (req, res) => {
  const { id } = req.params;
  try {
    // Cascade delete akan otomatis menghapus entri di nilai_alternatif
    await db.query('DELETE FROM alternatif WHERE id = ?', [id]);
    res.json({ message: 'Alternatif berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menghapus alternatif' });
  }
};


// --- SCORE CONTROLLERS ---

exports.getAllScores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM nilai_alternatif');
    
    // Format sebagai matrix mapping { [altId]: { [critId]: floatValue } }
    const matrix = {};
    rows.forEach(r => {
      const altId = r.alternatif_id;
      const critId = r.kriteria_id;
      if (!matrix[altId]) {
        matrix[altId] = {};
      }
      matrix[altId][critId] = parseFloat(r.score);
    });

    res.json(matrix);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil matriks penilaian' });
  }
};

exports.updateScore = async (req, res) => {
  const { alternativeId, criterionId, score } = req.body;
  
  if (!alternativeId || !criterionId || score === undefined) {
    return res.status(400).json({ error: 'Parameter penilaian tidak lengkap' });
  }

  const parsedScore = parseFloat(score);

  try {
    // Upsert menggunakan ON DUPLICATE KEY UPDATE
    await db.query(
      `INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE score = ?`,
      [alternativeId, criterionId, parsedScore, parsedScore]
    );
    res.json({ message: 'Nilai berhasil disimpan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menyimpan nilai' });
  }
};


// --- DEMO RESET CONTROLLER ---

exports.resetDemoData = async (req, res) => {
  try {
    // Jalankan pembersihan data
    await db.query('DELETE FROM nilai_alternatif');
    await db.query('DELETE FROM alternatif');
    await db.query('DELETE FROM kriteria');

    // Re-populate criteria
    const criteria = [
      ['C1', 'Harga (Juta Rp)', 'cost', 0.3000],
      ['C2', 'Kualitas Layar (Skala 1-10)', 'benefit', 0.2500],
      ['C3', 'Performa Prosesor (Skala 1-10)', 'benefit', 0.2000],
      ['C4', 'Daya Tahan Baterai (Jam)', 'benefit', 0.1500],
      ['C5', 'Kapasitas RAM (GB)', 'benefit', 0.1000]
    ];
    for (const c of criteria) {
      await db.query('INSERT INTO kriteria (id, name, type, weight) VALUES (?, ?, ?, ?)', c);
    }

    // Re-populate alternatives
    const alternatives = [
      ['A1', 'Asus ROG Zephyrus'],
      ['A2', 'MacBook Air M2'],
      ['A3', 'Lenovo ThinkPad X1'],
      ['A4', 'Acer Swift Go']
    ];
    for (const a of alternatives) {
      await db.query('INSERT INTO alternatif (id, name) VALUES (?, ?)', a);
    }

    // Re-populate scores
    const scores = [
      ['A1', 'C1', 22.5000], ['A1', 'C2', 9.0000], ['A1', 'C3', 9.5000], ['A1', 'C4', 6.5000], ['A1', 'C5', 16.0000],
      ['A2', 'C1', 18.0000], ['A2', 'C2', 9.5000], ['A2', 'C3', 8.5000], ['A2', 'C4', 9.5000], ['A2', 'C5', 8.0000],
      ['A3', 'C1', 25.0000], ['A3', 'C2', 8.5000], ['A3', 'C3', 8.0000], ['A3', 'C4', 8.0000], ['A3', 'C5', 16.0000],
      ['A4', 'C1', 11.5000], ['A4', 'C2', 8.0000], ['A4', 'C3', 7.5000], ['A4', 'C4', 7.0000], ['A4', 'C5', 8.0000]
    ];
    for (const s of scores) {
      await db.query('INSERT INTO nilai_alternatif (alternatif_id, kriteria_id, score) VALUES (?, ?, ?)', s);
    }

    // Ambil data terbaru untuk dikembalikan ke frontend
    const [fetchedCriteria] = await db.query('SELECT * FROM kriteria');
    const [fetchedAlternatives] = await db.query('SELECT * FROM alternatif');
    const [fetchedScores] = await db.query('SELECT * FROM nilai_alternatif');

    const formattedCriteria = fetchedCriteria.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      weight: parseFloat(c.weight)
    }));

    const formattedScores = {};
    fetchedScores.forEach(s => {
      const altId = s.alternatif_id;
      const critId = s.kriteria_id;
      if (!formattedScores[altId]) {
        formattedScores[altId] = {};
      }
      formattedScores[altId][critId] = parseFloat(s.score);
    });

    res.json({
      message: 'Demo data successfully reset',
      criteria: formattedCriteria,
      alternatives: fetchedAlternatives,
      scores: formattedScores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal melakukan reset demo data' });
  }
};
