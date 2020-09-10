import React from 'react';
import {Switch, Route} from 'react-router-dom';
import MainPage from './MainPage.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import SettingPage from './SettingPage.jsx';
export default class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' render={props =>
                    <MainPage {...props} />
                }/>
                <Route exact path='/login' render={props =>
                    <Login {...props} />
                }/>
                <Route exact path='/register' render={props =>
                    <Register {...props} />
                }/>
                <Route exact path='/setting' render={props =>
                    <SettingPage {...props} />
                }/>
            </Switch>
        );
    }
}
