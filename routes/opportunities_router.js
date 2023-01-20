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

module.exports = router;
