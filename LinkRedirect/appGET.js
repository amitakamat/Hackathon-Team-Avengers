var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
var redis = require('redis');
var client = redis.createClient(6379, "172.17.0.1");
var amqp = require('amqplib/callback_api');
var MongoClient = require('mongodb').MongoClient;

  
var expandedUrl = undefined;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mysql      = require('mysql');
client.on('connect', function() {
    console.log('Connected to REDIS!');
});


amqp.connect('amqp://54.183.8.230:5672/', function(err, conn) {
  conn.createChannel(function(err, ch) {
  var q = 'shortner';

  ch.assertQueue(q, {durable: false});
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
  ch.consume(q, function(msg) {
  var recvd = msg.content.toString();
    client.set(recvd.split(",")[0],recvd.split(",")[1]);
  console.log(" [x] Received %s", msg.content.toString()+" "+recvd.split(",")[0]+" "+recvd.split(",")[1]);
  }, {noAck: true});
  });
});

var connection = mysql.createConnection({
  host     : '54.183.8.230',
  user     : 'root',
  password : 'cmpe281',
  database : 'urlshortener'
});

connection.connect();

function expand(shortUrl){
console.log("lets check"+shortUrl);
    client.get(shortUrl, function(err, reply) {
    console.log("The expanded url is "+reply);
    expandedUrl = reply;

    if(reply==null){
      connection.query("SELECT originalurl from urlinfo where shorturl='"+shortUrl+"'", function(err, rows, fields) {
      if (!err && rows.length!=0){
        console.log('The solution is: ', rows[0]);
        expandedUrl = rows[0].originalurl;
        client.set(shortUrl,rows[0].originalurl, function(err, reply) {
        console.log("The Shorturl "+shortUrl+"is updated in the Redis Cache!!");
      });
      }
      else{
        console.log('Error while performing Query.'+err);
      }
      });
      }
     });
  

  MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
  if(err) { return console.dir(err); }
  console.log("Updating STATS!!")
  connection.query("SELECT websitename from urlinfo where shorturl='"+shortUrl+"'", function(err, rows, fields) {
  if (!err && rows.length!=0){
  console.log('The solution is: ', rows[0]);
  var domain_name = rows[0].websitename;
  console.log("domain name is : "+domain_name);
  var collection_hits = db.collection('webstats_hits');
  var collection_domain = db.collection('webstats_domain');

  collection_hits.update({'key':shortUrl}, {'$inc':{hits:1}},{'upsert':true});
    
  collection_domain.update({'domain':domain_name}, {'$inc':{hits:1}},{'upsert':true});
  } else{
      console.log('Error while performing Query.'+err);
  }
  });
  console.log("Updated STATS!!");
  });

}

function validateUrl(url){
    var ind =url.lastIndexOf("/");
    if(ind >-1 && url.substring(ind+1,url.length)!=""){
      return (url.substring(ind+1,url.length));
    }
    else{
      console.log("Please input the URL in the format:\"https:\/\/IpAddress\/<code>\"");
      return -1;
    }
}

app.get('v1/hits/:keys', function(req, res) {
  console.log("Get hits"+req.params.keys);
    MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
    var collection = db.collection('webstats_hits');
    collection.findOne({key:req.params.keys},{},function(e,docs){
           res.send(docs);
      });
  });
})


app.get('/v1/domain/:domain', function(req, res) {
  var domain_name = req.params.domain;
  console.log("Get domain hits for : "+ domain_name);
  MongoClient.connect("mongodb://admin:admin@281-hackathon-shard-00-00-i3eln.mongodb.net:27017,281-hackathon-shard-00-01-i3eln.mongodb.net:27017,281-hackathon-shard-00-02-i3eln.mongodb.net:27017/test?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin/stats", function(err, db) {
    if(err){
      console.log("error is"+err);
    }
   var collection = db.collection('webstats_domain');
   collection.findOne({domain:req.params.domain},{},function(e,docs){
           res.send(docs);
      });
});
})

app.get('/v1/:code', function (req, res) {
  var shorturl = req.params.code;
    expand(shorturl);
    setTimeout(function(){
    response = {
       expandedUrl:expandedUrl
   };
   console.log(response);

   res.writeHead(302, {
    'Location':expandedUrl
    });

   res.end();
  }, 400);
  
})

  var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
  });
