const fs = require('fs')
const parse = require('csv-parse')
const mongo = require('./../lib/db')
const FlightsDB = require('./../models/Flight')

const csvFile = process.env.CSV || './data.csv'

let db
let Flight
let currentLine = 0
let insertions = 0
function insert(row) {
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
  
  Flight.create(data).then((flight) => {
    insertions++
    if (insertions === currentLine-2) {
      end()
    }
  })
}

function end() {
  console.log('done')
  db.close()
  process.exit(0)
}

(async function main(){

  db = await mongo.db()
  FlightsDB.setCollection(db.flights)
  Flight = FlightsDB.Flight

  // we could make this more readable with promises,
  // but it's easier and faster to use the event-based API
  // since it reads by line and the file is pretty big
  fs.createReadStream(csvFile)
    .pipe(parse())
    .on('data', (row) => insert(row))
    .on('end', () => console.log('finished reading'))
})();