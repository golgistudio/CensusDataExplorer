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
    var precision = 0.1;

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
        .attr("id", function (data) {
             return "stateID" + data.id;
        })
        .text(function(data) {
           return retrieveAbbreviation(data.id, stateData);
        })
        .on('mouseover', function(data) {
            retrieveMouseStateData(data);
        })
        .on('click', function (data)   {
            retrieveClickStateData(data);
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

function retrieveAbbreviation(id, stateListData) {
    var abbreviation = getAbbreviationFromID(id, stateListData);

    var returnVal =  abbreviation;
    return returnVal;
}

var toggle = 0;

/**
 *
 * @param statePath
 */
function retrieveClickStateData (statePath) {
    "use strict";

    var name = retrieveStateName(statePath);

    var selector = $('#stateID' + statePath.id) ;

    if (toggle < 1) {
        $("#tag1").val(name);
        $(".mapState1").attr("class", "state");
        selector.attr("class", "state mapState1");
        toggle = 1;
    }  else {
        $("#tag2").val(name);
        toggle = 0;
        $(".mapState2").attr("class", "state");
        selector.attr("class", "mapState2");
    }

}

function updateMap(name, toggleID) {
    toggle = toggleID;

    var id = getIDFromName(name, stateData);
    var selector = $('#stateID' + parseInt(id)) ;

    if (toggle < 1) {
        $(".mapState1").attr("class", "state");
        selector.attr("class", "state mapState1");
        toggle = 1;
    }  else {
        $(".mapState2").attr("class", "state");
        selector.attr("class", "mapState2");
        toggle = 0;
    }

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