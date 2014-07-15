var width = 600;
var height = 600;
var margin = 30;

d3.json("json/japan.json", function(json) {

    var node_values = json.sources;

    var x = d3.scale.linear()
        .domain([-50, 50])
        .range([margin, width - margin]);

    var y = d3.scale.linear()
        .domain([-50, 50])
        .range([height - margin, margin]);

    var r = d3.scale.linear()
        .domain([-1, 1])
        .range([4, 25]);

    var o = d3.scale.linear()
        .domain([-1, 1])
        .range([0.25, 0.75]);

    node_values.forEach(function(o, i) {
        o.x = x(-o.age);
        o.y = y(-o.frequency);
    });

    var fill = d3.scale.category10();

    var force = d3.layout.force()
        .nodes(node_values)
        .size([width, height])
        .gravity(0.1 * 6.0)
        .charge(function(d) {
            if (d.volume === 1) {
                return -30 * 16;
            }
            else if (d.volume === 0) {
                return -30 * 4;
            }
            else if (d.volume === -1) {
                return -30 * 1;
            }
        })
        .friction(0.90)
        .on("tick", tick)
        .start();

    /*
    var force = d3.layout.force()
        .nodes(node_values)
        .size([width, height])
        .gravity(-0.01)
        .charge(function(d) {
            return -Math.pow(d.radius,2.0)/8 
        })
        .friction(0.95)
        .on("tick", tick)
        .start();
    */

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var node_elements = svg.selectAll(".node")
        .data(node_values)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        // .attr("r", function(d) { return r(+d.volume); })
        .attr("r", function(d) {
            if (d.volume === -1) {
                return 5;
            }
            if (d.volume === 0) {
                return 5 * 2.2;
            }
            if (d.volume === 1) {
                return 5 * 2.2 * 2.2;
            }
        })
        .attr("opacity", function(d) { return o(+d.engagement); })
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
            }
        })
        .attr("stroke-width", function(d) {
            if (d.type === "crisis") {
                return 3;
            } else if (d.type === "common") {
                return 1;
            }
        })
        .attr("stroke", function(d) {
            if (d.service === "feed") {
                return "#ff6200";
            } else if (d.service === "flickr") {
                return "#ff0084";
            } else if (d.service === "tumblr") {
                return "#172533";
            } else if (d.service === "twitter") {
                return "#4099ff";
            }
        })
        .call(force.drag)
        .on("mousedown", function() { d3.event.stopPropagation(); });
    
    function tick(e) {
        
        beta_x = 0.24;
        beta_y = 0.12;
        node_values.forEach(function(o, i) {

            if (o.type === "crisis") {
                target_x = 100;
            } else if (o.type === "common") {
                target_x = 400;
            }

            if (o.engagement === 1) {
                o.x += e.alpha * beta_x * (target_x - o.x);
                o.y += e.alpha * beta_y * (50 - o.y);
            } else if (o.engagement === 0) {
                o.x += e.alpha * beta_x * (target_x - o.x);
                o.y += e.alpha * beta_y * (250 - o.y);
            } else if (o.engagement === -1) {
                o.x += e.alpha * beta_x * (target_x - o.x);
                o.y += e.alpha * beta_y * (450 - o.y);
            }

        });
        
        node_elements
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }
});
