// Dependencies
var request = require('request');

var LyricsFetcher = {
    fetch: function (artist, song, callback) {
        "use strict";

        var service = "https://makeitpersonal.co/lyrics?";

        request(service + 'artist=' + artist + '&title=' + song, function (err, res, body) {
            callback(null, body);
        });
    }
};

module.exports = LyricsFetcher;
