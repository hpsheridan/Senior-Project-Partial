import React, { useEffect } from 'react';




/**
 * Department View Wrapper
 * Wrapper function to allow for background redux functionality
 * Listens to selectedDepartment and selectedTerm
 * If department or term changes update departmentView
 * @param fetchDepartmentView: function to fetch departmentView from API
 * @param selectedTerm: object within redux holding current selected term
 * @param selectedDepartment: object within redux holding current selected department
 * @param error: any error returned from API response
 * @param children: renders either child components or returns react fragment if there are no children
 */

export default function DepartmentViewWrapper(
    {
        fetchDepartmentView,
        selectedTerm,
        selectedDepartment,
        error,
        children
    } ) {


    // Listen to selectedDepartment & selectedTerm and fetch if it is not undefined
    useEffect( () => {
        if ( selectedDepartment && selectedTerm ) {
            console.log( "fetching departmentView..." );
            fetchDepartmentView( selectedDepartment, selectedTerm );
        }
    }, [ selectedTerm, selectedDepartment, fetchDepartmentView ] );

    if ( error ) {
        console.log( error );
    }

    return children ? children : <></>;

}
