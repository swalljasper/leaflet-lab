function createMap(){
	var map = L.map('map', {
		center: [20, 0],
		zoom: 2
	});

	L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	maxZoom: 19
}).addTo(map);

getData(map);

}

function onEachFeature(feature, layer) {
	var popupContent = "";
	if (feature.properties) {
		for (var property in feature.properties){
			popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
		}
		layer.bindPopup(popupContent);
	};
};




function getData(map) {
		$.ajax("../data/MegaCities.geojson", {
		dataType: "json",
		success: function(response){
			
			var geojsonMarkerOptions = {
				radius: 5,
				fillColor: "#000",
				color: "#fff",
				weight: 1,
				opacity: 1,
				fillOpacity: 1
			};

			L.geoJson(response, {
				pointToLayer: function (feature, latlng){
					return L.circleMarker(latlng, geojsonMarkerOptions);
				}
			}).addTo(map);
		}
	});
}	

$(document).ready(createMap);