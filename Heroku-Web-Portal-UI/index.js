var express = require('express');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.set('port', (process.env.PORT || 5000));

app.use(require('connect').bodyParser());

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	var data = {
					tmp: '',
					noSuccess: 1
				}
  response.render('pages/index', {data: data});
});

app.post('/shortenURL', function(request, response){
	var xmlhttp = new XMLHttpRequest();  
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful. Status: " + this.status);
				resptext = JSON.parse(this.responseText);
				state_changed = true;
				console.log("shortUrl " + resptext.shortUrl);
				request.body.shortlink = resptext.shortUrl;
				var data = {
					tmp: resptext.shortUrl,
					noSuccess: 0
				}
				response.render('pages/index', {data: data});
		        }
		}
	console.log("before POST");
	console.log("request body " + request.body.originalUrl);
	xmlhttp.open("POST", "http://localhost:8081/v1/shorten");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'originalUrl': request.body.originalUrl}));
});

app.get('/shortenURL', function(request, response){
	console.log("in get method of /shortenURL" + request.shortenURL);
	response.render('/', {shortenURL: request.shortenURL});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
