"use strict"

var $, jsrender, detailTmpl;

$ = require('jquery');
$ = require('jsrender')($);
detailTmpl = require("../templates/hello-detail.html")($);

// Alternatively, see clientcode-movies-browserify.js, for case where jQuery is loaded already as global.jQuery, using:
//  require('jsrender');
//  detailTmpl = require("../templates/hello-detail.html");

var data = {
  world: "Brave New",
  version: 1
};

$("#render").on("click", function() {
  var html = detailTmpl.render(data);
  $("#result").html(html);
  data.version ++;
  data.world += "+";
});
