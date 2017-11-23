var express = require('express')
var Router = express.Router();
var Post = require('../models/post')
var Collection = require('../models/collection')

Router.get('/posts', function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log('there is an error here' + err)
    } else {
      res.json({posts:posts})
    }})})

    Router.get('/api/posts', function(req, res){
      Post.find({}, function(err, posts){
        if(err){
          console.log('there is an error here' + err)
        } else {
          var splicedposts = posts.splice(0, 301).reverse()
          res.json({posts: splicedposts})
        }})})



Router.get('/post/new', function(req, res){
      Collection.find({}, function(err, collections){ //doing this so that you can assign it a collection on creation
        if(err) {
          console.log('oops another error here' + err)
        } else {
          var collectionsss = collections.filter(collection => collection.name !== 'random' && collection.isTopLevel == 'false')
          Post.find({}, function(err, posts){
            if(err) {
              console.log(err)
            } else {
              res.json({collections: collectionsss, posts:posts})
            }})}})})




Router.get('/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) {
      console.log('problem fetching the post' + err)
    } else {
      res.json({post:post})
    }})})



Router.post('/post', function(req, res){
  var newpost = {link: req.body.link, title: req.body.title, resolution: req.body.resolution}
  Post.create(newpost, function(err, post){
    if(err) {
      console.log(err)
    } else {
      post.creator.name = req.body.creatorname
      post.creator.link = req.body.creatorlink
      post.save();

      console.log(post.tags)

      if(req.body.collection !== ''){
        Collection.findById(req.body.collection, function(err, collection){
          if(err){
            console.log(err)
          } else {
            post.collectionn.name = collection.name
            post.collectionn.id = collection._id
            post.save();

            if(req.body.tags.length > 0){
            var filteredstuff = req.body.tags.filter(item => item.length > 1)
            filteredstuff.forEach(tag => {
                post.tags.push(tag)
                post.update()
             })} else {}

            collection.posts.push(post)
            collection.save()
            console.log(post.tags)
            res.json({status: 200})
          }})}

        else {
          console.log('take a break here')
          console.log(post.tags)
          Collection.findOne({'name': "random"}, function(err, collection){
            if(err) {
              console.log(err)
            } else {
              post.collectionn.name = collection.name
              post.collectionn.id = collection._id
              post.save();

              if(req.body.tags.length > 0){
              var filteredstuff = req.body.tags.filter(item => item.length > 1)
              filteredstuff.forEach(tag => {
                  post.tags.push(tag)
                  post.update()
               })} else {}

              collection.posts.push(post)
              collection.save()
              res.json({})
            }})}}})})



Router.post('/addtag/:id', function(req,res){
  Post.findById(req.params.id, function(err, post){
    if(err) {
      console.log(err)
    } else {
      var filteredstuff = req.body.tags.filter(item => item.length > 1)
      filteredstuff.forEach(tag => {
        if(post.tags.indexOf(tag) === -1 ) {
          Post.findByIdAndUpdate(req.params.id, {$push: {tags: tag}}, function(err, post){
            if(err) {
              console.log(err)
            } else {

            }})}
             else {
          return null }})
          res.json({})
    }})})



Router.get('/post/:id/edit', function(req, res){
  Post.findById(req.params.id, function(err, post){
  if(err) {
          console.log('problem fetching the post' + err)
          } else {
            Collection.find({}, function(err, collections){
              if(err) {
                console.log(err)
              } else {
                Post.find({}, function(err, posts){
                  if(err){
                    console.log(err)
                  } else {
                    res.json({post:post, collections:collections, posts:posts})
                  }})}})}})})



//I'm editing the edit route to allow us only change the collection of the post
Router.put('/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post) {
    if(err) {
      console.log(err)
    } else {
      Collection.findById(post.collectionn.id, function(err, oldcollection){
        if(err){
          console.log(err)
        } else {
            var index = oldcollection.posts.indexOf(post._id)
            oldcollection.posts.pull({_id: post._id})
            console.log('popped it off')
            oldcollection.save();
            Collection.findById(req.body.collection, function(err, collection){
              if(err) {
                console.log(err)
              } else {
                console.log('found it')
             post.collectionn.name = collection.name
             post.collection.name = collection._id
             post.save()
             collection.posts.push(post)
             collection.save()
             console.log('changed it')
             res.json()
        }})}})}})})




Router.delete('/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post) {
    if(err){
      console.log(err)
    } else {
      Collection.findById(post.collectionn.id,  function(err, collection){
        if(err){
          console.log(err)
        } else {
            collection.posts.pull({_id: post._id})
              collection.save()
              console.log('removing')
              post.remove();
              res.json({})
          }})}})})

module.exports = Router;
