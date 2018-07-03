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

const history = createHistory();

const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        cookie: cookieReducer,
        current_repo: currentRepoReducer
    }),
    applyMiddleware(middleware)
)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,document.getElementById('root')
);
    