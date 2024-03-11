import React from 'react';
import WeeklyView from "../store/containers/WeeklyView";
import TreeView from "../store/containers/TreeView";
import Header from "../store/containers/Header";

export default function SceneSwitcher({currentScene}) {
    //console.log("currentScene :::", currentScene);

    return (
        <div id="cur-scene">
            {currentScene === "TREE" ? (<><Header/><TreeView /></>) : currentScene === "WEEKLY" ? (<><Header/><WeeklyView /></>) : (<><Header/><WeeklyView /></>)}

        </div>
    );
};