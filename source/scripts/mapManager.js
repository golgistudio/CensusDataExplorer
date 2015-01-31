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

    var name = retrieveStateName(statePath);
    setStateName(name);
}

function setStateName(stateName) {
    "use strict";

    document.getElementById('name').innerHTML=stateName;
}

/**
 *
 * @param statePath
 */
function retrieveClickStateData (statePath) {
    "use strict";

    var name = retrieveStateName(statePath);

}

/**
 *
 * @param statePath
 * @returns {string}
 */
function retrieveStateName (statePath) {
    "use strict";

    var stateID = statePath.id;

    var stateName = "";

    var length = stateData.length;

    for (var i = 0; i < length; i++) {

        var item = stateData[i];
        if (stateID === parseInt(item.id)) {
            stateName = item.name;
        }
    }
    return  stateName;
}