import React from 'react';
import testClasses from '../testfiles/testclasses.js'; 
import departmentToWeekly from "../conversions/departmentToWeekly.js";

const genHandleClick = (addClass) => {
    return () => {addClass(departmentToWeekly(testClasses));}
}

export default function ClassAdder({addClass}) {
    return (
        <div id="class-adder">
            <button onClick={genHandleClick(addClass)}>ADD CLASS</button>
        </div>
    );
}