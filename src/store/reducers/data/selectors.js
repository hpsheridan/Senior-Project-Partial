/*
* Selectors
*/

/**
 * getDepartmentNames Redux accessor function
 * @param state: determined in mapStateToProps in container functions
 * @returns {any} either empty object or an array of department names from Redux
 */
export const getDepartmentNames = ( state ) => (
    state.data.departments ?
        state.data.departments.map( department => department.program_name ).sort()
        : undefined
);
