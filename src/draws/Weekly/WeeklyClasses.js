import {generateDayToXPos, generateTimeToYPos} from "./ScaleFuncs";
import {clssIsIn, setClassID} from "./MiscFuncs";

export default class WeeklyClasses {
    constructor(columnSizes) {
        this.classes = [];
        this.timeSlots = null;
        this.columnSizes = columnSizes;
        this.curClassID = 0;
    }

    setTimeSlots(timeSlots) {
        this.timeSlots = timeSlots;
    }

    haveClass(clss) {
        return clssIsIn(clss, this.classes);
    }

    removeClass(clss) {
        for (const s of clss.sections) {
            for (const sub of s.subSections) {
                this.timeSlots.removeFromTimeSlots(sub);
            }
        }

        this.classes = this.classes.filter(c => c.name !== clss.name);

        for (let i = 0; i < this.classes.length; i++) {
            let c = this.classes[i]
            if (c.classID !== i) {
                setClassID(c, i);
            }
        }
        this.curClassID--;
    }

    addClass(clss) {
        const timeToYPos = generateTimeToYPos();
        const dayToXPos = generateDayToXPos();
        console.log("clss", clss);

        let editedSects = [];
        let sectID = 0
        for (const s of clss.sections) {
            let subSects = []

            for (const sub of s.subSections) {
                let column = this.timeSlots.updateTimeSlots(sub);
                const col_delta = day => (dayToXPos("T") - dayToXPos("M")) / this.columnSizes[day];
                subSects.push({
                    ...sub,
                    sectionID: sectID,
                    x: dayToXPos(sub.weekday) + column * col_delta(sub.weekday),
                    y: timeToYPos(sub.startTime),
                    column: column
                })
            }

            editedSects.push({
                ...s,
                sectionID: sectID,
                subSections: subSects
            });
            sectID++;
        }

        this.classes.push({
            ...clss,
            sections: editedSects
        });

        setClassID(this.classes[this.curClassID], this.curClassID);
        this.curClassID++;

        console.log("classes: ", this.classes);
    }
}