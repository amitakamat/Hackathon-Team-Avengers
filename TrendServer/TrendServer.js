var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
var MongoClient = require('mongodb').MongoClient;


app.get('v1/hits/:keys', function(req, res) {
  console.log("Get hits"+req.params.keys);
   // MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
    MongoClient.connect("mongodb://localhost:27017/stats", function(err,db) { 
    var collection = db.collection('webstats_hits');
    collection.findOne({key:req.params.keys},{},function(e,docs){
           res.send(docs);
      });
  });
})


app.get('/v1/domain/:domain', function(req, res) {
  var domain_name = req.params.domain;
  console.log("Get domain hits for : "+ domain_name);
  //MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
    MongoClient.connect("mongodb://localhost:27017/stats", function(err,db) { 
    if(err){
      console.log("error is "+err);
    }
   var collection = db.collection('webstats_domain');
   collection.findOne({domain:req.params.domain},{},function(e,docs){
           res.send(docs);
      });
});
})

app.get('/v1/domain', function(req,res){
console.log("Get all domain names")
  //MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
    MongoClient.connect("mongodb://localhost:27017/stats", function(err,db) { 
    if(err){
      console.log("error is "+err);
    }

   db.collection('webstats_domain').find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    })
});
})



var server = app.listen(8050, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
  });

