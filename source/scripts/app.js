/** @module main application */

/* global DataTable: false */


/**
 *
 */
function runCompare() {
    "use strict";

    var state1 = $("#tag1").val();
    var state2 = $("#tag2").val();
    var measure = $("#measure").val();

    var categories = [];

    categories[0] = getIDFromName(state1, stateData);
    categories[1] = getIDFromName(state2, stateData);

    censusData = convertToJSON(rawData,categories, categoryMap, stateData );
    $("#vis").empty();
    initializeBubbleChart(censusData, categories);
}

/**
 *
 * @param data
 */
function populateDataTable(data) {
    "use strict";

    $('#tableArea').html( '<table  class="display" id="example"></table>' );
    var exampleSelector = $('#example');

    exampleSelector.dataTable( {
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
    exampleSelector.dataTable().fnDraw();

}


/**
 *
 * @param data
 */
function processRaceData(data) {
    "use strict";

    var tableData = addStateNames(data, stateData);
    populateDataTable(tableData);
    rawData = tableData;
}

/**
 *
 * @param stateNames
 * @param stateIDs
 * @returns {string}
 */
function createStateComboTags(dataParam) {
    "use strict";

    var availableTags = "<option value=\"none\">Select one...</option>";
    var length = dataParam.length;
    for (var i = 0; i < length; i++) {
        var item = dataParam[i];
        availableTags += "<option value\"" +  item["id"] + "\">" + item["name"] + "</option>";
    }
    return availableTags;
}

/**
 *
 * @returns {string}
 */
function createMeasuresComboTags() {
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
    "use strict";

    var width = 700;
    var height = 300;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    makeTheMap(stateJSONData, svg, width, height);
}

/**
 * https://github.com/ivkremer/jquery-simple-combobox
 * @param stateData
 */
function initializeComboBoxes(stateData) {
    "use strict";

    var availableTags = createStateComboTags(stateData);

    var tag1Selector = $('#tag1');
    var tag2Selector = $('#tag2');
    var meausreSelector = $('#measure');

    tag1Selector.append( availableTags);

    tag2Selector.append(availableTags);


    // Initialize the measures data - data retrieved from the census API
    var availableMeasures = createMeasuresComboTags();

    meausreSelector.append(availableMeasures);


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

    stateData = stateProperties.states;

    initializeComboBoxes(stateData);

    // Event handler for the [Run Compare] button
    $("#compare").click( function() {
            runCompare();
        }
    );

    getRaceData(processRaceData);

    categoryMap = initializeRaceCategoryMap();
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
