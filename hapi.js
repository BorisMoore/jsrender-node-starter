// Rendering JsRender templates using Hapi http://hapijs.com/api/#server-options

// Use this file as start file, instead of index.js, after installing Hapi: npm install --save hapi

// Load JsRender library
var jsrender = require('./lib/jsrender.js');

var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 3000 });

// Set JsRender as the template engine for Hapi
server.views({
  engines: { html: jsrender },
  path: __dirname + '/templates'
});

var context = { hello: "world" };

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    // Render hello-world.html template
    return reply.view('hello-world', context);
  }
});

// Alternative API:
// server.render('hello-world', context, function (err, rendered, config) {
//   reply(rendered);
// });

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
