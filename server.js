var weatherlike = require('./weatherlike');
var http = require('http');
var url = require('url');

function sendJSON(data, wstream){
	wstream.writeHead(200, {'Content-Type' : 'application/json'});
	wstream.end(JSON.stringify(data));
}



http.createServer(function(req, res){
	if (req.method === "GET"){
		var parsedURL = url.parse(req.url, true);
		if (parsedURL.pathname === "/weatherapi/city"){
			weatherlike.inCity(parsedURL.query.city, function(err, weather){
				if (err)
					throw err;
				sendJSON(weather, res);
			});
		}
		else if (parsedURL.pathname === "/weatherapi/woeid"){
			weatherlike.inWoeid(parsedURL.query.woeid, function(err, weather){
				if (err)
					throw err;
				sendJSON(weather, res);
			});
		}
	}
}).listen(3700);