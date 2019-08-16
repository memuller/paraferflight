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
