locations = {};
var Lat = 0;
var Lng = 0;
var request
var client = new google.maps.LatLng(Lat, Lng);
var mapOptions = {
	zoom: 15,
	center: client,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map;
var marker;
var infowindow = new google.maps.InfoWindow();
		
function init() {
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	getMyLocation();
}

function getMyLocation() {
if (navigator.geolocation) { 
	navigator.geolocation.getCurrentPosition(function(position) {
		Lat = position.coords.latitude;
		Lng = position.coords.longitude;
		renderMap();
	});
}
else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap() {
	
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

	client = new google.maps.LatLng(Lat, Lng);

	marker = new google.maps.Marker({
		position: client,
		title: "You are here",
		content: "",
		icon: 'here.png'
	});

	map.panTo(client);

	marker.setMap(map);	

	marker.content = '<p>' + marker.title + ' </p>';
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.content);
		infowindow.open(map, marker);
	});

	// read below
	var two_places = locations.get_two_places( client, 10000, 0 );
}

// SHOULD:
// 		return a single object with two objects in it called place_1 and place_2
// 		This will be held temporarily in locations.my_places
// 			locations.my_places = {
// 				place_1: (google place object),
// 				place_2: (google place object)
// 			}
// 
// WHAT IT DOES:
// 		gets a center circle of radius maxDist, takes all places within that,
// 		and compares all of them (starting at a random one) and then places 
// 		those two into locations.my_places. When the function is called, the
// 		locations object sets locations.my_places to 'undefined'. After the func
// 		is called, the locations.my_places DOES BECOME TWO RANDOM PLACES.
// 		
// 		TODO: this function RETURN those two random places so dealing with ajax
// 			  is easier.
// 		
// 		if there aren't any two places that fit the parameter specified, the
// 		my_places object is set to 'no_two_places_satisfy_input' and to 
// 		'google_status_error' if google returns a status error.
// 		
// keywords is optional
locations.get_two_places = function( center, maxDist, minDist, keywords ) {
	this.my_places  = undefined;
	this.center     = center; 
	this.minDist  	= minDist;
	this.keywords  	= keywords;
	this.get_all_locations_within( maxDist );
	/*
	while( this.my_places == undefined ){
		// HOW DO YOU WAIT FOR SOMETHING IN JAVASCRIPT
	}
	return this.my_places;
	*/
};

locations.get_all_locations_within = function( radius ){
	var request = {
		radius:   '' + radius,
		location: this.center
	};
	if( this.keywords != undefined ){
		request.keyword = this.keywords;
	}
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch( request, this.sort_response );
}

locations.sort_response = function( results, status ){	
	if (status == google.maps.places.PlacesServiceStatus.OK) {
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
      			// uncomment to see whats being compared
				/* 
      			console.log('\t '+ results[randy].name +
      						'\t' + results[index].name +
      						'\t' + dist) 
      			*/
      			if ( dist >= this.locations.minDist ) {
      				this.locations.my_places = {
      					place_1: results[randy], 
      					place_2: results[index]
      				};
      				console.log(this.locations.my_places);				// console output
      				return;
      			}
      			index = ( index + 1 ) % results.length;
      		}
    	}
    	this.locations.my_places = 'no_two_places_satisfy_input';
    	console.log(this.locations.my_places);							// console output
      	return;
    } else {
    	this.locations.my_places = 'google_status_error';
    	console.log(this.locations.my_places);							// console output
    	return;
    }
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


//IN SAME FILE FOR NOW
