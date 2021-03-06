'use strict'
// Rendering JsRender templates using Express 4 and Browserify
// Use this file as start file, after installing Express

var Express = require('express');
var Fs = require('fs');

var app = Express();

app.set('port', (process.env.PORT || 5000));

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/logo-jsv.png'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set public directory as root for static files
app.use(Express.static(__dirname + '/public'));

// Load JsRender library
var jsrender = require('jsrender');

////////////////////////////////////////////////////////////////
// Set JsRender as the template engine for Express
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// We will store JsRender templates for Express in the templates folder
app.set('views', __dirname + '/templates');

////////////////////////////////////////////////////////////////
// Load the current data for movies - stored in the file system
var movieData = Fs.readFileSync('./public/data/movies.json');
var appData = {movies: JSON.parse(movieData)};

// Provide the bgColor helper, used by the movie-list template for striped rows. (
jsrender.views.helpers('bgColor', function() {
  return this.index%2 ? '#fdfdfe' : '#efeff2';
}); // We could optionally have exposed the helper only to the the movie-list template - by passing
// in the template - jsrender.templates('./templates/moviespage.html') - as third parameter.
// (Note that JsRender server templates are automatically cached - so no additional call is made to the file-system)

// Define custom tags used in layout-movies.html template
jsrender.views.tags({
  clientData: function(varName) { // Custom tag to render server data in a script block, so it can be used as in the client without making an HTTP request
    return '<script>var ' + varName + '=' + JSON.stringify(appData[varName]) + ';</script>';
  }
});

////////////////////////////////////////////////////////////////
// Render layout-movies-browserify.html template as 'home' page using Express
app.get('/', function(req, res) { // Express template
  res.render('layout-movies-browserify', appData, function(err, html) {
    res.send(html);
  });
});

////////////////////////////////////////////////////////////////
// Render layout-hello-browserify.html template as 'hello/world' page - without using Express
app.get('/hello/world', function(req, res) {
  // Load template from file system, and render against data
  var html = jsrender.renderFile('./templates/layout-hello-browserify.html', { hello: "world" });

  // Alternatively:
  // Use jsrender file path support to compile template from file, then render
  // var tmpl = jsrender.templates('./templates/layout-hello.html');
  // html = tmpl.render({ hello: "world" });
  res.send(html);
});

////////////////////////////////////////////////////////////////
// Render layout-hello-browserify2.html template as 'hello/world2' page - without using Express
app.get('/hello/world2', function(req, res) {
  // Load template from file system, and render against data
  var html = jsrender.renderFile('./templates/layout-hello-browserify2.html', { hello: "world" });

  // Alternatively:
  // Use jsrender file path support to compile template from file, then render
  // var tmpl = jsrender.templates('./templates/layout-hello.html');
  // html = tmpl.render({ hello: "world" });
  res.send(html);
});

////////////////////////////////////////////////////////////////
// Save updated data from client, received from POST request
app.post('/save/data', function(req, res) {
  movieData = req.body.movieData;
  appData.movies = JSON.parse(movieData);
  Fs.writeFileSync('./public/data/movies.json', movieData);
  res.send("Saved...");
});

////////////////////////////////////////////////////////////////
// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
