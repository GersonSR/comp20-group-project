
// locations.get_two_places( center, radius, maxDist, minDist, keywords )
// 		center: google LatLng object
// 		radius: the radius around the center in which you want the two points\
// 				to fall
// 		maxDist: the maximum distance between both points
// 		minDist: the minimum distance between both points
// 		keywords: additional facts about the places if you want to find only 
// 				  restaurants or something
//
// returns a promise object that will resolve with places and throw
// an error if something goes wrong.
// 
// resolve format: {
// 						place_1: (google place object),
// 						place_2: (google place object),
// 						dist:    (distance in meters )
// 				   }
//  
//  all units of distance are in meters
get_two_places = function( center, radius, maxDist, minDist, callback, keywords ) {
	var request = {
		radius:   '' + radius,
		location: center
	};
	if( keywords != undefined ){
		request.keyword = keywords;
	}
	placesService.nearbySearch( request, function( results, status ) {
		if ( status == google.maps.places.PlacesServiceStatus.OK) {
				var randy   = getRandomInt( 0, results.length );
				var index   = ( randy + 1 ) % results.length; 
				var latlng1 = results[randy].geometry.location;
				var latlng2;
				var dist;
				while( results.length > 1  ){
			  		if ( index == randy ) {
			  			console.log
			  			results.splice( randy, 1 );
			  			randy  %= results.length;
			  			index   = (randy + 1) % results.length;
			  			latlng1 = results[randy].geometry.location;
			  		} else {
			  			latlng2 = results[index].geometry.location;
			  			dist    = google.maps.geometry.spherical.computeDistanceBetween( latlng1, latlng2 );
			  			if ( dist >= minDist && dist <= maxDist ) {
			  				callback({
			  					place_1: results[randy], 
			  					place_2: results[index],
			  					dist: dist
			  				});
			  				return;
			  			}
			  			index = ( index + 1 ) % results.length;
			  		}
				}
				callback( { error:'no two places satisfy input' } );
		}else {
			callback( { error:'google places service response error' });
		}	
	});
};

// callback must take in the parsed json object as a
// a parameter.
// 
// edit: This method works best when your server has decided
// 	     to enable CORS 
function get_json( request_url, callback ){
	var request = new XMLHttpRequest();
	request.open("get", request_url, true);
	request.onreadystatechange = function( request_url, callback)
	{
		if(request.readyState == 4){
			if ( request.status == 200 ) {
				var raw  = request.responseText;
				var data = JSON.parse(raw);
				callback(data);
				return;
			}else{
				get_json( request_url, callback );
			}
		}
	}
	request.send();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}