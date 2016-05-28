"use strict"

var $, detailTmpl;

$ = require('jquery'); // Load jQuery as module, using Browserify
require('jsrender')($); // Load JsRender as jQuery plugin
detailTmpl = require("../templates/hello-detail.html")($);

// Alternatively, see clientcode-hello-browserify2.js, for case where jQuery is loaded already as global.jQuery, using:
//  var jsrender = require('jsrender'); // Load JsRender
//  detailTmpl = require("../templates/hello-detail.html")(jsrender);

var data = {
  world: "Brave New",
  version: 1
};

function incrementWorld() {
  var html = detailTmpl.render(data);
  $("#result").html(html);
  data.version ++;
  data.world += "+";
};

$("#incrementBtn").on("click", incrementWorld);

incrementWorld();
