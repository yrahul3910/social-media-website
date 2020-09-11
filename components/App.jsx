import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPage from './MainPage.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import SettingPage from './SettingPage.jsx';
import Profile from './Profile.jsx';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { user: null };
        this.toggleLogin = this.toggleLogin.bind(this);
    }

    toggleLogin(user) {
        this.setState({ user });
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' render={() => <MainPage user={this.state.user} />
                }/>
                <Route exact path='/login' render={() => <Login user={this.state.user} toggleLogin={this.toggleLogin} />
                }/>
                <Route exact path='/register' render={() => <Register user={this.state.user}
                    toggleLogin={this.toggleLogin} />
                }/>
                <Route exact path='/settings' render={props => <SettingPage {...props} />
                }/>
                <Route exact path='/profile' render={props => <Profile {...props} />
                }/>
            </Switch>
        );
    }
}
