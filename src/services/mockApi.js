// API Service for SPK SAW connecting to Express REST API
// Migrated from localStorage mock to actual MySQL-backed API

const API_URL = 'http://localhost:5000/api';

// --- CRITERIA API ---
export const getCriteria = async () => {
  const res = await fetch(`${API_URL}/criteria`);
  if (!res.ok) throw new Error('Gagal mengambil kriteria dari server');
  return res.json();
};

export const addCriterion = async (criterion) => {
  const res = await fetch(`${API_URL}/criteria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criterion)
  });
  if (!res.ok) throw new Error('Gagal menambahkan kriteria');
  return res.json();
};

export const updateCriterion = async (id, criterion) => {
  const res = await fetch(`${API_URL}/criteria/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criterion)
  });
  if (!res.ok) throw new Error('Gagal memperbarui kriteria');
  return res.json();
};

export const deleteCriterion = async (id) => {
  const res = await fetch(`${API_URL}/criteria/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Gagal menghapus kriteria');
  return res.json();
};

// --- ALTERNATIVES API ---
export const getAlternatives = async () => {
  const res = await fetch(`${API_URL}/alternatives`);
  if (!res.ok) throw new Error('Gagal mengambil alternatif dari server');
  return res.json();
};

export const addAlternative = async (alternative) => {
  const res = await fetch(`${API_URL}/alternatives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alternative)
  });
  if (!res.ok) throw new Error('Gagal menambahkan alternatif');
  return res.json();
};

export const updateAlternative = async (id, alternative) => {
  const res = await fetch(`${API_URL}/alternatives/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alternative)
  });
  if (!res.ok) throw new Error('Gagal memperbarui alternatif');
  return res.json();
};

export const deleteAlternative = async (id) => {
  const res = await fetch(`${API_URL}/alternatives/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Gagal menghapus alternatif');
  return res.json();
};

// --- SCORES API ---
export const getScores = async () => {
  const res = await fetch(`${API_URL}/scores`);
  if (!res.ok) throw new Error('Gagal mengambil matriks penilaian dari server');
  return res.json();
};

export const updateScore = async (alternativeId, criterionId, score) => {
  const res = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alternativeId, criterionId, score })
  });
  if (!res.ok) throw new Error('Gagal menyimpan nilai');
  return res.json();
};

// --- DEMO RESET API ---
export const resetToDefault = async () => {
  const res = await fetch(`${API_URL}/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Gagal mereset demo data');
  return res.json();
};
