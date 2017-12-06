var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema ({
  children: [],
  posts: [],
  name: String,
  isTopLevel: String,
  ofTheWeek: String,
  parent: {name: String, id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection'},
      required: false},

})


var Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection
