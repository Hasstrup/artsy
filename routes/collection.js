var express = require('express')
var Router = express.Router();
var Post = require('../models/post')
var Collection = require('../models/collection')




Router.get('/collections', function(req, res){
  Collection.find({}, function(err, collections){
    if(err) {
      console.log(err)
    } else {
      Post.find({}, function(err, posts){
        if(err){
          console.log(err)
        } else {
          var higherorder = collections.filter( collection => collection.isTopLevel === 'true')
          var lowerorder = collections.filter( collection => collection.isTopLevel == undefined || collection.isTopLevel === 'false')
          res.json({collections:collections, postarray:posts, higherorder:higherorder, lowerorder:lowerorder })
        }})}})})

Router.get('/api/collections', function(req, res){
Collection.find({}, function(err, collections){
if(err) {
      console.log(err)
      } else {
      Post.find({}, function(err, posts){
      if(err){
      console.log(err)  }
      else {
          var higherorder = collections.filter( collection => collection.isTopLevel === 'true')
          var lowerorder = collections.filter( collection => collection.isTopLevel == undefined || collection.isTopLevel === 'false')
          var filteredd = lowerorder.splice(0, 101).reverse()
          res.json({collections:filtered, postarray:posts})
    }})}})})





Router.get('/collection/new', function(req, res){
      Collection.findOne({'name': 'random'}, function(err, collection){
        if(err){
          console.log(err)
        }
         else {
           if(collection.posts.length === 0) {
             let postarray =  []
             res.json({postarray:postarray})
              }
            else {
              let postarray =  []
              collection.posts.forEach (function(post){
              Post.findById(post._id, function(err, post){
                if(err){
                  console.log(err)
                } else {
                  postarray.push(post)
              }})})
              Collection.findById(collection._id, function(err, collection){
                if(err) {
                  console.log(err)
                } else {
                  Collection.find({}, function(err, collections){
                    if(err) {
                      console.log(err)
                    } else {
                      res.json({ collection: collection, postarray:postarray})
                    }})}})}}})})





Router.get('/collection/:id', function(req, res){
Collection.findById(req.params.id, function(err, collections){
  if(err){
        console.log(err)
        } else {
        var postarray = [];
        var collectionarray = []
        if(collections.posts.length > 0)
        {

          collections.posts.forEach(function(post){
          Post.findById(post._id, function(err, post){
          if(err){
            console.log(err)
                } else {
                    postarray.push(post)
                }})})
            Collection.findById(req.params.id, function(err, collection){
              if(err){
                console.log(err)
              } else {
                res.json({ collections:collection, postarray:postarray})
              }})}

              else if( collections.children.length > 0) {
                collections.children.forEach(function(collection){
                  Collection.findById(collection, function(err, collectionz){
                    collectionarray.push(collectionz)
                     })})
                     Post.find({}, function(err, posts) {
                       if(err) {
                         console.log(err)
                       } else {
                         res.json({ collections: collections, collectionarray: collectionarray, postarray: posts})
                       }})}
            else {
              res.json({collections:collections, postarray:postarray})
        }}})})




//clear
Router.get('/newnestxx/:id', function(req, res){
  console.log('im here')
  Collection.find({}, function(err, collections){
    Collection.findById(req.params.id, function(err, collectionz){
      if(err) {
        console.log(err) }

         else {
        var level1 = collections.filter(collection => collection.name !== 'random' && collection.parent !== undefined)
        var level2 = level1.filter(collection => collection.parent.id !== null && collection.parent.name !== null)
        var level3 = level1.filter(collection => collection.parent.id == null && collection.parent.name == null && collection.children.length > 0)
        var level4 = level1.filter(collection =>  collection.parent.id == null && collection.parent.name == null && collection.posts.length !== 0)
        var level5 = level3.filter(collection => collection.name !== collectionz.name && collectionz.indexOf(collection) == -1 )

        Post.find({}, function(err, posts){
          if(err) {
            console.log(err)
          } else {
            res.json({availablecollections : level2, postarray:posts, higherorder: level5, lowerorder: level4, collections:collections })
          }})}})})})





  Router.get('/newnest', function(req, res){
  Collection.find({}, function(err, collections){
  if(err){
  console.log(err)}

  else {
  var level1 = collections.filter(collection => collection.name !== 'random' && collection.parent !== undefined )
  var level2 = level1.filter(collection => collection.parent.id == null && collection.parent.name == null)
  var level3 = level1.filter(collection => collection.parent.id == null && collection.parent.name == null && collection.children.length > 0)
  var level4 = level1.filter(collection => collection.parent.id == null && collection.parent.name == null && collection.posts.length !== 0)

  Post.find({}, function(err, posts){
  if(err){
  console.log(err)}
   else {
    res.json({availablecollections :level2, postarray:posts, higherorder: level3, lowerorder: level4, collections:collections })
  }})}})})






Router.post('/collection', function(req, res){
  var newcollection = {name: req.body.name}
  Collection.create(newcollection, function(err, collection){
    if(err){
      console.log(err)
    } else {

      //this saves top level collections
      if(req.body.collections && req.body.collections.length > 0) {
        collection.isTopLevel = 'true'
        collection.parent.name = null
        collection.parent.id = null
        collection.save()
        req.body.collections.map(collectionid => {
          Collection.findById(collectionid,  function(err, collectionx) {
            if(err){
              console.log(err)
            } else {
            Collection.findByIdAndUpdate(collection._id, {$push: {children: collectionx} }, function(err, collection){
              if(err) {
                console.log(err)
              } else {
                collectionx.parent.name = collection.name
                collectionx.parent.id = collection._id
                collectionx.save();
              }})}})})
               res.json({})}




        else if( req.body.posts.length > 0)

        {
          collection.isTopLevel = 'false'
          collection.parent.id = null
          collection.parent.name = null
          collection.save();

          req.body.posts.forEach(post => {
            Post.findById(post, function(err, postx){
              if(err) {
                console.log(err)
              } else {
                collection.posts.push(postx)
                collection.save();
                Collection.findByIdAndUpdate(postx.collectionn.id, {$pull: {posts: {_id:postx._id} }}, function(err, random){
                  if(err){
                    console.log(err)
                  } else {
                    postx.collectionn.id = collection._id
                    postx.collectionn.name = collection.name
                    postx.save()
                  }
                })}})})
                res.json({})}



            else
            {
              if(req.body.isTopLevel && req.body.isTopLevel === 'true') {
              collection.isTopLevel === 'true'
              collection.parent.id = null
              collection.parent.name = null
              collection.save();
              collection.posts = [];
              collection.children = [];
              collection.save();
              res.json({}) }

              else {
                collection.isTopLevel === 'false'
                collection.parent.id = null
                collection.parent.name = null
                collection.save();
              collection.posts = [];
              collection.children = [];
              collection.save();
              res.json({}) }

            }}})})




Router.get('/collection/:id/edit', function(req, res){
  Collection.findById(req.params.id, function(err, collection){
    if(err) {
        console.log(err)
    } else {
      res.json({collection:collection})
    }})})





//if you want to nest a collection in another one after creating a top level collection
Router.put('/nest/:id', function(req, res){
  Collection.findById(req.params.id, function(err, collection){
    if(err){
      console.log(err)
    } else {

      req.body.collections.forEach(collectionid => {
        Collection.findById(collectionid, function(err, collectionz){
          if(err) {
            console.log(err)
          } else {
            collectionz.parent.name = collection.name
            collectionz.parent.id = collection._id
            collectionz.save();
            collection.children.push(collectionz)
            collection.save()
          }})})
          res.json({})
    }})})




Router.put('/collection/:id', function(req, res){
  Collection.findByIdAndUpdate(req.params.id, {$set: {name: req.body.name}}, function(err, collection){
    if(err) {
      console.log(err)
    } else {
      if(collection.posts.length !== 0) {
        collection.posts.forEach(function(post){
          Post.findById(post._id, function(err, post){
            if(err){
              console.log(err)
            } else {
              post.collectionn.name = req.body.name
              post.collectionn.id = collection._id
              post.save()
            }})})
            res.json({})}

          else if(collection.children.length !== 0) {
              collection.children.forEach(function(collection){
                Collection.findById(collection._id, function(err, collectionx){
                  if(err){
                    console.log(err)
                  } else {
                    collectionx.parent.name = req.body.name
                    collectionx.parent.id = collection._id
                    collectionx.save()
                  }})})
                  res.json({})}
      else {
        res.json({})
      }}})})





Router.get('/nest/:id', function(req, res){
  Collection.findById(req.params.id, function(err, collectionbb){
    if(err) {
      console.log(err)
    } else {
      var collectionns = []
      collectionbb.children.forEach(collection => {
        Collection.findById(collection._id, function(err, collection){
          if(err) {
            console.log(err)
          } else {
            collectionns.push(collection)
            return collectionns
          }})})
          Post.find({}, function(err, posts){
            if(err) {
              console.log(err)
            } else {
              Collection.find({}, function(err, collections){
                if(err) {
                  console.log(err)
                } else {
                  var toplevel = collectionns.filter(collection => collection.children.length > 0)
                  var secondlevel = collectionns.filter(collection => collection.posts.length > 0)
                  res.json({collection: collectionbb, toplevel:toplevel, secondlevel:secondlevel, posts:posts, collections:collections })
                }})}})}})})






Router.delete('/collection/:id', function(req, res){
    Collection.findById(req.params.id, function(err, i_collection){
      if(err) {
        console.log(err)
      } else {

        //if it has children
        if(i_collection.children.length !== 0) {
          var nested = i_collection.children
          nested.forEach(function(collection){
            Collection.findById(collection._id, function(err, collectionsx){
              if(err) {
                console.log(err)
              } else {
                collectionsx.parent.id = null
                collectionsx.parent.name = null
                collectionsx.save()
              }})})

              if(i_collection.parent.id !== null) {
                Collection.findByIdAndUpdate(i_collection.parent.id, {$pull: {children: {_id: i_collection._id}} }, function(err, collectionzz){
                  if(err) {
                    console.log(err)
                  } else {
                    i_collection.remove();
                    res.json({})
                  }
                })} else {
                  i_collection.remove();
                  res.json({})
                }}

          //if it has posts
          else if( i_collection.posts.length !== 0 ) {
          i_collection.posts.forEach(function (post) {
          Post.findById(post._id, function(err, post){
            if(err){
              console.log(err)
            } else {
              Collection.findOne({'name': 'random'}, function(err, ucollection){
                if(err){
                  console.log(err)
                } else {
                  post.collectionn.name = ucollection.name
                  post.collectionn.id = ucollection._id
                  post.save();
                  if(ucollection.indexOf(post) == -1){
                  ucollection.posts.push(post)
                  ucollection.save()} else { }
                }})}})})

                //if it has a parent as well
                if(i_collection.parent.id !== null) {
                Collection.findByIdAndUpdate(i_collection.parent.id, {$pull: {children: {_id: i_collection._id} }}, function (err, supercollection){
                  if(err) {
                    console.log(err)
                  } else {
                    if(supercollection !== null ) {
                    supercollection.children.pull({_id: i_collection._id})
                    supercollection.save();
                    i_collection.remove()
                    res.json({})} else {

                      i_collection.remove()
                      res.json({})
                    }}})}

                    else {
                    i_collection.remove()
                    res.json({})
                  }}


        else {
          if(i_collection.parent == true && i_collection.parent.id !== null) {
            Collection.findByIdAndUpdate(i_collection.parent.id, {$pull: {children: {_id: i_collection._id}} }, function(err, collectionzz){
              if(err) {
                console.log(err)
              } else {
                i_collection.remove();
                res.json({})
              }})}

              else {
              i_collection.remove();
              res.json({})
            }}}})})

        module.exports = Router;
