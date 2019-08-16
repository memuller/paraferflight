const MongoClient = require('mongodb').MongoClient
const Config = require('./../config.json')

async function main(){
  const mongo = await MongoClient.connect(Config.mongo.url, {
    useNewUrlParser: true
  })
  mongo
    .db(Config.mongo.database)
    .collection(Config.mongo.collection)
    .drop()
  mongo.close()
  process.exit(0)
}

main()