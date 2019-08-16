const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const Flight = req.app.locals.Flight
  try {
    const results = await Flight.find(req.query)
    res.status(200).send(results) 
  } catch(e) {
    console.log(e)
    res.status(404)
  }
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