// map-drawing test
// caleb lucas-foley, december 9 2016
//
// findings: we can draw an arbitrary polyline on the map, but snapping it to roads is not feasible

var map;

// The user starts drawing here
var origin = new google.maps.LatLng(38.8977, -77.0365);
var originMarker;

// The user finishes drawing here
var destination = new google.maps.LatLng(38.889469, -77.035258);
var destinationMarker

var mapOptions = {
	zoom: 15,
	center: google.maps.geometry.spherical.interpolate(origin, destination, 0.5),
	clickableIcons: false,
	disableDefaultUI: true,
	draggable: false,
	scrollWheel: false,
};

var polylineOptions = {
	geodesic: true,
	map: map,
	strokeColor: 'red',
	strokeWeight: 3,
	visible: true,
	clickable: false,
	draggable: false
};

var currentlyDrawing = false;

var drawnRoute = new google.maps.Polyline(polylineOptions);

// Directions service, for calculating nearest road locations and also getting directions
var directionsService = new google.maps.DirectionsService();

function init() {
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	//drawingManager.setMap(map);
	drawnRoute.setMap(map);
	
	// set up markers
	originMarker = new google.maps.Marker({
		draggable: true, // let the user drag this marker
		position: origin,
		label: '↝',
		title: 'Drag here to draw your route!'
	});
	destinationMarker = new google.maps.Marker({
		draggable: false,
		position: destination,
		label: '↯',
		title: 'Your route will end here.'
	});

	currentlyDrawing = false;

	originMarker.setMap(map);
	destinationMarker.setMap(map);

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
}

function resetRouteDrawing() {
	drawnRoute.setPath([]);
	originMarker.setPosition(origin);
	originMarker.setDraggable(true);
	originMarker.setVisible(true);
	currentlyDrawing = false;
}

function endRouteDrawing() {
	// path ended near destination
	originMarker.setDraggable(false);
	originMarker.setVisible(false);
	drawnRoute.getPath().push(destination);
	currentlyDrawing = false;
}

// Unused
// Smooth out kinks in the route, leaving at most numWaypoints points, including the
// origin and destination
function smoothRoute(numWaypoints) {
	// Direction API wants a maximum of 23 waypoints in the route.
	// We go over the query limit if we try to sequentially snap a route with more than about 12 vertices
	var length = drawnRoute.getPath().getLength();
	var stride = Math.ceil(length / numWaypoints);
	var oldPath = drawnRoute.getPath();
	var newPath = [];
	for (var i = 0; i < length; i += stride) {
		newPath.push(oldPath.getAt(i));
	}
	newPath.push(destination);
	drawnRoute.setPath(newPath);
}

// Unused
// Returns the nearest road to a given LatLng, as a LatLng
// Uses walking directions, so the nearest road may be a footpath
//
// Don't call this too often! It is resource-intensive and goes over the query limit
function nearestRoadTo(location) {
	// Get a route from the location to itself
	directionsService.route({
		origin: location,
		destination: location,
		travelMode: google.maps.DirectionsTravelMode.WALKING
	}, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			return response.routes[0].legs[0].start_location;
		} else {
			return null;
		}
	});
}

// Unused
function getDirectionsAlongRoute() {
	waypointsArray = [];
	drawnRoute.getPath().forEach(function(location) {
		waypointsArray.push({
			location: location,
			stopover: true
		});
	});
	directionsService.route({
		origin: origin,
		destination: destination,
		travelMode: google.maps.DirectionsTravelMode.WALKING,
		waypoints: waypointsArray
	}, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			drawnRoute.setPath(google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline));
		} else {
			console.log(status);
			console.log('Failed to get route!')
		}
	});
}

// Unused
function snapRouteToRoads() {
	var path = drawnRoute.getPath();
	var length = path.getLength();
	console.log('length:' + length);
	var i = 1; // don't snap the origin
	function snapToRoad(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			path.setAt(i++, response.routes[0].legs[0].start_location);
			if (i < length - 1) { // don't snap the destination
				console.log(i);
				directionsService.route({
					origin: path.getAt(i),
					destination: path.getAt(i),
					travelMode: google.maps.DirectionsTravelMode.WALKING
				}, snapToRoad);
			}
		} else {
			console.log(status);
			console.log('Failed to snap point to roads!')
		}
	}
	directionsService.route({
		origin: path.getAt(i),
		destination: path.getAt(i),
		travelMode: google.maps.DirectionsTravelMode.WALKING
	}, snapToRoad);
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
			
			// Now make the polygon to display
			// var betweenRoutes = new google.maps.Polygon({
			// 	paths: [routeLoop],
			// 	geodesic: true,
			// 	visible: true,
			// 	fillColor: 'cyan',
			// 	fillOpacity: 0.5,
			// 	strokeWeight: 3,
			// 	strokeColor: 'cyan',
			// 	map: map
			// });
		}
	});
}

/* Side Bar */
function htmlbodyHeightUpdate(){
		var height3 = $( window ).height()
		var height1 = $('.nav').height()+50
		height2 = $('.main').height()
		if(height2 > height3){
			$('html').height(Math.max(height1,height3,height2)+10);
			$('body').height(Math.max(height1,height3,height2)+10);
		}
		else
		{
			$('html').height(Math.max(height1,height3,height2));
			$('body').height(Math.max(height1,height3,height2));
		}
		
	}