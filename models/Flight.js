let Collection
function setCollection(arg) {
  Collection = arg
}

const ALLOWED_FIELDS = ['from', 'to', 'date', 'company', 'index']

const SEARCH_FIELDS = [ 'from', 'to', 'company', 'date' ]

class Flight {
  constructor(params){
    this.from = params.from
    this.to = params.to
    this.date = params.date
    this.company = params.company
    this.index = params.index
    this.id = params.id
  }

  static filterAttributes(attributes) {
    const keys = Object.keys(attributes)
    const allowedKeys = keys.filter( 
      key => ALLOWED_FIELDS.includes(key))
    
    return allowedKeys.reduce((obj, key) => {
      obj[key] = attributes[key]
      return obj
    }, {})
  }

  static addNormalizedAttributes(object) {
    object._lower_to = object.to.toLowerCase()
    object._lower_from = object.from.toLowerCase()
    object._lower_company = object.company.toLowerCase()
    return object
  }

  static async create(params){
    const filteredParams = Flight.filterAttributes(params)
    const withAddedNormalizedAttributes = Flight.addNormalizedAttributes(filteredParams)
    const result = await Collection.insertOne(withAddedNormalizedAttributes)

    return new Flight(Object.assign(
      {}, 
      filteredParams, 
      { id: result.insertedId }))
  }

  static async find(params) {
    const query = {}
    for ( let i = 0; i < SEARCH_FIELDS.length; i++ ) {
      let attribute = SEARCH_FIELDS[i]
      if (params[attribute]) {
        if (attribute !== 'date') {
          const searchField = `_lower_${attribute}`
          query[searchField] = params[attribute].toLowerCase()
        } else {
          const splatedDate = params['date'].split(
            params['date'].includes('/') ? '/' : '-'
          )
          // months are counted from 0 (not 1) so we need to -1 it
          const startDate = new Date(splatedDate[0], parseInt(splatedDate[1])-1, splatedDate[2])
          //searches from the begging of the current day to the beggining of the next one
          const endDate = new Date(splatedDate[0], parseInt(splatedDate[1])-1, parseInt(splatedDate[2])+1)
          query['date'] = {
            "$gte": startDate, 
            "$lt": endDate
          }
        }
      }
    }
    const result = await Collection.find(query).toArray()
    return result.map( (item) => new Flight(item) )
  } 
}

module.exports = {
  Flight,
  setCollection
}
