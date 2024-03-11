/**
 * Departments Actions
 */

export const fetchDepartmentsBegin = () => ( {
    type: "FETCH_DEPARTMENTS_BEGIN"
} );


export const fetchDepartmentsSuccess = ( data ) => ( {
    type: "FETCH_DEPARTMENTS_SUCCESS",
    payload: data
} );

export const fetchDepartmentsError = ( error ) => ( {
    type: "FETCH_DEPARTMENTS_ERROR",
    payload: error
} );

export const selectDepartment = ( department ) => ( {
    type: "SELECT_DEPARTMENT",
    payload: department
} );


/**
 * Terms Actions
 */

export const fetchTermsBegin = () => ( {
    type: "FETCH_TERMS_BEGIN"
} );


export const fetchTermsSuccess = ( data ) => ( {
    type: "FETCH_TERMS_SUCCESS",
    payload: data
} );

export const fetchTermsError = ( error ) => ( {
    type: "FETCH_TERMS_ERROR",
    payload: error
} );

export const changeSelectedTerm = ( term ) => ( {
    type: "CHANGE_SELECTED_TERM",
    payload: term
} );


/**
 * Instructors Actions
 */

export const fetchInstructorsBegin = () => ( {
    type: "FETCH_INSTRUCTORS_BEGIN"
} );

export const fetchInstructorsSuccess = ( data ) => ( {
    type: "FETCH_INSTRUCTORS_SUCCESS",
    payload: data
} );

export const fetchInstructorsError = ( error ) => ( {
    type: "FETCH_INSTRUCTORS_ERROR",
    payload: error
} );

export const changeSelectedInstructor = ( instructor ) => ( {
    type: "CHANGE_SELECTED_INSTRUCTOR",
    payload: instructor
} );