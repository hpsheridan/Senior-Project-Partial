const getIndexWithSection = (arr, comp, sect) => {
    console.log(arr, comp, sect);
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (obj[comp].section === sect || comp === "DIS") {
            return i;
        }
    }
}

const initialState = {
    error: undefined,
    loading: false,
    departmentView: undefined,
};

/**
 'department' reducer manages all data relevant to the departmentView object
 */

export default function scheduler( state = initialState, action ) {
    switch ( action.type ) {
        case "FETCH_DEPARTMENT_VIEW_BEGIN":
            return {
                ...state,
                loading: true,
                error: undefined,
                departmentView: undefined
            };
        case "FETCH_DEPARTMENT_VIEW_SUCCESS":
            return {
                ...state,
                loading: false,
                error: undefined,
                departmentView: action.payload
            };
        case "FETCH_DEPARTMENT_VIEW_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
                departmentView: undefined
            };
        case "UPDATE_MEETING_PATTERN":
            let newDept = state.departmentView.departmentView;
            let newClss = newDept[action.payload.fullName];
            let index = getIndexWithSection(newClss, action.payload.component, action.payload.sectionStr);
            console.log("index in reducer", index);
            let newComp = newClss[index][action.payload.component];
            let newMeetingPattern = newComp.meeting_pattern;

            for (let i = 0; i < newMeetingPattern.length; i++) {
                newMeetingPattern[i].start_time_edited = action.payload.startTime;
                newMeetingPattern[i].end_time_edited = action.payload.endTime;
                newMeetingPattern[i].meeting_pattern_edited = action.payload.day;
            }

            newComp.meeting_pattern = newMeetingPattern;
            newClss[index][action.payload.component] = newComp;
            newDept[action.payload.fullName] = newClss;
            return {
                ...state,
                departmentView: {
                    departmentView: newDept
                }
            }
        default:
            return state;
    }
}