var fs = require('fs');
var browserify = require('browserify');

// JsRender Browserify transform:
var tmplify = require("jsrender/tmplify");
// Used to allow client-side access to JsRender templates stored on server file system.
// Server-side require(./some/path.html) adds template to bundle (as well as any nested
// referenced templates) and allows client-side access as: $.templates("./some/path.html");

browserify('browserify/clientcode-hello-browserify.js')
  .transform(tmplify)
  .bundle()
  .pipe(fs.createWriteStream('public/js/clientbundle-hello.js'));

browserify('browserify/clientcode-hello-browserify2.js')
  .transform(tmplify)
  .bundle()
  .pipe(fs.createWriteStream('public/js/clientbundle-hello2.js'));

browserify('browserify/clientcode-movies-browserify.js')
  .transform(tmplify)
  .bundle()
  .pipe(fs.createWriteStream('public/js/clientbundle-movies.js'));

browserify('browserify/clientcode-movies-browserify2.js')
  .transform(tmplify)
  .bundle()
  .pipe(fs.createWriteStream('public/js/clientbundle-movies2.js'));

