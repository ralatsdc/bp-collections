
var width = 500;
var height = 500;
var margin = 50;

var x = d3.scale.linear();
var y = d3.scale.linear();
var r = d3.scale.linear();
var o = d3.scale.linear();

x
    .domain([-50, 50])
    .range([margin, width - margin]);
y
    .domain([-50, 50])
    .range([height - margin, margin]);
r
    .domain([-1, 1])
    .range([5, 20]);
o
    .domain([-1, 1])
    .range([0.25, 0.75]);
// .range([1.00, 1.00]);

var svg = d3.select("div.main").append("svg");

svg
    .attr("width", width)
    .attr("height", height);

d3.json("json/japan.json", function(json) {
      
    var node_values = json.sources;

    svg
        .selectAll("circle")
        .data(node_values)
        .enter()
        .append("circle")
        .style("opacity", function(d) {
            return o(+d.engagement);
        })
        .attr("cx", function(d) {
            return x(0);
        })
        .attr("cy", function(d) {
            return y(0);
        })
        .attr("r", function(d) {
            return r(0);
        })
        .attr("fill", function(d) {
            if (d.service === "feed") {
                if (d.engagement === 1) {
                    return "#ff6200";
                } else if (d.engagement === 0) {
                    return "#ff8133";
                } else if (d.engagement === -1) {
                    return "#ffa166";
                }
            } else if (d.service === "flickr") {
                if (d.engagement === 1) {
                    return "#ff0084";
                } else if (d.engagement === 0) {
                    return "#ff55ad";
                } else if (d.engagement === -1) {
                    return "#ff88c6";
                }
            } else if (d.service === "tumblr") {
                if (d.engagement === 1) {
                    return "#172533";
                } else if (d.engagement === 0) {
                    return "#2c4762";
                } else if (d.engagement === -1) {
                    return "#416991";
                }
            } else if (d.service === "twitter") {
                if (d.engagement === 1) {
                    return "#4099ff";
                } else if (d.engagement === 0) {
                    return "#73b4ff";
                } else if (d.engagement === -1) {
                    return "#a6cfff";
                }
            } else {
                // Should never get here.
            }
        });
    
    svg
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) {return x(-d.age);})
        .attr("cy", function(d) {return y(-d.frequency);})
        .attr("r", function(d) {return r(+d.volume);});
    
});
