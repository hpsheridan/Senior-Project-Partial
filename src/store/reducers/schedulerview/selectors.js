/**
 * getSchedulerViewModified
 * @param state: must receive state that contains schedulerView object
 * @returns {any}: Restructuring of the schedulerView object
 */

export const getSchedulerViewModified = ( state ) => {
    const view = state.scheduler.schedulerView;
    return (
        view ? Object
            .keys( view.schedulerView )
            .map( key => (
                { [key]: view.schedulerView[key] }
            ) ) : undefined
    )
};

