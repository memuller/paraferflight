const express = require("express")
const bodyParser = require('body-parser')
const mongo = require('./lib/db')
const FlightsDB = require('./models/Flight')
const FlightsRouter = require("./routes/flights")

const PORT = process.env['PORT'] || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/flights', FlightsRouter)

mongo.db().then( (connection) => {
  FlightsDB.setCollection(connection.flights)
  app.locals.Flight = FlightsDB.Flight
  app.listen(PORT, () => 'app is up!')
})
