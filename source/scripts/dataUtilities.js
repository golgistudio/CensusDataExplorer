/** @module data */

var stateData;   // predefined data - name, id, abbreviation
var rawData;     // rawData retrieved from the census api with state names added
var categoryMap; // Mapping of the census category keys to their values
var indices;     // Indices for the name, total and state id


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

    var categories = data[0];

    popData.censusArray = [];

    var titles = data[0];

    var categoryLength = titles.length;

    var dataLength = data.length;

    for (var i = 1; i < dataLength; i++) {
        var dataItem = data[i];

        for (var j = 0; j < categoryLength; j++ ) {

            if ( j !== indices.stateIndex && j !== indices.nameIndex) {

                if (dataItem[indices.stateIndex] === selectedStates[0] || dataItem[indices.stateIndex] === selectedStates[1] ) {
                    var categoryName = categoryMap[categories[j]];
                    var stateNameIndex = dataItem[indices.stateIndex];

                    var total = parseInt(dataItem[indices.totalIndex]);
                    var populationValue =  parseInt(dataItem[j]);

                    var stateNameValue = getNameFromID(stateNameIndex, stateData);
                    var item = {
                        "stateName": stateNameValue,
                        "population": populationValue,
                        "category": categoryName,
                        "stateID" : dataItem[indices.stateIndex],
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
        var otherPop =  calculateOther(item);

        if (i === 0) {
            stateName = "name";
            otherPop = "other";
        }
        newItem[6] = stateName;
        newItem[7] = otherPop;
        tableData[i] = newItem;
    }
    return tableData;
}

/**
 *
 * @param item
 * @returns {number}
 */
function calculateOther(item) {
    var amount = parseInt( item[1]) + parseInt( item[2]) + parseInt(item[3]) + parseInt(item[4]);

    var returnVal = item[0] - parseInt(amount);

    if (returnVal < 0) {
        returnVal = 0;
    }

    return returnVal;
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
        if (item.id === id) {
            return item.name;
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
        if (item.name === name) {
            return item.id;
        }
    }

}

/**
 *
 * @param name
 * @param stateNameData
 * @returns {*}
 */
function getAbbreviationFromID(id, stateListData) {
    "use strict";

    var length = stateListData.length;

    for (var i = 0; i < length; i++) {
        var item = stateListData[i];
        var idAsInt = parseInt(item.id);
        if (idAsInt === id) {
            return item.abbreviation;
        }
    }

}

