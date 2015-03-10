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

// Server Route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply({ siteTitle: 'Awesome API!' });
    }
});

// Start the server
server.start(function() {
    // Log to the console the host and port info
    console.log('Server started at: ' + server.info.uri);

});
