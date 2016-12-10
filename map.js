var Lat = 0;
var Lng = 0;
var request
var client = new google.maps.LatLng(Lat, Lng);
var text_color = '#757D70';
var mapStyle = [
            {elementType: 'geometry', stylers: [{color: '#FBEFDF'}]},
            {elementType: 'labels.text.stroke', stylers: [{ visibility: "off" }]},
            {elementType: 'labels.text.fill',   stylers: [{color: text_color }]},
            {featureType: "poi.business", stylers: [ { visibility: "off" } ] },
            {featureType: "administrative.neighborhood", stylers: [ { visibility: "off" } ] }, 
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: text_color }]
            },
            { 
            	featureType: "poi", 
            	elementType: "labels.icon", 
            	stylers: [ { visibility: "off" } ] 
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: text_color }]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#DADFA9' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: text_color }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#D3CEC8' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#FBEFDF' }]
            },
            {
            	featureType: "road", 
            	elementType: "labels.icon", 
            	stylers: [ { visibility: "off" } ] 
            }, 
            {
            	featureType: "transit", 
            	stylers: [ {visibility: "off"} ] 
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#D3CEC8' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#FBEFDF' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: text_color }]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: text_color }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#D9E7E8' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: text_color }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#D9E7E8' }]
            }
          ];

var mapOptions = {
	zoom: 15,
	center: client,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	styles: mapStyle
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

	// example of using "locations.get_two_places" function
	locations.get_two_places( client, 10000, 5000, 1000 ).
	then(
		( good_output )=>{console.log(JSON.stringify( good_output,null,' '));},
		( bad_output  )=>{console.log(JSON.stringify( good_output,null,' '));}
		);
}