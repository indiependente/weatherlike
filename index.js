var http 		= 	require('http');
var https 		= 	require('https');
var qs 			= 	require('querystring');
var LRU 		=	require('lru-cache');

var VERBOSE 	= 	process.env.VERBOSE;

/*
	WOEID API
 */
var placesquery = 'select * from geo.places where text="$$$"';
var woeidapi 	= 'http://query.yahooapis.com/v1/public/yql?q=$$$&rnd=DATE&format=json&callback=';
/*
	FORECAST API
 */
var yahoo 		= 	"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D$&format=json&callback=";

/*
	LRU CACHE SETTINGS
 */
var CACHE_LIMIT = 	1000;
var idCache 	= 	LRU(CACHE_LIMIT);



/*
	UTILITY FUNCTIONS
 */
function getYahooURLFromWoeid(woeid){
	return yahoo.replace("$", woeid);
}

function escapeQuery(query){
	return qs.escape(query);
}

function getPlaceQuery(place){
	return placesquery.replace("$$$", place);
}

function querifiedWoeidURL(escapedQuery){
	var now = new Date();
	return woeidapi.replace("DATE", now.getFullYear() + now.getMonth() + now.getDay() + now.getHours()).replace("$$$", escapedQuery);
}
/**************************************/



function getWoeid(city, callback){
	http.get(querifiedWoeidURL(escapeQuery(getPlaceQuery(city))), function(res){
	var data = '';

	res.on('data', function(chunk){
		data += chunk;
	});

	res.on('end', function(){
		var obj = JSON.parse(data);
		var woeid;
		if (obj.query.results.place[0])
			woeid = obj.query.results.place[0].woeid;
		else if (obj.query.results.place.woeid)
			woeid = obj.query.results.place.woeid;
		else {
			callback(true, null);
			return;
		}
		if(VERBOSE)
				console.log("woeid found is %s", woeid);
			if (!idCache.has(city)){
				idCache.set(city, woeid);	//	cache the <city, woeid>
				if (VERBOSE) {
					console.log("%s has been cached", city);
					console.log("idCache now has length of %s", idCache.keys().length);
				}
			}
			var url = getYahooURLFromWoeid(woeid);
			getWeather(woeid, url, callback);

	});
});
}


function getWeather(woeid, yahoo, callback){
	https.get(yahoo, function(response){
		var weather = "";
		response.on('data', function(data){
			weather += data;
		});
		response.on('end', function(){
			var json = JSON.parse(weather);
			if(json.query)
				callback(null, {'woeid' : woeid, 'forecast' : json.query.results.channel.item.forecast});
			else
				callback(true, null);

			// woeid = "";
			// firstwoeid = true;

		});
	});
}

function inCity(city, callback){
	if(idCache.has(city))	//	try to save time using the cache
		{
			if(VERBOSE){
				console.log("City %s found in cache!", city);
				console.log("woeid : %s", idCache.peek(city));
			}
			woeid = idCache.get(city);
			getWeather(woeid, getYahooURLFromWoeid(woeid), callback);
		}
	else
		{
			if(VERBOSE){console.log("%s not cached yet", city);}
			getWoeid(city, callback);
		}
}

function inWoeid(woeid, callback){
	https.get(getYahooURLFromWoeid(woeid), function(response){
		var weather = "";
		response.on('data', function(data){
			weather += data;
		});
		response.on('end', function(){
			var json = JSON.parse(weather);
			if(json.query)
				callback(null, {'woeid' : woeid, 'forecast' : json.query.results.channel.item.forecast});
			else
				callback(true, null);
		});
	});
}

module.exports.inCity = inCity;
module.exports.inWoeid = inWoeid;