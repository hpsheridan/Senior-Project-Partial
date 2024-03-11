/**
 * StudentView Actions
 */

export const fetchStudentViewBegin = () => ( {
    type: "FETCH_STUDENT_VIEW_BEGIN"
} );


export const fetchStudentViewSuccess = ( data ) => ( {
    type: "FETCH_STUDENT_VIEW_SUCCESS",
    payload: data
} );

export const fetchStudentViewError = ( error ) => ( {
    type: "FETCH_STUDENT_VIEW_ERROR",
    payload: error
} );

