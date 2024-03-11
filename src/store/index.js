import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from 'redux-thunk';

// Reducers
import scheduler from "./reducers/schedulerview";
import data from "./reducers/data"
import department from './reducers/department'
import student from './reducers/student'
import scheduleReducer from './reducers/schedule';
import sceneReducer from './reducers/scenes';
import dragReducer from './reducers/drag';
import treeReducer from './reducers/tree'



// rootReducer combines all of the separate reducers and maps them to whatever key you desire
const rootReducer = combineReducers(
    {
        // Place reducers as they are created
        data: data, // Contains globally used data
        scheduler: scheduler, // Contains data used by schedulerView
        department: department, // Contains data used by departmentView
        student: student, // Contains data used by studentView
        schedule: scheduleReducer, //The one I'm using for weeklyview
        scene: sceneReducer,
        drag: dragReducer,
        tree: treeReducer
    }
);

// configure store connects the Thunks and Redux to be used as reducer actions and
// creates a single reducer from the combined reducers function
export default function configureStore() {
    // Array of any middleware to be used by Redux
    const middleware = [ thunkMiddleware ];
    const middlewareEnhancer = applyMiddleware( ...middleware );
    return createStore( rootReducer, middlewareEnhancer );
}
