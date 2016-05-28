"use strict"

var detailTmpl = jsrender.templates("./templates/hello-detail.html");
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
