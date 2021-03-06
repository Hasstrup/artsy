var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema ({
  children: [],
  posts: [{ id:{ type: mongoose.Schema.Types.ObjectId,  ref: 'Post'}, link: {type: String, ref: 'Post'}, resolution: {type: String, ref: 'Post'},
    downloads: Number,
    count: Number,
    thumbnail: {type: String, ref: 'Post'},
    title: {type: String, ref: 'Post'},
    creator: { name: {type: String, ref: 'Post'},
    link:{type: String, ref: 'Post'}}
}],
  name: String,
  count: Number,
  author: String,
  isTopLevel: String,
  ofTheWeek: String,
  parent: {name: String, id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection'},
      required: false},

})


var Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection
