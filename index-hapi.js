// Rendering JsRender templates using Hapi http://hapijs.com/tutorials/views

var fs = require('fs');
var path = require('path');
var hapi = require('hapi');
var inert = require('inert');
var vision = require('vision');

var server = new hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ port: 3000 });

server.register(inert, function () {});

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

server.register(vision, function (err) {

  if (err) {
    throw err;
  }

////////////////////////////////////////////////////////////////
// Set JsRender as the template engine for Hapi
  server.views({
    engines: { html: jsrender },
    relativeTo: __dirname,
    path: 'templates'
  });

  var context = { hello: "world" };

////////////////////////////////////////////////////////////////
// Render layout-movies.html template as 'home' page using Hapi
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      return reply.view('layout-movies', appData);
    }
  });

////////////////////////////////////////////////////////////////
// Render layout-hello.html template as 'hello/world' page using Hapi
  server.route({
    method: 'GET',
    path: '/hello/world',
    handler: function (request, reply) {
      return reply.view('layout-hello', { hello: "world" });
    }
  });
});

////////////////////////////////////////////////////////////////
// Load the current data for movies - stored in the file system
var movieData = fs.readFileSync('public/data/movies.json');
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
  handler: function (request, reply) {
    movieData = request.payload.movieData;
    appData.movies = JSON.parse(movieData);
    fs.writeFileSync('./public/data/movies.json', movieData);
    reply("Saved...");
  }
});

////////////////////////////////////////////////////////////////
// Start the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
