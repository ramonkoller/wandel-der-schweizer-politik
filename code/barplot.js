var barAusgewählt = 1983;
    
var barJahre = [1983, 1987, 1991, 1995, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

var plotCanton = [];

var PeriodenValue = {2021: 0, 2020: 1, 2019: 2, 2018: 3, 2017: 4, 2016: 5, 2015: 6, 2014: 7, 2013: 8, 2012: 9, 2011: 10, 2010: 11, 2009: 12, 2008: 13, 2007: 14, 2006: 15, 2005: 16, 2004: 17, 2003: 18, 2002: 19, 2001: 20, 2000: 21, 1999: 22, 1995: 23, 1991: 24, 1987: 25, 1983: 26};
        
var KantonValue = {"Aargau": 0, "Appenzell A. Rhoden": 1, "Bern": 2, "Basel-Landschaft": 3, "Basel-Stadt": 4, "Freiburg": 5, "Genf": 6, "Glarus": 7, "Jura": 8, "Luzern": 9, "Neuenburg": 10, "Nidwalden": 11, "St. Gallen": 12, "Schaffhausen": 13, "Schwyz": 14, "Solothurn": 15, "Thurgau": 16, "Tessin": 17, "Uri": 18, "Wallis": 19, "Waadt": 20, "Zug": 21, "Zürich": 22};

function barplot(plotCanton) {
    
    var bCanton;
    document.getElementById('bar').remove();
    var div = document.createElement('div');
    div.setAttribute('id', 'bar');
    document.querySelector('#bars').appendChild(div);
    
    var bmargin = {top: 100, right: 350, bottom: 50, left: 50},
        bwidth = 900 - bmargin.left - bmargin.right,
        bheight = 300 - bmargin.top - bmargin.bottom;
    
    var bslider = d3.sliderHorizontal()
        .min(d3.min(barJahre))
        .max(d3.max(barJahre))
        .width(bwidth)
        .tickValues([1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, barAusgewählt])
        .tickFormat(d3.format("i"))
        .marks(barJahre)
        .on("onchange", function(d){
            barAusgewählt = d;
            changeBar();
        });
    
    

    var bar = d3.select("#bar")
            .append("svg")
            .attr("width", bwidth + bmargin.left + bmargin.right)
            .attr("height", bheight + bmargin.top + bmargin.bottom)
            .append("g")
            .attr("transform", "translate(" + bmargin.left + "," + bmargin.top + ")");
    
    //y position calculation function
    var yy = d3.scaleLinear()
          .domain([-15, 15])
          .range([bheight, 0]);

    var xx0 = d3.scaleBand()  // domain defined below
          .domain(plotCanton)
          .rangeRound([0, bwidth])
          .paddingInner(0.1)
          .paddingOuter(0.1);

    var xx1 = d3.scaleBand()  // domain and range defined below
        .paddingOuter(0.25)
        .paddingInner(0.15);
    
    //define colors
    var zz = d3.scaleOrdinal()
            .range(['#C39A63', '#786E4C', '#D3AEA6', '#867E74', '#303030', '#BDC9C9',"#2b535b", "#92a59a"]);

    const yyAxis = d3.axisLeft(yy).ticks(8);

    var subCategories = ["FDP", "CVP", "SP", "SVP", "LPS", "BDP", "GLP", "GPS"];

    d3.csv("Komplett_Version.csv" , function(data) {
        for (var i in plotCanton){
            if (plotCanton[i] == "St-Gallen"){
                plotCanton[i] = "St. Gallen";
            } else if (plotCanton[i] == "Appenzell-Innerrhoden"){
                plotCanton[i] = "Appenzell I. Rh.";
            } else if (plotCanton[i] == "Appenzell-Ausserrhoden"){
                plotCanton[i] = "Appenzell A. Rh.";
            } else {
                continue;
            }
        }
        barDaten = data.filter(function(row){ return plotCanton.includes(row['Kantone'])});
                                             
        var barVergleich = [];
        
        for(bCanton of plotCanton){
            barIndex = [];
            var jahr = barAusgewählt;
            for (var j = 0; j <= 10; j++){
                for (var i in barDaten) {
                    if (barDaten[i]["Wahljahr"] == jahr && barDaten[i]["Kantone"] == bCanton){
                        if (barIndex.length > 1){
                            continue;
                        } else {
                            barIndex.push(i);
                        }
                    }
                }
                jahr -= 1;
            }
            barVergleich.push({"Kanton": bCanton, "Jahr": barAusgewählt,     "FDP": barDaten[barIndex[0]]["FDP"] - barDaten[barIndex[1]]["FDP"], "CVP": barDaten[barIndex[0]]["CVP"] - barDaten[barIndex[1]]["CVP"], "SP": barDaten[barIndex[0]]["SP"] - barDaten[barIndex[1]]["SP"], "SVP": barDaten[barIndex[0]]["SVP"] - barDaten[barIndex[1]]["SVP"], "LPS": barDaten[barIndex[0]]["LPS"] - barDaten[barIndex[1]]["LPS"], "BDP": barDaten[barIndex[0]]["BDP"] - barDaten[barIndex[1]]["BDP"], "GLP": barDaten[barIndex[0]]["GLP"] - barDaten[barIndex[1]]["GLP"], "GPS": barDaten[barIndex[0]]["GPS"] - barDaten[barIndex[1]]["GPS"], 
            });
        }    

        xx1.domain(subCategories).rangeRound([0, xx0.bandwidth()])

        var selection = bar.selectAll("g")
            .data(barVergleich)
            .enter().append("g")
              .attr("transform", d=> "translate(" + xx0(d.Kanton) + ",0)" )
        selection.selectAll("rect")
              .data(function(d) { return subCategories.map(function(key) { return {key: key, value: d[key]}; }); })
              .enter().append("rect")
              .attr("x", d => xx1(d.key))
              .attr("y", d => (d.value<0 ? yy(0) : yy(d.value)))
              .attr("width", xx1.bandwidth())
              .attr("height", d => Math.abs(yy(d.value) - yy(0)))
              .attr("fill", d => zz(d.key))
        
        selection.selectAll("text")
               .data(function(d) { return subCategories.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("text")
                .attr("x", d => xx1(d.key) + (xx1.bandwidth() / 2) - 7)
                .attr("y", d => d.value<0 ? yy(0) - (yy(4) - (Math.abs(yy(d.value) - yy(0)) + 65)) : yy(d.value) - 5)
                .style('fill', d => zz(d.key))
                .style('font-size', 8)
                .text(d => Number.parseFloat(d.value).toFixed(1))

        bar.append("g")
        .attr("transform", "translate(0, -70)")
        .call(bslider);
        
        bar.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + bheight + ")")
            .call(d3.axisBottom(xx0))
            .selectAll(".tick text")
            .call(wrap, xx0.bandwidth());
        
        bar.append('g')
            .call(yyAxis)
        
        bar.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -10 )
            .text("Wähleranteil im Vergleich zum Vorwahljahr in %")
            .attr("text-anchor", "start")
            .attr("font-family", "Open Sans")
            .style("font-size", "8px") 
        
        bar.append("line")
            .attr("y1", yy(0))
            .attr("y2", yy(0))
            .attr("x1", 0)
            .attr("x2", bwidth)
            .attr("stroke", "black");
        
        for (var j=0; j < 7; j++){
            bar.append("line")
                .attr("y1", yy(-15 + j * 5))
                .attr("y2", yy(-15 + j * 5))
                .attr("x1", 0)
                .attr("x2", bwidth)
                .attr("stroke", "black")
                .attr("stroke-opacity", 0.2);
        }
        
        var legend = bar.append("g")
          .attr("font-family", "Calibri")
          .attr("text-anchor", "start")
            .selectAll("g")
            .data(subCategories)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 21 + ")"; });
        legend.append("circle")
          .attr("cx", bwidth + 85)
          .attr("r", 6)
          .attr("fill", zz);
        legend.append("text")
          .attr("x", bwidth + 100)
          .attr("y", 5)
          .text(d => (d));
        
        function wrap(text, bwidth) {
            text.each(function() {
              var text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  word,
                  line = [],
                  lineNumber = 0,
                  lineHeight = 1.1, // ems
                  y = text.attr("y"),
                  dy = parseFloat(text.attr("dy")),
                  tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
              while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > bwidth) {
                  line.pop();
                  tspan.text(line.join(" "));
                  line = [word];
                  tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
              }
            });
          }
        var periode = document.getElementById("selectPeriode");
        periode.value = PeriodenValue[barAusgewählt];
        var radarKanton = document.getElementById("selectKanton");
        radarKanton.value = KantonValue[plotCanton[0]];  
        periode.dispatchEvent(new Event('change'));
        radarKanton.dispatchEvent(new Event('change'));

    });
    
    function changeBar(){
       
        d3.csv("Komplett_Version.csv" , function(data) {
            for (var i in plotCanton){
                if (plotCanton[i] == "St-Gallen"){
                    plotCanton[i] = "St. Gallen";
                } else if (plotCanton[i] == "Appenzell-Innerrhoden"){
                    plotCanton[i] = "Appenzell I. Rh.";
                } else if (plotCanton[i] == "Appenzell-Ausserrhoden"){
                    plotCanton[i] = "Appenzell A. Rh.";
                } else {
                    continue;
                }
            }
            barDaten = data.filter(function(row){ return plotCanton.includes(row['Kantone'])});

            var barVergleich = [];

            for(bCanton of plotCanton){
                barIndex = [];
                var jahr = barAusgewählt;
                for (var j = 0; j <= 10; j++){
                    for (var i in barDaten) {
                        if (barDaten[i]["Wahljahr"] == jahr && barDaten[i]["Kantone"] == bCanton){
                            if (barIndex.length > 1){
                                continue;
                            } else {
                                barIndex.push(i);
                            }
                        }
                    }
                    jahr -= 1;
                }
                barVergleich.push({"Kanton": bCanton, "Jahr": barAusgewählt,     "FDP": barDaten[barIndex[0]]["FDP"] - barDaten[barIndex[1]]["FDP"], "CVP": barDaten[barIndex[0]]["CVP"] - barDaten[barIndex[1]]["CVP"], "SP": barDaten[barIndex[0]]["SP"] - barDaten[barIndex[1]]["SP"], "SVP": barDaten[barIndex[0]]["SVP"] - barDaten[barIndex[1]]["SVP"], "LPS": barDaten[barIndex[0]]["LPS"] - barDaten[barIndex[1]]["LPS"], "BDP": barDaten[barIndex[0]]["BDP"] - barDaten[barIndex[1]]["BDP"], "GLP": barDaten[barIndex[0]]["GLP"] - barDaten[barIndex[1]]["GLP"], "GPS": barDaten[barIndex[0]]["GPS"] - barDaten[barIndex[1]]["GPS"],
                });
            }
            
             
            bar.selectAll("g")
                .data(barVergleich)
                .selectAll("rect")
                .data(function(d) { return subCategories.map(function(key) { return {key: key, value: d[key]}; }); })
                .transition(1)
                .attr("x", d => xx1(d.key))
                .attr("y", d => (d.value<0 ? yy(0) : yy(d.value)))
                .attr("width", xx1.bandwidth())
                .attr("height", d => Math.abs(yy(d.value) - yy(0)))
            
            bar.selectAll("g")
                .data(barVergleich)
                .selectAll("text")
                .data(function(d) { return subCategories.map(function(key) { return {key: key, value: d[key]}; }); })
                .transition(1)
                .attr("x", d => xx1(d.key) + (xx1.bandwidth() / 2) - 7)
                .attr("y", d => d.value<0 ? yy(0) - (yy(4) - (Math.abs(yy(d.value) - yy(0)) + 65)) : yy(d.value) - 5)
                .text(d => Number.parseFloat(d.value).toFixed(1))
            
            var periode = document.getElementById("selectPeriode");
            periode.value = PeriodenValue[barAusgewählt]; 
            var radarKanton = document.getElementById("selectKanton");
            radarKanton.value = KantonValue[plotCanton[0]]; 
            periode.dispatchEvent(new Event('change'));
            radarKanton.dispatchEvent(new Event('change'));
        }); 
        
    }
}