const express = require('express');
const AccountsServices = require('../services/accounts_services');
const router = express.Router();

const accService = new AccountsServices();

// GET with limit query opportunities
router.get('/', async (req, res) => {
  let limit = typeof(req.query.limit) !== 'undefined' ? Number(req.query.limit) : 25;
  const accounts = await accService.getAllAccounts();
  res.json(accounts.slice(0, limit));
});

// GET account by document
router.get('/:document', async (req, res) => {
  try {
    const { document } = req.params;
    const account = await accService.getAccByDocument(document);
    res.status(200).json(account);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }
});

// POST Account
router.post('/',  async (req, res) => {
  try {
    const body = req.body;
    const accounts = await accService.postAccount(body);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    });
  }

});

module.exports = router;
