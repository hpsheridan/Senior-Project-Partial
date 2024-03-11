/**
 * DepartmentView Actions
 * */

export const fetchDepartmentViewBegin = () => ( {
    type: "FETCH_DEPARTMENT_VIEW_BEGIN"
} );


export const fetchDepartmentViewSuccess = ( data ) => ( {
    type: "FETCH_DEPARTMENT_VIEW_SUCCESS",
    payload: data
} );

export const fetchDepartmentViewError = ( error ) => ( {
    type: "FETCH_DEPARTMENT_VIEW_ERROR",
    payload: error
} );

export const updateMeetingPattern = (clss) => {
    return {
        type: "UPDATE_MEETING_PATTERN",
        payload: clss
    }
};