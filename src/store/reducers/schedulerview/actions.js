/**
 * SchedulerView Actions
 * */

export const fetchSchedulerViewBegin = () => ( {
    type: "FETCH_SCHEDULER_VIEW_BEGIN"
} );


export const fetchSchedulerViewSuccess = ( data ) => ( {
    type: "FETCH_SCHEDULER_VIEW_SUCCESS",
    payload: data
} );

export const fetchSchedulerViewError = ( error ) => ( {
    type: "FETCH_SCHEDULER_VIEW_ERROR",
    payload: error
} );
