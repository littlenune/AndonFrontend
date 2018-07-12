import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import App from './App'
import cookieReducer from './reducers/cookieReducer'

import './index.css';
import currentRepoReducer from './reducers/currentRepoReducer';
import currentBugspotReducer from './reducers/currentBugspotReducer';
import { duplicateReducer } from './reducers/duplicateReducer';
import { complexityReducer } from './reducers/complexityReducer';
import { frequencyReducer } from './reducers/frequencyReducer';

const history = createHistory();

const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        cookie: cookieReducer,
        current_repo: currentRepoReducer,
        update_bugspot: currentBugspotReducer,
        update_duplicate: duplicateReducer,
        update_complexity: complexityReducer,
        update_frequency: frequencyReducer,
    }),
    applyMiddleware(middleware)
)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,document.getElementById('root')
);
    