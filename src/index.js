import '../sass/index.sass';
import ReactDOM from 'react-dom';
import React from 'react';
import {HashRouter as Router} from 'react-router-dom';
import App from '../components/App.jsx';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

ReactDOM.render(
    <Router>
        <App />
    </Router>, document.getElementById('app'));
