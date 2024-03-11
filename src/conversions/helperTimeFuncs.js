export function militaryToMinutes(time) {
    let hours = time.slice(0, 2);
    let mins = time.slice(3, 5);
    return parseInt(hours) * 60 + parseInt(mins);
}

export function hour24ToMilitary(time) {
    let hours = parseInt(time.slice(0, 2));
    let mins = parseInt(time.slice(3, 5));
    let xm = time.slice(6, 8);

    if (xm === "PM" && hours !== 12) {
        hours += 12;
    }

    if (hours < 10) {
        hours = `0${hours}`
    }

    if (mins < 10) {
        mins = `0${mins}`
    }

    return `${hours}:${mins}:00`;
}

export function militaryTo24Hour(time) {
    let minutes = militaryToMinutes(time);

    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    let xm = "AM";

    if (hours >= 12) {
        xm = "PM";
    }
    if (hours > 12) {
        hours -= 12;
    }

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (mins < 10) {
        mins = `0${mins}`;
    }

    return `${hours}:${mins} ${xm}`;
}