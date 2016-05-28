"use strict"

var detailTmpl;

var jsrender = require('jsrender')(); // Load JsRender
detailTmpl = require("../templates/hello-detail.html")(jsrender);

// Alternatively, see clientcode-hello-browserify.js, for case where jQuery is loaded already as global.jQuery, using:
//  $ = require('jquery'); // Load jQuery as module, using Browserify
//  require('jsrender')($); // Load JsRender as jQuery plugin
//  detailTmpl = require("../templates/hello-detail.html")($);

var data = {
  world: "Brave New",
  version: 1
};

function incrementWorld() {
  var html = detailTmpl.render(data);
  document.getElementById("result").innerHTML = html;
  data.version ++;
  data.world += "+";
};

document.getElementById("incrementBtn").onclick = incrementWorld;

incrementWorld();
