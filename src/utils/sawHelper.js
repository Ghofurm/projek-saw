// SAW (Simple Additive Weighting) Math Helper

/**
 * Get min and max values for each criterion across all alternatives
 */
export const getMinMaxValues = (criteria, alternatives, scores) => {
  const minMax = {};
  
  criteria.forEach(c => {
    const values = alternatives
      .map(alt => {
        const val = scores[alt.id]?.[c.id];
        return val !== undefined ? parseFloat(val) : 0.0;
      })
      .filter(val => !isNaN(val));

    if (values.length === 0) {
      minMax[c.id] = { min: 0.0, max: 0.0 };
      return;
    }

    minMax[c.id] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  return minMax;
};

/**
 * Perform full SAW calculation and return detailed steps for UI rendering
 */
export const calculateSAWSteps = (alternatives, criteria, scores) => {
  if (alternatives.length === 0 || criteria.length === 0) {
    return {
      minMax: {},
      normalizedMatrix: {},
      stepDetails: {},
      rankings: []
    };
  }

  // 1. Get Min and Max for normalization
  const minMax = getMinMaxValues(criteria, alternatives, scores);

  // 2. Normalization Matrix
  const normalizedMatrix = {};
  const stepDetails = {};

  alternatives.forEach(alt => {
    normalizedMatrix[alt.id] = {};
    stepDetails[alt.id] = {};

    criteria.forEach(c => {
      const originalValue = scores[alt.id]?.[c.id] !== undefined 
        ? parseFloat(scores[alt.id][c.id]) 
        : 0.0;
      
      const { min, max } = minMax[c.id];
      let r = 0.0;
      let equation = '';

      if (c.type === 'benefit') {
        if (max > 0) {
          r = originalValue / max;
          equation = `${originalValue} / ${max}`;
        } else {
          r = 0.0;
          equation = `${originalValue} / 0`;
        }
      } else {
        // type === 'cost'
        if (originalValue > 0) {
          r = min / originalValue;
          equation = `${min} / ${originalValue}`;
        } else {
          r = 0.0;
          equation = `${min} / 0`;
        }
      }

      // Round to 4 decimal places
      normalizedMatrix[alt.id][c.id] = parseFloat(r.toFixed(4));
      stepDetails[alt.id][c.id] = {
        normalizedValue: parseFloat(r.toFixed(4)),
        equation: equation
      };
    });
  });

  // 3. Multiplication with Weights & Final Rankings
  const rankings = alternatives.map(alt => {
    let totalScore = 0.0;
    const calculations = [];

    criteria.forEach(c => {
      const r = normalizedMatrix[alt.id][c.id] || 0.0;
      const weight = parseFloat(c.weight) || 0.0;
      const weightedValue = r * weight;
      totalScore += weightedValue;

      calculations.push({
        criterionId: c.id,
        criterionName: c.name,
        normalized: r,
        weight: weight,
        weightedValue: parseFloat(weightedValue.toFixed(4)),
        equation: `${r.toFixed(4)} * ${weight.toFixed(2)}`
      });
    });

    return {
      id: alt.id,
      name: alt.name,
      totalScore: parseFloat(totalScore.toFixed(4)),
      calculations
    };
  });

  // Sort rankings from highest to lowest score
  const sortedRankings = [...rankings].sort((a, b) => b.totalScore - a.totalScore);

  return {
    minMax,
    normalizedMatrix,
    stepDetails,
    rankings: sortedRankings
  };
};
