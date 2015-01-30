/**
 * Created by laurie on 1/29/2015.
 */


/**
 *
 * @param state
 * @param svg
 * @param width
 * @param height
 */
function makeTheMap(state, svg, width, height) {
    "use strict";

    var scale = 500;
    var precision = .1;

    var projection = d3.geo.albersUsa()
        .scale(scale)
        .translate([width / 2, height / 2])
        .precision(precision);

    var path = d3.geo.path()
        .projection(projection);

    svg.selectAll(".state")
        .data(topojson.feature(state, state.objects.states).features)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)
        .on('mouseover', function(d) {
            retrieveMouseStateData(d);
        })
        .on('click', function (d)   {
            retrieveClickStateData(d);
        });
}

/**
 *
 * @param statePath
 */
function retrieveMouseStateData (statePath) {
    "use strict";

    retrieveStateData(statePath);
}

/**
 *
 * @param statePath
 */
function retrieveClickStateData (statePath) {
    "use strict";

    $("#tag1").element.val(statePath.id);
}

/**
 *
 * @param statePath
 * @returns {string}
 */
function retrieveStateData (statePath) {

    var stateID = statePath.id;

    var abbreviation = "";

    stateData.states.forEach( function(item) {
        if (stateID === parseInt(item.id)) {
            abbreviation = item.name;
        }
    });
    return document.getElementById('name').innerHTML=abbreviation;
}