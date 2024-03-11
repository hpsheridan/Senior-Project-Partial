import * as d3 from 'd3';

//Should be in form: "HH:MM PP"
//Returns a function that given a time in this format returns the Y-pos to place it
function generateTimeToYPos() {
    let weekly = d3.select("#WeeklyClasses");
    let height_bottom = weekly.property("offsetHeight");

    let domain = [];

    //84 is 07:00AM represented in minutes / 5
    //265 is 10:00 PM
    for (let i = 84; i < 265; i++) {
        domain.push(i);
    }

    let scale = d3.scaleBand()
        .domain(domain)
        .range([0, height_bottom]);

    const timeStringToMinutes = (time) => {
        let hours = parseInt(time.slice(0, 2));
        let mins = parseInt(time.slice(3, 5));
        if (hours === 12) {hours = 0;}
        if (time.slice(6, 8) === "PM") {hours += 12;}
        return hours * 60 + mins;
    }

    return (time) => scale(Math.floor(timeStringToMinutes(time) / 5))
}

//Options: [M, T, W, TH, F]
//Returns a function that given a weekday returns the X-pos to place it
function generateDayToXPos() {
    let weekly = d3.select("#WeeklyClasses");
    let width_right = weekly.property("offsetWidth");

    const dayToInt = (day) => {
        switch(day) {
            case "M": return 0;
            case "T": return 1;
            case "W": return 2;
            case "TH": return 3;
            case "F": return 4;
            default: return -1;
        }
    }

    let scale = d3.scaleBand()
        .domain([0, 1, 2, 3, 4])
        .range([1, width_right - 2]);

    return day => scale(dayToInt(day));
}

export {generateDayToXPos, generateTimeToYPos};