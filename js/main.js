dataKey = ['Murders 2008','Murders 2009','Murders 2010','Murders 2011','Murders 2012','Murders 2013','Murders 2014']

year = ['2008','2009','2010','2011','2012','2013','2014']

x = 0
a = 0


mapboxgl.accessToken = 'pk.eyJ1Ijoic3dhbDk0IiwiYSI6ImNpZnk5aWdzcDR5dDl0ZWx5dDhwZW13ejAifQ.y18LYK4VbBo8evRHtqiEiw';
var tileset = 'mapbox.streets';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: {
        "version": 8,
        "sources": {
            "raster-tiles": {
                "type": "raster",
                "url": "mapbox://swal94.4103e88e",
                "tileSize": 256
            }
        },
        "layers": [{
            "id": "swal94.4103e88e",
            "type": "raster",
            "source": "raster-tiles",
            "minzoom": 11,
            "maxzoom": 12
        }]
    },
    center: [-87.5935,41.805], // starting position
    zoom: 11,
    interactive: false
});

map.on('load', function(){
    getData(map)
    getPoliceData(map)
    getHospitalData(map)

})

function getData(map) {
        $.ajax("../data/southSide.geojson", {
        dataType: "json",
        success: function(data){

            
            map.addSource("points", {
                "type": "geojson",
                "data": data
            });

            

            createPoints(data);
            slide(data)
            popup(map, data)
            
        }
    });
}


function popup(map, data){
    
    var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

var idKey = ['murders-default','murders-changed']

map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: [idKey[a]] });
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    var feature = features[0];

    var oneDataKey = dataKey[x]

    
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.Neighborhood + ": " + feature.properties[oneDataKey] + " murders")
        .addTo(map);
});
}

function slide(data, points) {

    $("#year").append($("<h2>" + year[x] + "</h2>"))

    document.getElementById('slider').addEventListener('input', function(e) {
            //var year = parseInt(e.target.value, 6);

            updatePoints(data, e.target.value)
            // addPopup(data, e.target.value, points)

            $("#year").remove()
            $(".map-overlay-inner").append($("<label id='year'></label>"))
            $("#year").append($("<h2>" + year[e.target.value] + "</h2>"))

            x = e.target.value
           
        });
};

function createPoints(data){
    
    map.addLayer({
                'id': 'murders-default',
                'type': 'circle',
                'source': 'points',
                'layout': {
                 'visibility': 'visible'
             },
             'paint': {
                    'circle-radius': {
                        property: dataKey[x],
                        stops: [
                            [0, 5],
                            [5, 10],
                            [10, 15],
                            [15, 20],
                            [20, 25],
                            [25, 30],
                            [30, 35],
                            [35, 40],
                            [40, 45]
                        ]
                    },

                    'circle-color': 'rgba(255,255,255,0.8)'
                },
                'source-layer': 'museum-cusco'
            })

}

function updatePoints(data, y){

    if (a == 0) {
        map.removeLayer('murders-default')
    } else if (a == 1) {
        map.removeLayer('murders-changed')
    }
    
    map.addLayer({
        'id': 'murders-changed',
        'type': 'circle',
        'source': 'points',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'circle-radius': {
                property: dataKey[y],
                stops: [
                    [0, 5],
                    [5, 10],
                    [10, 15],
                    [15, 20],
                    [20, 25],
                    [25, 30],
                    [30, 35],
                    [35, 40],
                    [40, 45]
                ]
            },

            'circle-color': 'rgba(255,255,255,0.8)'
        },
        'source-layer': 'museum-cusco'
    });

    a = 1

}


function getPoliceData(map){
    $.ajax("../data/PoliceStations.geojson", {
        dataType: "json",
        success: function(response){

            OverlayPoliceStations(map, response);
        }
    });
};


function OverlayPoliceStations(map, response){
    var z = 0

    map.addSource("points1", {
                "type": "geojson",
                "data": response
            });

    $('.policeButton').click(function(){
        
        if (z === 0){
            
            map.addLayer({
                'id': 'police',
                'type': 'circle',
                'source': 'points1',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                        'circle-radius': 3.5,

                    'circle-color': 'rgba(255,255,0,1)'
                },
                'source-layer': 'museum-cusco'
            });

            z = 1;

        } else if (z === 1){
            
            map.removeLayer('police');
            
            z = 0;
        }

    });
}


function getHospitalData(map){
    $.ajax("../data/Hospitals.geojson", {
        dataType: "json",
        success: function(response){

            OverlayHospitals(map, response);
        }
    });
};


function OverlayHospitals(map, response){
    var z = 0

    map.addSource("points2", {
                "type": "geojson",
                "data": response
            });


    $('.hospitalButton').click(function(){
        
        if (z === 0){
            
            map.addLayer({
                'id': 'hospital',
                'type': 'circle',
                'source': 'points2',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 7.5,

                    'circle-color': 'rgba(109,109,109,1)'
                },
                'source-layer': 'museum-cusco'
            });

            z = 1;

        } else if (z === 1){
            
            map.removeLayer('hospital');

            z = 0;
        }

    });
}
