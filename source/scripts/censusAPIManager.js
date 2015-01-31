/**
 * Created by laurie on 1/29/2015.
 */


function initializeRaceCategoryMap() {
    var categories = [];
    categories ["P0030001"] = "Total";
    categories ["P0030002"] = "White";
    categories ["P0030003"] = "Black";
    categories ["P0030004"] = "American Indian/Alaskan";
    categories ["P0030005"] = "Asian";

    return categories;
}

function getRaceData(raceDataCallback) {
    "use strict";

    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0030001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af";

    $.getJSON( popRaceURL)
        .done(function(data) {
            raceDataCallback(data);
        });


}