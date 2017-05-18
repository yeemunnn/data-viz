var svg = d3.select("#canvas"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  radius = Math.min(width, height) / 2,
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var pie = d3.pie()
  .sort(null)
  .value(function(d,i) {
    if(i < 43) {
      return d["*2015"];
    }
  });

var path = d3.arc()
  .outerRadius(radius - 30)
  .innerRadius(0);

var label = d3.arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);

var tooltip = d3.select(".tooltip");
var percent = d3.select(".percent");
var container = d3.select(".tooltip-container")

// var color = d3.scaleOrdinal(['#006400','#046703','#096c07','#0f6f0c','#147411','#197716','#1e7c1a','#237f1e','#288423','#2d8727','#318b2b','#369030','#3b9334','#409838','#459c3d','#49a041','#4ea346','#53a74b','#58ac4f','#5eaf54','#63b459','#68b75e','#6dbb63','#72bf67','#78c36c','#7dc671','#83ca76','#8ace7c','#90d382','#95d687','#9cda8c','#a3de92','#a9e198','#b0e59e','#b8e8a5','#bfebab','#c6efb1','#cff2b8','#d7f5c0','#e0f8c7','#e8fbce','#f4fdd7','#ffffe0']);
var color = d3.scaleOrdinal(['#033830','#043d32','#044234','#064736','#074b37','#095039','#0b553a','#0f5a3b','#12603d','#16643e','#1a693f','#1f6f41','#247442','#297944','#2f7d46','#358248','#3b874a','#418b4d','#489151','#509654','#579a58','#5d9f5c','#65a461','#6ca966','#74ad6a','#7bb16f','#83b675','#8abb7a','#91c080','#9ac486','#a0c88c','#a9cd93','#b0d298','#b8d6a0','#bfdba6','#c8e0ad','#cfe4b4','#d7e9bb','#dfedc2','#e7f1c9','#eff6d1','#f7fad8','#ffffe0']);


d3.csv("data/Latin-America-without-Brazil.csv", function(d) {
  for (var key in d) {
    if(key.charAt(0) == '*') {
      d[key] = +d[key];
    }
  }
  return d;
}, function(error, data) {
  if (error) throw error;

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")
    .on("mouseover", function(d) {
        d3.select(this).attr("opacity", .7)
        container.transition()
            .duration(200)
            .style("opacity", .7)
        tooltip.html(d.data["Country Name"])
        percent.html((d.data['*1990']*100).toFixed(2)+"%")
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("opacity", 1)
            container.transition()
                .duration(400)
                .style("opacity", 0);
        });


  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data["Country Name"]); });


  // arc.append("text")
  //     .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
  //     .attr("dy", "0.35em")
  //     .text(function(d) { return d.data.age; });
});
