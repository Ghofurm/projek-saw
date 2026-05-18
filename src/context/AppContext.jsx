import React, { createContext, useState, useEffect } from 'react';
import * as mockApi from '../services/mockApi';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [criteria, setCriteria] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [scores, setScores] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedCriteria = await mockApi.getCriteria();
        const fetchedAlternatives = await mockApi.getAlternatives();
        const fetchedScores = await mockApi.getScores();

        setCriteria(fetchedCriteria);
        setAlternatives(fetchedAlternatives);
        setScores(fetchedScores);
      } catch (error) {
        console.error("Failed to load SPK data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // --- ALTERNATIVE CRUD ---
  const addAlternative = async (name) => {
    try {
      const newAlt = await mockApi.addAlternative({ name });
      const updated = [...alternatives, newAlt];
      setAlternatives(updated);

      // Initialize scores for new alternative locally
      const updatedScores = { ...scores };
      updatedScores[newAlt.id] = {};
      criteria.forEach(c => {
        updatedScores[newAlt.id][c.id] = 0.0;
      });
      setScores(updatedScores);
      return newAlt;
    } catch (error) {
      console.error("Gagal menambahkan alternatif:", error);
      alert("Gagal menambahkan alternatif ke server.");
    }
  };

  const updateAlternative = async (id, name) => {
    try {
      await mockApi.updateAlternative(id, { name });
      const updated = alternatives.map(alt => 
        alt.id === id ? { ...alt, name } : alt
      );
      setAlternatives(updated);
    } catch (error) {
      console.error("Gagal memperbarui alternatif:", error);
      alert("Gagal memperbarui alternatif di server.");
    }
  };

  const deleteAlternative = async (id) => {
    try {
      await mockApi.deleteAlternative(id);
      const updated = alternatives.filter(alt => alt.id !== id);
      setAlternatives(updated);

      // Clean up scores locally
      const updatedScores = { ...scores };
      delete updatedScores[id];
      setScores(updatedScores);
    } catch (error) {
      console.error("Gagal menghapus alternatif:", error);
      alert("Gagal menghapus alternatif dari server.");
    }
  };

  // --- CRITERIA CRUD ---
  const addCriterion = async (name, type, weight) => {
    try {
      const parsedWeight = parseFloat(weight) || 0.0;
      const newCrit = await mockApi.addCriterion({ name, type, weight: parsedWeight });
      const updated = [...criteria, newCrit];
      setCriteria(updated);

      // Add new criterion to scores matrix locally for all alternatives
      const updatedScores = { ...scores };
      alternatives.forEach(alt => {
        if (!updatedScores[alt.id]) updatedScores[alt.id] = {};
        updatedScores[alt.id][newCrit.id] = 0.0;
      });
      setScores(updatedScores);
      return newCrit;
    } catch (error) {
      console.error("Gagal menambahkan kriteria:", error);
      alert("Gagal menambahkan kriteria ke server.");
    }
  };

  const updateCriterion = async (id, name, type, weight) => {
    try {
      const parsedWeight = parseFloat(weight) || 0.0;
      await mockApi.updateCriterion(id, { name, type, weight: parsedWeight });
      const updated = criteria.map(crit => 
        crit.id === id ? { ...crit, name, type, weight: parsedWeight } : crit
      );
      setCriteria(updated);
    } catch (error) {
      console.error("Gagal memperbarui kriteria:", error);
      alert("Gagal memperbarui kriteria di server.");
    }
  };

  const deleteCriterion = async (id) => {
    try {
      await mockApi.deleteCriterion(id);
      const updated = criteria.filter(crit => crit.id !== id);
      setCriteria(updated);

      // Clean up scores mapping locally
      const updatedScores = { ...scores };
      Object.keys(updatedScores).forEach(altId => {
        delete updatedScores[altId][id];
      });
      setScores(updatedScores);
    } catch (error) {
      console.error("Gagal menghapus kriteria:", error);
      alert("Gagal menghapus kriteria dari server.");
    }
  };

  // --- SCORE CRUD ---
  const updateScore = async (alternativeId, criterionId, scoreValue) => {
    try {
      const parsedScore = parseFloat(scoreValue) || 0.0;
      await mockApi.updateScore(alternativeId, criterionId, parsedScore);
      
      const updatedScores = { ...scores };
      if (!updatedScores[alternativeId]) {
        updatedScores[alternativeId] = {};
      }
      updatedScores[alternativeId][criterionId] = parsedScore;
      setScores(updatedScores);
    } catch (error) {
      console.error("Gagal menyimpan nilai:", error);
      alert("Gagal menyimpan nilai ke server.");
    }
  };

  const updateBulkScores = async (newScores) => {
    setScores(newScores);
  };

  // RESET ALL DATA TO DUMMY
  const resetAllData = async () => {
    try {
      setIsLoading(true);
      const reset = await mockApi.resetToDefault();
      setCriteria(reset.criteria);
      setAlternatives(reset.alternatives);
      setScores(reset.scores);
    } catch (error) {
      console.error("Gagal mereset data:", error);
      alert("Gagal mereset data di server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      criteria,
      alternatives,
      scores,
      isLoading,
      addAlternative,
      updateAlternative,
      deleteAlternative,
      addCriterion,
      updateCriterion,
      deleteCriterion,
      updateScore,
      updateBulkScores,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};
