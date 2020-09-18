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

    async componentDidMount() {
        if (!localStorage.getItem('token')) return;

        const response = await fetch('/api/user/info', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem('token') })
        });
        const data = await response.json();

        if (data.success) {this.setState({ user: data.user });}
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
                <Route exact path='/settings' render={props => <SettingPage user={this.state.user} {...props} />
                }/>
                <Route exact path='/profile' render={props => <Profile user={this.state.user}
                    toggleLogin={this.toggleLogin} {...props} />
                }/>
            </Switch>
        );
    }
}
