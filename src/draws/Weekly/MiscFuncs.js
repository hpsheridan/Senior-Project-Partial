import * as d3 from 'd3';

const getClassSelect = c => d3.select(`#class_${c.classID}`);
const getSectSelect = s => d3.select(`#section_${s.classID}_${s.sectionID}`);
const getSubsectSelect = sub => d3.select(`#subSection_${sub.classID}_${sub.sectionID}_${sub.subSectionID}`);

const clssWithName = (name, arr) => {
    for (const c of arr) {
        if (c.name === name) {
            return c;
        }
    }
    return undefined;
}

const clssIsIn = (clss, arr) => {
    for (const c of arr) {
        if (c.name === clss.name) {
            return true;
        }
    }
    return false;
}

const setClassID = (clss, id) => {
    clss.classID = id;
    for (const s of clss.sections) {
        s.classID = id;
        for (const sub of s.subSections) {
            sub.classID = id;
        }
    }
}

const addMinutes = (time, n) => {
    let hours = parseInt(time.slice(0, 2));
    let mins = parseInt(time.slice(3, 5));
    let xm = time.slice(6, 8);

    mins += n;
    while (mins >= 60) {
        mins -= 60;
        hours += 1;
    }
    if (hours >= 13) {hours -= 12}
    if (hours === 12 || (hours > 0 && hours < 7)) {xm = "PM";}

    if (mins < 10) {mins = `0${mins}`;}
    if (hours < 10) {hours = `0${hours}`;}

    return `${hours}:${mins} ${xm}`;
}

export {
    getClassSelect, getSectSelect, getSubsectSelect,
    addMinutes, clssIsIn, setClassID,
    clssWithName};