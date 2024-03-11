import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// Redux imports
import configureStore from "./store";
import { Provider } from 'react-redux';




const store = configureStore();
// store.dispatch({
//     type: "ADD_CLASS_TO_SCHEDULE",
//     payload: undefined
// });
// console.log(store.getState());

ReactDOM.render(
    <Provider store={ store }>
        <App/>
    </Provider>
    , document.getElementById( 'root' )
);

serviceWorker.unregister();
