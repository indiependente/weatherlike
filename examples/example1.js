var weatherlike	=	require('../weatherlike');


['Rome',
 'London',
 'Berlin',
 'Tokyo',
 'New York',
 'Moscow',
 'San Francisco'].forEach(function(element, index, array){
				weatherlike.inCity(element, function(err, weather){
					if (err)
						throw err;
					console.log('Weather in %s for today : ', element);
					console.dir(weather);
				});
			});