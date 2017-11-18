var crc = require('crc');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
var crypto = require('crypto');
app.use(express.bodyParser());
var amqp = require('amqplib/callback_api');


var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '54.183.8.230',
  user     : 'root',
  password : 'cmpe281',
  database : 'urlshortener'
});

connection.connect();

function shortner(url){
  if(url in urlMap)
    return urlMap[url];
  var id = crc.crc32(url)

  IdMap[id] = url;

  var tmp ="";
    _rand = crypto.randomBytes(25).toString('hex');
    _base = _rand.length;

  for (var i = 0; i < 10; i++)
    tmp += _rand.charAt(Math.floor(Math.random() * _rand.length));


console.log("Short url: " + tmp);
urlMap[url] = tmp;

const { URL } = require('url');
const URL_parser = new URL(url);

console.log("Domain name : "+URL_parser.hostname)

var dataToPersisit = {websitename:URL_parser.hostname,originalurl:url,shorturl:tmp};

var query = connection.query('INSERT IGNORE INTO urlinfo SET ?',dataToPersisit, function(err, result) {

  if (!err)
    console.log("The data is stored to DB"+result);
  else{
    console.log("Error while performing Query."+err);
    throw err;
  }
});
console.log(query.sql);
amqp.connect('amqp://54.183.8.230', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'shortner';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(tmp+","+url));
    console.log(" [x] Sent "+tmp+","+url);
  });
});
return tmp
}

   
//Map of id to url
var IdMap = {};
//map of url to id
var urlMap ={};

app.post('/v1/shorten', urlencodedParser, function (req, res) {
   console.log(req.body);
   setTimeout(function(){
	   response = {
	     shortUrl:"http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/"+shortner(req.body.url)
	   };
	   console.log(response);
	   console.log(IdMap);
	   console.log(urlMap);
	   
   	   res.send(JSON.stringify(response));
	  return res.end();
   }, 400);
  
})

app.get('/', function (req, res) {
   setTimeout(function(){
           response = {
             status:"ok"
           };
           res.send(JSON.stringify(response));
          return res.end();
   }, 400);

})
var server = app.listen(8081 , function (){

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)

})
