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
    const newId = `A${Date.now()}`;
    const newAlt = { id: newId, name };
    const updated = [...alternatives, newAlt];
    setAlternatives(updated);
    await mockApi.saveAlternatives(updated);

    // Initialize scores for new alternative
    const updatedScores = { ...scores };
    updatedScores[newId] = {};
    criteria.forEach(c => {
      updatedScores[newId][c.id] = 0.0; // default score
    });
    setScores(updatedScores);
    await mockApi.saveScores(updatedScores);
    return newAlt;
  };

  const updateAlternative = async (id, name) => {
    const updated = alternatives.map(alt => 
      alt.id === id ? { ...alt, name } : alt
    );
    setAlternatives(updated);
    await mockApi.saveAlternatives(updated);
  };

  const deleteAlternative = async (id) => {
    const updated = alternatives.filter(alt => alt.id !== id);
    setAlternatives(updated);
    await mockApi.saveAlternatives(updated);

    // Clean up scores
    const updatedScores = { ...scores };
    delete updatedScores[id];
    setScores(updatedScores);
    await mockApi.saveScores(updatedScores);
  };

  // --- CRITERIA CRUD ---
  const addCriterion = async (name, type, weight) => {
    const newId = `C${Date.now()}`;
    const newCrit = { id: newId, name, type, weight: parseFloat(weight) };
    const updated = [...criteria, newCrit];
    setCriteria(updated);
    await mockApi.saveCriteria(updated);

    // Add new criterion to scores matrix for all alternatives
    const updatedScores = { ...scores };
    alternatives.forEach(alt => {
      if (!updatedScores[alt.id]) updatedScores[alt.id] = {};
      updatedScores[alt.id][newId] = 0.0;
    });
    setScores(updatedScores);
    await mockApi.saveScores(updatedScores);
    return newCrit;
  };

  const updateCriterion = async (id, name, type, weight) => {
    const updated = criteria.map(crit => 
      crit.id === id ? { ...crit, name, type, weight: parseFloat(weight) } : crit
    );
    setCriteria(updated);
    await mockApi.saveCriteria(updated);
  };

  const deleteCriterion = async (id) => {
    const updated = criteria.filter(crit => crit.id !== id);
    setCriteria(updated);
    await mockApi.saveCriteria(updated);

    // Clean up scores mapping
    const updatedScores = { ...scores };
    Object.keys(updatedScores).forEach(altId => {
      delete updatedScores[altId][id];
    });
    setScores(updatedScores);
    await mockApi.saveScores(updatedScores);
  };

  // --- SCORE CRUD ---
  const updateScore = async (alternativeId, criterionId, scoreValue) => {
    const parsedScore = parseFloat(scoreValue) || 0.0;
    const updatedScores = { ...scores };
    if (!updatedScores[alternativeId]) {
      updatedScores[alternativeId] = {};
    }
    updatedScores[alternativeId][criterionId] = parsedScore;
    setScores(updatedScores);
    await mockApi.saveScores(updatedScores);
  };

  const updateBulkScores = async (newScores) => {
    setScores(newScores);
    await mockApi.saveScores(newScores);
  };

  // RESET ALL DATA TO DUMMY
  const resetAllData = async () => {
    setIsLoading(true);
    const reset = await mockApi.resetToDefault();
    setCriteria(reset.criteria);
    setAlternatives(reset.alternatives);
    setScores(reset.scores);
    setIsLoading(false);
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
