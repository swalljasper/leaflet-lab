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
getMoreData(map);


}



//load data to map

function getData(map) {
		$.ajax("../data/southSide.geojson", {
		dataType: "json",
		success: function(data){

			var attributes = processData(data);

			createPropSymbols(data, map, attributes);
			createSequenceControls(map, attributes);

		}
	});
}	






//make proportional symbols change sizes based on selected years

function calcPropRadius(attValue) {

	var scaleFactor = 150;
	var area = attValue * scaleFactor;
	var radius = Math.sqrt(area/Math.PI);

	return radius;
};




function pointToLayer(feature, latlng, attributes) {

	var attribute = attributes[1];

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

	var popupContent = feature.properties.Neighborhood;

	var year = attribute.split(" ")[1];
	popupContent += "<p><b>Murders in " + year + ": </b>" + feature.properties[attribute] + "</p>";

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
			$("#popup").html(popupContent);
			console.log(popupContent);
		}
	});

	return layer;
};

function createPropSymbols(data, map, attributes){

	L.geoJson(data, {
		pointToLayer: function(feature, latlng){
			return pointToLayer(feature, latlng, attributes);
		}
	}).addTo(map);
};

//create sequence controls

function createSequenceControls(map, attributes){

	$('#panel').append('<input class="range-slider" type="range">')

	
	$('#panel').append('<button class="skip" id="reverse">reverse</button>');
    $('#panel').append('<button class="skip" id="forward">forward</button>');
    $('#reverse').html('<img src="../images/reverse-arrow.png">');
    $('#forward').html('<img src="../images/forward-arrow.png">');

    $('.range-slider').on('input',function(){
		console.log("yo")

		var index = $(this).val();

		updatePropSymbols(map, attributes[index]);
		
	});

	$('.skip').click(function(){
		var index = $('.range-slider').val();

		if($(this).attr('id')== 'forward'){
			index++;
			index = index > 6 ? 0 : index;
		} else if($(this).attr('id')== 'reverse'){
			index--;
			index = index < 0 ? 6 : index;
		};

		$('.range-slider').val(index);

		$('.range-slider').attr({
			max: 6,
			min: 0,
			value: 0,
			step: 1
		});

		updatePropSymbols(map, attributes[index]);

		console.log("ey")
	});
};

//processing the data

function processData(data){
	var attributes = [];
	var properties = data.features[0].properties;

	for (var attribute in properties){
		if (attribute.indexOf("Murders") > -1){
			attributes.push(attribute);
		};
	};

	return attributes;
};

function updatePropSymbols(map, attribute){
	console.log(attribute)
	map.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			var props = layer.feature.properties;

			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);

			var popupContent = "<p><b>Neighborhood:</b> " + props.Neighborhood + "</p>";

			var year = attribute.split(" ")[1];
			popupContent += "<p><b>Murders in " + year + ": </b>" + props[attribute] + "</p>";

			layer.bindPopup(popupContent, {
				offset: new L.Point(0,-radius)
			});
		};
	})
}



//FIFTH OPERATOR

function getMoreData(map){
    $.ajax("../data/PoliceStations.geojson", {
        dataType: "json",
        success: function(response){

        	OverlayPoliceStations(map, response);
        }
    });
};

function putOnMap(map, response){
    console.log("ran")

    		var geojsonMarkerOptions = {
                radius: 5,
                fillColor: "#ffff00",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            L.geoJson(response, {
            	pointToLayer: function(feature, latlng){
            		return L.circleMarker(latlng, geojsonMarkerOptions);
            	}
            }).addTo(map);

    
};

function takeOffMap(map, response){

    map.removeLayer(response);

    
};

function OverlayPoliceStations(map, response){
	var x = 0

	$('#overlay').append('<button class="push"> </button>');

	$('.push').click(function(){
		
		if (x === 0){
			putOnMap(map, response);
			x = 1;

		} else if (x === 1){

			takeOffMap(map, response);

		}

	});
}



$(document).ready(createMap);