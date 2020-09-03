import React from 'react';
import {Switch, Route} from 'react-router-dom';
import MainPage from './MainPage.jsx';

export default class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' render={props =>
                    <MainPage {...props} />
                }/>
            </Switch>
        );
    }
}
