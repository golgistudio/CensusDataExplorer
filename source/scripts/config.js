/** @module configurations */

// Constants
var CONFIG = (function() {
    "use strict";
    var privateData = {
        'ID_STORE': "golgistudio-quiz-id",
        'AVAILABLE_QUIZZES_TEMPLATE': '#quizTemplate'
    };

    return {
        get: function(name) { return privateData[name]; }
    };
})();


// Utilities
function runDust(source, templateName, renderer, data) {
    "use strict";

    var compiled = dust.compile(source, templateName);
    dust.loadSource(compiled);

    dust.render(templateName, data, function (err, out) {
        renderer(out);
    });
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
