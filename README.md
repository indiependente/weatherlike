weatherlike
===========

Node.js weather server JSON API

##How it works
- Get the city woeid code by scraping http://woeid.rosselliot.co.nz/
- Query Yahoo Weather APIs for that woeid
- Reply with the JSON weather forecast for 5 days from the moment of the request



##API
####weatherlike has two APIs
- ```weatherlike.inCity(city, callback)``` where you can specify the city you want the forecast for.

- ```weatherlike.inWoeid(woeid, callback)``` where you can ask for that woeid in case you already know it.



##Example
More examples in `examples/`
```javascript
var weatherlike = require('./weatherlike');

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
```

##JSON reply
####weatherlike sends back a reply like this for both requests:
```json
{"woeid":"721943","forecast":[{"code":"32","date":"4 Aug 2014","day":"Mon","high":"85","low":"68","text":"Sunny"},{"code":"32","date":"5 Aug 2014","day":"Tue","high":"87","low":"68","text":"Sunny"},{"code":"32","date":"6 Aug 2014","day":"Wed","high":"89","low":"68","text":"Sunny"},{"code":"34","date":"7 Aug 2014","day":"Thu","high":"87","low":"68","text":"Mostly Sunny"},{"code":"32","date":"8 Aug 2014","day":"Fri","high":"87","low":"69","text":"Sunny"}]}
```
As you can see you can get the woeid as soon as you get the first reply.



##License
####MIT
