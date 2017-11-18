var express = require('express');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var validUrl = require('valid-url');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

//app.use(require('connect').bodyParser());
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	var data = {
					tmp: '',
					noSuccess: 1,
					isValidURL: 1
				}
  response.render('pages/index', {data: data});
});

app.post('/shortenURL', function(request, response){
	console.log("In POST method of shortenURL");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			resptext = JSON.parse(this.responseText);
			state_changed = true;
			request.body.shortlink = resptext.shortUrl;
			var data = {
				tmp: resptext.shortUrl,
				noSuccess: 0,
				isValidURL: 1
			}
			response.render('pages/index', {data: data});
		}
	}
	var url = request.body.originalUrl;
	if (validUrl.isUri(url)){
    	console.log('Looks like an URI');
    	//xmlhttp.open("POST", "http://localhost:8081/v1/shorten");
    	xmlhttp.open("POST", "http://control-panel-elb-492600712.us-west-1.elb.amazonaws.com:8081/v1/shorten");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		//xmlhttp.send(JSON.stringify({'originalUrl': request.body.originalUrl}));
		xmlhttp.send(JSON.stringify({'url': request.body.originalUrl}));
	} 
	else {
    	console.log('Not a URI');
    	var data = {
				tmp: '',
				noSuccess: 1,
				isValidURL: 0
			}
			response.render('pages/index', {data: data});
	}
});

app.get('/shortenURL', function(request, response){
	console.log("in get method of /shortenURL" + request.shortenURL);
	response.render('/', {shortenURL: request.shortenURL});
});

app.get('/stats', function(request, response){
	console.log("In GET Stats ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			var array = [];
			for(d in data){
				if(data[d].domain != null && data[d].hits > 0){
					array.push(data[d]);
				}
			}
			response.render('pages/stats', {data: array});
		}
	}
    //xmlhttp.open("GET", "http://localhost:8050/v1/domain");  
    xmlhttp.open("GET", "http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/domain");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Node app is running on port ' + app.get('port'));
});

