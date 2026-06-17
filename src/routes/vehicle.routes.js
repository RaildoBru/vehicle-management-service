const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
  res.status(200).json({
    teste: 'teste'
  });
});

module.exports = router;