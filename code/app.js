(function() {
  angular.module("RadarChart", [])
    .directive("radar", radar)
    .directive("onReadFile", onReadFile)
    .controller("MainCtrl", MainCtrl);

  // controller function MainCtrl
  function MainCtrl($http) {
    var ctrl = this;
    init();


    // function init
    function init() {
      // initialize controller variables
      ctrl.examples = [
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010",
        "2009",
        "2008",
        "2007",
        "2006",
        "2005",
        "2004",
        "2003",
        "2002",
        "2001",
        "2000",
        "1999",
        "1995",
        "1991",
        "1987",
        "1983"
      ];
       
    ctrl.examples2 = [
        "Aargau",
        "Appenzell A. Rhoden",
        "Bern",
        "Basel-Landschaft",
        "Basel-Stadt",
        "Freiburg",
        "Genf",
        "Glarus",
        "Jura",
        "Luzern",
        "Neuenburg",
        "Nidwalden",
        "St. Gallen",
        "Schaffhausen",
        "Schwyz",
        "Solothurn",
        "Thurgau",
        "Tessin",
        "Uri",
        "Wallis",
        "Waadt",
        "Zug",
        "Zürich"
      ];
            
        
      //ctrl.exampleSelected = ctrl.examples[0];
      ctrl.getData = getData;
      ctrl.selectExample = selectExample;
        
      //ctrl.exampleSelected2 = ctrl.examples2[0];
      ctrl.selectExample2 = selectExample;

        
      //initialize controller functions
      //ctrl.selectExample(ctrl.exampleSelected);
      ctrl.config = {
        w: 250,
        h: 250,
        facet: false,
        levels: 5,
        levelScale: 0.85,
        labelScale: 0.9,
        facetPaddingScale: 2.1,
        showLevels: true,
        showLevelsLabels: false,
        showAxesLabels: true,
        showAxes: true,
        showLegend: true,
        showVertices: true,
        showPolygons: true
      };
    }

      
    // function getData 
    function getData($fileContent) {
      ctrl.csv = $fileContent;
    }  

    // function selectExample
    function selectExample(item) {
        var teams = [];
        if ((ctrl.exampleSelected2 == "Neuenburg") || (ctrl.exampleSelected2 == "Basel-Stadt") || (ctrl.exampleSelected2 == "Basel-Landschaft")) {
            teams.push("Neuenburg");
            teams.push("Basel-Stadt");
            teams.push("Basel-Landschaft");
            }
        else if ((ctrl.exampleSelected2 == "Freiburg") || (ctrl.exampleSelected2 == "Jura") || (ctrl.exampleSelected2 == "Luzern")) {
            teams.push("Freiburg");
            teams.push("Jura");
            teams.push("Luzern");
        }
        else if ((ctrl.exampleSelected2 == "St. Gallen") || (ctrl.exampleSelected2 == "Wallis") || (ctrl.exampleSelected2 == "Obwalden")) {
            teams.push("St. Gallen");
            teams.push("Wallis");
            teams.push("Obwalden");
        }
        else if ((ctrl.exampleSelected2 == "Uri") || (ctrl.exampleSelected2 == "Thurgau") || (ctrl.exampleSelected2 == "Schwyz") || (ctrl.exampleSelected2 == "Graubünden")){
            teams.push("Uri");
            teams.push("Thurgau");
            teams.push("Schwyz");
            teams.push("Graubünden");
        }
        
        else if ((ctrl.exampleSelected2 == "Nidwalden") || (ctrl.exampleSelected2 == "Zug")) {
            teams.push("Nidwalden");
            teams.push("Zug");
        }
        else if ((ctrl.exampleSelected2 == "Aargau") || (ctrl.exampleSelected2 == "Bern")) {
            teams.push("Aargau");
            teams.push("Bern");
        }
        else if ((ctrl.exampleSelected2 == "Schaffhausen") || (ctrl.exampleSelected2 == "Zürich")) {
            teams.push("Schaffhausen");
            teams.push("Zürich");
        }
        else if ((ctrl.exampleSelected2 == "Genf") || (ctrl.exampleSelected2 == "Waadt")) {
            teams.push("Genf");
            teams.push("Waadt");
        }
        else if ((ctrl.exampleSelected2 == "Glarus") || (ctrl.exampleSelected2 == "Solothurn") || (ctrl.exampleSelected2 == "Tessin") || (ctrl.exampleSelected2 == "Appenzell A. Rhoden")) {
            teams.push("Glarus");
            teams.push("Solothurn");
            teams.push("Tessin");
            teams.push("Appenzell A. Rhoden");
        }
        
      d3.csv("Komplett_Version.csv", function(data) {
                  
        for (var i in teams){
            if (teams[i] == "St-Gallen"){
                teams[i] = "St. Gallen";
            } else if (teams[i] == "Appenzell-Innerrhoden"){
                teams[i] = "Appenzell I. Rh.";
            } else if (teams[i] == "Appenzell-Ausserrhoden"){
                teams[i] = "Appenzell A. Rh.";
            } else {
                continue;
            }
        }
          
        gefiltert = data.filter(function(row){ return       teams.includes(row['Kantone'])});
                                             
        var daten = "group,axis,value,decription";
        
        for(team of teams){
            teamIndex = 0;
            var jahr = item;
            for (var j = 0; j <= 5; j++){
                if (teamIndex > 0){
                    break;
                }
                for (var i in gefiltert) {
                    if (gefiltert[i]["Wahljahr"] == jahr && gefiltert[i]["Kantone"] == team){
                        daten += "\n" + team + ",FDP, " + gefiltert[i]["FDP"];
                        daten += ",\n" + team + ",CVP, " + gefiltert[i]["CVP"];
                        daten += ",\n" + team + ",SP, " + gefiltert[i]["SP"];
                        daten += ",\n" + team + ",SVP, " + gefiltert[i]["SVP"];
                        daten += ",\n" + team + ",LPS, " + gefiltert[i]["LPS"];
                        daten += ",\n" + team + ",EVP, " + gefiltert[i]["EVP"];
                        daten += ",\n" + team + ",PdA, " + gefiltert[i]["PdA"];
                        daten += ",\n" + team + ",GPS, " + gefiltert[i]["GPS"];
                        daten += ",\n" + team + ",GLP, " + gefiltert[i]["GLP"];
                        daten += ",\n" + team + ",BDP, " + gefiltert[i]["BDP"];
                        daten += ",\n" + team + ",LDU, " + gefiltert[i]["LDU"];
                        daten += ",\n" + team + ",FPS, " + gefiltert[i]["FPS"] + ",";
                        teamIndex = 1;
                        break;
                    }
                }
                jahr -= 1;
            }
        }            
        ctrl.csv = daten;
      });
    }
  }

  // directive function sunburst
  function radar() {
    return {
      restrict: "E",
      scope: {
        csv: "=",
        config: "="
      },
      link: radarDraw
    };
  }

   // directive function 
  function onReadFile($parse) {
    return {
      restrict: "A",
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
        element.on("change", function(onChangeEvent) {
          var reader = new FileReader();
          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              fn(scope, {
                $fileContent: onLoadEvent.target.result
              });
            });
          };
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  }

    
})();
