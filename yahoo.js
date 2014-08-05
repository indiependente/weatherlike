var http 		= 	require('http');
var qs 			= 	require('querystring');

// Create Yahoo Weather feed API address
// Cache results for an hour to prevent overuse
now = new Date();

var query = 'select * from geo.places where text="'+ process.argv[2] +'"';
var api = 'http://query.yahooapis.com/v1/public/yql?q='+ qs.escape(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=';

http.get(api, function(res){
	var data = '';
	res.on('data', function(chunk){
		data += chunk;
	});
	res.on('end', function(){
		var obj = JSON.parse(data);
		if (obj.query.results.place[0])
			console.log(obj.query.results.place[0].woeid);
		else if (obj.query.results.place.woeid)
			console.log(obj.query.results.place.woeid);
		else console.error('no data');

	});
});