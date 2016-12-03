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

	radii = {
		inner: 0,
		outer: 1000
	};

	getRandomLocation( radii, client );
}

// radii {
// 		inner = inner_radius
// 		outer = outer_radius
// }
function getRandomLocation( radii, LatLng ){

	var request = {
		radius: '' + radii.outer,
		location: LatLng
	};

	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request,randLocation_callback);
}

function randLocation_callback ( results, status ) {
	/* 
	// uncomment to show all the nearby places!!
	//
		if (status == google.maps.places.PlacesServiceStatus.OK) {
	    	for (var i = 0; i < results.length; i++) {
	      		console.log( results[i].name );
	    	}
	*/
	  	var randy = getRandomInt( 0, results.length );
	  	return results[randy];

	  	// can determine wich of the results is in the boundry once
	  	// LatLng is somehow added as a parameter
	  	// 
  		/*{  
  		var i = 0;
  		var dist  = google.maps.geometry.spherical.computeDistanceBetween ( results[i].geometry.location, LatLng );
	    while( dist < radii.inner ) {
	    	console.log( results[i].name );
	    	i = (i+1)%results.length;
	    	if( i == randy ){
	    		console.log("no locations in between radii");
	    		return;
	    	}
	    	dist = google.maps.geometry.spherical.computeDistanceBetween ( results[i].geometry.location, LatLng);
		}
		console.log(results[i].name);
		return results[i];*/
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
