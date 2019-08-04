'use strict'
// Rendering JsRender templates using Hapi https://hapi.dev/tutorials/views/

// Use this file as start file, after installing Hapi: npm install --save @hapi/hapi

var Hapi = require('@hapi/hapi');
var Path = require('path');
var Fs = require('fs');

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

  // Set public directory as root for static files,
  // and also enable getting jsrender.js and jsviews.js as static files from node_modules folders
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: ['.', '../node_modules/jsrender', '../node_modules/jsviews'],
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

  ////////////////////////////////////////////////////////////////
  // Render layout-movies.html template as 'home' page using Hapi
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return h.view('layout-movies', appData);
    }
  });

  ////////////////////////////////////////////////////////////////
  // Render layout-hello.html template as 'hello/world' page using Hapi
  server.route({
    method: 'GET',
    path: '/hello/world',
    handler: function (request, h) {
      return h.view('layout-hello', { hello: "world" });
    }
  });

  ////////////////////////////////////////////////////////////////
  // Render layout-hello2.html template as 'hello/world2' page using Hapi
  server.route({
    method: 'GET',
    path: '/hello/world2',
    handler: function (request, h) {
      return h.view('layout-hello2', { hello: "world" });
    }
  });

  ////////////////////////////////////////////////////////////////
  // Load the current data for movies - stored in the file system
  var movieData = Fs.readFileSync('public/data/movies.json');
  var appData = {movies: JSON.parse(movieData)};

  // Provide the bgColor helper, used by the movie-list template for striped rows. (
  jsrender.views.helpers('bgColor', function() {
    return this.index%2 ? '#fdfdfe' : '#efeff2';
  }); // We could optionally have exposed the helper only to the the movie-list template - by passing
  // in the template - jsrender.templates('./templates/moviespage.html') - as third parameter.
  // (Note that JsRender server templates are automatically cached - so no additional call is made to the file-system)

  // Define custom tags used in layout-movies.html template
  jsrender.views.tags({
    clientData: function(varName) { // Custom tag to render server data in a script block, so it can be used in the client without making an HTTP request
      return '<script>var ' + varName + '=' + JSON.stringify(appData[varName]) + ';</script>';
    }
  });

  ////////////////////////////////////////////////////////////////
  // Save updated data from client, received from POST request
  server.route({
    method: 'POST',
    path: '/save/data',
    handler: function (request, h) {
      movieData = request.payload.movieData;
      appData.movies = JSON.parse(movieData);
      Fs.writeFileSync('./public/data/movies.json', movieData);
      return "Saved...";
    }
  });

  ////////////////////////////////////////////////////////////////
  // Start the server
  await server.start();

  console.log('Server running at:', server.info.uri);
};

start();