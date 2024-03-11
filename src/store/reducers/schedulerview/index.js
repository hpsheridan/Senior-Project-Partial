const initialState = {
    error: undefined,
    loading: false,
    schedulerView: undefined,
};

/**
 'scheduler' reducer manages all data relevant to the schedulerView object
 */

export default function scheduler( state = initialState, action ) {
    switch ( action.type ) {
        case "FETCH_SCHEDULER_VIEW_BEGIN":
            return {
                ...state,
                loading: true,
                error: undefined,
                schedulerView: undefined
            };
        case "FETCH_SCHEDULER_VIEW_SUCCESS":
            return {
                ...state,
                loading: false,
                error: undefined,
                schedulerView: action.payload
            };
        case "FETCH_SCHEDULER_VIEW_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
                schedulerView: undefined
            };
        default:
            return state;
    }
}
