d3.json("json/japan.json", function(country) {

    var width = 500;
    var height = 500;
    var margin = 50;

    var x = d3.scale.linear()
        .domain([-50, 50])
        .range([margin, width - margin]);

    var y = d3.scale.linear()
        .domain([-50, 50])
        .range([height - margin, margin]);

    var r = d3.scale.linear()
        .domain([-1, 1])
        .range([5, 20]);

    var o = d3.scale.linear()
        .domain([-1, 1])
        .range([0.25, 0.75]);

    var svg = d3.select("div.main").append("svg")
        .attr("width", width)
        .attr("height", height);

    var nodes = svg.selectAll(".node")
        .data(country)
        .enter().append("circle")
        .attr("cx", function(d) {return x(-d.age);})
        .attr("cy", function(d) {return y(-d.frequency);})
        .attr("r", function(d) {return r(+d.volume);})
        .style("opacity", function(d) {return o(+d.engagement);})
        .attr("fill", function(d) {
            if (d.service == "feed") {
                if (d.engagement == 1) {
                    return "#ff6200";
                } else if (d.engagement == 0) {
                    return "#ff8133";
                } else if (d.engagement == -1) {
                    return "#ffa166";
                }
            } else if (d.service == "flickr") {
                if (d.engagement == 1) {
                    return "#ff0084";
                } else if (d.engagement == 0) {
                    return "#ff55ad";
                } else if (d.engagement == -1) {
                    return "#ff88c6";
                }
            } else if (d.service == "tumblr") {
                if (d.engagement == 1) {
                    return "#172533";
                } else if (d.engagement == 0) {
                    return "#2c4762";
                } else if (d.engagement == -1) {
                    return "#416991";
                }
            } else if (d.service == "twitter") {
                if (d.engagement == 1) {
                    return "#4099ff";
                } else if (d.engagement == 0) {
                    return "#73b4ff";
                } else if (d.engagement == -1) {
                    return "#a6cfff";
                }
            }
        });
    
    /* Defaults
       =====================
       size: 1×1
       gravity strength: 0.1
       charge strength: -30
       friction: 0.9
       link strength: 1
       distance: 20
       theta parameter: 0.8
    */

    nodes.forEach(function(o, i) {
        o.x = x(-o.age);
        o.y = y(-o.frequency);
    });

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0.1)
        .charge(-30)
        .friction(0.9)
        .on("tick", function() {
            nodes
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        })
        .start();

});
