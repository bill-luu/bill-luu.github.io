function drawScatterPlot(scatterplot, height, fieldColor, who, countries, fertilityById) {
    let fieldXAxis = "Urban_population_growth";
    let fieldYAxis = "Urban_population_pct_of_total";

    // setup x
    var xValue = function(d) { return d[fieldXAxis];}, // data -> value
        xScale = d3.scaleLinear().range([0, height/2-100]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

    // setup y
    var yValue = function(d) { return d[fieldYAxis];}, // data -> value
        yScale = d3.scaleLinear().range([height/2-100, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([-2, 8]);
    yScale.domain([0, 100]);

    drawScatterXAxis(xAxis, xScale, fieldXAxis, height);
    drawScatterYAxis(yAxis, yScale, fieldYAxis);

    // draw dots
    scatterplot.selectAll(".dot")
    .data(who)
    .enter().append("circle")
    .attr("class", d => { return "dot COUNTRY-"+d.Country; } )
    .attr("r", 3.5)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", function(d) { return color(d[fieldColor]);})
    .on("mouseover", function(d) { onMouseOver(d, countries) })
    .on("mouseout", function(d) { onMouseOut(d, countries) })
    .on("click", function(d) { handleClick(d, countries, fertilityById) });

    drawLegend(scatterplot, fieldColor);
}

function drawScatterXAxis(xAxis, xScale, fieldXAxis, height) {
    // x-axis
    scatterplot.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height/2-100) + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", xScale(8))
    .attr("y", -6)
    .style("text-anchor", "end")
    .text(fieldXAxis.replace(/_/g, " "));   
}

function drawScatterYAxis(yAxis, yScale, fieldYAxis){
    // y-axis
    scatterplot.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", yScale(100))
    .attr("dy", "1.5em")
    .style("text-anchor", "end")
    .text(fieldYAxis.replace(/_/g, " "));
}

function drawLegend(scatterplot, fieldColor) {
    var legend = scatterplot.append("g").attr("class", "legend-group").selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(-100," + (i+1) * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width/2 + 4)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d,i)=> color(d-0.0001));

    // draw legend text
    legend.append("text")
        .attr("x", width/2 - 3)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return "< "+d;});

    scatterplot.select("g.legend-group")
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(-100,0)")
        .append("text")
        .attr("x", width/2+22)
        .attr("y", 0)
        .attr("dy", "1.5em")
        .style("text-anchor", "end")
        .text(fieldColor);
}

function drawWorldMap(svg, countries, fertilityById) {
    svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(countries.features)
    .enter().append('path')
    .attr("class", d => { return "COUNTRY-CODE-"+d.id;} )
    .attr('d', path)
    .style('fill', d => { return color(fertilityById[d.id]) })
    .style('stroke', 'white')
    .style('opacity', 0.8)
    .style('stroke-width', 0.3)
    // Add worldmap interactions
    .on('mouseover',function(d){ onMouseOver(d, countries) })
    .on('mouseout', function(d){ onMouseOut(d, countries) })
    .on('click', function(d) { handleClick(d, countries, fertilityById) })

    svg.append('path')
        .datum(topojson.mesh(countries.features, (a, b) => a.id !== b.id))
        .attr('class', 'names')
        .attr('d', path);
}

function updateStylesOfBothPlots(country, style, color) {
    d3.select(".COUNTRY-CODE-" + country.id).style(style, color)
    d3.select(".COUNTRY-" + country.properties.name).style(style, color)
}

function handleClick(d, countries, fertilityById) {
    const country = countries.features.find(el => el.id === d.id)
        if(country) {
            if(country.selected) {
                country.selected = false;
                updateStylesOfBothPlots(country, 'fill', d => { return color(fertilityById[d.id])})
            } else {
                console.log(d)
                updateStylesOfBothPlots(country, 'fill', 'yellow');
                country.selected = true;
            }
        }
}

function onMouseOver(d, countries) {
    const country = countries.features.find(el => el.id === d.id)
    if(country) {
        updateStylesOfBothPlots(country, 'stroke', 'green');
    }
}

function onMouseOut(d, countries) {
    const country = countries.features.find(el => el.id === d.id)
    if(country) {
        updateStylesOfBothPlots(country, 'stroke', 'white');
    }
}