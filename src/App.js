import React from 'react';
import DefaultDataWrapper from "./store/containers/DefaultDataWrapper";
import DepartmentViewWrapper from "./store/containers/DepartmentViewWrapper";
import SchedulerViewWrapper from "./store/containers/SchedulerViewWrapper";
import StudentViewWrapper from "./store/containers/StudentViewWrapper";
import ReduxTest from "./store/containers/ReduxTest";
import "./stylesheets/scheduler.css";





export default function App() {
    
    return (
        <>
            <DefaultDataWrapper/>
            <DepartmentViewWrapper/>
            <SchedulerViewWrapper/>
            <StudentViewWrapper/>
            <ReduxTest />
        </>
    );
}

