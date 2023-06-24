var svg = d3.select("#map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    
//years in dataset
var jahre = [1975, 1979, 1983, 1987, 1991, 1995, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
    

var Tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");
    
var ausgewählt = 1983;
    
var selectedCanton;

//add all parties, which are or once were a dominating party in a canton

var farben = {"FDP": "#C39A63", "CVP": "#627975", "SP": "#D3AEA6", "SVP": "#867E74", "LPS": "#303030", "BDP": "#BDC9C9"};

var legende = d3.select("#legende")
for (var i = 0; i < 6; i++){
    legende.append("circle").attr("cx", 10).attr("cy", 50 + i * 29).attr("r", 6).style("fill", Object.values(farben)[i]);
    
    legende.append("text").attr("x", 23).attr("y", 51 + i * 30).text(Object.keys(farben)[i]).style("font-size", "12px").attr("alignment-baseline","middle").attr("font-family", "Open Sans")
}
    
var projection = d3.geoMercator()
    .center([8.3, 46.8])
    .scale(8000)
    .translate([width / 2, height / 2 + 50])
    .precision(.1);
    
function showInformation(){
    d3.select("." + selectedCanton)
        .transition(0.5)
        .style("stroke-width", 2.2)
       .style("fill-opacity", 1);
        
    Tooltip
      .style("opacity", 1);
}
    
var mousemove = function(d) {
    
    d3.csv("Komplett_Version.csv", function(daten){
        
        var wahlbeteiligung;
        var erstePartei;
        var zweitePartei;
        var drittePartei;
        var ersteWert;
        var zweiteWert;
        var dritteWert;
        var text;
        
        //change given name to name in dataset
        if (selectedCanton == "St-Gallen"){
            canton = "St. Gallen";
        } else if (selectedCanton == "Appenzell-Innerrhoden"){
            canton = "Appenzell I. Rh.";
        } else if (selectedCanton == "Appenzell-Ausserrhoden"){
            canton = "Appenzell A. Rh.";
        } else {
            canton = selectedCanton;
        }
        var jahre = [];
        mousemoveDaten = daten.filter(function(row){ return (row['Kantone'] == canton);})

        for (var i in mousemoveDaten){
            jahre.push(parseInt(mousemoveDaten[i]["Wahljahr"]));  
        }
        var jahr = ausgewählt;
        var wahljahr;
        for (var j = 0; j <= 4; j++){
            if (jahre.indexOf(jahr) > -1){
                for (var i in mousemoveDaten){
                    if (mousemoveDaten[i]["Wahljahr"] == jahr){
                        wahlbeteiligung = parseFloat(mousemoveDaten[i]["Wahlbeteiligung"]);
                        
                        wahljahr = parseFloat(mousemoveDaten[i]["Wahljahr"]);
                        
                        var parteien = ["FDP", "CVP", "SP", "SVP", "LPS", "EVP", "PdA", "GPS", "GLP", "BDP", "LDU", "FPS"]
                        
                        var werte = [parseFloat(mousemoveDaten[i]["FDP"]), parseFloat(mousemoveDaten[i]["CVP"]), parseFloat(mousemoveDaten[i]["SP"]), parseFloat(mousemoveDaten[i]["SVP"]), parseFloat(mousemoveDaten[i]["LPS"]), parseFloat(mousemoveDaten[i]["EVP"]), parseFloat(mousemoveDaten[i]["PdA"]), parseFloat(mousemoveDaten[i]["GPS"]), parseFloat(mousemoveDaten[i]["GLP"]), parseFloat(mousemoveDaten[i]["BDP"]), parseFloat(mousemoveDaten[i]["LDU"]), parseFloat(mousemoveDaten[i]["FPS"])];
                        
                        ersteWert = d3.max(werte);
                        var indexerste = werte.indexOf(ersteWert);
                        erstePartei = parteien[indexerste];
                        werte.splice(indexerste, 1);
                        parteien.splice(indexerste, 1);
                        
                        zweiteWert = d3.max(werte);
                        var indexzweite = werte.indexOf(zweiteWert);
                        zweitePartei = parteien[indexzweite];
                        werte.splice(indexzweite, 1);
                        parteien.splice(indexzweite, 1);
                        
                        dritteWert = d3.max(werte);
                        var indexdritte = werte.indexOf(dritteWert);
                        drittePartei = parteien[indexdritte];
                    }
                }
            }
            if (wahlbeteiligung != null || ersteWert != null){
                break;
            }
            jahr -= 1;
        }
        if (wahlbeteiligung < 1){
            wahlbeteiligung = "keine Daten";
        } else if (wahlbeteiligung == undefined){
            wahlbeteiligung = "keine Daten";
        } else {
            wahlbeteiligung += "%";
        }
        if (ersteWert < 1){
            erstePartei = "keine Daten";
        } else if (ersteWert == undefined){
            erstePartei = "keine Daten";
        } else {
            erstePartei += ", " + ersteWert + "%";
        }
        if (zweiteWert < 1){
            zweitePartei = "keine Daten";
        } else if (zweiteWert == undefined){
            zweitePartei = "keine Daten";
        } else {
            zweitePartei += ", " + zweiteWert + "%";
        }
        if (dritteWert < 1){
            drittePartei = "keine Daten";
        } else if (dritteWert == undefined){
            drittePartei = "keine Daten";
        } else {
            drittePartei += ", " + dritteWert + "%";
        }
                   
    //display tooltip
    Tooltip
        .html("<strong>Kanton:</strong> " + canton + "<br>      <strong>Wahlbeteiligung:</strong> " + wahlbeteiligung + "<br><strong>Wahljahr:</strong> " + wahljahr + "<br><strong>Stärkste Partei: </strong>" + erstePartei + "<br><strong>Zweitstärkste Partei: </strong>" + zweitePartei + "<br><strong>Drittstärkste Partei: </strong>" + drittePartei);
        
        
    d3.select("." + selectedCanton)
        .style("fill-opacity", function(d){
            if (ersteWert > 1){
          var differenz = ersteWert - zweiteWert;
                return (differenz / 20);
            } else {
                return 1;
            }
    });
        
    });
    
    Tooltip
        .style("left", (d3.event.pageX+20) + "px")
        .style("top", (d3.event.pageY) + "px")
        
}
    
function hideInformation(){
    d3.select("." + selectedCanton)
        .transition(0.5)
        .style("stroke-width", 1)
        .style("fill-opacity", 1);
    
    Tooltip
      .style("opacity", 0);
}
    
// Load external data and boot
d3.json("ch_kantone.geojson", function(data){

    var slider = d3.sliderHorizontal()
        .min(d3.min(jahre))
        .max(d3.max(jahre))
        .width(width - 100)
        .tickValues([1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, ausgewählt])
        .tickFormat(d3.format("i"))
        .marks(jahre)
        .on("onchange", function(d){
            ausgewählt = d;
            updateColor();
        });
    
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .each(function(d){
                giveColor(d["properties"]["KTNAME"]);
            })
            .attr("class", function(d){
                return d["properties"]["KTNAME"];
            })
            .attr("d", d3.geoPath()
                .projection(projection))
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("fill-opacity", 1)
            .on("mouseenter", function(d){
                selectedCanton = d["properties"]["KTNAME"];
                showInformation();
            })
            .on("mousemove", mousemove)
            .on("mouseout", function(d){
                selectedCanton = d["properties"]["KTNAME"];
                hideInformation();
            })
    
    // stacked area chart and negative-/positive barplot
            .on("click", function(d){
                plotCantonBarplot = [];
                if ((d["properties"]["KTNAME"] == "Neuenburg") 
                || (d["properties"]["KTNAME"] == "Basel-Stadt") || (d["properties"]["KTNAME"] == "Basel-Landschaft")) {
                    plotCantonBarplot.push("Neuenburg");
                    plotCantonBarplot.push("Basel-Stadt");
                    plotCantonBarplot.push("Basel-Landschaft");
                    }
                else if ((d["properties"]["KTNAME"] == "Freiburg") || (d["properties"]["KTNAME"] == "Jura") || (d["properties"]["KTNAME"] == "Luzern")) {
                    plotCantonBarplot.push("Freiburg");
                    plotCantonBarplot.push("Jura");
                    plotCantonBarplot.push("Luzern");
                }
                else if ((d["properties"]["KTNAME"] == "St-Gallen") || (d["properties"]["KTNAME"] == "Wallis") || (d["properties"]["KTNAME"] == "Obwalden")) {
                    plotCantonBarplot.push("St. Gallen");
                    plotCantonBarplot.push("Wallis");
                    plotCantonBarplot.push("Obwalden");
                }
                else if ((d["properties"]["KTNAME"] == "Uri") || (d["properties"]["KTNAME"] == "Thurgau") || (d["properties"]["KTNAME"] == "Schwyz") || (d["properties"]["KTNAME"] == "Graubünden")) {
                    plotCantonBarplot.push("Uri");
                    plotCantonBarplot.push("Thurgau");
                    plotCantonBarplot.push("Schwyz");
                    plotCantonBarplot.push("Graubünden");
                }

                else if ((d["properties"]["KTNAME"] == "Nidwalden") || (d["properties"]["KTNAME"] == "Zug")) {
                    plotCantonBarplot.push("Nidwalden");
                    plotCantonBarplot.push("Zug");
                }
                else if ((d["properties"]["KTNAME"] == "Aargau") || (d["properties"]["KTNAME"] == "Bern")) {
                    plotCantonBarplot.push("Aargau");
                    plotCantonBarplot.push("Bern");
                }
                else if ((d["properties"]["KTNAME"] == "Schaffhausen") || (d["properties"]["KTNAME"] == "Zürich")) {
                    plotCantonBarplot.push("Schaffhausen");
                    plotCantonBarplot.push("Zürich");
                }
                else if ((d["properties"]["KTNAME"] == "Genf") || (d["properties"]["KTNAME"] == "Waadt")) {
                    plotCantonBarplot.push("Genf");
                    plotCantonBarplot.push("Waadt");
                }
                else if ((d["properties"]["KTNAME"] == "Glarus") || (d["properties"]["KTNAME"] == "Solothurn") || (d["properties"]["KTNAME"] == "Tessin") || (d["properties"]["KTNAME"] == "Appenzell-Ausserrhoden")) {
                    plotCantonBarplot.push("Glarus");
                    plotCantonBarplot.push("Solothurn");
                    plotCantonBarplot.push("Tessin");
                    plotCantonBarplot.push("Appenzell A. Rh.");
                }
                barplot(plotCantonBarplot);
                areaplotMultiple(plotCantonBarplot);
                
                plotCanton = [d["properties"]["KTNAME"]]; 
                areaplot(plotCanton); 
            });
                  
    svg.append("g")
        .attr("transform", "translate(50, 30)")
        .call(slider);
    
    function updateColor(){
        svg.selectAll("path")
            .data(data.features)
            .transition(1)
            .each(function(d){
                giveColor(d["properties"]["KTNAME"]);
            });
    }
    
})
  
//add color to each canton based on strongest party of the canton
function giveColor(canton) {
    
d3.csv("Komplett_Version.csv", function(daten){
    
    var maxPartei = null;
   
    svg.select("." + canton)
        .attr("fill", function(d){
            //change given name to name in dataset
            if (canton == "St-Gallen"){
                canton = "St. Gallen";
            } else if (canton == "Appenzell-Innerrhoden"){
                canton = "Appenzell I. Rh.";
            } else if (canton == "Appenzell-Ausserrhoden"){
                canton = "Appenzell A. Rh.";
            }
            var jahre = [];
            giveColorDaten = daten.filter(function(row){ return (row['Kantone'] == canton);})
            for (var i in giveColorDaten){
                jahre.push(parseInt(giveColorDaten[i]["Wahljahr"]));  
            }
            var jahr = ausgewählt;
            var color = "white";
            for (var j = 0; j <= 4; j++){
                if (jahre.indexOf(jahr) > -1){
                    for (var i in giveColorDaten){
                        if (giveColorDaten[i]["Wahljahr"] == jahr){
                            
                            var parteien = ["FDP", "CVP", "SP", "SVP", "LPS", "EVP", "PdA", "GPS", "GLP", "BDP", "LDU", "FPS"]
                        
                            var werte = [parseFloat(giveColorDaten[i]["FDP"]), parseFloat(giveColorDaten[i]["CVP"]), parseFloat(giveColorDaten[i]["SP"]), parseFloat(giveColorDaten[i]["SVP"]), parseFloat(giveColorDaten[i]["LPS"]), parseFloat(giveColorDaten[i]["EVP"]), parseFloat(giveColorDaten[i]["PdA"]), parseFloat(giveColorDaten[i]["GPS"]), parseFloat(giveColorDaten[i]["GLP"]), parseFloat(giveColorDaten[i]["BDP"]), parseFloat(giveColorDaten[i]["LDU"]), parseFloat(giveColorDaten[i]["FPS"])];
                        
                            var maxWahl = d3.max(werte);
                            var indexerste = werte.indexOf(maxWahl);
                            maxPartei = parteien[indexerste];
                    
                            if (maxWahl > 1){
                                color = farben[maxPartei];
                                break;
                            }
                        }
                    }
                }
                if (color != "white"){
                    break;
                }
                jahr -= 1;
            }  
        return color;
        })
        
    });
}
