//L.map creates a map as an object within a certain div. In this case called 'map' in my HTML
//setView sets the starting page of the map to certain x y centerpoint coordinates and z as a zoom level 
var map = L.map('map').setView([43.0, -107.5000], 3);

//brings in a Tile Set through a specific URL. Can also bring in options object
L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);//adds to map. pretty self explanitory.

//creates a marker object at a given lat lng
var marker = L.marker([51.5,-0.09]).addTo(map);

//creates a circle at a given centerpoint with a specific radius in meters
var circle = L.circle([51.508, -0.11], 500, {
	color: '#000000',
	fillColor: '#red',
	fillOpacity: 0.5
}).addTo(map);

//creates polygon with given vector points [can have holes- seperate arrays]
var polygon = L.polygon([
	[51.509, -0.08],
	[51.503, -0.06],
	[51.51, -0.047]
	]).addTo(map);

//bindPopup is an even object that creates a pop up with a message only when hovered over
marker.bindPopup("<b>Hello!</b><br>You have stumbled upon a popup.").openPopup();
circle.bindPopup("I'm a square...<br>kidding");
polygon.bindPopup("I'm a polygon.");

//
var popup = L.popup()
	.setLatLng([51.5, -0.09])
	.setContent("I am a standalone popup...<br>I'm so lonley")
	.openOn(map);

//this function conatins 3 event methods that are each activated when fuction is called below  
function onMapClick(e) {
	popup
		.setLatLng(e.latlng) //stores lat and long data
		.setContent("You clicked the map at "+ e.latlng.toString()) //defines what message will pop up
		.openOn(map); //defines where it will pop up on
}

//
map.on('click', onMapClick); //calls the function with the on method when map is clicked


//GeoJSON stuff

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJson(geojsonFeature).addTo(map); // .geojson creates a geojson layer

var myLines = [{
	"type":"LineString",
	"coordinates": [[-100,40],[-105,45], [-100,55]]
}, {
	"type":"LineString",
	"coordinates": [[-105,40],[-110,45], [-115,55]]
}];

var myStyle = {
	"color":"#808080",
	"weight":3,
	"opacity": 0.1
};

L.geoJson(myLines, {
	style: myStyle
}).addTo(map);

var myLayer = L.geoJson().addTo(map);
myLayer.addData(geojsonFeature); //adds geojson object to a layer

var states = [{
	"type": "Feature",
	"properties": {"party": "Republican"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
		]]
	}
}, {
	"type": "Feature",
	"properties": {"party": "Democrat"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-109.05, 41.00],
            [-102.06,  40.99],
            [-102.03,  36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
		]]
	}
}];

L.geoJson(states, {
	style: function(feature) {
		switch (feature.properties.party) {
			case 'Republican': return {color: "#ff0000"}
			case 'Democrat': return {color: "#0000ff"}
		}
	}
}).addTo(map);

var geojsonMarkerOptions = {
	radius: 8,
	fillColor: "#808080",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

L.geoJson(geojsonFeature, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions);
	}
}).addTo(map);

function onEachFeature(feature, layer) {
	if (feature.properties && feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
	}
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }    
};

L.geoJson(geojsonFeature, {
	onEachFeature: onEachFeature
}).addTo(map);

var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJson(someFeatures, {
	//this function takes whats in the someFeatures array and checks the properties and for show_on_map
	filter: function(feature, layer) {
		return feature.properties.show_on_map; 
	}
}).addTo(map);






















//scroll ability