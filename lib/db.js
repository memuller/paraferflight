const MongoClient = require('mongodb').MongoClient
const Config = require('./../config.json')

let connection = null

async function open() {
  connection = await MongoClient.connect(Config.mongo.url, Config.mongo.options)
  connection.flights = flightsCollection()
  console.log('db is open...')
  return connection
}

async function db() {
  if (!connection)
    await open()
  return connection
}

function flightsCollection() {
  return connection
    .db(Config.mongo.database)
    .collection(Config.mongo.collection)
}

function close() {
  console.log('db has closed.')
  connection.close()
}

module.exports = {
  open,
  db,
  close
}