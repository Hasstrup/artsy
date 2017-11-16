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
          res.json({collections:collections, postarray:posts})
        }})}})})


Router.get('/collection/new', function(req, res){
      Collection.findOne({'name': 'Uncategorized'}, function(err, collection){
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
                  res.json({ collection: collection, postarray:postarray})
                }})}}})})


Router.get('/collection/:id', function(req, res){
Collection.findById(req.params.id, function(err, collections){
  if(err){
        console.log(err)
        } else {
        var postarray = [];
        if(collections.posts.length > 0)
        {
          console.log('here again')
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
            else {
              console.log('m here')
              res.json({collections:collections, postarray:postarray})
        }
      }})})


Router.post('/collection', function(req, res){
  var newcollection = {name: req.body.name}
  Collection.create(newcollection, function(err, collection){
    if(err){
      console.log(err)
    } else {
      if(req.body.posts.length > 0 ) {
        req.body.posts.forEach(function (post){
          Post.findById(post, function(err, post){
            if(err) {
              console.log(err)
            } else {
              Collection.findOne({'name': 'Uncategorized'}, function(err, oldcollection){
                if(err){
                  console.log(err)
                } else {
                  index = oldcollection.posts.indexOf(post._id)
                  oldcollection.posts.pull({_id: post._id})
                  oldcollection.save()
                  post.collectionn.id = collection._id
                  post.collectionn.name = collection.name
                  collection.posts.push(post)
                  post.save()
                  collection.save();
                }})
            }})})
            res.json({})
          }
            else
            {
              collection.posts = [];
              collection.save();
              res.json({})
            }}})})

Router.get('/collection/:id/edit', function(req, res){
  Collection.findById(req.params.id, function(err, collection){
    if(err) {
        console.log(err)
    } else {
      res.json({collection:collection})
    }})})


Router.put('/collection/:id', function(req, res){
  Collection.findByIdAndUpdate(req.params.id, {$set: {name: req.body.name}}, function(err, collection){
    if(err) {
      console.log(err)
    } else {
      console.log('i was here')
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
      else {
        res.json({})
      }}})})

Router.delete('/collection/:id', function(req, res){
    Collection.findById(req.params.id, function(err, i_collection){
      if(err) {
        console.log(err)
      } else {
        if( i_collection.posts.length !== 0 ) {
          i_collection.posts.forEach(function (post) {
          Post.findById(post._id, function(err, post){
            if(err){
              console.log(err)
            } else {
              Collection.findOne({'name': 'Uncategorized'}, function(err, ucollection){
                if(err){
                  console.log(err)
                } else {
                  post.collectionn.name = ucollection.name
                  post.collectionn.id = ucollection._id
                  post.save();
                  ucollection.posts.push(post)
                  ucollection.save();
                }})}})})
            i_collection.remove();
            res.json({})
        } else {
          i_collection.remove();
          res.json({})
        }}})})

        module.exports = Router;
