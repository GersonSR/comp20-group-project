var locations = {};

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
locations.get_two_places = function( center, radius, maxDist, minDist, keywords ) {
	return new Promise((resolve,reject)=>{
		this.my_places  = 'loading';
		this.center     = center   ; 
		this.minDist  	= minDist  ;
		this.maxDist    = maxDist  ;
		this.keywords  	= keywords ;
		this.get_all_locations_within( radius )
		.then(locations.sort_response)
		.then(
			(good )=>{					 resolve( good );},
			(error)=>{console.log(error);reject( error );}
		);
	});
};

locations.get_all_locations_within = function( radius ){
	var request = {
		radius:   '' + radius,
		location: this.center
	};
	if( this.keywords != undefined ){
		request.keyword = this.keywords;
	}
	return new Promise( function( resolve, reject ){ 
		service = new google.maps.places.PlacesService(map);
		service.nearbySearch( request, function( results, status ) {
			if ( status == google.maps.places.PlacesServiceStatus.OK) {
				resolve( results );
				return;
			}else {
				reject( 'google_status_error' );
				return;
			}	
		});
	});
}

locations.sort_response = function( results ){	
	return new Promise((resolve, reject)=>{
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
				/* uncomment to see whats being compared and how far they are from eachother
	  			console.log('\t '+ results[randy].name +
	  						'\t' + results[index].name +
	  						'\t' + dist);
	  			*/
	  			if ( dist >= this.locations.minDist && dist <= this.locations.maxDist ) {
	  				this.locations.my_places = {
	  					place_1: results[randy], 
	  					place_2: results[index],
	  					dist: dist
	  				};
	  				/* uncomment too see the names of resulting places 
	  				console.log(this.locations.my_places.place_1.name); 
	  				console.log(this.locations.my_places.place_2.name);
	  				*/
	  				resolve( this.locations.my_places );
	  				return;
	  			}
	  			index = ( index + 1 ) % results.length;
	  		}
		}
	  	reject('no_two_places_satisfy_input');
	  	return;
	  });
}

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