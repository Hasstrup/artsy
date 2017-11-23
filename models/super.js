var mongoose = require('mongoose')

var QuerySchema = new mongoose.Schema ({
  name: String,
   tags: []
})

var Query = mongoose.model('Query', QuerySchema)

module.exports = Query
