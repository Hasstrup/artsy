var express = require('express')
var app = express();
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
const port = process.env.PORT || 4400;
var cors = require('cors')
var Post = require('./models/post')
var Collection = require('./models/collection')
var Query = require('./models/super')
var LoadDB = require('./load')

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb://Hasstrup:Onosetale32@ds111066.mlab.com:11066/paper-stack', {
    useMongoClient: true
});


var postRoute = require('./routes/post')
var collectionRoute = require('./routes/collection')
var SearchRoute = require('./routes/search')


app.use(postRoute);
app.use(collectionRoute);
app.use(SearchRoute)



app.use(collectionRoute);

app.listen(port, function(){
  console.log('server is listening on %s', port)
})
