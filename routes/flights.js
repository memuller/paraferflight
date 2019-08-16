const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('got')
})

router.post('/', async (req, res) => {
  const Flight = req.app.locals.Flight
  try {
    const flight = await Flight.create(req.body)
    res.status(201).send(flight)
  } catch(e) {
    console.log(e)
    res.status(500)
  }
})

module.exports = router