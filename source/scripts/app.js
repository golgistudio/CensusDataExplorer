/** @module main application */


function makeTheMap(state, svg, path) {
    svg.selectAll(".state")
        .data(topojson.feature(state, state.objects.states).features)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)
        .on('mouseover', function(d) {
            var abbreviation = d.id;
            return document.getElementById('name').innerHTML=abbreviation;
        }).
        on('click', function ()   {
              alert("state is selected");
        });
}

function processRaceData(data) {
   var numItems = data.length;
   for (var i = 0; i < numItems; i++) {
       console.log(data[i]);
   }
}

function getRaceData() {
    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0010001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af"

    $.getJSON( popRaceURL)
        .done(function( data ) {
              processRaceData(data);
        });
}


/**
 Main routine called at runtime
 */
function main() {

    "use strict";

    var width = 900,
        height = 480;

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var state = usjsonData;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    makeTheMap(state, svg, path);

    getRaceData();

}

$(document).ready(function () {
    "use strict";
    // Main function
    main();

});
