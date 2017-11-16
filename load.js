 var mongoose = require('mongoose')
 var Collection = require('./models/collection')

function LoadDB() {
 var uncategorized = {name: 'Uncategorized', posts: []}

 Collection.create(uncategorized, function(err, collection){
   if(err) {
     console.log(err)
   } else {
     console.log('created')
   }
 })}

 module.exports = LoadDB
