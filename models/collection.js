var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema ({
  posts: [{ id:{ type: mongoose.Schema.Types.ObjectId,  ref: 'Post'}}],
  name: String
})

var Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection
