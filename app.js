const express = require("express")
const PORT = process.env['PORT'] || 3000

const flightsRouter = require("./routes/flights")

const app = express()

app.use('/flights', flightsRouter)

app.listen(PORT, () => 'app is up!')