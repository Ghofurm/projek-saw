const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// --- RUTE CRITERIA ---
router.get('/criteria', apiController.getAllCriteria);
router.post('/criteria', apiController.createCriterion);
router.put('/criteria/:id', apiController.updateCriterion);
router.delete('/criteria/:id', apiController.deleteCriterion);

// --- RUTE ALTERNATIF ---
router.get('/alternatives', apiController.getAllAlternatives);
router.post('/alternatives', apiController.createAlternative);
router.put('/alternatives/:id', apiController.updateAlternative);
router.delete('/alternatives/:id', apiController.deleteAlternative);

// --- RUTE SCORES ---
router.get('/scores', apiController.getAllScores);
router.post('/scores', apiController.updateScore);

// --- RUTE RESET DEMO DATA ---
router.post('/reset', apiController.resetDemoData);

module.exports = router;
