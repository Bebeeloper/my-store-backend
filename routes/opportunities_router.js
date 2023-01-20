const express = require('express');
const OpportunityServices = require('../services/opportunities_services');
const router = express.Router();

const oppService = new OpportunityServices();

// GET with limit query opportunities
router.get('/', async (req, res) => {
  let limit = typeof(req.query.limit) !== 'undefined' ? Number(req.query.limit) : 25;
  const opportunities = await oppService.getAllOpportunities();
  res.json(opportunities.slice(0, limit));
});

// Get opportunity by account document
router.get('/:document', async (req, res) => {
  try {
    const { document } = req.params;
    const product = await oppService.getOppByDocument(document);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }
});

module.exports = router;
