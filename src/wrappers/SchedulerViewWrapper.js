import React, { useEffect } from 'react';




/**
 * Scheduler View Wrapper
 * Wrapper function to allow for background redux functionality
 * Listens to selectedDepartment and selectedTerm
 * If department or term changes update schedulerView
 * @param fetchSchedulerView: function to fetch schedulerView from API
 * @param selectedTerm: object within redux holding current selected term
 * @param selectedDepartment: object within redux holding current selected department
 * @param error: any error returned from API response
 * @param children: renders either child components or returns react fragment if there are no children
 */


export default function SchedulerViewWrapper(
    {
        fetchSchedulerView,
        selectedTerm,
        selectedDepartment,
        error,
        children
    } ) {


    // Listen to selectedDepartment and fetch if it is not undefined
    useEffect( () => {
        if ( selectedDepartment && selectedTerm ) {
            console.log( "fetching schedulerView..." );
            fetchSchedulerView( selectedDepartment, selectedTerm );
        }
    }, [ selectedTerm, selectedDepartment, fetchSchedulerView ] );

    if ( error ) {
        console.log( error );
    }

    return children ? children : <></>;

}
