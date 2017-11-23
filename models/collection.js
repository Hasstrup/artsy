var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema ({
  children: [],
  posts: [{ id:{ type: mongoose.Schema.Types.ObjectId,  ref: 'Post'}}],
  name: String,
  isTopLevel: String,
  parent: {name: String, id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection'},
      required: false},

})


var Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection
