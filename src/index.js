import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import AddMeetings from './Component/AddMeeting'
import Home from './Component/Home';

ReactDOM.render(
         <Router history={hashHistory}>
            <Route path="/" component={Home}></Route>
            <Route path='/add_meetings' component={AddMeetings}></Route>
         </Router>, document.getElementById('root'));