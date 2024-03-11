import * as d3 from 'd3';
import {addMinutes} from "./MiscFuncs";

function drawSeparators(height_top, height_bottom, dayToXPos) {
    let weekly = d3.select("#WeeklySVG")
    .append("g")
    .attr("id", "lines");

    const make_line = (xPos) => {
        weekly.append("rect")
        .attr("width", 1)
        .attr("height", height_bottom - height_top)
        .attr("x", xPos)
        .attr("y", height_top);
    };

    for (const day of ["M", "T", "W", "TH", "F"]) {
        make_line(dayToXPos(day));
    }

    let bandwidth = dayToXPos("T") - dayToXPos("M");
    make_line(dayToXPos("F") + bandwidth);
}

const drawSingleTic = (x, y, t) => {
    let svg = d3.select("#tic-marks-svg");

    let g = svg.append("g")

    // Big rect with text
    if (t) {
        g.append("rect")
        .attr("x", x - 20)
        .attr("y", y)
        .attr("width", "20")
        .attr("height", ".25vh")
        .attr("style", "fill: black;");

        g.append("text")
        .attr("x", x / 2)
        .attr("y", y - 7)
        .attr("class", "svg-text")
        .attr("width", "100%")
        .attr("fill", "black")
        .attr("style", "font-size: 1.25vw;")
        .text(t);
    }
    // Small rect without text
    else {
        g.append("rect")
        .attr("x", x - 10)
        .attr("y", y)
        .attr("width", "10")
        .attr("height", ".0125vh")
        .attr("style", "fill: grey; opacity: 30%");
    }
}

function drawTicMarks(xCoord, timeToYPos) {
    d3.select("#TicMarks")
    .append("svg")
    .attr("id", "tic-marks-svg")
    .attr("width", "100%")
    .attr("height", "100%");

    let t = "07:00 AM";
    while (t !== "10:00 PM") {
        t = addMinutes(t, 30);
        drawSingleTic(xCoord, timeToYPos(t), null);

        t = addMinutes(t, 30);
        drawSingleTic(xCoord, timeToYPos(t), t.slice(0, 6));
    }
}

export {drawSeparators, drawTicMarks};