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
}
