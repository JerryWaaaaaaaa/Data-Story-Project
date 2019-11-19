const w = 1000;
const h = 400;
const padding = 50;

// file name
let datafile = "data/TFRB-private.csv";
let tfrb = [];
let net_tfrb = [];
let grands = [];

d3.csv(datafile).then(gotData);

function gotData(data){
    // console.log("before selection", data);
    tfrb = [];
    net_tfrb = [];
    grands = [];

    // filter the data
    // data = getCountry(data, "United States");
    // console.log("after filter", data);

    // organize data
    years = Object.keys(data[0]);
    organizeData(data[1], tfrb, years);
    organizeData(data[3], net_tfrb, years);
    organizeData(data[4], grands, years);
    console.log("Years", years);
    console.log("TFRB", tfrb);
    console.log("NET TFRB", net_tfrb);
    console.log("Grands", grands);


    // find max and min for x axis and y axis
    let allYears = tfrb.map(function(datum){return datum.year});

    let xDomain = d3.extent(years, function(year){ return parseInt(year) });
    let yMax = Math.max( d3.max(tfrb, function(datum){ return datum.amount }), d3.max(net_tfrb, function(datum){ return datum.amount }) );
    let yMin = Math.min( d3.min(tfrb, function(datum){ return datum.amount }), d3.min(net_tfrb, function(datum){ return datum.amount }) );
    let yDomain = [yMin - 10000, yMax];
    console.log(xDomain, yDomain);

    // create xScale and yScale
    let xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    let yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    let viz = d3.select("#container").append("svg").attr("width", w).attr("height", h);
    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g").attr("class", "xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.append("g").attr("class", "yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");

    // --------- TFRB chart ----------
    let tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let tfrb_line_sit = viz.datum(tfrb);
    tfrb_line_sit.append("path").attr("d", tfrb_line).attr("fill", "none").attr("stroke", "#ff7543");

    let tfrb_data = viz.selectAll(".dataPoints").data(tfrb).enter();
    tfrb_data.append("circle")
        .attr("class", "TFRB")
        .attr("cx", function(d){ return xScale(d.year)+padding/2 })
        .attr("cy", function(d){ return yScale(d.amount) })
        .attr("r", 4)
        .attr("fill", "#ff7543")
    ;

    // add hover event

    // ---------- net TFRB chart -----------
    let net_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let net_tfrb_line_sit = viz.datum(net_tfrb);
    net_tfrb_line_sit.append("path").attr("d", net_tfrb_line).attr("fill", "none").attr("stroke", "#ffc31e");

    let net_tfrb_data = viz.selectAll(".dataPoints").data(net_tfrb).enter();

    net_tfrb_data.append("circle")
        .attr("class", "Net TFRB")
        .attr("cx", function(d){ return xScale(d.year)+padding/2 })
        .attr("cy", function(d){ return yScale(d.amount) })
        .attr("r", 4)
        .attr("fill", "#ffc31e")
    ;

}


function organizeData(sourceData, outputData, keys){
    for (let i = 0; i < keys.length; i ++ ) {
        k = keys[i];
        if ( !( (k == " ") || (k == "") ) ) {
            let year = k;
            let value = sourceData[year].replace("$","");
            value = value.replace(",","");
            value = parseInt(value)
            console.log(value);
            datum = {
                "year": year,
                "amount": value
            }
            outputData.push(datum);
        }
    }
}
