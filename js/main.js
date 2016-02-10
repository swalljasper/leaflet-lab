// var mydiv = document.getElementById("mydiv");
// mydiv.innerHTML = "Hello";

function initialize(){
	cities();
};

function cities(){
	var cities = [
	"Tokyo",
	"New York",
	"Sao Paulo",
	"Seoul"
	];

	var population = [
	33200000,
	17800000,
	17700000,
	17500000
	];

	var table = document.createElement("table");
	
	var headerRow = document.createElement("tr");
	
	var cityHeader = document.createElement("th");
	cityHeader.innerHTML = "City";
	headerRow.appendChild(cityHeader);

	var popHeader = document.createElement("th");
	popHeader.innerHTML = "Population";
	headerRow.appendChild(popHeader);

	table.appendChild(headerRow);

	for(var i = 0; i < cities.length; i++){
		var tr = document.createElement("tr");

		var city = document.createElement("td");
		city.innerHTML = cities[i];
		tr.appendChild(city);

		var pop = document.createElement("td");
		pop.innerHTML = population[i];
		tr.appendChild(pop);

		table.appendChild(tr);
	};

	var mydiv = document.getElementById("mydiv");
	mydiv.appendChild(table);


};

window.onload = initialize();