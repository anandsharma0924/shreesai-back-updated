const express = require('express');
const router = express.Router();
const numberController = require('../controllers/numberController');

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

router.post('/addnumber', numberController.addNumber);
router.get('/get', numberController.getNumbers);
router.delete('/delete/:id', numberController.deleteSingleNumber);
router.delete('/delete-all', numberController.deleteAllNumbers);
router.post('/test-number', numberController.addTestNumber);

module.exports = router;