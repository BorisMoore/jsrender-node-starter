var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/logo-jsv.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Load JsRender library
var jsrender = require('./lib/jsrender.js');

// Set JsRender as the template engine for Express
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// We will store JsRender templates for Express in the templates folder
app.set('views', path.join(__dirname, 'templates'));

// Load the current data for movies - stored in the file system
var movieData = fs.readFileSync('public/data/movies.json');
var appData = {movies: JSON.parse(movieData)};

// Provide the bgColor helper, used by the movie-list template for striped rows. (
jsrender.helpers('bgColor', function() {
  return this.index%2 ? '#fdfdfe' : '#efeff2';
}); // We could optionally have exposed the helper only to the the movie-list template - by passing
// in the template - jsrender.templates('@templates/moviespage.html') - as third parameter.
// (Note that JsRender server templates are automatically cached - so no additional call is made to the file-system)

// Define custom tags used in layout.html template
jsrender.tags({
  clientTemplate: function(path) { // Custom tag to render a template in a script block, so it can be used as a client template without making an HTTP request
    return '<script id="' + path + '" type="text/x-jsrender">' + jsrender.templates(path).markup + '</script>';
  },
  clientData: function(varName) { // Custom tag to render server data in a script block, so it can be used as in the client without making an HTTP request
    return '<script>var ' + varName + '=' + JSON.stringify(appData[varName]) + ';</script>';
  }
});

// Render layout.html template as 'home page' using Express
app.get('/', function(req, res) {
  res.render('layout', appData, function(err, html) {
    res.send(html);
  });
});

// Render hello-world.html template as 'hello/world' page - without using Express
app.get('/hello/world', function(req, res) {
  var html = jsrender.renderFile('templates/hello-world.html', { hello: "world" }); // Load template from file system, and render against data
  // Alternatively:
  // var tmpl = html = jsrender.templates('@templates/hello-world.html');
  // html = tmpl.render({ hello: "world" }); // Use jsrender file path support to compile template from file, then render
  res.send(html);
});

// Save updated data from client, received from POST request
app.post('/save/data', function(req, res) {
  movieData = req.body.movieData;
  appData.movies = JSON.parse(movieData);
  fs.writeFileSync('./public/data/movies.json', movieData);
  res.send("Saved...");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
