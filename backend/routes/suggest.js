const express = require('express');
const router = express.Router();
const { getFinancialSuggestions } = require('../services/openRouterService');

router.post('/', async (req, res) => {
  try {
    const userInput = req.body;
    const suggestion = await getFinancialSuggestions(userInput);
    res.json({ suggestion });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
