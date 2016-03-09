//load tileset into map

var policeLayer;
var HospitalsLayer

function createMap(){
	var map = L.map('map', {
		center: [41.8058,-87.5935],
		zoom: 12
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 19,
	minZoom: 12,
	id: 'swal94.4103e88e',
	accessToken: 'pk.eyJ1Ijoic3dhbDk0IiwiYSI6ImNpZnk5aWdzcDR5dDl0ZWx5dDhwZW13ejAifQ.y18LYK4VbBo8evRHtqiEiw'
}).addTo(map);

getData(map);
getMoreData(map);
getEvenMoreData(map);


}



//load data to map

function getData(map) {
		$.ajax("../data/southSide.geojson", {
		dataType: "json",
		success: function(data){

			var attributes = processData(data);

			createPropSymbols(data, map, attributes);
			createSequenceControls(map, attributes);
			createLegend(map, attributes);

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

	var popup = new Popup(feature.properties, attribute, layer, options.radius);

	popup.bindToLayer();

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

			var popup = new Popup(props, attribute, layer, radius);

			popup.bindToLayer();

		};
	});

	updateLegend(map, attribute);
}

function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split(" ")[1];
    this.murders = this.properties[attribute];
    this.content = "<p><b>Neighborhood:</b> " + this.properties.Neighborhood + "</p><p><b>Murders in " + this.year + ":</b> " + this.murders + "</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};

function createLegend(map, attributes){
	var LegendControl = L.Control.extend({
		options: {
			position: 'topright'
		},

		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'legend-control-container');
			$(container).append('<div id="temporal-legend">')

			var svg = '<svg id="attribute-legend" width="160px" height="60px">';

			var circles = {
				max: 20,
				mean: 40,
				min: 60
			};

			for (var circle in circles){

				svg += '<circle class="legend-circle" id="' + circle + '" fill="#fff" fill-opacity="0.8" stroke = "#fff" cx="30"/>';
				svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
			};

			svg += "</svg>";

			$(container).append(svg);

			return container;
		}
	});

	map.addControl(new LegendControl());

	updateLegend(map, attributes[0]);
};

function getCircleValues(map, attribute){
	var min = Infinity,
		max = -Infinity;

	map.eachLayer(function(layer){
		if (layer.feature){
			var attributeValue = Number(layer.feature.properties[attribute]);

			if (attributeValue < min){
				min = attributeValue;
			};

			if (attributeValue > max){
				max = attributeValue;
			};
		};
	});

	var mean = (max + min)/2;

	return{
		max: max,
		mean: mean,
		min: min,
	};
};

function updateLegend(map, attribute){
	var year = attribute.split(" ")[1];
	var content = "Murders in " + year;

	$('#temporal-legend').html(content);

	var circleValues = getCircleValues(map, attribute);

	for (var key in circleValues){

		var radius = calcPropRadius(circleValues[key]);

		$('#'+key).attr({
			cy: 59 - radius,
			r: radius
		});

		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
	};
};







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
    

    		var geojsonMarkerOptions = {
                radius: 5,
                fillColor: "#ffff00",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            policeLayer = L.geoJson(response, {
            	pointToLayer: function(feature, latlng){
            		return L.circleMarker(latlng, geojsonMarkerOptions);
            	}
            });
            
            policeLayer.addTo(map);

            

    
};

function takeOffMap(map, response){

    

    map.removeLayer(policeLayer);

    
};

function OverlayPoliceStations(map, response){
	var x = 0

	$('#overlay').append('<button class="push" align="center"> </button>');

	$('.push').click(function(){
		
		if (x === 0){
			putOnMap(map, response);
			x = 1;

		} else if (x === 1){
			
			takeOffMap(map, response);
			x = 0;
		}

	});
}







function getEvenMoreData(map){
    $.ajax("../data/Hospitals.geojson", {
        dataType: "json",
        success: function(response){

        	OverlayHospitals(map, response);
        }
    });
};

function putOnMap1(map, response){
    

    		var geojsonMarkerOptions = {
                radius: 7,
                fillColor: "#0099ff",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            HospitalsLayer = L.geoJson(response, {
            	pointToLayer: function(feature, latlng){
            		return L.circleMarker(latlng, geojsonMarkerOptions);
            	}
            });
            
            HospitalsLayer.addTo(map);

            

    
};

function takeOffMap1(map, response){

    

    map.removeLayer(HospitalsLayer);

    
};

function OverlayHospitals(map, response){
	var x = 0

	$('#overlay2').append('<button class="push2" align="center"> </button>');

	$('.push2').click(function(){
		
		if (x === 0){
			putOnMap1(map, response);
			x = 1;

		} else if (x === 1){
			
			takeOffMap1(map, response);
			x = 0;
		}

	});
}


$(document).ready(createMap);