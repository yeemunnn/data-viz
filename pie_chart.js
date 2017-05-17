var svg = d3.select("#canvas"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  radius = Math.min(width, height) / 2,
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var pie = d3.pie()
  .sort(null)
  .value(function(d,i) {
    if(i < 43) {
      return d["*1990"];
    }
  });

var path = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

var label = d3.arc()
  .outerRadius(radius - 40)
  .innerRadius(radius - 40);

d3.csv("data/Latin-America.csv", function(d) {
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
    .attr("class", "arc");

  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d,i) {
      var color = d3.scaleLinear()
        .domain([0, 1])
        .range([0,255])
      return d3.rgb(color(Math.random()),color(Math.random()),color(Math.random()));
    });

  // arc.append("text")
  //     .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
  //     .attr("dy", "0.35em")
  //     .text(function(d) { return d.data.age; });
});
