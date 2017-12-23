

var express = require('express')
var Router = express.Router();
var Post = require('../models/post')
var Collection = require('../models/collection')



Router.get('/posts', function(req, res){
  Post.find({}, function(err, posts){
    if(err){
      console.log('there is an error here' + err)
    } else {
      res.json({posts:[]})
    }})})

    Router.get('/api/posts', function(req, res){
      Post.find({}).sort({ count: -1}).exec(function(err, posts){
        if(err){
          console.log('there is an error here' + err)
        } else {
          var splicedposts = posts.splice(0, 301)
          res.json({posts: splicedposts})
        }})})



Router.get('/post/new', function(req, res){
      Collection.find({}, function(err, collections){ //doing this so that you can assign it a collection on creation
        if(err) {
          console.log('oops another error here' + err)
        } else {
          var collectionsss = collections.filter(collection => collection.name !== 'Random' && collection.isTopLevel == 'false')
          Post.find({}, function(err, posts){
            if(err) {
              console.log(err)
            } else {
              res.json({collections: collectionsss, posts:posts})
            }})}})})


Router.get('/download/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err){
      console.log(err)
    } else {
      post.downloads = post.downloads + 1
      post.save()
      res.json({post:post})
    }})})

Router.get('/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) {
      console.log('problem fetching the post' + err)
    } else {
      res.json({post:post})
    }})})



Router.post('/post', function(req, res){

Post.find({}, function(err, postslength){
  if(err) {
    console.log(err)
  } else {
    var phase1 = req.body.title.trim()
    var first = phase1.charAt(0).toUpperCase()
    var second = phase1.slice(1, phase1.length)
    var final = first.concat(second)
    var count = postslength.length + 1
    var newpost = {link: req.body.link, title: final, resolution: req.body.resolution, thumbnail: req.body.thumbnail, downloads: 0, ofTheWeek: 'false', count: count}
    Post.create(newpost, function(err, post){
      if(err) {
        console.log(err)
      } else {
        post.creator.name = req.body.creatorname
        post.creator.link = req.body.creatorlink
        post.save();

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
                  post.tags.push(tag.toLowerCase())
                  post.update()
               })} else {}

              collection.posts.push(post)
              collection.save()
              console.log(post.tags)
              var io = req.io;
             io.emit('update');
              res.json({status: 200})

            }})}

          else {
            console.log('take a break here')
            console.log(post.tags)
            Collection.findOne({'name': "Random"}, function(err, collection){
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
                var io = req.io;
               io.emit('update');
                res.json({})

              }})}}})
  }
})})



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


Router.post('/post/oftheweek/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err)
     {
       console.log(err)
     } else {
       if(post.ofTheWeek === 'false'){
         post.ofTheWeek = 'true'
         post.save()
         var io = req.io;
         io.emit('popularx');
         console.log('stuff')
         res.json({})
       } else {
         post.ofTheWeek = 'false'
         post.save()
         var io = req.io;
         io.emit('popularx');
         res.json({})

       }}})})



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
          console.log(post.collectionn.id)
          console.log(oldcollection)
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
             post.collectionn.id = collection._id
             post.save()
             console.log(post)
             collection.posts.push(post)
             collection.save()
             console.log('changed it')
             var io = req.io
             io.emit('updatecollection')
             res.json()
        }})}})}})})




Router.delete('/post/:id', function(req, res){
  Post.findById(req.params.id, function(err, post) {
    if(err){
      console.log(err)
    } else {
      Collection.findById(post.collectionn.id, function(err, collection){
        if(err){
          console.log(err)
        } else {
              collection.posts.pull({_id: post._id})
              collection.save()
              console.log('removing')
              post.remove();
              var io = req.io;
             io.emit('update')
              res.json({})
            ;
          }})}})})

module.exports = Router;
