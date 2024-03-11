import React from 'react';
import "../stylesheets/scheduler.css";
import SceneSwitcher from "../store/containers/SceneSwitcher.js";

export default function WeeklySchedule() {

    return (
        <div className="WeeklySchedule">
            <SceneSwitcher />
        </div>
    );
};