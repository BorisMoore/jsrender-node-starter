"use strict"

var detailTmpl = $.templates("./templates/hello-detail.html");
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
