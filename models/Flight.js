let Collection
function setCollection(arg) {
  Collection = arg
}

const ALLOWED_FIELDS = ['from', 'to', 'date', 'company', 'index']

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
}

module.exports = {
  Flight,
  setCollection
}
