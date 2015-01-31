/**
 * Created by laurie on 1/30/2015.
 */

var stateData;   // predefined data - name, id, abbreviation
var censusData;  // JSON formatted data for two states
var rawData;     // rawData retrieved from the census api
var categoryMap;       // Mapping of the census category keys to their values


/**
 *
 * @param data
 * @param selectedStates
 * @param categoryMap
 * @param stateData
 * @returns {Array|*}
 */
function convertToJSON(data, selectedStates, categoryMap, stateData) {
    "use strict";

    var stateIndex;
    var totalIndex;
    var nameIndex;
    var popData = {};
    var categories = [];

    popData.censusArray = [];

    var titles = data[0];

    var categoryLength = titles.length;

    for (var index = 0; index < categoryLength; index++) {
        categories[index] = titles[index];

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

    var dataLength = data.length;

    for (var i = 1; i < dataLength; i++) {
        var dataItem = data[i];

        for (var j = 0; j < categoryLength; j++ ) {

            if ( j !== stateIndex && j !== nameIndex) {

                if (dataItem[stateIndex] === selectedStates[0] || dataItem[stateIndex] === selectedStates[1] ) {
                    var categoryName = categoryMap[categories[j]];
                    var stateNameIndex = dataItem[stateIndex];

                    var total = parseInt(dataItem[totalIndex]);
                    var populationValue =  parseInt(dataItem[j]);

                    var stateNameValue = getNameFromID(stateNameIndex, stateData);
                    var item = {
                        "stateName": stateNameValue,
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
 * @param stateNameData
 * @returns {Array}
 */
function addStateNames(data, stateNameData) {
    "use strict";

    var dataLength = data.length;
    var tableData = [];

    for (var i = 0; i < dataLength; i++) {
        var item = data[i];
        var newItem = [];

        for (var j = 0; j < 6; j++) {
            newItem[j] = item[j];
        }
        var stateName = getNameFromID(item[5], stateNameData);

        if (i === 0) {
            stateName = "name";
        }
        newItem[6] = stateName;
        tableData[i] = newItem;
    }
    return tableData;
}

/**
 *
 * @param id
 * @param stateNameData
 * @returns {*}
 */
function getNameFromID(id, stateNameData) {
    "use strict";

    var length = stateNameData.length;

    for (var i = 0; i < length; i++) {
        var item = stateNameData[i];
        if (item["id"] === id) {
            return item["name"];
        }
    }

}

/**
 *
 * @param name
 * @param stateNameData
 * @returns {*}
 */
function getIDFromName(name, stateNameData) {
    "use strict";

    var length = stateNameData.length;

    for (var i = 0; i < length; i++) {
        var item = stateNameData[i];
        if (item["name"] === name) {
            return item["id"];
        }
    }

}

