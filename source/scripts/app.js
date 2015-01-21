/** @module main application */

/* global DataTable: false */

var stateData;
var donationData;
var censusData;

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
    $("#tag1").val(statePath.id);
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

function processRaceData(data) {

    $('#demo').html( '<table  class="display" id="example"></table>' );

    $('#example').dataTable( {
        "data": data,
        "columns": [
            { "title": "Col1" },
            { "title": "Col2" },
            { "title": "Col3" },
            { "title": "Col4", "class": "center" },
            { "title": "Col5", "class": "center" },
            { "title": "State", "class": "center" }
        ],
        dom: 'T<"clear">lfrtip',
        tableTools: {
            "sSwfPath": "http://cdn.datatables.net/tabletools/2.2.3/swf/copy_csv_xls_pdf.swf"
        },
        responsive: true
    } );
    $('#example').dataTable().fnDraw();

    convertToJSON(data);

    //var numItems = data.length;
    //for (var i = 0; i < numItems; i++) {
    //   censusDataTable.row.add(data[i]).draw();
    //}
}

function convertToJSON(data) {
    var censusData = {};
    var censusItems = [];

    censusData.censusArray = censusItems;


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
                var categoryName = categories[j];

                var item = {
                    "stateName": dataItem[stateIndex],
                    "population": dataItem[j],
                    "category": categoryName

                };

                censusData.censusArray.push(item);
            }
        }

    }
    return censusData;
}

function getRaceData() {
    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0010001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af"

    $.getJSON( popRaceURL)
        .done(function( data ) {
              processRaceData(data);
              //bubbleChart(data);
        });
}

function getStateNames() {

    var availableTags = "<option value=\"none\">Select one...</option>";
    stateData.states.forEach( function(item) {

        availableTags += "<option value\"" +  item.id + "\">" + item.name + "</option>";

    });

    return availableTags;
}

function getAvailableMeasures() {
    var availableMasures = "<option value=\"none\">Select one...</option>";

    availableMasures += "<option value\"race\">race</option>";
    availableMasures += "<option value\"age\">age</option>";


    return availableMasures;
}

function initializeBubbleChart() {
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
                var categories = ["2008", "2010"];
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

        var categories = ["2008", "2010"];
        return render_vis(donationData, categories);

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

    getRaceData();

   //bubbleChart();

    var availableTags = getStateNames();

    $("#tag1").append( availableTags);
    $("#tag1").combobox();

    $("#tag2").append(availableTags);
    $("#tag2").combobox();


   var availableMeasures = getAvailableMeasures();

    $("#measure").append(availableMeasures);
    $("#measure").combobox();

    $("#compare").click( function()
        {
            var state1 = $("#tag1").val();
            var state2 = $("#tag2").val();
            var measure = $("#measure").val();
            alert (state1 + " / " + state2 + " --- " + measure);
        }
    );

    initializeBubbleChart();

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
