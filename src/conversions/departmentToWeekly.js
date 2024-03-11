import {militaryToMinutes, militaryTo24Hour} from "./helperTimeFuncs.js"

// clss[0]["combined_class_number"]
export default function departmentToWeekly(data) {
    let edit = [];
    for (const high_clss of data) {
        let name = Object.keys(high_clss)[0];
        let clss_name = name.split(/\s/)[0];


        const clss = high_clss[name];

        let edit_clss = {
            classID: -1,
            sections: [],
            name: name,
            edited: false
        };

        let components = clss[0].components;

        let doubleDISBlocker = false;

        for (const sect of clss) {
            for (const comp of components) {
                if (comp === "DIS") {
                    if (doubleDISBlocker) {
                        continue;
                    }
                    doubleDISBlocker = true;
                }

                let edit_sect = {
                    classID: -1,
                    sectionID: -1,
                    subSections: []
                };

                let mp = sect[comp].meeting_pattern[0];
                if (mp.start_time === null) {
                    continue;
                }

                let day = mp.meeting_pattern;
                let startTime = mp.start_time;
                let endTime = mp.end_time;

                let weekdays = day === "MW" ? ["M", "W"] : day === "TTH" ? ["T", "TH"] : [day];

                let subID = 0;
                for (const weekday of weekdays) {
                    let edit_subsect = {
                        classID: -1,
                        sectionID: -1,
                        subSectionID: subID,
                        startTime: militaryTo24Hour(startTime),
                        endTime: militaryTo24Hour(endTime),
                        duration: militaryToMinutes(endTime) - militaryToMinutes(startTime),
                        weekday: weekday,
                        className: clss_name,
                        data: {
                            fullName: name,
                            component: comp,
                            sectionStr: sect[comp].section,
                            class_number: sect[comp].class_number
                        }
                    };
                    edit_sect.subSections.push(edit_subsect);
                    subID++;
                }

                edit_clss.sections.push(edit_sect);
            }
        }

        edit.push(edit_clss);
    }
    return edit;
};