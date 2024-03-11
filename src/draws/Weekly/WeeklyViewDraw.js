import * as d3 from 'd3';
import {generateDayToXPos, generateTimeToYPos} from "./ScaleFuncs";
import {generateSectOnDrag, generateSectOnMouseOver, generateSectOnMouseOut} from "./MouseFuncs";
import {getSubsectSelect, clssIsIn, clssWithName} from "./MiscFuncs";
import {drawSeparators, drawTicMarks} from "./MiscDraws";
import {drawText, packageText} from "./TextFuncs";
import TimeSlots from "./TimeSlots";
import PositionHandler from "./PositionHandler";
import WeeklyClasses from './WeeklyClasses';

var columnSizes = {"M": 3, "T": 3, "W": 3, "TH": 3, "F": 3};

var classes = new WeeklyClasses(columnSizes);
var timeSlots = new TimeSlots(classes.classes);
var positionHandler;

classes.setTimeSlots(timeSlots);

//Classes should have a startTime, endTime, and weekday attribute
function drawWeeklyView(updateMeetingPattern) {

    const timeToYPos = generateTimeToYPos();
    const dayToXPos = generateDayToXPos();

    let bandwidth = dayToXPos("T") - dayToXPos("M");
    let timewidth = timeToYPos("07:05 AM") - timeToYPos("07:00 AM");

    let text_y_offset = 8 * timewidth;

    positionHandler = new PositionHandler(
        classes.classes,
        timeSlots,
        columnSizes,
        dayToXPos("F") + bandwidth,
        timeToYPos("10:00 PM") + timewidth,
        () => drawWeeklyView(updateMeetingPattern),
        updateMeetingPattern
    );

    const drag = generateSectOnDrag(
        sub => positionHandler.onPickup(sub),
        (sub, x, y) => positionHandler.updatePos(sub, x, y),
        sub => positionHandler.onDrop(sub)
    );

    validateColumns();

    let weekly = d3.select("#WeeklySVG");

    weekly.selectAll("*").remove();
    d3.select("#TicMarks").selectAll("*").remove();

    drawSeparators(timeToYPos("07:00 AM"), timeToYPos("10:00 PM") + timewidth, dayToXPos);
    drawTicMarks(d3.select("#TicMarks").property("offsetWidth"), timeToYPos);

    weekly
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("id", "classes")

        .selectAll("g")
        .data(classes.classes)
        .enter()
        .append("g")
        .attr("id", c => `class_${c.classID}`)

        .selectAll("g")
        .data(c => c.sections)
        .enter()
        .append("g")
        .attr("id", s => `section_${s.classID}_${s.sectionID}`)

        .selectAll("g")
        .data(s => s.subSections)
        .enter()
        .append("svg")
        .attr("class", "class-svg")
        .attr("id", sub => `subSection_${sub.classID}_${sub.sectionID}_${sub.subSectionID}`)
        .attr("width", sub => bandwidth / columnSizes[sub.weekday])
        .attr("height", sub => timeToYPos(sub.endTime) - timeToYPos(sub.startTime))
        .attr("x", sub => sub.x = dayToXPos(sub.weekday) + (bandwidth / columnSizes[sub.weekday]) * sub.column)
        .attr("y", sub => sub.y = timeToYPos(sub.startTime))
        .on("mouseover", generateSectOnMouseOver(classChangeColor))
        .on("mouseout", generateSectOnMouseOut(classChangeColor))
        .each(sub => drag(getSubsectSelect(sub)))
        .append("rect")
        .attr("width", sub => bandwidth / columnSizes[sub.weekday])
        .attr("height", sub => timeToYPos(sub.endTime) - timeToYPos(sub.startTime));

    drawText(
        [
            packageText(sub => sub.className, 1.5),
            packageText(() => "Insert Text", 1)
        ],
        sub => bandwidth / columnSizes[sub.weekday],
        text_y_offset / 2
    );
}

function validateColumns() {
    let maxCol = {"M": 2, "T": 2, "W": 2, "TH": 2, "F": 2};
    for (let c of classes.classes) {
        for (let s of c.sections) {
            for (let sub of s.subSections) {
                maxCol[sub.weekday] = sub.column > maxCol[sub.weekday] ? sub.column : maxCol[sub.weekday]
            }
        }
    }

    for (const day of ["M", "T", "W", "TH", "F"]) {
        if (maxCol[day] + 1 < columnSizes[day]) {
            console.log(`Making column size of ${day} to be ${maxCol[day] + 1}`);
            columnSizes[day] = maxCol[day] + 1;
        }
    }
}

function classChangeColor(data, color) {
    for (let s of classes.classes[data.classID].sections) {
        for (let sub of s.subSections) {
            let subSelect = getSubsectSelect(sub).select("rect");
            subSelect.attr("style", `fill: ${color};`);
        }
    }
}

function resetWeeklyView() {
    classes.classes = [];
}

function updateWeeklyClasses(clssArr) {
    console.log("Trying to update", clssArr);
    if (!clssArr) { return; }
    for (const newClss of clssArr) {
        if (!classes.haveClass(newClss)) {
            console.log("Don't have, adding", newClss);
            classes.addClass(newClss);
        }
        else if (newClss.edited) {
            console.log("Have and edited, removing and readding", newClss);
            classes.removeClass(clssWithName(newClss.name, classes.classes));
            classes.addClass(newClss);
        }
    }
    for (const curClss of classes.classes) {
        if (!clssIsIn(curClss, clssArr)) {
            console.log("Have but shouldn't, removing", curClss);
            classes.removeClass(curClss);
        }
    }
    console.log("final classes", classes.classes);
}

export {updateWeeklyClasses, resetWeeklyView, drawWeeklyView};