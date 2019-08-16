const MongoClient = require('mongodb').MongoClient
const Config = require('./../config.json')

let connection = null

async function open() {
  connection = await MongoClient.connect(Config.mongo.url, Config.mongo.options)
  return connection
}

async function db() {
  if (!connection)
    await open()
  connection.flights = flightsCollection()
  return connection
}

function flightsCollection() {
  return connection
    .db(Config.mongo.database)
    .collection(Config.mongo.collection)
}

function close() {
  connection.close()
}

module.exports = {
  open,
  db,
  close
}