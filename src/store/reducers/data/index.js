const initialState = {
    // Terms
    loadingTerms: false,
    selectedTerm: 2187,
    termsError: undefined,
    terms: undefined,
    // Departments
    loadingDepartments: false,
    selectedDepartment: undefined,
    departmentsError: undefined,
    departments: undefined,
    // Instructors
    loadingInstructors: false,
    selectedInstructor: undefined,
    instructorsError: undefined,
    instructors: undefined,

};


/**
    'data' reducer manages default data that should be globally accessible to any view

    terms: list of all terms in database

    selectedTerm: current term all data is based from

    departments: list of all departments for a given term

    selectedDepartment: current department views will be based from

    instructors: list of all instructors for a given department and given term

    selectedInstructor: current instructor
 */

export default function scheduler( state = initialState, action ) {
    switch ( action.type ) {
        case "FETCH_TERMS_BEGIN":
            return {
                ...state,
                loadingTerms: true,
                termsError: undefined,
                terms: undefined
            };
        case "FETCH_TERMS_SUCCESS":
            return {
                ...state,
                loadingTerms: false,
                termsError: undefined,
                terms: action.payload
            };
        case "FETCH_TERMS_ERROR":
            return {
                ...state,
                loadingTerms: false,
                termsError: action.payload,
                terms: undefined
            };
        case "CHANGE_SELECTED_TERM":
            return {
                ...state,
                selectedTerm: action.payload,
            };
        case "FETCH_DEPARTMENTS_BEGIN":
            return {
                ...state,
                loadingDepartments: true,
                departmentsError: undefined,
                departments: undefined
            };
        case "FETCH_DEPARTMENTS_SUCCESS":
            return {
                ...state,
                loadingDepartments: false,
                departmentsError: undefined,
                departments: action.payload
            };
        case "FETCH_DEPARTMENTS_ERROR":
            return {
                ...state,
                loadingDepartments: false,
                departmentsError: action.payload,
                departments: undefined
            };
        case "SELECT_DEPARTMENT":
            return {
                ...state,
                selectedDepartment: action.payload
            };
        case "FETCH_INSTRUCTORS_BEGIN":
            return {
                ...state,
                loading: true,
                error: undefined,
                instructors: undefined
            };
        case "FETCH_INSTRUCTORS_SUCCESS":
            return {
                ...state,
                loadingInstructors: false,
                instructorsError: undefined,
                instructors: action.payload
            };
        case "FETCH_INSTRUCTORS_ERROR":
            return {
                ...state,
                loadingInstructors: false,
                instructorsError: action.payload,
                instructors: undefined
            };
        case "CHANGE_SELECTED_INSTRUCTOR":
            return {
                ...state,
                selectedInstructor: action.payload,
            };
        default:
            return state;
    }
}
