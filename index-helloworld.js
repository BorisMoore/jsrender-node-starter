'use strict'
// Rendering JsRender templates using Hapi https://hapi.dev/tutorials/views/

// Use this file as start file, after installing Hapi: npm install --save @hapi/hapi

var Hapi = require('@hapi/hapi');
var Path = require('path');

var start = async () => {

  var server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  });

  await server.register(require('@hapi/inert'));
  await server.register(require('@hapi/vision'));

  // Set public directory as root for static files
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  });

  // Load JsRender library
  var jsrender = require('jsrender');

  ////////////////////////////////////////////////////////////////
  // Set JsRender as the template engine for Hapi
  server.views({
    engines: { html: jsrender },
    relativeTo: __dirname,
    path: 'templates'
  });

  var context = { hello: "world" };

  ////////////////////////////////////////////////////////////////
  // Render layout.html template as 'home page' using Hapi
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      // Render helloworld.html template
      return h.view('helloworld', context);
    }
  });

  await server.start();

  console.log('Server running at:', server.info.uri);
};

start();