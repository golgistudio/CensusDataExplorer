/** @module API */

/**
 *
 * @returns {Array}
 */
function initializeRaceCategoryMap() {
    "use strict";

    var categories = [];
    categories.P0030001 = "Total";
    categories.P0030002 = "White";
    categories.P0030003 = "Black";
    categories.P0030004 = "American Indian/Alaskan";
    categories.P0030005 = "Asian";
    categories.other = "Other";

    return categories;
}

/**
 *
 * @param data
 * @returns {{stateIndex: *, totalIndex: *, nameIndex: *}}
 */
function getIndices(data) {

    var stateIndex;
    var totalIndex;
    var nameIndex;

    var titles = data[0];

    var categoryLength = titles.length;

    for (var index = 0; index < categoryLength; index++) {

        if (titles[index] === "state") {
            stateIndex = index;
        }
        if (titles[index] === "P0030001") {
            totalIndex = index;
        }
        if (titles[index] === "name") {
            nameIndex = index;
        }
    }
    return {
        "stateIndex": stateIndex,
        "totalIndex": totalIndex,
        "nameIndex": nameIndex
    }
}

/**
 *
 * @param raceDataCallback
 */
function getRaceData(raceDataCallback) {
    "use strict";

    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0030001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af";

    $.getJSON( popRaceURL)
        .done(function(data) {
            "use strict";
            raceDataCallback(data);
        });


}