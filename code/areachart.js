var selectedPartei;

var selectedCanton;
var plotCanton = [];


var keys =['FDP','CVP','SP','SVP','LPS','BDP','GLP','GPS','Übrige']
var plotFarben = ['#C39A63', '#786E4C', '#D3AEA6', '#867E74', '#303030', '#BDC9C9',"#2b535b", "#92a59a", '#E7E4D8'];
     
var changeAreasMainChart = function(d){
            if (selectedPartei != "Uebrige") {
                var index = keys.indexOf(selectedPartei);
                var farbe = plotFarben[index];
                keys.splice(index, 1);
                plotFarben.splice(index, 1);
                keys.unshift(selectedPartei);
                plotFarben.unshift(farbe);
                document.getElementById('plot').remove();
                var div = document.createElement('div');
                div.setAttribute('id', 'plot');
                document.querySelector('#plots').appendChild(div);
                console.log(plotCanton);
                areaplot(plotCanton);
            } else {
            }
}
   
//areaplot will appear
function areaplot(plotCanton) {
    
    d3.csv("Komplett_Version.csv" , function(data) {
    var pCanton;
    document.getElementById('plot').remove();
    var div = document.createElement('div');
    div.setAttribute('id', 'plot');
    document.querySelector('#plots').appendChild(div);
    
    for (var i in plotCanton){
        if (plotCanton[i] == "St-Gallen"){
            pCanton = "St. Gallen";
        } else if (plotCanton[i] == "Appenzell-Innerrhoden"){
            pCanton = "Appenzell I. Rh.";
        } else if (plotCanton[i] == "Appenzell-Ausserrhoden"){
            pCanton = "Appenzell A. Rh.";
        } else {
            pCanton = plotCanton[i];
        }
        plotDaten = data.filter(function(row){ return (row['Kantone'] == pCanton);})

        var margin = {top: 48, right: 72, bottom: 32, left: 40},
        dwidth = 450 - margin.left - margin.right,
        dheight = 320 - margin.top - margin.bottom;

        var plot = d3.select("#plot")
            .append("svg")
            .attr("width", dwidth + margin.left + margin.right)
            .attr("height", dheight + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var plotTooltip = d3.select("#plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        function plotMouseEnter() {
            d3.select("." + selectedPartei)
                .transition(0.5)
            .style("stroke-width", 2.2);

            plotTooltip.style("opacity", 1);
        }

        var plotMouseMove = function(d) {

            plotTooltip
                .html("" + selectedPartei)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        }

        function plotMouseLeave() {
            d3.select("." + selectedPartei)
                .transition(0.5)
                .style("stroke-width", 1);

            plotTooltip
                .style("opacity", 0);
        }

        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(plotFarben);

        var stackedData = d3.stack()
            .keys(keys)
            (plotDaten)

        var x = d3.scaleLinear()
            .domain(d3.extent(plotDaten, function(d) { return d.Wahljahr; }))
            .range([0, dwidth]);

        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([dheight, 0]);

        var clip = plot.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", dwidth)
            .attr("height", dheight)
            .attr("x", 0)
            .attr("y", 0);

        var areaChart = plot.append('g')
            .attr("clip-path", "url(#clip)")

        var area = d3.area()
            .x(function(d) { return x(d.data.Wahljahr); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { if(isNaN(y(d[1]))) {
                    return y(100);
                } else {
                    return y(d[1]);
                }})

        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function(d) { return "myArea " + d.key })
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)
            .on("mouseenter", function(d){
                selectedPartei = d.key;
                plotMouseEnter();
            })
            .on("mousemove", plotMouseMove)
            .on("mouseout", function(d){
                plotMouseLeave();
            })
            .on("click", changeAreasMainChart);

        var xAxis = plot.append("g")
            .attr("transform", "translate(0," + dheight + ")")
            .call(d3.axisBottom(x)
                  .ticks(6)
                  .tickValues([d3.min(plotDaten, function(d) { return d.Wahljahr; }), 1980, 1990, 2000, 2010, d3.max(plotDaten, function(d) { return d.Wahljahr; })])
                  .tickFormat(d3.format("i")));

        plot.append("text")
            .attr("text-anchor", "end")
            .attr("x", dwidth+28)
            .attr("y", dheight+5 )
            .text("Jahr")
            .attr("font-family", "Open Sans")
            .style("font-size", "8px") 

        plot.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -10 )
            .text("Wähleranteil in %")
            .attr("text-anchor", "start")
            .attr("font-family", "Open Sans")
            .style("font-size", "8px") 

        plot.append("g")
            .call(d3.axisLeft(y).ticks(10))

        var highlight = function(d){
            console.log(d)
            d3.selectAll(".myArea").style("opacity", .1)
            d3.selectAll("."+d).style("opacity", 1)
        }

        var noHighlight = function(d){
            d3.selectAll(".myArea").style("opacity", 1)
        }

        plot.selectAll("myrect")
            .data(keys)
            .enter()
            .append("circle")
            .attr("r", 6)
            .attr("cx", 360)
            .attr("cy", function(d,i){ return 206 - i * 22})
            .style("fill", function(d){ return color(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        plot.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 360 + 13)
            .attr("y", function(d,i){ return 210 - i *22})
            .text(function(d){ return d})
            .attr("font-family", "Open Sans")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)


        plot.append("text")
            .attr("x", (dwidth / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .attr("font-family", "Open Sans")
            .style("font-size", "12px") 
            .text("" + pCanton);


    // What to do when one group is hovered
    var highlight = function(d){
      console.log(d)
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".myArea").style("opacity", 1)
    } 
        
        }        
    })
}