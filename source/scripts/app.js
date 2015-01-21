/** @module main application */

/* global DataTable: false */

var stateData;
var donationData;
var censusData;
var rawData;
var tableData;
var stateNames = [];
var stateIDs = [];
var categoryMap;


function makeTheMap(state, svg, path) {
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

function retrieveMouseStateData (statePath) {
    console.log("mouseover - statePath id = " + statePath.id);

    retrieveStateData(statePath);
}

function retrieveClickStateData (statePath) {
    //alert("onclick - statePath id = " + statePath.id);
    $("#tag1").element.val(statePath.id);
   //retrieveStateData(statePath);
}
function retrieveStateData (statePath) {
    var stateID = statePath.id;
    console.log(stateID);

    var abbreviation = "";

   stateData.states.forEach( function(item) {
        if (stateID === parseInt(item.id)) {
            abbreviation = item.name;
            console.log(abbreviation + " id = " + item.id + ", stateID = " + stateID);
        }
    });
    return document.getElementById('name').innerHTML=abbreviation;
}

function runCompare() {
    var state1 = $("#tag1").val();
    var state2 = $("#tag2").val();
    var measure = $("#measure").val();

    var categories = [];

    categories[0] = stateIDs[state1];
    categories[1] = stateIDs[state2]

    convertToJSON(rawData,categories );
    $("#vis").empty();
    initializeBubbleChart(categories);
}

function processRaceData(data) {

    $('#demo').html( '<table  class="display" id="example"></table>' );

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



    //var numItems = data.length;
    //for (var i = 0; i < numItems; i++) {
    //   censusDataTable.row.add(data[i]).draw();
    //}
}

function convertToJSON(data, selectedStates) {
    var popData = {};
    var censusItems = [];

    popData.censusArray = censusItems;


    var categories = [];

    var titles = data[0];

    var categoryLength = titles.length;

    var stateIndex;

    for (var index = 0; index < categoryLength; index++) {
        categories[index] = titles[index];

        if (titles[index] === "state") {
            stateIndex = index;
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

                    var item = {
                        "stateName": stateNames[stateNameIndex],
                        "population": dataItem[j],
                        "category": categoryName,
                        "stateID" : dataItem[stateIndex],
                        "id": i * 10 + j

                    };

                    popData.censusArray.push(item);
                }
            }
        }

    }

    censusData =  popData.censusArray;
}

function addStateNames(data) {

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

function getRaceData() {
    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0030001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af"

    $.getJSON( popRaceURL)
        .done(function( data ) {

            rawData = data;
            addStateNames(data);
            processRaceData(tableData);
            var categories = ["42", "28"];
            convertToJSON(data, categories);


            initializeBubbleChart(categories);
        });

    categoryMap = [];


    categoryMap ["P0030001"] = "Total";
    categoryMap ["P0030002"] = "White";
    categoryMap ["P0030003"] = "Black";
    categoryMap ["P0030004"] = "American Indian/Alaskan";
    categoryMap ["P0030005"] = "Asian";
}

function getStateNames() {

    var availableTags = "<option value=\"none\">Select one...</option>";
    stateData.states.forEach( function(item) {

        availableTags += "<option value\"" +  item.id + "\">" + item.name + "</option>";

        stateNames[item.id] = item.name;
        stateIDs[item.name] = item.id;

    });

    return availableTags;
}

function getAvailableMeasures() {
    var availableMasures = "<option value=\"none\">Select one...</option>";

    availableMasures += "<option value\"race\">race</option>";
    availableMasures += "<option value\"age\">age</option>";


    return availableMasures;
}

function initializeBubbleChart(categories) {
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
        return render_vis(censusData, categories);

}

/**
 Main routine called at runtime
 */
function main() {

    "use strict";

    $( "#tabArea" ).tabs();

    var width = 700,
        height = 300;

    var projection = d3.geo.albersUsa()
        .scale(500)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var state = usjsonData;

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    makeTheMap(state, svg, path);

    stateData = stateProperties;
    donationData = donations.donationTargets;




   //bubbleChart();

    var availableTags = getStateNames();

    getRaceData();

    $("#tag1").append( availableTags);
    $("#tag1").combobox();

    $("#tag2").append(availableTags);
    $("#tag2").combobox();


   var availableMeasures = getAvailableMeasures();

    $("#measure").append(availableMeasures);
    $("#measure").combobox();

    $("#compare").click( function() {

            runCompare();

        }
    );

    $('#view_selection a').click(function() {
         var view_type = $(this).attr('id');
         $('#view_selection a').removeClass('active');
         $(this).toggleClass('active');
         toggle_view(view_type);
         return false;
    });


}

$(document).ready(function () {
    "use strict";
    // Main function
    main();

});
