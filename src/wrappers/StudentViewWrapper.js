import React, { useEffect } from 'react';




/**
 * Student View Wrapper
 * Wrapper function to allow for background redux functionality
 * Listens to selectedDepartment and selectedTerm
 * If department or term changes update studentView
 * @param fetchStudentView: function to fetch studentView from API
 * @param selectedTerm: object within redux holding current selected term
 * @param selectedDepartment: object within redux holding current selected department
 * @param error: any error returned from API response
 * @param children: renders either child components or returns react fragment if there are no children
 */


export default function StudentViewWrapper(
    {
        fetchStudentView,
        selectedTerm,
        selectedDepartment,
        error,
        children
    } ) {


    // Listen to selectedDepartment and fetch if it is not undefined
    useEffect( () => {
        if ( selectedDepartment && selectedTerm ) {
            console.log( "fetching studentView..." );
            fetchStudentView( selectedDepartment, selectedTerm );
        }
    }, [ selectedTerm, selectedDepartment, fetchStudentView ] );

    if ( error ) {
        console.log( error );
    }

    return children ? children : <></>;

}
