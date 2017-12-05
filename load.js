var mongoose = require('mongoose')
var Collection = require('./models/collection')
var Query = require('./models/super')

function LoadDB() {
var uncategorized = {name: 'Random', posts: [], isToplevel: 'false', ofTheWeek: 'false'}

Collection.create(uncategorized, function(err, collection){
  if(err) {
    console.log(err)
  } else {
    console.log('created')
  }

  Query.create({name: 'Queries'}, function(err, query){
    if(err) {
      console.log(err)
    } else {
      console.log('created them blokes')
    }
  })
})}



module.exports = LoadDB
