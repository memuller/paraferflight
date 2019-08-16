const fs = require('fs')
const parse = require('csv-parse')
const async = require('async')
const MongoClient = require('mongodb').MongoClient

const csvFile = process.env.CSV || './data.csv'

const mongoURL = process.env.mongoURL || 'mongodb://localhost:27017'

let mongo
let currentLine = 0
let insertions = 0
function insert(row, collection) {
  /* ROW DATA STRUCTURE
  necessary because organizing data by their CSV headers 
  (the first line) isn't working; likely due to 
  invalid characters in the header.
  
  1 Voos,
  2 Companhia.Aerea,
  3 Codigo.Tipo.Linha,
  4 Partida.Prevista,
  5 Partida.Real,
  6 Chegada.Prevista,
  7 Chegada.Real,
  8 Situacao.Voo,
  9 Codigo.Justificativa,
  10 Aeroporto.Origem,
  11 Cidade.Origem,
  12 Estado.Origem,
  13 Pais.Origem,
  14 Aeroporto.Destino,
  15 Cidade.Destino,
  16 Estado.Destino,
  17 Pais.Destino,
  18 LongDest,
  19 LatDest,
  20 LongOrig,
  21 LatOrig
  */
  if (currentLine === 0) {
    currentLine++
    return
  }
  
  const data = {
    from: row[10],
    to: row[14],
    date: new Date(row[4]),
    company: row[1],
    index: currentLine
  }
  currentLine++
  
  collection.insertOne(data, (err, res) => {
    if (err) throw err
    insertions++
    if (insertions === currentLine-2) {
      end()
    }
  })

}

function end() {
  console.log('done')
  mongo.close()
  process.exit(0)
}

(async function main(){

  mongo = await MongoClient.connect(mongoURL, { useNewUrlParser: true })
  const collection = mongo.db('paraferflight').collection('flights')

  // we could make this more readable with promises,
  // but it's easier and faster to use the event-based API
  // since it reads by line and the file is pretty big
  fs.createReadStream(csvFile)
    .pipe(parse())
    .on('data', (row) => insert(row, collection))
    .on('end', () => console.log('finished reading'))
})();