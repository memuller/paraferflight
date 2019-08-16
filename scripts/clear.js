const mongo = require('./../lib/db')

async function main(){
  const db = await mongo.db()
  db.flights.drop()
  db.close()
  process.exit(0)
}

main()