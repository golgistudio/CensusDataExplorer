/** @module main application */

/* global DataTable: false */

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
        ]
    } );

    //var numItems = data.length;
    //for (var i = 0; i < numItems; i++) {
    //   censusDataTable.row.add(data[i]).draw();
    //}
}

function getRaceData() {
    var popRaceURL = "http://api.census.gov/data/2010/sf1?get=P0010001,P0030002,P0030003,P0030004,P0030005&for=state:*&key=dbce6c1ae7a28686113df0bd44f0a687c45892af"

    $.getJSON( popRaceURL)
        .done(function( data ) {
              processRaceData(data);
              //bubbleChart(data);
        });
}

function bubbleChart() {
    (function( $ ){
        var methods = {
            el: "",
            init: function(options){

                var clone = options["data"].slice(0);
                var that = this;

                console.log("clone", clone);

                w = options["width"];
                h = options["height"];

                methods.el = this;

                methods.setup(clone, w, h);
            },
            resizeChart: function(){
                var svg = $('.bubble');

                var aspect = svg.width() / svg.height();
                var targetWidth = svg.parent().parent().width();

                if(targetWidth!=null){
                    svg.attr("width", targetWidth);
                    svg.attr("height", Math.round(targetWidth / aspect));
                }
            },
            funnelData: function(data, width, height){
                function getRandom(min, max){
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                var max_amount = d3.max(data, function (d) { return parseInt(d.value)})
                var radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85])

                $.each(data, function(index, elem) {
                    elem.radius = radius_scale(elem.value)*.8;
                    elem.all = 'all';
                    elem.x = getRandom(0, width);
                    elem.y = getRandom(0, height);
                });

                return data;
            },
            getMargin: function(){
                var margin = {top: 30, right: 55, bottom: 50, left: 95};
                return margin;
            },
            setup: function(data, w, h){

                methods.width = w;
                methods.height = h;

                methods.fill = d3.scale.ordinal()
                    .range(["#d84b2a", "#beccae", "#7aa25c", "#008000"])

                var margin = methods.getMargin();

                var selector = methods.el["selector"];

                var svg = d3.select(selector)
                    .append("svg")
                    .attr("class", "bubblechart")
                    .attr("width", parseInt(methods.width + margin.left + margin.right,10))
                    .attr("height", parseInt(methods.height + margin.top + margin.bottom,10))
                    .attr('viewBox', "0 0 "+parseInt(methods.width + margin.left + margin.right,10)+" "+parseInt(methods.height + margin.top + margin.bottom,10))
                    .attr('perserveAspectRatio', "xMinYMid")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



                methods.force = d3.layout.force()
                    .charge(1000)
                    .gravity(100)
                    .size([methods.width, methods.height])


                var bubbleholder = svg.append("g")
                    .attr("class", "bubbleholder")


                var bubbles = bubbleholder.append("g")
                    .attr("class", "bubbles")

                var labelbubble = bubbleholder.append("g")
                    .attr("class", "labelbubble")


                methods.animateBubbles(selector, data);


            },
            update: function(data){
                var selector = methods.el["selector"];

                console.log("new data", data);

                methods.animateBubbles(selector, data);
            },
            animateBubbles: function(selector, data){
                data = this.funnelData(data, methods.width, methods.height);

                var padding = 4;
                var maxRadius = d3.max(data, function (d) { return parseInt(d.radius)});


                var year_centers = {
                    "2008": {name:"2008", x: 150, y: 300},
                    "2009": {name:"2009", x: 550, y: 300},
                    "2010": {name:"2010", x: 900, y: 300}
                }

                var all_center = { "all": {name:"All Grants", x: methods.width/2, y: methods.height/2}};


                var bubbleholder = d3.select(selector + " .bubbleholder");


                var bubbles = d3.select(selector + " .bubbles");

                var labelbubble = d3.select(selector + " .labelbubble");



                var nodes = bubbles.selectAll("circle")
                    .data(data);


                // Enter
                nodes.enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
                    .attr("r", 1)
                    .style("fill", function (d) { return methods.fill(d.label); })
                    .call(methods.force.drag);

                // Update
                nodes
                    .transition()
                    .delay(300)
                    .duration(1000)
                    .attr("r", function (d) { return d.radius; })

                // Exit
                nodes.exit()
                    .transition()
                    .duration(250)
                    .attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; })
                    .attr("r", 1)
                    .remove();

                var labels = labelbubble.selectAll("text")
                    .data(data);


                // Enter
                labels.enter()
                    .append("text")
                    .attr("class", "title")
                    .text(function(d) { return d.label; })
                    .attr("x", function (d) { return d.x; })
                    .attr("y", function (d) { return d.y; })

                // Update
                labels
                    .transition()
                    .delay(300)
                    .duration(1000)
                // .attr("x", function (d) { return d.x; })
                //.attr("y", function (d) { return d.y; })

                // Exit
                labels.exit()
                    .transition()
                    .duration(250)
                    .remove();


                draw('all');


                function draw (varname) {
                    var foci = varname === "all" ? all_center: year_centers;
                    methods.force.on("tick", tick(foci, varname, .55));
                    methods.force.start();
                }

                function tick (foci, varname, k) {
                    return function (e) {
                        data.forEach(function(o, i) {
                            var f = foci[o[varname]];
                            o.y += (f.y - o.y) * k * e.alpha;
                            o.x += (f.x - o.x) * k * e.alpha;
                        });
                        nodes
                            .each(collide(.1))
                            .attr("cx", function (d) { return d.x; })
                            .attr("cy", function (d) { return d.y; });

                        labels
                            .each(collide(.1))
                            .attr("x", function (d) { return d.x; })
                            .attr("y", function (d) { return d.y; });

                    }
                }




                function collide(alpha) {
                    var quadtree = d3.geom.quadtree(data);
                    return function(d) {
                        var r = d.radius + maxRadius + padding,
                            nx1 = d.x - r,
                            nx2 = d.x + r,
                            ny1 = d.y - r,
                            ny2 = d.y + r;
                        quadtree.visit(function(quad, x1, y1, x2, y2) {
                            if (quad.point && (quad.point !== d)) {
                                var x = d.x - quad.point.x,
                                    y = d.y - quad.point.y,
                                    l = Math.sqrt(x * x + y * y),
                                    r = d.radius + quad.point.radius + padding;
                                if (l < r) {
                                    l = (l - r) / l * alpha;
                                    d.x -= x *= l;
                                    d.y -= y *= l;
                                    quad.point.x += x;
                                    quad.point.y += y;
                                }
                            }
                            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                        });
                    };
                }

            },
            oldData: ""
        };

        $.fn.bubble = function(methodOrOptions) {
            if ( methods[methodOrOptions] ) {
                return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
                // Default to "init"
                return methods.init.apply( this, arguments );
            } else {
                $.error( 'Method ' +  methodOrOptions + ' does not exist' );
            }
        };

    })(jQuery);



    var dataCharts = [
        {
            "data": [
                {
                    "label" : "Apples",
                    "value": "25000"
                },
                {
                    "label" : "Pears",
                    "value": "227727"
                },
                {
                    "label" : "Oranges",
                    "value": "232"
                },
                {
                    "label" : "Melon",
                    "value": "3243"
                }
            ]
        },
        {
            "data": [
                {
                    "label" : "Trees",
                    "value": "554"
                },
                {
                    "label" : "Grass",
                    "value": "345"
                }
            ]
        },
        {
            "data": [
                {
                    "label" : "Burger",
                    "value": "454"
                },
                {
                    "label" : "Peanuts",
                    "value": "345"
                }
            ]
        },
        {
            "data": [
                {
                    "label" : "Pizza",
                    "value": "5000"
                },
                {
                    "label" : "Grapes",
                    "value": "27727"
                },
                {
                    "label" : "Lemons",
                    "value": "32"
                },
                {
                    "label" : "Kiwi",
                    "value": "243"
                }
            ]
        }
    ];

    var clone = jQuery.extend(true, {}, dataCharts);

    //__invoke bubble
    $('[data-role="bubble"]').each(function(index) {
        var selector = "bubble"+index;

        $(this).attr("id", selector);

        var options = {
            data: clone[0].data,
            width: $(this).data("width"),
            height: $(this).data("height")
        }

        $("#"+selector).bubble(options);
    });


    $(".testers a").on( "click", function(e) {
        e.preventDefault();

        var clone = jQuery.extend(true, {}, dataCharts);

        var min = 0;
        var max = 3;

        //__invoke bubble
        $('[data-role="bubble"]').each(function(index) {
            pos = Math.floor(Math.random() * (max - min + 1)) + min;
            $("#"+$(this).attr("id")).bubble('update', clone[pos].data);
        });

    });

}



//function bubbleChart(data) {
//
//    var width = 900,
//        height = 480;
//    var svg = d3.select("#bubble").append("svg")
//        .attr("width", width)
//        .attr("height", height);
//
//    var dataEnter = svg.selectAll("#bubble").data(data).enter();
//
//    d3.csv("./data/scatter-data.csv", function(data) {
//        /* Read CSV file: first row =>  state,murder,forcible_rape,robbery,aggravated_assault,burglary,larceny_theft,motor_vehicle_theft,population,pop100k,state_type  */
//        var maxvalx = 0, minvalx = 1000000,
//            maxvaly = 0, minvaly = 1000000,
//            sampsize = 0;
//        var label_array = new Array(),
//            val_array = new Array();
//
//        sampsize = data.length;
//
//        for (var i=0; i < sampsize; i++) {
//            label_array[i] = data[i].state;
//            val_array[i] = { label: label_array[i], x: parseFloat(data[i].murder), y: parseFloat(data[i].burglary), size: parseFloat(data[i].pop100k), color: data[i].state_type  };
//            maxvalx = Math.max(maxvalx, parseFloat(data[i].murder) );
//            maxvaly = Math.max(maxvaly, parseFloat(data[i].burglary) );
//            minvalx = Math.min(minvalx, parseFloat(data[i].murder) );
//            minvaly = Math.min(minvaly, parseFloat(data[i].burglary) );
//            //document.write('<p>Label: ' + label_array[i] + '</p>');
//        }
//
//        maxvalx = (1 + Math.floor(maxvalx / 10)) * 10;
//        maxvaly = (10 + Math.floor(maxvaly / 10)) * 10;
//        minvalx = (Math.floor(minvalx / 10)) * 10;
//        minvaly = (Math.floor(minvaly / 10)) * 10 - 100;
//        //document.write('<p>Max X: ' + minvalx + '</p>');
//        //document.write('<p>Max Y: ' + minvaly + '</p>');
//
//
//
//        var w = 815,
//            h = 500,
//            p = 80,
//            x = d3.scale.linear().domain([ 0, maxvalx]).range([0, w]),
//            y = d3.scale.linear().domain([ minvaly, maxvaly ]).range([h, 0]);
//
//        var vis = d3.select("#scatter-bubble-chart")
//            .data([val_array])
//            .append("svg:svg")
//            .attr("width", w + p * 2)
//            .attr("height", h + p * 2)
//            .append("svg:g")
//            .attr("transform", "translate(" + p + "," + p + ")");
//
//
//        var rules = vis.selectAll("g.rule")
//            .data(x.ticks(10))
//            .enter().append("svg:g")
//            .attr("class", "rule");
//
//        // Draw grid lines
//        rules.append("svg:line")
//            .attr("x1", x)
//            .attr("x2", x)
//            .attr("y1", 0)
//            .attr("y2", h - 1);
//
//        rules.append("svg:line")
//            .attr("class", function(d) { return d ? null : "axis"; })
//            .data(y.ticks(10))
//            .attr("y1", y)
//            .attr("y2", y)
//            .attr("x1", 0)
//            .attr("x2", w - 10);
//
//        // Place axis tick labels
//        rules.append("svg:text")
//            .attr("x", x)
//            .attr("y", h + 15)
//            .attr("dy", ".71em")
//            .attr("text-anchor", "middle")
//            .text(x.tickFormat(10))
//            .text(String);
//
//        rules.append("svg:text")
//            .data(y.ticks(12))
//            .attr("y", y)
//            .attr("x", -10)
//            .attr("dy", ".35em")
//            .attr("text-anchor", "end")
//            .text(y.tickFormat(5));
//
//
//        // Draw xy scatterplot
//        vis.selectAll("circle.line")
//            .data(val_array)
//            .enter().append("svg:circle")
//            .attr("class", "line")
//            .attr("fill", function(d) { return d.color; } )
//            .attr("cx", function(d) { return x(d.x); })
//            .attr("cy", function(d) { return y(d.y) - 5; })
//            .attr("r", function(d) { return Math.sqrt( 5*d.size / Math.PI); });
//
//        // add bubble labels: in two steps
//        vis.selectAll("g.rule")
//            .data(val_array)
//            .append("svg:text")
//            .attr("text-anchor", "middle")
//            .attr("x", function(d) { return x(d.x); })
//            .attr("y", function(d) { return y(d.y) + Math.sqrt( 5*d.size / Math.PI) + 4; })
//            .attr("dy", ".3em")
//            .attr("fill", "black")
//            .attr("clip", "inherit")
//            .text(function(d) { return d.label; });
//
//        vis.selectAll("g.rule")
//            .data(val_array)
//            .enter().append("svg:text")
//            .attr("text-anchor", "middle")
//            .attr("x", function(d) { return x(d.x); })
//            .attr("y", function(d) { return y(d.y) + Math.sqrt( 5*d.size / Math.PI) + 4; })
//            .attr("dy", ".3em")
//            .attr("fill", "black")
//            .attr("clip", "inherit")
//            .text(function(d) { return d.label; });
//
//
//    });
//}


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

     bubbleChart();


}

$(document).ready(function () {
    "use strict";
    // Main function
    main();

});
