var express = require('express')
var Router = express.Router();
var Post = require('../models/post')
var Collection = require('../models/collection')
var Query = require('../models/super')



Router.get('/search/:query', function(req, res, next){
  //this first part basically splits the incoming url into a string
  let query
  if(req.params.query.indexOf('-') == -1) {
    query = req.params.query
  } else {
    var newquery = req.params.query.toLowerCase();
    query = newquery.replace(/-/g, ' ')
  }

Collection.find({}, function(err, collectionsxx){
    if(err) {
      console.log(err)
    }
    else {

      var siblings = []
      var toplevelrelated = []
      var toplevelcollections = collectionsxx.filter(collection => collection.isTopLevel == 'true' && collection.name == query)

      if(toplevelcollections.length > 0) {
        toplevelcollections.forEach(tcollection => {
          if(tcollection.parent.id !== null) {

            var parentarray = collectionsxx.filter(collection => collection.name === tcollection.parent.name)
            var parent = parentarray[0]
            var siblings = parent.children.filter(child => child.name !== tcollection.name && child.posts.length > 0) //this should give other collections in the parent
            toplevelrelated.push(...siblings.filter(sibling => toplevelcollections.indexOf(sibling) == -1))
            return toplevelrelated
          }
                else {
                  var filtered = tcollection.children.filter(child => child.name !== t.collection.name)
                  toplevelrelated.push(...filtered.filter(sibling => toplevelcollections.indexOf(sibling) == -1))
                  return toplevelrelated
                }})}
      else { } //end of phase 1





//start of phase 2
var secondlevel = collectionsxx.filter(collection => collection.posts.length !== 0 && collection.name === query)
  var secondlevelrelated = []

  if(secondlevel.length > 0) {
    var siblings = []
    var filexter = secondlevel.filter(collection => collection.parent.id !== null)

    filexter.forEach(scollection => {
        var index = collectionsxx.filter(collection => collection.name === scollection.parent.name)
        extract = index[0]
        siblings.push(extract)
        return siblings
       })
        siblings.forEach(sibling => {
          secondlevelrelated.push(...sibling.children.filter(child => secondlevel.indexOf(child) == -1 ))
          return secondlevelrelated
        })}

  else {
    } //end of phase 2





  //start of phase 3
    Post.find({}, function(err, posts){
      if(err) {
      console.log(err)
      } else {
        var arrayedfilters = []
        var filteredposts = posts.filter(post => post.title === query )
        filteredposts.forEach(post => {
          arrayedfilters.push(post._id)
        })

        var relatedposts = []
        //getting the related posts
        if(filteredposts.length > 0){

          var relatedcollectionnnns = []
          var secondfilter = filteredposts.filter(post => post.collectionn.name !== 'random')

          secondfilter.forEach(postsss => {
            var index = collectionsxx.filter(collection => collection.name === postsss.collectionn.name)
            var extract = index[0]
            relatedcollectionnnns.push(extract)
            return relatedcollectionnnns
          })
            relatedcollectionnnns.forEach(collectionsxn => {

              relatedposts.push(...collectionsxn.posts.filter(post => arrayedfilters.indexOf(post._id) == -1))
              return relatedposts })}
      else {
      } // end of phase 3


     //start of phase 4
     var arrayedtags = []
      var postswithtags = posts.filter(post => post.tags !== undefined && post.tags.indexOf(query) !== -1)
      postswithtags.forEach(post => {
        arrayedtags.push(post._id)
      })

      var relatedposts2 = []
      if (postswithtags.length > 0) {
        var relatedcollections = []
        var filter = postswithtags.filter(post => post.collectionn.name !== 'random')

          filter.forEach(postx => {
          var approach = collectionsxx.filter(collection => collection.name === postx.collectionn.name )
          var extract = approach[0]
          if(relatedcollections.indexOf(extract) == -1) {
          relatedcollections.push(extract)
          return relatedcollections } else {
          }})

          relatedcollections.forEach(collectionsxn => {
            relatedposts2.push(...collectionsxn.posts.filter(post => arrayedtags.indexOf(post._id) == -1))
          })} else {
        }  //end of phase 4


  //Now we have to split the query, search the post and try to get something !works fine!!!!
  var finalresults = []
  var finalrelated = []
  var finalresultsid = []
  if(query.indexOf(' ') == -1) { }  else {
    var resultss = []
    var collectionpostss = []
    var anotherlevel = [];

    var to_be_searched = query.split(' ').splice(0, 6)

      to_be_searched.map( string => {
        var filter1 = posts.filter(post => post.tags !== undefined )
        var resulttposts = filter1.filter(post => post.title.indexOf(string) !== -1 || post.tags.indexOf(string) !== -1)
        if(resulttposts.length == 0) {

        } else {
          //getting all the posts with the search tag
        resulttposts.forEach(post => {
          resultss.push(post)
          return resultss })

          resulttposts.forEach(postx => {
            var approach = collectionsxx.filter(collection => collection.name === postx.collectionn.name)
            var extract = approach[0]
            collectionpostss.push(extract)
            return collectionpostss })

            collectionpostss.forEach(collectionsxn => {
              anotherlevel.push (...collectionsxn.posts.filter(post => resulttposts.indexOf(post) == -1 ))
              return anotherlevel
            })}

                resultss.map(result =>  {
                  if(finalresults.indexOf(result) == -1) {
                  finalresults.push(result)
                  finalresultsid.push(result._id)
                  return finalresults } else {
                    return finalresults
                  }})

                anotherlevel.map(related =>  {
                  if(finalresults.indexOf(related) == -1 && finalrelated.indexOf(related) == -1){
                  finalrelated.push(related)
                  return finalrelated } else {
                    return finalrelated
                  }})})}

                if(
                  toplevelcollections.length == 0 &&
                  secondlevel.length == 0 &&
                  filteredposts.length == 0 &&
                  postswithtags.length == 0
                ) {
                  Query.findOne({'name': 'Queries'}, function(err, container){
                    if(err) {
                      console.log(err)
                    } else {
                      container.tags.push(query)
                      container.save();
                    }})
                } else { }

                  var u_related = []
                    let u2_related = []
                  var fu_related = []


                  relatedposts.forEach(post => {
                    if(arrayedfilters.toString().indexOf(post._id) == -1 && arrayedtags.toString().indexOf(post._id) == -1 &&
                    finalresultsid.toString().indexOf(post._id) == -1
                  ){
                      u_related.push(post)
                    } else { }})

                  relatedposts2.forEach(post => {
                    if(arrayedtags.toString().indexOf(post._id) == -1 && arrayedfilters.toString().indexOf(post._id) == -1
                    &&
                    finalresultsid.toString().indexOf(post._id) == -1
                  ) {
                      u2_related.push(post)
                    } else { }
                  })


                  finalrelated.forEach(post => {
                    if(finalresultsid.toString().indexOf(post._id) == -1 && arrayedtags.toString().indexOf(post._id)  == -1 &&
                    arrayedfilters.toString().indexOf(post._id) == -1)
                    {
                      fu_related.push(post)
                    } else {
                      }})




                res.json({
                  supercollection: toplevelcollections,
                  related_to_super_collections: toplevelrelated,
                  normalcollection: secondlevel,
                  related_to_normal_collection: secondlevelrelated,
                  posts_with_title: filteredposts,
                  related_to_posts_with_title: u_related,
                  posts_with_tags: postswithtags,
                  related_to_posts_with_tags: u2_related,
                  post_with_broken_tags: finalresults,
                  all_related_to_posts_with_broken_tags: fu_related,
                  collections: collectionsxx,
                  posts: posts

})  }}) }})})



module.exports = Router;
