import currentBox from "./leonScroller.js";
// imports just one function from a different file
// more info, import: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// more info, export: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// we don't hardcode w and h this time
// but keep them responsive
// (see adjustVizHeight and resized function
// that are defined at the bottom)
let w, h;
let heightRatio = 0.625;
let padding = 60;

let viz = d3.select("#viz")
    .append("svg")
    // .style("background-color", "grey")
;
// global use virables
let xScale, yScale;

let xAxisGroup = viz.append("g").attr("class", "xaxis").attr("opacity", 0);
let yAxisGroup = viz.append("g").attr("class", "yaxis").attr("opacity", 0);

viz.append("g").attr("class", "budget_chart chart0").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "budget_chart chart1").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "budget_chart chart2").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "budget_chart chart3").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "budget_chart chart4").attr("opacity", 0).attr("visibility", "hidden");

viz.append("g").attr("class", "tuition_rise_chart public_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "tuition_rise_chart private_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.selectAll(".tuition_rise_chart").append("path").attr("class", "paths path02").attr("opacity", 0).attr("fill", "none").attr("stroke", "none").style("stroke-dasharray", ("6, 6"));
viz.selectAll(".tuition_rise_chart").append("path").attr("class", "paths path01").attr("opacity", 0).attr("fill", "none").attr("stroke", "none");

viz.append("g").attr("class", "employment_chart All_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "employment_chart Young_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "employment_chart Recent_College_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "employment_chart College_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.selectAll(".employment_chart").append("path").attr("class", "paths path01").attr("opacity", 0).attr("fill", "none").attr("stroke", "none");

viz.append("g").attr("class", "wage_chart college25_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "wage_chart college75_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "wage_chart collegeMid_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.append("g").attr("class", "wage_chart highSchoolMid_chart").attr("opacity", 0).attr("visibility", "hidden");
viz.selectAll(".wage_chart").append("path").attr("class", "paths path01").attr("opacity", 0).attr("fill", "none").attr("stroke", "none");


// function to adjust viz height dynamically
// in order to keep the heightRatio at any given
// width of the browser window
// (function definition at the bottom)
adjustVizHeight();




// ----------- for budget
let rawBudget;
let budget = [[],[],[],[],[]];
let budgetTypes = [];
d3.csv("data/tuition_budget.csv").then(processBudgetData);
function processBudgetData(data){
    rawBudget = data[0];
    let target = data[0];
    budgetTypes = Object.keys(target);
    budgetTypes.splice( budgetTypes.indexOf(""), 1 );
    budgetTypes.splice( budgetTypes.indexOf("Total"), 1 );
    console.log("Keys", budgetTypes);
    console.log("raw budget", target);
    let bookNum = ["Books and Supplies", Math.floor(formatDollar(target["Books and Supplies"])/100), 2 ];
    let tuitionNum = ["Tuition and Fees", Math.floor(formatDollar(target["Tuition and Fees"])/500), 0];
    let roomNum = ["Room and Board", Math.floor(formatDollar(target["Room and Board"])/500), 1 ];
    let transportationNum = ["Transportation", Math.floor(formatDollar(target["Transportation"])/100), 3 ];
    let otherNum = ["Other Expenses", Math.floor(formatDollar(target["Other Expenses"])/100), 4 ];
    // console.log("Tuition and Fees", tuitionNum);
    // console.log("Books and Supplies", bookNum);
    // console.log("Room and Board", roomNum);
    // console.log("Transportation", transportationNum);
    // console.log("Other Expenses", otherNum);

    createDatum(bookNum);
    createDatum(tuitionNum);
    createDatum(roomNum);
    createDatum(transportationNum);
    createDatum(otherNum);

    function createDatum(comb){
        let key = comb[0];
        let num = comb[1];
        let index = comb[2];
        for (let i = 0; i < num; i++) {
            let datum = {
                type: key
            }
            budget[index].push(datum);
        }
    }
    console.log("budget", budget);
}

// ----------- for tuition rise
let privateRise = [];
let publicRise = [];
let privateColor = "#dc8665";
let publicColor = "#eeb462";

d3.csv("data/TFRB-private.csv").then(processPrivateRiseData);
d3.csv("data/TFRB-public.csv").then(processPublicRiseData);
function processPrivateRiseData(data){
    // console.log(data);
    let target = data[1];
    let keys = Object.keys(data[1]);
    // console.log(keys);
    keys.forEach(function(key){
        let year = keys;
        let tfrb_value = data[1][key];
        let net_tfrb_value = data[3][key];
        let grants = data[4][key];
        // console.log(key, tfrb_value, net_tfrb_value, grants);
        if (key != "") {
            let datum = {
               year: key,
               tfrb: tfrb_value,
               netTfrb: net_tfrb_value,
               grants: grants
            }
            privateRise.push(datum);
        }
    });
    console.log("Private", privateRise);
}
function processPublicRiseData(data){
    // console.log(data);
    let target = data[1];
    let keys = Object.keys(data[1]);
    // console.log(keys);
    keys.forEach(function(key){
        let year = keys;
        let tfrb_value = data[1][key];
        let net_tfrb_value = data[3][key];
        let grants = data[4][key];
        // console.log(key, tfrb_value, net_tfrb_value, grants);
        if (key != "") {
            let datum = {
               year: key,
               tfrb: tfrb_value,
               netTfrb: net_tfrb_value,
               grants: grants
            }
            publicRise.push(datum);
        }
    });
    console.log("Public", publicRise);
}
function formatDollar(target){
    target = target.replace("$","");
    target = target.replace(",","");
    target = parseInt(target);
    return target;
}

// ---------- for job market
let employment = [];
let youngColor = "#68b2a0";
let allColor = "#2c6975";
let recentColor = "#dc8665";
let collegeColor = "#cd7672";

d3.csv("data/unemployed.csv").then(processUnemployedData);
d3.csv("data/underemployed.csv").then(processUnderemployedData);
function processUnemployedData(data){
    let youngSum = 0;
    let allSum = 0;
    let recentGradSum = 0;
    let collegeGradSum = 0;
    let count = 0
    for (let i = 1; i < data.length; i ++ ){
        let d = data[i];
        // console.log(data[i]);
        let year = d["Date"].split("/")[0];
        if (count < 12) {
            youngSum += parseFloat(d["Young workers"])
            allSum += parseFloat(d["All workers"])
            recentGradSum += parseFloat(d["Recent graduates"])
            collegeGradSum += parseFloat(d["College graduates"])
            count += 1;
            if (count >= 12) {
                let datum = {
                    year: year,
                    Young: youngSum/12,
                    All: allSum/12,
                    un_Recent_College: recentGradSum/12,
                    un_College: collegeGradSum/12,
                    under_Recent_College: 0,
                    under_College: 0,
                }
                // unemployment.push(datum);
                employment.push(datum);
                youngSum = 0
                allSum = 0
                recentGradSum = 0
                collegeGradSum = 0
                count = 0
            }
        }
    }
}
function processUnderemployedData(data){
    let index = 0;
    let recentGradSum = 0;
    let collegeGradSum = 0;
    let count = 0
    for (let i = 1; i < data.length; i ++ ){
        let d = data[i];
        // console.log(data[i]);
        let year = d["Date"].split("/")[0];
        if (count < 12) {
            recentGradSum += parseFloat(d["Recent graduates"])
            collegeGradSum += parseFloat(d["College graduates"])
            count += 1;
            if (count >= 12) {
                let datum = employment[index];
                datum.under_Recent_College = recentGradSum/12;
                datum.under_College = collegeGradSum/12;
                recentGradSum = 0
                collegeGradSum = 0
                count = 0
                index += 1;
            }
        }

    }
    console.log("Employment data", employment);
}

// ----------- for wage
let wage = [];

let color25 = "#eeb462";
let color75 = "#dc8665";
let colorMid = "#cd7672";
let colorHighMid = "#68b2a0";


d3.csv("data/wage.csv").then(processWageData);
function processWageData(data){
    console.log("raw wage", data);
    let collegeMid = 0;
    let college25 = 0;
    let college75 = 0;
    let highSchoolMid = 0;
    let count = 0;
    for (let i = 1; i < data.length; i ++ ){
        let d = data[i];
        // console.log(data[i]);
        let year = d["Date"].split("/")[0];
        college25 = d["Bachelor's degree: 25th percentile"];
        college75 = d["Bachelor's degree: 75th percentile"];
        collegeMid = d["Bachelor's degree: median"];
        highSchoolMid = d["High school diploma: median"];
        let datum = {
            year: year,
            college25: college25,
            college75: college75,
            collegeMid: collegeMid,
            highSchoolMid: highSchoolMid
        }
        wage.push(datum);
    }
    console.log("Wage", wage);
}
function formatDollar02(target){
    target = target.replace("$","");
    target = target.replace(",","");
    target = parseInt(target);
    return target;
}

// ----------- visualization
function setTuitionRiseHover(){
    let hoverCard = viz.append("g")
        .attr("id", "hoverInfo")
        // .attr("transform", "translate(0,0)")
        .attr("opacity", 0)
        .attr("visibility", "hidden")
    ;

    hoverCard.append("rect")
        .attr("width", 130)
        .attr("height", 86)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black")
    ;

    let textXPadding = 10;
    let textYPadding = 24;

    hoverCard.append("text")
        .attr("id", "collegeType")
        .text("Type")
        .attr("x", textXPadding)
        .attr("y", textYPadding)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    hoverCard.append("text")
        .text("Year:")
        .attr("x", textXPadding)
        .attr("y", textYPadding * 2)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    hoverCard.append("text")
        .text("no data")
        .attr("id", "yearNumber")
        .attr("x", textXPadding + 40)
        .attr("y", textYPadding * 2)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    hoverCard.append("text")
        .text("Amount:")
        .attr("x", textXPadding)
        .attr("y", textYPadding * 3)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    hoverCard.append("text")
        .text("no data")
        .attr("id", "yearAmount")
        .attr("x", textXPadding + 62)
        .attr("y", textYPadding * 3)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;
}
function setTuitionRiseHover02(){
    let hoverCard = viz.append("g")
        .attr("id", "hoverInfo02")
        // .attr("transform", "translate(0,0)")
        .attr("opacity", 0)
        .attr("visibility", "hidden")
    ;

    hoverCard.append("rect")
        .attr("width", 160)
        .attr("height", 66)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black")
    ;

    let textXPadding = 10;
    let textYPadding = 24;

    hoverCard.append("text")
        .attr("id", "budgetType")
        .text("Type")
        .attr("x", textXPadding)
        .attr("y", textYPadding)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    // hoverCard.append("text")
    //     .text("School Type:")
    //     .attr("x", textXPadding)
    //     .attr("y", textYPadding * 2)
    //     .attr("font-size", 14)
    //     .attr("fill", "white")
    // ;
    //
    // hoverCard.append("text")
    //     .text("no data")
    //     .attr("id", "typeSchool")
    //     .attr("x", textXPadding + 78)
    //     .attr("y", textYPadding * 2)
    //     .attr("font-size", 14)
    //     .attr("fill", "white")
    // ;

    hoverCard.append("text")
        .text("Amount:")
        .attr("x", textXPadding)
        .attr("y", textYPadding * 2)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;

    hoverCard.append("text")
        .text("no data")
        .attr("id", "typeAmount")
        .attr("x", textXPadding + 64)
        .attr("y", textYPadding * 2)
        .attr("font-size", 14)
        .attr("fill", "white")
    ;
}

function budgetChart(){
    // fade in & out effect
    viz.selectAll(".tuition_rise_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".tuition_rise_chart").transition().delay(1000).attr("visibility", "hidden");
    viz.selectAll(".budget_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");


    // chane chart chart
    document.getElementById("chart_title").innerHTML = "College Budget, 2019";

    let xDomain = budgetTypes;
    console.log(budget, budgetTypes, xDomain);
    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([padding, w-padding])
    ;
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();

    viz.select(".xaxis").transition().duration(1000).attr("opacity", 1);
    viz.select(".yaxis").transition().duration(1000).attr("opacity", 0);

    budget.forEach(drawChart);
    function drawChart(incomingData, i){
        // console.log(i);
        let billSvg;
        if ( i == 0 || i == 1) { billSvg = bill500 }
        else { billSvg = bill100 }
        let toSelect = ".chart" + i;
        let chart = viz.select(toSelect);
        // console.log(incomingData);

        incomingData.forEach(d=>{
            // console.log( "Translate Scale", xScale( d.type ) );
            d.x = xScale( d.type );
            d.y = h/2
        })

        simulationEnded();

        let simulation = d3.forceSimulation(incomingData)
            .force("forceX", d3.forceX( function(d){
                return xScale( d.type ) + 60;
            } ) )
            .force("forceY", d3.forceY( h/2 ) )
            // .forceCenter([ function(d){ return xScale( d.type ) }, h/2 ])
            .force("collide", d3.forceCollide(4) )
            .on("tick", simulationRan)
            .tick(299)
            .on("end", simulationEnded)
        ;

        function simulationEnded(){

            chart.selectAll(".dataPoints").data(incomingData).enter()
            .append("g").attr("class", "dataPoints").append("g").attr("class", "svgSize").html(billSvg);

            chart.selectAll(".dataPoints").attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")" } );

            function randomTransform(){
                return "scale(0.04) rotate(" +
                Math.floor(Math.random()*180) +
                ")";
            }
            chart.selectAll(".svgSize").attr("transform", randomTransform);
            // chart.selectAll(".svgSize").attr("transform", "scale(0.024) rotate(135)");
        }

        // console.log(incomingData);
        function simulationRan(){
            console.log("just ran the simulation");

            chart.selectAll(".dataPoints").transition()
              .attr("transform", function(d){ return "translate(" + d.x + "," + d.y + ")" } )
            ;
        }

    }

    setTuitionRiseHover02();
    budget.forEach(updateTuitionRiseHover);
    function updateTuitionRiseHover(incomingData, i){
        let className = ".chart" + i;
        console.log("hover added!", className, incomingData, i);
        // add hover event
        viz.selectAll(className)
            .on("mouseover", function(d){
                // let element = d3.select(this).selectAll(".dataPoints"); // select the element
                let element = d3.select(this); // select the element
                console.log(element);
                viz.selectAll(".budget_chart").transition().duration(500).attr("opacity", 0.4);
                viz.selectAll(className).transition().duration(500).attr("opacity", 1);
                d3.select("#hoverInfo02").attr("transform", getPos());
                d3.select("#hoverInfo02").select("#budgetType").text(function(){ return budgetTypes[i] });
                // d3.select("#hoverInfo02").select("#typeSchool").text(function(){ return "4-Year-Private" });
                d3.select("#hoverInfo02").select("#typeAmount").text( getAmount() );
                d3.select("#hoverInfo02").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                viz.selectAll(".budget_chart").transition().duration(500).attr("opacity", 1);
                viz.selectAll(className).transition().duration(500).attr("opacity", 1);
                // element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo02").transition().duration(500).attr("opacity", 0);
                d3.select("#hoverInfo02").transition().delay(500).attr("visibility", "hidden");
                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(){
            let d = budget[i][0];
            let x = xScale(d.type);
            let y = d.y - 120;
            return "translate(" + x + "," + y + ")";
        }

        function getAmount(){
            let d = budget[i][0];
            let key = d.type;
            return rawBudget[key];
        }

    }
}

function tuitionRiseChart01(){
    viz.selectAll(".tuition_rise_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");
    viz.selectAll(".budget_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".budget_chart").transition().delay(1000).attr("visibility", "hidden");

    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Tuition and Fee, Room and Board, from 1999 to 2019";

    // find max and min for x axis and y axis
    let xDomain = privateRise.map(function(datum){ return datum.year });
    console.log(xDomain);

    let yMax = d3.max(privateRise, function(datum){ return formatDollar(datum.tfrb) });
    let yMin = d3.min(privateRise, function(datum){ return formatDollar(datum.netTfrb) });
    let yDomain = [0, yMax];
    // console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();

    viz.select(".xaxis").transition().duration(1000).attr("opacity", 1);
    viz.select(".yaxis").transition().duration(1000).attr("opacity", 1);

    var ticks = d3.selectAll(".tick text");
    ticks.each(function(_,i){
        if(i%3 !== 0) d3.select(this).attr("opacity", 0);
    });

    // --------- Private TFRB chart ----------
    privateChart();
    function privateChart(){
        let chart = viz.select(".private_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        ;
        let line_sit = chart.datum(privateRise);
        // line_sit.select("path").attr("d", line).attr("fill", "none").attr("stroke", publicColor);
        line_sit.select(".path01").transition().attr("stroke", privateColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        line_sit.select(".path02").transition().duration(1000).attr("opacity", 0);

        let pointsGroup = chart.selectAll(".dataPoints").data(privateRise);

        pointsGroup.enter().append("g")
            .attr("class", "dataPoints")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", privateColor)
                .attr("opacity", 1)
                .attr("class", "privateTFRB")
            ;

        ;

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(privateRise);
        console.log("compare data", pointsGroup_compare);
        pointsGroup_compare.enter().append("g").attr("class", "dataPoints_compare")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
            .attr("opacity", 0)
            .attr("visibility", "hidden")
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", privateColor)
                .attr("opacity", 0.5)
                .attr("class", "privateTFRB")
            ;
        pointsGroup_compare.exit().remove();
        pointsGroup_compare.transition().attr("opacity", 0);
    }
    publicChart();
    function publicChart(){
        let chart = viz.select(".public_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        ;
        let line_sit = chart.datum(publicRise);
        line_sit.select(".path01").transition().attr("stroke", publicColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        line_sit.select(".path02").transition().duration(1000).attr("opacity", 0);

        let pointsGroup = chart.selectAll(".dataPoints").data(publicRise);

        pointsGroup.enter().append("g")
            .attr("class", "dataPoints")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", publicColor)
                .attr("opacity", 1)
                .attr("class", "publicTFRB")
            ;
        ;

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(publicRise);
        console.log("compare data", pointsGroup_compare);
        pointsGroup_compare.enter().append("g").attr("class", "dataPoints_compare")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.tfrb) );
              return "translate(" + x + "," + y + ")";
            })
            .attr("opacity", 0)
            .attr("visibility", "hidden")
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", publicColor)
                .attr("opacity", 0.5)
                .attr("class", "publicTFRB")
            ;
        pointsGroup_compare.exit().remove();
        pointsGroup_compare.transition().attr("opacity", 0);
    }

    // hovers
    setTuitionRiseHover();
    updateTuitionRiseHover("Public");
    updateTuitionRiseHover("Private");
    function updateTuitionRiseHover(type){
        let className;
        if (type == "Private") { className = ".privateTFRB" }
        if (type == "Public") { className = ".publicTFRB" }
        // add hover event
        viz.selectAll(".tuition_rise_chart").selectAll(".dataPoints").selectAll(className)
            .on("mouseover", function(d){
                console.log(type);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return "4-Year-" + type });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return d.tfrb });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);
                d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");

            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( formatDollar(d.tfrb) ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }
}
function tuitionRiseChart02(){
    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Net TFRB, from 1999 to 2019";

    // find max and min for x axis and y axis
    let xDomain = privateRise.map(function(datum){ return datum.year });

    let yMax = d3.max(privateRise, function(datum){ return formatDollar(datum.tfrb) });
    let yMin = d3.min(privateRise, function(datum){ return formatDollar(datum.netTfrb) });
    let yDomain = [0, yMax];
    // console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();
    var ticks = d3.selectAll(".tick text");
    // ticks.each(function(_,i){
    //     if(i%3 !== 0) d3.select(this).remove();
    // });

    // --------- Private TFRB chart ----------
    privateChart();
    function privateChart(){
        let chart = viz.select(".private_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.netTfrb) ) })
        ;
        let line2 = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        ;
        let line_sit = chart.datum(privateRise);
        line_sit.select(".path01").transition().attr("stroke", privateColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        line_sit.select(".path02").transition().attr("d", line2).attr("opacity", 1).attr("stroke", privateColor);

        let pointsGroup = chart.selectAll(".dataPoints").data(privateRise);
        // console.log("riseChart02", pointsGroup);

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.netTfrb) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(privateRise);
        console.log("compare", pointsGroup_compare);

        pointsGroup_compare.transition().attr("opacity", 1).attr("visibility", "visible");

    }
    publicChart();
    function publicChart(){
        let chart = viz.select(".public_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.netTfrb) ) })
        ;
        let line2 = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        ;
        let line_sit = chart.datum(publicRise);
        line_sit.select(".path01").transition().attr("stroke", publicColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        line_sit.select(".path02").transition().attr("d", line2).attr("opacity", 1).attr("stroke", publicColor);

        let pointsGroup = chart.selectAll(".dataPoints").data(publicRise);
        // console.log("riseChart02", pointsGroup);

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.netTfrb) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(publicRise);
        console.log("compare", pointsGroup_compare);
        pointsGroup_compare.transition().attr("opacity", 1).attr("visibility", "visible");

    }

    // hovers
    setTuitionRiseHover();
    updateTuitionRiseHover("Public");
    updateTuitionRiseHover("Private");
    function updateTuitionRiseHover(type){
        let className;
        if (type == "Private") { className = ".privateTFRB" }
        if (type == "Public") { className = ".publicTFRB" }
        // add hover event
        viz.selectAll(".tuition_rise_chart").selectAll(".dataPoints").selectAll(className)
            .on("mouseover", function(d){
                console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return "4-Year-" + type });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return d.netTfrb });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");

                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( formatDollar(d.netTfrb) ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }
}

function theoryChart01(){
    viz.selectAll(".tuition_rise_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");
    viz.selectAll(".employment_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".employment_chart").transition().delay(1000).attr("visibility", "hidden");

    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Student Grants, from 1999 to 2019";

    // find max and min for x axis and y axis
    let xDomain = privateRise.map(function(datum){ return datum.year });

    let yMax = d3.max(privateRise, function(datum){ return formatDollar(datum.tfrb) });
    let yMin = d3.min(privateRise, function(datum){ return formatDollar(datum.netTfrb) });
    let yDomain = [0, yMax];
    // console.log(xDomain, yDomain);

    // create xScale and yScale
    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();
    var ticks = d3.selectAll(".tick text");
    ticks.each(function(_,i){
        d3.select(this).attr("opacity", 1);
        if(i%3 !== 0) d3.select(this).attr("opacity", 0);
    });

    // --------- Private TFRB chart ----------
    privateChart();
    function privateChart(){
        let chart = viz.select(".private_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.grants) ) })
        ;
        // let line2 = d3.line()
        //                  .x(function(d){ return xScale( d.year )+padding*0 })
        //                  .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        // ;

        let line_sit = chart.datum(privateRise);
        line_sit.select(".path01").transition().attr("stroke", privateColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        // line_sit.select(".path02").transition().attr("d", line2).attr("opacity", 1).attr("stroke", privateColor);


        let pointsGroup = chart.selectAll(".dataPoints").data(privateRise);


        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.grants) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(privateRise);
        console.log("compare", pointsGroup_compare);

        pointsGroup_compare.transition().duration(1000).attr("opacity", 1);

    }
    publicChart();
    function publicChart(){
        let chart = viz.select(".public_chart");

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar(d.grants) ) })
        ;
        // let line2 = d3.line()
        //                  .x(function(d){ return xScale( d.year )+padding*0 })
        //                  .y(function(d){ return yScale( formatDollar(d.tfrb) ) })
        // ;

        let line_sit = chart.datum(publicRise);
        line_sit.select(".path01").transition().attr("stroke", publicColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);
        // line_sit.select(".path02").transition().attr("d", line2).attr("opacity", 1).attr("stroke", publicColor);

        let pointsGroup = chart.selectAll(".dataPoints").data(publicRise);

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar(d.grants) );
              return "translate(" + x + "," + y + ")";
            })
        ;

        let pointsGroup_compare = chart.selectAll(".dataPoints_compare").data(publicRise);
        console.log("compare", pointsGroup_compare);

        pointsGroup_compare.transition().duration(1000).attr("opacity", 1);

    }

    // hovers
    setTuitionRiseHover();
    updateTuitionRiseHover("Public");
    updateTuitionRiseHover("Private");
    function updateTuitionRiseHover(type){
        let className;
        if (type == "Private") { className = ".privateTFRB" }
        if (type == "Public") { className = ".publicTFRB" }
        // add hover event
        viz.selectAll(".tuition_rise_chart").selectAll(".dataPoints").selectAll(className)
            .on("mouseover", function(d){
                console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return "4-Year-" + type });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return d.grants });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");
                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( formatDollar(d.grants) ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }
}

function jobChart01(){
    viz.selectAll(".tuition_rise_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".tuition_rise_chart").transition().delay(1000).attr("visibility", "hidden");
    viz.selectAll(".employment_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");

    viz.selectAll(".Young_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");
    viz.selectAll(".All_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");

    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Unemployment Rate, from 1990 to 2019";
    // find max and min for x axis and y axis
    let allYears = employment.map(function(datum){return datum.year});

    // let xDomain = d3.extent(allYears, function(year){ return parseInt(year) });
    let yMax = d3.max(employment, function(datum){ return datum.young });
    let yMin = d3.min(employment, function(datum){ return datum.college });
    let yDomain = [0, 18];
    // console.log(xDomain, yDomain);

    // update xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();
    var ticks = d3.selectAll(".tick text");
    ticks.each(function(_,i){
        d3.select(this).attr("opacity", 1);
        if(i%3 !== 0) d3.select(this).attr("opacity", 0);
    });

    drawChart("All");
    drawChart("Young");
    drawChart("Recent_College");
    drawChart("College");
    function drawChart(type){
        let chartColor;
        let typeKey;
        let toSelect = "." + type + "_chart";
        // do the color here
        if (type == "Young"){ chartColor = youngColor; typeKey = type; }
        if (type == "All"){ chartColor = allColor; typeKey = type; }
        if (type == "Recent_College"){ chartColor = recentColor; typeKey = "un_" + type; }
        if (type == "College"){ chartColor = collegeColor; typeKey = "un_" +type; }

        let chart = viz.select(toSelect);

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( d[typeKey] ) })
        ;
        let line_sit = chart.datum(employment);
        // line_sit.select("path").attr("d", line).attr("fill", "none").attr("stroke", publicColor);
        line_sit.select(".path01").transition().attr("stroke", chartColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);

        let pointsGroup = chart.selectAll(".dataPoints").data(employment);

        pointsGroup.enter().append("g")
            .attr("class", "dataPoints")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( d[typeKey] );
              return "translate(" + x + "," + y + ")";
            })
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", chartColor)
                .attr("opacity", 1)
                .attr("class", "rate")
            ;
        ;

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( d[typeKey] );
              return "translate(" + x + "," + y + ")";
            })
        ;
    }
    setTuitionRiseHover();
    updateTuitionRiseHover("All");
    updateTuitionRiseHover("Young");
    updateTuitionRiseHover("Recent_College");
    updateTuitionRiseHover("College");
    function updateTuitionRiseHover(type){
        let toSelect = "." + type + "_chart";
        let typeKey;
        if (type == "Young"){ typeKey = type; }
        if (type == "All"){ typeKey = type; }
        if (type == "Recent_College"){ typeKey = "un_" + type; }
        if (type == "College"){ typeKey = "un_" +type; }

        // add hover event
        viz.selectAll(toSelect).selectAll(".dataPoints").selectAll(".rate")
            .on("mouseover", function(d){
                console.log(typeKey, d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return type });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return Math.floor(100*d[typeKey])/100 + "%" });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);
                d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");
                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( d[typeKey] ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }

}
function jobChart02(){
    viz.selectAll(".wage_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".wage_chart").transition().delay(1000).attr("visibility", "hidden");
    viz.selectAll(".employment_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");

    viz.selectAll(".Young_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".Young_chart").transition().delay(1000).attr("opacity", 0).attr("visibility", "hidden");
    viz.selectAll(".All_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".All_chart").transition().delay(1000).attr("opacity", 0).attr("visibility", "hidden");
    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Underemployment Rate, from 1990 to 2019";
    // find max and min for x axis and y axis
    let allYears = employment.map(function(datum){return datum.year});

    // let xDomain = d3.extent(allYears, function(year){ return parseInt(year) });
    let yMax = d3.max(employment, function(datum){ return datum.young });
    let yMin = d3.min(employment, function(datum){ return datum.college });
    let yDomain = [20, 50];
    // console.log(xDomain, yDomain);

    // update xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();
    var ticks = d3.selectAll(".tick text");
    ticks.each(function(_,i){
        d3.select(this).attr("opacity", 1);
        if(i%3 !== 0) d3.select(this).attr("opacity", 0);
    });

    // drawChart("all");
    // drawChart("young");
    drawChart("Recent_College");
    drawChart("College");
    function drawChart(type){
        let chartColor;
        let typeKey;
        let toSelect = "." + type + "_chart";
        // do the color here
        // if (type == "young"){ chartColor = youngColor; typeKey = type; }
        // if (type == "all"){ chartColor = allColor; typeKey = type; }
        if (type == "Recent_College"){ chartColor = recentColor; typeKey = "under_" + type; }
        if (type == "College"){ chartColor = collegeColor; typeKey = "under_" +type; }

        let chart = viz.select(toSelect);

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( d[typeKey] ) })
        ;
        let line_sit = chart.datum(employment);
        // line_sit.select("path").attr("d", line).attr("fill", "none").attr("stroke", publicColor);
        line_sit.select(".path01").transition().attr("stroke", chartColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);

        let pointsGroup = chart.selectAll(".dataPoints").data(employment);

        pointsGroup.enter().append("g")
            .attr("class", "dataPoints")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( d[typeKey] );
              return "translate(" + x + "," + y + ")";
            })
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", chartColor)
                .attr("opacity", 1)
                .attr("class", "rate")
            ;
        ;

        pointsGroup.transition().duration(1000).attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( d[typeKey] );
              return "translate(" + x + "," + y + ")";
            })
        ;
    }
    setTuitionRiseHover();
    // updateTuitionRiseHover("all");
    // updateTuitionRiseHover("young");
    updateTuitionRiseHover("Recent_College");
    updateTuitionRiseHover("College");
    function updateTuitionRiseHover(type){
        let typeKey;
        let toSelect = "." + type + "_chart";
        // do the color here
        // if (type == "young"){ chartColor = youngColor; typeKey = type; }
        // if (type == "all"){ chartColor = allColor; typeKey = type; }
        if (type == "Recent_College"){ typeKey = "under_" + type; }
        if (type == "College"){ typeKey = "under_" + type; }
        // add hover event
        viz.selectAll(toSelect).selectAll(".dataPoints").selectAll(".rate")
            .on("mouseover", function(d){
                console.log(type, d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return type });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return Math.floor(d[typeKey]*100)/100 + "%" });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);
                d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");
                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( d[typeKey] ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }

}

function wageChart(){
    viz.selectAll(".employment_chart").transition().duration(1000).attr("opacity", 0);
    viz.selectAll(".employment_chart").transition().delay(1000).attr("visibility", "hidden");
    viz.selectAll(".wage_chart").transition().duration(1000).attr("opacity", 1).attr("visibility", "visible");

    // chane chart chart
    document.getElementById("chart_title").innerHTML = "Labor Wage, from 1990 to 2018";
    // find max and min for x axis and y axis
    let allYears = wage.map(function(datum){return datum.year});

    // let xDomain = d3.extent(allYears, function(year){ return parseInt(year) });
    let yMax = d3.max(wage, function(datum){ return formatDollar02(datum.college75) });
    let yMin = d3.min(wage, function(datum){ return formatDollar02(datum.highSchoolMid) });
    let yDomain = [0, yMax + 10000];
    // console.log(xDomain, yDomain);

    // update xScale and yScale
    xScale = d3.scaleBand()
        .domain(allYears)
        .range([padding, w-padding])
    ;
    yScale = d3.scaleLinear().domain(yDomain).range([h - padding, padding]);

    // draw axis
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.select(".xaxis");
    xAxisGroup.transition().duration(1000).call(xAxis);
    xAxisGroup.attr("transform", "translate(0, "+ (h-padding) +")");
    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = viz.select(".yaxis");
    yAxisGroup.transition().duration(1000).call(yAxis);
    yAxisGroup.attr("transform", "translate("+padding+",0)");
    xAxisGroup.selectAll("line").remove();
    yAxisGroup.selectAll("line").remove();
    var ticks = d3.selectAll(".tick text");
    ticks.each(function(_,i){
        d3.select(this).attr("opacity", 1);
        if(i%3 !== 0) d3.select(this).attr("opacity", 0);
    });

    drawChart("college25");
    drawChart("college75");
    drawChart("collegeMid");
    drawChart("highSchoolMid");
    function drawChart(type){
        let chartColor;
        let toSelect = "." + type + "_chart";
        // do the color here
        if (type == "college25"){ chartColor = color25; }
        if (type == "college75"){ chartColor = color75; }
        if (type == "collegeMid"){ chartColor = colorMid; }
        if (type == "highSchoolMid"){ chartColor = colorHighMid; }

        let chart = viz.select(toSelect);

        let line = d3.line()
                         .x(function(d){ return xScale( d.year )+padding*0 })
                         .y(function(d){ return yScale( formatDollar02(d[type]) ) })
        ;
        let line_sit = chart.datum(wage);
        // line_sit.select("path").attr("d", line).attr("fill", "none").attr("stroke", publicColor);
        line_sit.select(".path01").transition().attr("stroke", chartColor);
        line_sit.select(".path01").transition().duration(1000).attr("d", line).attr("opacity", 1);

        let pointsGroup = chart.selectAll(".dataPoints").data(wage);

        pointsGroup.enter().append("g")
            .attr("class", "dataPoints")
            .attr("transform", function(d){
              let x = xScale( d.year ) + padding*0;
              let y = yScale( formatDollar02(d[type]) );
              return "translate(" + x + "," + y + ")";
            })
            .append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 5)
                .attr("fill", chartColor)
                .attr("opacity", 1)
                .attr("class", "rate")
            ;
        ;

        // pointsGroup.transition().duration(1000).attr("transform", function(d){
        //       let x = xScale( d.year ) + padding*0;
        //       let y = yScale( formatDollar02(d[type]) );
        //       return "translate(" + x + "," + y + ")";
        //     })
        // ;
    }
    setTuitionRiseHover();
    updateTuitionRiseHover("college25");
    updateTuitionRiseHover("college75");
    updateTuitionRiseHover("collegeMid");
    updateTuitionRiseHover("highSchoolMid");
    function updateTuitionRiseHover(type){
        let chartColor;
        let title;
        let toSelect = "." + type + "_chart";
        // do the color here
        if (type == "college25"){ chartColor = youngColor; title = "College Q1" }
        if (type == "college75"){ chartColor = allColor; title = "College Q3" }
        if (type == "collegeMid"){ chartColor = recentColor; title = "College Q2" }
        if (type == "highSchoolMid"){ chartColor = collegeColor; title = "High School Q2" }

        // add hover event
        viz.selectAll(toSelect).selectAll(".dataPoints").selectAll(".rate")
            .on("mouseover", function(d){
                // console.log(typeKey, d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 8);
                d3.select("#hoverInfo").attr("transform", getPos(d));
                d3.select("#hoverInfo").select("#collegeType").text(function(){ return title });
                d3.select("#hoverInfo").select("#yearNumber").text(function(){ return d.year });
                d3.select("#hoverInfo").select("#yearAmount").text(function(){ return "$" + d[type] });
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0.8).attr("visibility", "visible");
            })
            .on("mouseout", function(d){
                // console.log(d);
                let element = d3.select(this); // select the element
                element.transition().duration(500).attr("r", 5);
                d3.select("#hoverInfo").transition().duration(500).attr("opacity", 0);
                d3.select("#hoverInfo").transition().delay(500).attr("visibility", "hidden");
                // d3.select("#hoverInfo").attr("transform", "translate(0,0)");
            })
        ;

        function getPos(d){
            let x = xScale( d.year ) - 60;
            let y = yScale( formatDollar02(d[type]) ) + 10;
            return "translate(" + x + "," + y + ")";
        }
    }

}

// scrolling event listener
// you might move this block into the part of your code
// in which your data is loaded/available
let previousSection;
d3.select("#scrollingWrapper").on("scroll", function(){
// window.addEventListener("scroll", function(){
  // console.log("scroll");
  // the currentBox function is imported on the
  // very fist line of this script
  // tuitionRiseChart01();
  currentBox(function(box){
    // console.log("BOX", box);
    if(box.id=="budget_chart" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 01
      budgetChart();
    }
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
    if(box.id=="job_chart_02" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 02
      jobChart02();
    }
    if(box.id=="wage_chart" && box.id!=previousSection){
      console.log("changing viz");
      // trigger a new transition
      previousSection = box.id;
      // draw rise chart 02
      wageChart();
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


// svgs
let bill500 = `
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Group-Copy">
        <rect id="Rectangle" fill="#F0EEE1" x="0" y="0" width="815" height="440"></rect>
        <rect id="Rectangle" stroke="#8C8F8C" stroke-width="41" fill="#F0EEE1" x="46.5" y="45.5" width="722" height="349"></rect>
        <path d="M26,25 L153,25 L153,52 C153,107.228475 108.228475,152 53,152 L26,152 L26,152 L26,25 Z" id="Rectangle" fill="#8C8F8C"></path>
        <path d="M662,25 L789,25 L789,52 C789,107.228475 744.228475,152 689,152 L662,152 L662,152 L662,25 Z" id="Rectangle-Copy-2" fill="#8C8F8C" transform="translate(725.500000, 88.500000) scale(-1, 1) translate(-725.500000, -88.500000) "></path>
        <path d="M26,288 L153,288 L153,315 C153,370.228475 108.228475,415 53,415 L26,415 L26,415 L26,288 Z" id="Rectangle-Copy" fill="#8C8F8C" transform="translate(89.500000, 351.500000) scale(1, -1) translate(-89.500000, -351.500000) "></path>
        <path d="M662,288 L789,288 L789,315 C789,370.228475 744.228475,415 689,415 L662,415 L662,415 L662,288 Z" id="Rectangle-Copy-3" fill="#8C8F8C" transform="translate(725.500000, 351.500000) scale(-1, -1) translate(-725.500000, -351.500000) "></path>
        <text id="500" font-family="SybariteHuge, Sybarite" font-size="180" font-weight="normal" fill="#8C8F8C">
            <tspan x="240" y="285">500</tspan>
        </text>
        <text id="500" stroke="#F0EEE1" font-family="SybariteHuge, Sybarite" font-size="180" font-weight="normal" fill="#8C8F8C">
            <tspan x="229" y="277">500</tspan>
        </text>
    </g>
</g>
`
let bill100 = `
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="Group">
        <rect id="Rectangle" fill="#F0EEE1" x="0" y="0" width="815" height="440"></rect>
        <rect id="Rectangle" stroke="#A0A4A0" stroke-width="41" fill="#F0EEE1" x="46.5" y="45.5" width="722" height="349"></rect>
        <path d="M26,25 L153,25 L153,52 C153,107.228475 108.228475,152 53,152 L26,152 L26,152 L26,25 Z" id="Rectangle" fill="#A0A4A0"></path>
        <path d="M662,25 L789,25 L789,52 C789,107.228475 744.228475,152 689,152 L662,152 L662,152 L662,25 Z" id="Rectangle-Copy-2" fill="#A0A4A0" transform="translate(725.500000, 88.500000) scale(-1, 1) translate(-725.500000, -88.500000) "></path>
        <path d="M26,288 L153,288 L153,315 C153,370.228475 108.228475,415 53,415 L26,415 L26,415 L26,288 Z" id="Rectangle-Copy" fill="#A0A4A0" transform="translate(89.500000, 351.500000) scale(1, -1) translate(-89.500000, -351.500000) "></path>
        <path d="M662,288 L789,288 L789,315 C789,370.228475 744.228475,415 689,415 L662,415 L662,415 L662,288 Z" id="Rectangle-Copy-3" fill="#A0A4A0" transform="translate(725.500000, 351.500000) scale(-1, -1) translate(-725.500000, -351.500000) "></path>
        <text id="100" font-family="SybariteHuge, Sybarite" font-size="180" font-weight="normal" fill="#A0A4A0">
            <tspan x="240" y="285">100</tspan>
        </text>
        <text id="100-copy" stroke="#F0EEE1" font-family="SybariteHuge, Sybarite" font-size="180" font-weight="normal" fill="#A0A4A0">
            <tspan x="229" y="277">100</tspan>
        </text>
    </g>
</g>`

// ----------- Questions -------------
// 1. Add transition between charts [done]
// 2. Comment to the chart [tbd]
// 3. replace dots with dollar svg [done]
// 4. show years on xaxis every other year [done]
// 5. hover covers content [done]
// 6. animation interrupted halfway
