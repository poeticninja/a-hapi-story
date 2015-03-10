/**
* Dependencies.
*/
var Hapi = require('hapi');

// Create a new server
var server = new Hapi.Server();

// Setup the server with a host and port
server.connection({
    port: 3000,
    host: '0.0.0.0'
});

// Server Routes
server.route([
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({ siteTitle: 'Awesome API!' });
        }
    },
    {
        method: 'GET',
        path: '/list/{name}',
        handler: function (request, reply) {
            reply(request.params.name + ' - ' + request.query.limit);
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
