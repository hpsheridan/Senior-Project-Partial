import React, { useEffect } from 'react';
import styled from "styled-components/macro";
import SceneSwitcher from "../store/containers/SceneSwitcher.js";



// Simple full page div
const BodyContainer = styled.div`
  width: 100vw;
  height: 100%;
  background: aliceblue;
`;

// Department name that you can select
const DepartmentItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0 1em;
  height: 2em;
  cursor: pointer;
  &:hover {
    background: #555;
    color: white;
  }
`;


/**
 *  Test UI that allows you to select a new department and updates Redux
 *  Purpose is to be able to check if departmentView, schedulerView, and studentView are updated
 * @param selectDepartment: redux action to select new department
 * @param departmentNames: array of department names to select from
 * @param schedulerView
 * @param departmentView
 * @param studentView
 * @param selectedDepartment
 */


let departmentSelected = false;
export default function ReduxTest(
    {
        selectDepartment,
        departmentNames,
        schedulerView,
        departmentView,
        studentView
    } ) {



    // Handle a click on a specific department
    function departmentClick( name ) {
        console.log( 'selected department: ', name );
        selectDepartment( name ); // Changes selectedDepartment in store
    }


    // Log changes in views to the console
    useEffect( () => {
        if ( departmentView ) {
            console.log(departmentView);
            departmentSelected = true;
        }
    }, [ departmentView ] );
    useEffect( () => {
        if ( studentView ) console.log( studentView );
    }, [ studentView ] );
    useEffect( () => {
        if ( schedulerView ) console.log( schedulerView );
    }, [ schedulerView ] );



    if(departmentSelected === false){


        return (
            <BodyContainer>
                {
                    departmentNames ? departmentNames.map(name => (
                        <DepartmentItem key={name} onClick={() => departmentClick(name)}>
                            {name}
                        </DepartmentItem>
                    )) : undefined
                }
            </BodyContainer>
        );

    }
    else {
        return(
                <>
                    <SceneSwitcher />
                </>
            );
    }
}


