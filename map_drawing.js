// These variables need to be in global scope for the module to function:
var directionsService;
var map;

/*
 * Initialize the program state (everything here should be done as soon as the API is loaded)
 */
function init() {
	directionsService = new google.maps.DirectionsService();
}

/*
 * Set up the map; it is invisble at the end of this function
 */
function setUpMap() {
	var text_color = '#757D70';
	var mapStyle = [
		{elementType: 'geometry', stylers: [{ color: '#FBEFDF' }]},
		{elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }]},
		{elementType: 'labels.text.fill',   stylers: [{ color: text_color }]},
		{featureType: 'poi.business', stylers: [{ visibility: 'off' }]},
		{featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }]}, 
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{ color: text_color }]
		},
		{ 
			featureType: 'poi', 
			elementType: 'labels.icon', 
			stylers: [{ visibility: 'off' }] 
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{ color: text_color }]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{ color: '#DADFA9' }]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{ color: text_color }]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{ color: '#D3CEC8' }]
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{ color: '#FBEFDF' }]
		},
		{
			featureType: 'road', 
			elementType: 'labels.icon', 
			stylers: [{ visibility: 'off' }] 
		}, 
		{
			featureType: 'transit', 
			stylers: [{visibility: 'off'} ] 
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [{visibility: 'off'}]
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
			stylers: [{ visibility: 'off' }]
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
		visible: false,
		clickableIcons: false,
		disableDefaultUI: true,
		draggable: false,
		scrollWheel: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: mapStyle
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

/*
 * Begin the game. The two parameters must be given as LatLngs
 */
function playGame(origin, destination) {
	setUpMap();

	// Recenter the map halfway between the two points, and make it visible
	map.setCenter(google.maps.geometry.spherical.interpolate(origin, destination, 0.5));
	map.setVisible(true);

	var originMarker = new google.maps.Marker({
		draggable: true, // let the user drag this marker
		position: origin,
		label: '↝', // placeholder
		title: 'Drag here to draw your route!',
		map: map
	});

	var destinationMarker = new google.maps.Marker({
		draggable: false,
		position: destination,
		label: '↯', // placeholder
		title: 'Your route will end here.',
		map: map
	});

	var drawnRoute = new google.maps.Polyline({
		geodesic: true,
		map: map,
		strokeColor: 'red',
		strokeWeight: 3,
		visible: true,
		clickable: false,
		draggable: false
	});

	var currentlyDrawing = false;

	// Make the origin marker draggable
	google.maps.event.addListener(originMarker, 'dragstart', function() {
		drawnRoute.setPath([origin]); // initialize path to only the start location
		currentlyDrawing = true;
	});

	// As the marker is dragged, the path is updated in real time
	google.maps.event.addListener(originMarker, 'drag', function() {
		if (!currentlyDrawing) {
			return;
		}
		var currentLocation = originMarker.getPosition();
		drawnRoute.getPath().push(currentLocation); // Append the current location of the marker
		if (google.maps.geometry.spherical.computeDistanceBetween(currentLocation, destination) < 50) {
			// path ended near destination
			endRouteDrawing();
		}
	});

	// If the user terminates the dragging too far from the destination, we clear the path and snap the marker back
	google.maps.event.addListener(originMarker, 'dragend', function() {
		var currentLocation = originMarker.getPosition();
		if (google.maps.geometry.spherical.computeDistanceBetween(currentLocation, destination) < 50) {
			// path ended near destination
			endRouteDrawing();
		} else {
			resetRouteDrawing();
		}
	});

	// Reset the route drawing, so the user can try again
	function resetRouteDrawing() {
		drawnRoute.setPath([]);
		originMarker.setPosition(origin);
		originMarker.setDraggable(true);
		originMarker.setVisible(true);
		currentlyDrawing = false;
	}
	
	// Stop drawing the route
	function endRouteDrawing() {
		// path ended near destination
		originMarker.setDraggable(false);
		originMarker.setVisible(false);
		drawnRoute.getPath().push(destination);
		currentlyDrawing = false;
	}
	
	// Calculate the similarity between the optimal route (Google Directions)
	// and the user-drawn route
	function compareRouteToOptimal() {
		directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: google.maps.DirectionsTravelMode.WALKING
		}, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				// Set up google's route
				optimalRoutePath = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
	
				// merge the two routes into a polygon
				var routeLoop = new google.maps.MVCArray;
				drawnRoute.getPath().forEach(function(node, index) {
					routeLoop.push(node);
				});
				// add the nodes from Google Directions in reverse order
				var optimalLength = optimalRoutePath.length;
				for (var i = optimalLength - 1; i >= 0; --i) {
					routeLoop.push(optimalRoutePath[i]);
				}
				// calculate the area of the loop
				var area = google.maps.geometry.spherical.computeArea(routeLoop);
				alert('Area: '+ area + ' square meters');
			}
		});
	}
}
