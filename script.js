const w = 1200;
const h = 800;
const padding = 50;

// file name
let datafile = "data/EdStats_Indicators_Report.csv";
let processedData = [];

d3.csv(datafile).then(gotData);

function gotData(data){
    console.log("before filter", data);
    // filter the data
    data = getCountry(data, "United States");
    console.log("after filter", data);

    // organize data
    keys = Object.keys(data["0"]);
    organizeData(data, keys);
    console.log("after process", processedData);

    // find max and min for x axis and y axis
    let xDomain = d3.extent(processedData, function(datum){ return datum.year });
    let yMax = d3.max(processedData, function(datum){ return datum.rate });
    let yDomain = [70, yMax];
    console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleLinear().domain(xDomain).range([padding, w - padding]);
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    let viz = d3.select("#container").append("svg").attr("width", w).attr("height", h);

    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g").attr("class", "xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.append("g").attr("class", "yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");

    // drawData
    let dataPoints = viz.selectAll(".dataPoints").data(processedData);

    let enteringGroups = dataPoints.enter();

    enteringGroups.append("g")
        .attr("transform", getPos)
        .append("rect")
        .attr("y", function(d){ return - (h - padding - yScale(d.rate)) })
        .attr("width", 30)
        .attr("height", function(d){ return h - padding - yScale(d.rate) })
        .attr("fill", "black")
    ;

    function getPos(d){
      console.log(d.year, d.rate);
      let x = xScale(d.year);
      let y = h - padding;
      return "translate(" + x + "," + y + ")";
    }

}


function organizeData(data, keys){
    for (let i = 0; i < keys.length; i ++ ) {
        k = keys[i];
        if ( !( (k == " ") || (k == "") ) ) {
            let country = data["0"][" "];
            let year = k;
            let value = parseFloat(data["0"][k]);
            datum = {
                "country": country,
                "year": year,
                "rate": value
            }
            processedData.push(datum);
        }
    }
}

function getCountry(data, country){
    return data.filter(function(dataPoint){
        if ( dataPoint[" "] == country ){
          return true;
        }
        else {
          return false;
        }
    })
}
