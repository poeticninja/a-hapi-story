/**
* Dependencies.
*/
var Hapi = require('hapi');
var Joi = require('joi');
var Wreck = require('wreck');
var Cheerio = require('cheerio');
var Boom = require('boom');

// Create a new server
var server = new Hapi.Server();

// Setup the server with a host and port
server.connection({
    port: 3000,
    host: '0.0.0.0'
});

// Server Route
server.route([
    {
        method: 'GET',
        path: '/',
        config: {
            description: 'The home of our great API',
            notes: 'Nothing fancy here, just a basic api!',
            tags: ['API','Home'],
        },
        handler: function (request, reply) {
            reply({ siteTitle: 'Awesome API!' });
        }
    },
    {
        method: 'GET',
        path: '/list/{name?}',
        config: {
            description: 'Get top items on Reddit.',
            notes: 'You can get the top items on Reddit based on the name of the sub reddit you pass and the limit you set.',
            tags: ['API','List', 'Reddit'],
            validate: {
                params: {
                    name: Joi.string().max(30).default('node')
                },
                query: {
                    limit: Joi.number().min(1).max(25).default(10)
                }
            }
        },
        handler: function (request, reply) {

            var topList = [];
            var url = 'http://www.reddit.com/r/' + request.params.name;

            Wreck.get(url, function (err, response, payload) {
                if (err) {
                  throw err;
                }

                if (response.statusCode >= 400) {
                    var error = Boom.create(response.statusCode, response.message);
                    reply(error);
                };

                $ = Cheerio.load(payload);

                $('.entry a.title').slice(0,request.query.limit).text(function(index, content){
                    topList.push({
                        content: content,
                        index: index
                    });
                });

                reply(topList);

            });

        }
    }
]);

// Load all plugins and then start the server.
 server.register([
    {
        register: require("good"),
        options: {
            reporters: [{
                reporter: require('good-console'),
                args:[{ ops: '*', request: '*', log: '*', response: '*', 'error': '*' }]
            }]
        }
    },
    {
        register: require('lout')
    },
    {
        register: require('tv')
    }
], function (err) {
    if (err) {
        throw err;
    }

    // Start the server
    server.start(function() {
        // Log to the console the host and port info
        console.log('Server started at: ' + server.info.uri);

    });

});
