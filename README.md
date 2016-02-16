## JsRender Node Starter

A *Node.js* app using *[JsRender](https://github.com/BorisMoore/jsrender)* to render templated views on the server, with *[Express 4](http://expressjs.com/)*, *[Hapi](http://hapijs.com/tutorials/views)*, or directly in the HTTP response.

This sample shows some of the features of *JsRender* *Node* integration, and provides a starting point for your own *Node* projects using templated rendering.

It also shows how to store *JsRender* templates on the file system on the server and then use them for either server-side or client-side rendering, or both. Client-side rendering in the browser can be either with *[JsRender](http://www.jsviews.com/#jsrender)*, or with full dynamic data-binding scenarios using *[JsViews](http://www.jsviews.com/#jsviews)*.

Accessing server-defined templates in the browser can be facilitated by using *[Browserify](//browserify.org/)*, with the *JsRender* `tmplify` *Browserify transform*, or by using the `{{clientTemplate}}` tag when rendering the server page. 

This app has been deployed to *[Heroku](https://www.heroku.com/)* (using the *index-express.js* script as start script) [here](https://jsrender-node-starter.herokuapp.com/).

**Documentation and APIs:** see *[JsRender Node.js Quickstart](http://www.jsviews.com/#jsr-node-quickstart)* and *[JsRender for Node.js](http://www.jsviews.com/#jsrnode)*.

### Install

To install all the dependencies used in the different demos of this *JsRender Node Starter* project, including *JsRender* and *JsViews* run:

```bash
$ npm install
```

To install *JsRender* in your own new project, run:

```bash
$ npm install jsrender --save
```

(*Note:* Similarly, you can use `$ npm install jsviews --save` to install *JsViews* in your own new project -- in order to provide *jsviews.js* from your server, for loading in the browser.)

### Demo pages

The demo pages can be launched by running one of the different _index-*.js_ alternative start scripts, or equivalently by using one of the following commands (and then opening a browser on the corresponding port):

- **Simple Hapi application**: *JsRender template on the server*:

```bash
$ npm run-script helloworld        # or $ node index-helloworld.js
```

- **Express 4 application**: *JsRender templates on the server, and JsViews or JsRender in the browser*:

```bash
$ npm run-script express           # or $ node index-express.js
```

- **Hapi application**: *JsRender templates on the server, and JsViews or JsRender in the browser*:

```bash
$ npm run-script hapi              # or $ node index-hapi.js
```

- **Express 4 application with Browserify**: *JsRender templates on the server, JsViews/JsRender in the browser, and Browserify bundled script (including jsviews.js/jsrender.js and JsRender server templates) compiled for the browser*:

```bash
$ npm run-script bundle            # or $ node ./browserify/makebundle.js
$ npm run-script express-b         # or $ node index-express-browserify.js
```

- **Express 4 application with Browserify** ***(variant with jQuery also as browserify bundled script)***: *JsRender templates on the server, JsViews/JsRender in the browser, and Browserify bundled script (including jquery.js, jsviews.js/jsrender.js and JsRender server templates) compiled for the browser*:

```bash
$ npm run-script bundle            # or $ node ./browserify/makebundle.js
$ npm run-script express-b2        # or $ node index-express-browserify2.js
```

- **Hapi application with Browserify**: *JsRender templates on the server, JsViews/JsRender in the browser, and Browserify bundled script (including jsviews.js/jsrender.js and JsRender server templates) compiled for the browser*:
(index-helloworld.js)

```bash
$ npm run-script bundle            # or $ node ./browserify/makebundle.js
$ npm run-script hapi-b            # or $ node index-hapi-browserify.js 
```

### Using JsRender with Express

In Express you can use [JsRender APIs](http://www.jsviews.com/#node/install@apis) to render the template, then return the html in the HTTP response:

```js
// Load JsRender module
var jsrender = require('jsrender');

// Load template from file, compile template, and render against data
var html = jsrender.renderFile('./templates/myTemplate.html', myData);
```

```js
app.get('/...', function(req, res) {
  res.send(html);
});
```

But alternatively you can register JsRender as template engine for Express:

```js
// Load JsRender module
var jsrender = require('jsrender');

// Set JsRender as the template engine for Express - for .html files
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// Specify folder location for storing JsRender templates for Express
app.set('views', __dirname + '/templates');
```

Render template *./templates/myTemplate.html* -- content: `Name: {{:name}}<br/>`:

```js
app.get('/...', function(req, res) {
  res.render('myTemplate', {name: "Jim"}); 
  // result: Name: Jim<br/>
});
```

**Code samples:** See the *index-express.js* sample in this project. 

### [Hapi](http://hapijs.com/) template integration

JsRender also has built-in support as template engine for [Hapi](http://hapijs.com/):

Set JsRender as the template engine for Hapi:

```js
var jsrender = require('jsrender');

server.register(vision, function (err) {
  ...
  server.views({
    engines: { html: jsrender },
    relativeTo: __dirname,
    path: 'templates'
  });
```

Use Hapi to render a template:

```js
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply.view('myTemplate', myData);
  }
});
```

**Code samples:** See the *index-hapi.js* sample in this project. 

### Browserify integration

JsRender includes a Browserify transform: `jsrender/tmplify` for converting server-side templates (stored as files on the Node.js file system) to client-side templates included in the *bundle.js* client-script bundle generated by Browserify.

This allows you to `require()` file-based templates from the server, in your client-side scripts.

If *source.js* includes template references such as: `var tmpl=require('./some/path/myTemplate.html')`, then the Browserify client script bundle will include the referenced templates.

*Browser code:*

```js
var myTmpl = $.templates("./templates/myTemplate.html"); // Get compiled template
var html = myTmpl(data); // Render
```

For details see the documentation topic *[JsRender Browserify support in Node.js](http://www.jsviews.com/#node/browserify)*

**Code samples:** See the *index-express-browserify.js* and *index-hapi-browserify.js* samples in this project. 

*Note:* This sample app adds server rendering, and round-tripping of data, to an existing [browser-only sample](http://www.jsviews.com/#samples/editable/tags) on [jsviews.com](http://www.jsviews.com).

### Deploying this app to Heroku
This app has been deployed to https://jsrender-node-starter.herokuapp.com/

You can deploy your own copy as follows:

Make sure you have *[Node.js](http://nodejs.org/)* and the *[Heroku Toolbelt](https://toolbelt.heroku.com/)* installed.

```bash
$ git clone git@github.com:BorisMoore/jsrender-node-starter.git
# or clone your own fork
$ cd jsrender-node-starter
$ npm install
$ npm start
```

```bash
$ heroku create
$ git push heroku master
$ heroku open
```
