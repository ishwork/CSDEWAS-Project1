//Variable initialization for map
var map;
var flightPlanCoordinates;
var locations = [];
var labels;
var markers;
var flightPath ;
var markerCluster;
var latestSet;

//Remove route and buses from map
function removeMapInfo(){
    markerCluster.clearMarkers();
    flightPath.setMap(null);
};

//Document ready functions to call
$(document).ready(function(){
    getRoutesInitial();
    $('#routeOptions').change(removeMapInfo);
});

//Function for sorting values
function comparator(a, b) {
    return parseInt(a["route_id"], 10) - parseInt(b["route_id"], 10);
}

//Function to zoom map on selected Line
function zoomToObject(obj){
    var bounds = new google.maps.LatLngBounds();
    var points = obj.getPath().getArray();
    for (var n = 0; n < points.length ; n++){
        bounds.extend(points[n]);
    }
    map.fitBounds(bounds);
}

//Get buses data from API and plot on map
function getBuses(){
    markerCluster.clearMarkers();
    locations = [];
    markers = [];
    var e = document.getElementById("routeOptions");
    var strUser = e.options[e.selectedIndex].value;
    var xmlHttp = new XMLHttpRequest();
    url = "https://data.foli.fi/siri/vm";
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    data3 = JSON.parse(xmlHttp.responseText);
    if(data3.success==false){ //check if route is found or not
        alert("No Route Found!!!");
        return
    }
    var keys = [];
    for(var k in data3.result.vehicles) keys.push(k);

    //Filter only selected Line buses
    for (var i = 0, len = keys.length; i < len; i++) {
        bus = data3.result.vehicles[keys[i]];
        if (bus.publishedlinename==strUser){
            var location = { "lat" : bus.latitude, "lng" : bus.longitude}
            locations.push(location);
        }
    }
    if (locations.length==0)
        alert('No active buses found on this Line');

    //Create markers for buses
    markers = locations.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });
    markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

//Get shapes for route from API and plot on map the Route
function getShapes(){
    flightPath.setMap(null);
    var e = document.getElementById("routeOptions");
    var strUser = e.options[e.selectedIndex].value;
    var xmlHttp = new XMLHttpRequest();
    url = "https://data.foli.fi/gtfs/v0/"+latestSet+"/trips/route/"+ strUser;
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    data3 = JSON.parse(xmlHttp.responseText);
    if(data3.success==false){
        alert("No Route Found!!!");
        return
    }
    var polygons = [];
    var flightPlanCoordinates2 = [];
    for (var i = 0, len = data3.length; i < len; i++) {
        var xmlHttp2 = new XMLHttpRequest()
        url = "https://data.foli.fi/gtfs/v0/"+latestSet+"/shapes/"+ data3[i].shape_id;
        xmlHttp2.open( "GET", url, false ); // false for synchronous request
        xmlHttp2.send( null );
        data5 = xmlHttp2.responseText;
        data4 = JSON.parse(data5);
        for (var i = 0, len = data4.length; i < len; i++) {
            var location = { "lat" : data4[i].lat, "lng" : data4[i].lon}
            flightPlanCoordinates2.push(location);
        }
    }
    //Draw polyline on map
    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates2,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    zoomToObject(flightPath);
};

//Get all the routes from API and populate in Select option
function getRoutes(route_param){
    var xmlHttp = new XMLHttpRequest();
    latestSet = route_param;
    url = "https://data.foli.fi/gtfs/v0/"+route_param+"/routes";
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    data2= JSON.parse(xmlHttp.responseText);
    data2 = data2.sort(comparator);
    for (var i = 0, len = data2.length; i < len; i++) {
        document.getElementById("routeOptions").innerHTML += "<option value='"+data2[i].route_id+"'>Line "+data2[i].route_id+"</option>"
    }
}

//Get Latest data folder name of API
function getRoutesInitial(){
    var xmlHttp = new XMLHttpRequest();
    url = "https://data.foli.fi/gtfs/";
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    data = JSON.parse(xmlHttp.responseText);
    getRoutes(data.latest);
}

//Initalize the google map
function initMap() {
    locations = [];
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: {lat: 60.451607, lng: 22.267294},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    // Create an array of alphabetical characters used to label the markers.
    labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    markers = locations.map(function(location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    flightPlanCoordinates = [];
    flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);

    // Add a marker clusterer to manage the markers. (Empty)
    markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
