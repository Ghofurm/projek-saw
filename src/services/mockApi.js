// Mock API Service for SPK SAW
// Persisted in localStorage

const STORAGE_KEYS = {
  CRITERIA: 'saw_spk_criteria',
  ALTERNATIVES: 'saw_spk_alternatives',
  SCORES: 'saw_spk_scores'
};

// Initial Dummy Data
const INITIAL_CRITERIA = [
  { id: 'C1', name: 'Harga (Juta Rp)', type: 'cost', weight: 0.30 },
  { id: 'C2', name: 'Kualitas Layar (Skala 1-10)', type: 'benefit', weight: 0.25 },
  { id: 'C3', name: 'Performa Prosesor (Skala 1-10)', type: 'benefit', weight: 0.20 },
  { id: 'C4', name: 'Daya Tahan Baterai (Jam)', type: 'benefit', weight: 0.15 },
  { id: 'C5', name: 'Kapasitas RAM (GB)', type: 'benefit', weight: 0.10 }
];

const INITIAL_ALTERNATIVES = [
  { id: 'A1', name: 'Asus ROG Zephyrus' },
  { id: 'A2', name: 'MacBook Air M2' },
  { id: 'A3', name: 'Lenovo ThinkPad X1' },
  { id: 'A4', name: 'Acer Swift Go' }
];

const INITIAL_SCORES = {
  'A1': { 'C1': 22.5, 'C2': 9.0, 'C3': 9.5, 'C4': 6.5, 'C5': 16.0 },
  'A2': { 'C1': 18.0, 'C2': 9.5, 'C3': 8.5, 'C4': 9.5, 'C5': 8.0 },
  'A3': { 'C1': 25.0, 'C2': 8.5, 'C3': 8.0, 'C4': 8.0, 'C5': 16.0 },
  'A4': { 'C1': 11.5, 'C2': 8.0, 'C3': 7.5, 'C4': 7.0, 'C5': 8.0 }
};

// Helpers for localStorage
const getFromStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- MOCK API INTERFACE ---

// CRITERIA CRUD
export const getCriteria = async () => {
  return getFromStorage(STORAGE_KEYS.CRITERIA, INITIAL_CRITERIA);
};

export const saveCriteria = async (criteria) => {
  saveToStorage(STORAGE_KEYS.CRITERIA, criteria);
  return criteria;
};

// ALTERNATIVES CRUD
export const getAlternatives = async () => {
  return getFromStorage(STORAGE_KEYS.ALTERNATIVES, INITIAL_ALTERNATIVES);
};

export const saveAlternatives = async (alternatives) => {
  saveToStorage(STORAGE_KEYS.ALTERNATIVES, alternatives);
  return alternatives;
};

// SCORES CRUD
export const getScores = async () => {
  return getFromStorage(STORAGE_KEYS.SCORES, INITIAL_SCORES);
};

export const saveScores = async (scores) => {
  saveToStorage(STORAGE_KEYS.SCORES, scores);
  return scores;
};

// RESET TO INITIAL DUMMY
export const resetToDefault = async () => {
  localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(INITIAL_CRITERIA));
  localStorage.setItem(STORAGE_KEYS.ALTERNATIVES, JSON.stringify(INITIAL_ALTERNATIVES));
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(INITIAL_SCORES));
  return {
    criteria: INITIAL_CRITERIA,
    alternatives: INITIAL_ALTERNATIVES,
    scores: INITIAL_SCORES
  };
};
