import React, { useEffect, useLayoutEffect } from 'react';
import {updateWeeklyClasses, drawWeeklyView} from "../draws/Weekly/WeeklyViewDraw.js"

//7:00AM - 10:00PM = 180 5 minute slots
export default function WeeklyView({activeClasses, updateMeetingPattern}) {

    useEffect(() => {
        updateWeeklyClasses(activeClasses)
        drawWeeklyView(updateMeetingPattern);
    }, [activeClasses, updateMeetingPattern])

    useLayoutEffect(() => {
        window.addEventListener("resize", drawWeeklyView);
        return () => window.removeEventListener("resize", drawWeeklyView);
    }, []);

    return (
        <div className="WeeklyView">
            <div id="WeeklyClasses">
                <svg id="WeeklySVG" />
            </div>
            <div id="TicMarks">

            </div>
        </div>
    );
}