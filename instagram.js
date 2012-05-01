
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , nubnub = require('nubnub')
  , instagram = require('./node-instagram/lib/instagram')
  , credentials = require('./credentials');

var api = new instagram.API(credentials.access_token);

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
	res.send("Oh, hello.");
});

var dataz = [];
var lastupdate = 0;
setTimeout(function() {
	api.media.search({lat:44.044044, lng:-123.074942, distance:3000}, function(data) {
		dataz = data;
		data.forEach(function(item) {
			//console.log(item);
			//console.log("---")
			console.log(new Date(parseInt(item.created_time)*1000));
		});
	});
	lastupdate = new Date();
	console.log("update completed at", lastupdate);
}, 30*1000);

app.get('/json', function(req, res) { 
	console.log('GET /recent, sending api.media.search');
	res.send(dataz);
});

http.createServer(app).listen(8001);

console.log("Express server listening on port 8001");
