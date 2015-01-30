/** @module main application */

/* global DataTable: false */

var stateData;   // predefined data - name, id, abbreviation
var censusData;  // JSON formatted data for two states
var rawData;     // rawData retrieved from the census api
var tableData;   // Data formatted for a datatable
var stateNames = [];   // Map of state names that can be retrieved using id
var stateIDs = [];     // Map of state ids that can be retrieved using name
var categoryMap;       // Mapping of the census category keys to their values


/**
 *
 */
function runCompare() {


    var state1 = $("#tag1").val();
    var state2 = $("#tag2").val();
    var measure = $("#measure").val();

    var categories = [];

    categories[0] = stateIDs[state1];
    categories[1] = stateIDs[state2];

    censusData = convertToJSON(rawData,categories );
    $("#vis").empty();
    initializeBubbleChart(censusData, categories);
}

/**
 *
 * @param data
 */
function populateDataTable(data) {


    $('#tableArea').html( '<table  class="display" id="example"></table>' );

    $('#example').dataTable( {
        "data": data,
        "columns": [
            { "title": "Total" },
            { "title": "White" },
            { "title": "Black" },
            { "title": "American Indian/Alaskan", "class": "center" },
            { "title": "Asian", "class": "center" },
            { "title": "State", "class": "center" },
            { "title": "Name", "class": "center"}
        ],
        dom: 'T<"clear">lfrtip',
        tableTools: {
            "sSwfPath": "http://cdn.datatables.net/tabletools/2.2.3/swf/copy_csv_xls_pdf.swf"
        },
        responsive: true
    } );
    $('#example').dataTable().fnDraw();

}

/**
 *
 * @param data
 * @param selectedStates
 * @returns {Array|*}
 */

function convertToJSON(data, selectedStates) {


    var popData = {};
    var censusItems = [];

    popData.censusArray = censusItems;


    var categories = [];

    var titles = data[0];

    var categoryLength = titles.length;

    var stateIndex;
    var totalIndex;

    for (var index = 0; index < categoryLength; index++) {
        categories[index] = titles[index];

        if (titles[index] === "state") {
            stateIndex = index;
        }
        if (titles[index] === "P0030001") {
            totalIndex = index;
        }
    }

    var dataLength = data.length;


    for (var i = 1; i < dataLength; i++) {
        var dataItem = data[i];

        for (var j = 0; j < categoryLength; j++ ) {

            if ( j !== stateIndex) {
                var stateName = categories[stateIndex];

                if (dataItem[stateIndex] === selectedStates[0] || dataItem[stateIndex] === selectedStates[1] ) {
                    var categoryName = categoryMap[categories[j]];
                    var stateNameIndex = dataItem[stateIndex];

                    var total = parseInt(dataItem[totalIndex]);
                    var populationValue =  parseInt(dataItem[j]);

                    var item = {
                        "stateName": stateNames[stateNameIndex],
                        "population": populationValue,
                        "category": categoryName,
                        "stateID" : dataItem[stateIndex],
                        "id": i * 10 + j,
                        "percent" :  ((populationValue * 100) / total).toFixed(2)

                    };

                    popData.censusArray.push(item);
                }
            }
        }

    }

    return popData.censusArray;
}

/**
 *
 * @param data
 */
function addStateNames(data) {
    "use strict";

    var dataLength = data.length;
    tableData = [];

    for (var i = 0; i < dataLength; i++) {
        var item = data[i];
        var newItem = [];

        for (var j = 0; j < 6; j++) {
             newItem[j] = item[j];
        }
        var stateName = stateNames[item[5]];

        if (i === 0) {
            stateName = "Name";
        }
        newItem[6] = stateName;
        tableData[i] = newItem;
    }

}

/**
 *
 * @param data
 */
function processRaceData(data) {

    rawData = data;
    addStateNames(rawData);
    populateDataTable(tableData);
    var categories = ["42", "28"];
    censusData = convertToJSON(rawData, categories);
}

/**
 *
 * @param stateNames
 * @param stateIDs
 * @returns {string}
 */
function createStateComboTags(stateNames, stateIDs) {
    "use strict";

    var availableTags = "<option value=\"none\">Select one...</option>";
    stateNames.forEach( function(item) {

        availableTags += "<option value\"" +  stateIDs[item] + "\">" + item + "</option>";


    });

    return availableTags;

}

/**
 *
 */
function getStateNames() {
    "use strict";

    stateData.states.forEach( function(item) {

        stateNames[item.id] = item.name;
        stateIDs[item.name] = item.id;

    });
}

/**
 *
 * @returns {string}
 */
function getAvailableMeasures() {
    "use strict";

    var availableMeasures = "<option value=\"none\">Select one...</option>";

    availableMeasures += "<option value\"race\">race</option>";
    availableMeasures += "<option value\"age\">age</option>";

    return availableMeasures;
}

function initializeBubbleChart(bubbleChartData, categories) {

    root = typeof exports !== "undefined" && exports !== null ? exports : this;

    var chart, render_vis;
    chart = null;

    render_vis = function(csv, categories) {
        chart = new BubbleChart(csv, categories);
        chart.start();
        return root.display_all();
    };

    root.display_all = (function(_this) {
        return function() {
            return chart.display_group_all();
        };
    })(this);


    root.display_year = (function(_this) {
        return function() {
            return chart.display_by_year(categories);
        };
    })(this);


    root.toggle_view = (function(_this) {
        return function(view_type) {
            if (view_type === 'year') {
                return root.display_year();
            } else {
                return root.display_all();
            }
        };
    })(this);

    // chart event handler
    $('#view_selection a').click(function() {
        var view_type = $(this).attr('id');
        $('#view_selection a').removeClass('active');
        $(this).toggleClass('active');
        toggle_view(view_type);
        return false;
    });

    return render_vis(bubbleChartData, categories);

}

/**
 * Create the map
 * @param stateJSONData
 */
function initializeMap (stateJSONData) {

    var width = 700;
    var height = 300;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    makeTheMap(stateJSONData, svg, width, height);
}

function initializeComboBoxes(stateNames, stateIDs) {
    var availableTags = createStateComboTags(stateNames, stateIDs);

    $("#tag1").append( availableTags);
    $("#tag1").combobox();

    $("#tag2").append(availableTags);
    $("#tag2").combobox();

    // Initialize the measures data - data retrieved from the census API
    var availableMeasures = getAvailableMeasures();

    $("#measure").append(availableMeasures);
    $("#measure").combobox();

}

/**
 Main routine called at runtime
 */
function main() {

    "use strict";

    // Create tab UI area
    $( "#tabArea" ).tabs();

    // Initialize the map
    initializeMap(usjsonData);

    stateData = stateProperties;

    getStateNames();
    initializeComboBoxes(stateNames, stateIDs);

    // Event handler for the [Run Compare] button
    $("#compare").click( function() {
            runCompare();
        }
    );

    getRaceData(processRaceData);
    categoryMap = initializeCategoryMap();
}

/**
 * Start the application
 *
 */
$(document).ready(function () {
    "use strict";
    // Main function
    main();

});
