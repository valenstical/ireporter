const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send('Welcome to iReporter v1 API. Remove this');
});

module.exports = router;
