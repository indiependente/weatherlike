var weatherlike 	= 	require('./weatherlike');
var http 			= 	require('http');
var url 			= 	require('url');

var PORT 			=	process.argv[2];

var errorResponse 	= 	{'error' : 'BAD REQUEST'};

function sendJSON(data, wstream){
	wstream.writeHead(200, {'Content-Type' : 'application/json'});
	wstream.end(JSON.stringify(data));
}

function sendWeather(err, weather){
	if (err)
		{sendJSON(errorResponse, res); return;}

	sendJSON(weather, res);
}


http.createServer(function(req, res){
	if (req.method === "GET"){
		var parsedURL = url.parse(req.url, true);
		if (parsedURL.pathname.match("^/weatherapi/city")){
			weatherlike.inCity(parsedURL.query.city, sendWeather);
		}
		else if (parsedURL.pathname.match("^/weatherapi/woeid")){
			weatherlike.inWoeid(parsedURL.query.woeid, sendWeather);
		}
	}
}).listen(PORT);