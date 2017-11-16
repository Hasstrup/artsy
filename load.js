 var mongoose = require('mongoose')
 var Collection = require('./models/collection')

function LoadDB() {
 var uncategorized = {name: 'Uncategorized', posts: []}

Collection.find({'name': 'Uncategorized'}, function(err, collection){
  if(err) {
    console.log(err)
  } else if (collection == null) {
    Collection.create(uncategorized, function(err, collection){
      if(err) {
        console.log(err)
      } else {
        console.log('created')
      }
    })} else {
    return
  }})
}

 module.exports = LoadDB
