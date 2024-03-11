import {addMinutes} from "./MiscFuncs";

const lowestOpen = (occ) => {
    let n = 0
    let bit = 1
    const maxOcc = (1 << 31);
    while (bit !== maxOcc) {
        if ((bit & occ) === 0) {
            return n;
        }
        n++;
        bit <<= 1;
    }
    return -1;
}

export default class TimeSlots {
    constructor(classes) {
        this.slots = {};
        this.classes = classes;

        let t = "07:00 AM";
        while (t !== "10:05 PM") {
            this.slots[t] = {
                "M": 0,
                "T": 0,
                "W": 0,
                "TH": 0,
                "F": 0,
            }
            t = addMinutes(t, 5);
        }
    }

    updateTimeSlots(sub) {
        console.log(this.slots);
        console.log(`Checking if ${sub.startTime} to ${sub.endTime} on ${sub.weekday} is free`);

        let avail = 0;

        let endTime = addMinutes(sub.startTime, sub.duration + 5);
        let time = sub.startTime;
        while (time !== endTime) {
            let occ = this.slots[time][sub.weekday];
            
            avail |= occ
            
            time = addMinutes(time, 5);
        }
    
        let column = lowestOpen(avail);
    
        this.addToTimeSlots(sub, column);
    
        return column;
    }
    
    addToTimeSlots(sub, column=0) {
        let endTime = addMinutes(sub.startTime, sub.duration + 5);
    
        let time = sub.startTime;
        while (time !== endTime) {
            let occ = this.slots[time][sub.weekday];
            
            occ |= (1 << column);
    
            this.slots[time][sub.weekday] = occ;
    
            time = addMinutes(time, 5);
        }
    }

    removeFromTimeSlots(sub) {
        console.log(`Removing from ${sub.startTime} to ${sub.endTime} on ${sub.weekday}`);

        let endTime = addMinutes(sub.startTime, sub.duration + 5);

        let time = sub.startTime;
        while (time !== endTime) {
            let occ = this.slots[time][sub.weekday];
        
            occ &= (~(1 << sub.column))

            this.slots[time][sub.weekday] = occ;
            
            time = addMinutes(time, 5);
        }
    }
}