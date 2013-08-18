/**
 * Synchronously load contents of file
 * Returns contents as string
 * NOTE:
 *   NOT FOR USE IN PRODUCTION
 *   Use asynchronous loading in production.
 */
var loadFile = function(url) {
    var result = null;
    $.ajax({
           url: url,
           async: false
           }).done(function(data) {
                   result = data;
                   });
    return result;
};