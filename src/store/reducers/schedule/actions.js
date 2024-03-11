/**
 * Schedule Actions
 */

function addClassToSchedule(clss) {
    return {
        type: "ADD_CLASSES_TO_SCHEDULE",
        payload: clss
    };
};


function deleteClassFromSchedule(clss, lvl) {
    return {
        type: "DELETE_CLASS_FROM_SCHEDULE",
        payload: clss,
        level: lvl
    };
};

export {addClassToSchedule, deleteClassFromSchedule};