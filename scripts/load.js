const fs = require('fs')
const parse = require('csv-parse')
const csvFile = process.env.CSV || './data.csv'

function readLine(line) {
  console.log(line)
}

function end() {
  console.log(finished)
}

fs.createReadStream(csvFile)
  .pipe(parse())
  .on('data', readLine)
  .on('end', end)