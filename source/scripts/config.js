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
