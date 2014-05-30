function update(data) {

    var container = d3.select("div.container");

    // Bind data
    var div = container.selectAll("h1")
        .data(data, function(d) { return d; });

    // Update
    div.attr("class", "update")
        .transition()
        .duration(750);
      
    // Enter
    div.enter().append("h1")
        .attr("class", "one-third column")
        .text(function(d) { return d; })
        .transition()
        .duration(750);

    // Exit
    div.exit().attr("class", "exit")
        .transition()
        .duration(750)
        .remove();
}

function run() {
    var dint = 0;
    var data = [
        ["one"],
        ["two", "three"],
        ["three"]
    ];
    update(data[dint % 3]);
    setInterval(function() {
        dint += 1
        update(data[dint % 3]);
    }, 1500);
}
