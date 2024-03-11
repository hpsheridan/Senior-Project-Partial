import React, { useEffect } from 'react';




/**
 * Default Data Wrapper
 * Wrapper function to allow for background redux functionality
 * Fetches list of terms and departments on component mounting
 * Listens to changes in selectedTerm and updates list of departments
 * @param fetchTerms: function to fetch terms list from API
 * @param selectedTerm: object within redux holding current selected term
 * @param fetchDepartments: function to fetch list of departments
 * @param children: renders either child components or returns react fragment if there are no children
 */

export default function DefaultDataWrapper(
    {
        fetchTerms,
        selectedTerm,
        fetchDepartments,
        children
    } ) {


    useEffect( () => {
        console.log( "fetching terms..." );
        fetchTerms();
    }, [ fetchTerms ] );

    useEffect( () => {
        console.log( "fetching departments..." );
        fetchDepartments( selectedTerm );
    }, [ selectedTerm, fetchDepartments ] );

    return children ? children : <></>;

}
