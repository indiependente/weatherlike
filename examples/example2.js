var weatherlike	=	require('../');


['1118370',
 '721943',
 '2441278'].forEach(function(element, index, array){
				weatherlike.inWoeid(element, function(err, weather){
					if (err)
						throw err;
					console.log('Weather in %s for today : ', element, weather.forecast[0].text.toLowerCase());
				});
			});