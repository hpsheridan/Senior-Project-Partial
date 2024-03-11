import {getSubsectSelect, addMinutes} from "./MiscFuncs";
import {generateDayToXPos, generateTimeToYPos} from "./ScaleFuncs";
import {hour24ToMilitary} from "../../conversions/helperTimeFuncs";

export default class PositionHandler {

    constructor(classes, timeSlots, columnSizes, maxX, maxY, rerender, updateMeetingPattern) {
        this.classes = classes;
        this.timeSlots = timeSlots;
        this.columnSizes = columnSizes;
        this.maxX = maxX;
        this.maxY = maxY;
        this.rerender = rerender;
        this.updateMeetingPattern = updateMeetingPattern;
    }

    onPickup(subSection) {
        const dayToXPos = generateDayToXPos();

        let dx = subSection.x - dayToXPos(subSection.weekday);
        console.log("sub", subSection.x, "day", dayToXPos(subSection.weekday));
        console.log("dx", dx);
        for (const sub of this.classes[subSection.classID].sections[subSection.sectionID].subSections) {
            this.timeSlots.removeFromTimeSlots(sub);

            sub.lastValidX = sub.x;
            sub.lastValidY = sub.y;
            sub.lastValidWeekday = sub.weekday;
            sub.lastValidStartTime = sub.startTime;
            sub.lastValidEndTime = sub.endTime;

            this.setPos(sub, dayToXPos(sub.weekday) + dx, null);
        }
    }

    onDrop(subSection) {
        this.snapToGrid(subSection);

        this.updateMeetingPattern({
            ...subSection.data,
            startTime: hour24ToMilitary(subSection.startTime),
            endTime: hour24ToMilitary(subSection.endTime),
            day: subSection.weekday
        });
    }

    setPos(sub, newX, newY) {
        let subSelect = getSubsectSelect(sub);

        if (newX) {
            subSelect.attr("x", newX);
            sub.x = newX;
        }
        if (newY) {
            subSelect.attr("y", newY);
            sub.y = newY;
        }
    }

    updatePos(subSection, x, y) {
        let plannedPos = []
        let blockX = false;
        let blockY = false;

        const timeToYPos = generateTimeToYPos();
        const dayToXPos = generateDayToXPos();

        let bandwidth = dayToXPos("T") - dayToXPos("M");

        for (let sub of this.classes[subSection.classID].sections[subSection.sectionID].subSections) {

            let newX = sub.x + x;
            let newY = sub.y + y;

            let length = timeToYPos(sub.endTime) - timeToYPos(sub.startTime);
            let width = bandwidth / this.columnSizes[sub.weekday];

            if (newX <= 0 || newX >= this.maxX - width) {blockX = true;}
            if (newY <= 0 || newY >= this.maxY - length) {blockY = true;}

            plannedPos.push({
                sub,
                newX,
                newY
            });
        }
        for (const {sub, newX, newY} of plannedPos) {
            this.setPos(sub, blockX ? sub.x : newX, blockY ? sub.y : newY);
        }
    }

    resetPos(sub) {
        console.log("resetting: ", sub);

        this.setPos(sub, sub.lastValidX, sub.lastValidY);
        sub.weekday = sub.lastValidWeekday;
        sub.startTime = sub.lastValidStartTime;
        sub.endTime = sub.lastValidEndTime;
        this.timeSlots.updateTimeSlots(sub);
    }

    snapToGrid(subSection) {
        const dayToXPos = generateDayToXPos();
        const bandwidth = dayToXPos("T") - dayToXPos("M");
        const snapDay = (sub, day) => {
            sub.weekday = day;
            let x = dayToXPos(day);

            let n = this.timeSlots.updateTimeSlots(sub);

            console.log("in snap", n);
            if (n === -1) {
                this.resetPos(sub);
                return;
            }

            if (n >= this.columnSizes[sub.weekday]) {
                console.log(`making colum size of ${sub.weekday} to be ${n + 1}`);
                this.columnSizes[sub.weekday] = n + 1;
            }

            x += (bandwidth / this.columnSizes[sub.weekday]) * n;

            sub.column = n;
            this.setPos(sub, x, null);
        }

        const timeToYPos = generateTimeToYPos();
        const snapTime = (sub, time) => {
            let y = timeToYPos(time);
            sub.startTime = time;
            sub.endTime = addMinutes(time, sub.duration);
            this.setPos(sub, null, y);
        }

        for (let sub of this.classes[subSection.classID].sections[subSection.sectionID].subSections) {

            //Time Snapping
            let y = sub.y;
            let lastTime = "07:00 AM";
            let time = "07:10 AM";

            while (time !== "10:00 PM") {
                if (y < timeToYPos(time)) {
                    snapTime(sub, lastTime);
                    break;
                }
                lastTime = time;
                time = addMinutes(time, 10);
            }

            //Weekday snapping
            let x = sub.x;
            let wiggleRoom = bandwidth / 8;
            if (x < dayToXPos("T") - wiggleRoom) {snapDay(sub, "M");}
            else if (x < dayToXPos("W") - wiggleRoom) {snapDay(sub, "T");}
            else if (x < dayToXPos("TH") - wiggleRoom) {snapDay(sub, "W");}
            else if (x < dayToXPos("F") - wiggleRoom) {snapDay(sub, "TH");}
            else {snapDay(sub, "F");}
        }

        this.rerender();
    }
}