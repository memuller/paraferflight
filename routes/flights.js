const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('got')
})

router.post('/', (req, res) => {
  res.send('posted')
})

module.exports = router