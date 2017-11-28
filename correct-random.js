var mongoose = require('mongoose');
var Collection = require('./models/collection')


function correctDB () {
Collection.findOneAndUpdate({'name': 'random'}, {$set: {parent: {name: null, id: null}  }}, function(err, collection){
  if(err) {
    console.log(err)
  } else {
    console.log('fixed random parent id')
  }
})
}

module.exports = correctDB
