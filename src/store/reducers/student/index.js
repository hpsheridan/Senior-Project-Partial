const initialState = {
    error: undefined,
    loading: false,
    studentView: undefined,
};

/**
 'student' reducer manages all data relevant to the studentView object
 */

export default function student( state = initialState, action ) {
    switch ( action.type ) {
        case "FETCH_STUDENT_VIEW_BEGIN":
            return {
                ...state,
                loading: true,
                error: undefined,
                studentView: undefined
            };
        case "FETCH_STUDENT_VIEW_SUCCESS":
            return {
                ...state,
                loading: false,
                error: undefined,
                studentView: action.payload
            };
        case "FETCH_STUDENT_VIEW_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
                studentView: undefined
            };
        default:
            return state;
    }
}
