import '../sass/index.sass';
import ReactDOM from 'react-dom';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import App from '../components/App.jsx';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
};
ReactDOM.render(
    <AlertProvider template={AlertTemplate} {...options}>
        <Router>
            <App />
        </Router>
    </AlertProvider>, document.getElementById('app'));
