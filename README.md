## JsRender Node Starter

A *Node.js* app using [*JsRender*](https://github.com/BorisMoore/jsrender) to render templated views on the server, with [*Express 4*](http://expressjs.com/), [*Hapi*](http://hapijs.com/tutorials/views), or directly in the HTTP response.

This sample shows some of the features of *JsRender* *Node* integration, and provides a starting point for your own *Node* projects using templated rendering.

It also shows how to store *JsRender* templates on the file system on the server and then use them for either server-side or client-side rendering, or both. Client-side rendering in the browser can be either with [*JsRender*](http://www.jsviews.com/#jsrender), or with full dynamic data-binding scenarios using  [*JsViews*](http://www.jsviews.com/#jsviews).

Accessing server-defined templates in the browser can be facilitated by using [*Browserify*](http://browserify.org/), with the *JsRender* `tmplify` *Browserify transform*, or by using the `{{clientTemplate}}` tag when rendering the server page.   

This app has been deployed to [*Heroku*](https://www.heroku.com/), [here](https://jsrender-node-starter.herokuapp.com/)

This readme is an initial version of documentation of JsRender Node.js features - to be updated with more detail soon. In the meantime, you can explore the samples by using the scripts provided in package.json:


### Install

To install all the dependencies used in this *JsRender Node Starter* project, used in the different demos, run:

```bash	
$ npm install
```

To install just *JsRender* in your own new project, run:

```bash	
$ npm install jsrender --save
```

### Demo pages

The demo pages can be launched using one of the following commands (then opening a browser on the corresponding port):

- **Simple Hapi application**:  *JsRender template on the server*:

```bash	
$ npm run-script helloworld 
```
- **Express 4 application**: *JsRender templates on the server, and JsViews or JsRender in the browser*:

```bash	
$ npm run-script express 
```

- **Hapi application**: *JsRender templates on the server, and JsViews or JsRender in the browser*:

```bash	
$ npm run-script hapi 
```

- **Express 4 application with Browserify**: *JsRender templates on the server, JsViews or JsRender in the browser, and Browserify bundled script (including JsRender server templates) compiled for the browser*:

```bash	
$ npm run-script bundle 
$ npm run-script express-b 
```

- **Hapi application with Browserify**: *JsRender templates on the server, JsViews or JsRender in the browser, and Browserify bundled script (including JsRender server templates) compiled for the browser*:

```bash	
$ npm run-script bundle 
$ npm run-script express-b 
```

### Usage

```javascript
// Load JsRender module
var jsrender = require('jsrender'); // Returns the jsrender namespace object

// Set JsRender as the template engine for Express
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// Use Express to render a template:
res.render('myTemplate', myData);

// Render a template without using Express
var html = jsrender.renderFile('./templates/myTemplate.html', myData);
res.send(html);
```

### Full JsRender API available on Node

The `jsrender` namespace object returned by `require('jsrender')` on *Node* provides the same set of methods and APIs as are available in the browser. The  `jsrender.views`, `jsrender.templates` and `jsrender.render` APIs on *Node* correspond to `$.views`, `$.templates` and `$.render` when using *JsRender* with to the *jQuery*.

In fact all the [API examples](http://www.jsviews.com/#jsrapi) and [samples](http://www.jsviews.com/#samples/jsr) can also be used on Node.js by simply writing:

```js
var $ = require('jsrender');

// Now use $.views... $.templates... $.render...
```

For example you can [compile/register/get a compiled template](http://www.jsviews.com/#d.templates):

```javascript
var myTmpl = jsrender.templates('Name {{:name}} ...');
var html = myTmpl.render({name: 'Jeff'});
``` 

Similarly, you can use the API for [defining custom tags, helpers, converters etc.](http://www.jsviews.com/#jsrregister).

### Declarative access to template on file system

*JsRender* client templates allow you to reference templates defined within script blocks, using *jQuery* selectors.
This can be used both for loading the top-level template, or for composition using nested templates: 

```javascript
var myTmpl = $.templates('#myTemplate');
var html = myTmpl.render(myData);
```

and

```html
{{include tmpl="#movies"/}}
{{for languages tmpl="#language" /}}
```

On the server *JsRender* provides an analagous feature for referencing templates stored on the file system. The syntax used is: `./file/path/to/template.html`. This is valid both for programmatic reference and for referencing nested templates:

```javascript
var myTmpl = $.templates('./templates/myTemplate.html');
var html = myTmpl.render(myData);
```

and


```html
{{include tmpl="./templates/list.html"/}}
{{for languages tmpl="./templates/language.html" /}}
```

### Deploying this app to Heroku
This app has been deployed to https://jsrender-node-starter.herokuapp.com/

You can deploy your own copy as follows:

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

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

### Using the same templates on the server and in the browser

An important scenario is to use JsRender on the server with Node for initial rendering of views, then to use identical  template(s) in the browser (with either JsViews or JsRender) to provide an interactive user experience such as for a dynamic single-page app.

This can permit views to appear immediately to the user, even when refreshing the browser (no flicker), and yet provide client-side data-binding, and responsive interactive UI. It can also facilitate SEO optimization.

This sample app illustrates that scenario, and does so by using custom tags to provide the server templates and the data to the browser, without additional HTTP requests (and corresponding latency).

```html
{{clientData "movies" /}}
{{clientTemplate "./templates/movie-list.html" /}}
```

JsRender and JsViews in the browser accept the same `./file/path/template.html` syntax, and use it to reference the corresponding template rendered by the server in a script block.

For example, in the sample, *layout-movies.html* template contains the following:

```html
<tbody data-link="{include tmpl='./templates/movie-list.html'}">
	{{include tmpl="./templates/movie-list.html"/}}
</tbody>
```

Here, the `{{include ...}}` is used on the server to do initial rendering of the movies list using the `movie-list.html` template. Then in the browser, the `data-link="{include ...}` causes JsViews to access the same template (rendered into the script-block), to provide dynamic data-binding of the list...

To completely eliminate flicker on data-linked content which has already been rendered on the server, it is sometimes useful to use the syntax `data-link="...^{...}"` - which data-links without doing the initial render. Here is an example from `movie-detail.html`:

```html
<div><input value="{{:title}}" data-link="^{:title trigger=true:}" /></div>
```

*Note:*  This sample app adds server rendering, and round-tripping of data, to an existing [browser-only sample](http://www.jsviews.com/#samples/editable/tags) on [jsviews.com](http://www.jsviews.com).

## [Hapi](http://hapijs.com/) templates support

See the index-hapi.js file in this sample

```javascript
// Set JsRender as the template engine for Hapi
  server.views({
    engines: { html: jsrender },
    relativeTo: __dirname,
    path: 'templates'
  });

// Use Hapi to render a template:
return reply.view('hello-world', context);
```
