import {
    fetchSchedulerViewBegin,
    fetchSchedulerViewSuccess,
    fetchSchedulerViewError
} from "../../reducers/schedulerview/actions";
import {
    fetchDepartmentsBegin,
    fetchDepartmentsError,
    fetchDepartmentsSuccess,
    fetchTermsBegin,
    fetchTermsError,
    fetchTermsSuccess,
    fetchInstructorsBegin,
    fetchInstructorsSuccess,
    fetchInstructorsError,
} from "../../reducers/data/actions"
import {
    fetchDepartmentViewBegin,
    fetchDepartmentViewSuccess,
    fetchDepartmentViewError,
} from "../../reducers/department/actions"
import {
    fetchStudentViewBegin,
    fetchStudentViewSuccess,
    fetchStudentViewError,
} from '../../reducers/student/actions'
import Api from "./Api";

/**
 * Redux Thunk Implementation
 * Handles all API interactions asynchronously, awaits promise and dispatches to Redux after fulfillment
 */


/**
 * fetchTerms calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'terms' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchTerms() {
    return function ( dispatch ) {
        dispatch( fetchTermsBegin() );
        return Api.getTerms()
            .then(
                response =>
                    dispatch( fetchTermsSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchTermsError( error ) )
            )
    }
}

/**
 * fetchDepartments calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'terms' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchDepartments( term ) {
    return function ( dispatch ) {
        dispatch( fetchDepartmentsBegin() );
        return Api.getDepartments( term )
            .then(
                response =>
                    dispatch( fetchDepartmentsSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchDepartmentsError( error ) )
            )
    }
}

/**
 * fetchInstructors calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'instructors' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchInstructors( departmentName, term ) {
    return function ( dispatch ) {
        dispatch( fetchInstructorsBegin() );
        return Api.getInstructors( departmentName, term )
            .then(
                response =>
                    dispatch( fetchInstructorsSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchInstructorsError( error ) )
            )
    }
}

/**
 * fetchStudentView calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'studentView' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchStudentView( departmentName, term ) {
    return function ( dispatch ) {
        dispatch( fetchStudentViewBegin() );
        return Api.getStudentView( departmentName, term )
            .then(
                response =>
                    dispatch( fetchStudentViewSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchStudentViewError( error ) )
            )
    }
}

/**
 * fetchDepartment calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'departmentView' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchDepartmentView( departmentName, term ) {
    return function ( dispatch ) {
        dispatch( fetchDepartmentViewBegin );
        return Api.getDepartmentView( departmentName, term )
            .then(
                response =>
                    dispatch( fetchDepartmentViewSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchDepartmentViewError( error ) )
            )
    }
}

/**
 * fetchSchedulerView calls begin dispatch then awaits promise, after promise fulfills either dispatch the
 * data to Redux or submit an error message
 * sets the 'schedulerView' redux field
 * @returns function(*): Q.Promise<any> promise to allow for async actions within Redux
 */
export function fetchSchedulerView( departmentName, term ) {
    return function ( dispatch ) {
        dispatch( fetchSchedulerViewBegin );
        return Api.getSchedulerView( departmentName, term )
            .then(
                response =>
                    dispatch( fetchSchedulerViewSuccess( response.data.data ) )
            ).catch(
                error =>
                    dispatch( fetchSchedulerViewError( error ) )
            )
    }
}
