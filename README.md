## JsRender Node Starter

A Node.js app using [JsRender](https://github.com/BorisMoore/jsrender) to render templated views on the server, either with [Express 4](http://expressjs.com/), or directly in the HTTP response.

This sample shows some of the features of JsRender Node integration, and provides a starting point for your own Node projects using templated rendering.

This app has been deployed to Heroku, [here](https://jsrender-node-starter.herokuapp.com/)

_**Note**_: this is a preview - and uses an upcoming version of JsRender (commit 64) that is not yet deployed to [www.jsviews.com](http://www.jsviews.com)
or [github.com/BorisMoore/jsrender](https://github.com/BorisMoore/jsrender).

### Usage

```javascript
// Load JsRender module
var jsrender = require('./lib/jsrender.js'); // Not yet deployed on npm

// Set JsRender as the template engine for Express
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// User express to render a template:
res.render('myTemplate', myData);

// Render a template without using Express
var html = jsrender.renderFile('templates/myTemplate.html', myData);
res.send(html);
```

### Full JsRender API available on Node
The jsrender object on Node corresponds to `$.views` in JsRender in the browser. As well as providing the
Node-specific `renderFile()` method, shown above, it provides the full client API, available for use also on the server.

For example you can [compile/register/get a compiled template](http://www.jsviews.com/#d.templates):

```javascript
var myTmpl = jsrender.templates('Name {{:name}} ...');
var html = myTmpl.render({name: 'Jeff'});
``` 

Similarly, you can use the API for [defining custom tags, helpers, converters etc.](http://www.jsviews.com/#jsrregister).

### Declarative access to template on file system

JsRender client templates allow you to reference templates defined within script blocks, using jQuery selectors.
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

On the server JsRender provides an analagous feature for referencing templates stored on file. The syntax used
is: `@file.path.to.template.html`. This is valid both for programmatic reference and for referencing nested templates:

```javascript
var myTmpl = $.templates('@templates/myTemplate.html');
var html = myTmpl.render(myData);
```

and

```html
{{include tmpl="@templates/list.html"/}}
{{for languages tmpl="@templates/language.html" /}}
```

### Deploying this app to Heroku
This app has been deployed to https://jsrender-node-starter.herokuapp.com/

You can deploy your own copy as follows:

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
git clone git@git@github.com:BorisMoore/jsrender.git # or clone your own fork
cd node-js-sample
npm install
npm start
```

```sh
heroku create
git push heroku master
heroku open
```

### Using the same templates on the server and in the browser

An important scenario is to use JsRender on the server with Node for initial rendering of views, then to use identical
template(s) in the browser (with either JsViews or JsRender) to provide an interactive user experience such as for a dynamic
single-page app.

This can permit views to appear immediately to the user, even when refreshing the browser (no flicker), and yet provide client-side
data-binding, and responsive interactive UI. It can also facilitate SEO optimization.

This sample app illustrates that scenario, and does so by using custom tags to provide the server templates and the data
to the browser, without additional HTTP requests (and corresponding latency).

```html
{{clientData "movies" /}}
{{clientTemplate "@templates/movie-list.html" /}}
```

JsRender and JsViews in the browser accept the same `@file.path.template.html` syntax, and use it to reference the corresponding
template rendered by the server in a script block.

For example, in the sample, layout.html template contains the following:

```html
<tbody data-link="{include tmpl='@templates/movie-list.html'}">
	{{include tmpl="@templates/movie-list.html"/}}
</tbody>
```

Here, the `{{include ...}}` is used on the server to do initial rendering of the movies list using the `movie-list.html` template.
Then in the browser, the `data-link="{include ...}` causes JsViews to access the same template (rendered into the script-block),
to provide dynamic data-binding of the list...

To completely eliminate flicker on data-linked content which has already been rendered on the server, it is sometimes useful
to use the syntax `data-link="...^{...}"` - which data-links without doing the initial render. Here is an example from `movie-detail.html`:

```html
<div><input value="{{:title}}" data-link="^{:title trigger=true:}" /></div>
```

_Note:_  This sample app adds server rendering, and round-tripping of data, to an existing
[browser-only sample](http://www.jsviews.com/#samples/editable/tags) on [jsviews.com](http://www.jsviews.com).

## [Hapi](http://hapijs.com/) templates support

See the hapi.js file in this sample, which can be used as an alternative start file, instead of index.js

```javascript
// Set JsRender as the template engine for Express
app.engine('html', jsrender.__express);
app.set('view engine', 'html');

// Use Hapi to render a template:
return reply.view('hello-world', context);

// Alternative Hapi API:
server.render('hello-world', context, function (err, rendered, config) {
  reply(rendered);
});
```
