var mongoose = require('mongoose')

var postSchema = new mongoose.Schema ({
    link: String,
    creator: {name: String, link: String, required: false},
    collectionn: {name: String, id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'},
        required: false}
})

var Post = mongoose.model('Post', postSchema)
module.exports = Post
