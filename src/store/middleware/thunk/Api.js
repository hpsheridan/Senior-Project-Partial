import axios from "axios";




/**
 Class Api
 Helper functions for interacting with the API
 Each member function returns a promise from a specific route
 */


export default class Api {

    static api = axios.create( {
        baseURL: 'https://localhost:8080/api'
    } );

    // Returns a list of all recorded terms
    static getTerms = () =>
        this.api.get( `/terms` );

    // term: term selected by the user
    // Returns all departments for the selected term
    static getDepartments = ( term ) =>
        this.api.get( `/departments/${ term }` );

    // term: term selected by the user
    // departmentName: department name selected by user
    // Returns all instructors for a specific term and department
    static getInstructors = ( departmentName, term ) =>
        this.api.get( `/departments/${ departmentName }/${ term }/instructors` );

    // term: term selected by the user
    // departmentName: department name selected by user
    // Returns studentView object for a specific term and department
    static getStudentView = ( departmentName, term ) =>
        this.api.get( `/scheduler/${ departmentName }/${ term }` );

    // term: term selected by the user
    // departmentName: department name selected by user
    // Returns departmentView object for a specific term and department
    static getDepartmentView = ( departmentName, term ) =>
        this.api.get( `/scheduler/${ departmentName }/${ term }/departmentView` );

    // term: term selected by the user
    // departmentName: department name selected by user
    // Returns schedulerView object for a specific term and department
    static getSchedulerView = ( departmentName, term ) =>
        this.api.get( `/scheduler/${ departmentName }/${ term }/schedulerView` );
}
