import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import PropTypes from 'prop-types';

const illegalCharsFormat = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loggedIn: (!!this.props.user) };
        this.click = this.click.bind(this);

        this.username = React.createRef();
        this.password = React.createRef();
        this.message = React.createRef();
    }

    async click() {
        if (!this.username.current.value ||
            !this.password.current.value ||
            illegalCharsFormat.test(this.username.current.value)) return;


        const response = await fetch('http://localhost:8000/api/authenticate', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.username.current.value,
                password: this.password.current.value
            })
        });

        const data = await response.json();

        if (!data.success) {
            this.message.current.innerHTML =
                '<span style=\'color: red\'>There was an error logging you in.</span>';
        }
        else {
            this.message.current.innerHTML = '<span style=\'color: green\'>Success! Redirecting you now.</span>';

            localStorage.setItem('token', data.token);
            this.props.toggleLogin(data.user);
            this.setState({ loggedIn: true });
        }
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <div>
                <Navbar dp={this.props.user ?
                    this.props.user.dp :
                    'http://localhost:8000/account_circle.png'} />
                <div className="row center" style={{
                    position: 'absolute',
                    top: '90px',
                    width: '25%'
                }}></div>
                <div className="row" ref={this.message} style={{ marginTop: '120px' }}></div>
                <div className="row">
                    <form className="col-3 col-gap-3">
                        <div className="row">
                            <input ref={this.username} type="text" placeholder="Username" className="validate fill" />
                        </div>
                        <div className="row">
                            <input ref={this.password} type="password"
                                placeholder="Password" className="validate fill" />
                        </div>
                        <div className="row">
                            <button className="fill" onClick={this.click}>Log in</button>
                        </div>
                        <div className="row">
                            Don&rsquo;t have an account?
                            <Link to="/register">
                                {' Sign up in seconds.'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default Login;
