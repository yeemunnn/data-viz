var svg = d3.select("#canvas"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  radiusFull = (Math.min(width, height) / 2) - 30,
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var minYr, maxYr, minLat, maxLat;

var updatePie;

var radius =  radiusFull;
var prevIndex = "*1990";
var currIndex = "*1990";
var arc;
var countriesData;
var currCountrySize;

var color = d3.scaleOrdinal(['#033830','#043d32','#044234','#064736','#074b37','#095039','#0b553a','#0f5a3b','#12603d','#16643e','#1a693f','#1f6f41','#247442','#297944','#2f7d46','#358248','#3b874a','#418b4d','#489151','#509654','#579a58','#5d9f5c','#65a461','#6ca966','#74ad6a','#7bb16f','#83b675','#8abb7a','#91c080','#9ac486','#a0c88c','#a9cd93','#b0d298','#b8d6a0','#bfdba6','#c8e0ad','#cfe4b4','#d7e9bb','#dfedc2','#e7f1c9','#eff6d1','#f7fad8','#ffffe0']);

var brazilOn = true;

var pie = d3.pie()
  .sort(null)
  .value(function(d,i) {
    if(brazilOn) {
      if(i < 43) {
        return d[currIndex];
      }
    } else {
      if(i < 43 && d.country_name != 'Brazil') {
        return d[currIndex];
      }
    }
  });

var path = d3.arc()
  .outerRadius(radius)
  .innerRadius(0);

var tooltip = d3.select(".tooltip");
var percent = d3.select(".percent");
var container = d3.select(".tooltip-container")
var year = d3.select(".year")

function dataSwap(value) {
  if (value == 'on') {
    brazilOn = true;
  } else {
    brazilOn = false;
  }
  var yearVal = currIndex.split('*')[1];
  recalculateRadius(yearVal);
  updatePie();
}

function updateYear(value) {
  year.html(value)
  prevIndex = currIndex;
  currIndex = '*' + value;
  value = +value;
  recalculateRadius(value);
  updatePie();
}

function recalculateRadius(value) {
  currCountrySize = countriesData['$LatAm'].years['$'+value];
  if (!brazilOn) {
    currCountrySize -= countriesData['$Brazil'].years['$'+value]
  }
  radius = radiusFull * (currCountrySize / maxLat);
}


d3.csv("data/Latin-America.csv", function(d) {
  for (var key in d) {
    if(key.charAt(0) == '*' || !isNaN(parseInt(d[key]))) {
      d[key] = +d[key];
    }
  }
  return d;
}, function(error, data) {
  if (error) throw error;

  countriesData = d3.nest()
    .key(function(d){
      return d.country_name;
    })
    .rollup(function(d){
      var dmap = d3.map(d[0]).entries();

      var years = d3.map();
      var meta = d3.map();

      for (var i = 0; i < dmap.length; i++) {
        if (!isNaN(parseInt(dmap[i].key))) {
          years.set(dmap[i].key, dmap[i].value);
        } else {
          meta.set(dmap[i].key, dmap[i].value);
        }
      }

      if (d[0].country_name == 'LatAm') {
        minLat = d3.min(years.values());
        maxLat = d3.max(years.values());
      }

      minYr = d3.min(years.keys());
      maxYr = d3.max(years.keys());

      return {
        'years': years,
        'meta': meta
      }
    })
    .map(data);

  recalculateRadius(1990);

  arc = g.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "arc")
    .on("mouseover", function(d,i) {
      if(i < 43) {
        var percentVal = (d.data[currIndex]*100).toFixed(2)+"%";
        if(!brazilOn) {
          var percentInDec = d.data[currIndex.split('*')[1]] / currCountrySize;
          percentVal = (percentInDec*100).toFixed(2)+"%";
        }
        d3.select(this).attr("opacity", .7)
        container.transition()
          .duration(200)
          .style("opacity", .7)
        tooltip.html(d.data["country_name"])
        percent.html(percentVal);
      }
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("opacity", 1)
      container.transition()
        .duration(400)
        .style("opacity", 0);
    })
    .attr("fill", function(d){
      return color(d.data.country_name);
    });


  updatePie = function () {
    var path = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);

    arc = g.selectAll(".arc")
      .data(pie(data));

    arc
      .attr("d", path)
      .attr("fill", function(d){
        return color(d.data.country_name);
      });
  };


});
