
var data = ["one", "two", "three"];

function update() {
    var container = d3.select("div.containter")
        .selectAll("div")
        .data(data, function(d) { return d; })
        .enter()
        .append("div")
        .attr("class", "one-third column")
        .text(function(d) { return d; });
}
