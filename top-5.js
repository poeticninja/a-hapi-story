// Tiny, fast, and elegant implementation of core jQuery designed specifically for the server
var Cheerio = require('cheerio');

// HTTP Client Utilities (Internally Hapi uses Wreck.)
var Wreck = require('wreck');

var topList = [];
var url = 'http://www.reddit.com/r/node';


Wreck.get(url, function (err, response, payload) {
    if (err) {
      throw err;
    }

    $ = Cheerio.load(payload);

    $('.entry a.title').slice(0,5).text(function(index, content){
      topList.push(content);
    });

    console.log(topList);

});