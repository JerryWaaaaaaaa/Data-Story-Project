import currentBox from "./leonScroller.js";
// imports just one function from a different file
// more info, import: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// more info, export: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// we don't hardcode w and h this time
// but keep them responsive
// (see adjustVizHeight and resized function
// that are defined at the bottom)
let w, h;
let heightRatio = 0.6;
let padding = 50;

let viz = d3.select("#viz")
    .append("svg")
    // .style("background-color", "grey")
;
let xAxisGroup = viz.append("g").attr("class", "xaxis");
let yAxisGroup = viz.append("g").attr("class", "yaxis");

// function to adjust viz height dynamically
// in order to keep the heightRatio at any given
// width of the browser window
// (function definition at the bottom)
adjustVizHeight();


// global use virables
let xScale, yScale;

// for TFRB and Grants
let private_tfrb = [];
let public_tfrb = [];
let private_net_tfrb = [];
let public_net_tfrb = [];
let private_grants = [];
let public_grants = [];
let years;

d3.csv("data/TFRB-private.csv").then(processPrivateData);
d3.csv("data/TFRB-public.csv").then(processPublicData);

// for job market
let unemployment = [];
d3.csv("data/unemployed.csv").then(processUnemployedData);

function processPrivateData(data){
    years = Object.keys(data[0]);
    organizeData(data[1], private_tfrb, years);
    organizeData(data[3], private_net_tfrb, years);
    organizeData(data[4], private_grants, years);
}

function processPublicData(data){
    years = Object.keys(data[0]);
    organizeData(data[1], public_tfrb, years);
    organizeData(data[3], public_net_tfrb, years);
    organizeData(data[4], public_grants, years);
}

function processUnemployedData(data){
    let youngSum = 0;
    let allSum = 0;
    let recentGradSum = 0;
    let collegeGradSum = 0;
    let count = 1
    for (let i = 1; i < data.length; i ++ ){
        let d = data[i];
        // console.log(data[i]);
        let year = d["Date"].split("/")[0]
        if (count < 12) {
            youngSum += parseFloat(d["Young workers"])
            allSum += parseFloat(d["All workers"])
            recentGradSum += parseFloat(d["Recent graduates"])
            collegeGradSum += parseFloat(d["College graduates"])
            count += 1
            if (count >= 12) {
                let datum = {
                    year: year,
                    young: youngSum/12,
                    all: allSum/12,
                    recent: recentGradSum/12,
                    college: collegeGradSum/12
                }
                unemployment.push(datum);
                youngSum = 0
                allSum = 0
                recentGradSum = 0
                collegeGradSum = 0
                count = 1
            }
        }
    }
    console.log(unemployment);
}

function tuitionRiseChart01(){

    // find max and min for x axis and y axis
    let allYears = private_tfrb.map(function(datum){return datum.year});

    let xDomain = d3.extent(years, function(year){ return parseInt(year) });
    let yMax = d3.max(private_tfrb, function(datum){ return datum.amount });
    let yMin = d3.min(public_grants, function(datum){ return datum.amount });
    let yDomain = [yMin, yMax];
    console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");

    // --------- Private TFRB chart ----------
    let private_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let private_tfrb_line_sit = viz.datum(private_tfrb);
    private_tfrb_line_sit.append("path").attr("class", "tuition_rise_chart").attr("d", private_tfrb_line).attr("fill", "none").attr("stroke", "#ff7543");
    let private_tfrb_data = viz.selectAll(".dataPoints").data(private_tfrb).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuition_rise_chart privateTFRB")
    ;

    private_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ff7543")
        .attr("opacity", 1)
    ;

    private_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ff7543")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".privateTFRB")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 8);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 4);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;

    // --------- Public TFRB chart ----------
    let public_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let public_tfrb_line_sit = viz.datum(public_tfrb);
    public_tfrb_line_sit.append("path").attr("class", "tuition_rise_chart").attr("d", public_tfrb_line).attr("fill", "none").attr("stroke", "#ffc31e");

    let public_tfrb_data = viz.selectAll(".dataPoints").data(public_tfrb).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuition_rise_chart publicTFRB")
    ;

    public_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ffc31e")
        .attr("opacity", 1)
    ;

    public_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ffc31e")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".publicTFRB")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 8);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 4);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;

}

function tuitionRiseChart02(){

    // find max and min for x axis and y axis
    let allYears = private_tfrb.map(function(datum){return datum.year});

    let xDomain = d3.extent(years, function(year){ return parseInt(year) });
    let yMax = d3.max(private_tfrb, function(datum){ return datum.amount });
    let yMin = d3.min(public_grants, function(datum){ return datum.amount });
    let yDomain = [yMin, yMax];
    console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");

    // --------- Private TFRB chart ----------
    let private_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let private_tfrb_line_sit = viz.datum(private_net_tfrb);
    private_tfrb_line_sit.append("path").attr("class", "tuition_rise_chart").attr("d", private_tfrb_line).attr("fill", "none").attr("stroke", "#ff7543").style("stroke-dasharray", ("6, 6"));

    let private_tfrb_data = viz.selectAll(".dataPoints").data(private_net_tfrb).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuition_rise_chart privateNetTFRB")
    ;

    private_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ff7543")
        .attr("opacity", 1)
    ;

    private_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ff7543")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".privateNetTFRB")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 8);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 4);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;

    // --------- Public TFRB chart ----------
    let public_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let public_tfrb_line_sit = viz.datum(public_net_tfrb);
    public_tfrb_line_sit.append("path").attr("class", "tuition_rise_chart").attr("d", public_tfrb_line).attr("fill", "none").attr("stroke", "#ffc31e").style("stroke-dasharray", ("6, 6"));

    let public_tfrb_data = viz.selectAll(".dataPoints").data(public_net_tfrb).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuition_rise_chart publicNetTFRB")
    ;

    public_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ffc31e")
        .attr("opacity", 1)
    ;

    public_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ffc31e")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".publicNetTFRB")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 8);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 4);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;

}

function organizeData(sourceData, outputData, keys){
    for (let i = 0; i < keys.length; i ++ ) {
        let k = keys[i];
        if ( !( (k == " ") || (k == "") ) ) {
            let year = k;
            let value = sourceData[year].replace("$","");
            value = value.replace(",","");
            value = parseInt(value)
            console.log(value);
            let datum = {
                "year": year,
                "amount": value
            }
            outputData.push(datum);
        }
    }
}

function theoryChart01(){
    // find max and min for x axis and y axis
    let allYears = private_tfrb.map(function(datum){return datum.year});

    let xDomain = d3.extent(years, function(year){ return parseInt(year) });
    let yMax = d3.max(private_tfrb, function(datum){ return datum.amount });
    let yMin = d3.min(public_grants, function(datum){ return datum.amount });
    let yDomain = [yMin, yMax];
    console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");

    // --------- Fade out the old chart ----------
    d3.selectAll(".tuition_rise_chart").transition().duration(500).attr("opacity", 0);

    // --------- Private TFRB chart ----------
    let private_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let private_tfrb_line_sit = viz.datum(private_grants);
    private_tfrb_line_sit.append("path").attr("class", "tuitin_theory_chart").attr("d", private_tfrb_line).attr("fill", "none").attr("stroke", "#ff7543");

    let private_tfrb_data = viz.selectAll(".dataPoints").data(private_grants).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuitin_theory_chart privateGrant")
    ;

    private_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ff7543")
        .attr("opacity", 1)
    ;

    private_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ff7543")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".privateGrant")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 8);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("r", 4);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;

    // --------- Public TFRB chart ----------
    let public_tfrb_line = d3.line()
                     .x(function(d){ return xScale(d.year)+padding/2 })
                     .y(function(d){ return yScale(d.amount) })
    ;
    let public_tfrb_line_sit = viz.datum(public_grants);
    public_tfrb_line_sit.append("path").attr("class", "tuitin_theory_chart").attr("d", public_tfrb_line).attr("fill", "none").attr("stroke", "#ffc31e");

    let public_tfrb_data = viz.selectAll(".dataPoints").data(public_grants).enter().append("g")
        .attr("transform", function(d){
          let x = xScale(d.year)+padding/2;
          let y = yScale(d.amount);
          return "translate(" + x + "," + y + ")";
        })
        .attr("class", "tuition_theory_chart publicGrant")
    ;

    public_tfrb_data.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "#ffc31e")
        .attr("opacity", 1)
    ;

    public_tfrb_data.append("text")
        .text( function(d){ return "$" + d.amount } )
        .attr("x", -25)
        .attr("y", -5)
        .attr("fill", "#ffc31e")
        .attr("opacity", 0)
    ;

    // add hover event
    viz.selectAll(".publicGrant")
        .on("mouseover", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("opacity", 1);
            element.select("text").transition().duration(500).attr("opacity", 1);
        })
        .on("mouseout", function(d){
            console.log(d);
            let element = d3.select(this); // select the element
            element.select("circle").transition().duration(500).attr("opacity", 0.5);
            element.select("text").transition().duration(500).attr("opacity", 0);
        })
    ;
}

function jobChart01(){
    // find max and min for x axis and y axis
    let allYears = unemployment.map(function(datum){return datum.year});

    let xDomain = d3.extent(years, function(year){ return parseInt(year) });
    let yMax = d3.max(unemployment, function(datum){ return datum.young });
    let yMin = d3.min(unemployment, function(datum){ return datum.college });
    let yDomain = [yMin, yMax];
    console.log(xDomain, yDomain);

    // update xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");



}

// scrolling event listener
// you might move this block into the part of your code
// in which your data is loaded/available
let previousSection;
d3.select("#scrollingWrapper").on("scroll", function(){
// window.addEventListener("scroll", function(){
  console.log("scroll");
  // the currentBox function is imported on the
  // very fist line of this script
  currentBox(function(box){
    console.log("BOX", box);

    if(box.id=="rise_chart_01" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 01
      tuitionRiseChart01();
    }
    if(box.id=="rise_chart_02" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 02
      tuitionRiseChart02();
    }
    if(box.id=="theory_chart_01" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 02
      theoryChart01();
    }
    if(box.id=="job_chart_01" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 02
      jobChart01();
    }
  })
})


// function to adjust viz height dynamically
// in order to keep the heightRatio at any given
// width of the browser window
function adjustVizHeight(){
  viz.style("height", function(){
    w = parseInt(viz.style("width"), 10);
    h = w*heightRatio;
    return h;
  })
}
function resized(){
  adjustVizHeight()
}
window.addEventListener("resize", resized);


// ----------- Questions -------------
// 1. Add transition between charts
// 2. Comment to the chart
// 3. replace dots with dollar svg
// 4. show years on xaxis every other year
