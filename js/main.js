//load tileset into map

function createMap(){
	var map = L.map('map', {
		center: [41.8058,-87.5935],
		zoom: 12
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 19,
	id: 'swal94.4103e88e',
	accessToken: 'pk.eyJ1Ijoic3dhbDk0IiwiYSI6ImNpZnk5aWdzcDR5dDl0ZWx5dDhwZW13ejAifQ.y18LYK4VbBo8evRHtqiEiw'
}).addTo(map);

getData(map);

}



//load data to map

function getData(map) {
		$.ajax("../data/southSide.geojson", {
		dataType: "json",
		success: function(data){

			createPropSymbols1(data, map);

		}
	});
}	

//identify data attribute and convert to proportional symbols

// function createPropSymbols(data, map){
	
// 	console.log("ran createPropSymbols")

// 	var attribute = "Murders 2014"

// 	var geojsonMarkerOptions = {
// 		radius: 8,
// 		fillColor: "#fff",
// 		color: "#fff",
// 		weight: 1,
// 		opacity: 1,
// 		fillOpacity: 0.5 
// 	};

// 	L.geoJson(data, {
// 		pointToLayer: function (feature, latlng) {
// 			var attValue = Number(feature.properties[attribute]);
			
// 			geojsonMarkerOptions.radius = calcPropRadius(attValue);

// 			return L.circleMarker(latlng, geojsonMarkerOptions);
// 		}
// 	}).addTo(map);
// };



//make proportional symbols change sizes based on selected years

function calcPropRadius(attValue) {
	
	console.log("ran calcPropRadius")

	var scaleFactor = 150;
	var area = attValue * scaleFactor;
	var radius = Math.sqrt(area/Math.PI);

	return radius;
};


//add popups

function pointToLayer(feature, latlng) {

	console.log("ran pointToLayer")

	var attribute = "Murders 2014";

	var options = {
		fillColor: "#fff",
		color: "#fff",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};

	var attValue = Number(feature.properties[attribute]);

	options.radius = calcPropRadius(attValue);

	var layer = L.circleMarker(latlng, options);

	var panelContent = "<p><b>Neighborhood: </b>" + feature.properties.Neighborhood + "</p>";

	var year = attribute.split("_")[1];
	panelContent += "<p><b>Murders in " + year + ": </b>" + feature.properties[attribute] + "</p>";

	var popupContent = feature.properties.Neighborhood;

	layer.bindPopup(popupContent, {
		offset: new L.Point(0,-options.radius)
	});

	layer.on({
		mouseover: function(){
			this.openPopup();
		},
		mouseout: function(){
			this.closePopup();
		},
		click: function(){
			$("#panel").html(popupContent);
		}
	});

	return layer;
};

function createPropSymbols1(data, map){

	console.log("ran createPropSymbols1")
	L.geoJson(data, {
		pointToLayer: pointToLayer
	}).addTo(map);
};




$(document).ready(createMap);